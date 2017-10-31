/* UI texts */

var uiResources = {
    'en': {
        "sourceSystem": "From:",
        "targetSystem": "To:",
        "systemSelect": "System",
        "swapLanguage": "Reverse",
        "translateButton": "Translate",
        "systemDomain": "Domain",
        "systemLoadError": "Error while loading systems",
        "en": "English",
        "lv": "Latvian",
        "lt": "Lithuanian",
        "fr": "French",
        "ru": "Russian",
        "et": "Estonian",
        "ar": "Arabic"
    },
    'fr': {
        "sourceSystem": "From:",
        "targetSystem": "To:",
        "systemSelect": "System",
        "swapLanguage": "Reverse",
        "translateButton": "Traduire",
        "systemDomain": "Domain",
        "systemLoadError": "Error while loading systems"
    },
    'lt': {
        "sourceSystem": "Iš:",
        "targetSystem": "Į:",
        "systemSelect": "System",
        "swapLanguage": "Pakeisti",
        "translateButton": "Versti",
        "systemDomain": "Domain",
        "systemLoadError": "Įkeliant sistemas įvyko klaida",
        "en": "Anglų",
        "lv": "Latvių",
        "lt": "Lietuvių",
        "ru": "Rusų",
        "et": "Estų",
        "ar": "Arabų"
    },
    'lv': {
        "sourceSystem": "No:",
        "targetSystem": "Uz:",
        "systemSelect": "System",
        "swapLanguage": "Apgriezt",
        "translateButton": "Tulkot",
        "systemDomain": "Domēns",
        "systemLoadError": "Neizdevās ielādēt tulkošanas sistēmas",
        "en": "Angļu",
        "lv": "Latviešu",
        "lt": "Lietuviešu",
        "fr": "Franču",
        "ru": "Krievu",
        "et": "Igauņu",
        "ar": "Arābu"
    },
    'ru': {
        "sourceSystem": "Направление перевода",
        "targetSystem": "На",
        "systemSelect": "System",
        "swapLanguage": "Перевернуть",
        "translateButton": "Перевести",
        "systemDomain": "Тематическая область",
        "systemLoadError": "Error while loading systems",
        "en": "Английский",
        "lv": "Латышский",
        "lt": "Литовский",
        "fr": "Французский",
        "ru": "Русский",
    },
    'et': {
        "sourceSystem": "Lähtekeel:",
        "targetSystem": "Sihtkeel:",
        "systemSelect": "",
        "swapLanguage": "Vastupidi",
        "translateButton": "Tõlgi",
        "systemDomain": "Domain",
        "systemLoadError": "Süsteemide laadimise tõrge",
        // RL
        //"en": "Īnglise",
        "en": "Inglise",
        // /RL
        "lv": "Läti",
        "lt": "Leedu",
        "et": "Eesti",
        "ru": "Vene",
        "ar": "Araabia"
    }
};
/* tilde.translator.widget.core.js */

if (typeof (Tilde) === 'undefined') Tilde = {};

Tilde.TranslatorWidgetDefaultOptions = {
    _systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList',
    _apiIsInTheSameDomain: false, //is API WS in the same domain as the page that contains the widget
    _jsonType: 'json', //jsonp or json
    _appId: 'unknown', //appid of widget - used to get systems and translations
    _clientId: 'u-bfcaf986-8147-4901-a131-f0d618a7354b',
    _systems: null, //configurable system list in JSON format. If contains values system list is not loaded from server but from given data
    _allowedSystemStatuses: 'running', //filter system list with specified statuses
    _templateId: null,
    _replaceContainer: false, //if true then instead of putting widget inside of container div, it will be put instead of container div
    _translations: {}, //used to owerride default labels and translations
    _language: 'en', //interface language

    _useFancySelect: true, //use custom FancySelect plugin for system select box
    _systemSelectType: 'language', //system choose type: 'system', 'language', 'domain'
    _replaceSourceWithBlock: false, //if only one source language, display as block element (only if _systemSelectType: 'language', 'domain')
    _defaultSourceLang: null, //default source language (only if _systemSelectType: 'language', 'domain')
    _defaultTargetLang: null, //default target language (only if _systemSelectType: 'language', 'domain')
    _defaultDomain: null, //default domain language (only if _systemSelectType: 'domain')
    _defaultSystem: null, //default system id (only if _systemSelectType: 'language', 'system')
    _customSelectText: '', //active fancy select element will be replaced with static text (like 'more')
    _swapLanguages: true, //swap source and target languages
    _getFilteredSystems: false, //if true then systems will be filtered in server side by appid

    _onGetSystemListError: null, //on system load ajax error callback function
    _onSystemsLoaded: null, //system list is successfully loaded
    _onSystemChanged: null, //system id is changed
    _onWidgetLoaded: null, //on widget fully loaded callback function
    _onWidgetTemplateLoaded: null, //on widget template shown callback function
    _loginUrl: null, // where to redirect if http status 401 (not authorized) is received
    _sourceLanguageOrder: null, //force order of source languages if _systemSelectType = "language" or "domain"
    _targetLanguageOrder: null //force order of target languages if _systemSelectType = "language" or "domain"
};

Tilde.TranslatorWidget = function (container, options) {
    if ($(container).length === 0) {
        return;
    }

    var settings = $.extend(
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
    reverseSystems: [{}],

    //fancySelect objects
    fancySource: null,
    fancyTarget: null,
    fancyDomain: null,

    onSystemChangedHandlers: [], // callback functions to run when system is changed
    pluginInitializers: [],
    onSystemListLoadedHandlers: [], //callback functions to run when system list is loaded
    onWidgetLoadedCalled: false,

    initWidget: function (options) {
        $widget = this;
        $widget.settings = options;
        $widget.onSystemListLoadedHandlers.push($widget.systemLoadComplete);
        $widget.initWidgetTemplate();
        $widget.initPlugins();
        $widget.initWidgetLanguage();
        if ($widget.settings._onSystemsLoaded && typeof ($widget.settings._onSystemsLoaded) === "function") {
            $widget.onSystemListLoadedHandlers.push($widget.settings._onSystemsLoaded);
        }
        if ($widget.settings._onWidgetLoaded && typeof ($widget.settings._onWidgetLoaded) === "function") {
            $widget.onSystemListLoadedHandlers.push(function (systemList) {
                if (!$widget.onWidgetLoadedCalled) {
                    $widget.onWidgetLoadedCalled = true;
                    $widget.settings._onWidgetLoaded(systemList);
                }
            });
        }
        $widget.retrieveSystemData();
    },

    pluginsInitialized: false,

    initPlugins: function () {
        if ($widget.pluginInitializers && !$widget.pluginsInitialized) {
            $widget.pluginsInitialized = true;
            $.each($widget.pluginInitializers, function (idx, pluginInitializer) {
                pluginInitializer();
            });
        }
    },

    getAuthHeaders: function(){
        var authHeaders = {};

        if ($widget.settings._clientId !== null) {
            authHeaders = {
                'client-id': $widget.settings._clientId
            }
        }

        if (!$widget.settings._apiIsInTheSameDomain) {
            var websiteAuthCookie = $widget.readCookie("smts");
            if (websiteAuthCookie) {
                authHeaders["website-auth-cookie"] = websiteAuthCookie;
            }
        }
        return authHeaders;
    },

    retrieveSystemData: function () {
        if ($widget.settings._predefinedSystems) {
            $.each($widget.onSystemListLoadedHandlers, function (idx, systemListLoadHandler) {
                systemListLoadHandler($widget.settings._systems);
            });
            return;
        }

        var params = {
            appID: $widget.settings._appId,
            uiLanguageID: $widget.settings._language
        }

        if ($widget.settings._getFilteredSystems) {
            params["options"] = "filter";
        }

        if ($widget.readCookie("show-public-systems")) {
            if (params["options"]) {
                params["options"] += ",public"
            } else {
                params["options"] = "public";
            }
        }

        $.ajax({
            dataType: $widget.settings._json_type,
            type: 'GET',
            url: $widget.settings._systemListUrl,
            headers: $widget.getAuthHeaders(),
            data: params,
            success: function (data) {
                $('.systemsLoading').addClass('hide');
                $('.translateContainerHeader').removeClass('hide');
                // filter by allowed statuses
                $widget.settings._systems = [];
                $.each(data.System, function (idx, sys) {
                    var status = $widget.getSystemMetaValue(sys.Metadata, 'status');
                    if ($widget.settings._allowedSystemStatuses.indexOf(status) !== -1) {
                        $widget.settings._systems.push(sys);
                    }
                });

                if (!$widget.settings._systems.length && !$widget.readCookie("show-public-systems") && !$widget.readCookie("show-private-systems")) {
                    document.cookie = "show-public-systems=true";
                    $widget.retrieveSystemData();
                    return;
                }

                $.each($widget.onSystemListLoadedHandlers, function (idx, systemListLoadHandler) {
                    systemListLoadHandler($widget.settings._systems);
                });
            },
            error: function () {
                if ($widget.settings._onGetSystemListError && typeof ($widget.settings._onGetSystemListError) === "function") {
                    $widget.settings._onGetSystemListError();
                }

                $('.systemsLoading').addClass('hide');
                $('.translateContainerHeader').removeClass('hide');

                $widget.settings.container
                    .text(uiResources[$widget.settings._language]['systemLoadError'])
                    .addClass('noNetwork');
            }
        });
    },

    getSystemMetaValue: function (array, key) {
        if (array === undefined) {
            return false;
        }
        var value = null;

        $.each(array, function (idx, item) {
            if (item.Key === key) {
                value = item.Value;
                return false; //breaks the loop
            }
        });

        return value;
    },

    setSystemMetaValue: function (systemId, key, value) {
        var system = null;
        $.each($widget.settings._systems, function (idx, sys) {
            if (sys.ID === systemId) {
                system = sys;
            }
        });

        if (system === null || system.Metadata === undefined) {
            return false;
        }

        $.each(system.Metadata, function (idx, item) {
            if (item.Key === key) {
                item.Value = value;
                return true; //breaks the loop
            }
        });

        return false;
    },

    systemLoadComplete: function () {
        if ($widget.settings._systemSelectType === 'system') {

            $.each($widget.settings._systems, function (idx, sys) {
                sys.order = $widget.getSystemMetaValue(sys.Metadata, 'order');
            });

            $widget.settings._systems.sort(function (a, b) {
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
                        var asort = 3, bsort = 3,
                            astat = $widget.getSystemMetaValue(a.Metadata, 'status'),
                            bstat = $widget.getSystemMetaValue(b.Metadata, 'status');

                        if (astat === 'running' || astat === 'queuingtransl')
                            asort = 1;
                        else if (astat === 'standby')
                            asort = 2;

                        if (bstat === 'running' || bstat === 'queuingtransl')
                            bsort = 1;
                        else if (bstat === 'standby')
                            bsort = 2;

                        if (asort === bsort) {
                            return a.Title.Text.toLowerCase() > b.Title.Text.toLowerCase() ? 1 : -1;
                        }
                        else {
                            return asort > bsort ? 1 : -1;
                        }
                    }
                }
            });

            $widget.fancySystem = $('.translateSystem', $widget.settings.container);
            $widget.fancySystem.empty();

            $.each($widget.settings._systems, function (idx, sys) {
                $widget.fancySystem.append($("<option/>", { value: sys.ID, text: sys.Title.Text }));
            });

            // default system
            if ($widget.settings._defaultSystem !== null) {
                $('.translateSystem', $widget.settings.container).val($widget.settings._defaultSystem);
            } else
            {
                if ($widget.settings._systems.length > 0) {
                    $('.translateSystem', $widget.settings.container).val($widget.settings._systems[0].ID);
                }
            }

            if(!$widget.fancySystem.parent().hasClass("fancy-select"))
            {
                $widget.fancySystem.fancySelect({
                    useNativeSelect: !$widget.settings._useFancySelect,
                    includeBlank: true,
                    triggerTemplate: function (el) {
                        if ($widget.activeSystemId !== el.val()) {
                            $widget.activeSystemId = el.val();

                            if ($widget.settings._onSystemChanged && typeof ($widget.settings._onSystemChanged) === "function") {
                                $widget.settings._onSystemChanged($widget.activeSystemId);
                            }

                            if ($widget.onSystemChangedHandlers) {
                                $.each($widget.onSystemChangedHandlers, function (idx, systemChangedHandler) {
                                    systemChangedHandler($widget.activeSystemId);
                                });
                            }
                        }
                        if (!el.val()) {
                            return "-";
                        } else {
                            return el.text();
                        }
                    }
                });
            }
        }

        if ($widget.settings._systemSelectType === 'language' || $widget.settings._systemSelectType === 'domain') {
            if ($widget.settings._sourceLanguageOrder || $widget.settings._targetLanguageOrder) {
                $.each($widget.settings._systems, function (idx, sys) {
                    var sourceIndex = -1;
                    var targetIndex = -1;
                    if ($widget.settings._sourceLanguageOrder) {
                        for (langIndex = 0; langIndex < $widget.settings._sourceLanguageOrder.length; langIndex++) {
                            if ($widget.settings._sourceLanguageOrder[langIndex] == sys.SourceLanguage.Code) {
                                sourceIndex = langIndex;
                            }
                        }
                    }
                    if ($widget.settings._targetLanguageOrder) {
                        for (langIndex = 0; langIndex < $widget.settings._targetLanguageOrder.length; langIndex++) {
                            if ($widget.settings._targetLanguageOrder[langIndex] == sys.TargetLanguage.Code) {
                                targetIndex = langIndex;
                            }
                        }
                    }
                    sys.order = 0;
                    if (sourceIndex > -1) {
                        sys.order = sys.order + sourceIndex * 100;
                    }
                    if (targetIndex > -1) {
                        sys.order = sys.order + targetIndex;
                    }
                });
                $widget.settings._systems.sort(function (a, b) {
                    if (typeof (b.order) !== "undefined" && b.order !== null) {
                        return a.order > b.order ? 1 : -1;
                    } else {
                        return -1;
                    }
                });
            }

            if ($widget.settings._defaultSystem)
            {
                $.each($widget.settings._systems, function (idx, sys) {
                    if (sys.ID === $widget.settings._defaultSystem) {
                        $widget.settings._defaultSourceLang = sys.SourceLanguage.Code;
                        $widget.settings._defaultTargetLang = sys.TargetLanguage.Code;
                    }
                });
            }
            // bind source lang list
            if ($widget.settings._systems) {
                $.each($widget.settings._systems, function (idx, sys) {
                    if ($('.translateSourceLang option[value="' + sys.SourceLanguage.Code + '"]', $widget.settings.container).length == 0) {
                        $('.translateSourceLang', $widget.settings.container).append($('<option>', {
                            value: sys.SourceLanguage.Code,
                            text: uiResources[$widget.settings._language][sys.SourceLanguage.Code] ? uiResources[$widget.settings._language][sys.SourceLanguage.Code] : sys.SourceLanguage.Name.Text
                        }));
                    }
                });
            }

            // if only one, replace source select with block
            if ($('.translateSourceLang option', $widget.settings.container).length === 1 && $widget.settings._replaceSourceWithBlock) {
                var srcSelect = $('.translateSourceLang', $widget.settings.container),
                    srcVal = srcSelect.val(),
                    srcText = srcSelect.text();

                srcSelect.replaceWith('<div class="translateSingleSourceLang" data-value="' + srcVal + '">' + srcText + '</div>');
                $widget.loadTargetLangList(srcVal, null, ($widget.settings._systemSelectType === 'language'));
            }
            else {
                // default source lang
                if ($widget.settings._defaultSourceLang !== null) {
                    $('.translateSourceLang option[value="' + $widget.settings._defaultSourceLang + '"]', $widget.settings.container).attr('selected', true);
                }

                $widget.fancySource = $('.translateSourceLang', $widget.settings.container);
                $widget.fancySource.fancySelect({
                    useNativeSelect: !$widget.settings._useFancySelect,
                    triggerTemplate: function (el) {
                        var targ = $widget.fancyTarget,
                            lang = targ && targ.length ? (targ[0].options && targ[0].options.length ?
                                   targ[0].options[targ[0].selectedIndex].lang : null) : $widget.settings._defaultTargetLang;
                        $widget.loadTargetLangList(el.val(), lang, ($widget.settings._systemSelectType === 'language'));
                        return ($widget.settings._customSelectText != '') ? $widget.settings._customSelectText : el.text();
                    }
                });
            }

            // swap system source and target
            if ($widget.settings._swapLanguages) {
                $('.swapLanguage', $widget.settings.container).off('click');
                $('.swapLanguage', $widget.settings.container).on('click', function () {
                    $widget.swapSystemLanguages();
                });


                $('#webSwapLanguage').off('click');

                $('#webSwapLanguage').on('click', function () {
                    $widget.swapSystemLanguages();
                });
            }
        }

        if ($widget.settings._systemSelectType === 'language') {
            $widget.fancyTarget = $('.translateTargetLang', $widget.settings.container);
            $widget.fancyTarget.fancySelect({
                useNativeSelect: !$widget.settings._useFancySelect,
                triggerTemplate: function (el) {
                    if ($widget.activeSystemId !== el.val()) {
                        $widget.activeSystemId = el.val();

                        // show or hide reverse system button
                        if ($widget.settings._swapLanguages) {
                            if ($widget.checkReverseSystem()) {
                                $('.swapLanguage', $widget.settings.container).removeClass('hide');
                            }
                            else {
                                $('.swapLanguage', $widget.settings.container).addClass('hide');
                            }
                        }

                        if ($widget.settings._onSystemChanged && typeof ($widget.settings._onSystemChanged) === "function") {
                            $widget.settings._onSystemChanged($widget.activeSystemId);
                        }

                        if ($widget.onSystemChangedHandlers) {
                            $.each($widget.onSystemChangedHandlers, function (idx, systemChangedHandler) {
                                systemChangedHandler($widget.activeSystemId);
                            });
                        }
                    }
                    return ($widget.settings._customSelectText != '') ? $widget.settings._customSelectText : el.text();
                }
            });
        }

        if ($widget.settings._systemSelectType === 'domain') {
            $('.translateDomainContainer', $widget.settings.container).removeClass('hide');

            // default target lang
            if ($widget.settings._defaultTargetLang !== null) {
                $('.translateTargetLang option[lang="' + $widget.settings._defaultTargetLang + '"]', $widget.settings.container).val($widget.settings._defaultTargetLang);
            }

            $widget.fancyTarget = $('.translateTargetLang', $widget.settings.container);
            $widget.fancyTarget.fancySelect({
                useNativeSelect: !$widget.settings._useFancySelect,
                triggerTemplate: function (el) {
                    var srcLang = $('.translateSourceLang', $widget.settings.container).val();
                    if ($('.translateSingleSourceLang', $widget.settings.container).length !== 0) {
                        srcLang = $('.translateSingleSourceLang', $widget.settings.container).attr('data-value');
                    }
                    $widget.loadDomainList(srcLang, el.val());
                    return el.text();
                }
            });

            // default domain
            if ($widget.settings._defaultDomain !== null) {
                $('.translateDomain option[domain="' + $widget.settings._defaultDomain + '"]', $widget.settings.container).prop('selected', true);
            }

            // domain init fancySelect
            $widget.fancyDomain = $('.translateDomain', $widget.settings.container);
            $widget.fancyDomain.fancySelect({
                useNativeSelect: !$widget.settings._useFancySelect,
                triggerTemplate: function (el) {
                    if ($widget.activeSystemId !== el.val() && typeof(el.val()) !== "undefined") {
                        $widget.activeSystemId = el.val();

                        if ($widget.settings._onSystemChanged && typeof ($widget.settings._onSystemChanged) === "function") {
                            $widget.settings._onSystemChanged($widget.activeSystemId);
                        }

                        if ($widget.onSystemChangedHandlers) {
                            $.each($widget.onSystemChangedHandlers, function (idx, systemChangedHandler) {
                                systemChangedHandler($widget.activeSystemId);
                            });
                        }
                    }
                    return el.text();
                }
            });

        }
    },

    onWidgetActivated: function () {
        // resize page content for old IE
        // by calling window onresize handlers after page content is loaded
        $(document).trigger("resize");
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

            /*$(".translateControlsContainer>*", $widget.settings.container).hide();
            $(".translateControlsContainer .translateProgress").show();
            $(".translateControlsContainer .translateProgress").removeClass("hide");*/
        }
        if ($widget.settings._onWidgetTemplateLoaded && typeof ($widget.settings._onWidgetTemplateLoaded) === "function") {
            $widget.settings._onWidgetTemplateLoaded();
        }
    },

    initWidgetLanguage: function () {
        var core = this;

        //override or extend ui translations
        uiResources[$widget.settings._language] = $.extend(uiResources[$widget.settings._language], $widget.settings._translations[$widget.settings._language]);

        $.each(uiResources[$widget.settings._language], function (id, txt) {
            $('[data-text="' + id + '"]', $widget.settings.container).text(txt);
            $('[data-html="' + id + '"]', $widget.settings.container).html(txt);
            $('[data-title="' + id + '"]', $widget.settings.container).attr('title', txt);
        });
    },

    setActiveSystem: function (systemId) {
        if (systemId === $widget.activeSystemId) { return; }

        var src = '', trg = '';
        if ($widget.settings._systems != null) {
            $.each($widget.settings._systems, function (idx, sys) {
                if (sys.ID === systemId) {
                    src = sys.SourceLanguage.Code;
                    trg = sys.TargetLanguage.Code;
                    return false;
                }
            });
        }

        if ($widget.settings._systemSelectType === 'language' || $widget.settings._systemSelectType === 'domain') {
            $('.translateSourceLang option[selected="selected"]', $widget.settings.container).removeAttr('selected');
            $('.translateSourceLang option[value="' + src + '"]', $widget.settings.container).prop('selected', true);

            if($widget.settings._systemSelectType === 'language'){
                $widget.loadTargetLangList(src, trg, true);
            } else if ($widget.settings._systemSelectType === 'domain') {
                $widget.loadTargetLangList(src, trg, false);
            }

            if ($widget.fancySource !== null) {
               // // RL
                //var newTriggerText = $('.translateSourceLang option[value="' + src + '"]', $widget.settings.container).html();
                //newTriggerText = angular.element($("#my_translator_app")).scope().localize(newTriggerText);
                //$('#source_lang_div .trigger').first().html(newTriggerText);
                $('#source_lang_div .options li').each(function () {
                    if ($(this).data("raw-value") != src) {
                        $(this).removeClass('selected');
                    } else {
                        $(this).addClass('selected');
                    }
                });
                // /RL
                $widget.fancySource.trigger('change.fs');
            }

            // RL
            if ($('.w .translateSourceLang') !== null) {
                $('.web_transl_types .options li').each(function () {
                    if ($(this).data("raw-value") != src) {
                        $(this).removeClass('selected');
                    } else {
                        $(this).addClass('selected');
                    }
                });
            }
            // /RL
        } else {
            $('.translateSystem option[selected="selected"]', $widget.settings.container).removeAttr('selected');
            $('.translateSystem option[value="' + systemId + '"]', $widget.settings.container).prop('selected', true);

            if ($('.translateSystem.fancified', $widget.settings.container)) {
                $('.translateSystem.fancified', $widget.settings.container).trigger('change.fs');
            }
        }
    },

    getActiveSystemObj: function () {
        if (!$widget.settings._systems) {
            return null;
        }
        var system = null;
        $.each($widget.settings._systems, function (idx, sys) {
            if (sys.ID === $widget.activeSystemId) {
                system = sys;
                return false;
            }
        });
        return system;
    },

    checkReverseSystem: function () {
        if (!$widget.settings._systems)
            return false;

        var src = '', trg = '', exist = false;

        // get active source and target
        $.each($widget.settings._systems, function (idx, sys) {
            if (sys.ID === $widget.activeSystemId) {
                src = sys.SourceLanguage.Code;
                trg = sys.TargetLanguage.Code;
            }
        });

        // find reverse
        $.each($widget.settings._systems, function (idx, sys) {
            if (sys.SourceLanguage.Code === trg && sys.TargetLanguage.Code === src) {
                exist = true;
            }
        });

        return exist;
    },

    swapSystemLanguages: function () {
        var src = '', trg = '';
        
        // RL
        if (!$widget.activeSystemId) {
            $widget.activeSystemId = $widget.settings._systems[0].ID;
        }
        // /RL

        // get active source and target
        $.each($widget.settings._systems, function (idx, sys) {
            if (sys.ID === $widget.activeSystemId) {
                src = sys.SourceLanguage.Code;
                trg = sys.TargetLanguage.Code;
                // RL
                return false;
                // /RL
            }
        });

        // find reverse
        $.each($widget.settings._systems, function (idx, sys) {
            if (sys.SourceLanguage.Code === trg && sys.TargetLanguage.Code === src) {
                $widget.setActiveSystem(sys.ID);
                // RL
                return false;
                // /RL
            }
        });
    },

    disableSystemChange: function () {
        $('.swapLanguage').attr('data-disabled', true);

        if ($widget.fancySource) $widget.fancySource.trigger('disable');
        if ($widget.fancyTarget) $widget.fancyTarget.trigger('disable');
        if ($widget.fancyDomain) $widget.fancyDomain.trigger('disable');
        if ($widget.fancySystem) $widget.fancySystem.trigger('disable');
        if ($widget.terminology) $widget.terminology.trigger('disable');
    },

    enableSystemChange: function () {
        $('.swapLanguage').attr('data-disabled', false);

        if ($widget.fancySource) $widget.fancySource.trigger('enable');
        if ($widget.fancyTarget) $widget.fancyTarget.trigger('enable');
        if ($widget.fancyDomain) $widget.fancyDomain.trigger('enable');
        if ($widget.fancySystem) $widget.fancySystem.trigger('enable');
        if ($widget.terminology) $widget.terminology.trigger('enable');
    },

    loadTargetLangList: function (source, selTarget, putSystemId) {
        $('.translateTargetLang', $widget.settings.container).empty();

        if ($widget.settings._systems) {
            $.each($widget.settings._systems, function (idx, sys) {
                if (sys.SourceLanguage.Code === source) {
                    if (putSystemId) {
                        // check unique in lang attribute
                        if ($('.translateTargetLang option[lang="' + sys.TargetLanguage.Code + '"]', $widget.settings.container).length === 0) {
                            $('.translateTargetLang', $widget.settings.container).append($('<option>', {
                                value: sys.ID,
                                text: uiResources[$widget.settings._language][sys.TargetLanguage.Code] ? uiResources[$widget.settings._language][sys.TargetLanguage.Code] : sys.TargetLanguage.Name.Text,
                                lang: sys.TargetLanguage.Code
                            }));
                        }
                    }
                    else {
                        // check unique in value attribute
                        if ($('.translateTargetLang option[lang="' + sys.TargetLanguage.Code + '"]', $widget.settings.container).length === 0) {
                            $('.translateTargetLang', $widget.settings.container).append($('<option>', {
                                value: sys.TargetLanguage.Code,
                                text: uiResources[$widget.settings._language][sys.TargetLanguage.Code] ? uiResources[$widget.settings._language][sys.TargetLanguage.Code] : sys.TargetLanguage.Name.Text
                            }));
                        }
                    }
                }
            });
        }

        // select target
        if (typeof selTarget !== 'undefined' && selTarget !== null) {
            var option = $('.translateTargetLang option[lang="' + selTarget + '"]', $widget.settings.container);
            if (option.length == 1) {
                $(option[0]).prop('selected', true);
            } else if ($widget.settings._defaultTargetLang) {
                $('.translateTargetLang option[lang="' + $widget.settings._defaultTargetLang + '"]', $widget.settings.container).prop('selected', true);
            }
        }

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
            $('.translateDomain option[domain="' + prevDomain + '"]', $widget.settings.container).prop('selected', true);
        }

        if ($widget.fancyDomain !== null) {
            $widget.fancyDomain.trigger('update.fs');
        }
    },

    readCookie: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
};
// patched with: https://github.com/octopuscreative/FancySelect/pull/52/files#r16327745
(function () {
    var $;

    $ = window.jQuery || window.Zepto || window.$;

    $.fn.fancySelect = function (opts) {
        var settings, clicking = false, clickingEvenHarder = false;
        if (opts == null) {
            opts = {};
        }
        settings = $.extend({
            useNativeSelect: false,
            includeBlank: false,
            optionTemplate: function (optionEl) {
                return optionEl.text();
            },
            triggerTemplate: function (optionEl) {
                return optionEl.text();
            }
        }, opts);
        return this.each(function () {
            var copyOptionsToList, disabled, options, sel, trigger, updateTriggerText, wrapper;
            sel = $(this);
            if (sel.hasClass('fancified') || sel[0].tagName !== 'SELECT') {
                return;
            }
            sel.addClass('fancified');
            if (settings.useNativeSelect) {
                sel.css({
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0
                });
            }
            else {
                sel.css({
                    width: 1,
                    height: 1,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0
                });
            }
            sel.wrap('<div class="fancy-select">');
            wrapper = sel.parent();
            if (sel.data('class')) {
                wrapper.addClass(sel.data('class'));
            }
            wrapper.append('<div class="trigger">');
            if (!settings.useNativeSelect) {
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
                if (clicking) return;
                if (clickingEvenHarder && !clicking) {
                    clickingEvenHarder = false;
                    sel.focus();
                    return;
                }
                if (trigger.hasClass('open')) {
                    return trigger.trigger('close.fs');
                }
            });
            trigger.on('close.fs', function () {
                clicking = false;
                trigger.removeClass('open');
                return options.removeClass('open');
            });
            trigger.on('mousedown.fs', function () {
                clicking = true;
            });
            trigger.on('click.fs', function () {
                clicking = false;
                var offParent, parent;
                if (!disabled) {
                    trigger.toggleClass('open');
                    if (settings.useNativeSelect) {
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
                        if (!settings.useNativeSelect) {
                            return sel.focus();
                        }
                    }
                }
            });
            sel.on('enable', function () {
                sel.prop('disabled', false);
                wrapper.removeClass('disabled');
                return disabled = false;
            });
            sel.on('disable', function () {
                sel.prop('disabled', true);
                wrapper.addClass('disabled');
                return disabled = true;
            });
            sel.on('change.fs', function (e) {
                if (settings.useNativeSelect) {
                    return updateTriggerText();
                }
                else if (e.originalEvent && e.originalEvent.isTrusted) {
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
                if (!settings.useNativeSelect) {
                    sel.trigger('blur.fs').trigger('focus.fs');
                }
                options.find('.selected').removeClass('selected');
                clicked.addClass('selected');
                trigger.addClass('selected');
                var something = sel.val(clicked.data('raw-value')).trigger('change.fs').trigger('blur.fs').trigger('focus.fs');
                clicking = false;
                clickingEvenHarder = false;
                return something;
            });
            options.on('mousedown', function () {
                clickingEvenHarder = true;
            });
            options.on('mouseup', function () {
                if (clickingEvenHarder) {
                    clickingEvenHarder = false;
                    sel.focus();
                }
                clicking = false;
            });
            options.on('mousedown.fs', 'li', function () {
                clicking = true;
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
                if (settings.useNativeSelect) {
                    return;
                }
                selOpts = sel.find('option');
                return sel.find('option').each(function(i, opt) {
                    var optHtml;
                    opt = $(opt);
                    if (!opt.prop('disabled') && (opt.val() || settings.includeBlank)) {
                        optHtml = settings.optionTemplate(opt);
                        if (opt.prop('selected')) {
                            // RL
                            //return options.append("<li data-raw-value=\"" + (opt.val()) + "\" class=\"selected\">" + optHtml + "</li>");
                            return options.append("<li data-raw-value=\"" + (opt.val()) + "\" class=\"selected\">" + angular.element($("#my_translator_app")).scope().localize(optHtml) + "</li>");
                            // /RL
                        } else {
                            // RL
                            //return options.append("<li data-raw-value=\"" + (opt.val()) + "\">" + optHtml + "</li>");
                            return options.append("<li data-raw-value=\"" + (opt.val()) + "\">" + angular.element($("#my_translator_app")).scope().localize(optHtml) + "</li>");
                            // /RL
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
/**
 * http://github.com/valums/file-uploader
 * 
 * Multiple file upload component with progress-bar, drag-and-drop. 
 * © 2010 Andrew Valums ( andrew(at)valums.com ) 
 * 
 * Licensed under GNU GPL 2 or later and GNU LGPL 2 or later, see license.txt.
 */    

//
// Helper functions
//

var qq = qq || {};

/**
 * Adds all missing properties from second obj to first obj
 */ 
qq.extend = function(first, second){
    for (var prop in second){
        first[prop] = second[prop];
    }
};  

/**
 * Searches for a given element in the array, returns -1 if it is not present.
 * @param {Number} [from] The index at which to begin the search
 */
qq.indexOf = function(arr, elt, from){
    if (arr.indexOf) return arr.indexOf(elt, from);
    
    from = from || 0;
    var len = arr.length;    
    
    if (from < 0) from += len;  

    for (; from < len; from++){  
        if (from in arr && arr[from] === elt){  
            return from;
        }
    }  
    return -1;  
}; 
    
qq.getUniqueId = (function(){
    var id = 0;
    return function(){ return id++; };
})();

//
// Events

qq.attach = function(element, type, fn){
    if (element.addEventListener){
        element.addEventListener(type, fn, false);
    } else if (element.attachEvent){
        element.attachEvent('on' + type, fn);
    }
};
qq.detach = function(element, type, fn){
    if (element.removeEventListener){
        element.removeEventListener(type, fn, false);
    } else if (element.attachEvent){
        element.detachEvent('on' + type, fn);
    }
};

qq.preventDefault = function(e){
    if (e.preventDefault){
        e.preventDefault();
    } else{
        e.returnValue = false;
    }
};

//
// Node manipulations

/**
 * Insert node a before node b.
 */
qq.insertBefore = function(a, b){
    b.parentNode.insertBefore(a, b);
};
qq.remove = function(element){
    element.parentNode.removeChild(element);
};

qq.contains = function(parent, descendant){       
    // compareposition returns false in this case
    if (parent == descendant) return true;
    
    if (parent.contains){
        return parent.contains(descendant);
    } else {
        return !!(descendant.compareDocumentPosition(parent) & 8);
    }
};

/**
 * Creates and returns element from html string
 * Uses innerHTML to create an element
 */
qq.toElement = (function(){
    var div = document.createElement('div');
    return function(html){
        div.innerHTML = html;
        var element = div.firstChild;
        div.removeChild(element);
        return element;
    };
})();

//
// Node properties and attributes

/**
 * Sets styles for an element.
 * Fixes opacity in IE6-8.
 */
qq.css = function(element, styles){
    if (styles.opacity != null){
        if (typeof element.style.opacity != 'string' && typeof(element.filters) != 'undefined'){
            styles.filter = 'alpha(opacity=' + Math.round(100 * styles.opacity) + ')';
        }
    }
    qq.extend(element.style, styles);
};
qq.hasClass = function(element, name){
    var re = new RegExp('(^| )' + name + '( |$)');
    return re.test(element.className);
};
qq.addClass = function(element, name){
    if (!qq.hasClass(element, name)){
        element.className += ' ' + name;
    }
};
qq.removeClass = function(element, name){
    var re = new RegExp('(^| )' + name + '( |$)');
    element.className = element.className.replace(re, ' ').replace(/^\s+|\s+$/g, "");
};
qq.setText = function(element, text){
    element.innerText = text;
    element.textContent = text;
};

//
// Selecting elements

qq.children = function(element){
    var children = [],
    child = element.firstChild;

    while (child){
        if (child.nodeType == 1){
            children.push(child);
        }
        child = child.nextSibling;
    }

    return children;
};

qq.getByClass = function(element, className){
    if (element.querySelectorAll){
        return element.querySelectorAll('.' + className);
    }

    var result = [];
    var candidates = element.getElementsByTagName("*");
    var len = candidates.length;

    for (var i = 0; i < len; i++){
        if (qq.hasClass(candidates[i], className)){
            result.push(candidates[i]);
        }
    }
    return result;
};

/**
 * obj2url() takes a json-object as argument and generates
 * a querystring. pretty much like jQuery.param()
 * 
 * how to use:
 *
 *    `qq.obj2url({a:'b',c:'d'},'http://any.url/upload?otherParam=value');`
 *
 * will result in:
 *
 *    `http://any.url/upload?otherParam=value&a=b&c=d`
 *
 * @param  Object JSON-Object
 * @param  String current querystring-part
 * @return String encoded querystring
 */
qq.obj2url = function(obj, temp, prefixDone){
    var uristrings = [],
        prefix = '&',
        add = function(nextObj, i){
            var nextTemp = temp 
                ? (/\[\]$/.test(temp)) // prevent double-encoding
                   ? temp
                   : temp+'['+i+']'
                : i;
            if ((nextTemp != 'undefined') && (i != 'undefined')) {  
                uristrings.push(
                    (typeof nextObj === 'object') 
                        ? qq.obj2url(nextObj, nextTemp, true)
                        : (Object.prototype.toString.call(nextObj) === '[object Function]')
                            ? encodeURIComponent(nextTemp) + '=' + encodeURIComponent(nextObj())
                            : encodeURIComponent(nextTemp) + '=' + encodeURIComponent(nextObj)                                                          
                );
            }
        }; 

    if (!prefixDone && temp) {
      prefix = (/\?/.test(temp)) ? (/\?$/.test(temp)) ? '' : '&' : '?';
      uristrings.push(temp);
      uristrings.push(qq.obj2url(obj));
    } else if ((Object.prototype.toString.call(obj) === '[object Array]') && (typeof obj != 'undefined') ) {
        // we wont use a for-in-loop on an array (performance)
        for (var i = 0, len = obj.length; i < len; ++i){
            add(obj[i], i);
        }
    } else if ((typeof obj != 'undefined') && (obj !== null) && (typeof obj === "object")){
        // for anything else but a scalar, we will use for-in-loop
        for (var i in obj){
            add(obj[i], i);
        }
    } else {
        uristrings.push(encodeURIComponent(temp) + '=' + encodeURIComponent(obj));
    }

    return uristrings.join(prefix)
                     .replace(/^&/, '')
                     .replace(/%20/g, '+'); 
};

//
//
// Uploader Classes
//
//

var qq = qq || {};
    
/**
 * Creates upload button, validates upload, but doesn't create file list or dd. 
 */
qq.FileUploaderBasic = function(o){
    this._options = {
        // set to true to see the server response
        debug: false,
        action: '/server/upload',
        headers: null,
        params: {},
        button: null,
        multiple: true,
        maxConnections: 3,
        // validation        
        allowedExtensions: [],
        allowedMimetypes: [],
        sizeLimit: 0,   
        minSizeLimit: 0,                             
        // events
        // return false to cancel submit
        onSubmit: function(id, fileName){},
        onProgress: function(id, fileName, loaded, total){},
        onComplete: function(id, fileName, responseJSON){},
        onCancel: function(id, fileName){},
        // messages                
        messages: {
            typeError: "{file} has invalid extension. Only {extensions} are allowed.",
            sizeError: "{file} is too large, maximum file size is {sizeLimit}.",
            minSizeError: "{file} is too small, minimum file size is {minSizeLimit}.",
            emptyError: "{file} is empty, please select files again without it.",
            onLeave: "The files are being uploaded, if you leave now the upload will be cancelled."            
        },
        showMessage: function(message){
            alert(message);
        }               
    };
    qq.extend(this._options, o);
        
    // number of files being uploaded
    this._filesInProgress = 0;
    this._handler = this._createUploadHandler(); 
    
    if (this._options.button){ 
        this._button = this._createUploadButton(this._options.button);
    }
                        
    this._preventLeaveInProgress();         
};
   
qq.FileUploaderBasic.prototype = {
    setParams: function(params){
        this._options.params = params;
    },
    getInProgress: function(){
        return this._filesInProgress;         
    },
    _createUploadButton: function(element){
        var self = this;
        
        return new qq.UploadButton({
            element: element,
            multiple: this._options.multiple && qq.UploadHandlerXhr.isSupported(),
            allowedMimetypes: this._options.allowedMimetypes,
            onChange: function (input) {
                self._onInputChange(input);
            }        
        });           
    },    
    _createUploadHandler: function(){
        var self = this,
            handlerClass;        
        
        if(qq.UploadHandlerXhr.isSupported()){           
            handlerClass = 'UploadHandlerXhr';                        
        } else {
            handlerClass = 'UploadHandlerForm';
        }

        var handler = new qq[handlerClass]({
            debug: this._options.debug,
            action: this._options.action,         
            headers: this._options.headers,
            maxConnections: this._options.maxConnections,
            onProgress: function(id, fileName, loaded, total){                
                self._onProgress(id, fileName, loaded, total);
                self._options.onProgress(id, fileName, loaded, total);                    
            },            
            onComplete: function(id, fileName, result){
                self._onComplete(id, fileName, result);
                self._options.onComplete(id, fileName, result);
            },
            onCancel: function(id, fileName){
                self._onCancel(id, fileName);
                self._options.onCancel(id, fileName);
            }
        });

        return handler;
    },    
    _preventLeaveInProgress: function(){
        var self = this;
        
        qq.attach(window, 'beforeunload', function(e){
            if (!self._filesInProgress){return;}
            
            var e = e || window.event;
            // for ie, ff
            e.returnValue = self._options.messages.onLeave;
            // for webkit
            return self._options.messages.onLeave;             
        });        
    },    
    _onSubmit: function(id, fileName){
        this._filesInProgress++;  
    },
    _onProgress: function(id, fileName, loaded, total){        
    },
    _onComplete: function(id, fileName, result){
        this._filesInProgress--;                 
        if (result.error){
            this._options.showMessage(result.error);
        }             
    },
    _onCancel: function(id, fileName){
        this._filesInProgress--;        
    },
    _onInputChange: function(input){
        if (this._handler instanceof qq.UploadHandlerXhr){                
            this._uploadFileList(input.files);                   
        } else {             
            if (this._validateFile(input)){                
                this._uploadFile(input);                                    
            }                      
        }               
        this._button.reset();   
    },  
    _uploadFileList: function(files){
        for (var i=0; i<files.length; i++){
            if ( !this._validateFile(files[i])){
                return;
            }            
        }
        
        for (var i=0; i<files.length; i++){
            this._uploadFile(files[i]);        
        }        
    },       
    _uploadFile: function(fileContainer){      
        var id = this._handler.add(fileContainer);
        var fileName = this._handler.getName(id);
        
        if (this._options.onSubmit(id, fileName) !== false){
            this._onSubmit(id, fileName);
            this._handler.upload(id, this._options.params);
        }
    },      
    _validateFile: function(file){
        var name, size;
        
        if (file.value){
            // it is a file input            
            // get input value and remove path to normalize
            name = file.value.replace(/.*(\/|\\)/, "");
        } else {
            // fix missing properties in Safari
            name = file.fileName != null ? file.fileName : file.name;
            size = file.fileSize != null ? file.fileSize : file.size;
        }

        if (name)
        {
            name = decodeURIComponent(name); // android file picker may urlencode unicode characters
        }
                    
        if (! this._isAllowedExtension(name)){            
            this._error('typeError', name);
            return false;
            
        } else if (size === 0){            
            this._error('emptyError', name);
            return false;
                                                     
        } else if (size && this._options.sizeLimit && size > this._options.sizeLimit){            
            this._error('sizeError', name);
            return false;
                        
        } else if (size && size < this._options.minSizeLimit){
            this._error('minSizeError', name);
            return false;            
        }
        
        return true;                
    },
    _error: function(code, fileName){
        var message = this._options.messages[code];        
        function r(name, replacement){ message = message.replace(name, replacement); }
        
        r('{file}', this._formatFileName(fileName));        
        r('{extensions}', this._options.allowedExtensions.join(', '));
        r('{sizeLimit}', this._formatSize(this._options.sizeLimit));
        r('{minSizeLimit}', this._formatSize(this._options.minSizeLimit));
        
        this._options.showMessage(message);                
    },
    _formatFileName: function(name){
        // Keep original file name no matter how it looks like
        //if (name.length > 33){
        //    name = name.slice(0, 19) + '...' + name.slice(-13);    
        //}
        return name;
    },
    _isAllowedExtension: function(fileName){
        var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
        var allowed = this._options.allowedExtensions;
        
        if (!allowed.length){return true;}        
        
        for (var i=0; i<allowed.length; i++){
            if (allowed[i].toLowerCase() == ext){ return true;}    
        }
        
        return false;
    },    
    _formatSize: function(bytes){
        var i = -1;                                    
        do {
            bytes = bytes / 1024;
            i++;  
        } while (bytes > 999);
        
        return +bytes.toFixed(2) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
    }
};
    
       
/**
 * Class that creates upload widget with drag-and-drop and file list
 * @inherits qq.FileUploaderBasic
 */
qq.FileUploader = function(o){
    // call parent constructor
    qq.FileUploaderBasic.apply(this, arguments);
    
    // additional options    
    qq.extend(this._options, {
        element: null,
        // if set, will be used instead of qq-upload-list in template
        listElement: null,
                
        template: '<div class="qq-uploader">' + 
                '<div class="qq-upload-drop-area"><span>Drop files here to upload</span></div>' +
                '<div class="qq-upload-button">Upload a file</div>' +
                '<ul class="qq-upload-list"></ul>' + 
             '</div>',

        // template for one item in file list
        fileTemplate: '<li>' +
                '<span class="qq-upload-file"></span>' +
                '<span class="qq-upload-spinner"></span>' +
                '<span class="qq-upload-size"></span>' +
                '<a class="qq-upload-cancel" href="#">Cancel</a>' +
                '<span class="qq-upload-failed-text">Failed</span>' +
            '</li>',        
        
        classes: {
            // used to get elements from templates
            button: 'qq-upload-button',
            drop: 'qq-upload-drop-area',
            dropActive: 'qq-upload-drop-area-active',
            list: 'qq-upload-list',
                        
            file: 'qq-upload-file',
            spinner: 'qq-upload-spinner',
            size: 'qq-upload-size',
            cancel: 'qq-upload-cancel',

            // added to list item when upload completes
            // used in css to hide progress spinner
            success: 'qq-upload-success',
            fail: 'qq-upload-fail'
        }
    });
    // overwrite options with user supplied    
    qq.extend(this._options, o);       

    this._element = this._options.element;
    this._element.innerHTML = this._options.template;        
    this._listElement = this._options.listElement || this._find(this._element, 'list');
    
    this._classes = this._options.classes;
        
    this._button = this._createUploadButton(this._find(this._element, 'button'));        
    
    this._bindCancelEvent();
    this._setupDragDrop();
};

// inherit from Basic Uploader
qq.extend(qq.FileUploader.prototype, qq.FileUploaderBasic.prototype);

qq.extend(qq.FileUploader.prototype, {
    /**
     * Gets one of the elements listed in this._options.classes
     **/
    _find: function(parent, type){                                
        var element = qq.getByClass(parent, this._options.classes[type])[0];        
        if (!element){
            throw new Error('element not found ' + type);
        }
        
        return element;
    },
    _setupDragDrop: function(){
        var self = this,
            dropArea = this._find(this._element, 'drop');                        

        var dz = new qq.UploadDropZone({
            element: dropArea,
            onEnter: function(e){
                qq.addClass(dropArea, self._classes.dropActive);
                e.stopPropagation();
            },
            onLeave: function(e){
                e.stopPropagation();
            },
            onLeaveNotDescendants: function(e){
                qq.removeClass(dropArea, self._classes.dropActive);  
            },
            onDrop: function(e){
                dropArea.style.display = 'none';
                qq.removeClass(dropArea, self._classes.dropActive);
                self._uploadFileList(e.dataTransfer.files);    
            }
        });
                
        dropArea.style.display = 'none';

        qq.attach(document, 'dragenter', function(e){     
            if (!dz._isValidFileDrag(e)) return; 
            
            dropArea.style.display = 'block';            
        });                 
        qq.attach(document, 'dragleave', function(e){
            if (!dz._isValidFileDrag(e)) return;            
            
            var relatedTarget = document.elementFromPoint(e.clientX, e.clientY);
            // only fire when leaving document out
            if ( ! relatedTarget || relatedTarget.nodeName == "HTML"){               
                dropArea.style.display = 'none';                                            
            }
        });                
    },
    _onSubmit: function(id, fileName){
        qq.FileUploaderBasic.prototype._onSubmit.apply(this, arguments);
        this._addToList(id, fileName);  
    },
    _onProgress: function(id, fileName, loaded, total){
        qq.FileUploaderBasic.prototype._onProgress.apply(this, arguments);

        var item = this._getItemByFileId(id);
        var size = this._find(item, 'size');
        size.style.display = 'inline';
        
        var text; 
        if (loaded != total){
            text = Math.round(loaded / total * 100) + '% from ' + this._formatSize(total);
        } else {                                   
            text = this._formatSize(total);
        }          
        
        qq.setText(size, text);         
    },
    _onComplete: function(id, fileName, result){
        qq.FileUploaderBasic.prototype._onComplete.apply(this, arguments);

        // mark completed
        var item = this._getItemByFileId(id);                
        qq.remove(this._find(item, 'cancel'));
        //qq.remove(this._find(item, 'spinner'));
        
        if (result.success){
            qq.addClass(item, this._classes.success);    
        } else {
            qq.addClass(item, this._classes.fail);
        }         
    },
    _addToList: function(id, fileName){
        var item = qq.toElement(this._options.fileTemplate);                
        item.qqFileId = id;

        var fileElement = this._find(item, 'file');        
        qq.setText(fileElement, this._formatFileName(fileName));
        this._find(item, 'size').style.display = 'none';        

        this._listElement.appendChild(item);
    },
    _getItemByFileId: function(id){
        var item = this._listElement.firstChild;        
        
        // there can't be txt nodes in dynamically created list
        // and we can  use nextSibling
        while (item){            
            if (item.qqFileId == id) return item;            
            item = item.nextSibling;
        }          
    },
    /**
     * delegate click event for cancel link 
     **/
    _bindCancelEvent: function(){
        var self = this,
            list = this._listElement;            
        
        qq.attach(list, 'click', function(e){            
            e = e || window.event;
            var target = e.target || e.srcElement;
            
            if (qq.hasClass(target, self._classes.cancel)){                
                qq.preventDefault(e);
               
                var item = target.parentNode;
                self._handler.cancel(item.qqFileId);
                qq.remove(item);
            }
        });
    }    
});
    
qq.UploadDropZone = function(o){
    this._options = {
        element: null,  
        onEnter: function(e){},
        onLeave: function(e){},  
        // is not fired when leaving element by hovering descendants   
        onLeaveNotDescendants: function(e){},   
        onDrop: function(e){}                       
    };
    qq.extend(this._options, o); 
    
    this._element = this._options.element;
    
    this._disableDropOutside();
    this._attachEvents();   
};

qq.UploadDropZone.prototype = {
    _disableDropOutside: function(e){
        // run only once for all instances
        if (!qq.UploadDropZone.dropOutsideDisabled ){

            qq.attach(document, 'dragover', function(e){
                if (e.dataTransfer){
                    e.dataTransfer.dropEffect = 'none';
                    e.preventDefault(); 
                }           
            });
            
            qq.UploadDropZone.dropOutsideDisabled = true; 
        }        
    },
    _attachEvents: function(){
        var self = this;              
                  
        qq.attach(self._element, 'dragover', function(e){
            if (!self._isValidFileDrag(e)) return;
            
            var effect = e.dataTransfer.effectAllowed;
            if (effect == 'move' || effect == 'linkMove'){
                e.dataTransfer.dropEffect = 'move'; // for FF (only move allowed)    
            } else {                    
                e.dataTransfer.dropEffect = 'copy'; // for Chrome
            }
                                                     
            e.stopPropagation();
            e.preventDefault();                                                                    
        });
        
        qq.attach(self._element, 'dragenter', function(e){
            if (!self._isValidFileDrag(e)) return;
                        
            self._options.onEnter(e);
        });
        
        qq.attach(self._element, 'dragleave', function(e){
            if (!self._isValidFileDrag(e)) return;
            
            self._options.onLeave(e);
            
            var relatedTarget = document.elementFromPoint(e.clientX, e.clientY);                      
            // do not fire when moving a mouse over a descendant
            if (qq.contains(this, relatedTarget)) return;
                        
            self._options.onLeaveNotDescendants(e); 
        });
                
        qq.attach(self._element, 'drop', function(e){
            if (!self._isValidFileDrag(e)) return;
            
            e.preventDefault();
            self._options.onDrop(e);
        });          
    },
    _isValidFileDrag: function(e){
        var dt = e.dataTransfer,
            // do not check dt.types.contains in webkit, because it crashes safari 4            
            isWebkit = navigator.userAgent.indexOf("AppleWebKit") > -1;                        

        // dt.effectAllowed is none in Safari 5
        // dt.types.contains check is for firefox            
        return dt && dt.effectAllowed != 'none' && 
            (dt.files || (!isWebkit && dt.types.contains && dt.types.contains('Files')));
        
    }        
}; 

qq.UploadButton = function(o){
    this._options = {
        element: null,  
        // if set to true adds multiple attribute to file input      
        multiple: false,
        allowedMimetypes: [],
        // name attribute of file input
        name: 'file',
        onChange: function(input){},
        hoverClass: 'qq-upload-button-hover',
        focusClass: 'qq-upload-button-focus'                       
    };
    
    qq.extend(this._options, o);
        
    this._element = this._options.element;
    
    // make button suitable container for input
    qq.css(this._element, {
        position: 'relative',
        overflow: 'hidden',
        // Make sure browse button is in the right side
        // in Internet Explorer
        direction: 'ltr'
    });   
    
    this._input = this._createInput();
};

qq.UploadButton.prototype = {
    /* returns file input element */    
    getInput: function(){
        return this._input;
    },
    /* cleans/recreates the file input */
    reset: function(){
        if (this._input.parentNode){
            qq.remove(this._input);    
        }                
        
        qq.removeClass(this._element, this._options.focusClass);
        this._input = this._createInput();
    },    
    _createInput: function(){                
        var input = document.createElement("input");
        
        if (this._options.multiple){
            input.setAttribute("multiple", "multiple");
        }
                
        input.setAttribute("type", "file");
        // Edge browser does not open file picker dialog
        // if there is application/xhtml+xml in accepted file type list
        if (navigator.userAgent.indexOf("Edge") > -1 && this._options.allowedMimetypes) {
            var filteredMimeTypes = [];
            for (var counter = 0; counter < this._options.allowedMimetypes.length; counter++) {
                if (this._options.allowedMimetypes[counter] != "application/xhtml+xml") {
                    filteredMimeTypes.push(this._options.allowedMimetypes[counter]);
                }
            }
            input.setAttribute("accept", filteredMimeTypes.join(', '));
        } else {
            input.setAttribute("accept", this._options.allowedMimetypes.join(', '));
        }
        input.setAttribute("name", this._options.name);
        
        qq.css(input, {
            position: 'absolute',
            // in Opera and in IE10 only 'browse' button
            // is clickable and it is located at
            // the right side of the input
            right: 0,
            top: 0,
            /*fontFamily: 'Arial',*/
            // 4 persons reported this, the max values that worked for them were 243, 236, 236, 118
            fontSize: '180px',
            height: '100%',
            //width: '100%',
            margin: 0,
            padding: 0,
            cursor: 'pointer',
            opacity: 0
        });
        
        this._element.appendChild(input);

        var self = this;
        qq.attach(input, 'change', function(){
            self._options.onChange(input);
        });
                
        qq.attach(input, 'mouseover', function(){
            qq.addClass(self._element, self._options.hoverClass);
        });
        qq.attach(input, 'mouseout', function(){
            qq.removeClass(self._element, self._options.hoverClass);
        });
        qq.attach(input, 'focus', function(){
            qq.addClass(self._element, self._options.focusClass);
        });
        qq.attach(input, 'blur', function(){
            qq.removeClass(self._element, self._options.focusClass);
        });

        // IE and Opera, unfortunately have 2 tab stops on file input
        // which is unacceptable in our case, disable keyboard access
        if (window.attachEvent){
            // it is IE or Opera
            input.setAttribute('tabIndex', "-1");
        }

        return input;            
    }        
};

/**
 * Class for uploading files, uploading itself is handled by child classes
 */
qq.UploadHandlerAbstract = function(o){
    this._options = {
        debug: false,
        action: '/upload.php',
        headers: null,
        // maximum number of concurrent uploads        
        maxConnections: 999,
        onProgress: function(id, fileName, loaded, total){},
        onComplete: function(id, fileName, response){},
        onCancel: function(id, fileName){}
    };
    qq.extend(this._options, o);    
    
    this._queue = [];
    // params for files in queue
    this._params = [];
};
qq.UploadHandlerAbstract.prototype = {
    log: function(str){
        if (this._options.debug && typeof (console) !== "undefined") console.log('[uploader] ' + str);
    },
    /**
     * Adds file or file input to the queue
     * @returns id
     **/    
    add: function(file){},
    /**
     * Sends the file identified by id and additional query params to the server
     */
    upload: function(id, params){
        var len = this._queue.push(id);

        var copy = {};        
        qq.extend(copy, params);
        this._params[id] = copy;        
                
        // if too many active uploads, wait...
        if (len <= this._options.maxConnections){               
            this._upload(id, this._params[id]);
        }
    },
    /**
     * Cancels file upload by id
     */
    cancel: function(id){
        this._cancel(id);
        this._dequeue(id);
    },
    /**
     * Cancells all uploads
     */
    cancelAll: function(){
        for (var i=0; i<this._queue.length; i++){
            this._cancel(this._queue[i]);
        }
        this._queue = [];
    },
    /**
     * Returns name of the file identified by id
     */
    getName: function(id){},
    /**
     * Returns size of the file identified by id
     */          
    getSize: function(id){},
    /**
     * Returns id of files being uploaded or
     * waiting for their turn
     */
    getQueue: function(){
        return this._queue;
    },
    /**
     * Actual upload method
     */
    _upload: function(id){},
    /**
     * Actual cancel method
     */
    _cancel: function(id){},     
    /**
     * Removes element from queue, starts upload of next
     */
    _dequeue: function(id){
        var i = qq.indexOf(this._queue, id);
        this._queue.splice(i, 1);
                
        var max = this._options.maxConnections;
        
        if (this._queue.length >= max && i < max){
            var nextId = this._queue[max-1];
            this._upload(nextId, this._params[nextId]);
        }
    }        
};

/**
 * Class for uploading files using form and iframe
 * @inherits qq.UploadHandlerAbstract
 */
qq.UploadHandlerForm = function(o){
    qq.UploadHandlerAbstract.apply(this, arguments);
       
    this._inputs = {};
};
// @inherits qq.UploadHandlerAbstract
qq.extend(qq.UploadHandlerForm.prototype, qq.UploadHandlerAbstract.prototype);

qq.extend(qq.UploadHandlerForm.prototype, {
    add: function(fileInput){
        fileInput.setAttribute('name', 'fname');
        var id = 'qq-upload-handler-iframe' + qq.getUniqueId();       
        
        this._inputs[id] = fileInput;
        
        // remove file input from DOM
        if (fileInput.parentNode){
            qq.remove(fileInput);
        }
                
        return id;
    },
    getName: function(id){
        // get input value and remove path to normalize
        return this._inputs[id].value.replace(/.*(\/|\\)/, "");
    },    
    _cancel: function(id){
        this._options.onCancel(id, this.getName(id));
        
        delete this._inputs[id];        

        var iframe = document.getElementById(id);
        if (iframe){
            // to cancel request set src to something else
            // we use src="javascript:false;" because it doesn't
            // trigger ie6 prompt on https
            iframe.setAttribute('src', 'javascript:false;');

            qq.remove(iframe);
        }
    },     
    _upload: function(id, params){                        
        var input = this._inputs[id];
        
        if (!input){
            throw new Error('file with passed id was not added, or already uploaded or cancelled');
        }                

        var fileName = this.getName(id);
                
        var iframe = this._createIframe(id);
        var form = this._createForm(iframe, params);
        form.appendChild(input);

        var self = this;
        this._attachLoadEvent(iframe, function(){                                 
            self.log('iframe loaded');
            
            var response = self._getIframeContentJSON(iframe);

            self._options.onComplete(id, fileName, response);
            self._dequeue(id);
            
            delete self._inputs[id];
            // timeout added to fix busy state in FF3.6
            setTimeout(function(){
                qq.remove(iframe);
            }, 1);
        });

        form.submit();        
        qq.remove(form);        
        
        return id;
    }, 
    _attachLoadEvent: function(iframe, callback){
        qq.attach(iframe, 'load', function(){
            // when we remove iframe from dom
            // the request stops, but in IE load
            // event fires
            if (!iframe.parentNode){
                return;
            }

            // fixing Opera 10.53
            if (iframe.contentDocument &&
                iframe.contentDocument.body &&
                iframe.contentDocument.body.innerHTML == "false"){
                // In Opera event is fired second time
                // when body.innerHTML changed from false
                // to server response approx. after 1 sec
                // when we upload file with iframe
                return;
            }

            callback();
        });
    },
    /**
     * Returns json object received by iframe from server.
     */
    _getIframeContentJSON: function(iframe){
        // iframe.contentWindow.document - for IE<7
        var doc = iframe.contentDocument ? iframe.contentDocument: iframe.contentWindow.document,
            response;
        
        this.log("converting iframe's innerHTML to JSON");
        this.log("innerHTML = " + doc.body.outerText);
                        
        try {
            response = eval("(" + doc.body.outerText + ")");
        } catch(err){
            response = {};
        }        

        return response;
    },
    /**
     * Creates iframe with unique name
     */
    _createIframe: function(id){
        // We can't use following code as the name attribute
        // won't be properly registered in IE6, and new window
        // on form submit will open
        // var iframe = document.createElement('iframe');
        // iframe.setAttribute('name', id);

        var iframe = qq.toElement('<iframe src="javascript:false;" name="' + id + '" />');
        // src="javascript:false;" removes ie6 prompt on https

        iframe.setAttribute('id', id);

        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        return iframe;
    },
    /**
     * Creates form, that will be submitted to iframe
     */
    _createForm: function(iframe, params){
        // We can't use the following code in IE6
        // var form = document.createElement('form');
        // form.setAttribute('method', 'post');
        // form.setAttribute('enctype', 'multipart/form-data');
        // Because in this case file won't be attached to request
        var form = qq.toElement('<form method="post" enctype="multipart/form-data"></form>');

        var queryString = qq.obj2url(params, this._options.action);

        form.setAttribute('action', queryString);
        form.setAttribute('target', iframe.name);
        form.style.display = 'none';
        document.body.appendChild(form);

        return form;
    }
});

/**
 * Class for uploading files using xhr
 * @inherits qq.UploadHandlerAbstract
 */
qq.UploadHandlerXhr = function(o){
    qq.UploadHandlerAbstract.apply(this, arguments);

    this._files = [];
    this._xhrs = [];
    
    // current loaded size in bytes for each file 
    this._loaded = [];
};

// static method
qq.UploadHandlerXhr.isSupported = function(){
    var input = document.createElement('input');
    input.type = 'file';        
    
    return (
        'multiple' in input &&
        typeof File != "undefined" &&
        typeof (new XMLHttpRequest()).upload != "undefined" );       
};

// @inherits qq.UploadHandlerAbstract
qq.extend(qq.UploadHandlerXhr.prototype, qq.UploadHandlerAbstract.prototype)

qq.extend(qq.UploadHandlerXhr.prototype, {
    /**
     * Adds file to the queue
     * Returns id to use with upload, cancel
     **/    
    add: function(file){
        if (!(file instanceof File)){
            throw new Error('Passed obj in not a File (in qq.UploadHandlerXhr)');
        }
                
        return this._files.push(file) - 1;        
    },
    getName: function(id){        
        var file = this._files[id];
        // fix missing name in Safari 4
        var name = file.fileName != null ? file.fileName : file.name;
        if (name) {
            return decodeURIComponent(name); // android file picker may urlencode unicode characters
        }
        else {
            return name;
        }
    },
    getSize: function(id){
        var file = this._files[id];
        return file.fileSize != null ? file.fileSize : file.size;
    },    
    /**
     * Returns uploaded bytes for file identified by id 
     */    
    getLoaded: function(id){
        return this._loaded[id] || 0; 
    },
    /**
     * Sends the file identified by id and additional query params to the server
     * @param {Object} params name-value string pairs
     */    
    _upload: function (id, params) {
        var file = this._files[id],
            name = this.getName(id),
            size = this.getSize(id);
                
        this._loaded[id] = 0;
                                
        var xhr = this._xhrs[id] = new XMLHttpRequest();
        var self = this;
                                        
        xhr.upload.onprogress = function(e){
            if (e.lengthComputable){
                self._loaded[id] = e.loaded;
                self._options.onProgress(id, name, e.loaded, e.total);
            }
        };

        xhr.onreadystatechange = function(){            
            if (xhr.readyState == 4){
                self._onComplete(id, xhr);                    
            }
        };

        // build query string
        params = params || {};
        params['fname'] = name;
        var queryString = qq.obj2url(params, this._options.action);

        xhr.open("POST", queryString, true);
        for (var header in this._options.headers) {
            if (this._options.headers.hasOwnProperty(header)) {
                xhr.setRequestHeader(header, this._options.headers[header]);
            }
        }
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("X-File-Name", encodeURIComponent(name));
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.send(file);
    },
    _onComplete: function(id, xhr){
        // the request was aborted/cancelled
        if (!this._files[id]) return;
        
        var name = this.getName(id);
        var size = this.getSize(id);
        
        this._options.onProgress(id, name, size, size);
                
        if (xhr.status == 200){
            this.log("xhr - server response received");
            this.log("responseText = " + xhr.responseText);
                        
            var response;
                    
            try {
                response = eval("(" + xhr.responseText + ")");
            } catch(err){
                response = {};
            }
            
            this._options.onComplete(id, name, response);
                        
        } else {                   
            this._options.onComplete(id, name, {error: "Fail. HTTP status: " + xhr.status + " " + xhr.statusText});
        }
                
        this._files[id] = null;
        this._xhrs[id] = null;    
        this._dequeue(id);                    
    },
    _cancel: function(id){
        this._options.onCancel(id, this.getName(id));
        
        this._files[id] = null;
        
        if (this._xhrs[id]){
            this._xhrs[id].abort();
            this._xhrs[id] = null;                                   
        }
    }
});
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
/* tilde.translator.widget.RECENTLANGS.js */

$.extend(Tilde.TranslatorWidgetDefaultOptions, {
    _useRecentLangSelector: false
});

$.extend(Tilde.TranslatorWidget.prototype, {

    recentlangsPluginInit: function () {
        if (!$widget.settings._useRecentLangSelector) {
            return;
        }
        $widget.onSystemListLoadedHandlers.push(function () {
            $widget.loadPopularSourceLangList();
            $widget.loadPopularTargetLangList();
        });

        $widget.onSystemChangedHandlers.push(function (systemId) {
            $widget.changePopularLangList(systemId);
        });

        $(document).on('click', '.popSourceLangs li', function () {
            if (!$(this).hasClass('active')) {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
            }
            $('.translateSourceLang option[value="' + $(this).attr('data-value') + '"]').prop('selected', true);
            $widget.fancySource.trigger('update.fs');
        });

        $(document).on('click', '.popTargetLangs li', function () {
            if (!$(this).hasClass('active')) {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
            }
            $('.translateTargetLang option[lang="' + $(this).attr('data-value') + '"]').prop('selected', true);
            $widget.fancyTarget.trigger('update.fs');
        });

        $(window).on('resize', function () {
            $widget.loadPopularSourceLangList();
            $widget.loadPopularTargetLangList();
        });
    },

    loadPopularSourceLangList: function (languageCount) {
        if(!languageCount)
            languageCount = 3;
        languageIndexes = [];
        // select first N languages. always include selected language even if it is not in first N
        $('.translateSourceLang option').each(function (idx) {
            if (idx < languageCount) {
                languageIndexes.push(idx);
            } else if ($(this).val() === $(this).parent().val()) {
                if (languageIndexes.length > 0) {
                    languageIndexes.pop();
                }
                languageIndexes.push(idx);
            }
        });
        var list = '';
        $('.translateSourceLang option').each(function (idx) {
            if ($.inArray(idx, languageIndexes) >= 0) {
                list += '<li data-value="' + $(this).val() + '"' + ($(this).val() === $(this).parent().val() ? ' class="active"' : '') + '>' + $(this).text() + '</li>';
            }
        });
        $(".translateSystemContainerLeft .fancy-select").toggle($('.translateSourceLang option').length > languageCount);
        $('.popSourceLangs').html(list);
        if ($(".translateSystemContainerLeft").height() > 50 && languageCount > 1){
            $widget.loadPopularSourceLangList(languageCount - 1);
        }
    },

    loadPopularTargetLangList: function (languageCount) {
        if (!languageCount)
            languageCount = 3;
        languageIndexes = [];
        // select first N languages. always include selected language even if it is not in first N
        $('.translateTargetLang option').each(function (idx) {
            if (idx < languageCount) {
                languageIndexes.push(idx);
            } else if ($(this).val() === $(this).parent().val()) {
                if (languageIndexes.length > 0) {
                    languageIndexes.pop();
                }
                languageIndexes.push(idx);
            }
        });
        var list = '';
        $('.translateTargetLang option').each(function (idx) {
            if ($.inArray(idx, languageIndexes) >= 0) {
                list += '<li data-value="' + $(this).attr('lang') + '"' + ($(this).val() === $(this).parent().val() ? ' class="active"' : '') + '>' + $(this).text() + '</li>';
            }
        });
        $(".translateSystemContainerRight .fancy-select").toggle($('.translateTargetLang option').length > languageCount);
        $('.popTargetLangs').html(list);
        if ($(".translateSystemContainerRight").height() > 50 && languageCount > 1) {
            $widget.loadPopularTargetLangList(languageCount - 1);
        }
    },

    changePopularLangList: function (systemId) {
        var sysObj = $widget.getActiveSystemObj();
        if (!sysObj)
            return;

        var src = sysObj.SourceLanguage.Code;
        var trg = sysObj.TargetLanguage.Code;

        $('.popSourceLangs li').removeClass('active');

        if ($('.popSourceLangs li[data-value="' + src + '"]').length > 0) {
            $('.popSourceLangs li[data-value="' + src + '"]').addClass('active');
        }
        else {
            $('.popSourceLangs').prepend('<li data-value="' + src + '" class="active">' + $('.translateSourceLang :selected').text() + '</li>');
            $('.popSourceLangs li').last().remove();
            if ($('.popSourceLangs li').length > 1 && $(".translateSystemContainerLeft").height() > 50) {
                $('.popSourceLangs li').last().remove();
            }
        }

        $widget.loadPopularTargetLangList();
        $('.popTargetLangs li').removeClass('active');
        if ($('.popTargetLangs li[data-value="' + trg + '"]').length > 0) {
            $('.popTargetLangs li[data-value="' + trg + '"]').addClass('active');
        }
        else {
            $('.popTargetLangs').prepend('<li data-value="' + trg + '" class="active">' + $('.translateTargetLang :selected').text() + '</li>');
            $('.popTargetLangs li').last().remove();
            if ($('.popTargetLangs li').length > 1 && $(".translateSystemContainerRight").height() > 50)
            {
                $('.popTargetLangs li').last().remove();
            }
        }
    }

});

Tilde.TranslatorWidget.prototype.pluginInitializers.push(Tilde.TranslatorWidget.prototype.recentlangsPluginInit);
/* tilde.translator.widget.TRANSLATEFILE.js */

$.extend(Tilde.TranslatorWidgetDefaultOptions, {
    _uploadUrl: 'https://letsmt.eu/ws/Files/Upload',
    _deleteUrl: 'https://letsmt.eu/ws/Files/Delete',
    _downloadUrl: 'https://letsmt.eu/ws/Files/Download',
    _translateUrl: 'https://letsmt.eu/ws/Files/StartTranslation',
    _previewUrl: 'https://letsmt.eu/ws/Files/GetDocumentPreview',
    _checkStatusUrl: 'https://letsmt.eu/ws/Files/GetStatus',
    _languageNamesUrl: 'https://letsmt.eu/ws/Files/GetLanguageNames',
    _landingView: false, //intro box with tooltip
    _allowedFileTypes: [{ ext: "txt", mime: "text/plain" }], //file translation types
    _showAllowedFileInfo: false, //show list of supported file types
    _mimetypeFilter: true, //show only allowed filetypes in open file dialog
    _uploadSizeLimit: 1024 * 1024 * 30, //doc translate upload size limit (default 15MB)
    _startPercent: 3, //translation progress init percentage
    _docMaxWordCount: 0, //document translation max word count
    _docMaxSegmentCount: -1, //translated segment count limitation. if -1 then no limit
    _docTransMetadata: {}, //custom metadata of translated file (json)
    _warnWhenRunningAway: false, //warn when navigating to different page while translation is in progess
    _onFileUpload: null, //callback function when document is uploaded
    _onDocTranslationStart: null, //callback function on document started translation 
    _onDocTranslationCancel: null, //callback function on document cancel translation 
    _onDocTranslationStop: null, //callback function on document translation stop
    _onDocTranslationFinished: null, //callback function on document finished translation 
    _onDocTranslationError: null, //callback function on document error translation
    _onDocTranslationProgress: null, // Callback function on document translation progress; 1st parameter is translated percentage
    _advancedOptions: false //show advenced file translation options
});

$.extend(Tilde.TranslatorWidget.prototype, {

    filePluginInit: function () {

        if ($('#docUploadFile', $widget.settings.container).length === 0)
            return;

        $widget.filePluginEvents();
        $widget.filePluginSetTempTextResult();

        if (navigator.userAgent.indexOf("iPhone OS") > -1) {
            $(".docAppleLimited").removeClass('hide');
        }

        // landing intro box
        if ($widget.settings._landingView) {
            $widget.filePluginShowIntro();
        }

        var extArray = [];
        var mimeArray = [];
        for (var idx in $widget.settings._allowedFileTypes) {
            var item = $widget.settings._allowedFileTypes[idx];
            if ($.inArray(item.ext, extArray) == -1) {
                extArray.push(item.ext);
            }

            if ($widget.settings._mimetypeFilter) {
                if ($.inArray(item.mime, mimeArray) == -1) {
                    mimeArray.push(item.mime);
                }
            }
        }

        $widget.onSystemChangedHandlers.push(function () {
            $("#docSourcePreview", $widget.settings.container).attr("lang", $widget.getActiveSystemObj().SourceLanguage.Code);
            $(".translateResult", $widget.settings.container).attr("lang", $widget.getActiveSystemObj().TargetLanguage.Code);
        });

        // supported formats
        var formatsHtml = '';
        if ($widget.settings._showAllowedFileInfo) {
            formatsHtml = '<span class="supTypesList">' + uiResources[$widget.settings._language]['docSupportedTypes'].replace('{extensions}', '<span class="format">' + extArray.join('</span>, <span class="format">') + '</span>') + '</span>';
        }

        // translation segment limit message
        if ($widget.settings._docMaxSegmentCount !== -1) {
            $('.stickyMessageBox').html(uiResources[$widget.settings._language]['docLimit'].replace('{limit}', $widget.settings._docMaxSegmentCount)).removeClass('hide');
        }

        var uploader = new qq.FileUploader({
            element: document.getElementById('docUploadFile'),
            multiple: false,
            allowedExtensions: extArray,
            allowedMimetypes: mimeArray,
            action: $widget.settings._uploadUrl,
            headers: $widget.getAuthHeaders(),
            debug: false,
            sizeLimit: $widget.settings._uploadSizeLimit,
            template: '<div class="qq-uploader">' +
                      ' <div class="qq-upload-drop-area"></div>' +
                      '	<div href="#" class="qq-upload-button">' +
                      '  <div class="qq-upload-button-image"></div>' +
                      '  <div class="qq-upload-button-text">' +
                      '     <span>' + uiResources[$widget.settings._language]['docUploadTooltip'] + '</span>' + formatsHtml +
                      '  </div>' +
                      ' </div>' +
                	  '	<ul class="qq-upload-list hide"></ul>' +
                	  '</div>',
            fileTemplate: '<li>' +
                          ' <div class="qq-upload-meta">' +
                          '     <span class="qq-upload-meta-title">' + uiResources[$widget.settings._language]['docUploadFilename'] + '</span>' +
                          '     <span class="qq-upload-file"></span>' +
                          '     <span class="qq-upload-failed-text">' + uiResources[$widget.settings._language]['docUploadFailed'] + '</span>' +
                          '     <a class="qq-upload-cancel hide"></a>' +
                          ' </div>' +
                          ' <div class="qq-upload-meta">' +
                          '     <span class="qq-upload-meta-title">' + uiResources[$widget.settings._language]['docUploadFilesize'] + '</span>' +
                          '     <span class="qq-upload-size"></span>' +
                          ' </div>' +
                          ' <div class="qq-upload-meta">' +
                          '     <span class="qq-upload-meta-title">' + uiResources[$widget.settings._language]['docUploadWordcount'] + '</span>' +
                          '     <span class="qq-upload-wordcount"></span>' +
                          ' </div>' +
                          '</li>',
            messages: {
                typeError: uiResources[$widget.settings._language]['docUploadMsgType'],
                sizeError: uiResources[$widget.settings._language]['docUploadMsgSize'],
                emptyError: uiResources[$widget.settings._language]['docUploadMsgEmpty']
            },

            onSubmit: $widget.filePluginUploadOnSubmit,

            onComplete: $widget.filePluginUploadOnComplete,

            showMessage: function (message) {
                $('.translateProgress').addClass('hide');
                $('.infoMessageBox').html(message).removeClass('hide');
            }
        });

        $widget.onSystemChangedHandlers.push(function (systemId) {
            if ($('.buttonDownDoc').length === 1 && !$('.buttonDownDoc').hasClass('hide')) {
                $widget.filePluginUploadNew();
            }
            $widget.filePluginSetTempTextResult();
        });

        if ($widget.settings._advancedOptions) {
            $(".buttonAdvancedOptions").removeClass("hide");
            $('.optionBox .optCheck').change(function () {
                if ($(this).is(':checked')) {
                    $(this).parent().find('.manualInput').slideDown();

                    if ($(this).attr('id') === 'cbAddSourcePrefix') {
                        if ($('#inputSourcePrefix').val() === '') {
                            $('#inputSourcePrefix').val('*M*');
                        }
                    }

                    if ($(this).attr('id') === 'cbAddTargetPrefix') {
                        if ($('#inputTargetPrefix').val() === '') {
                            $('#inputTargetPrefix').val('*M*');
                        }
                    }
                }
                else {
                    $(this).parent().find('.manualInput').slideUp();
                }
            });

            $('.optionBox  .langOptCheck').change(function () {
                if ($(this).is(':checked')) {

                    $(".tmxSourceLang").empty();
                    $(".tmxTargetLang").empty();

                    var trgValues = '';

                    var sysID = $widget.activeSystemId;
                    if (sysID) {
                        var systemObj = $widget.getActiveSystemObj();
                        var langs = systemObj.SourceLanguage.Code + "-" + systemObj.TargetLanguage.Code;

                        var ret = $.ajax({
                            type: 'POST',
                            url: $widget.settings._languageNamesUrl,
                            headers: $widget.getAuthHeaders(),
                            data: {
                                languagePair: langs
                            },
                            success: function (response) {
                                var parts = response.split("\n");
                                if (parts.length == 2) {
                                    $(".tmxSourceLang").empty().append(parts[0]);
                                    $(".tmxTargetLang").empty().append(parts[1]);
                                }
                            },
                            error: function (response) {
                                console.error(response);
                            }
                        });
                    }
                    $(this).parent().find('.manualInput').slideDown();
                }
                else {
                    $(this).parent().find('.manualInput').slideUp();
                }
            });
        }
    },

    filePluginUploadOnSubmit: function () {
        $('.qq-upload-list, .infoMessageBox').html('').addClass('hide');
        $('.translateProgress').removeClass('hide');
    },

    filePluginUploadOnComplete: function (id, fileName, responseJSON) {
        if (responseJSON.success) {
            // landing intro box
            if ($widget.settings._landingView) {
                $('.translateContainerRight', $widget.settings.container).removeClass('hide');
                $('.translateContainerLeft, .translateContainerHeader', $widget.settings.container).removeClass('intro');
            }

            $('.transFileMeta').html($('.qq-upload-success').html());
            $('.docUploadNewDoc').removeClass('hide');
            $('.translateButton').removeClass('hide');
            $widget.enableSystemChange();
            $('#sendEmail, #sendEmailLabel').removeClass('hide');
            $('#sendEmail').removeAttr("disabled");

            var filename = responseJSON.filename;
            var wordcount = responseJSON.wordcount;
            $('.qq-upload-wordcount').html(wordcount);
            $('#docUploadFile').addClass('hide');

            $('.translateProgress').addClass('hide');
            $('.uploadedDocumentName').text($('.qq-upload-file:first').text()).removeClass('hide');

            if ($('#hidTranslRealFilename').length == 0) {
                $('.docTranslateContent').after($('<input>', {
                    type: 'hidden',
                    id: 'hidTranslRealFilename',
                    value: filename
                }));

            }
            else {
                $('#hidTranslRealFilename').val(filename);
            }

            // detect language
            //if ($(".translate_source_lang option[value='" + responseJSON.detlang + "']").length !== 0) {
            //    $('.translate_source_lang').val(responseJSON.detlang);
            //    $('.translate_source_lang').trigger('change');
            //}

            $("#docSourcePreview").removeClass('hide');
            $('#docSourcePreview').html(responseJSON.preview);
            $('#docSourcePreview').toggleClass("bigIcon", $('.no-preview', $("#docSourcePreview")).length > 0);

            // file upload callback
            if ($widget.settings._onFileUpload && typeof ($widget.settings._onFileUpload) === "function") {
                $widget.settings._onFileUpload(filename, wordcount);
            }

            // max word count check
            if ($widget.settings._docMaxWordCount !== 0 && $widget.settings._docMaxWordCount < parseInt(wordcount)) {
                var message = uiResources[$widget.settings._language]['docUploadMsgWordcnt'].replace('{wordCount}', wordcount);
                $('.qq-upload-wordcount').addClass('warning');
                $('.infoMessageBox').html(message).removeClass('hide');
                if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                    $widget.settings._onDocTranslationError('FT_ERR_WORDCOUNT', message);
                }
            }
            else {
                $('.qq-upload-wordcount').removeClass('warning');
                $('.qq-upload-warn-msg').remove();
            }
        }
        else if (responseJSON.error || jQuery.isEmptyObject(responseJSON)) {
            var message = uiResources[$widget.settings._language]['docUploadFailed'];
            $('.translateProgress').addClass('hide');
            $('.infoMessageBox').html(message).show();
            if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                $widget.settings._onDocTranslationError('FT_ERR_UPLOAD', message);
            }
        }
    },

    filePluginTranslate: function () {
        $widget.disableSystemChange();
        $('.translateButton, .docUploadNewDoc').addClass('hide');
        if ($widget.settings._advancedOptions) {
            $('.advancedOptions').addClass("hide");
            $('.buttonAdvancedOptions').addClass("hide");
            $(".buttonAdvancedOptions .btnText").text($(".buttonAdvancedOptions .btnText").text().replace("▴", "▾"));
        }
        $('.buttonCancelDoc').removeClass('hide');
        $('.docTempTarget').addClass('hide');
        $('.translateContainerRight').addClass('docProgress');

        $('.translateResult').removeClass('hide');
        $('.translateResult').addClass("bigIcon");

        if ($widget.settings._onDocTranslationStart && typeof ($widget.settings._onDocTranslationStart) === "function") {
            $widget.settings._onDocTranslationStart();
        }

        $("#hidStopTranslation").val('false');

        $('.translateResult').html(
            '<div id="translProgress" class="starting">' +
            '   <div class="progressImage"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><div id="transItem" class="transItem">' +
            '	    <span class="percent">' + uiResources[$widget.settings._language]['docStarting'] + '</span>' +
            '   </div>' +
            '</div>'
        );

        var data = {
            systemid: $widget.activeSystemId,
            appid: $widget.settings._appId,
            filename: $('.transFileMeta .qq-upload-file').text(),
            tmpname: $('#hidTranslRealFilename').val(),
            wordlimit: $widget.settings._docMaxWordCount,
            segmentlimit: $widget.settings._docMaxSegmentCount,
            termcorpusid: ($widget.termCorpusId && $widget.getSelectedTermCorpusStatus() == "Ready") ? $widget.termCorpusId : null,
        };

        if ($widget.settings._advancedOptions) {
            data["sendEmail"] = $('#sendEmail:checked').length > 0;
            if ($('#cbAddSourcePrefix:checked').length > 0) {
                data["sourcePrefix"] = $("#inputSourcePrefix").val();
            }
            if ($('#cbAddTargetPrefix:checked').length > 0) {
                data["targetPrefix"] = $("#inputTargetPrefix").val();
            }
            data["doNotReplaceExistingTranslation"] = $('#cbReplaceTarget:checked').length > 0;
            if ($('#cbLangSpec:checked').length > 0) {
                data["sourceLanguage"] = $(".tmxSourceLang option:selected").val();
                data["targetLanguage"] = $(".tmxTargetLang option:selected").val();
            }
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: $widget.settings._translateUrl,
            headers: $widget.getAuthHeaders(),
            data: data,
            success: function (response) {
                if (response.success) {
                    if ($widget.settings._warnWhenRunningAway) {
                        // IE10 somehow manages to rise unload event when starting
                        // this ajax request, so, must wait until it gets response before listening to "unload"
                        $(window).bind('beforeunload.warn', function () {
                            return uiResources[$widget.settings._language]["docTranslInProgress"];
                        });
                    }
                    if ($('#hidUploadTempId').length == 0) {
                        $('.docTranslateContent').after($('<input>', {
                            type: 'hidden',
                            id: 'hidUploadTempId',
                            value: response.docid
                        }));
                    }
                    else {
                        $('#hidUploadTempId').val(response.docid);
                    }

                    $widget.filePluginTranslateProgress(response.docid);

                    if (typeof ($widget.checkSystemStatus) !== "undefined")
                    {
                        $widget.checkSystemStatus();
                    }
                }
                else {

                    //error
                    if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                        $widget.settings._onDocTranslationError('', uiResources[$widget.settings._language]['E_FAILED_IN_TRANSLATION']);
                    }

                    if ($widget.settings._onDocTranslationStop && typeof ($widget.settings._onDocTranslationStop) === "function") {
                        $widget.settings._onDocTranslationStop();
                    }

                    $('.infoMessageBox').html(uiResources[$widget.settings._language]['E_FAILED_IN_TRANSLATION']).removeClass('hide');
                    $('.buttonDelDoc').addClass('hide');
                    $('.docUploadNewDoc').removeClass('hide');
                    $('.translateContainerRight').removeClass('docProgress');
                    $('#translProgress').html('');
                    if ($widget.settings._advancedOptions) {
                        $('.buttonAdvancedOptions').removeClass("hide");
                    }
                    if (typeof (console) !== "undefined") {
                        console.log(response);
                    }
                }
            },
            error: function (response, status, error) {
                //error

                if (response.status == 401 && $widget.settings._loginUrl) {
                    window.location = $widget.settings._loginUrl;
                }

                if (response.status == 403) {
                    var errorMsg = uiResources[$widget.settings._language]['E_UNAUTHORIZED'];
                }
                else {
                    var errorMsg = uiResources[$widget.settings._language]['E_FAILED_IN_TRANSLATION'];
                }

                if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                    $widget.settings._onDocTranslationError('', errorMsg);
                }

                if ($widget.settings._onDocTranslationStop && typeof ($widget.settings._onDocTranslationStop) === "function") {
                    $widget.settings._onDocTranslationStop();
                }

                $('.infoMessageBox').html(errorMsg).removeClass('hide');
                $('.buttonDelDoc').addClass('hide');
                $('.docUploadNewDoc').removeClass('hide');
                $('.translateContainerRight').removeClass('docProgress');
                $('#translProgress').html('');
                if ($widget.settings._advancedOptions) {
                    $('.buttonAdvancedOptions').removeClass("hide");
                }

                if (typeof (console) !== "undefined") {
                    console.error(error);
                }
            },
            complete: function () {
                $('#translProgress').removeClass('starting');
                $('#translProgress #transItem .percent').text($widget.settings._startPercent + '%');
            }
        });
    },

    filePluginEvents: function () {
        $('.docUploadNewDoc', $widget.settings.container).on('click', function () {
            $widget.filePluginUploadNew();
        });

        $('.buttonDelDoc', $widget.settings.container).on('click', function () {
            $widget.filePluginDeleteFile();
        });

        $('.buttonCancelDoc', $widget.settings.container).on('click', function () {
            if ($widget.settings._warnWhenRunningAway) {
                $(window).unbind('beforeunload.warn');
            }
            $widget.filePluginDeleteFile();
        });
        
        $('.translateButton', $widget.settings.container).on('click', function () {
            if ($(this).attr('data-disabled') === 'true') {
                return false;
            }
            $widget.filePluginTranslate();
        });
        if ($widget.settings._advancedOptions) {
            $('.buttonAdvancedOptions', $widget.settings.container).on('click', function () {
                $(".advancedOptions").toggleClass("hide");
                if ($(".buttonAdvancedOptions .btnText").text().indexOf("▾") > 0) {
                    $(".buttonAdvancedOptions .btnText").text($(".buttonAdvancedOptions .btnText").text().replace("▾", "▴"));
                } else {
                    $(".buttonAdvancedOptions .btnText").text($(".buttonAdvancedOptions .btnText").text().replace("▴", "▾"));
                }
            });
        }
    },

    filePluginUploadNew: function () {
        var uploadId = $('#hidUploadTempId').val();
        if (typeof (uploadId) == 'undefined') { uploadId = ''; }

        this.filePluginDeleteFileOnServer();

        $('.docUploadNewDoc').addClass('hide');
        $('.buttonDownDoc').removeAttr('href').addClass('hide');
        $('#hidTranslRealFilename').remove();
        $('#hidTranslTempFilename').remove();
        $('#hidUploadTempId').remove();
        $('.uploadedDocumentName').text('').addClass('hide');
        $('.qq-upload-list').html('');
        $('.transFileMeta').html('');
        $('.infoMessageBox').html('').addClass('hide');
        $('#hidStopTranslation').val('false');
        $('#docUploadFile').removeClass('hide');
        $('#docSourcePreview').empty();
        $('#docSourcePreview').addClass('hide');
        $('.translateTextTempSourceContainer style').remove();
        $('.translateResult').empty();
        if ($widget.settings._advancedOptions) {
            $('.buttonAdvancedOptions').removeClass("hide");
        }

        $widget.filePluginSetTempTextResult();

        $widget.enableSystemChange();
        $('.translateButton').addClass('hide');

        if ($widget.settings._onDocTranslationCancel && typeof ($widget.settings._onDocTranslationCancel) === "function") {
            $widget.settings._onDocTranslationCancel(uploadId);
        }

        // landing intro box
        if ($widget.settings._landingView) {
            $widget.filePluginShowIntro();
        }
    },

    filePluginShowIntro: function () {
        $('.translateContainerRight', $widget.settings.container).addClass('hide');
        $('.translateContainerLeft, .translateContainerHeader', $widget.settings.container).addClass('intro');
    },

    filePluginDeleteFile: function () {
        $('.docUploadNewDoc').click();

        $('.docTranslateContent').after($('<input>', {
            type: 'hidden',
            id: 'hidStopTranslation',
            value: true
        }));

        $('.buttonDelDoc, .buttonCancelDoc').addClass('hide');
        $('.translateContainerRight').removeClass('docProgress');

        this.filePluginSetTempTextResult();

        this.filePluginDeleteFileOnServer();
    },

    filePluginDeleteFileOnServer: function () {
        var uploadId = $('#hidUploadTempId').val();
        if (typeof (uploadId) == 'undefined') { uploadId = ''; }
        if (uploadId.length > 0) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: $widget.settings._deleteUrl,
                headers: $widget.getAuthHeaders(),
                data: {
                    docid: uploadId
                },
                success: function (response) {
                    if (!response.success) {
                        if (typeof (console) !== "undefined") {
                            console.error('error while deleting: ' + response.error);
                        }
                    }
                    $widget.enableSystemChange();
                },
                error: function (response) {
                    if (typeof (console) !== "undefined") {
                        console.error('error while deleting: ' + response.error);
                    }
                    if (response.status == 401 && $widget.settings._loginUrl) {
                        window.location = $widget.settings._loginUrl;
                    }
                    $widget.enableSystemChange();
                }
            });
        }
    },
    filePluginTranslateProgress: function (docid) {
        if ($('#hidStopTranslation').val() === 'true') {
            return;
        }

        if (!$('.translateContainerRight').hasClass('docProgress')) {
            $('.translateContainerRight').addClass('docProgress');
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: $widget.settings._checkStatusUrl,
            headers: $widget.getAuthHeaders(),
            data: {
                docId: docid
            },
            success: function (response) {
                // be positive 0% will be showed as 10%
                var completed = (response.completed < $widget.settings._startPercent) ? $widget.settings._startPercent : response.completed;
                $('#translProgress').removeClass('starting');
                $('#translProgress .percent').text(completed + '%');

                // callback on error
                if (response.status === 'error') {
                    var error_msg = uiResources[$widget.settings._language]['E_DEFAULT_ERROR'];

                    if (uiResources[$widget.settings._language][response.error]) {
                        error_msg = uiResources[$widget.settings._language][response.error];
                    }

                    $('.docUploadNewDoc').removeClass('hide');
                    $('.buttonCancelDoc').addClass('hide');
                    $('.infoMessageBox').html(error_msg).removeClass('hide');
                    $('#translProgress').html('');

                    if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                        $widget.settings._onDocTranslationError('', error_msg);
                    }

                    if ($widget.settings._onDocTranslationStop && typeof ($widget.settings._onDocTranslationStop) === "function") {
                        $widget.settings._onDocTranslationStop();
                    }
                }

                if (response.reload) {
                    $('.buttonCancelDoc').removeClass('hide');

                    if ($widget.settings._onDocTranslationProgress && typeof $widget.settings._onDocTranslationProgress === 'function') {
                        $widget.settings._onDocTranslationProgress(completed);
                    }

                    setTimeout(function () {
                        $widget.filePluginTranslateProgress(docid);
                    }, 5 * 1000); //refresh interval -> 10 seconds
                }
                else if (response.status === 'completed') {

                    if (response.warnings)
                    {
                        var warnings = response.warnings.split(",");
                        var errorMessages = [];
                        for (counter = 0; counter < warnings.length; counter++) {
                            if (uiResources[$widget.settings._language][warnings[counter]]) {
                                errorMessages.push(uiResources[$widget.settings._language][warnings[counter]]);
                            } else {
                                errorMessages.push(warnings[counter]);
                            }
                        }
                        $('.infoMessageBox').html(errorMessages.join("<br /> ")).removeClass('hide');
                    }

                    var down = $widget.settings._downloadUrl + '?docid=' + encodeURIComponent(docid)
                        + '&filename=' + encodeURIComponent(response.filename);

                    var authHeders = $widget.getAuthHeaders();
                    if (authHeders) {
                        if(authHeders["client-id"]){
                            down += "&clientId=" + encodeURIComponent(authHeders["client-id"]);
                        }
                        if (authHeders["website-auth-cookie"]) {
                            down += "&websiteAuthCookie=" + encodeURIComponent(authHeders["website-auth-cookie"]);
                        }
                    }

                    $('.buttonDownDoc').attr('href', down).attr('target', '_blank').removeClass('hide');
                    $('.buttonDelDoc').addClass('hide');
                    $('.buttonCancelDoc').addClass('hide');
                    $('#hidTranslRealFilename').remove();
                    $('#hidTranslTempFilename').remove();
                    $('.docUploadNewDoc').removeClass('hide');

                    if ($widget.settings._warnWhenRunningAway) {
                        $(window).unbind('beforeunload.warn');
                    }

                    // translation finish callback
                    if ($widget.settings._onDocTranslationFinished && typeof ($widget.settings._onDocTranslationFinished) === "function") {
                        $widget.settings._onDocTranslationFinished(docid);
                    }

                    var downloadFileName = response.filename;

                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: $widget.settings._previewUrl,
                        headers: $widget.getAuthHeaders(),
                        data: {
                            filename: downloadFileName,
                            docid: docid
                        },
                        success: function (response) {
                            if (response.success) {
                                if (response.preview) {
                                    $('.translateResult').html(response.preview);
                                    $('.translateResult').removeClass("bigIcon");
                                }
                                else {
                                    $('.translateResult').html('<a href="' + down + '" target="_blank"><div class="translated-no-preview"></div><span>' + downloadFileName + '</span></a>');
                                    $('.translateResult').addClass("bigIcon");
                                }
                            }
                            else {
                                $('.infoMessageBox').html(uiResources[$widget.settings._language]['docPreviewError']).removeClass('hide');
                            }
                            $('.translateContainerRight').removeClass('docProgress');
                            $('#translProgress').html('');
                        },
                        error: function (response) {
                            if (response.status == 401 && $widget.settings._loginUrl) {
                                window.location = $widget.settings._loginUrl;
                            }
                            //error
                            $('.infoMessageBox').html(uiResources[$widget.settings._language]['docPreviewError']).removeClass('hide');
                            $('.translateContainerRight').removeClass('docProgress');
                            $('#translProgress').html('');
                        }
                    });
                }
            },
            error: function (response) {
                if ($widget.settings._warnWhenRunningAway) {
                    $(window).unbind('beforeunload.warn');
                }
                if (response.status == 401 && $widget.settings._loginUrl) {
                    window.location = $widget.settings._loginUrl;
                } else {
                    var errorMsg = uiResources[$widget.settings._language]['docTranslFailed'];

                    $('.docUploadNewDoc').removeClass('hide');
                    $('.infoMessageBox').html(errorMsg).removeClass('hide');

                    if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                        $widget.settings._onDocTranslationError('FT_ERR_DOCSTATUS', errorMsg);
                    }
                }

            }
        });
    },

    filePluginGetTranslationStatus: function () {
        // possible values: blank, uploaded, translating, translated

        if ($('.qq-upload-file').length === 0) {
            return 'blank';
        }
        else if ($('.translateContainerRight').hasClass('docProgress')) {
            var href = $('.buttonDownDoc').attr('href');
            if (href !== undefined && href.length === 0) {
                return 'translating';
            }
            else {
                return 'translated';
            }
        }
        else {
            return 'uploaded';
        }
    },

    filePluginSetTempTextResult: function () {
        var txt = uiResources[$widget.settings._language]['docTempTarget'];

        if ($widget.settings._systemSelectType === 'domain') {
            var domain = $('.translateDomain option:selected', $widget.settings.container).text(),
                descr = uiResources[$widget.settings._language]['DOMAIN_' + domain.toUpperCase()];

            if (descr !== undefined) {
                txt = descr + '<p>' + txt + '</p>';
            }
        }

        $('.docTempTarget', $widget.settings.container).html(txt).removeClass('hide');
        $('.translateResult', $widget.settings.container).addClass('hide');
    }

});

Tilde.TranslatorWidget.prototype.pluginInitializers.push(Tilde.TranslatorWidget.prototype.filePluginInit);
/* tilde.translator.widget.TRANSLATETEXT.js */

$.extend(Tilde.TranslatorWidgetDefaultOptions, {
    _translationUrl: 'https://letsmt.eu/ws/Service.svc/json/Translate',
    _updateTranslationUrl: 'https://letsmt.eu/ws/Service.svc/json/UpdateTranslation',
    _dictionaryUrl: 'https://yoursite/api/ajax/GetDictionaryEntry',
    _ttsUrl: 'https://yoursite/TTS/GetSound',
    _textSource: '.translateTextSource', // source container <textarea>
    _textResult: '.translateTextResult', // target container <div>
    _landingView: false, // intro box with tooltip
    _enableParallelHover: true, // enable translation and source paralel hover
    _highlightTranslated: true, // toggle latest translation highlight in source and target
    _highlightTranslatedTimeout: 1500, // time in milissecond for highlight
    _focusAfterClear: true, // source field focus after clear
    _focusAfterTranslate: true, // source field focus after translation
    _focusAfterLoad: false, // source field focus after widget is loaded
    _translateAll: false, // allways translate all text (when?)
    _translationLimit: -1, // sentence count to translate. if -1 then no limit
    _useDictionary: false, // use dictionary when translating one word
    _useSpeakers: false, // use latvian tts
    _onTranslationStarted: null,
    _onTranslationFinished: null,
    _onUrlEntered: null,
    _onTextInput: null, // delayd event fired on user input
    _onScrollBarWidthChanged: null, // fired when scrollbar appears or disappears for source textarea
    _text: null //default text
});

$.extend(Tilde.TranslatorWidget.prototype, {
    textTranslator: null,
    translatedCnt: 0,
    hoveredElements: [],

    textPluginInit: function () {

        if ($('.translateTextSource', $widget.settings.container).length === 0)
            return;

        if ($widget.settings._focusAfterLoad) {
            // sets the focus to input textarea, while still showing the "Enter the text you want to translate" message
            $($widget.settings._textSource, $widget.settings.container).focus();
        }

        $widget.textPluginEvents();

        // intro box
        if ($widget.settings._landingView) {
            $('.fakeCursor', $widget.settings.container).removeClass('hide');
            $('.translateContainerRight', $widget.settings.container).addClass('hide');
            $('.translateContainerLeft, .translateContainerHeader', $widget.settings.container).addClass('intro');
        }

        // parallel hover
        if ($widget.settings._enableParallelHover) {
            $widget.textPluginInitParallelHover();
        }

        $widget.textTranslator = new Tilde.TextTranslator($.extend(
            $widget.settings
        ));

        if ($widget.settings._text) {
            $($widget.settings._textSource, $widget.settings.container).text($widget.settings._text);
            $($widget.settings._textSource, $widget.settings.container).trigger('paste');
        }
        else {
            $widget.textPluginSetTempText();
        }

        $widget.onSystemChangedHandlers.push(function () {
            $(".translateTextSource", $widget.settings.container).attr("lang", $widget.getActiveSystemObj().SourceLanguage.Code);
            $(".backGroundSource", $widget.settings.container).attr("lang", $widget.getActiveSystemObj().SourceLanguage.Code);
            $(".translateTextResult", $widget.settings.container).attr("lang", $widget.getActiveSystemObj().TargetLanguage.Code);
        });

        $widget.onSystemChangedHandlers.push($widget.textPluginTranslate);
        if (typeof ($widget.termCorpusChangedHandlers) !== "undefined") {
            $widget.termCorpusChangedHandlers.push($widget.textPluginTranslate);
        }

        $('.editButton', $widget.settings.container).click(function () {
            //disable keyboard focus for background elements
            $.each($("input,select,a,textarea"), function (index, focusableElement) {
                jQueryFocusableElement = $(focusableElement);
                jQueryFocusableElement.data("old-tab-index", jQueryFocusableElement.attr("tabindex"));
                jQueryFocusableElement.attr("tabindex", "-1");
            });
            if ($(".translateTextResult .selected", $widget.settings.container).length == 0) {
                //select first sentence if none is selected
                $(".translateTextResult p .sentence", $widget.settings.container).first().addClass("selected");
                $(".backGroundSource div .sentence", $widget.settings.container).first().addClass("selected");
            }

            var originalText = $(".backGroundSource .selected", $widget.settings.container).text();
            var translation = $(".translateTextResult .selected", $widget.settings.container).text();

            //draw the form
            $("body").append($("<div></div>", { "id": "translationEditBackground" }));
            var form = $("<div></div>", { "id": "translationEditForm", "class": "form" });
            $("body").append(form);
            form.append($("<a></a>", {"href":"javascript:;", id:"translationEditClose", "title": uiResources[$widget.settings._language]['translationEditClose']}));
            form.append($("<label></label>").text(uiResources[$widget.settings._language]['translationEditOriginal']));
            form.append($("<p>", { "id": "translationEditOriginal" }).text(originalText));
            form.append($("<label></label>", {"for": "translationEditTranslation"}).text(uiResources[$widget.settings._language]['translationEditTranslation']));
            textarea = $("<textarea></textarea>", { "id": "translationEditTranslation", "autofocus" : "autofocus", "maxlength" : "5000" }).val(translation);
            form.append(textarea);
            form.append($("<div></div>", {"id": "translationEditDescription"}).text(uiResources[$widget.settings._language]['translationEditDescription']));
            form.append($('<div class="translateProgress progress hide"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'));
            var buttons = $("<div></div>", { "id": "translationEditButtons" });
            form.append(buttons);
            buttons.append($("<a></a>", { "class": "button", "id": "translationEditBack", "href": "javascript:;" }).text("◄"));
            buttons.append($("<a></a>", {"class":"button", "id": "translationEditSave", "href": "javascript:;"}).text(uiResources[$widget.settings._language]['translationEditSave']));
            buttons.append($("<a></a>", { "class": "button", "id": "translationEditForward", "href": "javascript:;" }).text("►"));
            

            $widget.resizeEditForm();
            
            $(window).on("keydown.translationEditForm", function (event) {
                if (event.which == 27) {
                    $("#translationEditClose").trigger("click");
                }
            });

            $("#translationEditClose").click(function () {
                if ($(this).is("[disabled]")) {
                    event.preventDefault();
                    return;
                }

                $(window).off("keydown.translatioEditForm");

                $("#translationEditForm").remove();
                $("#translationEditBackground").remove();

                //restore keyboard focus to background elements
                $.each($("input,select,a,textarea"), function (index, focusableElement) {
                    jQueryFocusableElement = $(focusableElement);
                    if (typeof (jQueryFocusableElement.data("old-tab-index")) == "undefined") {
                        jQueryFocusableElement.removeAttr("tabindex");
                    } else {
                        jQueryFocusableElement.attr("tabindex", jQueryFocusableElement.data("old-tab-index"));
                    }
                });
            });

            $("#translationEditBack").click(function () {
                var originalSentences = $(".backGroundSource .sentence", $widget.settings.container);
                var translationSentences = $(".translateTextResult .sentence", $widget.settings.container);
                var selectedTranslation = $(".translateTextResult .sentence.selected", $widget.settings.container);
                var selectedSentenceIndex = -1;
                for (var i = 0; i < translationSentences.length; i++) {
                    if (translationSentences[i] == selectedTranslation[0]) {
                        selectedSentenceIndex = i;
                        break;
                    }
                }

                $(originalSentences[selectedSentenceIndex]).removeClass("selected");
                $(translationSentences[selectedSentenceIndex]).removeClass("selected");
                var previousSentenceIndex = selectedSentenceIndex > 0 ? selectedSentenceIndex - 1 : selectedSentenceIndex;
                $(originalSentences[previousSentenceIndex]).addClass("selected");
                $(translationSentences[previousSentenceIndex]).addClass("selected");

                $("#translationEditOriginal").text($(originalSentences[previousSentenceIndex]).text());
                $("#translationEditTranslation").val($(translationSentences[previousSentenceIndex]).text());

                $widget.resizeEditForm();
            });

            $("#translationEditForward").click(function () {
                var originalSentences = $(".backGroundSource .sentence", $widget.settings.container);
                var translationSentences = $(".translateTextResult .sentence", $widget.settings.container);
                var selectedTranslation = $(".translateTextResult .sentence.selected", $widget.settings.container);
                var selectedSentenceIndex = -1;
                for (var i = 0; i < translationSentences.length; i++) {
                    if (translationSentences[i] == selectedTranslation[0]) {
                        selectedSentenceIndex = i;
                        break;
                    }
                }

                $(originalSentences[selectedSentenceIndex]).removeClass("selected");
                $(translationSentences[selectedSentenceIndex]).removeClass("selected");
                var nextSentenceIndex = selectedSentenceIndex < translationSentences.length - 1 ? selectedSentenceIndex + 1 : selectedSentenceIndex;
                $(originalSentences[nextSentenceIndex]).addClass("selected");
                $(translationSentences[nextSentenceIndex]).addClass("selected");

                $("#translationEditOriginal").text($(originalSentences[nextSentenceIndex]).text());
                $("#translationEditTranslation").val($(translationSentences[nextSentenceIndex]).text());

                $widget.resizeEditForm();
            });

            $("#translationEditSave").click(function () {
                $("#translationEditButtons").addClass("hide")
                $("#translationEditForm .translateProgress").removeClass("hide");
                
                $.ajax({
                        url: $widget.settings._updateTranslationUrl,
                        headers: $widget.getAuthHeaders(),
                        method: "POST",
                        dataType: 'text',
                        type: 'GET',
                        contentType: 'application/json',
                        data: JSON.stringify({
                                appID: $widget.settings._appId,
                                systemID: $widget.activeSystemId,
                                text: $("#translationEditOriginal").text(),
                                translation: $("#translationEditTranslation").val(),
                                options: "suggestion"}),
                        success: function () {
                            $(".translateTextResult .sentence.selected", $widget.settings.container).text($("#translationEditTranslation").val());
                            $("#translationEditClose").trigger("click");
                        },
                        error: function (e) {
                            $("#translationEditButtons").removeClass("hide")
                            $("#translationEditForm .translateProgress").addClass("hide");
                            if (typeof (console) !== 'undefined') {
                                console.error(e);
                            }
                        }
                });
            });

            $("#translationEditTranslation").focus();
        });

        if (typeof ($widget.onSystemWokenUpHandlers) !== 'undefined') {
            $widget.onSystemWokenUpHandlers.push(function () {
                $widget.textTranslator.doTranslation({ translateAll: true });
            });
        }
    },

    resizeEditForm: function () {
        var form = $("#translationEditForm");
        var textarea = $("#translationEditForm textarea");
        // make sure scroll height is calculated
        textarea.height(0);

        // then make it as large as srollbar suggests
        var height = textarea[0].scrollHeight;

        if (navigator.userAgent.indexOf("Trident") > 0
            || navigator.userAgent.indexOf("MSIE") > 0
            || navigator.userAgent.indexOf("Chrome") > 0) {
            // add broder height for IE and Chrome
            height += textarea.outerHeight() - textarea.innerHeight();
        } else {
            // add border&padding for Firefox and all other 
            // (but maybe all other should be treated as Chrome&IE, not sure yet)
            // this is currently default option because it makes textarea larger,
            // which is less bad than smaller
            height += textarea.outerHeight() - textarea.height();
        }
        textarea.css("height", height + "px");
        var contentHeight = 0;
        $.each(form.children(), function (index, element) {
            if (!$(element).hasClass("hide") && $(element).attr("id") != "translationEditClose") {
                contentHeight += $(element).outerHeight(true);
            }
        });

        form.css("height", contentHeight + "px");
        form.css("top", "calc(50% - " + (contentHeight / 2) + "px)");
    },

    textPluginUnload: function () {
        if ($widget.textTranslator) {
            $widget.textTranslator.clearTranslation();
        }
    },

    textPluginEvents: function () {
        var focusEvents = "click";
        if (navigator.userAgent.indexOf("Android") > -1 && navigator.userAgent.indexOf("Version/") > -1) {
            // Android browser won't allow to scroll a textarea unless it is focused
            focusEvents += " touchstart";
        }

        $('.translateButton', $widget.settings.container).on('click', function () {
            if ($(this).attr('data-disabled') === 'true') {
                return false;
            }
            $widget.textPluginTranslate();
        });

        $('.translateResultClear').on('click', function () {
            $widget.textPluginResultClear();
        });

        $('.sourceSpeak').on('click', function () {
            $widget.textPluginSpeak('sourceAudio', $('.translateTextSource', $widget.settings.container).val());
        });

        $('.targetSpeak').on('click', function () {
            $widget.textPluginSpeak('targetAudio', $('.translateTextResult', $widget.settings.container).text());
        });

        $('.translateTextSourceContainer', $widget.settings.container).bind(focusEvents, function () {
            if ($('.translateTextTempSourceContainer').attr('data-disabled') === 'true') {
                return false;
            }
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

        if ($widget.settings._enableParallelHover) {
            $(".translateTextSource").on("mousemove mouseleave", function (event) {
                //emulate moseenter and mouseleave on invisible background elements
                //that can't normally get mouse event because they are covered by the textbox
                var hoveredElements = [];
                var hoveredParagraph = null;

                $.each($(".backGroundSource").find(".classMTsource"), function (index, element) {
                    var boundRectangles = element.getClientRects();
                    for (var rectIndex = 0; rectIndex < boundRectangles.length; rectIndex++) {
                        var boundRectangle = boundRectangles[rectIndex];
                        if (event.clientX >= boundRectangle.left && event.clientY >= boundRectangle.top && event.clientX <= boundRectangle.right && event.clientY <= boundRectangle.bottom) {
                            hoveredParagraph = element;
                            return false;
                        }
                    }
                });

                if (hoveredParagraph != null) {
                    $.each($(hoveredParagraph).find("span"), function (index, element) {
                        var boundRectangles = element.getClientRects();
                        for (var rectIndex = 0; rectIndex < boundRectangles.length; rectIndex++) {
                            var boundRectangle = boundRectangles[rectIndex];
                            if (event.clientX >= boundRectangle.left && event.clientY >= boundRectangle.top && event.clientX <= boundRectangle.right && event.clientY <= boundRectangle.bottom) {
                                hoveredElements.push(element);
                            }
                        }
                    });
                }
                for (var oldIndex = 0; oldIndex < $widget.hoveredElements.length; oldIndex++) {
                    var oldElement = $widget.hoveredElements[oldIndex];
                    if (-1 == $.inArray(oldElement, hoveredElements)) {
                        $(oldElement).trigger("mouseleave");
                    }
                }
                for (var newIndex = 0; newIndex < hoveredElements.length; newIndex++) {
                    var newElement = hoveredElements[newIndex];
                    if (-1 == $.inArray(newElement, $widget.hoveredElements)) {
                        $(newElement).trigger("mouseenter");
                    }
                }
                $widget.hoveredElements = hoveredElements;
            });
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
    },

    textPluginResultClear: function () {
        $widget.translatedCnt = 0;
        $widget.textPluginSetTempText();

        if ($widget.settings._focusAfterClear) {
            $($widget.settings._textSource, $widget.settings.container).focus()
        }

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
                var translateTextResult = $('.translateTextResult')[0];
                if (translateTextResult.scrollTop != translateTextSource.scrollTop) {
                    window.Tilde.sourceScrollingTime = new Date().getTime();
                    translateTextResult.scrollTop = translateTextSource.scrollTop;
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
            $('.translateTextResult').on('scroll', targetScrolled);
            if (navigator.userAgent.indexOf("Android") > -1 && navigator.userAgent.indexOf("Version/") > -1) {
                $('.translateContainerRight').bind('touchstart', function () { $(':focus').blur(); });
            }

            $('.translateTextResult').on('mouseenter mouseleave', '.mt-translation', function (e) {
                $('.hoverStyleSource').removeClass('hoverStyleSource');
                $('.mt-translation.hover').removeClass('hover');

                if (e.type === 'mouseenter') {
                    $(this).addClass('hover');
                    $('.classMTsource[cursorId="' + $(this).attr('cursorId') + '"]').addClass('hoverStyleSource');
                }
            });
        }
    },

    textPluginTranslate: function () {
        if ($widget.settings._onUrlEntered) {
            $widget.textTranslator.checkTextForUrl();
        }
        
        if ($widget.textTranslator) {
            $widget.textTranslator.doTranslation({ translateAll: true });
        }
    },

    textPluginSetTempText: function () {
        if ($widget.textTranslator) {
            $widget.textTranslator.clearTranslation();
        }
        $widget.textPluginSetTempTextResult();
        $widget.textPluginSetTempTextSource();

        $($widget.settings._textResult, $widget.settings.container).removeClass('transLimit');

        $('.sourceLang, .targetLang', $widget.settings.container).text('');
        $('.translateResultClear', $widget.settings.container).addClass('hide');
        $('.translateProgress', $widget.settings.container).addClass('hide');
        if ($widget.settings._useSpeakers) {
            $('.sourceSpeak, .targetSpeak', $widget.settings.container).addClass('hide');
        }
    },

    textPluginSetTempTextSource: function () {
        $($widget.settings._textSource, $widget.settings.container).val('');
        
        // show blink cursor
        if ($widget.settings._landingView) {
            $('.intro .fakeCursor', $widget.settings.container).removeClass('hide');
        }

        $('.translateTextTempSourceContainer', $widget.settings.container).removeClass('hide');
        $('.translateTextTempSourceContainer', $widget.settings.container).html(uiResources[$widget.settings._language]['sourceTextTooltip']);
        $('.translateTextTempSourceContainer', $widget.settings.container).unbind('focus');
        $('.translateTextTempSourceContainer', $widget.settings.container).bind('focus', function () {
            $('.translateTextTempSourceContainer', $widget.settings.container).addClass('hide');
        });

        $($widget.settings._textSource, $widget.settings.container).unbind('focus');
        $($widget.settings._textSource, $widget.settings.container).bind('focus', function () {

            // hide blink cursor
            if ($widget.settings._landingView) {
                $('.intro .fakeCursor', $widget.settings.container).addClass('hide');
            }

            $('.translateTextTempSourceContainer', $widget.settings.container).addClass('hide');
        });
    },

    textPluginSetTempTextResult: function () {
        $($widget.settings._textResult, $widget.settings.container).addClass('translateTextTemp');
        var txt = uiResources[$widget.settings._language]['targetTextTooltip'];

        if ($widget.settings._systemSelectType === 'domain') {
            var domain = $('.translateDomain option:selected', $widget.settings.container).text(),
                descr = uiResources[$widget.settings._language]['DOMAIN_' + domain.toUpperCase()];

            if (descr !== undefined) {
                txt = descr + '<p>' + txt + '</p>';
            }
        }

        $($widget.settings._textResult, $widget.settings.container).html(txt).removeClass('noNetwork');
    },

    textPluginSpeak: function (el, text) {
        $('audio[id="' + el + '"] source').attr('src', $widget.settings._ttsUrl + '?text=' + text.substring(0, 144));
        var audio = document.getElementById(el);
        if (audio.paused)
        {
            audio.load();
            audio.play();
        } else {
            audio.pause();
        }
    }

});

Tilde.TranslatorWidget.prototype.pluginInitializers.push(Tilde.TranslatorWidget.prototype.textPluginInit);

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
        optionsTA.onTextInput = $.proxy(this.onTextInput, this);
        
        if (this.options._focusAfterLoad) {
            optionsTA.onTextChangedWithoutDelay = $.proxy(function () {
                // hide input hint as soon as user starts typing
                // (normally it is hidden when focusing input area,
                // but it can be visible when if textarea was focused automatically when page was loaded)
                if ($(this.options._textSource).val().length > 0) {
                    $('.translateTextTempSourceContainer', this.options.container).addClass('hide');
                }
            }, this);
        }

        if (this.options._onScrollBarWidthChanged)
        {
            $(window).resize(this.checkScrollbarWidth);
            var me = this;

            if (optionsTA.onTextChangedWithoutDelay) {
                var existingEventHandler = optionsTA.onTextChangedWithoutDelay;
                optionsTA.onTextChangedWithoutDelay = $.proxy(function () {
                    existingEventHandler();
                    window.setTimeout(me.checkScrollbarWidth, 0); // give it time to understand if it has a scrollbar
                }, this);
            }
        }

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
        if (typeof (this.timeoutText) !== 'undefined' && this.timeoutText != null) {
            clearTimeout(this.timeoutText);
            this.timeoutText = null;
        }

        $.proxy(this.onNewParagraphWork, this)();
    },

    onTextChanged: function () {
        if (typeof (this.timeoutText) !== 'undefined' && this.timeoutText != null) {
            clearTimeout(this.timeoutText);
            this.timeoutText = null;
        }

        this.timeoutText = setTimeout($.proxy(this.onNewParagraphWork, this), 250);
    },

    onTextInput: function (event) {
        if (this.options._onTextInput) {
            this.options._onTextInput(event);
        }
    },

    onBackgroundHover: function (id, afterId) {
        var cursor = this.obj;
        var parent = typeof (id) === 'undefined' ? $('.backGroundSource').html('') : null;
        do {
            if (cursor == null) {
                //an extra blank line at the end. or IE 11 won't scroll far enough
                $('.backGroundSource').append($("<br/>"));
                break;
            }
            else {
                if (typeof (id) === 'undefined' || cursor.id == id) {
                    var text = cursor.string;
                    var sourceHtml = null;
                    if (typeof (id) === 'undefined') {
                        sourceHtml = $('<div></div>', { 'id': 'source-mt-' + cursor.id, 'cursorId': cursor.id, 'class': 'classMTsource' + (cursor.latest ? ' latestHighlight' : '') });
                        sourceHtml.appendTo(parent);
                    } else {
                        sourceHtml = $("#source-mt-" + id);
                        if (sourceHtml.length == 0) {
                            sourceHtml = $('<div></div>', { 'id': 'source-mt-' + cursor.id, 'cursorId': cursor.id, 'class': 'classMTsource' + (cursor.latest ? ' latestHighlight' : '') });
                            if (afterId) {
                                sourceHtml.insertAfter($("#source-mt-" + afterId));
                            } else {
                                sourceHtml.appendTo($('.backGroundSource'));
                            }
                        }
                        sourceHtml.empty();
                    }
                    if (text.replace(/\s/g, '').length == 0) {
                        sourceHtml.html('<br />');
                    } else {
                        var translationData = cursor.translation;
                        if ($widget.settings._enableParallelHover
                            && translationData
                            && translationData.originalSentenceRanges
                            && translationData.sourceWordRanges
                            && translationData.phraseAlignment
                            && translationData.confidentWordAlignment) {
                            $widget.textTranslator.drawSentencePhraseWordTags(sourceHtml, text, cursor.id, translationData.sourceWordRanges, translationData.originalSentenceRanges, translationData.phraseAlignment, translationData.confidentWordAlignment, 0);
                        } else {
                            sourceHtml.text(text);
                        }
                    }
                }
                cursor = cursor.child;
            }
        } while (true);
        $('.translateTextSource').trigger('scroll');
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
                if (cursor.translating) {
                    cursor.retranslate = true;
                }
            }
            else {
                cursor = cursor.child;
                if (cursor == null)
                    break;
            }
        } while (true);

        this.redrawResult();

        if ($widget.settings._onUrlEntered) {
            $widget.textTranslator.checkTextForUrl();
        }

        this.doTranslation({ translateAll: $widget.settings._translateAll });
    },

    previousScrollBarWidth: 0,

    checkScrollbarWidth: function () {
        var textarea = $($widget.settings._textSource)[0];
        if (textarea !== undefined) {
            var scrollbarWidth = textarea.offsetWidth - textarea.clientWidth;
            if (this.previousScrollBarWidth != scrollbarWidth) {
                // must re-align also background, but a bit later, when it surely is filled with data
                window.setTimeout(function () { $('.translateTextSource').trigger('scroll'); }, 50);
                $widget.settings._onScrollBarWidthChanged(scrollbarWidth);
                this.previousScrollBarWidth = scrollbarWidth;
            }
        }
    },

    redrawResult: function () {
        var cursor = this.pta.obj;
        $(this.options._textResult).html('');
        $(".backGroundSource .selected").removeClass("selected");
        do {
            if (cursor != null) {
                var txt = cursor.translation;
                translationData = null;
                if (cursor.translation.translation !== undefined) {
                    txt = cursor.translation.translation;
                    translationData = cursor.translation;
                }

                var isTranslated = cursor.translated || txt.replace(/\s/g, '').length == 0;
                var isEmptyLine = txt.replace(/\s/g, '').length == 0;

                var translationLine = $('<p></p>', { 'cursorId': cursor.id, 'class': 'mt-translation', 'aria-haspopup': 'true', 'id': 'mt-result-' + cursor.id } );
                if (isEmptyLine) {
                    translationLine.append($('<br />'));
                }
                else {
                    if ($widget.settings._enableParallelHover
                        && translationData
                        && translationData.translationSentenceRanges
                        && translationData.targetWordRanges
                        && translationData.phraseAlignment
                        && translationData.confidentWordAlignment) {
                        this.drawSentencePhraseWordTags(translationLine, txt, cursor.id, translationData.targetWordRanges, translationData.translationSentenceRanges, translationData.phraseAlignment, translationData.confidentWordAlignment, 1)
                    } else {
                        translationLine.text(txt);
                    }
                }
                $(this.options._textResult).append(translationLine);

                if (cursor.scroll != null && this.options.scrollToTranslated) {
                    $(this.options._textResult)[0].scrollTop = translationLine[0].offsetTop - ($(this.options._textResult).height() / 2);
                    cursor.scroll = null;
                }

                if (cursor.latest != null && this.options._highlightTranslated) {
                    $('.mt-translation[cursorId="' + cursor.id + '"]').addClass('latestHighlight');
                    $('.classMTsource[cursorId="' + cursor.id + '"]').addClass('latestHighlight');
                    var idThatWillNotChangeToMinusOne = cursor.id;

                    setTimeout($.proxy(function () {
                        this.latest = null;
                        $('.mt-translation[cursorId="' + idThatWillNotChangeToMinusOne + '"]').removeClass('latestHighlight');
                        $('.classMTsource[cursorId="' + idThatWillNotChangeToMinusOne + '"]').removeClass('latestHighlight');
                    }, cursor), this.options._highlightTranslatedTimeout);
                }

                if (isTranslated) {
                    translationLine.removeAttr('translationProgress');
                }
                else {
                    translationLine.attr('translationProgress', 'true')
                }

                cursor = cursor.child;
            }
            else {
                break;
            }
        } while (true);
        if (this.options._onScrollBarWidthChanged) {
            this.checkScrollbarWidth();
        }
    },

    highlightMouseEnter: function (event) {
        var classes = $(this).attr("class").split(' ');
        var hoverClasses = [];
        var siblingClasses = [];
        for (var classIndex = 1; classIndex < classes.length; classIndex++) {
            if (classes[classIndex] && classes[classIndex] != "hover" && classes[classIndex] != "highlight-sibling" && !classes[classIndex].indexOf("sibling") == 0) {
                hoverClasses.push("." + classes[classIndex]);
            }
            if (classes[classIndex] && classes[classIndex].indexOf("sibling") == 0) {
                siblingClasses.push("." + classes[classIndex].replace("sibling", "word"));
            }
        }
        if (hoverClasses.length > 0) {
            $(hoverClasses.join(", ")).addClass("hover");
        }
        if (siblingClasses.length > 0) {
            $(siblingClasses.join(", "), $(this).parent().parent()).addClass("highlight-sibling");
        }
    },

    highlightMouseLeave: function (event) {
        var classes = $(this).attr("class").split(' ');
        var hoverClasses = [];
        var siblingClasses = [];
        for (var classIndex = 1; classIndex < classes.length; classIndex++) {
            if (classes[classIndex] && classes[classIndex] != "hover" && classes[classIndex] != "highlight-sibling" && !classes[classIndex].indexOf("sibling") == 0) {
                hoverClasses.push("." + classes[classIndex]);
            }
            if (classes[classIndex] && classes[classIndex].indexOf("sibling") == 0) {
                siblingClasses.push("." + classes[classIndex].replace("sibling", "word"));
            }
        }
        if (hoverClasses.length > 0) {
            $(hoverClasses.join(", ")).removeClass("hover");
        }
        if (siblingClasses.length > 0) {
            $(siblingClasses.join(", "), $(this).parent().parent()).removeClass("highlight-sibling");
        }
    },

    highlightMouseEnterWithoutBubble: function (event) {
        event.stopPropagation();
        $.proxy($widget.textTranslator.highlightMouseEnter, this)(event);
    },

    highlightMouseLeaveWithoutBubble: function (event) {
        event.stopPropagation();
        $.proxy($widget.textTranslator.highlightMouseLeave, this)(event);
    },

    translationSentenceClicked: function (event) {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $(".backGroundSource .sentence." + $(this).attr("class").split(' ')[1]).removeClass("selected");
        }
        else {
            $(".backGroundSource .sentence.selected").removeClass("selected");
            $(".translateTextResult .sentence.selected").removeClass("selected");
            $(this).addClass("selected");
            $(".backGroundSource .sentence." + $(this).attr("class").split(' ')[1]).addClass("selected");
        }
    },

    drawSentencePhraseWordTags: function (lineHtml, text, cursorId, wordRanges, sentenceRanges, phraseAlignment, wordAlignment, alignmentIndex) {

        if (alignmentIndex == 0) {
            //re-sort phrase alignment by source not target
            sortedPhraseAlignment = phraseAlignment.slice();
            sortedPhraseAlignment.sort(function (a, b) {
                return a[0][0] - b[0][0];
            });
            phraseAlignment = sortedPhraseAlignment;
        }

        lastRangeEnd = 0;
        phraseIndex = -1;
        phraseHtml = null;
        sentenceIndex = -1;
        sentenceHtml = null;
        for (var wordIndex = 0; wordIndex < wordRanges.length; wordIndex++) {
            var textPrefix = null;
            if (lastRangeEnd < wordRanges[wordIndex][0]) {
                textPrefix = document.createTextNode(
                    text.substring(
                        lastRangeEnd,
                        wordRanges[wordIndex][0]))
            }
            lastRangeEnd = wordRanges[wordIndex][1];
            if (phraseIndex >= 0 && $.inArray(wordIndex, phraseAlignment[phraseIndex][alignmentIndex]) > -1) {
                //still the same phrase
                if (textPrefix !== null) {
                    if ($.trim(textPrefix.nodeValue) == '') {
                        //whitespace between words
                        phraseHtml.append(textPrefix);
                    } else {
                        //if more than whitespace between words (like tags) then split the phrase
                        sentenceHtml.append(phraseHtml);
                        sentenceHtml.append(textPrefix);
                        phraseHtml = $('<span></span>', { 'class': 'phrase phrase-' + cursorId + '-' + phraseAlignment[phraseIndex][0].join("-") + "-" + phraseAlignment[phraseIndex][1].join("-") });
                        phraseHtml.hover(alignmentIndex == 1 ? this.highlightMouseEnter : this.highlightMouseEnterWithoutBubble, alignmentIndex == 1 ? this.highlightMouseLeave : this.highlightMouseLeaveWithoutBubble);
                    }
                }
            } else {
                //new phrase started
                if (phraseHtml) {
                    sentenceHtml.append(phraseHtml);
                }
                if (textPrefix !== null) {
                    if (sentenceIndex >= 0 && (wordRanges[wordIndex][0] <= (sentenceRanges[sentenceIndex][0] + sentenceRanges[sentenceIndex][1]))) {
                        //whitespace between phrases (and not between sentences)
                        sentenceHtml.append(textPrefix);
                    }
                }
                phraseIndex += 1;
                phraseHtml = $('<span></span>', { 'class': 'phrase phrase-' + cursorId + '-' + (phraseAlignment.length > 0 ? (phraseAlignment[phraseIndex][0].join("-") + "-" + phraseAlignment[phraseIndex][1].join("-")) : "0") });
                phraseHtml.hover(alignmentIndex == 1 ? this.highlightMouseEnter: this.highlightMouseEnterWithoutBubble, alignmentIndex == 1 ? this.highlightMouseLeave : this.highlightMouseLeaveWithoutBubble);
            }
            if (sentenceIndex < 0 || (wordRanges[wordIndex][0] > (sentenceRanges[sentenceIndex][0] + sentenceRanges[sentenceIndex][1]))) {
                // new sentence started
                if (sentenceHtml) {
                    lineHtml.append(sentenceHtml);
                }
                if (textPrefix !== null) {
                    // whitespace between sentences
                    lineHtml.append(textPrefix);
                }
                sentenceIndex += 1;
                sentenceHtml = $('<span></span>', { 'class': 'sentence sentence-' + cursorId + '-' + sentenceIndex });
                sentenceHtml.hover(alignmentIndex == 1 ? this.highlightMouseEnter : this.highlightMouseEnterWithoutBubble, alignmentIndex == 1 ? this.highlightMouseLeave : this.highlightMouseLeaveWithoutBubble);
                if (alignmentIndex == 1) {
                    sentenceHtml.click(this.translationSentenceClicked);
                }
            }
            var wordClasses = [];
            for (var i = 0; i < wordAlignment.length; i++) {
                if (wordAlignment[i][alignmentIndex] == wordIndex) {
                    wordClasses.push('word-' + cursorId + '-' + wordAlignment[i][0] + '-' + wordAlignment[i][1]);
                    for (var j = 0; j < wordAlignment.length; j++) {
                        if (wordAlignment[j][alignmentIndex == 1 ? 0 : 1] == wordAlignment[i][alignmentIndex == 1 ? 0 : 1] && j != i) {
                            wordClasses.push('sibling-' + cursorId + '-' + wordAlignment[j][0] + '-' + wordAlignment[j][1]);
                        }
                    }
                }
            }
            wordHtml = $('<span></span>', { 'class': 'word ' + wordClasses.join(' ')})
                .text(
                    text.substring(
                        wordRanges[wordIndex][0],
                        wordRanges[wordIndex][1]));
            wordHtml.hover(alignmentIndex == 1 ? this.highlightMouseEnter : this.highlightMouseEnterWithoutBubble, alignmentIndex == 1 ? this.highlightMouseLeave : this.highlightMouseLeaveWithoutBubble);
            phraseHtml.append(wordHtml);

        }
        //last phrase
        if (phraseHtml.html()) {
            sentenceHtml.append(phraseHtml);
        }
        //last sentence
        if (sentenceHtml.html()) {
            lineHtml.append(sentenceHtml);
        }
        //whitespace after sentence
        if (lastRangeEnd < text.length) {
            lineHtml.append(
                document.createTextNode(
                    text.substring(
                        lastRangeEnd,
                        text.length)));
        }
    },

    makeAllNotTranslated: function () {
        var cursor = this.pta.obj;
        do {
            if (cursor != null) {
                cursor.translated = false;
                cursor.changed = false;
                cursor.translating = false;
                cursor.retranslate = false;
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

    checkTextForUrl: function () {
        var text = $(this.options._textSource, this.options.container).val();
        var urlPattern = /\b((?:https?:(?:\/{1,3}|[a-z0-9%])|[a-z0-9.\-]+[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\/)(?:[^\s()<>{}\[\]]+|\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\))+(?:\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])|(?:[a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\b\/?(?!@)))/gi;
        var urlMatch = urlPattern.exec(text);
        if (urlMatch) {
            var url = urlMatch[0];
            if (url.length / $.trim(text).length > 0.8) // most of the text is url
            {
                $widget.settings._onUrlEntered(url);
            }
        }
    },

    doTranslation: function (options) {
        $(".editButtonContainer").addClass("hide");
        $(".backGroundSource .selected").removeClass("selected");
        $(".translateTextResult .selected").removeClass("selected");

        
        this.redrawBackground();

        cursor = this.pta.obj;

        if (!this.translationInProgress && cursor) {
            this.translationInProgress = true;
            if (this.options._onTranslationStarted)
                this.options._onTranslationStarted();
        }

        if (typeof (options) === 'undefined') {
            options = { translateAll: false };
        }

        if (options.translateAll)
            this.makeAllNotTranslated();

        // tts speakers
        if ($widget.settings._useSpeakers) {
            $('.sourceSpeak').addClass('hide');
            if ($widget.getActiveSystemObj() && $(".translateTextSource").val()) {
                var src = $widget.getActiveSystemObj().SourceLanguage.Code;
                if (src === 'lv') {
                    $('.sourceSpeak').removeClass('hide');
                }
            }
        }

        // use dictonary service
        // only if source and target are 'lv' <-> 'en'
        // and if only one paragraph is entered
        if ($widget.getActiveSystemObj() !== null) {
            var sysSrcCode = $widget.getActiveSystemObj().SourceLanguage.Code,
                sysTrgCode = $widget.getActiveSystemObj().TargetLanguage.Code,
                lngDirection = sysSrcCode + '-' + sysTrgCode;
            if ($widget.settings._useDictionary && (lngDirection === 'en-lv' || lngDirection === 'lv-en' || lngDirection === 'lv-ru')) {
                // check if only one word is entered
                text = $(".translateTextSource").val().trim();
                if (text.length > 0 && text.search(/\s/g) == -1) {
                    this.doDictionaryTranslation(sysSrcCode, sysTrgCode, cursor.string, options);
                    return;
                }
            }
        }
        this.doTextTranslation(options);
    },

    doDictionaryTranslation: function (sysSrcCode, sysTrgCode, phrase, options) {
        $.ajax({
            context: {
                ref: this
            },
            dataType: this.options.jsonType,
            type: 'GET',
            contentType: 'application/json',
            url: this.options._dictionaryUrl,
            data: {
                appid: this.options._appId,
                srcLng: sysSrcCode,
                trgLng: sysTrgCode,
                phrase: phrase
            },
            success: function (result) {
                // if data is empty do mt translation
                var entry = result.data;
                if (entry !== '') {
                    //javascript replace operation replaces only the first occurance
                    //thus the strange split/join, which replaces all
                    entry = entry.split('SEE_FULL_ENTRY').join(uiResources[$widget.settings._language]['seeFullEntry']);
                    entry = entry.split('<a href').join('<a target="_blank" href');
                    $(this.ref.options._textResult).html(entry);

                    $('.translateResultClear', $widget.settings.container).removeClass('hide');

                    cursor.translating = false;
                    cursor.translated = true;

                    this.ref.checkIfStoppedTranslating();
                }
                else { 
                    this.ref.doTextTranslation(options)
                }
            },
            error: this.onSuccess
        });
    },

    checkIfStoppedTranslating: function () {
        var otherCursor = this.pta.obj;
        var somethingTranslating = false;
        do {
            if (otherCursor) {
                if (otherCursor.string != "" && (!otherCursor.translated || otherCursor.translating)) {
                    somethingTranslating = true;
                }
                otherCursor = otherCursor.child;
            }
        } while (otherCursor);

        if (!somethingTranslating) {
            this.translationInProgress = false;
            if (this.options._onTranslationFinished) {
                this.options._onTranslationFinished();
            }
            if ($(".editButtonContainer").hasClass("hide")) {
                if ($(".translateTextResult p").length > 0 && $(".translateTextResult p[translationprogress=true]").length == 0) {
                    $(".editButtonContainer").removeClass("hide");
                }
            }
        }
    },

    doTextTranslation: function (options) {
        var previousId = null;
        do {
            var that = this;
            if (cursor && cursor.translating) {
                window.setTimeout(function () { that.doTextTranslation(options); }, 100);
                break;
            }

            if (cursor && !cursor.changed && (!cursor.translated || cursor.retranslate) && !cursor.translating) {
                cursor.translating = true;
                cursor.retranslate = false;

                // case if there is no internet
                if ($('#hidOnline').val() === 'false') {
                    if (this.options._onTranslationFinished)
                        this.options._onTranslationFinished();

                    this.translationInProgress = false;

                    $($widget.settings._textResult, $widget.settings.container)
                        .text(uiResources[$widget.settings._language]['noInternet'])
                        .addClass('noNetwork');
                    cursor.translating = false;
                    return;
                }

                // case if there is translation limit reached
                if ($widget.settings._translationLimit !== -1 && $widget.translatedCnt > $widget.settings._translationLimit) {
                    if (this.options._onTranslationFinished)
                        this.options._onTranslationFinished();

                    this.translationInProgress = false;

                    $($widget.settings._textResult, $widget.settings.container)
                        .text(uiResources[$widget.settings._language]['transLimit'])
                        .addClass('transLimit');
                    cursor.translating = false;
                    return;
                }

                // case if system is not ready for translation
                if ($('.translateTextTempSourceContainer').attr('data-disabled') === "true") {
                    if (this.options._onTranslationFinished)
                        this.options._onTranslationFinished();

                    this.translationInProgress = false;
                    cursor.translating = false;
                    return;
                }

                this.redrawBackground(cursor.id, previousId);

                if (typeof(cursor.translation.translation) == "undefined" && cursor.translation.replace(/\s/g, '').length == 0) {
                    cursor.translated = true;
                    cursor.translating = false;
                }
                else {
                    if (!$widget.settings._focusAfterTranslate) {
                        $($widget.settings._textSource).blur();
                    }

                    $('.translateResultClear', $widget.settings.container).removeClass('hide');

                    $('.sourceLang', $widget.settings.container).text($('.translateSourceLang option:selected', $widget.settings.container).text());
                    $('.targetLang', $widget.settings.container).text($('.translateTargetLang option:selected', $widget.settings.container).text());

                    $($widget.settings._textResult, $widget.settings.container).removeClass('noNetwork');
                    
                    // hide intro
                    if ($widget.settings._landingView) {
                        $('.fakeCursor', $widget.settings.container).addClass('hide');
                        $('.translateContainerRight', $widget.settings.container).removeClass('hide');
                        $('.translateContainerLeft, .translateContainerHeader', $widget.settings.container).removeClass('intro');
                    }

                    $.ajax({
                        context: {
                            id: cursor.id,
                            obj: this,
                            onAjaxError: this.options.onAjaxError
                        },
                        dataType: this.options.jsonType,
                        type: 'POST',
                        contentType: 'application/json',
                        url: this.options._translationUrl,
                        headers: $widget.getAuthHeaders(),
                        data: JSON.stringify({
                            appID: this.options._appId,
                            text: cursor.string,
                            systemID: $widget.activeSystemId,
                            options: "widget=text,alignment,markSentences" + (($widget.termCorpusId && $widget.getSelectedTermCorpusStatus() == "Ready") ? ",termCorpusId=" + $widget.termCorpusId : "")
                        }),
                        success: this.onSuccess,
                        error: this.onSuccess
                    });
                    break;
                }
            }
            else {
                if (cursor == null) {
                    this.checkIfStoppedTranslating();
                    break;
                }
                previousId = cursor.id;
                cursor = cursor.child;
            }
        } while (true);
    },

    onSuccess: function (result) {
        if (result.status == 401 && $widget.settings._loginUrl) {
            window.location = $widget.settings._loginUrl;
        }

        var id = this.id;
        var previousId = null;
        if (typeof (this.obj) === "undefined") {
            return;
        }
        var cursor = this.obj.pta.obj;

        do {
            if (cursor.id == id) {
                cursor.translating = false;
            }

            if (cursor.id == id && !cursor.changed) {
                cursor.translated = true;
                cursor.latest = true;
                cursor.scroll = true;
                if (typeof (result) === 'undefined' || result == null || (result.status && result.status !== '200' ) || !(result.translation || result.replace)) {
                    // system is in standby mode
                    var waking = false;
                    if (typeof (result.responseJSON) !== 'undefined')
                        if (typeof (result.responseJSON.ErrorCode) !== 'undefined')
                            if (result.responseJSON.ErrorCode === '21') {
                                //wake up
                                if ($widget.showSystemWaking && typeof ($widget.showSystemWaking) === "function") {
                                    $widget.showSystemWaking(false);
                                    waking = true;
                                }
                            }
                    cursor.translation = (waking) ? cursor.translation : '{{' + cursor.translation + '}}';
                }
                else {
                    // increase sentence counter
                    if (result.countSentences !== undefined) {
                        var cnt = parseInt(result.countSentences);
                        $widget.translatedCnt += (cnt > 0) ? cnt : 1;
                    }
                    else {
                        $widget.translatedCnt++;
                    }
                    cursor.translation = result;

                    // tts speakers
                    if ($widget.settings._useSpeakers) {
                        $('.targetSpeak').addClass('hide');
                        var trg = $widget.getActiveSystemObj().TargetLanguage.Code;
                        if (trg === 'lv') {
                            $('.targetSpeak').removeClass('hide');
                        }
                    }
                }

                this.obj.checkIfStoppedTranslating();
                break;
            }
            else {
                previousId = cursor.id;
                cursor = cursor.child;
                if (cursor == null)
                    break;
            }
        } while (true);

        this.obj.redrawResult();
        this.obj.redrawBackground(id, previousId);

        this.obj.doTranslation({ translateAll: false });
    },

    redrawBackground: function (id, afterId) {
        if (this.options._enableParallelHover) {
            $.proxy(this.onBackgroundHover, this.pta)(id, afterId);
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
    translating: false,
    retranslate: false,
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
        copyOf.translated = child.translated;
        copyOf.translating = child.translating;
        copyOf.retranslate = child.retranslate;

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
    onTextInput: null,
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
        if (this.options.onTextChangedWithoutDelay){
            this.options.onTextChangedWithoutDelay();
        }

        if (typeof (this.kayTimeout) !== 'undefined' && this.kayTimeout != null) {
            clearTimeout(this.kayTimeout);
            this.kayTimeout = null;
        }

        if (typeof (event) === 'undefined' || event.keyCode == 13) {
            this.onKeyStrokeSub(event);
            this.triggerOnTextInput(event);
            return;
        }
        
        var e = event;
        this.kayTimeout = setTimeout($.proxy(function () {
            this.onKeyStrokeSub(e);
            this.kayTimeout = null;
            this.triggerOnTextInput(e);
        }, this), 2000);
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
            if (this.options.directCompare || (Math.abs(charsChanged) >= 1 || charMultiChanges)) {
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
                            newObj.translating = oldObj.translating;
                            newObj.retranslate = oldObj.retranslate;
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
                                        var n_translating = null;
                                        var n_retranslate = null;

                                        if (activeSource.string == postcurrent.string) {
                                            var n_id = activeSource.id;
                                            var n_changed = activeSource.changed;
                                            var n_translated = activeSource.translated;
                                            var n_translation = activeSource.translation;
                                            var n_translating = activeSource.translating;
                                            var n_retranslate = activeSource.retranslate;
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
                                            activeSource.child.translating = n_translating;
                                            activeSource.child.retranslate = n_retranslate;
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


        var oldParaCount = (this.oldString.match(/\n/g) || []).length;
        var newParaCount = ($(this.options.textAreaSelector).val().match(/\n/g) || []).length;

        if (oldParaCount != newParaCount) {
            this.triggerOnNewParagraph();
        } else {
            if (!charsEqual) {
                this.triggerOnNewText();
            }
        }

        this.oldString = $(this.options.textAreaSelector).val();
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

    redrawBackground: function (id, afterId) {
        if (this.options.onBackgroundHover) {
            $.proxy(this.options.onBackgroundHover, this)(id, afterId);
        }
    },

    triggerOnTextInput: function (event) {
        if (this.options.onTextInput) {
            this.options.onTextInput(event);
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
/* tilde.translator.widget.TRANSLATEWEB.js */

$.extend(Tilde.TranslatorWidgetDefaultOptions, {
    _websiteTranslationUrl: 'http://localhost:53130/Translate/WebsiteEmbedded?embeddedStyle=noUI', // address of website translation page (that uses TranslateProxy)
    _debug: false, // should debug information be logged to console
    _onWebTranslateUrlLoaded: null, // callback on web page loaded
    _webLangAutodetect: true // after page is loaded auto detect language and change active system  
});

$.extend(Tilde.TranslatorWidget.prototype, {

    webPluginInit: function () {
        if ($('#websiteFrame', $widget.settings.container).length == 0)
            return;

        // schema, domain and port, used when passing messages to iframe
        // so that other domains don't see the messages
        var returnUrlIndex = $widget.settings._websiteTranslationUrl.indexOf("returnUrl");
        var websiteTranslationUrl;
        if (returnUrlIndex > -1) {
            websiteTranslationUrl = decodeURIComponent($widget.settings._websiteTranslationUrl.substring(returnUrlIndex + 10));
        } else {
            websiteTranslationUrl = $widget.settings._websiteTranslationUrl;
        }

        $widget.translateWeb_IframeSchemaPortDomain = websiteTranslationUrl.substring(
            0,
            websiteTranslationUrl.indexOf(
                "/",
                websiteTranslationUrl.indexOf("://") + 3));

        $widget.translateWeb_Url = $('.url', $widget.settings.container);
        $widget.translateWeb_Iframe = $('#websiteFrame', $widget.settings.container)[0];
        $widget.translateWeb_IframeContainer = $('#websiteFrameContainer', $widget.settings.container);
        $widget.translateWeb_translateButton = $('.translateButton', $widget.settings.container);
        $widget.translateWeb_cancelButton = $('.cancelButton', $widget.settings.container);
        $widget.translateWeb_restoreButton = $('.restoreButton', $widget.settings.container);
        $widget.translateWeb_spinner = $('.translateProgress', $widget.settings.container);
        $widget.translateWeb_translating = false;

        // pass appId to web translation widget
        var extraParams = "";
        if ($widget.settings._websiteTranslationUrl.indexOf("returnUrl") > -1) {
            // real url given in querystring param
            if ($widget.settings._websiteTranslationUrl.indexOf("%3f") > -1) {
                extraParams += "%26";
            } else {
                extraParams += "%3f";
            }
            extraParams += "appId%3d" + $widget.settings._appId;
            if ($widget.settings._clientId) {
                extraParams += "%26clientId%3d" + $widget.settings._clientId;
            }
            if ($widget.settings._allowedSystemStatuses) {
                extraParams += "%26allowedSystemStatuses%3d" + encodeURIComponent(encodeURIComponent($widget.settings._allowedSystemStatuses));
            }
            if ($widget.settings._getFilteredSystems) {
                extraParams += "%26filterSystemsByAppId%3dtrue";
            }
        }
        else {
            // normal url
            if ($widget.settings._websiteTranslationUrl.indexOf("?") > -1) {
                extraParams += "&";
            } else {
                extraParams += "?";
            }
            extraParams += "appId=" + $widget.settings._appId;
            if ($widget.settings._clientId) {
                extraParams += "&clientId=" + $widget.settings._clientId;
            }
            if ($widget.settings._allowedSystemStatuses) {
                extraParams += "&allowedSystemStatuses=" + encodeURIComponent($widget.settings._allowedSystemStatuses);
            }
            if ($widget.settings._getFilteredSystems) {
                extraParams += "&filterSystemsByAppId=true";
            }
        }
        $widget.settings._websiteTranslationUrl += extraParams;

        // when address is entered, start loading it in iframe
        $('.loadButton', $widget.settings.container).click(function () {
            $widget.translateWeb_loadUrl();
        });

        $('.url', $widget.settings.container).keypress(function (event) {
            if (event.which == 13) {
                $widget.translateWeb_loadUrl();
                event.preventDefault();
            }
        });

        // start translation when translate button is pressed (and load the entered url, if it was not loaded before)
        $widget.translateWeb_translateButton.click(function () {
            if ($widget.translateWeb_translateButton.attr('data-disabled') === 'true') {
                return false;
            }
            $widget.translateWeb_translateButton.attr('data-disabled', true);
            $widget.disableSystemChange();
            var message = { "message": "loadUrl", "url": $widget.translateWeb_Url.val(), "translateAfterLoad": true };
            if ($widget.termCorpusId && $widget.getSelectedTermCorpusStatus() == "Ready") {
                message["termCorpusId"] = $widget.termCorpusId;
            }
            $widget.translateWeb_sendMessageToIframe(message);
        });

        // cancel translation
        $widget.translateWeb_cancelButton.click(function () {
            $widget.translateWeb_cancelButton.attr('data-disabled', true);
            $widget.translateWeb_sendMessageToIframe({ "message": "untranslate" });
        });

        // restore translated page to original
        $widget.translateWeb_restoreButton.click(function () {
            $widget.translateWeb_restoreButton.attr('data-disabled', true);
            $widget.translateWeb_sendMessageToIframe({ "message": "untranslate" });
        });

        // handle messages received from iframe
        window.removeEventListener("message", $widget.translateWeb_initIframeMsg);
        window.addEventListener("message", $widget.translateWeb_initIframeMsg, false);

        $widget.translateWeb_IframeLastScrollWidth = null;
        $widget.translateWeb_IframeLastScrollHeight = null;
        $widget.translateWeb_resizeLayout();

        $widget.settings._onWidgetLoaded = function () {
            // load translation page in iframe
            window.open($widget.settings._websiteTranslationUrl, "websiteFrame");
        };
    },

    translateWeb_initIframeMsg: function (event) {
        if ($widget.settings._debug) {
            console.info("Message received from iframe:" + JSON.stringify(event.data));
        }

        if (event.data && event.data.message) {
            switch (event.data.message) {
                case "ready":
                    // when system is changed in UI, inform  translate widget in iframe
                    $widget.onSystemChangedHandlers.push(function (systemId) {
                        if ($widget.translateWeb_systemSuggestedByIframe == systemId) {
                            //if system change was initiated by iframe, don't loop the event back to iframe
                            $widget.translateWeb_systemSuggestedByIframe = null;
                        } else {
                            $widget.translateWeb_sendMessageToIframe({ "message": "changeSystem", "systemId": $widget.activeSystemId });
                        }
                    });

                    // push system list to iframe when it is changed
                    $widget.onSystemListLoadedHandlers.push(function (systemList) {
                        var data = [];
                        for (var i = 0; i < systemList.length; i++) {
                            data.push({ "id": systemList[i].ID, "sourceLanguage": systemList[i].SourceLanguage.Code, "targetLanguage": systemList[i].TargetLanguage.Code, "name": systemList[i].Title ? systemList[i].Title.Text : systemList[i].ID, "order": i });
                        }

                        $widget.translateWeb_sendMessageToIframe({ "message": "setSystemList", "systemList": data });
                    });

                    // push system list to iframe
                    var data = [];
                    var systemList = $widget.settings._systems;
                    if (systemList != null) {
                        for (var i = 0; i < systemList.length; i++) {
                            data.push({ "id": systemList[i].ID, "sourceLanguage": systemList[i].SourceLanguage.Code, "targetLanguage": systemList[i].TargetLanguage.Code, "name": systemList[i].Title ? systemList[i].Title.Text : systemList[i].ID, "order": i });
                        }
                    }

                    $widget.settingSystemListForFirstTime = true;
                    $widget.translateWeb_sendMessageToIframe({ "message": "setSystemList", "systemList": data });

                    $("input.url").blur().focus();//autofocus has stopped working in Chrome
                    break;
                case "urlLoaded":
                    // webpage finished loading, set the full url in address box
                    $widget.translateWeb_Url.val(event.data.url);
                    $widget.translateWeb_translateButton.removeClass("hide");
                    $widget.translateWeb_translateButton.attr('data-disabled', false);
                    break;
                case "startedLoading":
                    // show spinner
                    $widget.translateWeb_spinner.removeClass("hide");
                    $widget.translateWeb_cancelButton.addClass("hide");
                    $widget.translateWeb_restoreButton.addClass("hide");
                    $widget.translateWeb_translateButton.addClass("hide");
                    break;
                case "stoppedLoading":
                    if (!$widget.translateWeb_translating) {
                        // if not translating right after page load
                        $widget.enableSystemChange();
                        $widget.translateWeb_cancelButton.addClass("hide");
                        $widget.translateWeb_restoreButton.addClass("hide");
                        $widget.translateWeb_translateButton.removeClass("hide");
                        $widget.translateWeb_translateButton.attr('data-disabled', false);
                        $widget.translateWeb_spinner.addClass("hide");
                    }
                    break;
                case "systemChanged":

                    // set default system, right after web translation widget in iframe is loaded
                    if ($widget.settingSystemListForFirstTime) {
                        $widget.settingSystemListForFirstTime = false;
                        $widget.translateWeb_sendMessageToIframe({ "message": "changeSystem", "systemId": $widget.activeSystemId });
                    } else {
                        // if initiated by language of the loaded webpage being different
                        // than source language of currently selected  system
                        // we should change the system in UI and warn the user about the fact
                        if (event.data.auto && event.data.changed) {
                            if ($widget.settings._webLangAutodetect) {
                                $widget.translateWeb_systemSuggestedByIframe = event.data.systemId;
                                $widget.setActiveSystem(event.data.systemId);

                                // one of those must exist
                                $('.translateSourceLangContainer .fancy-select .trigger', $widget.settings.container).addClass("attention");
                                $('.translateSourceLangContainer .translateSingleSourceLang', $widget.settings.container).addClass("attention");
                                $('.translateSystemContainer .fancy-select .trigger', $widget.settings.container).addClass("attention");

                                setTimeout(function () {
                                    $('.translateSourceLangContainer .fancy-select .trigger', $widget.settings.container).removeClass("attention");
                                    $('.translateSourceLangContainer .translateSingleSourceLang', $widget.settings.container).removeClass("attention");
                                    $('.translateSystemContainer .fancy-select .trigger', $widget.settings.container).removeClass("attention");
                                }, 5000);
                            }
                            else {
                                $widget.translateWeb_systemSuggestedByIframe = $widget.activeSystemId;
                                $widget.translateWeb_sendMessageToIframe({ "message": "changeSystem", "systemId": $widget.activeSystemId });
                            }
                        }
                    }

                    break;
                case "translationStarted":
                    // disable system change, show cancel button
                    $widget.disableSystemChange();
                    $widget.translateWeb_translateButton.addClass("hide");
                    $widget.translateWeb_cancelButton.removeClass("hide");
                    $widget.translateWeb_cancelButton.attr('data-disabled', false);
                    $widget.translateWeb_spinner.removeClass("hide");
                    $widget.translateWeb_translating = true;
                    break;
                case "translationStopped":
                    $widget.translateWeb_translating = false;
                    $widget.translateWeb_spinner.addClass("hide");
                    break;
                case "translated":
                    // show restore button
                    $widget.translateWeb_cancelButton.addClass("hide");
                    $widget.translateWeb_restoreButton.removeClass("hide");
                    $widget.translateWeb_restoreButton.attr('data-disabled', false);
                    break;
                case "untranslated":
                    // enable system change, show translate button
                    $widget.enableSystemChange();
                    $widget.translateWeb_cancelButton.addClass("hide");
                    $widget.translateWeb_restoreButton.addClass("hide");
                    $widget.translateWeb_translateButton.removeClass("hide");
                    $widget.translateWeb_translateButton.attr('data-disabled', false);
                    break;
                case "error":
                    // enable system change, show translate button
                    $widget.enableSystemChange();
                    $widget.translateWeb_cancelButton.addClass("hide");
                    $widget.translateWeb_restoreButton.addClass("hide");
                    $widget.translateWeb_translateButton.removeClass("hide");
                    $widget.translateWeb_translateButton.attr('data-disabled', false);
                    if (console) {
                        console.error(event.data.description);
                    }
                    if (!event.data.shownInUI) {
                        // check wake up case
                        if (event.data.description.indexOf("system is starting") !== -1) {
                            if ($widget.showSystemWaking && typeof ($widget.showSystemWaking) === "function") {
                                $widget.showSystemWaking(false);
                            }
                            else {
                                alert(event.data.description);
                            }
                        }
                        else {
                            alert(event.data.description);
                        }
                    }
                    break;
                case "warning":
                    if (console) {
                        console.warn(event.data.description);
                    }
                    break;
                default:
                    break;
            }
        }
    },

    translateWeb_loadUrl: function () {
        $widget.translateWeb_sendMessageToIframe({ "message": "loadUrl", "url": $widget.translateWeb_Url.val(), "translateAfterLoad": false });

        // enable system change (if url changed in address box, but not if user clicked on link)
        $widget.enableSystemChange();

        // callback
        if ($widget.settings._onWebTranslateUrlLoaded && typeof ($widget.settings._onWebTranslateUrlLoaded) === "function") {
            $widget.settings._onWebTranslateUrlLoaded($widget.translateWeb_Url.val());
        }
    },

    translateWeb_sendMessageToIframe: function (message) {
        if ($widget.settings._debug) {
            console.info("Message sent to iframe:" + JSON.stringify(message));
        }

        $widget.translateWeb_Iframe.contentWindow.postMessage(
            message,
            $widget.translateWeb_IframeSchemaPortDomain);
    },

    translateWeb_resizeLayout: function () {
        // resize iframe to fit content on small screens and make iframe static
        // so that whole screen can be used for scrolling/zooming (scrolling the header away)
        if (window.innerWidth < $.fn.getDefaultFontSize()[0] * 50 || window.innerHeight < $.fn.getDefaultFontSize()[1] * 30) {
            if ($widget.translateWeb_Iframe.contentWindow && $widget.translateWeb_Iframe.contentWindow.document && $widget.translateWeb_Iframe.contentWindow.document.body) {
                if ($widget.translateWeb_IframeLastScrollWidth != $widget.translateWeb_Iframe.contentWindow.document.body.scrollWidth
                    || $widget.translateWeb_IframeLastScrollHeight != $widget.translateWeb_Iframe.contentWindow.document.body.scrollHeight) {
                    $widget.translateWeb_IframeLastScrollWidth = $widget.translateWeb_Iframe.contentWindow.document.body.scrollWidth;
                    $widget.translateWeb_IframeContainer.width($widget.translateWeb_IframeLastScrollWidth);
                    $widget.translateWeb_IframeLastScrollHeight = $widget.translateWeb_Iframe.contentWindow.document.body.scrollHeight;
                    $widget.translateWeb_IframeContainer.height($widget.translateWeb_IframeLastScrollHeight);
                }
            } else {
                $widget.translateWeb_IframeContainer.css("height", "");
                $widget.translateWeb_IframeContainer.css("width", "");
                $widget.translateWeb_IframeLastScrollWidth = null;
                $widget.translateWeb_IframeLastScrollHeight = null;
            }
            $widget.translateWeb_IframeContainer.css("position", "static");
        } else if (typeof $widget.translateWeb_IframeContainer !== "undefined") {
            $widget.translateWeb_IframeContainer.css("height", "");
            $widget.translateWeb_IframeContainer.css("width", "");
            $widget.translateWeb_IframeContainer.css("position", "");
        }
        window.setTimeout($widget.translateWeb_resizeLayout, 100);
    }
});

Tilde.TranslatorWidget.prototype.pluginInitializers.push(Tilde.TranslatorWidget.prototype.webPluginInit);
/* UI texts */

uiResources = $.extend(true, uiResources, {
    'en': {
        "E_DEFAULT_ERROR": "Error occurred while translating.",
        "E_UNKNOWN_FILE_TYPE": "Unknown file type.",
        "E_CANNOT_READ_FILE": "Cannot read file, file may be corrupted.",
        "E_FAILED_IN_TRANSLATION": "Error occurred while translating.",
        "E_FORMAT_TRACK_CHANGES": "Could not translate because track changes was turned on. Changes must first be accepted.",
        "E_UNKNOWN_ERROR": "An unknown error occurred.",
        "E_UNAUTHORIZED": "Document translation was denied.",
        "W_TIMEOUT": "Some sentences are not translated, because translation took too much time.",
        "W_SENTENCE_TOO_LONG": "Some sentences are not translated, because they are too long."
    },
    'lv': {
        "E_DEFAULT_ERROR": "Tulkojot radās kļūda.",
        "E_UNKNOWN_FILE_TYPE": "Nezināms faila tips.",
        "E_CANNOT_READ_FILE": "Neizdevās nolasīt faila saturu, iespējams, fails ir bojāts.",
        "E_FAILED_IN_TRANSLATION": "Tulkojot radās kļūda.",
        "E_FORMAT_TRACK_CHANGES": "Nevarēja iztulkot dokumentu, jo bija ieslēgta izmaiņu reģistrēšana. Vispirms apstipriniet izmaiņas.",
        "E_UNKNOWN_ERROR": "Radās nezināma kļūda.",
        "E_UNAUTHORIZED": "Dokumenta tulkošana tika liegta.",
        "W_TIMEOUT": "Daži teikumi netika iztulkoti, jo tulkošana prasīja pārāk daudz laika.",
        "W_SENTENCE_TOO_LONG": "Daži teikumi nav iztulkoti, jo tie bija pārāk gari."
    },
    'ru': {
        "E_DEFAULT_ERROR": "Во время перевода возникла ошибка.",
        "E_UNKNOWN_FILE_TYPE": "Неизвестный тип файла.",
        "E_CANNOT_READ_FILE": "Не удалось считать содержание файла, возможно, файл поврежден.",
        "E_FAILED_IN_TRANSLATION": "Во время перевода возникла ошибка.",
        "E_FORMAT_TRACK_CHANGES": "Не удалось перевести, поскольку был включен режим отслеживания исправлений. Сначала примите исправления.",
        "E_UNKNOWN_ERROR": "Возникла неизвестная ошибка.",
        "E_UNAUTHORIZED": "Перевод документа запрещен.",
        "W_TIMEOUT": "Some sentences are not translated, because translation took too much time.",
        "W_SENTENCE_TOO_LONG": "Some sentences are not translated, because they are too long."
    },
    'lt': {
        'E_DEFAULT_ERROR': 'Verčiant įvyko klaida.',
        'E_UNKNOWN_FILE_TYPE': 'Nežinomas failo tipas.',
        'E_CANNOT_READ_FILE': 'Failo nuskaityti nepavyko. Jis gali būti sugadintas.',
        'E_FAILED_IN_TRANSLATION': 'Verčiant įvyko klaida.',
        'E_FORMAT_TRACK_CHANGES': 'Išversti nepavyko, nes įjungtas keitimų sekimas (angl. track changes). Pirmiausia sutikite su visais keitimais.',
        'E_UNKNOWN_ERROR': 'Aptikta nenustatyta klaida.',
        'E_UNAUTHORIZED': 'Dokumento vertimas atmestas.',
        "W_TIMEOUT": "Kai kurie sakiniai liko neišversti, nes baigėsi vertimui skirtas laikas.",
        "W_SENTENCE_TOO_LONG": "Kai kurie sakiniai liko neišversti, nes jie per ilgi."
    },
    'fr': {
        'E_DEFAULT_ERROR': 'Une erreur est survenue pendant la traduction.',
        'E_UNKNOWN_FILE_TYPE': 'Type de fichier inconnu.',
        'E_CANNOT_READ_FILE': 'Impossible de lire le fichier, le fichier est peut-être endommagé.',
        'E_FAILED_IN_TRANSLATION': 'Une erreur est survenue pendant la traduction.',
        'E_FORMAT_TRACK_CHANGES': 'Impossible de traduire car le suivi des corrections est activé. Les corrections doivent d\'abord être acceptées.',
        'E_UNKNOWN_ERROR': 'Une erreur inconnue s\'est produite.',
        'E_UNAUTHORIZED': 'La traduction du document a été refusée.',
        "W_TIMEOUT": "Some sentences are not translated, because translation timed out.",
        "W_SENTENCE_TOO_LONG": "Some sentences are not translated, because they are too long."
    },
    'et': {
        "E_DEFAULT_ERROR": "Tõlkimisel ilmnes tõrge.",
        "E_UNKNOWN_FILE_TYPE": "Tundmatu failitüüp.",
        "E_CANNOT_READ_FILE": "Faili ei saa lugeda. See võib olla rikutud.",
        "E_FAILED_IN_TRANSLATION": "Tõlkimisel ilmnes tõrge.",
        "E_FORMAT_TRACK_CHANGES": "Tõlkida ei saanud, kuna muutuste jälitus oli sisse lülitatud. Muutused tuleb esmalt aktsepteerida.",
        "E_UNKNOWN_ERROR": "Ilmnes tundmatu tõrge.",
        "E_UNAUTHORIZED": "Dokumendi tõlkimine keelati.",
        "W_TIMEOUT": "Mõni lause jäi tõlkimata, kuna tõlkimisel ilmnes ajalõpp.",
        "W_SENTENCE_TOO_LONG": "Mõnda lauset ei tõlgitud, kuna need on liiga pikad."
    },
});
/* UI texts */

uiResources = $.extend(true, uiResources, {
    'en': {
        "docTempTarget": "Machine translation results for documents help to understand the meaning of a source text, but do not equal translation by a human.",
        "docDownload": "Download",
        "docCancel": "Cancel",
        "docUploadTooltip": "Upload document",
        "docUploadMsgType": "The file \"{file}\" format is not recognized. Translation is supported for these document formats: {extensions}.",
        "docUploadMsgSize": "File \"{file}\" is too large. Maximum file size is {sizeLimit}.",
        "docUploadMsgEmpty": "File \"{file}\" is empty. Please select a file with content.",
        "docUploadMsgWordcnt": "The maximum word count for one translation ({wordCount}) has been exceeded.",
        "docUploadFilename": "Document title:",
        "docUploadFilesize": "Document size:",
        "docUploadWordcount": "Word count:",
        "docUploadFailed": "File upload was not successful.",
        "docTranslFailed": "Document translation failed. Please try again.",
        "docUploadNewDoc": "Delete",
        "docStarting": "Document translation is starting...",
        "docPreviewError": "Could not generate a preview of the document.",
        "docAppleLimited": "File upload on iOS devices is limited.",
        "docTranslInProgress": "Document translation is in progress. If you leave the page, the translation will be lost.",
        "docSupportedTypes": "Currently the system supports {extensions} file formats. UTF-8 or UTF-16 coding required.",
        "docLimit": "Please be informed that only first {limit} segments of each document will be translated for you as a DEMO user. We kindly invite you to contact us <a href=\"mailto:mt@tilde.com\">mt@tilde.com</a> to get full access",
        "advancedOptions": "Options▾"
    },
    'lv': {
        "docTempTarget": "Dokumentu mašīntulkošanas rezultāti ļauj saprast teksta nozīmi, bet nevar aizstāt cilvēka radītu tulkojumu.",
        "docDownload": "Atvērt",
        "docCancel": "Atcelt",
        "docUploadTooltip": "Augšupielādēt dokumentu",
        "docUploadMsgType": "Faila \"{file}\" formāts nav atpazīts. Tulkošana tiek atbalstīta šādiem dokumentu formātiem: {extensions}.",
        "docUploadMsgSize": "Fails \"{file}\" ir pārāk liels. Maksimālais lielums ir {sizeLimit}.",
        "docUploadMsgEmpty": "Fails \"{file}\" ir tukšs. Izvēlieties failu, kurā ir saturs.",
        "docUploadMsgWordcnt": "Ir pārsniegts vienam tulkojumam pieejamais vārdu skaits ({wordCount}), tādēļ dokuments tiks iztulkots daļēji. Pilnam tulkojumam, lūdzu, sadaliet tekstu vairākos dokumentos.",
        "docUploadFilename": "Dokumenta nosaukums:",
        "docUploadFilesize": "Dokumenta lielums:",
        "docUploadWordcount": "Vārdu skaits:",
        "docUploadFailed": "Neizdevās ielādēt failu.",
        "docUploadNewDoc": "Izdzēst",
        "docStarting": "Tiek sākta dokumenta tulkošana...",
        "docPreviewError": "Neizdevās izveidot dokumenta priekšskatījumu.",
        "docAppleLimited": "iOS iekārtās failu augšupielāde ir ierobežota.",
        "docTranslInProgress": "Patreiz notiek dokumenta tulkošana. Pametot lapu, tulkojums tiks pazaudēts.",
        "docSupportedTypes": "Tiek atbalstīti šādi dokumentu formāti: {extensions}. Nepieciešams UTF-8 vai UTF-16 kodējums."
    },
    'ru': {
        "docTempTarget": "Результаты машинного перевода документов позволяют понять значение текста, но не позволяют заменить сделанный человеком перевод.",
        "docDownload": "Открыть",
        "docCancel": "Отменить",
        "docUploadTooltip": "Загрузить документ",
        "docUploadMsgType": "Формат файла \"{file}\" не опознан. Перевод поддерживается для следующих форматов документов: {extensions}.",
        "docUploadMsgSize": "Файл \"{file}\" слишком большой. Максимальный размер: {sizeLimit}.",
        "docUploadMsgEmpty": "Файл \"{file}\" пустой. Выберите файл с содержимым.",
        "docUploadMsgWordcnt": "Превышено количество слов, доступное для одного файла ({wordCount}).",
        "docUploadFilename": "Название документа:",
        "docUploadFilesize": "Размер документа:",
        "docUploadWordcount": "Количество слов:",
        "docUploadFailed": "Файл не удалось загрузить.",
        "docUploadNewDoc": "Удалить",
        "docStarting": "Начат перевод документа...",
        "docPreviewError": "Не удалось создать предварительный просмотр документа.",
        "docAppleLimited": "Загрузка файла на устройствах IOS ограничено.",
        "docTranslInProgress": "Перевод документов в процессе. Если вы уйдете со страницы, перевод будет потерян.",
        "docSupportedTypes": "Currently the system supports {extensions} file formats. UTF-8 or UTF-16 coding required."
    },
    'lt': {
        "docTempTarget": "Dokumentų mašininio vertimo rezultatai padeda suprasti originalo teksto prasmę, tačiau jo kokybės negalima lyginti su žmonių atliekamu vertimu.",
        "docDownload": "Atidaryti",
        "docCancel": "Atšaukti",
        "docUploadTooltip": "Įkelti dokumentą",
        "docUploadMsgType": "Failo „{file}“ formatas neatpažintas. Atliekamas tik šių dokumentų formatų vertimas: {extensions}.",
        "docUploadMsgSize": "Failas „{file}“ yra per didelis. Maksimalus leistinas failo dydis: {sizeLimit}.",
        "docUploadMsgEmpty": "Failas „{file}“ yra tuščias. Pasirinkite failą su turiniu.",
        "docUploadMsgWordcnt": "Viršytas maksimalus vieno vertimo žodžių skaičius ({wordCount}).",
        "docUploadFilename": "Document title:",
        "docUploadFilesize": "Document size:",
        "docUploadWordcount": "Word count:",
        "docUploadFailed": "Failo įkelti nepavyko.",
        "docTranslFailed": "Document translation failed. Please try again.",
        "docUploadNewDoc": "Ištrinti",
        "docStarting": "Pradedamas dokumento vertimas...",
        "docPreviewError": "Dokumento peržiūros sugeneruoti nepavyko.",
        "docAppleLimited": "Failų įkėlimas iOS įrenginiuose yra apribotas.",
        "docTranslInProgress": "Dokumentas verčiamas. Jei uždarysite šį puslapį, vertimas bus prarastas.",
        "docSupportedTypes": "Šiuo metu sistema palaiko {extensions} failų formatus. Būtinas UTF-8 arba UTF-16 kodavimas."
    },
    'fr': {
        "docTempTarget": "Les résultats de la traduction automatique de documents aident à comprendre le sens d'un texte source, mais ils ne sont pas équivalents à une traduction humaine.",
        "docDownload": "Ouvrir",
        "docCancel": "Annuler",
        "docUploadTooltip": "Charger le document",
        "docUploadMsgType": "Le format du fichier \"{file}\" n'est pas reconnu. La traduction est prise en charge pour les formats de document suivants : {extensions}.",
        "docUploadMsgSize": "Le fichier \"{file}\" est trop grand. La taille maximum du fichier est de {sizeLimit}.",
        "docUploadMsgEmpty": "Le fichier \"{file}\" est vide. Veuillez sélectionner un fichier avec contenu.",
        "docUploadMsgWordcnt": "Le nombre maximum de mots pour une traduction ({wordCount}) a été dépassé.",
        "docUploadFilename": "Document title:",
        "docUploadFilesize": "Document size:",
        "docUploadWordcount": "Word count:",
        "docUploadFailed": "Failo įkelti nepavyko.",
        "docTranslFailed": "Échec du chargement du fichier.",
        "docUploadNewDoc": "Supprimer",
        "docStarting": "La traduction du document démarre…",
        "docPreviewError": "Impossible de générer un aperçu du document.",
        "docAppleLimited": "Le chargement de fichiers sur les appareils iOS est limité.",
        "docTranslInProgress": "La traduction du document est en cours. Si vous quittez la page, la traduction sera perdue.",
        "docSupportedTypes": "Currently the system supports {extensions} file formats. UTF-8 or UTF-16 coding required."
    },
    'et': {
        "docTempTarget": "Masintõlge aitab teksti sisust aru saada, kuid ei asenda inimtõlget.",
        "docDownload": "Laadi alla",
        "docCancel": "Tühista",
        "docUploadTooltip": "Laadi dokument üles",
        "docUploadMsgType": "Faili \"{file}\" vorming on tundmatu. Tõlketugi on olemas järgmiste failivormingute puhul: {extensions}.",
        "docUploadMsgSize": "Fail \"{file}\" on liiga suur. Faili lubatud maksimummaht on {sizeLimit}.",
        "docUploadMsgEmpty": "Fail \"{file}\" on tühi. Valige andmeid sisaldav fail.",
        "docUploadMsgWordcnt": "Ühe tõlke suurim lubatud sõnaarv ({wordCount}) on ületatud.",
        "docUploadFilename": "Dokumendi pealkiri:",
        "docUploadFilesize": "Dokumendi suurus:",
        "docUploadWordcount": "Sõnade arv:",
        "docUploadFailed": "Faili üleslaadimine nurjus.",
        "docTranslFailed": "Dokumendi tõlkimine nurjus. Proovige uuesti.",
        "docUploadNewDoc": "Kustuta",
        "docStarting": "Algab dokumendi tõlkimine...",
        "docPreviewError": "Dokumendi eelvaate loomine nurjus.",
        "docAppleLimited": "Failide üleslaadimine iOS-seadmetest on piiratud.",
        "docTranslInProgress": "Dokumendi tõlkimine on pooleli. Kui lehelt lahkute, läheb tõlge kaotsi.",
        "docSupportedTypes": "Praegu toetab süsteem järgmisi failivorminguid: {extensions}. Vajalik on kodeering UTF-8 või UTF-16."
    },
});
/* UI texts */

uiResources = $.extend(true, uiResources, {
    'en': {
        "clearTranslation": "Clear",
        // RL
        "sourceTextTooltip": "Enter the text you want to translate",
        //"sourceTextTooltip": "Enter the text you would like to translate...",
        //
        "noInternet": "No internet connection",
        "targetTextTooltip": "Machine translation results help to understand the meaning of a source text, but do not equal translation by a human.",
        "transLimit": "You have reached the maximum word limit for one translation request. To translate the untranslated part please make another request.",
        "seeFullEntry": "Read complete entry",
        "speaker": "Listen",
        "editButton": "Edit",
        "editButtonTooltip": "Suggest a better translation",
        "translationEditSave": "Contribute",
        "translationEditClose": "Close",
        "translationEditOriginal": "Original sentence",
        "translationEditTranslation": "Translation",
        "translationEditDescription": "Your translation suggestion will be used to improve the quality of machine translation."

    },
    'fr': {
        "clearTranslation": "Effacer",
        "sourceTextTooltip": "Entrez le texte que vous voulez traduire",
        "noInternet": "No internet connection",
        "targetTextTooltip": "Les résultats de traduction électronique aident à comprendre le sens du texte original mais ils ne remplacent pas un traducteur humain.",
        "transLimit": "Ir sasniegts maksimālais vārdu limits vienā tulkošanas pieprasījumā. Lūdzu, sadaliet tekstu mazākos gabalos.",
        "seeFullEntry": "Read complete entry",
        "speaker": "Listen",
        "editButton": "Edit",
        "translationEditSave": "Contribute",
        "translationEditClose": "Close",
        "translationEditOriginal": "Original sentence",
        "translationEditTranslation": "Translation",
        "translationEditDescription": "Your translation suggestion will be used to improve the quality of machine translation."
    },
    'lt': {
        "clearTranslation": "Ištrinti",
        "sourceTextTooltip": "Įveskite norimą versti tekstą",
        "noInternet": "No internet connection",
        "targetTextTooltip": "Automatinio vertimo rezultatai padeda suprasti teksto prasmę, tačiau nepakeičia žmonių kuriamų vertimų.",
        "transLimit": "Pasiekėte vienos vertimo užklausos leistiną žodžių ribą. Jei norite versti neišverstą dalį, pateikite kitą užklausą.",
        "seeFullEntry": "Read complete entry",
        "speaker": "Klausykite",
        "editButton": "Redaguoti",
        "editButtonTooltip": "Siūlyti vertimą",
        "translationEditSave": "Siūlyti",
        "translationEditClose": "Uždaryti",
        "translationEditOriginal": "Originalo sakinys",
        "translationEditTranslation": "Vertimas",
        "translationEditDescription": "Jūsų vertimo pasiūlymą naudosime, kad pagerintume mašininio vertimo kokybę."
    },
    'lv': {
        "clearTranslation": "Notīrīt",
        "sourceTextTooltip": "Ievadiet tulkojamo tekstu",
        "noInternet": "No internet connection",
        "targetTextTooltip": "Mašīntulkošanas rezultāti ļauj saprast teksta nozīmi, bet nevar aizstāt cilvēka radītu tulkojumu.",
        "transLimit": "You have reached the maximum word limit for one translation request. To translate the untranslated part please make another request.",
        "seeFullEntry": "Skatīt pilnu šķirkli",
        "speaker": "Klausīties",
        "editButton": "Rediģēt",
        "editButtonTooltip": "Ieteikt labāku tulkojumu",
        "translationEditSave": "Ieteikt",
        "translationEditClose": "Aizvērt",
        "translationEditOriginal": "Sākotnējais teikums",
        "translationEditTranslation": "Tulkojums",
        "translationEditDescription" : "Jūsu tulkojuma ieteikums tiks izmantots tulkošanas kvalitātes uzlabošanai."
    },
    'ru': {
        "clearTranslation": "Очистить",
        "sourceTextTooltip": "Введите текст для перевода",
        "noInternet": "No internet connection",
        "targetTextTooltip": "Результаты машинного перевода позволяют понять значение текста, но не позволяют заменить сделанный человеком перевод.",
        "transLimit": "You have reached the maximum word limit for one translation request. To translate the untranslated part please make another request.",
        "seeFullEntry": "Read complete entry",
        "speaker": "Listen",
        "editButton": "Edit",
        "translationEditSave": "Contribute",
        "translationEditClose": "Close",
        "translationEditOriginal": "Original sentence",
        "translationEditTranslation": "Translation",
        "translationEditDescription": "Your translation suggestion will be used to improve the quality of machine translation."
    },
    'et': {
        "clearTranslation": "Tühjenda",
        // RL
        //"sourceTextTooltip": "Sisestage soovitud tekst",
        "sourceTextTooltip": "Sisesta tekst, mida soovid tõlkida...",
        // /RL
        "noInternet": "No internet connection",
        "targetTextTooltip": "Masintõlge aitab teksti sisust aru saada, kuid ei asenda inimtõlget.",
        "transLimit": "Ühe tõlketaotluse suurim sõnaarv on täis. Tõlkimata osa tõlkimiseks esitage uus taotlus.",
        "seeFullEntry": "Read complete entry",
        "speaker": "Kuulake",
        "editButton": "Redigeeri",
        "editButtonTooltip": "Soovita tõlget",
        "translationEditSave": "Andke oma panus",
        "translationEditClose": "Sule",
        "translationEditOriginal": "Algne lause",
        "translationEditTranslation": "Tõlge",
        "translationEditDescription": "Teie tõlkesoovitust kasutatakse masintõlke kvaliteedi parandamiseks."
    }
});
/* UI texts */

uiResources = $.extend(true, uiResources, {
    'en': {
        "address":     "Address",
        "loadButton": "Load webpage",
        "cancelButton": "Cancel",
        "restoreButton": "Restore"
    },
    'lv': {
        "address": "Adrese",
        "loadButton": "Ielādēt lapu",
        "cancelButton": "Atcelt",
        "restoreButton": "Atjaunot"
    },
    'lt': {
        "address": "Adresas",
        "loadButton": "Įkelti svetainę",
        "cancelButton": "Atšaukti",
        "restoreButton": "Atkurti"
    },
    'et': {
        "address": "Aadress",
        "loadButton": "Laadi veebileht",
        "cancelButton": "Tühista",
        "restoreButton": "Taasta"
    }
});