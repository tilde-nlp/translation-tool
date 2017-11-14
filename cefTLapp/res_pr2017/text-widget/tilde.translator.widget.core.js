/* tilde.translator.widget.core.js */

if (typeof (Tilde) === 'undefined') Tilde = {};

Tilde.TranslatorWidgetDefaultOptions = {
    _systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList',
    _apiIsInTheSameDomain: false, //is API WS in the same domain as the page that contains the widget
    _jsonType: 'json', //jsonp or json
    _appId: '', //appid of widget - used to get systems and translations
    _clientId: '',
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