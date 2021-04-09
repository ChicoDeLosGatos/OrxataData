/*!Orxata Chart*/
/**
* 
* Version: 0.9
* Requires: jQuery v1.7+, ChartJS, OrxataChart_Dataset
*
* Copyright (c) Orxata Software
* Under Creative Commons License (https://creativecommons.org/licenses/by/4.0)
*
* Thanks for using! :P
*
*/

const OrxataChartFactory = {
  makeProductionChart: function(target, type, labels, datasets, options){
    return new OrxataChart(false, target, type, labels, datasets, options);
  },
  makeChart: function(target, type, labels, datasets, options){
    return new OrxataChart(true, target, type, labels, datasets, options);
  }
}

function OrxataChart(_verbose, _target, _type, _labels, _datasets, _options){
  this.verbose = (_verbose) ? true : false;
  this.target = _target;
  if(_datasets.orxataClass !== 'OCDSM') this.print("This dataset is not an OrxataChart_Dataset object. Please check the documentation for more help.", 1, "InvalidDatasetException.");
  this.element = document.getElementById(this.target).getContext('2d');
  if(this.element) this.print("Element loaded succesfully.");
  else this.print("Error loading element with ID: "+_target+".", 1, "NotFoundException.");


  this.type = _type;
  switch(this.type){
    case 'bar': this.print("A "+this.type+" chart will be drawn."); break;
    case 'radar':this.print("A "+this.type+" chart will be drawn."); break;
    case 'line': this.print("A "+this.type+" chart will be drawn."); break;
    case 'horizontalBar': this.print("A "+this.type+" chart will be drawn."); break;
    case 'pie': this.print("A "+this.type+" chart will be drawn."); break;
    case 'doughnut': this.print("A "+this.type+" chart will be drawn."); break;
    case 'polarArea':this.print("A "+this.type+" chart will be drawn."); break;
    default: this.print("This type of chart doesn't exists or is not available yet.", 1, "UnknownTypeException."); break;
  }

  this.labels = _labels;
  this.datasets = _datasets.getDataSet();
  if(!_options) this.print("The options will set by default. Check the documentation for more help.");
  this.options = (_options) ? (_options) : {
    scales: {
         yAxes: [{
             ticks: {
                 beginAtZero: true
             }
         }]
     },    
     elements: {
       rectangle: {
         borderWidth: 2,
       }
     },
     responsive: true,
     legend: {
       position: 'right',
     }
   };
  this.chart = null;
  this.print("Your chart is ready. Remember call it to draw calling the function 'drawChart' on your OrxataChart object.")
}

OrxataChart.prototype.drawChart = function () {
  if(this.chart) this.chart.destroy();
  this.chart = new Chart(this.element, {
    type: this.type,
    data: {
      labels: this.labels,
      datasets: this.datasets
    },
    options: this.options
  });
  if(this.chart) this.print("Your chart has been drawn succesfully.");
}

OrxataChart.prototype.setDataSets = function (_datasets) {
  this.datasets = _datasets.getDataSet();
  this.drawChart();
}

OrxataChart.prototype.setType = function (_type) {
  this.type = _type;
  this.drawChart();
}

OrxataChart.prototype.setLabels = function (_labels) {
  this.labels = _labels;
  this.drawChart();
}

OrxataChart.prototype.setOptions = function (_options) {
  this.options = _options;
  this.drawChart();
}

OrxataChart.prototype.destroy = function () {
  this.chart.destroy();
}

OrxataChart.prototype.getChart = function () {
  this.drawChart();
  return this.chart;
}

OrxataChart.prototype.print = function (text, type, ex) {
  var t = (type) ? type : 0;
  if(this.verbose){
    switch(t){
      case 0: console.log('%c# OrxataChart('+this.target+'):', 'background: #222; color: #bada55',"\t"+text);  break;
      case 1: console.error(text); throw new Error(ex);
      case 2: console.warn(text); break;
      case 3: console.info(text); break;
      default: console.log(text); break;
    }
  }else if(t == 1) throw new Error(ex);
}
