function OrxataChart(_target, _type, _labels, _datasets, _options){
  this.element = document.getElementById(_target).getContext('2d');
  this.type = _type;
  this.labels = _labels;
  this.datasets = _datasets.getDataSet();
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

