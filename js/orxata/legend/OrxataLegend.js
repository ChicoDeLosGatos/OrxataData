var lb0 = lb1 = lb2 = lb3 = lb4 = lb5 = lb6 = lb7 = lb8 = lb9 = true;
var verbose = false;

function OrxataLegend(table, sections, caller, filter_function, special_funcs) {
    var u = document.location.toLocaleString().split("/");
    var iden = "-" + u[3] + "_" + u[4];
    var _target = table.split(" ");
    this.table_name = _target[0];
    if (_target.length > 1) {
        for (var x = 1; x < _target.length; x++) {
            switch (_target[x]) {
                case "-v":
                    verbose = true;
                    break;
            }
        }
    }
    if (filter_function) {
        this.filter_function = filter_function;
        if (verbose) {
            console.group("Filter Func");
            console.log(filter_function.toSource());
            console.groupEnd();
            console.log("Filter func loaded succesfully!");
        }
    } else {
        if (verbose) {
            console.error("No filter func found.");
            console.warn("Legend will not work properly :(");
        }
    }
    if (special_funcs) {
        this.special_funcs = special_funcs;
        if (verbose) {
            console.group("Special Funcs");
            console.log(special_funcs.toSource());
            console.groupEnd();
            console.log("Special funcs loaded succesfully!");
        }
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
        if (verbose) {
            console.warn("No special functions found. Default functions set.");
        }
    }
    $("#" + this.table_name).on('init.dt', function() {
        var footer = $("#" + _target[0] + "_footer");
        var html = "<th scope='col' colspan='" + $("#" + _target[0])[0].childNodes.length + "'>";
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
        if (verbose) {
            console.log("Legend was created succesfully yay!!");
        }
    });
}
OrxataLegend.prototype.filter = function(idx) {
    var lbl = "lbl" + idx;
    this.special_funcs(lbl);
    this.filter_function(lbl);
    $('#' + this.table_name).DataTable().draw();
};
