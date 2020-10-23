/*!Orxata Table*/
/**
 * 
 * Version: 0.8
 * Requires: jQuery v1.7+, jQuery Knob, DataTables, OrxataLegend
 *
 * Copyright (c) Orxata Software
 * Under Creative Commons License (https://creativecommons.org/licenses/by/4.0)
 *
 * Thanks for using! :P
 *
 */
var OrxataTableFactory = {
    prepareTable: function (identificator, fields) {
        var container = $("#orxata-table-container");
        var outputHtml = '<table id="' + identificator + '" class="table row-border compact" width="100%" cellspacing="0"><thead><tr>';
        fields.forEach(name => outputHtml += '<th>' + name + '</th>');
        outputHtml += '</tr></thead><tbody></tbody><tfoot id ="' + identificator + '_footer"></tfoot></table>';
        container.html(outputHtml);
    },
    makeProductionTable: function (target, ajax, columns, options, legend, onCreate, onInit) {
        return new OrxataTable(false, target, ajax, columns, options, legend, onCreate, onInit);
    },
    makeTable: function (target, ajax, columns, options, legend, onCreate, onInit) {
        return new OrxataTable(true, target, ajax, columns, options, legend, onCreate, onInit);
    },

}

function OrxataTable(_verbose, _target, _ajax, _columns, _options, _legend, _onCreate, _onInit) {
    this.verbose = (_verbose) ? true : false;
    this.dataTable_target = "#" + _target;
    var tmp_table = null;
    this.createCallback = function (row, data, index) {};
    this.initCallback = function () {};
    this.searchCallback = function () {};
    this.columnDefinitions = [];
    this.columns = [];
    this.ajax = {};
    this.options = {};
    this.settings = {};

    for (var x = 0; x < _columns.length; x++) {
        var item = _columns[x];
        var columnItem = {
            data: item[0]
        };
        var cdf = item[1];
        var columnDefinition = null;
        if (cdf instanceof Function) {
            columnDefinition = {
                targets: x,
                render: null
            };
            columnDefinition.render = cdf;
        }
        else {
            columnDefinition = {
                targets: x,
                render: function (data, type, row) {
                    return data;
                }
            };
        }

        this.columns.push(columnItem);
        this.columnDefinitions.push(columnDefinition);
    }
    var _aux_opt = _options;


    if (_onCreate) this.createCallback = _onCreate;
    else this.print("No onCreate callback detected.");
    if (_onInit) this.initCallback = _onInit;
    else this.print("No onInit callback detected.");
    if (_options) {
        if (_options.withButtons) {
            this.settings.withButtons = true;
            delete _aux_opt["withButtons"];
        }
        if (_options.withKnobs) {
            this.print("Found knobs");
            this.settings.withKnobs = true;
            this.settings.knob_by = _options.knob_by;
            delete _aux_opt["withKnobs"];
            delete _aux_opt["knob_by"];
        }
        this.options = _aux_opt;


    }
    else this.print("No options detected error.", 1, "NotFoundException.");
    if (_ajax) this.ajax = _ajax;
    else this.print("No ajax connection detected.", 1, "NotFoundException.");


    if (this.settings.withKnobs == true && this.settings.knob_by) {

        var auxInitCallback = this.initCallback;
        var auxSearchCallback = this.searchCallback;
        var verb = this.verbose;
        var opts = this.settings.knob_by;
        var ctx = this;
        this.initCallback = function (settings, json) {
            var outputKnob = '<div id="box-knob" class="box box-solid"><div class="box-body"><div class="row" id="orxata-table-knobs">';
            outputKnob += '</div></div></div>';
            $("#orxata-table-container").append(outputKnob);

            ctx.makeKnobs();

            auxInitCallback.call(this, [settings, json]);
        };

        this.searchCallback = function () {
            ctx.makeKnobs();
            auxSearchCallback.call();
        }

    }

    if (this.settings.withButtons == true) {
        this.print("Data export buttons will be added to the table.");
        tmp_table = $(this.dataTable_target).DataTable({
            scrollY: this.options.scrollY,
            scrollCollapse: this.options.scrollCollapse,
            pageLength: this.options.pageLength,
            language: this.options.language,
            ajax: this.ajax,
            order: this.options.order,
            columns: this.columns,
            columnDefs: this.columnDefinitions,
            createdRow: this.createCallback,
            dom: 'Blfrtip',
            buttons: [{
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'csvHtml5',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
            ]

        });
    }
    else {
        this.print("Data export buttons will NOT be added to the table.");

        tmp_table = $(this.dataTable_target).DataTable({
            scrollY: this.options.scrollY,
            scrollCollapse: this.options.scrollCollapse,
            pageLength: this.options.pageLength,
            language: this.options.language,
            ajax: this.ajax,
            order: this.options.order,
            columns: this.columns,
            columnDefs: this.columnDefinitions,
            createdRow: this.createCallback,
        });
    }

    this.table = tmp_table;
    this.legend = _legend;



    $(this.dataTable_target).on('init.dt', this.initCallback);
    $(this.dataTable_target).on('search.dt', this.searchCallback);

}


OrxataTable.prototype.makeKnobs = function () {
	if (this.table.rows().data()[0] != undefined){
		var data = this.table.rows({
			search: 'applied'
		}).data().toArray();
		
		if(data && data != undefined && data.length > 0){
			var total_data = [];
			var knob_by = this.settings.knob_by; //	Min: 1. Max: 2
			this.print("Knobing by: " + knob_by);
			var avadata = Object.getOwnPropertyNames(data[0]).sort();

			this.print(avadata.join(", "));

			var knoba = knob_by.split(", ");



			if (knoba.length > 1) {
				var subknoba_0 = knoba[0];
				var subknoba_1 = knoba[1];
				var _subknoba_0 = subknoba_0.split(".");
				var _subknoba_1 = subknoba_1.split(".");

				data.forEach(d => {
					if (_subknoba_0.length > 1 && _subknoba_1.length > 1) {
						total_data.push("(" + d[_subknoba_0[0]][_subknoba_0[1]] + "). " + d[_subknoba_1[0]][_subknoba_1[1]] + ".");
					}
					else if (_subknoba_0.length > 1) {
						total_data.push("(" + d[_subknoba_0[0]][_subknoba_0[1]] + "). " + d[subknoba_1] + ".");
					}
					else if (_subknoba_1.length > 1) {
						total_data.push("(" + d[subknoba_0] + "). " + d[_subknoba_1[0]][_subknoba_1[1]] + ".");
					}
					else {
						total_data.push("(" + d[subknoba_0] + "). " + d[subknoba_1] + ".");
					}
				});
			}
			else {
				var subknoba_0 = knoba[0];
				var _subknoba_0 = subknoba_0.split(".");
				data.forEach(d => {
					if (_subknoba_0.length > 1) {
						total_data.push(d[_subknoba_0[0]][_subknoba_0[1]] + ".");

					}
					else {
						total_data.push(d[subknoba_0] + ".");

					}

				});
			}
			total_data = total_data.sort();

			var result = total_data.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
			var output = Object.entries(result).map(([key, value]) => ({
				key,
				value
			}));


			var max = 0;
			output.forEach(knob => max += knob.value);

			var outputKnob = '';
			output.forEach(knob => {
				outputKnob += '<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 text-center" style="height: 135px;"> <input type="text" class="knob" value="' + knob.value + '" tickColorizeValues="true" inputColor="#3C8DBC" data-min="0" data-max="' + max + '" data-width="90" data-height="90" data-fgColor="#3c8dbc" readonly /> <div class="knob-label">' + knob.key + '</div></div>';
			});

			$("#orxata-table-knobs").html(outputKnob);
			$(".knob").knob();
		}else{
			this.print("No data found with this filters.");
			$("#orxata-table-knobs").html('');

		}
	}else{
		this.print("No data found.");
					$("#orxata-table-knobs").html('');

	}
}

OrxataTable.prototype.getTable = function () {
    return this.table;
}

OrxataTable.prototype.draw = function () {
    this.table.draw();
}

OrxataTable.prototype.search = function (func) {
    $.fn.dataTable.ext.search.push(function (settings, searchData, index, rowData, counter) {
        return func(searchData, rowData);
    });
}

OrxataTable.prototype.showColumns = function (joined) {
    var cols = [];
    this.columns.foreach(col => cols.push(col.data));
    return (joined) ? cols.join() : cols;
}

OrxataTable.prototype.showDefs = function () {
    return this.columnDefinitions;
}

OrxataTable.prototype.showCreateCallback = function () {
    return this.createCallback;
}

OrxataTable.prototype.showInitCallback = function () {
    return this.initCallback;
}

OrxataTable.prototype.showAjax = function () {
    return this.ajax;
}

OrxataTable.prototype.showOptions = function () {
    return this.options;
}

OrxataTable.prototype.setColumns = function (cols) {
    if (cols) {
        for (var x = 0; x < _columns.length; x++) {
            var item = _columns[x];
            var columnItem = {
                data: item[0]
            };
            var columnDefinition = (item[1]) ? {
                targets: x,
                render: function (data, type, row) {
                    var out = '';
                    out = item[1](data, type, row);
                    return out;
                }
            } : {
                targets: x,
                render: function (data, type, row) {

                    return data;
                }
            };

            this.columns.push(columnItem);
            this.columnDefinitions.push(columnDefinition);
        }
    }

}

OrxataTable.prototype.setCreateCallback = function (callback) {
    this.createCallback = callback;
    this.table.draw();
}

OrxataTable.prototype.setInitCallback = function (callback) {
    this.initCallback = callback;
    this.table.draw();
}

OrxataTable.prototype.setAjax = function (ajax) {
    this.ajax = ajax;
    this.table.draw();
}

OrxataTable.prototype.setAjax = function (options) {
    this.options = options;
    this.table.draw();
}

OrxataTable.prototype.print = function (text, type, ex) {
    var t = (type) ? type : 0;
    if (this.verbose) {
        switch (t) {
        case 0:
            console.log('%c# OrxataTable:', 'background: #3f0000; color: #b678ed', "\t" + text);
            break;
        case 1:
            console.error(text);
            throw new Error(ex);
        case 2:
            console.warn(text);
            break;
        case 3:
            console.info(text);
            break;
        default:
            console.log(text);
            break;
        }
    }
    else if (t == 1) throw new Error(ex);
}
