/*!Orxata Ajax*/
/**
* 
* Version: 1.0
* Requires: jQuery v1.7+
*
* Copyright (c) Orxata Software
* Under Creative Commons License (https://creativecommons.org/licenses/by/4.0)
*
* Thanks for using! :P
*
*/


function OrxataAjax () {
	this._url = '';
  this._type = 'GET';
  this._data = {};
  this._dataSrc = '';
  this._ajax = { type: 'GET' };
}

OrxataAjax.prototype.url = function (text) {
	this._url = text;
  return this;
}

OrxataAjax.prototype.type = function (text) {
	this._type = text.toUpperCase();
  return this;
}

OrxataAjax.prototype.src = function (text) {
	this._dataSrc = text;
  return this;
}

OrxataAjax.prototype.data = function (obj) {
	this._data = obj;
  return this;
}

OrxataAjax.prototype.raw = function (_raw) {
	var raws = _raw.split(',');
	var params = [];
	var values = [];
	raws.forEach(r => {
		var raw_option = r.trim();
		var opt = raw_option.split(':');
		params.push(opt[0].trim());
		values.push(opt[1].trim());
	});
	for(var x=0; x < params.length; x++) this._ajax[params[x]] = (values[x] == "true") ? true : (values[x] == "false") ? false : values[x];
	return this;
}

OrxataAjax.prototype.get = function () {
  if(!this._url) throw Error("Url not found!");

	this._ajax.url = this._url;
	this._ajax.type = this._type;
	this._ajax.data = this._data;
	
	if(this._dataSrc) this._ajax.dataSrc = this._dataSrc;
	
	return this._ajax;
}
