///#source 1 1 ../../widget_core/core.resources.js
/* UI texts */

var uiResources = {
	'en': {
	    "sourceSystem":         "From",
	    "targetSystem":         "To",
	    "sourceSystemReverse":  "Reverse",
	    "translateButton":      "Translate",
	    "systemDomain":         "Domain"
	},
	'fr': {
	    "sourceSystem": 		"From",
	    "targetSystem": 		"To",
	    "sourceSystemReverse": 	"Reverse",
	    "translateButton": 		"Traduire",
	    "systemDomain": 		"Domain"
	},
	'lt': {
	    "sourceSystem": 		"Iš",
	    "targetSystem": 		"Į",
	    "sourceSystemReverse": 	"Reverse",
	    "translateButton": 		"Versti",
	    "systemDomain": 		"Domain"
	},
	'lv': {
	    "sourceSystem": 		"Tulkošanas virziens",
	    "targetSystem": 		"Uz",
	    "sourceSystemReverse": 	"Apgriezt",
	    "translateButton": 		"Tulkot",
	    "systemDomain": 		"Domēns"
	},
	'ru': {
	    "sourceSystem": 		"Направление перевода",
	    "targetSystem": 		"На",
	    "sourceSystemReverse": 	"Перевернуть",
	    "translateButton": 		"Перевести",
	    "systemDomain": 		"Тематическая область"
	}
};
///#source 1 1 ../../widget_core/tilde.translator.widget.core.js
/* tilde.translator.widget.$widget.js */

if (typeof (Tilde) === 'undefined') Tilde = {};

Tilde.TranslatorWidgetDefaultOptions = {
    _systemListUrl: 'https://hugo.lv/ws/Service.svc/json/GetSystemList',
    _jsonType: 'json', //jsonp or json
    _appId: 'unknown', //appid of widget - used to get systems and translations
    _clientId: 'u-bfcaf986-8147-4901-a131-f0d618a7354b',
    _systems: null, //configurable system list in JSON format. If contains values system list is not loaded from server but from given data
    _templateId: null,
    _replaceContainer: false, //if true then instead of putting widget inside of container div, it will be put instead of container div
    _translations: {}, //used to owerride default labels and translations
    _language: 'en', //interface language

    _systemSelectType: 'language', //system choose type: 'system', 'language', 'domain'
    _defaultSourceLang: null, //default source language (only if _systemSelectType: 'language', 'domain')
    _defaultTargetLang: null, //default target language (only if _systemSelectType: 'language', 'domain')
    _defaultDomain: null, //default domain language (only if _systemSelectType: 'domain')
    _defaultSystem: null, //default system id (only if _systemSelectType: 'language', 'system')

    _onGetSystemListError: null, //on system load ajax error callback function
    _onSystemChanged: null, //system id is changed
    _onWidgetLoaded: null //on widget fully loaded callback function
};

Tilde.TranslatorWidget = function (container, options) {
    var settings = $.extend (
        Tilde.TranslatorWidgetDefaultOptions,
        options,
        { container: $(container) }
    );

    this.initWidget(settings);
};

Tilde.TranslatorWidget.prototype = {
    $widget: null,

    //basic settings
    activeSystemId: null,
    settings: null,

    //calculated settings
    systemNames: null,
    reverseSystems: [{}],
    systemsUsed: [], 

    //fancySelect objects
    fancySource: null,
	fancyTarget: null,
    fancyDomain: null,

    initWidget: function (options) {
        $widget = this;
        $widget.settings = options;
        $widget.retrieveSystemData(function() {
            $widget.initPlugins();
        });
    },

    initPlugins: function () {
        // plugin: translatetext
        if ($widget.textPluginInit && typeof ($widget.textPluginInit) === "function") {
            $widget.textPluginInit();
        }

        // plugin: translatefile
        if ($widget.filePluginInit && typeof ($widget.filePluginInit) === "function") {
            $widget.filePluginInit();
        }
    },

    retrieveSystemData: function (cbLoaded) {
        if ($widget.settings._systems !== null) {
            $widget.systemLoadComplete($widget.settings._systems);

            if (cbLoaded && typeof (cbLoaded) === "function") {
                cbLoaded();
            }

            return;
        }

        var authHeaders = {};

        if ($widget.settings._clientId !== null) {
            authHeaders = {
                'client-id': $widget.settings._clientId
            }
        }

        $.ajax({
            dataType: $widget.settings._json_type,
            type: 'GET',
            url: $widget.settings._systemListUrl,
            headers: authHeaders,
            data: {
                appID: $widget.settings._appId,
                uiLanguageID: $widget.settings._language
            },
            success: function (data) {
                // take only running
                $widget.settings._systems = [];
                $.each(data.System, function (idx, sys) {
                    var status = $widget.getSystemMetaValue(sys.Metadata, 'status');
                    if (status === 'running') {
                        $widget.settings._systems.push(sys);
                    }
                });

                $widget.systemLoadComplete();

                if (cbLoaded && typeof (cbLoaded) === "function") {
                    cbLoaded();
                }
            },
            error: function () {
                if ($widget.settings._onGetSystemListError && typeof ($widget.settings._onGetSystemListError) === "function") {
                    $widget.settings._onGetSystemListError();
                }
            }
        });
    },

    systemLoadComplete: function () {

        $widget.initWidgetTemplate();

        switch ($widget.settings._systemSelectType) {
            case 'system':
                $('.translateSystem').addOption($widget.system_names, false);
                $('.translateSystem').selectOptions($widget.settings._system, true);
                $('.translateSystem').trigger('change');

                $('.translateSystem').bind('change', function () {
                    if ($(this).selectedValues()[0] !== null) {

                        $widget.activeSystemId = $(this).selectedValues()[0];

                        // TODO: fix reverse button show/hide logic
                        //if ($widget.settings._show_header_reverse) {
                        //    var showRev = false;
                        //    for (var sys in $widget.revers_systems) {
                        //        if (sys == $widget.settings._system) {
                        //            showRev = true;
                        //            break;
                        //        }
                        //    }
                        //    if (showRev) {
                        //        $('.translate_source_system_reverse', $widget.settings.container).removeClass('hidden');
                        //    }
                        //    else {
                        //        $('.translate_source_system_reverse', $widget.settings.container).addClass('hidden');
                        //    }
                        //}
                    }
                });

                break;
            case 'language':
                // bind source lang list
                $.each($widget.settings._systems, function (idx, sys) {
                    if ($('.translateSourceLang option[value="' + sys.SourceLanguage.Code + '"]', $widget.settings.container).length == 0) {
                        $('.translateSourceLang', $widget.settings.container).append($('<option>', {
                            value: sys.SourceLanguage.Code,
                            text: sys.SourceLanguage.Name.Text
                        }));
                    }
                });

                // if only one, replace source select with block
                if ($('.translateSourceLang option', $widget.settings.container).length === 1) {
                    var srcSelect = $('.translateSourceLang', $widget.settings.container),
                        srcVal = srcSelect.val(),
                        srcText = srcSelect.text();

                    srcSelect.replaceWith('<div class="translateSingleSourceLang" data-value="' + srcVal + '">' + srcText + '</div>');
                    $widget.loadTargetLangList(srcVal);
                }
                else {
                    // default source lang
                    if ($widget.settings._defaultSourceLang !== null) {
                        $('.translateSourceLang', $widget.settings.container).val($widget.settings._defaultSourceLang);
                    }

                    $widget.fancySource = $('.translateSourceLang', $widget.settings.container);
                    $widget.fancySource.fancySelect({
                        triggerTemplate: function (el) {
                            $widget.loadTargetLangList(el.val(), true);
                            return el.text();
                        }
                    });
                }

                // default target lang
                if ($widget.settings._defaultTargetLang !== null) {
                    $('.translateTargetLang option[lang="' + $widget.settings._defaultTargetLang + '"]', $widget.settings.container).val($widget.settings._defaultTargetLang);
                }

                $widget.fancyTarget = $('.translateTargetLang', $widget.settings.container);
                $widget.fancyTarget.fancySelect({
                    triggerTemplate: function (el) {
                        if ($widget.activeSystemId !== el.val()) {
                            $widget.activeSystemId = el.val();
                            if ($widget.settings._onSystemChanged && typeof ($widget.settings._onSystemChanged) === "function") {
                                $widget.settings._onSystemChanged($widget.activeSystemId);
                            }
                            //if (!$widget.settings._doc_translation) {
                            //    $widget.translateText(true);
                            //}
                            return el.text();
                        }
                    }
                });

                break;
            case 'domain':
                $('.translateDomainContainer', $widget.settings.container).removeClass('hide');

                // bind source lang list
                $.each($widget.settings._systems, function (idx, sys) {
                    if ($('.translateSourceLang option[value="' + sys.SourceLanguage.Code + '"]', $widget.settings.container).length == 0) {
                        $('.translateSourceLang', $widget.settings.container).append($('<option>', {
                            value: sys.SourceLanguage.Code,
                            text: sys.SourceLanguage.Name.Text
                        }));
                    }
                });

                // if only one, replace source select with block
                if ($('.translateSourceLang option', $widget.settings.container).length === 1) {
                    var srcSelect = $('.translateSourceLang', $widget.settings.container),
                        srcVal = srcSelect.val(),
                        srcText = srcSelect.text();

                    srcSelect.replaceWith('<div class="translateSingleSourceLang" data-value="' + srcVal + '">' + srcText + '</div>');
                    $widget.loadTargetLangList(srcVal);
                }
                else {
                    // default source lang
                    if ($widget.settings._defaultSourceLang !== null) {
                        $('.translateSourceLang', $widget.settings.container).val($widget.settings._defaultSourceLang);
                    }

                    $widget.fancySource = $('.translateSourceLang', $widget.settings.container);
                    $widget.fancySource.fancySelect({
                        triggerTemplate: function (el) {
                            $widget.loadTargetLangList(el.val(), false);
                            return el.text();
                        }
                    });
                }

                // default target lang
                if ($widget.settings._defaultTargetLang !== null) {
                    $('.translateTargetLang', $widget.settings.container).val($widget.settings._defaultTargetLang);
                }

                $widget.fancyTarget = $('.translateTargetLang', $widget.settings.container);
                $widget.fancyTarget.fancySelect({
                    triggerTemplate: function (el) {
                        var srcLang = $('.translateSourceLang', $widget.settings.container).val();
                        if ($('.translateSingleSourceLang', $widget.settings.container).length !== 0) {
                            srcLang = $('.translateSingleSourceLang', $widget.settings.container).attr('data-value');
                        }
                        $widget.loadDomainList(srcLang, el.val());
                        //if (!$widget.settings._doc_translation) {
                        //    $widget.translateText(true);
                        //}
                        return el.text();
                    }
                });

                // default domain
                if ($widget.settings._defaultDomain !== null) {
                    $('.translateDomain option[domain="' + $widget.settings._defaultDomain + '"]', $widget.settings.container).attr('selected', true);
                }

                // domain init fancySelect
                $widget.fancyDomain = $('.translateDomain', $widget.settings.container);
                $widget.fancyDomain.fancySelect({
                    triggerTemplate: function (el) {
                        if ($widget.activeSystemId !== el.val()) {
                            $widget.activeSystemId = el.val();
                            if ($widget.settings._onSystemChanged && typeof ($widget.settings._onSystemChanged) === "function") {
                                $widget.settings._onSystemChanged($widget.activeSystemId);
                            }

                            return el.text();
                        }
                        //if (!$widget.settings._doc_translation) {
                        //    $widget.translateText(true);
                        //} else {
                        //    $widget.setTempTextResult();
                        //}
                    }
                });

                break;
        }

        // TODO: fix reverse system logic
        //$('.translate_source_system_reverse').bind('click', $.proxy(function (e) {
        //    e.preventDefault();
        //    for (var sys in $widget.revers_systems) {
        //        if (sys == $widget.settings._system) {
        //            $('.translate_source_system').selectOptions($widget.revers_systems[sys], true);
        //            $('.translate_source_system').trigger('change');
        //            break;
        //        }
        //    }
        //}, this));
    },

    onWidgetActivated: function () {
        // resize page content for old IE
        // by calling window onresize handlers after page content is loaded
        $(document).trigger("resize");

        if ($widget.settings._onWidgetLoaded && typeof ($widget.settings._onWidgetLoaded) === "function") {
            $widget.settings._onWidgetLoaded();
        }
    },

    initWidgetTemplate: function () {
        $widget.onWidgetActivated();

        if ($widget.settings._templateId !== null || $widget.settings._templateId !== '') {
			if ($widget.settings._replaceContainer) {
				var template = $('#' + $widget.settings._templateId).html(),
					remContainer = $widget.settings.container;
				
				$(template).insertBefore($widget.settings.container);
                $widget.settings.container = $widget.settings.container.parent();
                remContainer.remove();
			}
			else {
			    $widget.settings.container.html($('#' + $widget.settings._templateId).html());
			}

			$widget.initWidgetLanguage();
            //$('.translate_text_source', $widget.settings.container).data('widget', this);
        }
    },

    initWidgetLanguage: function () {
        var core = this;

		//override or extend ui translations
		uiResources[$widget.settings._language] = $.extend(uiResources[$widget.settings._language], $widget.settings._translations[$widget.settings._language]);

		$.each(uiResources[$widget.settings._language], function (id, txt) {
            $('[data-text="' + id + '"]', $widget.settings._container).text(txt);
            $('[data-title="' + id + '"]', $widget.settings._container).attr('title', txt);
        });

        // system list sorting and localization is not needed in this case
        if ($widget.settings._systemSelectType !== 'system') {
            return;
        }

        var systems_used = $widget.systems_used;

        // get localized title & sort order
        for (var idx in systems_used) {
            var sys = systems_used[idx];
            if (typeof (sys) !== 'undefined' && sys != null) {
                for (var i in $widget.systems) {
                    if ($widget.systems[i].id == sys) {
                        $widget.systems[i].localizedTitle = $widget.systems[i]['title'].text;
                        var loc_title = $widget.get_system_meta_value($widget.systems[i], 'title_' + lang);
                        if (loc_title !== null) {
                            $widget.systems[i].localizedTitle = loc_title;
                        }
                        $widget.systems[i].order = $widget.get_system_meta_value($widget.systems[i], 'order');
                    }
                }
            }
        };

        // sort
        $widget.systems.sort(function (a, b) {
            if (typeof (a.order) !== "undefined" && a.order !== null && !isNaN(parseInt(a.order, 10))) {
                if (typeof (b.order) !== "undefined" && b.order !== null && !isNaN(parseInt(b.order, 10))) {
                    return parseInt(a.order, 10) > parseInt(b.order, 10) ? 1 : -1;
                } else {
                    return -1;
                }
            } else {
                if (typeof (b.order) !== "undefined" && b.order !== null && !isNaN(parseInt(b.order, 10))) {
                    return 1;
                } else {
                    return a.localizedTitle > b.localizedTitle ? 1 : -1;
                }
            }
        });

        // totally too much code to find first usable system in the sorted list
        if (typeof ($widget.settings._system) === 'undefined' || $widget.settings._system == null || $widget.settings._system.length == 0) {
            if ($widget.systems_used.length > 0) {
                legs:
                    for (var i in $widget.systems) {
                        for (var idx in systems_used) {
                            var sys = systems_used[idx];
                            if (typeof (sys) !== 'undefined' && sys != null) {
                                if ($widget.systems[i].id == sys) {
                                    $widget.settings._system = $widget.systems_used[idx];
                                    break legs;
                                }
                            }
                        }
                    }
            }
        }

        $widget.system_names = {};

        // fill system names in order of sorted systems, not in order of systems_used
        for (var i in $widget.systems) {
            for (var idx in systems_used) {
                var sys = systems_used[idx];
                if (typeof (sys) !== 'undefined' && sys != null) {
                    if ($widget.systems[i].id == sys) {
                        $widget.system_names[sys] = $widget.systems[i].localizedTitle;
                    }
                }
            }
        }
    },

    getSystemIds: function () {
        var idArr = [];
        for (var idx in $widget.systems) {
            idArr.push($widget.systems[idx]['id']);
        }
        return idArr;
    },

    getReverseSystems: function () {
        var reverse = [{}];
        var used = $widget.systems_used;

        for (var y in used) {
            for (var x in $widget.systems) {
                if (used[y] == $widget.systems[x]['id']) {
                    for (var z in $widget.systems) {
                        if ($widget.systems[z]['sourceLang'] == $widget.systems[x]['targetLang'] && $widget.systems[z]['targetLang'] == $widget.systems[x]['sourceLang']) {
                            for (var t in used) {
                                if (used[t] == $widget.systems[z]['id']) {
                                    reverse[used[y]] = $widget.systems[z]['id'];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        return reverse;
    },

    getSystemMetaValue: function (array, key) {
        var status = '';

        $.each(array, function (idx, item) {
            if (item.Key === key) {
                status = item.Value;
            }
        });

        return status;
    },

    disableTranslation: function () {
        $('.translateButton').attr('data-disabled', true);
        $('.translateSystem').attr('data-disabled', true).attr('disabled', 'disabled');
        $('.translateSystemReverse').attr('data-disabled', true);

        //if ($widget.settings._selectByLangAndDomain) {
        //    $widget.fancyTarget.trigger('disable').trigger('update.fs');
        //    $widget.fancyDomain.trigger('disable').trigger('update.fs');
        //}
    },

    enableTranslation: function () {
        $('.translateButton').attr('data-disabled', false);
        $('.translateSystem').attr('data-disabled', false).removeAttr('disabled');
        $('.translateSystemReverse').attr('data-disabled', false);

        //if ($widget.settings._selectByLangAndDomain) {
        //    $widget.fancyTarget.trigger('enable').trigger('update.fs');
        //    $widget.fancyDomain.trigger('enable').trigger('update.fs');
        //}
    },

    loadTargetLangList: function (source, putSystemId) {
        var core = this;

        $('.translateTargetLang', $widget.settings.container).empty();

        $.each($widget.settings._systems, function (idx, sys) {
            if (sys.SourceLanguage.Code === source) {
                if (putSystemId) {
                    // check unique in lang attribute
                    if ($('.translateTargetLang option[lang="' + sys.TargetLanguage.Code + '"]', $widget.settings.container).length === 0) {
                        $('.translateTargetLang', $widget.settings.container).append($('<option>', {
                            value: sys.ID,
                            text: sys.TargetLanguage.Name.Text,
                            lang: sys.TargetLanguage.Code
                        }));
                    }
                }
                else {
                    // check unique in value attribute
                    if ($('.translateTargetLang option[value="' + sys.TargetLanguage.Code + '"]', $widget.settings.container).length === 0) {
                        $('.translateTargetLang', $widget.settings.container).append($('<option>', {
                            value: sys.TargetLanguage.Code,
                            text: sys.TargetLanguage.Name.Text
                        }));
                    }
                }
            }
        });

        if ($widget.fancyTarget !== null) {
            $widget.fancyTarget.trigger('update.fs');
        }
    },

    loadDomainList: function (source, target) {
        var core = this,
            prevDomain = '';

        if ($('.translateDomain option:selected', $widget.settings.container).length !== 0) {
            prevDomain = $('.translateDomain option:selected', $widget.settings.container).attr('domain');
        }

        $('.translateDomain', $widget.settings.container).empty();

        $.each($widget.settings._systems, function (idx, sys) {
            if (sys.SourceLanguage.Code === source && sys.TargetLanguage.Code === target) {
                $('.translateDomain', $widget.settings.container).append($('<option>', {
                    value: sys.ID,
                    domain: sys.Domain,
                    text: sys.Domain
                }));
            }
        });

        // default selected
        if (prevDomain === '') {
            $('.translateDomain', $widget.settings.container).val($('.translateDomain option:first', $widget.settings.container).val());
        }
        else {
            $('.translateDomain option[domain="' + prevDomain + '"]', $widget.settings.container).attr('selected', true);
        }

        if ($widget.fancyDomain !== null) {
            $widget.fancyDomain.trigger('update.fs');
        }
    }
};
///#source 1 1 ../../widget_core/tilde.translator.widget.fancyselect.js
(function () {
    var $;

    $ = window.jQuery || window.Zepto || window.$;

    $.fn.fancySelect = function (opts) {
        var isiOS, settings;
        if (opts == null) {
            opts = {};
        }
        settings = $.extend({
            forceiOS: false,
            includeBlank: false,
            optionTemplate: function (optionEl) {
                return optionEl.text();
            },
            triggerTemplate: function (optionEl) {
                return optionEl.text();
            }
        }, opts);
        isiOS = !!navigator.userAgent.match(/iP(hone|od|ad)/i);
        return this.each(function () {
            var copyOptionsToList, disabled, options, sel, trigger, updateTriggerText, wrapper;
            sel = $(this);
            if (sel.hasClass('fancified') || sel[0].tagName !== 'SELECT') {
                return;
            }
            sel.addClass('fancified');
            sel.css({
                width: 1,
                height: 1,
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0
            });
            sel.wrap('<div class="fancy-select">');
            wrapper = sel.parent();
            if (sel.data('class')) {
                wrapper.addClass(sel.data('class'));
            }
            wrapper.append('<div class="trigger">');
            if (!(isiOS && !settings.forceiOS)) {
                wrapper.append('<ul class="options">');
            }
            trigger = wrapper.find('.trigger');
            options = wrapper.find('.options');
            disabled = sel.prop('disabled');
            if (disabled) {
                wrapper.addClass('disabled');
            }
            updateTriggerText = function () {
                var triggerHtml;
                triggerHtml = settings.triggerTemplate(sel.find(':selected'));
                return trigger.html(triggerHtml);
            };
            sel.on('blur.fs', function () {
                if (trigger.hasClass('open')) {
                    return setTimeout(function () {
                        return trigger.trigger('close.fs');
                    }, 120);
                }
            });
            trigger.on('close.fs', function () {
                trigger.removeClass('open');
                return options.removeClass('open');
            });
            trigger.on('click.fs', function () {
                var offParent, parent;
                if (!disabled) {
                    trigger.toggleClass('open');
                    if (isiOS && !settings.forceiOS) {
                        if (trigger.hasClass('open')) {
                            return sel.focus();
                        }
                    } else {
                        if (trigger.hasClass('open')) {
                            parent = trigger.parent();
                            offParent = parent.offsetParent();
                            if ((parent.offset().top + parent.outerHeight() + options.outerHeight() + 20) > $(window).height() + $(window).scrollTop()) {
                                options.addClass('overflowing');
                            } else {
                                options.removeClass('overflowing');
                            }
                        }
                        options.toggleClass('open');
                        if (!isiOS) {
                            return sel.focus();
                        }
                    }
                }
            });
            sel.on('enable', function () {
                sel.prop('disabled', false);
                wrapper.removeClass('disabled');
                disabled = false;
                return copyOptionsToList();
            });
            sel.on('disable', function () {
                sel.prop('disabled', true);
                wrapper.addClass('disabled');
                return disabled = true;
            });
            sel.on('change.fs', function (e) {
                if (e.originalEvent && e.originalEvent.isTrusted) {
                    return e.stopPropagation();
                } else {
                    return updateTriggerText();
                }
            });
            sel.on('keydown', function (e) {
                var hovered, newHovered, w;
                w = e.which;
                hovered = options.find('.hover');
                hovered.removeClass('hover');
                if (!options.hasClass('open')) {
                    if (w === 13 || w === 32 || w === 38 || w === 40) {
                        e.preventDefault();
                        return trigger.trigger('click.fs');
                    }
                } else {
                    if (w === 38) {
                        e.preventDefault();
                        if (hovered.length && hovered.index() > 0) {
                            hovered.prev().addClass('hover');
                        } else {
                            options.find('li:last-child').addClass('hover');
                        }
                    } else if (w === 40) {
                        e.preventDefault();
                        if (hovered.length && hovered.index() < options.find('li').length - 1) {
                            hovered.next().addClass('hover');
                        } else {
                            options.find('li:first-child').addClass('hover');
                        }
                    } else if (w === 27) {
                        e.preventDefault();
                        trigger.trigger('click.fs');
                    } else if (w === 13 || w === 32) {
                        e.preventDefault();
                        hovered.trigger('click.fs');
                    } else if (w === 9) {
                        if (trigger.hasClass('open')) {
                            trigger.trigger('close.fs');
                        }
                    }
                    newHovered = options.find('.hover');
                    if (newHovered.length) {
                        options.scrollTop(0);
                        return options.scrollTop(newHovered.position().top - 12);
                    }
                }
            });
            options.on('click.fs', 'li', function (e) {
                var clicked;
                clicked = $(this);
                sel.val(clicked.data('raw-value'));
                if (!isiOS) {
                    sel.trigger('blur.fs').trigger('focus.fs');
                }
                options.find('.selected').removeClass('selected');
                clicked.addClass('selected');
                trigger.addClass('selected');
                return sel.val(clicked.data('raw-value')).trigger('change.fs').trigger('blur.fs').trigger('focus.fs');
            });
            options.on('mouseenter.fs', 'li', function () {
                var hovered, nowHovered;
                nowHovered = $(this);
                hovered = options.find('.hover');
                hovered.removeClass('hover');
                return nowHovered.addClass('hover');
            });
            options.on('mouseleave.fs', 'li', function () {
                return options.find('.hover').removeClass('hover');
            });
            copyOptionsToList = function () {
                var selOpts;
                updateTriggerText();
                if (isiOS && !settings.forceiOS) {
                    return;
                }
                selOpts = sel.find('option');
                return sel.find('option').each(function (i, opt) {
                    var optHtml;
                    opt = $(opt);
                    if (!opt.prop('disabled') && (opt.val() || settings.includeBlank)) {
                        optHtml = settings.optionTemplate(opt);
                        if (opt.prop('selected')) {
                            return options.append("<li data-raw-value=\"" + (opt.val()) + "\" class=\"selected\">" + optHtml + "</li>");
                        } else {
                            return options.append("<li data-raw-value=\"" + (opt.val()) + "\">" + optHtml + "</li>");
                        }
                    }
                });
            };
            sel.on('update.fs', function () {
                wrapper.find('.options').empty();
                return copyOptionsToList();
            });
            return copyOptionsToList();
        });
    };

}).call(this);
///#source 1 1 ../../widget_core/tilde.translator.widget.library.js
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
				        if ($(r.parentElement()).parents('.translate_container_right').length > 0) {
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

})();
///#source 1 1 ../../widget_plugins/translatetext/translatetext.resources.js
/* UI texts */

uiResources = $.extend(true, uiResources, {
	'en': {
	    "clearTranslation":     "Clear",
	    "sourceTextTooltip":    "Enter the text you want to translate",
	    "targetTextTooltip":    "Machine translation results help to understand the meaning of a source text, but do not equal translation by a human"
	},
	'fr': {
	    "clearTranslation":     "Clear",
	    "sourceTextTooltip": 	"Entrez le texte que vous voulez traduire",
	    "targetTextTooltip": 	"Les résultats de traduction électronique aident à comprendre le sens du texte original mais ils ne remplacent pas un traducteur humain"
	},
	'lt': {
		"clearTranslation":     "Clear",
	    "sourceTextTooltip": 	"Įveskite norimą versti tekstą",
	    "targetTextTooltip": 	"Automatinio vertimo rezultatai padeda suprasti teksto prasmę, tačiau nepakeičia žmonių kuriamų vertimų"
	},
	'lv': {
		"clearTranslation":     "Notīrīt",
	    "sourceTextTooltip": 	"Ievadiet tulkojamo tekstu",
	    "targetTextTooltip": 	"Mašīntulkošanas rezultāti ļauj saprast teksta nozīmi, bet nevar aizstāt cilvēka radītu tulkojumu."
	},
	'ru': {
		"clearTranslation":     "Удалить текст",	
	    "sourceTextTooltip": 	"Введите текст для перевода",
	    "targetTextTooltip": 	"Результаты машинного перевода позволяют понять значение текста, но не позволяют заменить сделанный человеком перевод"
	}
});
///#source 1 1 ../../widget_plugins/translatetext/tilde.translator.widget.translatetext.js
/* tilde.translator.widget.TRANSLATETEXT.js */

$.extend(Tilde.TranslatorWidgetDefaultOptions, {
    _translationUrl: 'https://hugo.lv/ws/Service.svc/json/GetTranslations',
    _textSource: '.translateTextSource', //source container <textarea>
    _textResult: '.translateTextResult', //target container <div>
    _enableParallelHover: true, //enable translation and source paralel hover
    _scrollToTranslated: true, //toggle scroll source and target content to latest translated line
    _highlightTranslated: true, //toggle latest translation highlight in source and target
    _highlightTranslatedTimeout: 1500, //time in milissecond for highlight
    _resizeToFit: true, //toggle resize of widget to fit source text (_resize_to_fit: false + FF = causes visual defects)
    _resizeToFitMaxSize: null, //max height of widget if content if _resize_to_fit = true
    _innerPadding: 0, //set inner padding for source and target containers, must be used in combination with css
    _domainDescriptions: [],

    _onTranslationStarted: null,
    _onTranslationFinished: null
});

$.extend(Tilde.TranslatorWidget.prototype, {

    textTranslator: null,

    textPluginInit: function () {

        $widget.textPluginEvents();

        // parallel hover
        if ($widget.settings._enableParallelHover) {
            $widget.textPluginInitParallelHover();
        }

        $widget.textTranslator = new Tilde.TextTranslator($.extend(
            $widget.settings,
            { _translatorSystem: $widget.activeSystemId }
        ));

        $widget.textPluginSetTempText();
    },

    textPluginEvents: function () {
        var focusEvents = "click";
        if (navigator.userAgent.indexOf("Android") > -1 && navigator.userAgent.indexOf("Version/") > -1) {
            // Android browser won't allow to scroll a textarea unless it is focused
            focusEvents += " touchstart";
        }

        $('.translateButton', $widget.settings.container).on('click', function () {
            $widget.textPluginTranslate();
        });

        $('.translateResultClear').on('click', function () {
            $widget.textPluginResultClear();
        });

        $('.translateTextSourceContainer', $widget.settings.container).bind(focusEvents, function () {
            $($widget.settings._textSource, $widget.settings.container).focus();
        });

        $($widget.settings._textSource, $widget.settings.container).bind('focusout', $.proxy(function () {
            if ($($widget.settings._textSource, $widget.settings.container).val() == '') {
                $widget.textPluginSetTempText();
            }
        }, this));

        $widget.settings._onTranslationStarted = function () {
            $widget.textPluginTranslationStarted();
        }
        $widget.settings._onTranslationFinished = function () {
            $widget.textPluginTranslationFinished();
        }
    },

    textPluginTranslationStarted: function () {
        $($widget.settings._textResult, $widget.settings.container).removeClass('translateTextTemp');
        $('.translateProgress', this.settings.container).removeClass('hide');
    },

    textPluginTranslationFinished: function () {
        $('.translateProgress', $widget.settings.container).addClass('hide');

        if ($($widget.settings._textSource).length !== 0 && $($widget.settings._textSource).val().length == 0) {
            $widget.textPluginSetTempTextResult();
        }
        else {
            $('.translateResultClear', $widget.settings.container).removeClass('hide');
        }
    },

    textPluginResultClear: function () {
        $widget.textPluginSetTempText();

        $($widget.settings._textSource, $widget.settings.container).focus()
        $('.translateResultClear').addClass('hide');
    },

    textPluginInitParallelHover: function () {

        var sourceScrolled = function () {
            var backgroundSource = $('.backGroundSource')[0];
            var translateTextSource = $('.translateTextSource')[0];

            if (backgroundSource.scrollTop != translateTextSource.scrollTop) {
                backgroundSource.scrollTop = translateTextSource.scrollTop;
            }

            if (!window.Tilde.targetScrollingTime || new Date().getTime() - window.Tilde.targetScrollingTime > 200) {
                var translateContainerRight = $('.translateContainerRight')[0];
                if (translateContainerRight.scrollTop != translateTextSource.scrollTop) {
                    window.Tilde.sourceScrollingTime = new Date().getTime();
                    translateContainerRight.scrollTop = translateTextSource.scrollTop;
                }
            }
        };

        var targetScrolled = function () {
            var translateTextSource = $('.translateTextSource');

            if (navigator.userAgent.indexOf("Android") > -1 && navigator.userAgent.indexOf("Version/") > -1) {
                if (document.activeElement != null && document.activeElement != document && document.activeElement != document.body /*translateTextSource.is(":focus")*/) {
                    // android browser bug
                    // scroll event keeps repeating when any input control is focused
                    return;
                }
            }

            if (!window.Tilde.sourceScrollingTime || new Date().getTime() - window.Tilde.sourceScrollingTime > 200) {
                if (translateTextSource[0].scrollTop != this.scrollTop) {
                    window.Tilde.targetScrollingTime = new Date().getTime();
                    translateTextSource[0].scrollTop = this.scrollTop;
                }
            }
        };

        var windowsPhoneVersion = /.*Windows Phone (\d.\d).*/.exec(navigator.userAgent);
        if (windowsPhoneVersion && windowsPhoneVersion.length && windowsPhoneVersion.length > 1 && windowsPhoneVersion[1] <= '8.0') {
            // not sure why, but on windows phone (8) scroling is halted
            // if in left panel scroll event you try to scroll the right panel
            // (even if the right panel then does not try to scroll the left panel back (which could form a loop))
            // I was unable to find a working solution, 
            // so, disabled scroll synchronisation for windows phone 8.0 and older

            // background highlighting under textarea also disabled for old windows phones
            // since line height for scrollbar and normal div does not match there
        } else {
            $('.translateTextSource').on('scroll', sourceScrolled);
            $('.translateContainerRight').on('scroll', targetScrolled);
            if (navigator.userAgent.indexOf("Android") > -1 && navigator.userAgent.indexOf("Version/") > -1) {
                $('.translateContainerRight').bind('touchstart', function () { $(':focus').blur(); });
            }

            $('.translateTextResult').on('mouseenter mouseleave', '.mt-translation', function (e) {
                $('.hoverStyleSource').removeClass('hoverStyleSource');
                $('.mt-translation[isHover="true"]').removeAttr('ishover');

                if (e.type === 'mouseenter') {
                    $(this).attr('ishover', 'true');
                    $('.classMTsource[cursorId="' + $(this).attr('cursorId') + '"]').addClass('hoverStyleSource');
                }
            });
        }
    },

    textPluginTranslate: function () {
        //$widget.textTranslator.translateWebsiteIfTextLooksLikeUrl();
        $widget.textTranslator.doTranslation({ translateAll: true });
    },

    textPluginSetTempText: function () {
        $widget.textTranslator.clearTranslation();
        $widget.textPluginSetTempTextResult();
        $widget.textPluginSetTempTextSource();

        $('.translateResultClear').addClass('hide');
        $('.translateProgress', $widget.settings.container).addClass('hide');
    },

    textPluginSetTempTextSource: function () {
        $($widget.settings._textSource, $widget.settings.container).val('');

        $('.translateTextTempSourceContainer', $widget.settings.container).removeClass('hide');
        $('.translateTextTempSourceContainer', $widget.settings.container).html(uiResources[$widget.settings._language]['sourceTextTooltip']);

        $('.translateTextTempSourceContainer', $widget.settings.container).unbind('focus');
        $('.translateTextTempSourceContainer', $widget.settings.container).bind('focus', function () {
            $('.translateTextTempSourceContainer', $widget.settings.container).addClass('hide');
        });

        $($widget.settings._textSource, $widget.settings.container).unbind('focus');
        $($widget.settings._textSource, $widget.settings.container).bind('focus', function () {
            $('.translateTextTempSourceContainer', $widget.settings.container).addClass('hide');
        });
    },

    textPluginSetTempTextResult: function () {
        $($widget.settings._textResult, $widget.settings.container).addClass('translateTextTemp');
        var txt = '';

        //if (this.domain && $widget.settings._domainDescriptions.length > 0) {
        //    if ($widget.settings._domainDescriptions[this.domain] !== undefined) {
        //        txt = this.settings._domainDescriptions[this.domain] + "<p>";
        //    }
        //}

        txt += uiResources[$widget.settings._language]['targetTextTooltip'];

        //if (this.domain) {
        //    txt += "</p>";
        //}

        $(this.settings._textResult, $widget.settings.container).html(txt);
    }

});

Tilde.TextTranslator = function (options) { this.init(options); };
Tilde.TextTranslator.prototype = {
    options: null,
    pta: null,
    timeoutParagraph: null,
    timeoutText: null,
    translationInProgress: false,

    init: function (options) {

        if (typeof (options) == 'undefined') {
            alert('no options specified for "Tilde.TextTranslator"');
        }

        this.options = options;

        var optionsTA = new Tilde.ProgressiveTextAreaOptions();

        optionsTA.directCompare = false;

        optionsTA.textAreaSelector = options._textSource;

        optionsTA.onNewParagraph = $.proxy(this.onNewParagraph, this);
        optionsTA.onTextChanged = $.proxy(this.onTextChanged, this);
        optionsTA.onBackgroundHover = this.options.onBackgroundHover;

        this.pta = new Tilde.ProgressiveTextArea(optionsTA);
    },

    setSystem: function (system) {
        this.options.translatorSystem = system;
    },

    setTargetText: function (str) {
        $(this.options._textResult).html(str);
    },

    clearTranslation: function () {
        this.setSourceText('');
    },

    onNewParagraph: function () {
        if (typeof (this.timeoutParagraph) !== 'undefined' && this.timeoutParagraph != null) {
            clearTimeout(this.timeoutParagraph);
            this.timeoutParagraph = null;
        }

        this.timeoutParagraph = setTimeout($.proxy(this.onNewParagraphWork, this), 0);
    },

    onTextChanged: function () {
        if (typeof (this.timeoutText) !== 'undefined' && this.timeoutText != null) {
            clearTimeout(this.timeoutText);
            this.timeoutText = null;
        }

        this.timeoutText = setTimeout($.proxy(this.onNewParagraphWork, this), 3000);
    },

    onBackgroundHover: function (context) {
        var cursor = this.obj;

        if (typeof (context) !== 'undefined') {
            cursor = context;
        }

        var parent = $('.backGroundSource').html('');

        do {
            if (cursor == null)
                break;
            else {
                var t = cursor.string;
                var newO;
                if (t.replace(/\s/g, '').length == 0) {
                    newO = $('<div id="source-mt-' + cursor.id + '" cursorId="' + cursor.id + '" class="classMTsource"></div>').html('<br />');
                } else {
                    newO = $('<div id="source-mt-' + cursor.id + '" cursorId="' + cursor.id + '" class="classMTsource"></div>').text(t);
                }

                newO.appendTo(parent);
                cursor = cursor.child;
            }
        } while (true);
    },

    clearAlltimeouts: function () {
        if (typeof (this.timeoutText) !== 'undefined' && this.timeoutText != null) {
            clearTimeout(this.timeoutText);
            this.timeoutText = null;
        }
        if (typeof (this.timeoutParagraph) !== 'undefined' && this.timeoutParagraph != null) {
            clearTimeout(this.timeoutParagraph);
            this.timeoutParagraph = null;
        }
    },

    onNewParagraphWork: function () {
        var cursor = this.pta.obj;

        do {
            if (cursor.changed) {
                cursor.translation = cursor.string;
                cursor.changed = false;
                cursor.translated = false;
            }
            else {
                cursor = cursor.child;
                if (cursor == null)
                    break;
            }
        } while (true);

        this.redrawResult();

        this.clearAlltimeouts();

        if (!this.translationInProgress) {
            this.translateWebsiteIfTextLooksLikeUrl();
            this.doTranslation();
        }
    },

    redrawResult: function () {

        var cursor = this.pta.obj;
        $(this.options._textResult).html('');
        do {
            if (cursor != null) {
                var txt = cursor.translation;
                var isTranslated = true;
                if (!cursor.translated) {
                    if (txt.replace(/\s/g, '').length == 0) {
                    } else {
                        txt = txt;
                        isTranslated = false;
                    }
                }

                var isEmptyLine = false;
                if (txt.replace(/\s/g, '').length == 0) {
                    txt = '<br />';
                    isEmptyLine = true;
                }

                var tranlationLine;
                if (isEmptyLine) {
                    tranlationLine = $('<p cursorId="' + cursor.id + '" class="mt-translation" aria-haspopup="true" id="mt-result-' + cursor.id + '"></p>').html(txt); //.appendTo(this.options._textResult);
                    $(this.options._textResult).append(tranlationLine);
                }
                else {
                    tranlationLine = $('<p cursorId="' + cursor.id + '" class="mt-translation" aria-haspopup="true" id="mt-result-' + cursor.id + '"></p>').text(txt); //.appendTo(this.options._textResult);
                    $(this.options._textResult).append(tranlationLine);
                }

                if (cursor.scroll != null && this.options.scrollToTranslated) {
                    $(this.options._textResult)[0].scrollTop = tranlationLine[0].offsetTop - ($(this.options._textResult).height() / 2);
                    cursor.scroll = null;
                }

                if (cursor.latest != null && this.options._highlightTranslated) {
                    $('.mt-translation[cursorId="' + cursor.id + '"]').attr('latestHighlight', 'true');
                    $('.classMTsource[cursorId="' + cursor.id + '"]').attr('latestHighlight', 'true');

                    //IE7 rendering issue fix-hack
                    if (true) {
                        $('.mt-translation[cursorId="' + cursor.id + '"]').html($('.mt-translation[cursorId="' + cursor.id + '"]').html());
                        $('.classMTsource[cursorId="' + cursor.id + '"]').html($('.classMTsource[cursorId="' + cursor.id + '"]').html());
                    }

                    setTimeout($.proxy(function () {
                        this.latest = null;
                        $('.mt-translation[cursorId="' + this.id + '"]').removeAttr('latestHighlight');
                        $('.classMTsource[cursorId="' + this.id + '"]').removeAttr('latestHighlight');

                        //IE7 rendering issue fix-hack
                        if (true) {
                            $('.mt-translation[cursorId="' + this.id + '"]').html($('.mt-translation[cursorId="' + this.id + '"]').html());
                            $('.classMTsource[cursorId="' + this.id + '"]').html($('.classMTsource[cursorId="' + this.id + '"]').html());
                        }
                    }, cursor), this.options._highlightTranslatedTimeout);
                }

                if (isTranslated) {
                    tranlationLine.removeAttr('translationProgress');
                }
                else {
                    tranlationLine.attr('translationProgress', 'true')
                }

                //IE7 rendering issue fix-hack
                if (true) {
                    tranlationLine.html(tranlationLine.html());
                }
                cursor = cursor.child;
            }
            else {
                break;
            }
        } while (true);
    },

    makeAllNotTranslated: function () {
        var cursor = this.pta.obj;
        do {
            if (cursor != null) {
                cursor.translated = false;
                cursor.changed = false;
                cursor.translation = cursor.string;
                cursor = cursor.child;
            }
            else
                break;
        } while (true);

        this.redrawResult();
    },

    setSourceText: function (str) {
        this.setTargetText('');
        this.pta.setSourceText(str);
        this.doTranslation({ translateAll: true });
    },

    getTargetText: function () {
        var resultString = '';

        $('.mt-translation', $(this.options._textResult)).each(function () {
            resultString += '\r\n' + $(this).text();
        });

        if (resultString.length > 0)
            resultString = resultString.slice(2);
        return resultString;
    },

    getSourceText: function () {
        return $(this.options.sourceStringSelector).val().replace(/(\n)|(\r)|(\r\n)/g, '\r\n');
    },

    translateWebsiteIfTextLooksLikeUrl: function () {
        if (!this.options.websiteTranslationRedirect)
            return;
        var text = $(this.options.sourceStringSelector, this.options.container).val();
        var urlPattern = /\b((?:https?:(?:\/{1,3}|[a-z0-9%])|[a-z0-9.\-]+[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\/)(?:[^\s()<>{}\[\]]+|\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\))+(?:\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])|(?:[a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\b\/?(?!@)))/gi;
        var urlMatch = urlPattern.exec(text);
        if (urlMatch) {
            var url = urlMatch[0];
            if (url.length / $.trim(text).length > 0.8) // most of the text is url
            {
                window.location = this.options.base_path + "Translate/Website?url=" + encodeURIComponent(url);
            }
        }
    },

    doTranslation: function (options) {
        this.clearAlltimeouts();

        if (!this.translationInProgress) {
            this.redrawBackground();
            this.translationInProgress = true;
            if (this.options._onTranslationStarted)
                this.options._onTranslationStarted();
        }

        var cursor = this.pta.obj;

        if (typeof (options) === 'undefined') {
            options = { translateAll: false, isPreviouseDictionary: false };
        }

        if (options.translateAll)
            this.makeAllNotTranslated();

        cursor = this.pta.obj;

        do {
            if (!cursor.changed && !cursor.translated) {
                if (cursor.translation.replace(/\s/g, '').length == 0) {
                    cursor.translated = true;
                    cursor.translation = cursor.translation;
                }
                else {

                    var authHeaders = {};

                    if (this.options._clientId !== null) {
                        authHeaders = {
                            'client-id': this.options._clientId
                        }
                    }

                    $.ajax({
                        context: {
                            id: cursor.id,
                            obj: this,
                            onAjaxError: this.options.onAjaxError
                        },
                        dataType: this.options.jsonType,
                        url: this.options._translationUrl,
                        headers: authHeaders,
                        data: {
                            appid: this.options._appId,
                            text: cursor.translation,
                            systemid: this.options._translatorSystem
                        },
                        success: this.onSuccess,
                        error: this.onSuccess
                    });

                    break;
                }
            }
            else {
                cursor = cursor.child;
                if (cursor == null) {
                    if (this.translationInProgress) {
                        this.translationInProgress = false;
                        if (this.options._onTranslationFinished)
                            this.options._onTranslationFinished();
                    }

                    break;
                }
            }
        } while (true);
    },

    onSuccess: function (result) {
        var id = this.id;
        var cursor = this.obj.pta.obj;

        do {

            if (cursor.id == id && !cursor.changed) {
                cursor.translated = true;
                cursor.latest = true;
                cursor.scroll = true;
                if (typeof (result[0].Text) === 'undefined') {
                    cursor.translation = '{{' + cursor.translation + '}}';
                }
                else {
                    cursor.translation = result[0].Text;
                }
                break;
            }
            else {
                cursor = cursor.child;
                if (cursor == null)
                    break;
            }

        } while (true);

        this.obj.redrawResult();

        this.obj.doTranslation({ translateAll: false });
    },

    redrawBackground: function () {
        if (this.options._enableParallelHover) {
            $.proxy(this.onBackgroundHover, this.pta)();
        }
    }
}

//------------------------------------------------------------------------------------------------

Tilde.ProgressiveTextAreaElement = function () { };
Tilde.ProgressiveTextAreaElement.prototype = {
    start: function () {
        var current = this;
        var start = 0;
        do {
            if (current.parent != null) {
                current = current.parent;
                start += current.string.length + 1;
            }
            else {
                break;
            }
        } while (true);

        return start;
    },
    string: '',
    end: function () {
        return this.start() + this.string.length;
    },
    child: null,
    parent: null,
    changed: true,
    translation: '',
    translated: false,
    latest: null,
    scroll: null,
    id: 0,
    copy: function (child) {
        var copyOf = new Tilde.ProgressiveTextAreaElement();

        if (typeof (child) === 'undefined') {
            child = this;
        }

        copyOf.string = child.string;
        copyOf.id = child.id;
        copyOf.changed = child.changed;

        var copyOfChild = null;
        if (child.child != null) {
            copyOfChild = child.child.copy();
        }

        if (copyOfChild != null) {
            copyOf.child = copyOfChild;
            copyOfChild.parent = copyOf;
        }

        return copyOf;
    }
}

//------------------------------------------------------------------------------------------------

Tilde.ProgressiveTextAreaOptions = function () { };
Tilde.ProgressiveTextAreaOptions.prototype = {
    textAreaSelector: '',
    directCompare: false,
    onTextChanged: null,
    onNewParagraph: null,
    onBackgroundHover: null
}

Tilde.ProgressiveTextArea = function (options) { this.init(options); };
Tilde.ProgressiveTextArea.prototype = {
    NEW_LINE: '<BREAK>',
    obj: null,
    objID: 0,
    oldString: '',
    options: new Tilde.ProgressiveTextAreaOptions(),

    init: function (options) {

        if (typeof (options) === 'undefined') {
            alert('no options specified for "Tilde.ProgressiveTextArea"');
        }

        this.options = options;
        this.obj = new Tilde.ProgressiveTextAreaElement();
        $(this.options.textAreaSelector).off('keypress keyup keydown').keypress($.proxy(this.onKeyStroke, this)).keyup($.proxy(this.onKeyStroke, this)).keydown($.proxy(this.onKeyStroke, this));
        $(this.options.textAreaSelector).off('paste copy cut delete input').bind('paste', $.proxy(this.onKeyStroke, this)).bind('copy', $.proxy(this.onKeyStroke, this)).bind('cut', $.proxy(this.onKeyStroke, this)).bind('delete', $.proxy(this.onKeyStroke, this)).bind('input', $.proxy(this.onKeyStroke, this));
    },

    getLastChild: function (parent) {
        if (typeof (parent) === 'undefined') {
            return this.getLastChild(this.obj);
        }

        if (parent.child == null) {
            return parent;
        }
        else {
            return this.getLastChild(parent.child);
        }
    },

    getStringBetween: function (str, delimiter, position) {
        var end = str.length;
        var start = 0;

        for (var i = position; i < str.length; i++) {
            if (str.charAt(i) == '\n') {
                end = i;
                break;
            }
        }

        for (var i = position - 1; i >= 0; i--) {
            if (str.charAt(i) == '\n') {
                start = i + 1;
                break;
            }
        }

        return { string: str.substring(start, end), start: start, end: end };
    },

    getCharChanged: function (o, n) {
        var type = 'removed';
        var char = '';

        if (o.length <= n.length) {
            type = 'added';
            if (o.length == n.length) {
                type = 'changed';
                if (o == n)
                    type = 'equal';
            }
        }

        var start = 0;

        switch (type) {
            case 'added':
                for (var i = 0; i < n.length; i++) {
                    if (o.charAt(i) != n.charAt(i)) {
                        char = n.charAt(i);
                        start = i + (n.length - o.length);
                        break;
                    }
                }

                break;
            case 'removed':
            case 'changed':
                for (var i = 0; i < o.length; i++)
                    if (o.charAt(i) != n.charAt(i)) {
                        char = o.charAt(i);
                        start = i;
                        break;
                    }
                break;
        }

        if (char == '\n')
            char = this.NEW_LINE;

        return { type: type, char: char, start: start };
    },

    saveState: function () {
        var current = this.obj;

        do {
            if (current == null) {
                break;
            }
            else {
                current.changed = false;
            }

            current = current.child;
        } while (true);

        //this.printTrace(0);
    },

    recalculate: function () {
        this.obj = this.createNewObject();
    },

    createNewObject: function () {
        var newObjBase = new Tilde.ProgressiveTextAreaElement();
        var newObj = newObjBase;
        var newString = '';
        if ($(this.options.textAreaSelector).length !== 0) {
            newString = $(this.options.textAreaSelector).val();
        }
        var st = 0;
        var newObjID = this.objID;

        do {
            newObj.string = this.getStringBetween(newString, '\n', st).string;
            newObj.id = ++newObjID;
            newObj.changed = true;

            st = newObj.end() + 1;

            if (st > newString.length) {
                break;
            }
            else {
                newObj.child = new Tilde.ProgressiveTextAreaElement();
                newObj.child.parent = newObj;
                newObj = newObj.child;
            }

        } while (true);

        this.objID = newObjID;
        return newObjBase;
    },

    setSourceText: function (str) {
        this.objID = 0;
        this.oldString = '';
        $(this.options.textAreaSelector).val(str);
        this.recalculate();
        this.redrawBackground();
    },

    kayTimeout: null,

    onKeyStroke: function (event) {
        if (typeof (this.kayTimeout) !== 'undefined' && this.kayTimeout != null) {
            clearTimeout(this.kayTimeout);
            this.kayTimeout = null;
        }

        if (typeof (event) === 'undefined' || event.keyCode == 13) {
            this.onKeyStrokeSub(event);
            return;
        }

        var e = event;
        this.kayTimeout = setTimeout($.proxy(function () { this.onKeyStrokeSub(e); this.kayTimeout = null; }, this), 250);
    },

    onKeyStrokeSub: function (event) {
        var newString = $(this.options.textAreaSelector).val();
        var charsChanged = Math.abs(newString.length - this.oldString.length);
        var charsEqual = (newString == this.oldString);
        var range = $(this.options.textAreaSelector).getSelection();
        var res = this.getCharChanged(this.oldString, newString);
        var newPosStart = range.start;
        var charMultiChanges = false;

        activeSource = this.obj;
        current = this.getStringBetween(newString, '\n', newPosStart);

        if (newString.length == 0) {
            this.objID = 0;
        }

        if (!charsEqual && charsChanged < 2) {
            var t;
            var len = newString.length;

            if (newString.length > this.oldString.length) {
                len = this.oldString.length;
            }

            for (t = 0; t < len; t++) {
                if (newString.charAt(t) != this.oldString.charAt(t)) {
                    break;
                }
            }

            var z;
            for (z = 1; z < len - t; z++) {
                if (newString.charAt(newString.length - t) != this.oldString.charAt(this.oldString.length - t)) {
                    break;
                }
            }

            charsChanged = Math.abs(z - t);
        }

        if (!charsEqual && charsChanged == 0) { //TODO:FIX
            var c = 0;
            var res = 0;
            do {
                if (newString.charAt(c) !== this.oldString.charAt(c)) {
                    res++;
                    if (newString.charAt(c) == '\n' || this.oldString.charAt(c) == '\n')
                        res++;
                    if (res == 2) {
                        charMultiChanges = true;
                        break;
                    }
                }
                c++;
            } while (c < newString.length);
        }

        do {
            if (this.options.directCompare || (Math.abs(charsChanged) > 1 || charMultiChanges)) {
                var newObjID = 0;
                var st = 0;

                var oldObj = this.obj;
                var newObjBase = this.createNewObject();
                var newObj = newObjBase;
                var linesChanged = 0;

                newObj = newObjBase;
                do {
                    oldObj = this.obj;

                    do {
                        if (oldObj != null && oldObj.id != -1 && oldObj.string == newObj.string) {
                            newObj.id = oldObj.id;
                            newObj.changed = oldObj.changed;
                            newObj.translated = oldObj.translated;
                            newObj.translation = oldObj.translation;
                            oldObj.id = -1;
                            break;
                        }
                        else {
                            oldObj = oldObj.child;
                            if (oldObj == null) {
                                newObj.id = ++this.objID;
                                newObj.changed = true;
                                linesChanged++;
                                break;
                            }
                        }
                    } while (true);
                    newObj = newObj.child;
                    if (newObj == null) {
                        break;
                    }

                } while (true);

                this.obj = newObjBase;

                if ((!this.options.directCompare || Math.abs(charsChanged) > 1) && (newString.length > 1 || newString.length == 0)) {
                    if (linesChanged > 1 || newString.length == 0)
                        this.triggerOnNewParagraph();
                    else
                        this.triggerOnNewText();
                }
            }
            else {
                switch (res.type) {
                    case 'removed':
                        if (res.char == this.NEW_LINE) {
                            if (true) {
                                do {
                                    if (activeSource.end() > newPosStart) {
                                        var totalLen = activeSource.string.length;

                                        activeSource = activeSource.parent;
                                        activeSource.child = activeSource.child.child;

                                        totalLen += activeSource.string.length;

                                        if (activeSource.child != null)
                                            activeSource.child.parent = activeSource;

                                        if (activeSource.string.length != totalLen || activeSource.parent == null || activeSource.string != current.string) {
                                            activeSource.translated = false;
                                            activeSource.changed = true;
                                            activeSource.translation = '';
                                            activeSource.id = ++this.objID;
                                        }

                                        activeSource.string = current.string;

                                        break;
                                    }
                                    else {
                                        activeSource = activeSource.child;
                                    }
                                } while (true);
                            }
                            else {
                            }
                        }
                        else {

                            if (newString.charAt(newPosStart) == '\n') {
                                var prevChange = false;
                                var pre_current = this.getStringBetween(newString, '\n', newPosStart);
                                var post_current = this.getStringBetween(newString, '\n', newPosStart + 1);

                                do {
                                    if (activeSource.start() == pre_current.start) {
                                        prevChange = !(activeSource.string == pre_current.string);
                                        break;
                                    }
                                    else {
                                        activeSource = activeSource.child;
                                    }
                                } while (true);

                                if (prevChange) {
                                    current = pre_current;
                                }
                                else {
                                    current = post_current;
                                    newPosStart++;
                                }

                                activeSource = this.obj;
                            }
                            else {
                                current = this.getStringBetween(newString, '\n', newPosStart);
                            }

                            do {
                                if (activeSource.start() <= (newPosStart) && (activeSource.child == null || activeSource.end() >= newPosStart)) {
                                    activeSource.string = current.string;
                                    activeSource.changed = true;
                                    break;
                                }
                                else {
                                    activeSource = activeSource.child;
                                }
                            } while (true);
                        }
                        break;
                    case 'changed':
                    case 'added':
                        if (res.char == this.NEW_LINE) {
                            if (newString.length - 1 <= newPosStart) {
                                do {
                                    if (activeSource.child == null) {
                                        var parent = activeSource;
                                        activeSource.child = new Tilde.ProgressiveTextAreaElement();
                                        activeSource = activeSource.child;
                                        activeSource.parent = parent;
                                        activeSource.string = '';
                                        activeSource.id = ++this.objID;
                                        activeSource.changed = true;

                                        break;
                                    }
                                    else {
                                        activeSource = activeSource.child;
                                    }
                                } while (true);
                            } else {
                                do {
                                    if (activeSource.start() <= (newPosStart) && activeSource.end() >= (newPosStart)) {

                                        var postcurrent = null;
                                        var precurrent = null;

                                        if (newString.charAt(newPosStart) == '\n') {
                                            var postcurrent = this.getStringBetween(newString, '\n', newPosStart + 1);
                                            var precurrent = this.getStringBetween(newString, '\n', newPosStart);
                                        }
                                        else {
                                            var postcurrent = this.getStringBetween(newString, '\n', newPosStart);
                                            var precurrent = this.getStringBetween(newString, '\n', newPosStart - 1);
                                        }

                                        var n_id = null;
                                        var n_changed = null;
                                        var n_translated = null;
                                        var n_translation = null;

                                        if (activeSource.string == postcurrent.string) {
                                            var n_id = activeSource.id;
                                            var n_changed = activeSource.changed;
                                            var n_translated = activeSource.translated;
                                            var n_translation = activeSource.translation;
                                        }

                                        if (activeSource.string != precurrent.string) {
                                            activeSource.changed = true;
                                            activeSource.translated = false;
                                            activeSource.translation = '';
                                            activeSource.id = ++this.objID;
                                        }

                                        activeSource.string = precurrent.string;

                                        var oldChild = activeSource.child;
                                        activeSource.child = new Tilde.ProgressiveTextAreaElement();

                                        if (activeSource.child.string != postcurrent.string) {
                                            activeSource.child.changed = true;
                                            activeSource.child.translated = false;
                                            activeSource.child.translation = '';
                                            activeSource.child.id = ++this.objID;
                                        }

                                        if (n_id != null) {
                                            activeSource.child.id = n_id;
                                            activeSource.child.changed = n_changed;
                                            activeSource.child.translated = n_translated;
                                            activeSource.child.translation = n_translation;
                                        }
                                        else {
                                            activeSource.child.id = ++this.objID;
                                        }

                                        activeSource.child.string = postcurrent.string;
                                        activeSource.child.id = ++this.objID;
                                        activeSource.child.parent = activeSource;
                                        activeSource.child.child = oldChild;

                                        if (oldChild != null) {
                                            oldChild.parent = activeSource.child;
                                        }
                                        break;
                                    }
                                    else {
                                        activeSource = activeSource.child;
                                    }
                                } while (true);
                            }
                        }
                        else {
                            do {
                                if (activeSource.start() <= (newPosStart) && (activeSource.child == null || activeSource.end() + 1 >= newPosStart)) {
                                    activeSource.string = current.string;
                                    activeSource.changed = true;
                                    break;
                                }
                                else {
                                    activeSource = activeSource.child;
                                }
                            } while (true);
                        }
                        break;
                    case 'equal':
                        break;
                }
            }
        } while (false);

        //this.trimIfTooLarge();

        if (typeof (event) != 'undefined') {
            if (typeof (event.keyCode) != 'undefined' && typeof (event.type) != 'undefined' && event.type == 'keyup' && (event.keyCode == 13 || res.char == this.NEW_LINE)) {
                this.triggerOnNewParagraph();
            }
        }

        if (!charsEqual) {
            this.triggerOnNewText();
        }

        this.oldString = $(this.options.textAreaSelector).val();
        //this.printTrace(newPosStart);

        this.redrawBackground();
    },

    trimIfTooLarge: function () {
        var tempCursorCount = this.obj;
        var tempNewText = '';
        var totalLineCount = 1;
        do {
            if (tempCursorCount.child != null) {
                totalLineCount++;
                tempNewText += tempCursorCount.string + '\r\n';
                if (totalLineCount > 250) {
                    tempCursorCount.child = null;
                    //when text changes, cursor is moved to the bottom of text area - undesired behaviour
                    $(this.options.textAreaSelector).val(tempNewText);
                    break;
                }
                tempCursorCount = tempCursorCount.child;
            }
            else {
                break;
            }
        } while (true);
    },

    redrawBackground: function () {
        if (this.options.onBackgroundHover) {
            $.proxy(this.options.onBackgroundHover, this)();
        }
    },

    triggerOnNewParagraph: function () {
        if (this.options.onNewParagraph) {
            this.options.onNewParagraph();
        }
    },

    triggerOnNewText: function () {
        if (this.options.onTextChanged) {
            this.options.onTextChanged();
        }
    }
}
