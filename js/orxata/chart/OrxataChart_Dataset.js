function OrxataChart_Dataset(_label_array, _data_array, _bgcolor_array, _color_array){
  this.label = (_label_array) ? _label_array : null;
  this.data =  (_data_array) ? _data_array : null;
  this.backgroundColor = (_bgcolor_array) ? _bgcolor_array : null;
  this.borderColor = (_color_array) ? _color_array : null;
  this.dataSet = [];
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

OrxataChart_Dataset.prototype.addItem = function (_label, _data, _bgcolor, _color) {
  var item = {
      label: _label,
      data: _data,
      backgroundColor: _bgcolor,
      borderColor: _color,
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
