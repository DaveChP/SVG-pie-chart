
window.onload = function() {

// create new chart object
  const chart = new SVGchart('chart-container', 500);
// build array of category/value arrays;
  const data = [
    ["category", "cost"],
    ["rent", 500],
    ["local taxes", 100],
    ["media subs", 70],
    ["heating", 90],
    ["electricity", 68],
    ["food", 200],
    ["transport", 190],
    ["other", 230]
   ];

const options = {title:'Living Costs', degreesOffsetFromTop:-90, sort:-2 };

  chart.draw(data,options);



} // windowload wrapper;