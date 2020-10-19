var OrxataTableFactory = {
    makeProductionTable: function(target, ajax, columns, options, legend, onCreate, onInit) {
      return new OrxataTable(false, target, ajax, columns, options, legend, onCreate, onInit);
    },
    makeTable: function(target, ajax, columns, options, legend, onCreate, onInit) {
      return new OrxataTable(true, target, ajax, columns, options, legend, onCreate, onInit);
    },
	
  }

function OrxataTable(_verbose, _target, _ajax, _columns, _options, _legend, _onCreate, _onInit) {
    this.verbose = (_verbose) ? true : false;
    this.dataTable_target = "#" + _target;
    var tmp_table = null;
    this.createCallback = function(row, data, index) {};
    this.initCallback = function() {};
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
			if(cdf instanceof Function) {
				columnDefinition = {
                	targets: x,
                	render: null
             	};
				columnDefinition.render = cdf;
			}else{
				columnDefinition = {
                	targets: x,
                	render: function(data, type, row) {
                    	return data;
                	}
            	};
			}
            
            this.columns.push(columnItem);
            this.columnDefinitions.push(columnDefinition);
        }
    
 
    if (_onCreate) this.createCallback = _onCreate; else this.print("No onCreate callback detected.");
    if (_onInit) this.initCallback = _onInit; else this.print("No onInit callback detected.");
    if (_options) this.options = _options; else this.print("No options detected error.", 1, "NotFoundException.");
    if (_ajax) this.ajax = _ajax; else this.print("No ajax connection detected.", 1, "NotFoundException.");
	
	/*this.options.lang = {
    "decimal":        "",
    "emptyTable":     "No hay datos disponibles",
    "info":           "Mostrando _START_ a _END_ de _TOTAL_ datos",
    "infoEmpty":      "Mostrando 0 a 0 de 0 datos",
    "infoFiltered":   "(filtrado de _MAX_ total de datos)",
    "infoPostFix":    "",
    "thousands":      ",",
    "lengthMenu":     "Mostrar _MENU_",
    "loadingRecords": "Cargando...",
    "processing":     "Procesando...",
    "search":         "<i class='fa fa-search'></i>",
    "zeroRecords":    "No se han encontrado registros coincidentes con los filtros seleccionados.",
    "paginate": {
        "first":      "Primero",
        "last":       "Ultimo",
        "next":       "Siguiente",
        "previous":   "Anterior"
    },
    "aria": {
        "sortAscending":  ": activar para ordenar la columna ascendente",
        "sortDescending": ": activar para ordenar la columna descendente"
    }
};
*/

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
    } else {
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

OrxataTable.prototype.print = function (text, type, ex) {
    var t = (type) ? type : 0;
    if(this.verbose){
      switch(t){
        case 0: console.log('%c# OrxataTable:', 'background: #3f0000; color: #b678ed',"\t"+text);  break;
        case 1: console.error(text); throw new Error(ex);
        case 2: console.warn(text); break;
        case 3: console.info(text); break;
        default: console.log(text); break;
      }
    }else if(t == 1) throw new Error(ex);
  }
