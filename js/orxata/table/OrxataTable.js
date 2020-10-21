/*!Orxata Table*/
/**
* 
* Version: 0.5
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
    this.columnDefinitions = [];
    this.columns = [];
    this.ajax = {};
    this.options = {};

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


    if (_onCreate) this.createCallback = _onCreate;
    else this.print("No onCreate callback detected.");
    if (_onInit) this.initCallback = _onInit;
    else this.print("No onInit callback detected.");
    if (_options) this.options = _options;
    else this.print("No options detected error.", 1, "NotFoundException.");
    if (_ajax) this.ajax = _ajax;
    else this.print("No ajax connection detected.", 1, "NotFoundException.");


    if (this.options.withKnobs == true && this.options.knob_by) {
        this.print("Knobs are active");
        var auxInitCallback = this.initCallback;
		var verb = this.verbose;
        var opts = this.options.knob_by;
        this.initCallback = function (settings, json) {
            var total_data = [];
            var knob_by = opts; //	Min: 1. Max: 2
            if(verb) console.log('%c# OrxataTable:', 'background: #3f0000; color: #b678ed', "\t" + "Knobing by: " + knob_by);
            var avadata = Object.getOwnPropertyNames(json.aoData[0]._aData).sort();

            if(verb) console.log('%c# OrxataTable:', 'background: #3f0000; color: #b678ed', "\t" + "Available data(s) for knob: ", avadata.join(", "));

            var knoba = knob_by.split(", ");
            if (knoba.length > 1) {
                json.aoData.forEach(d => total_data.push("(" + d._aData[knoba[0]] + "). " + d._aData[knoba[1]] + "."));
            }
            else {
                json.aoData.forEach(d => total_data.push(d._aData[knoba[0]] + "."));
            }
            total_data = total_data.sort();
            var result = total_data.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
            var output = Object.entries(result).map(([key, value]) => ({
                key,
                value
            }));
            var max = 0;
            output.forEach(knob => max += knob.value);

            var outputKnob = '<div id="box-knob" class="box box-solid"><div class="box-body"><div class="row">';
            output.forEach(knob => {
                outputKnob += '<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 text-center" style="height: 135px;"> <input type="text" class="knob" value="' + knob.value + '" tickColorizeValues="true" inputColor="#3C8DBC" data-min="0" data-max="' + max + '" data-width="90" data-height="90" data-fgColor="#3c8dbc" readonly /> <div class="knob-label">' + knob.key + '</div></div>';
            });
            outputKnob += '</div></div></div>';
            var currentHtml = $("#orxata-table-container").html()
            $("#orxata-table-container").html(currentHtml + outputKnob);

            $(".knob").knob();

            auxInitCallback.call(this, [settings, json]);
        }

    }

    if (this.options.withButtons == true) {
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
	

}

OrxataTable.prototype.getTable = function () {
	return this.datatable;
}

OrxataTable.prototype.draw = function () {
    this.table.draw();
}

OrxataTable.prototype.filter = function (lbl) {
    this.legend.filter(lbl);
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
