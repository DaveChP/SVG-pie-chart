class SVGchart {

  constructor(containerElementId, chartWidth, chartHeight=(0.6*chartWidth)) {
    this.target = document.getElementById(containerElementId);
    this.SVGwidth = chartWidth;
    this.SVGheight = chartHeight;
    this.viewBoxWidth = parseInt(100*this.SVGwidth/this.SVGheight);
    this.viewBoxHeight = 100;

    this.chartRadius = 0;
    this.chartPosition = {}; // xy coordinates of chart circle centre;

    this.strokeWidth = "0.2px"; //this.setStrokeWidth();
    this.ID = this.createUniqueID();
    this.parentExists(containerElementId);
    this.svg = this.createSVGelement();
    this.categoryLabel = "";
    this.valueLabel = "";
    this.valueTotal = 0;
    this.title = "";
    this.sortFlag = 0;
    this.startOffset = Math.PI/2;
    this.colors = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00', '#b8,2e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574ab', '#3b3eac', '#b77322'];


  } // end constructor;

  parentExists = function(id) {
    if (this.target) {
      console.log(`target element with id "${id}" found`);
      console.log(`target element object successfully referenced`);
    } else {
      console.log(`Error: SVGhart object requires an existing parent element ID to instantiate. No element with ID ${id} was found in the html`);
    } // end if/else block;
  } // end parentExists method;

/* setStrokeWidth possibly redundant
  setStrokeWidth = function() {
  return (this.viewBoxheight < this.svgHeight) ? `${this.viewBoxHeight/this.SVGheight/5}px` : `${this.SVGheight/this.viewBoxHeight/5}px`   
  }
*/

  draw = function(data,prefs={},) {
  console.log(`svg element created`);
  console.log(this.svg);
  console.log(this.ID);
  console.log(data);

  this.parsePrefs(prefs);
  
  this.setRadius();
  this.setPosition();
  this.assembleTitleSVG();

  /* operations on data array */
  this.setDataLabels(data);
  this.setValueTotal(data);
  this.appendAngularProportions(data);
  this.orderData(data);
  this.addCoordinates(data);
  this.addPathDefinitions(data);
  this.assembleChartSVG(data);
  /* data array mutations complete */

  console.log("data after processing:", data)
  console.log(`extracted values ${this.categoryLabel} and ${this.valueLabel}`);
  console.log(`value total: ${this.valueTotal}`);
  console.log(`chart title: ${this.title}, sort flag: ${this.sortFlag}, offset flag: ${this.startOffset}`);
  console.log(this.colors);
  console.log(this.svg)

  this.target.appendChild(this.svg)
  } // end draw function;


createSVGelement() {
// returns empty svg element object;
// complete with attributes to specify a square image sized to user units 500x500;
// equivalent to (html): <svg version="1.1" width="1000" height="1000" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>; 

const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
// const svgElement = document.createElement('svg');
svgElement.setAttribute("id", this.ID);
svgElement.setAttribute("version", "1.1");
svgElement.setAttribute("width", this.SVGwidth);
svgElement.setAttribute("height", this.SVGheight); // aspect ratio=1 set in constructor;
svgElement.setAttribute("viewBox", `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`);
svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

return svgElement; // object;

} // end createSVGelement method;

createUniqueID(){
// function returns a unique string formed from a timestamp;
// string made exclusively of letters and digits:
// digit as first character is permitted in html5;
// currently 8 characters long, will take >1,000 years to grow to 10 chars;

return new Date().getTime().toString(36);

} // end createUniqueID method;

setDataLabels(data) {
// function mutates argument array at call;
// extract labels from index 0 and remove;
this.categoryLabel = data[0][0];
this.valueLabel = data.shift()[1];
} // end setDataLabels method;


setValueTotal(data) {
// set total by summing element[1] of all inner elements;
this.valueTotal = data.map(element => element[1]).reduce((a,b)=> a + b);
} // end setValueSum method

appendAngularProportions(data) {
// mutates data array
// adds element containing radian sweep for each value to each inner array;
  data.forEach((element, index) =>{
  element.push(element[1]*2*Math.PI/this.valueTotal);
  }); // end data.forEach new element;
} // end appendAngularProportions(data);

parsePrefs(prefs) {
// prefs is object argument sent from user call via draw();
this.title = prefs.title  ? prefs.title : "" ;
this.sortFlag = Number.isInteger(parseInt(prefs.sort)) ? parseInt(prefs.sort) : 0;
this.startOffset = Number.isInteger(parseInt(prefs.degreesOffsetFromTop)) ?  ((-2*Math.PI*prefs.degreesOffsetFromTop/360)+Math.PI/2)%(2*Math.PI) : Math.PI/2;

if (Array.isArray(prefs.colors)) this.colors = prefs.colors;
console.log(`color preference array check: ${Array.isArray(prefs.colors)}`)

} // end parsePrefs method;

setRadius() {
  if (this.title.length>0) {
    this.chartRadius = this.viewBoxHeight*0.43; // allow space for title and border;
  } else {
    this.chartRadius = this.viewBoxHeight/2 -1; // allow space for border;
  } // end if;
} // end setRadius method;

setPosition() {
// centre coordinates for circle;
  this.chartPosition = {x: this.chartRadius +1 , y: (this.viewBoxHeight - this.chartRadius -1)};
} // end setPosition method;

orderData(data) {
// mutates data array. Call only after parsePrefs has executed to reset sortFlag if user sent flag;
// order according to user flag assigned to global sortFlag;
if (this.sortFlag != 0) data.sort((a,b) => b[2]-a[2]);
if (this.sortFlag < 0) data.reverse();
} // end orderData method;

addCoordinates(data) {
// adds an element to each inner array containing an object with x and y properties set to Cartesian coordinates of
// points on the circle circumference representing the start and end positions of segments
// the first segment begins at the offset position and extends to the radian sweep held in element [2]

let radius = this.chartRadius;
let cx = this.chartPosition.x;
let cy = this.chartPosition.y;
let offset = this.startOffset;

  data.forEach(element => {
    element.push({
      x1: cx+radius*Math.cos(offset),
      y1: cy-radius*Math.sin(offset),
      x2: cx+radius*Math.cos(offset-element[2]),
      y2: cy-radius*Math.sin(offset-element[2])
      });
    offset -= element[2];
  }) // next element;
} // end addCoordinates method;

addPathDefinitions(data) {
// adds an element to each data inner array containing a string path definition for the segment;
let radius = this.chartRadius;
let cx = this.chartPosition.x;
let cy = this.chartPosition.y;
let arcFlag = 0;

  data.forEach(element => {
    arcFlag = element[2] <= Math.PI ? "0" : "1";
    element.push(`M ${cx} ${cy} L ${element[3].x1} ${element[3].y1} A ${radius} ${radius} 0 ${arcFlag} 1 ${element[3].x2} ${element[3].y2} L ${cx} ${cy}`);
  }); // next element;
} // end addPathDefinitions method;

assembleTitleSVG() {
  if (this.title.length>0) {
//<text x="0" y="50" font-family="Verdana" font-size="35" fill="blue">Hello</text>;
    const lineHeight = this.viewBoxHeight*0.07 ; 
    const titleTextElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    titleTextElement.setAttribute("x", "1");
    titleTextElement.setAttribute("y", lineHeight);
    titleTextElement.setAttribute("id", "title-text");
    titleTextElement.setAttribute("font-family", "Arial");
    titleTextElement.setAttribute("font-size", lineHeight);
    titleTextElement.setAttribute("fill", "black");
    titleTextElement.setAttribute("font-weight", "normal");
    titleTextElement.innerHTML = this.title;
    this.svg.appendChild(titleTextElement);
  } // end if;
} // end assembleTitleSVG method;

assembleChartSVG(data) {

  data.forEach((element, index) => {
  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  //const pathElement = document.createElement('path');
  pathElement.setAttribute("id", `${element[0].replace(/ /g, '-')}-${index}`);
  pathElement.setAttribute("fill", this.colors[index%this.colors.length]);
  pathElement.setAttribute("stroke", "black");
  pathElement.setAttribute("stroke-width", this.strokeWidth); // 
  // pathElement.setAttribute("fill-rule", "evenodd"); 
  pathElement.setAttribute("d", element[4]);
  this.svg.appendChild(pathElement);  
  });
} // end assembleChartSVG method;




} // end svg class;