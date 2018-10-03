var $versionNumber = '1.23';
var $clientId = 'u-70fbfe41-e881-4d42-8d49-f60dd8d96b05'; //'u-3787e5c0-cbe7-4571-8f50-36791bd9ea79';
var $customWidgetInit = true; //tells translation widget not to init stuff right away
var $domain = "hugotest.tilde.lv";

app.controller("myPageCtrl", function ($scope, $location, $translate, $rootScope) {
    // debug
    /* try {
        console.log("Location: " + document.location);
        console.log("Domain: " + document.domain);
    }
    catch (err) {
        console.log(err.message);
    }*/

    $scope.sourceLanguageOrder = ["en", "de", "bg", "cs", "da", "el", "es", "et", "fi", "fr", "ga", "hr", "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"];
    $scope.targetLanguageOrder = ["de", "en", "bg", "cs", "da", "el", "es", "et", "fi", "fr", "ga", "hr", "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"];

    $scope.isActive = function (viewLocation) {
        var active = ("/" + viewLocation === $location.path());
        return active;
    };

    $scope.isInIFrame = function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    /*$scope.web_samples = [
        { "url": "", "title": "", "description": "", "description_<lang>": "", "image": "" },
    ];*/
    $scope.updateWebsite = function (url) {
        $("input#url").val(url);
        $("#web_translateButton").trigger('click');
    };
    
   

    initEvents();

    $scope.dialog = {};
    $scope.dialog.showModal = '';
    $scope.dialog.href = '';
    $scope.dialog.navigate = function (forward) {
        $scope.dialog.showModal = '';
        if (forward) {
            $location.path($scope.dialog.href);
        }
    };
    $scope.routeMe = function (hash) {
        $scope.dialog.href = hash;
        if ((typeof $widget !== "undefined") && $widget.filePluginGetTranslationStatus() !== 'blank') {
            $scope.dialog.showModal = 'show';
        }
        else {
            $location.path(hash);
        }
    };

    $scope.rulesVisible = false;
    $scope.rulesAgreed = false;
    $scope.pluginURL = "https://www.tilde.com/sites/default/files/downloads/EUPresidencyTranslator.MTProvider";

    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    if ( isChrome || isFirefox ) {
        $scope.pluginURL += '.sdlplugin';
    } else {
        $scope.pluginURL += '.zip';
    };

    $scope.getPlugin = function () {
        var link = document.createElement('a');
        link.href = $scope.pluginURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    $scope.localize = function (word) {
        var Bulgarian = {
            "Bulgarian": "Bulgarisch",
            "Croatian": "Kroatisch",
            "Czech": "Tschechisch",
            "Danish": "Dänisch",
            "Dutch": "Niederländisch",
            "English": "Englisch",
            "Estonian": "Estnisch",
            "Finnish": "Finnisch",
            "French": "Französisch",
            "German": "Deutsch",
            "Greek": "Griechisch",
            "Hungarian": "Ungarisch",
            "Irish": "Irisch",
            "Italian": "Italienisch",
            "Latvian": "Lettisch",
            "Lithuanian": "Litauisch",
            "Maltese": "Maltesisch",
            "Polish": "Polnisch",
            "Portuguese": "Portugiesisch",
            "Romanian": "Rumänisch",
            "Slovak": "Slowakisch",
            "Slovenian": "Slowenisch",
            "Spanish": "Spanisch",
            "Swedish": "Schwedisch",
            // de -> en
            "Bulgarisch": "Bulgarisch",
            "Kroatisch": "Kroatisch",
            "Tschechisch": "Tschechisch",
            "Dänisch": "Dänisch",
            "Niederländisch": "Niederländisch",
            "Englisch": "Englisch",
            "Estnisch": "Estnisch",
            "Finnisch": "Finnisch",
            "Französisch": "Französisch",
            "Deutsch": "Deutsch",
            "Griechisch": "Griechisch",
            "Ungarisch": "Ungarisch",
            "Irisch": "Irisch",
            "Italienisch": "Italienisch",
            "Lettisch": "Lettisch",
            "Litauisch": "Litauisch",
            "Maltesisch": "Maltesisch",
            "Polnisch": "Polnisch",
            "Portugiesisch": "Portugiesisch",
            "Rumänisch": "Rumänisch",
            "Slowakisch": "Slowakisch",
            "Slowenisch": "Slowenisch",
            "Spanisch": "Spanisch",
            "Schwedisch": "Schwedisch",
        }

        var English = {
            "Bulgarian": "Bulgarian",
            "Croatian": "Croatian",
            "Czech": "Czech",
            "Danish": "Danish",
            "Dutch": "Dutch",
            "English": "English",
            "Estonian": "Estonian",
            "Finnish": "Finnish",
            "French": "French",
            "German": "German",
            "Greek": "Greek",
            "Hungarian": "Hungarian",
            "Irish": "Irish",
            "Italian": "Italian",
            "Latvian": "Latvian",
            "Lithuanian": "Lithuanian",
            "Maltese": "Maltese",
            "Polish": "Polish",
            "Portuguese": "Portuguese",
            "Romanian": "Romanian",
            "Slovak": "Slovak",
            "Slovene": "Slovenian",
            "Slovenian": "Slovenian",
            "Spanish": "Spanish",
            "Swedish": "Swedish",
            // en->de
            "Bulgarisch": "Bulgarian",
            "Kroatisch": "Croatian",
            "Tschechisch": "Czech",
            "Dänisch": "Danish",
            "Niederländisch": "Dutch",
            "Englisch": "English",
            "Estnisch": "Estonian",
            "Finnisch": "Finnish",
            "Französisch": "French",
            "Deutsch": "German",
            "Griechisch": "Greek",
            "Ungarisch": "Hungarian",
            "Irisch": "Irish",
            "Italienisch": "Italian",
            "Lettisch": "Latvian",
            "Litauisch": "Lithuanian",
            "Maltesisch": "Maltese",
            "Polnisch": "Polish",
            "Portugiesisch": "Portuguese",
            "Rumänisch": "Romanian",
            "Slowakisch": "Slovak",
            "Slowenisch": "Slovenian",
            "Spanisch": "Spanish",
            "Schwedisch": "Swedish",
        }

        if (word) {
            if ($rootScope.language === 'de') {
                return (Bulgarian[word]);
            } else if ($rootScope.language === 'en') {
                return (English[word]);
            }
        }

        return word;
    }

    $scope.getLanguageCode = function(lang) {
        var languageCodes = {
            "Bulgarian": "bg",
            "Croatian": "hr",
            "Czech": "cs",
            "Danish": "da",
            "Dutch": "nl",
            "English": "en",
            "Estonian": "et",
            "Finnish": "fi",
            "French": "fr",
            "German": "de",
            "Greek": "el",
            "Hungarian": "hu",
            "Irish": "ga",
            "Italian": "it",
            "Latvian": "lv",
            "Lithuanian": "lt",
            "Maltese": "mt",
            "Polish": "pl",
            "Portuguese": "pt",
            "Romanian": "ro",
            "Slovak": "sk",
            "Slovene": "sl",
            "Slovenian": "sl",
            "Spanish": "es",
            "Swedish": "sv",
            "Bulgarisch": "bg",
            "Kroatisch": "hr",
            "Tschechisch": "cs",
            "Dänisch": "da",
            "Niederländisch": "nl",
            "Englisch": "en",
            "Estnisch": "et",
            "Finnisch": "fi",
            "Französisch": "fr",
            "Deutsch": "de",
            "Griechisch": "el",
            "Ungarisch": "hu",
            "Irisch": "ga",
            "Italienisch": "it",
            "Lettisch": "lv",
            "Litauisch": "lt",
            "Maltesisch": "mt",
            "Polnisch": "pl",
            "Portugiesisch": "pt",
            "Rumänisch": "ro",
            "Slowakisch": "sk",
            "Slowenisch": "sl",
            "Spanisch": "es",
            "Schwedisch": "sv",
        }
        if (languageCodes[lang]) {
            return languageCodes[lang];
        }
        return 'en';
    }

    $scope.setLanguage = function (newLang) {
        var languageFound = false;
        for (var i = 0; i < $rootScope.languages.length; i++) {
            if ($rootScope.languages[i] === newLang) {
                languageFound = true;
            }
        }

        if (!languageFound) {
            return;
        }

        if (newLang != $rootScope.language) {
            $rootScope.language = newLang;
            $translate.use($rootScope.language);
            document.cookie = "lang=" + newLang;

            if (/text|document|www/.test(window.location.href)) {
                //pages containing widget need a reload to localize texts
                window.location.reload();
            }
            else {
                localizeLanguages($scope, $rootScope);
            }
        }
    };

    $scope.sysType = {
        eTranslation: true,
    };

    // blur effect on option list
    $('body').click(function (event) {
        var target = $(event.target);
        if (target.is(".trigger")) {
            $(".options.open").each(function () {
                if ($(this).parent().parent().attr('id') !== target.parent().parent().attr('id')) {
                    $(this).removeClass('open');
                }
            });
        } else {
            $(".options.open").removeClass("open");            

            let srcLng = '';
            let trgLng = '';

            if (target.is(".popSourceLangs li")) {
                _tempSource = target.text();

                if (_tempSource === getCurrentTargetLang()) {
                    trgLng = getCurrentSourceLang();
                } else {
                    trgLng = getCurrentTargetLang();
                }

                srcLng = _tempSource;

            } else if (target.is(".popTargetLangs li")) {
                trgLng = target.text();
                srcLng = getCurrentSourceLang();
            } else if (target.is("#source_lang_div .fancy-select ul.options li") || target.is("#web_source_lang_div .fancy-select ul.options li")) {
                srcLng = target.text();
                trgLng = getCurrentTargetLang()
            } else if (target.is("#target_lang_div .fancy-select ul.options li") || target.is("#web_target_lang_div .fancy-select ul.options li")) {
                trgLng = target.text();
                srcLng = getCurrentSourceLang();
            } else if (target.is('.swapLanguage') || target.is('#language_selection button')) {
                srcLng = getCurrentSourceLang();
                trgLng = getCurrentTargetLang();
            }

            var srcCode = '', trgCode = '';
            if (!srcLng.length) {
                srcCode = $scope.sourceLanguageOrder[0]
            } else {
                srcCode = $scope.getLanguageCode(srcLng);
            }

            if (!trgLng.length) {
                trgCode = $scope.targetLanguageOrder[0]
            } else {
                trgCode = $scope.getLanguageCode(trgLng);
            }

            // renews language order
            let srcArr = $scope.sourceLanguageOrder;
            let arrLngth = srcArr.length;
            for (var i = 0; i < arrLngth; i++) {
                if (srcArr[i] === srcCode && i != 0) {
                    let arrIndx = i;
                    srcArr = array_move(srcArr, i, 0);
                    $scope.sourceLanguageOrder = srcArr;
                    break;
                }
            }

            let trgArr = $scope.targetLanguageOrder;
            arrLngth = trgArr.length;
            for (var i = 0; i < arrLngth; i++) {
                if (trgArr[i] === trgCode) {
                    let arrIndx = i;
                    trgArr = array_move(trgArr, i, 0);
                        $scope.targetLanguageOrder = trgArr;
                    break;
                }
            }

            localizeLanguages($scope, $rootScope);
        }
    });

    function getCurrentSourceLang() {
        return $(".popSourceLangs li.active").first().text();
    }

    function getCurrentTargetLang() {
        return $(".popTargetLangs li.active").first().text();
    }

    function array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    };

    // check if the system is from eTranslation
    $scope.isETranslationSystem = function (activeSys) {
        var etr = false;

        var systems = Array.from($widget.settings._systems);

        for (var i = 0; i < systems.length; i += 1) {
            if (systems[i].ID === activeSys) {
                var systemMetadata = Array.from(systems[i].Metadata);
                for (j = 0; j < systemMetadata.length; j += 1) {
                    var currData = systemMetadata[j];
                    if (currData.Key === 'decoder' && currData.Value === 'cefat-etranslation') {
                        etr = true;
                        break;
                    }
                }
                break;
            }
        }

        $scope.$apply(function () {
            $scope.sysType.eTranslation = etr;
        });
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function getCookie(name) {
        var re = new RegExp(name + "=([^;]+)");
        var value = re.exec(document.cookie);
        return (value != null) ? unescape(value[1]) : null;
    }

    var newLang = getCookie('lang');

    if (newLang == null) {
        newLang = "en";
    }

    var languageFound = false;
    for (var i = 0; i < $rootScope.languages.length; i++) {
        if ($rootScope.languages[i] === newLang) {
            languageFound = true;
            break;
        }
    }

    if (!languageFound) {
        newLang = "en";
    }

    $rootScope.language = newLang;
    $translate.use($rootScope.language);
});

app.controller('TranslateCtrl', function ($scope, $routeParams, $rootScope) {
    $('#fileWidget').empty();
    $('#webWidget').empty();

    $scope.sysType.eTranslation = false;
    initTextWidget($scope, $rootScope);
});



function initTextWidget($scope, $rootScope) {
    var textWidget = new Tilde.TranslatorWidget('#textWidget', {
        _language: $rootScope.language,
        _systemListUrl: 'https://' + $domain + '/ws/service.svc/json/GetSystemList',
        _translationUrl: 'https://' + $domain + '/ws/service.svc/json/TranslateEx',
        _clientId: $clientId,
        _templateId: 'translatetext-template',
        _appId: "Tilde|MNKC|Web",
        _swapLanguagesButtonSelector: ".swapLanguage,#webSwapLanguage",
        _getFilteredSystems: false,
        _onWidgetLoaded: function () {

            if ($scope.isActive('www') || $scope.isActive('website')) {
                localizeLanguages($scope, $rootScope);
            }
            $(document)
                .keydown(function (e) {
                    if (isCharacterKeyPress(e) && $scope.isActive('text')) {
                        $(".translateTextSource").click();

                    }
                    if (isCharacterKeyPress(e) && $scope.isActive('www') && !$("#url").is(":focus")) {
                        $(".bigText input").focus();
                    }
                });
        },
        _replaceContainer: false,
        _useRecentLangSelector: true,
        //_defaultSourceLang: 'en',
        //_defaultTargetLang: 'de',
        _sourceLanguageOrder: $scope.sourceLanguageOrder,
        _targetLanguageOrder: $scope.targetLanguageOrder,
        _replaceSourceWithBlock: 'false',
        _onSystemChanged: function () {
            $scope.isETranslationSystem($widget.activeSystemId);
              
        },
        _onWidgetTemplateLoaded: function () {
            $widget.pluginInitializers = [];
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.recentlangsPluginInit);
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.textPluginInit);
        },
    });
}

function isCharacterKeyPress(evt) {
    if (typeof evt.which == "undefined") {
        return true;
    } else if (typeof evt.which == "number" && evt.which > 0) {
        return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
    }
    return false;
}

app.controller('DocumentCtrl', function ($scope, $routeParams, $rootScope) {
    $('#textWidget').empty();
    $('#webWidget').empty();

    // if (typeof $widget !== 'undefined') { $widget.textPluginUnload() };

    $scope.sysType.eTranslation = false;

    initFileWidget($scope, $rootScope);
});

function initFileWidget($scope, $rootScope) {
    var fileWidget = new Tilde.TranslatorWidget('#fileWidget', {
        _language: $rootScope.language,
        _systemListUrl: 'https://' + $domain + '/ws/service.svc/json/GetSystemList',
        _uploadUrl: 'https://' + $domain + '/ws/Files/Upload',
        _deleteUrl: 'https://' + $domain + '/ws/Files/Delete',
        _downloadUrl: 'https://' + $domain + '/ws/Files/Download',
        _translateUrl: 'https://' + $domain + '/ws/Files/StartTranslation',
        _previewUrl: 'https://' + $domain + '/ws/Files/GetDocumentPreview',
        _checkStatusUrl: 'https://' + $domain + '/ws/Files/GetStatus',
        //_defaultSourceLang: 'en',
        //_defaultTargetLang: 'de',
        _sourceLanguageOrder: $scope.sourceLanguageOrder,
        _targetLanguageOrder: $scope.targetLanguageOrder,
        _clientId: $clientId,
        _templateId: 'translatefile-template',
        _appId: "Tilde|MNKC|Web",
        _swapLanguagesButtonSelector: ".swapLanguage,#webSwapLanguage",
        //_landingView: true,
        _getFilteredSystems: false,
        _allowedFileTypes: [
            { ext: "doc", mime: "application/msword" },
            { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
            { ext: "xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
            { ext: "pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
            { ext: "odt", mime: "application/vnd.oasis.opendocument.text" },
            { ext: "odp", mime: "application/vnd.oasis.opendocument.presentation" },
            { ext: "ods", mime: "application/vnd.oasis.opendocument.spreadsheet" },
            { ext: "rtf", mime: "﻿application/rtf" },
            { ext: "html", mime: "text/html" },
            { ext: "htm", mime: "text/html" },
            { ext: "xhtml", mime: "﻿﻿application/xhtml" },
            { ext: "xht", mime: "﻿application/xhtml+xml" },
            { ext: "txt", mime: "text/plain" },
            { ext: "fodt", mime: "application/vnd.oasis.opendocument.text" },
            { ext: "fodp", mime: "application/vnd.oasis.opendocument.presentation" },
            { ext: "fods", mime: "application/vnd.oasis.opendocument.spreadsheet" },
            { ext: "tmx", mime: "text/xml" },
            { ext: "xlf", mime: "application/x-xliff+xml" },
            { ext: "xlif", mime: "application/xlif+xml" },
            { ext: "xliff", mime: "application/xliff+xml" },
            { ext: "sdlxliff", mime: "application/octet-stream" },
            { ext: "ttx", mime: "application/octet-stream" },
            { ext: "pages", mime: "application/x-iwork-pages-sffpages" }
        ],
        _showAllowedFileInfo: true,
        _replaceContainer: false,
        _useRecentLangSelector: true,
        _onSystemChanged: function () {
            $scope.isETranslationSystem($widget.activeSystemId);
        },
        _onWidgetTemplateLoaded: function () {
            $widget.pluginInitializers = [];
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.recentlangsPluginInit);
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.filePluginInit);
        },
        _onWidgetLoaded: function () {
               // removes the popup bug from transition from website to document transition
        },
    });
    
}


app.controller('websiteTranslatorCtrl', function ($scope, $routeParams, $rootScope, $translate, $window) {
    $('#textWidget').empty();
    $('#documentWidget').empty();

    $scope.sysType.eTranslation = false;
    var webWidget = new Tilde.TranslatorWidget('#webWidget', {
        _language: $rootScope.language,
        _clientId: $clientId,
        _systemSelectType: 'language',
        _appId: "Tilde|MNKC|Web",
        _swapLanguagesButtonSelector: ".swapLanguage,#webSwapLanguage",
        //_defaultSourceLang: 'en',
        //_defaultTargetLang: 'de',
        _sourceLanguageOrder: $scope.sourceLanguageOrder,
        _targetLanguageOrder: $scope.targetLanguageOrder,
        _getFilteredSystems: false,
        _replaceSourceWithBlock: 'false',
        _apiIsInTheSameDomain: false,
        _replaceContainer: false,
        _useRecentLangSelector: true,
        //_customSelectText: '&nbsp;',
        _websiteTranslationUrl: "https://' + $domain + '/Translate/WebsiteEmbedded?embeddedStyle=noUI", // address of website translation page (that uses TranslateProxy)
        _systemListUrl: 'https://' + $domain + '/ws/service.svc/json/GetSystemList',
        _onWidgetLoaded: function () {
            localizeLanguages($scope, $rootScope);
        },
        _onSystemChanged: function () {
            $scope.isETranslationSystem($widget.activeSystemId);
        },
        _onWidgetTemplateLoaded: function () {
            $widget.pluginInitializers = [];
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.recentlangsPluginInit);
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.webPluginInit);
        },
    });

       
    iframeHide();
    iframeReset();
    examplesShow();

    $("#web_refresh_button").click(function () {
        $window.location.href = "/?random-for-reload=1#/text";
    });

    $(".loadButton", webWidget.settings.container).click(function () {
        examplesHide();
        iframeShow();
    });

    $("input#url").keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == '13') {
            $(".loadButton", webWidget.settings.container).click();
        }
    });


    function iframeHide() {
        $("#websiteFrame").css('display','none');
    }

    function iframeReset() {
        $("#websiteFrame").attr('src','about:blank');
    }

    function iframeShow() {
        $("#websiteFrame").css('display','block');
    }

    function examplesShow() {
        $("#websiteLinks").css("display","block");
    }

    function examplesHide() {
        $("#websiteLinks").css("display","none");
    }
});

function initEvents() {

    $("body").bind('click', function (e) {
        if (e.which == 2) {
            e.preventDefault();
        }
    });

}

function localizeLanguages($scope, $rootScope) {
    $('ul.popSourceLangs li').each(function () {
        $(this).html($scope.localize($(this).html()))
    });

    $('ul.popTargetLangs li').each(function () {
        $(this).html($scope.localize($(this).html()))
    });

    $('.fancy-select .trigger').each(function () {
        $(this).html($scope.localize($(this).html()))
    });
    $('.fancy-select .option').each(function () {
        $(this).html($scope.localize($(this).html()))
    });

    $('.fancy-select ul.options li').each(function () {
        $(this).html($scope.localize($(this).html()));
    });

    var extArray = [];
    
    for (var idx in $widget.settings._allowedFileTypes) {
        var item = $widget.settings._allowedFileTypes[idx];
        if ($.inArray(item.ext, extArray) == -1) {
            extArray.push(item.ext);
        }
    }
    
    var formatsHtml = '<span class="supTypesList">' + uiResources[$widget.settings._language]['docSupportedTypes'].replace('{extensions}', '<span class="format">' + extArray.join('</span>, <span class="format">') + '</span>') + '</span>';
    $('.supTypesList').replaceWith(formatsHtml);
}

function loadTargetLangList(source, selTarget, putSystemId) {
    $('.w .translateTargetLang').empty();

    $.each($widget.settings._systems, function (idx, sys) {
        if (sys.SourceLanguage.Code === source) {
            if (putSystemId) {
                // check unique in lang attribute
                if ($('.w .translateTargetLang option[lang="' + sys.TargetLanguage.Code + '"]').length === 0) {
                    $('.w .translateTargetLang').append($('<option>', {
                        value: sys.ID,
                        text: sys.TargetLanguage.Name.Text,
                        lang: sys.TargetLanguage.Code
                    }));
                }
            }
            else {
                // check unique in value attribute
                if ($('.w .translateTargetLang option[value="' + sys.TargetLanguage.Code + '"]').length === 0) {
                    $('.w .translateTargetLang').append($('<option>', {
                        value: sys.TargetLanguage.Code,
                        text: sys.TargetLanguage.Name.Text
                    }));
                }
            }
        }
    });

    // select target
    if (selTarget !== undefined && selTarget !== null) {
        $('.w .translateTargetLang option[lang="' + selTarget + '"]').attr('selected', 'selected');
    }

    if ($('.w .translateTargetLang') !== null) {
        $('.w .translateTargetLang').trigger('update.fs');
    }

}