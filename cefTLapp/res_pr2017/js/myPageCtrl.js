var $versionNumber = '1.22';

app.controller("myPageCtrl", function ($scope, $location, $translate, $rootScope) {
    try {
        console.log("Location: " + document.location);
        console.log("Domain: " + document.domain);
    }
    catch (err) {
        console.log(err.message);
    }

    $scope.isActive = function (viewLocation) {
        var active = ("/" + viewLocation === $location.path());
        return active;
    };

    //$scope.website = {};
    //$scope.website.system = '';
    //$scope.website.base = "https://readymt.tilde.com"; //https://hugo.lv/en";
    //$scope.website.url = '';
    //$scope.website.errorMsg = '';
    //$scope.website.freeze = false;
    //$scope.website.status = 'initial';
    //$scope.website.focus = false;
    $scope.web_samples = [
        { "url": "www.delfi.ee", "title": "Delfi", "description": "News site", "description_ee": "Uudiste lehekülg", "image": "url('../img/examples/delfi.png')" },
        { "url": "ekspress.delfi.ee", "title": "Eesti Ekspress", "description": "News site", "description_ee": "Uudiste lehekülg", "image": "url('../img/examples/eesti_ekspress.png')" },
        { "url": "www.postimees.ee", "title": "Postimees", "description": "Business news", "description_ee": "Äriuudised", "image": "url('../img/examples/postimees.png')" },
        { "url": "www.err.ee", "title": "ERR.ee", "description": "News site", "description_ee": "Uudiste lehekülg", "image": "url('../img/examples/err.png')" },
        { "url": "www.aripaev.ee", "title": "Äripäev", "description": "News site", "description_ee": "Uudiste lehekülg", "image": "url('../img/examples/aripaev.png')" },
        { "url": "eesti.ee", "title": "Eesti.ee", "description": "Public e-services", "description_ee": "Avalikud e-teenused", "image": "url('../img/examples/eesti.png')" }
    ];
    //$scope.website.languagesReady = 'no';
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
    // $scope.pluginURL = "http://tildecom-test.tilde.lv/sites/default/files/downloads/Tilde.MTProvider.msi";
    $scope.pluginURL = "https://www.tilde.com/sites/default/files/downloads/EUPresidencyTranslator.MTProvider";

    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    if ( isChrome || isFirefox ) {
        $scope.pluginURL += '.sdlplugin';
    } else {
        $scope.pluginURL += '.zip';
    }

    $scope.getPlugin = function () {
        var link = document.createElement('a');
        link.href = $scope.pluginURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    $scope.localize = function (word) {
        var Estonian = {
            "Bulgarian": "Bulgaaria",
            "Croatian": "Horvaatia",
            "Czech": "Tšehhi",
            "Danish": "Taani",
            "Dutch": "Hollandi",
            "English": "Inglise",
            "Estonian": "Eesti",
            "Finnish": "Soome",
            "French": "Prantsuse",
            "German": "Saksa",
            "Greek": "Kreeka",
            "Hungarian": "Ungari",
            "Irish": "Iiri",
            "Italian": "Itaalia",
            "Latvian": "Läti",
            "Lithuanian": "Leedu",
            "Maltese": "Malta",
            "Polish": "Poola",
            "Portuguese": "Portugali",
            "Romanian": "Rumeenia",
            "Slovak": "Slovaki",
            "Slovenian": "Sloveeni",
            "Spanish": "Hispaania",
            "Swedish": "Rootsi",
            // et -> en
            "Bulgaaria": "Bulgaaria",
            "Horvaatia": "Horvaatia",
            "Tšehhi": "Tšehhi",
            "Taani": "Taani",
            "Hollandi": "Hollandi",
            "Inglise": "Inglise",
            "Eesti": "Eesti",
            "Soome": "Soome",
            "Prantsuse": "Prantsuse",
            "Saksa": "Saksa",
            "Kreeka": "Kreeka",
            "Ungari": "Ungari",
            "Iiri": "Iiri",
            "Itaalia": "Itaalia",
            "Läti": "Läti",
            "Leedu": "Leedu",
            "Malta": "Malta",
            "Poola": "Poola",
            "Portugali": "Portugali",
            "Rumeenia": "Rumeenia",
            "Slovaki": "Slovaki",
            "Sloveeni": "Sloveeni",
            "Hispaania": "Hispaania",
            "Rootsi": "Rootsi",
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
            // en->et
            "Bulgaaria": "Bulgarian",
            "Horvaatia": "Croatian",
            "Tšehhi": "Czech",
            "Taani": "Danish",
            "Hollandi": "Dutch",
            "Inglise": "English",
            "Eesti": "Estonian",
            "Soome": "Finnish",
            "Prantsuse": "French",
            "Saksa": "German",
            "Kreeka": "Greek",
            "Ungari": "Hungarian",
            "Iiri": "Irish",
            "Itaalia": "Italian",
            "Läti": "Latvian",
            "Leedu": "Lithuanian",
            "Malta": "Maltese",
            "Poola": "Polish",
            "Portugali": "Portuguese",
            "Rumeenia": "Romanian",
            "Slovaki": "Slovak",
            "Sloveeni": "Slovenian",
            "Hispaania": "Spanish",
            "Rootsi": "Swedish",
        }

        if (word.length) {
            if ($rootScope.language === 'et') {
                return (Estonian[word]);
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
    }

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
    
});

app.controller('TranslateCtrl', function ($scope, $routeParams, $rootScope) {
    $('#fileWidget').empty();
    $('#webWidget').empty();

    //$scope.sysType.eTranslation = false;

    initTextWidget($scope, $rootScope);
});



function initTextWidget($scope, $rootScope) {
    var textWidget = new Tilde.TranslatorWidget('#textWidget', {
        _language: 'en',
        //_systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList',
        _systemListUrl: 'https://letsmt.eu/ws/service.svc/json/GetSystemList',
        _translationUrl: 'https://letsmt.eu/ws/service.svc/json/TranslateEx',
        //_clientId: 'u-dc4cd3c5-ebc9-4213-ac9d-593c896bc0ea',
        //_clientId: 'u-aa4a8f1a-52fd-4b1b-a663-a72247852d76',
        _clientId: 'u-ea37600d-1fb7-44e8-9ab6-c113cd72bf8f',
        _templateId: 'translatetext-template',
        _appId: "Tilde|EU Presidency|Web",
        //_landingView: true,
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
        _defaultSourceLang: 'et',
        _defaultTargetLang: 'en',
        _replaceSourceWithBlock: 'false',
        _onSystemChanged: function isETranslationSystem(activeSys) {
            var etr = false;
            
            $widget.settings._systems.forEach(function (a) {
                if (a.ID === activeSys) {
                    a.Metadata.forEach(function (b) {
                        if (b.Key === 'decoder' && b.Value === 'cefat-etranslation') {
                            etr = true;
                            return;
                        }
                    });
                    return;
                }
            });
            $scope.$apply(function () {
                $scope.sysType.eTranslation = etr;
            });
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
    if (typeof $widget !== 'undefined') { $widget.textPluginUnload() };

    //$scope.sysType.eTranslation = false;

    var fileWidget = new Tilde.TranslatorWidget('#fileWidget', {
        _language: 'en',
        //_systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList', //'https://hugo.lv/ws/Service.svc/json/GetSystemList',
        _systemListUrl: 'https://letsmt.eu/ws/service.svc/json/GetSystemList', //'https://hugo.lv/ws/Service.svc/json/GetSystemList',
        _uploadUrl: 'https://letsmt.eu/ws/Files/Upload',
        _deleteUrl: 'https://letsmt.eu/ws/Files/Delete',
        _downloadUrl: 'https://letsmt.eu/ws/Files/Download',
        _translateUrl: 'https://letsmt.eu/ws/Files/StartTranslation',
        _previewUrl: 'https://letsmt.eu/ws/Files/GetDocumentPreview',
        _checkStatusUrl: 'https://letsmt.eu/ws/Files/GetStatus',
        _defaultSourceLang: 'et',
        _defaultTargetLang: 'en',
        //_clientId: 'u-dc4cd3c5-ebc9-4213-ac9d-593c896bc0ea',
        //_clientId: 'u-aa4a8f1a-52fd-4b1b-a663-a72247852d76',
        _clientId: 'u-ea37600d-1fb7-44e8-9ab6-c113cd72bf8f',
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
        _onSystemChanged: function isETranslationSystem(activeSys) {
            var etr = false;

            $widget.settings._systems.forEach(function (a) {
                if (a.ID === activeSys) {
                    a.Metadata.forEach(function (b) {
                        if (b.Key === 'decoder' && b.Value === 'cefat-etranslation') {
                            etr = true;
                            return;
                        }
                    });
                    return;
                }
            });

            
            $scope.$apply(function () {
                $scope.sysType.eTranslation = etr;
            });
        },
    });
    $scope.setLanguage($rootScope.language);
});

app.controller('websiteTranslatorCtrl', function ($scope, $routeParams, $rootScope, $translate, $window) {
    $('#textWidget').empty();
    $('#documentWidget').empty();

    //$scope.sysType.eTranslation = false;

    //if (typeof $widget !== 'undefined') { $widget.textPluginUnload() };
    var webWidget = new Tilde.TranslatorWidget('#webWidget', {
        _language: 'en',
        //_clientId: 'u-dc4cd3c5-ebc9-4213-ac9d-593c896bc0ea',
        //_clientId: 'u-aa4a8f1a-52fd-4b1b-a663-a72247852d76',
        _clientId: 'u-ea37600d-1fb7-44e8-9ab6-c113cd72bf8f',
        _systemSelectType: 'language',
        _appId: "Tilde|EU Presidency|Web",
        _defaultSourceLang: 'et',
        _defaultTargetLang: 'en',
        _getFilteredSystems: false,
        _replaceSourceWithBlock: 'false',
        _apiIsInTheSameDomain: false,
        _replaceContainer: false,
        _useRecentLangSelector: true,
        //_customSelectText: '&nbsp;',
        _websiteTranslationUrl: "https://readymt.tilde.com/Translate/WebsiteEmbedded?embeddedStyle=noUI", // address of website translation page (that uses TranslateProxy)
        //_systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList', //'https://hugo.lv/ws/Service.svc/json/GetSystemList',
        _systemListUrl: 'https://letsmt.eu/ws/service.svc/json/GetSystemList', //'https://hugo.lv/ws/Service.svc/json/GetSystemList',
        _onWidgetLoaded: function () {
                    localizeLanguages($scope, $rootScope);
        },
        _onSystemChanged: function isETranslationSystem(activeSys) {
            var etr = false;
            $scope.eTranslationSystem = true;
            return;
            $widget.settings._systems.forEach(function (a) {
                if (a.ID === activeSys) {
                    a.Metadata.forEach(function (b) {
                        if (b.Key === 'decoder' && b.Value === 'cefat-etranslation') {
                            etr = true;
                            return;
                        }
                    });
                    return;
                }
            });

            $scope.$apply(function () {
                $scope.sysType.eTranslation = etr;
            });

        },
    });

    $scope.setLanguage($rootScope.language);
       
    iframeHide();
    iframeReset();
    examplesShow();

    $("#web_refresh_button").click(function() {
        if ($("#websiteFrame:visible").length != 0) {
            iframeHide();
            iframeReset();
            examplesShow();
        } else {
            webWidget = null;
            angular.element('#web_translation_type_text').triggerHandler('click');
        }
    });

    $(".loadButton", webWidget.settings.container).click(function () {
        examplesHide();
        iframeShow();
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

/*app.directive('fancybox', function ($compile, $timeout) {
    return {
        link: function ($scope, element, attrs) {
            element.fancybox({
                hideOnOverlayClick: false,
                hideOnContentClick: false,
                enableEscapeButton: false,
                showNavArrows: false,
                onComplete: function () {
                    $timeout(function () {
                        $compile($("#targetBox"))($scope);
                        $scope.$apply();
                        $.fancybox.resize();
                    })
                }
            });
        }
    }
});*/

/*app.directive('focusOn', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            $scope.$watch($attr.focusOn, function (_focusVal) {
                $timeout(function () {
                    _focusVal ? $element.focus() :
                        $element.blur();
                });
            });
        }
    }
})*/

/*app.directive('hideBlink', function () {

    var link = function (scope, element, attributes) {
        var target = attributes.hideBlink ? attributes.hideBlink : element;
        element.bind('focus', function () { angular.element(target).addClass('hidden'); });
        element.bind('blur', function () { angular.element(target).removeClass('hidden'); });
    };

    return {
        restrict: 'A',
        link: link
    };

});*/

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