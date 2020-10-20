/*!Orxata Legend*/
/**
* 
* Version: 0.5
* Requires: jQuery v1.7+, DataTables
*
* Copyright (c) Orxata Software
* Under Creative Commons License (https://creativecommons.org/licenses/by/4.0)
*
*/

var lb0 = lb1 = lb2 = lb3 = lb4 = lb5 = lb6 = lb7 = lb8 = lb9 = true;

var OrxataLegendFactory = {
    makeProductionLegend: function(table, sections, caller, filter_function, special_funcs){
      return new OrxataLegend(false, table, sections, caller, filter_function, special_funcs);
    },
    makeLegend: function(table, sections, caller, filter_function, special_funcs){
      return new OrxataLegend(true, table, sections, caller, filter_function, special_funcs);
    }
  }

function OrxataLegend(verbose, table, sections, caller, filter_function, special_funcs) {
    this.verbose = (verbose) ? true : false;
    var u = document.location.toLocaleString().split("/");
    var iden = "-" + u[3] + "_" + u[4];
    var _target = table;
    this.table_name = _target;
  
    if (filter_function) {
        this.filter_function = filter_function;
            this.print("Filter Func:");
            this.print(filter_function.toSource());
            this.print("Filter func loaded succesfully!");
    } else {
            this.print("No filter func found. Pleas check the documentation.", 1, "NotFoundException.");
    }
    if (special_funcs) {
        this.special_funcs = special_funcs;
       
            this.print("Special Funcs:");
            this.print(special_funcs.toSource());
            this.print("Special funcs loaded succesfully!");
        
    } else {
        this.special_funcs = function(lbl) {
            var id = "#" + lbl;
            var txt = $(id)[0].firstChild.nodeValue;
            if (typeof(txt) === "object") {
                txt = $(id)[0].firstChild.firstChild.nodeValue
            }
            var action = false;
            switch (lbl) {
                case 'lbl0':
                    lb0 = !lb0;
                    action = !lb0;
                    break;
                case 'lbl1':
                    lb1 = !lb1;
                    action = !lb1;
                    break;
                case 'lbl2':
                    lb2 = !lb2;
                    action = !lb2;
                    break;
                case 'lbl3':
                    lb3 = !lb3;
                    action = !lb3;
                    break;
                case 'lbl4':
                    lb4 = !lb4;
                    action = !lb4;
                    break;
                case 'lbl5':
                    lb5 = !lb5;
                    action = !lb5;
                    break;
                case 'lbl6':
                    lb6 = !lb6;
                    action = !lb6;
                    break;
                case 'lbl7':
                    lb7 = !lb7;
                    action = !lb7;
                    break;
                case 'lbl8':
                    lb8 = !lb8;
                    action = !lb8;
                    break;
                case 'lbl9':
                    lb9 = !lb9;
                    action = !lb9;
                    break;
            }

            if (!action) {
                $('div.dataTables_scrollFoot ' + id).html(txt);
                window.sessionStorage.setItem(this.table_name + "-" + lbl + iden, 0);
            } else {
                window.sessionStorage.setItem(this.table_name + "-" + lbl + iden, 1);
                $('div.dataTables_scrollFoot ' + id).html("<strike>" + txt + "</strike>");
            }
        };
       
        this.print("No special functions found. Default functions set.");
        
    }
    $("#" + this.table_name).on('init.dt', function() {
        var footer = $("#" + _target + "_footer");
        var html = "<th scope='col' colspan='" + $("#" + _target)[0].childNodes.length + "'>";
        for (var x = 0; x < sections.length; x++) {
            html += "<span onclick='javascript:" + caller.name + "(" + x +
                ");' style='cursor:pointer;' class='unselected'><svg style='margin-left:2em; border:1px solid;' width='20' height='15'>" +
                "<rect width='300' height='100' style='fill:" + sections[x][1] + ";' /></svg> <span id='lbl" + x +
                "'>" + sections[x][0] + "</span></span>";
        }
        html += "</th>";
        footer.html(html);

        for (var x = 0; x < sections.length; x++) {
            if (window.sessionStorage.getItem(this.table_name + "-lbl" + x + iden) == 1) {
                caller(x);
            }
        }
            this.print("Legend was created succesfully.");
        
    });
}
OrxataLegend.prototype.filter = function(idx) {
    this.print("Filtering by index: "+ idx);
    var lbl = "lbl" + idx;
    this.special_funcs(lbl);
    this.filter_function(lbl);
    $('#' + this.table_name).DataTable().draw();
};


OrxataLegend.prototype.print = function (text, type, ex) {
    var t = (type) ? type : 0;
    if(this.verbose){
      switch(t){
        case 0: console.log('%c# OrxataLegend:', 'background: #002105; color: #56d854',"\t"+text);  break;
        case 1: console.error(text); throw new Error(ex);
        case 2: console.warn(text); break;
        case 3: console.info(text); break;
        default: console.log(text); break;
      }
    }else if(t == 1) throw new Error(ex);
  }
