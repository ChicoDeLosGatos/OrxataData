/*!Orxata Chart*/
/**
* 
* Version: 0.9
* Requires: jQuery v1.7+, ChartJS
*
* Copyright (c) Orxata Software
* Under Creative Commons License (https://creativecommons.org/licenses/by/4.0)
*
* Thanks for using! :P
*
*/

function OrxataChart_Dataset(_label_array, _data_array, _rgba_color_array){
  this.label = (_label_array) ? _label_array : null;
  this.data =  (_data_array) ? _data_array : null;
	this.backgroundColor = [];
  this.borderColor = [];
	if(_rgba_color_array){
		_rgba_color_array.forEach(c => {
			this.backgroundColor.push('rgba('+c+', 0.2)');
			this.borderColor.push('rgba('+c+', 1)');

		});
	}
  this.dataSet = [];
  this.orxataClass = "OCDSM";
  for(var x = 0; x < this.data.length; x++)
  {
    var item = {
      label: this.label[x],
      data: this.data[x],
      backgroundColor: this.backgroundColor[x],
      borderColor: this.borderColor[x],
      borderWidth: 1
    }
    this.dataSet.push(item);
  }
}

OrxataChart_Dataset.prototype.addItem = function (_label, _data, _color) {
  var item = {
      label: _label,
      data: _data,
      backgroundColor: 'rgba('+_color+', 0.2)',
      borderColor: 'rgba('+_color+', 1)',
      borderWidth: 1
    };
    this.dataSet.push(item);
}

OrxataChart_Dataset.prototype.removeItem = function (_label) {
  var aux = this.dataSet;
  this.dataSet = [];
  aux.forEach(ds => {
    if(!ds.label == _label) this.dataSet.push(ds);
  });
}

OrxataChart_Dataset.prototype.getDataSet = function () {
  return this.dataSet;
}
