function OrxataTable(_target, _ajax, _columns, _options, _legend, _onCreate, _onInit) {
    this.dataTable_target = "#" + _target;
    var tmp_table = null;
    this.createCallback = function(row, data, index) {};
    this.initCallback = function() {};
    this.columnDefinitions = [];
    this.columns = [];
    this.ajax = {};
    this.options = {};

    if (_columns) {
        for (var x = 0; x < _columns.length; x++) {
            var item = _columns[x];
            var columnItem = {
                data: item[0]
            };
            var columnDefinition = (item[1]) ? {
                targets: x,
                render: function(data, type, row) {
                    var out = '';
                    out = item[1](data, type, row);
                    return out;
                }
            } : {
                targets: x,
                render: function(data, type, row) {

                    return data;
                }
            };

            this.columns.push(columnItem);
            this.columnDefinitions.push(columnDefinition);
        }
    }
 
    if (_onCreate) this.createCallback = _onCreate;
    if (_onInit) this.initCallback = _onInit;
    if (_options) this.options = _options;
    if (_ajax) this.ajax = _ajax;


    if (this.options.withButtons == true) {
        tmp_table = $(this.dataTable_target).DataTable({
            scrollY: this.options.scrollY,
            scrollCollapse: this.options.scrollCollapse,
            pageLength: this.options.pageLength,
            language: this.options.lang,
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
    } else {
        tmp_table = $(this.dataTable_target).DataTable({
            scrollY: this.options.scrollY,
            scrollCollapse: this.options.scrollCollapse,
            pageLength: this.options.pageLength,
            language: this.options.lang,
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

OrxataTable.prototype.draw = function() {
    this.table.draw();
}

OrxataTable.prototype.filter = function(lbl) {
    this.legend.filter(lbl);
}

OrxataTable.prototype.showColumns = function(joined) {
    var cols = [];
    this.columns.foreach(col => cols.push(col.data));
    return (joined) ? cols.join() : cols;
}

OrxataTable.prototype.showDefs = function() {
    return this.columnDefinitions;
}

OrxataTable.prototype.showCreateCallback = function() {
    return this.createCallback;
}

OrxataTable.prototype.showInitCallback = function() {
    return this.initCallback;
}

OrxataTable.prototype.showAjax = function() {
    return this.ajax;
}

OrxataTable.prototype.showOptions = function() {
    return this.options;
}

OrxataTable.prototype.setColumns = function(cols) {
      if (cols) {
        for (var x = 0; x < _columns.length; x++) {
            var item = _columns[x];
            var columnItem = {
                data: item[0]
            };
            var columnDefinition = (item[1]) ? {
                targets: x,
                render: function(data, type, row) {
                    var out = '';
                    out = item[1](data, type, row);
                    return out;
                }
            } : {
                targets: x,
                render: function(data, type, row) {

                    return data;
                }
            };

            this.columns.push(columnItem);
            this.columnDefinitions.push(columnDefinition);
        }
    }
 
}

OrxataTable.prototype.setCreateCallback = function(callback) {
    this.createCallback = callback;
    this.table.draw();
}

OrxataTable.prototype.setInitCallback = function(callback) {
    this.initCallback = callback;
    this.table.draw();
}

OrxataTable.prototype.setAjax = function(ajax) {
    this.ajax = ajax;
    this.table.draw();
}

OrxataTable.prototype.setAjax = function(options) {
    this.options = options;
    this.table.draw();
}
