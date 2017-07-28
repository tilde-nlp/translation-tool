var $versionNumber = '1.22';

app.controller("updateCtrl", function ($scope) {
    $scope.version = $versionNumber;//possible values - text|website|  
    $scope.url = 'https://saas.tilde.com/bb7_updateinfo/downloads/translate2015updates.js';//possible values - mobile|about
    $scope.update = {
        type: '',
        title: '',
        description: '',
        url: ''
    };
    jQuery.ajax({
        catche: false,
        url: $scope.url,
        dataType: "jsonp",
        jsonp: false,
        jsonpCallback: "applicationUpdates",
        success: function (data) {
            jQuery.each(data, function (i, update) {
                //console.log($scope.version.match(update.forVersion));
                if ($scope.version.match(update.forVersion)) {
                    $scope.update = update;
                    $scope.$apply();
                }
            });
        },
        error: function (e, status, error) {
            console.log(status);
            console.log(error);
        }
    });
});






app.controller("myPageCtrl", function ($scope, $location, $translate) {
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

    $scope.website = {};
    $scope.website.system = '';
    $scope.website.base = "https://readymt.tilde.com"; //https://hugo.lv/en";
    $scope.website.url = '';
    $scope.website.errorMsg = '';
    $scope.website.freeze = false;
    $scope.website.status = 'initial';
    $scope.website.focus = false;
    $scope.website.samples = listOfWebsites();
    $scope.website.languagesReady = 'no';
    $scope.updateWebsite = function () {
        if (!$scope.website.url || $scope.website.url.lenght == 0) {

        }
        else if ($scope.isActive('www') || $scope.website.status === 'initial') {
            $location.path('/website');//?embeddedStyle=noUI
            window.open($scope.website.base + "/Translate/WebsiteEmbedded?embeddedStyle=noUI&appId=Tilde|EU Presidency|Web", "websiteFrame");
            $scope.website.frame = jQuery("#websiteFrame")[0].contentWindow;
        } else {
            switch ($scope.website.status) {//initial|ready|loading|translating|loaded|translated
                /*case "initial":
                    $scope.initWebsite();
                    break;*/
                case "loading":
                case "translating":
                    $scope.website.untranslate();
                    setTimeout(function () { $scope.updateWebsite(); }, 500);
                    break;
                default:
                    $scope.initWebsite();
            }
        }
    };

    $scope.website.reset = function () {
        if ($scope.website.status == 'loading' || $scope.website.status == 'translating') {
            $scope.website.untranslate();
            setTimeout(function () { $scope.website.reset(); }, 500);
        } else {
            $scope.website.status = 'initial';

        }
    };

    $scope.initWebsite = function () {
        var data = [];

        for (var i = 0; i < $widget.settings._systems.length; i++) {
            var mySys = $widget.settings._systems[i]
            data.push({
                "id": mySys.ID,
                "sourceLanguage": mySys.SourceLanguage.Code,
                "targetLanguage": mySys.TargetLanguage.Code,
                "name": mySys.Title ? mySys.Title.Text : mySys.ID,
                "order": i
            });
        }

        $scope.website.frame.postMessage(
            { "message": "setSystemList", "systemList": data },
            "*");
        $scope.website.changeSystem();
        $scope.website.loadUrl(true);
    };



    $scope.website.loadUrl = function (translateAfterLoad) {
        //console.log("Es: loadURL + translate it:  " + $scope.website.url);
        $scope.website.status = 'loading';
        $scope.website.frame.postMessage(
            { "message": "loadUrl", "url": $scope.website.url, "translateAfterLoad": translateAfterLoad },
            "*");
    }

    $scope.website.translate = function () {
        //console.log("Es: translate");
        $scope.website.frame.postMessage({ "message": "translate", },
            "*");
    }

    $scope.website.untranslate = function () {
        //console.log("Es: untranslate");
        $scope.website.frame.postMessage({ "message": "untranslate", }, "*");
    }

    $scope.website.changeSystem = function () {
        //console.log("Es: change system to " + $scope.website.system);
        jQuery("#websiteFrame")[0].contentWindow.postMessage({ "message": "changeSystem", "systemId": $scope.website.system },
          "*");
    }

    $scope.loadURL = function () {
        if ($event.which === 13) {
            $scope.website.loadUrl();
        }
    }


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
    $scope.pluginURL = "http://tildecom-test.tilde.lv/sites/default/files/downloads/Tilde.MTProvider.msi";
    $scope.getPlugin = function () {
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', $scope.pluginURL);
        downloadLink.attr('target', '_blank');
        downloadLink[0].click();
    };

    $scope.language = 'en';
    $scope.languages = ['en', 'ee'];

    $scope.localize = function (word) {
        var Estonian = {}
        Estonian["English"] = "Īnglise";
        Estonian["Estonian"] = "Eesti";

        if ($scope.language === 'ee') {
            return (Estonian[word]);
        }

        return word;
    }

    $scope.updateLanguage = function () {
        $translate.use($scope.language);
        $widget.settings._language = $scope.language
        $widget.retrieveSystemData(function () {
            $widget.initPlugins();
        });
    };
});

app.controller('TranslateCtrl', function ($scope, $routeParams) {
    $scope.website.reset();
    $('#fileWidget').empty();
    initTextWidget($scope);
});

function initTextWidget($scope, mustApply) {
    var textWidget = new Tilde.TranslatorWidget('#textWidget', {
        _language: 'en',
        _systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList',
        _clientId: 'u-dc4cd3c5-ebc9-4213-ac9d-593c896bc0ea',
        _templateId: 'translatetext-template',
        _appId: "Tilde|EU Presidency|Web",
        _landingView: true,
        _getFilteredSystems: false,
        _onWidgetLoaded: function () {

            if ($scope.isActive('www') || $scope.isActive('website')) {
                initLanguages($scope);
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
        _onSystemChanged: function (id) {
            $scope.website.system = id;
        },
        _replaceContainer: false
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

app.controller('DocumentCtrl', function ($scope, $routeParams) {
    $scope.website.reset();
    $scope.website.url = '';
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
        _landingView: true,
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
        _onWidgetLoaded: function () {
            initLanguages($scope);
        },
        _onSystemChanged: function (id) {
            $scope.website.system = id;
            //console.log('_onSystemChanged(' + id + ')');
        },
        _replaceContainer: false
    });

});

app.controller('websiteTranslatorCtrl', function ($scope, $routeParams) {

    $scope.website.reset();
    
    //if (typeof $widget === "undefined") {
        initTextWidget($scope, true);
    //}
    //else {
    //    $scope.website.languagesReady = 'yes';
    //}

    $scope.website.systemUpdated = function () {
        jQuery("#websiteFrame")[0].contentWindow.postMessage(
                   { "method": "changeSystem", "systemId": $scope.website.system },
                   $scope.website.base);
    };
    $scope.website.updateSystem = function (systemID) {
        if ($scope.website.system == systemID) return false;
        $scope.website.system = systemID;
        setActiveSystem(systemID);
        return true;
    }
    jQuery("#url").click(function () { $(this).select(); });
});

/*app.controller('homeCtrl', function ($scope, $routeParams) {

    $scope.website.url = '';
    $scope.website.reset();
});*/

app.directive('ngMessage', function ($window) {
    return {
        link: function (scope) {
            angular.element($window).on('message', function (event) {
                if (event.originalEvent) event = event.originalEvent;
                if (event.data && event.data.message) {
                    //console.log("Tu: " + event.data.message);
                    //vstr = JSON.stringify(event.data, null, 4); // (Optional) beautiful indented output.
                    //console.log(vstr); // Logs output to dev tools console.

                        
                    switch (event.data.message) {
                        case "urlLoaded":
                            scope.website.url = event.data.url;
                            console.log(event.data.url);
                            break;
                        case "startedLoading":
                            scope.website.status = 'loading';
                            break;
                        case "stoppedLoading":
                            //scope.website.status = 'loaded';
                            break;
                        case "systemChanged":
                            //console.log("Tu: " + event.data.systemId);
                            //if (scope.website.updateSystem(event.data.systemId)) console.log("Es: system changed");
                            scope.website.translate();
                            break;
                        case "translationStarted":
                            scope.website.status = 'translating';
                            break;
                        case "translationStopped":
                            scope.website.status = 'loaded';
                            break;
                        case "translated":
                            scope.website.status = 'translated';
                            break;
                        case "untranslated":
                            scope.website.status = 'loaded';
                            break;
                        case "ready":
                            scope.initWebsite();
                            break;
                        case "error":
                            //console.log("Tu: Error - " + event.data.description);
                            scope.website.errorMsg = event.data.description;
                            scope.website.status = 'error';
                            break;
                        default:
                    }
                    scope.$apply()
                }
                scope.$broadcast('ngMessage::message');
            });
        }
    }
});

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

function listOfWebsites() {
    return [
        { "url": "www.letonika.lv", "title": "Letonika.lv", "description": "Online encyclopedia" },
        { "url": "www.lsm.lv", "title": "LSM.lv", "description": "Public news service" },
        { "url": "www.diena.lv", "title": "Diena", "description": "Daily newspaper" },
        { "url": "www.db.lv", "title": "db.lv", "description": "Business news" },
        { "url": "www.delfi.lv", "title": "Delfi", "description": "News site" },
        { "url": "www.tvnet.lv", "title": "TVNET ", "description": "News site" }
    ];
}

function initEvents() {

    $("body").bind('click', function (e) {
        if (e.which == 2) {
            e.preventDefault();
        }
    });

}

function initLanguages($scope) {
    $.each($widget.settings._systems, function (idx, sys) {
        if ($('.w .translateSourceLang option[value="' + sys.SourceLanguage.Code + '"]').length == 0) {
            $('.w .translateSourceLang').append($('<option>', {
                value: sys.SourceLanguage.Code,
                text: $scope.localize(sys.SourceLanguage.Name.Text)
            }));
            
        }
    });

    // if only one, replace source select with block
    if ($('.w .translateSourceLang option').length === 1) {
        var srcSelect = $('.w .translateSourceLang', $widget.settings.container),
            srcVal = srcSelect.val(),
            srcText = $scope.localize(srcSelect.text());

        srcSelect.replaceWith('<div class="translateSingleSourceLang" data-value="' + srcVal + '">' + srcText + '</div>');
        loadTargetLangList(srcVal, null, null);
    }
    else {
        // default source lang
        if ($widget.settings._defaultSourceLang !== null) {
            $('.w .translateSourceLang').val($scope.localize($widget.settings._defaultSourceLang));
        }

        $('.w .translateSourceLang').fancySelect({
            triggerTemplate: function (el) {
                loadTargetLangList(el.val(), null, true);
                return el.text();
            }
        });
    }

    // default target lang        
    if ($widget.settings._defaultTargetLang !== null) {

        $('.w .translateTargetLang option[lang="' + $widget.settings._defaultTargetLang + '"]').val($scope.localize($widget.settings._defaultTargetLang));
    }

    $('.w .translateTargetLang').fancySelect({
        triggerTemplate: function (el) {
            if ($widget.activeSystemId !== el.val()) {
                $widget.activeSystemId = el.val();
                if ($widget.settings._onSystemChanged && typeof ($widget.settings._onSystemChanged) === "function") {
                    $widget.settings._onSystemChanged($widget.activeSystemId);
                }
            }
            return el.text();
        }
    });

    setTimeout(function () {
        $scope.website.languagesReady = 'yes';
        $scope.$apply();
    }, 0);
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

function setActiveSystem(systemId) {
    if (systemId === $widget.activeSystemId) { return; }

    var src = '', trg = '';
    $.each($widget.settings._systems, function (idx, sys) {
        if (sys.ID === systemId) {
            src = sys.SourceLanguage.Code;
            trg = sys.TargetLanguage.Code;
        }
    });

    $('.w .translateSourceLang option[value="' + src + '"]').attr('selected', 'selected');
    if ($('.w .translateSourceLang') !== null) {
        alert($('.w .translateSourceLang').html());
        $('.w .translateSourceLang').trigger('update.fs');
    }
    loadTargetLangList(src, trg, true);
}


