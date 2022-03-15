
function plotChart() {

  const chart = new SVGchart('chart-container');

  const data = [
    ["category", "cost"],
    ["investments", 620],
    ["taxes", 80],
    ["staff", 70],
    ["housing", 400],
    ["air travel", 470],
    ["entertainment", 200],
    ["motoring", 190],
   ];

  const options = {
    title:"Budget of an International Playboy"
   }

  chart.draw(data,options);

} // plotChart function end;

window.onload = plotChart();