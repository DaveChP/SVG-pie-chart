
window.onload = function() {

// create new chart object
  const chart = new SVGchart('chart-container', 150, 150);
// build array of category/value arrays;
  const data = [
    ["category", "cost"],
    ["rent", 500],
    ["local taxes", 100],
    ["media subs", 70],
    ["heating", 90],
    ["electricity", 700],
    ["food", 200],
    ["transport", 190],
    ["other", 230]
   ];

const colors = ["orange", "pink", "brown", "blue", "red"];

const options = {title:"My Living Costs", degreesOffsetFromTop:0, sort:0, colors: false};

  chart.draw(data,options);



} // windowload wrapper;