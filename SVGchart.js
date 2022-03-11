class SVGchart {

  constructor(containerElementId, chartWidth) {
    this.target = document.getElementById(containerElementId);
    this.SVGwidth = chartWidth;
    this.SVGheight = chartWidth; // aspect ratio must be 1;
    this.ID = this.createUniqueID();
    this.parentExists(containerElementId);
    this.categoryLabel = "";
    this.valueLabel = "";
    this.valueTotal = 0;
  } // end constructor;

  parentExists = function(id) {
    if (this.target) {
      console.log(`target element with id "${id}" found`);
      console.log(`target element object successfully referenced`);
    } else {
      console.log(`Error: SVGhart object requires an existing parent element ID to instantiate. No element with ID ${id} was found in the html`);
    } // end if/else block;
  } // end parentExists method;

  draw = function(data) {
  const svg = this.createSVGelement()
  console.log(`svg element created`);
  console.log(svg);
  console.log(this.ID);
  console.log(data);
  // append elements to data array inner arrays to add derived data;
  this.process(data);
  console.log("data after processing:", data)
  console.log(`extracted values ${this.categoryLabel} and ${this.valueLabel}`);
  console.log(`value total: ${this.valueTotal}`);
  } // end draw function;


createSVGelement() {
// returns empty svg element object;
// complete with attributes to specify a square image sized to user units 100x100;
// equivalent to (html): <svg version="1.1" width="1000" height="1000" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>; 

const svgElement = document.createElement('svg');
svgElement.setAttribute("id", this.ID);
svgElement.setAttribute("version", "1.1");
svgElement.setAttribute("width", this.SVGwidth);
svgElement.setAttribute("height", this.SVGheight); // aspect ratio=1 set in constructor;
svgElement.setAttribute("viewBox", "0 0 100 100");
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

process(data) {
// function mutates argument array at call;

// extract labels from index 0 and remove;
this.categoryLabel = data[0][0];
this.valueLabel = data.shift()[1];
// set total by summing element[1] of all inner elements;
this.valueTotal = data.map(element => element[1]).reduce((a,b)=> a + b);
// add element containing radian sweep for each value;
  data.forEach((element, index) =>{
  element.push(element[1]*2*Math.PI/this.valueTotal);

  }); // end data.forEach new element;
}



} // end svg class;