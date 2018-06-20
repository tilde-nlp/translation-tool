var $versionNumber = '1.22';
var $clientId = 'u-dc4cd3c5-ebc9-4213-ac9d-593c896bc0ea';

app.controller("myPageCtrl", function ($scope, $location, $translate, $rootScope) {
    // debug
    /* try {
        console.log("Location: " + document.location);
        console.log("Domain: " + document.domain);
    }
    catch (err) {
        console.log(err.message);
    }*/

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
            // bg -> en
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
            // en->bg
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

        if (word.length) {
            if ($rootScope.language === 'bg') {
                return (Bulgarian[word]);
            } else if ($rootScope.language === 'en') {
                return (English[word]);
            }
        }

        return word;
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

        $rootScope.language = newLang;
        $translate.use($rootScope.language);

        try {
            $widget.settings._language = $rootScope.language;
            $widget.initPlugins();
            $widget.initWidgetLanguage();
            localizeLanguages($scope, $rootScope);   
        }
        catch (err) {
            console.log("Failed to switch languages: " + err);
        }
    };

    $scope.sysType = {
        eTranslation: true,
    };

    // blur effect on option list
    $('body').click(function (event) {
        var target = $(event.target);
        if (!target.is(".trigger")) {
            $(".options.open").removeClass("open");
        } else { // if it is a trigger
            $(".options.open").each(function () {
                if ($(this).parent().parent().attr('id') !== target.parent().parent().attr('id')) {
                    $(this).removeClass('open');
                }
            });
        }
    });

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

 /*       for (a of $widget.settings._systems) {
            if (a.ID === activeSys) {
                for (b of a.Metadata) {
                    if (b.Key === 'decoder' && b.Value === 'cefat-etranslation') {
                        etr = true;
                        break;
                    }
                }
                break;
            }
        }
*/
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

    var getLangParam = getParameterByName('lang');
    if (getLangParam == 'bg') {
        $scope.setLanguage($scope.languages[1])
    }
});

app.controller('TranslateCtrl', function ($scope, $routeParams, $rootScope) {
    $('#fileWidget').empty();
    $('#webWidget').empty();

    $scope.sysType.eTranslation = false;

    initTextWidget($scope, $rootScope);
});



function initTextWidget($scope, $rootScope) {
    var textWidget = new Tilde.TranslatorWidget('#textWidget', {
        _language: 'en',
        _systemListUrl: 'https://letsmt.eu/ws/service.svc/json/GetSystemList',
        _translationUrl: 'https://letsmt.eu/ws/service.svc/json/TranslateEx',
        _clientId: $clientId,
        _templateId: 'translatetext-template',
        _appId: "Tilde|EU Presidency|Web",
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
        _defaultSourceLang: 'en',
        _defaultTargetLang: 'de',
        _replaceSourceWithBlock: 'false',
        _onSystemChanged: function () {
            $scope.isETranslationSystem($widget.activeSystemId);
        },
        _onWidgetTemplateLoaded: function () {
            $widget.pluginInitializers = [];
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.textPluginInit);
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.recentlangsPluginInit);
        },
    });
    
    $scope.setLanguage($rootScope.language);
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
        _language: 'en',
        _systemListUrl: 'https://letsmt.eu/ws/service.svc/json/GetSystemList',
        _uploadUrl: 'https://letsmt.eu/ws/Files/Upload',
        _deleteUrl: 'https://letsmt.eu/ws/Files/Delete',
        _downloadUrl: 'https://letsmt.eu/ws/Files/Download',
        _translateUrl: 'https://letsmt.eu/ws/Files/StartTranslation',
        _previewUrl: 'https://letsmt.eu/ws/Files/GetDocumentPreview',
        _checkStatusUrl: 'https://letsmt.eu/ws/Files/GetStatus',
        _defaultSourceLang: 'en',
        _defaultTargetLang: 'de',
        _clientId: $clientId,
        _templateId: 'translatefile-template',
        _appId: "Tilde|EU Presidency|Web",
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
        //_customSelectText: '&nbsp;',
        _onSystemChanged: function () {
            $scope.isETranslationSystem($widget.activeSystemId);
        },
        _onWidgetTemplateLoaded: function () {
            $widget.pluginInitializers = [];
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.filePluginInit);
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.recentlangsPluginInit);
        },
        _onWidgetLoaded: function () {
               // removes the popup bug from transition from website to document transition
        },
    });

    $scope.setLanguage($rootScope.language);
}


app.controller('websiteTranslatorCtrl', function ($scope, $routeParams, $rootScope, $translate, $window) {
    $('#textWidget').empty();
    $('#documentWidget').empty();

    $scope.sysType.eTranslation = false;
    
    var webWidget = new Tilde.TranslatorWidget('#webWidget', {
        _language: 'en',
        _clientId: $clientId,
        _systemSelectType: 'language',
        _appId: "Tilde|EU Presidency|Web",
        _defaultSourceLang: 'en',
        _defaultTargetLang: 'de',
        _getFilteredSystems: false,
        _replaceSourceWithBlock: 'false',
        _apiIsInTheSameDomain: false,
        _replaceContainer: false,
        _useRecentLangSelector: true,
        //_customSelectText: '&nbsp;',
        _websiteTranslationUrl: "https://readymt.tilde.com/Translate/WebsiteEmbedded?embeddedStyle=noUI", // address of website translation page (that uses TranslateProxy)
        _systemListUrl: 'https://letsmt.eu/ws/service.svc/json/GetSystemList',
        _onWidgetLoaded: function () {
                    localizeLanguages($scope, $rootScope);
        },
        _onSystemChanged: function () {
            $scope.isETranslationSystem($widget.activeSystemId);
        },
        _onWidgetTemplateLoaded: function () {
            $widget.pluginInitializers = [];
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.webPluginInit);
            $widget.pluginInitializers.push(Tilde.TranslatorWidget.prototype.recentlangsPluginInit);
        },
    });

    $scope.setLanguage($rootScope.language);
       
    iframeHide();
    iframeReset();
    examplesShow();

    $("#web_refresh_button").click(function() {
        if ($("#websiteFrame:visible").length != 0) {
            //iframeHide();
            //iframeReset();
            //examplesShow();
            $window.location.reload();
        } else {
            webWidget = null;
            angular.element('#web_translation_type_text').triggerHandler('click');
        }
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