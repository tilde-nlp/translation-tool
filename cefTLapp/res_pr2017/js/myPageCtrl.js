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

    $scope.webLoaded = false;

    //$scope.website.reset = function () {
    //    if ($scope.website.status == 'loading' || $scope.website.status == 'translating') {
    //        $scope.website.untranslate();
    //        setTimeout(function () { $scope.website.reset(); }, 500);
    //    } else {
    //        $scope.website.status = 'initial';

    //    }
    //};

    //$scope.initWebsite = function () {
    //    var data = [];

    //    for (var i = 0; i < $widget.settings._systems.length; i++) {
    //        var mySys = $widget.settings._systems[i]
    //        data.push({
    //            "id": mySys.ID,
    //            "sourceLanguage": mySys.SourceLanguage.Code,
    //            "targetLanguage": mySys.TargetLanguage.Code,
    //            "name": mySys.Title ? mySys.Title.Text : mySys.ID,
    //            "order": i
    //        });
    //    }

    //    $scope.website.frame.postMessage(
    //        { "message": "setSystemList", "systemList": data },
    //        "*");
    //    $scope.website.changeSystem();
    //    $scope.website.loadUrl(true);
    //};

    //$scope.website.loadUrl = function (translateAfterLoad) {
    //    $scope.website.status = 'loading';
    //    $scope.website.frame.postMessage(
    //        { "message": "loadUrl", "url": $scope.website.url, "translateAfterLoad": translateAfterLoad },
    //        "*");
    //}

    //$scope.website.translate = function () {
    //    $scope.website.frame.postMessage({ "message": "translate", },
    //        "*");
    //}

    //$scope.website.untranslate = function () {
    //    $scope.website.frame.postMessage({ "message": "untranslate", }, "*");
    //}

    //$scope.website.changeSystem = function () {
    //    jQuery("#websiteFrame")[0].contentWindow.postMessage({ "message": "changeSystem", "systemId": $scope.website.system },
    //      "*");
    //}

    //$scope.loadURL = function () {
    //    if ($event.which === 13) {
    //        $scope.website.loadUrl();
    //    }
    //}

    //    if ($scope.isActive('website') && $scope.website.status != 'initial') {
    //        return true;
    //    }
    //    return false;


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
    }
    else {
        $scope.pluginURL += '.zip';
    }

    $scope.getPlugin = function () {
        var link = document.createElement('a');
        link.href = $scope.pluginURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // $scope.language = 'en';
    // $scope.languages = ['en', 'et'];
    
    $scope.localize = function (word) {
        var Estonian = {}
        Estonian["English"] = "Inglise";
        Estonian["Estonian"] = "Eesti";
        Estonian["Inglise"] = "Inglise";
        Estonian["Eesti"] = "Eesti";

        var English = {}
        English["English"] = "English";
        English["Estonian"] = "Estonian";
        English["Inglise"] = "English";
        English["Eesti"] = "Estonian";

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
        var isOk = false;
        for (var i = 0; i < $rootScope.languages.length; i++) {
            if ($rootScope.languages[i] === newLang) {
                isOk = true;
            }
        }

        if (!isOk) {
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

    $scope.testText = 'this is a test text';
});

app.controller('TranslateCtrl', function ($scope, $routeParams, $rootScope) {
    $('#fileWidget').empty();
    initTextWidget($scope, $rootScope);
});



function initTextWidget($scope, $rootScope) {
    var textWidget = new Tilde.TranslatorWidget('#textWidget', {
        _language: 'en',
        _systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList',
        _clientId: 'u-dc4cd3c5-ebc9-4213-ac9d-593c896bc0ea',
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
        _customSelectText: '&nbsp;'
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

    var fileWidget = new Tilde.TranslatorWidget('#fileWidget', {
        _language: 'en',
        _systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList', //'https://hugo.lv/ws/Service.svc/json/GetSystemList',
        _uploadUrl: 'https://letsmt.eu/ws/Files/Upload',
        _deleteUrl: 'https://letsmt.eu/ws/Files/Delete',
        _downloadUrl: 'https://letsmt.eu/ws/Files/Download',
        _translateUrl: 'https://letsmt.eu/ws/Files/StartTranslation',
        _previewUrl: 'https://letsmt.eu/ws/Files/GetDocumentPreview',
        _checkStatusUrl: 'https://letsmt.eu/ws/Files/GetStatus',
        _clientId: 'u-dc4cd3c5-ebc9-4213-ac9d-593c896bc0ea',
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
        _replaceContainer: false,
        _useRecentLangSelector: true,
        _customSelectText: '&nbsp;'
    });
    $scope.setLanguage($rootScope.language);
});

app.controller('websiteTranslatorCtrl', function ($scope, $routeParams, $rootScope, $translate, $window) {
    $('#textWidget').empty();

    if (typeof $widget !== 'undefined') { $widget.textPluginUnload() };

    var webWidget = new Tilde.TranslatorWidget('#webWidget', {
        _language: 'en',
        _clientId: 'u-dc4cd3c5-ebc9-4213-ac9d-593c896bc0ea',
        _systemSelectType: 'language',
        _appId: "Tilde|EU Presidency|Web",
        _defaultTargetLang: 'en',
        _defaultSourceLang: 'en',
        _getFilteredSystems: false,
        _replaceSourceWithBlock: 'false',
        _apiIsInTheSameDomain: false,
        _replaceContainer: false,
        _useRecentLangSelector: true,
        _customSelectText: '&nbsp;',
        _websiteTranslationUrl: "https://readymt.tilde.com/Translate/WebsiteEmbedded?embeddedStyle=noUI", // address of website translation page (that uses TranslateProxy)
        _onWidgetLoaded: function () {
                    localizeLanguages($scope, $rootScope);
        }
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
            $window.location.href = '#/text';
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

/*app.controller('websiteTranslatorCtrl', function ($scope, $routeParams, $rootScope, $translate) {
    $scope.website.reset();
    initTextWidget($scope, $rootScope);

    $scope.localize = function (word) {
        var Estonian = {};
        Estonian["English"] = "Inglise";
        Estonian["Estonian"] = "Eesti";

        if ($rootScope.language === 'et') {
            return (Estonian[word]);
        }

        return word;
    }

    $scope.initLang = function (newLang) {
        $rootScope.language = newLang;
        

        try {
            $translate.use($rootScope.language);
            $widget.settings._language = $rootScope.language;
            $widget.initPlugins();
            $widget.initWidgetLanguage();
            initLanguages($scope);
        }
        catch (err) {
            console.log("Failed to switch languages: " + err);
        }
         //   $widget.settings._language = $rootScope.language;

           // $widget.retrieveSystemData();
    };

    $scope.initLang($rootScope.language);
});*/

app.directive('fancybox', function ($compile, $timeout) {
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
});

app.directive('focusOn', function ($timeout) {
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
})

app.directive('hideBlink', function () {

    var link = function (scope, element, attributes) {
        var target = attributes.hideBlink ? attributes.hideBlink : element;
        element.bind('focus', function () { angular.element(target).addClass('hidden'); });
        element.bind('blur', function () { angular.element(target).removeClass('hidden'); });
    };

    return {
        restrict: 'A',
        link: link
    };

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

