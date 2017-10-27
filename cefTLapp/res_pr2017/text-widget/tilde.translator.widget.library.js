/* tilde.translator.widget.LIBRARY.js */

(function () {

    var fieldSelection = {
        getSelection: function () {
            var e = this.$ ? this[0] : this;
            return (
                ('selectionStart' in e && function () {
                    var l = e.selectionEnd - e.selectionStart;
                    return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) };
                }) ||
                (document.selection && function () {
                    try {
                        var r = document.selection.createRange();
                        if ($(r.parentElement()).parents('.translateContainerRight').length > 0) {
                            return { start: 0, end: e.value.length, length: 0, text: '' };
                        }

                        if (r == null) {
                            return { start: 0, end: e.value.length, length: 0 };
                        }
                        var re = e.createTextRange();
                        var rc = re.duplicate();
                        re.moveToBookmark(r.getBookmark());
                        rc.setEndPoint('EndToStart', re);
                        var s = rc.text;
                        return { start: s.replace(/\r\n/g, '\n').length, end: s.length + r.text.length, length: r.text.length, text: r.text };
                    }
                    catch (ex) {
                        if (e.length > 0) {
                            return { start: 0, end: e[0].value.length, length: 0, text: '' };
                        } else {
                            return { start: 0, end: e.value.length, length: 0, text: '' };
                        }

                    }
                }) ||

                function () {
                    return { start: 0, end: e.length, length: 0, text: '' };
                }
            )();
        },

        replaceSelection: function () {
            var e = this.$ ? this[0] : this;
            var text = arguments[0] || '';
            return (
                ('selectionStart' in e && function () {
                    e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length);
                    return this;
                }) ||
                (document.selection && function () {
                    e.focus();
                    document.selection.createRange().text = text;
                    return this;
                }) ||
                function () {
                    e.value += text;
                    return this;
                }
            )();
        }
    };

    $.each(fieldSelection, function (i) {
        $.fn[i] = this;
    });

    $.fn.addOption = function () {
        var add = function (el, v, t, sO, index) {
            var option = document.createElement("option");
            option.value = v, option.text = t;
            var o = el.options;
            var oL = o.length;
            if (!el.cache) {
                el.cache = {};
                for (var i = 0; i < oL; i++) {
                    el.cache[o[i].value] = i;
                }
            }
            if (index || index == 0) {
                var ti = option;
                for (var ii = index; ii <= oL; ii++) {
                    var tmp = el.options[ii];
                    el.options[ii] = ti;
                    o[ii] = ti;
                    el.cache[o[ii].value] = ii;
                    ti = tmp;
                }
            }

            if (typeof el.cache[v] == "undefined") el.cache[v] = oL;
            el.options[el.cache[v]] = option;
            if (sO) {
                option.selected = true;
            }
        };

        var a = arguments;
        if (a.length == 0) return this;
        var sO = true;
        var m = false;
        var items, v, t;
        if (typeof (a[0]) == "object") {
            m = true;
            items = a[0];
        }
        if (a.length >= 2) {
            if (typeof (a[1]) == "boolean") {
                sO = a[1];
                startindex = a[2];
            }
            else if (typeof (a[2]) == "boolean") {
                sO = a[2];
                startindex = a[1];
            }
            else {
                startindex = a[1];
            }
            if (!m) {
                v = a[0];
                t = a[1];
            }
        }
        this.each (
            function () {
                if (this.nodeName.toLowerCase() != "select") return;
                if (m) {
                    for (var item in items) {
                        add(this, item, items[item], sO, startindex);
                        startindex += 1;
                    }
                }
                else {
                    add(this, v, t, sO, startindex);
                }
            }
        );
        return this;
    };

    $.fn.selectOptions = function (value, clear) {
        var v = value;
        var vT = typeof (value);
        // handle arrays
        if (vT == "object" && v.constructor == Array) {
            var _this = this;
            $.each(v, function () {
                _this.selectOptions(this, clear);
            });
        }

        var c = clear || false;
        // has to be a string or regular expression (object in IE, function in Firefox)
        if (vT != "string" && vT != "function" && vT != "object") return this;
        this.each (
            function () {
                if (this.nodeName.toLowerCase() != "select") return this;
                // get options
                var o = this.options;
                // get number of options
                var oL = o.length;
                for (var i = 0; i < oL; i++) {
                    if (v.constructor == RegExp) {
                        if (o[i].value.match(v)) {
                            o[i].selected = true;
                        }
                        else if (c) {
                            o[i].selected = false;
                        }
                    }
                    else {
                        if (o[i].value == v) {
                            o[i].selected = true;
                        }
                        else if (c) {
                            o[i].selected = false;
                        }
                    }
                }
            }
        );
        return this;
    };

    $.fn.selectedValues = function () {
        var v = [];
        this.selectedOptions().each(function () { v[v.length] = this.value; });
        return v;
    };

    $.fn.selectedOptions = function () {
        return this.find("option:selected");
    };

    //http://stackoverflow.com/questions/1442542/how-can-i-get-default-font-size-in-pixels-by-using-javascript-or-jquery
    $.fn.getDefaultFontSize = function getDefaultFontSize(pa) {
        if ($.fn.defaultFontSize) {
            return $.fn.defaultFontSize;
        }

        pa = pa || document.body;
        if (!pa) {
            return null;
        }

        var who = document.createElement('span');

        who.style.cssText = 'display:inline-block; padding:0; line-height:1; position:absolute; visibility:hidden; font-size:1em';

        who.appendChild(document.createTextNode('M'));
        pa.appendChild(who);
        $.fn.defaultFontSize = [who.offsetWidth, who.offsetHeight];
        pa.removeChild(who);
        return $.fn.defaultFontSize;
    }

})();