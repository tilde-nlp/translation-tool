var $versionNumber = '1.9';

app.controller("updateCtrl", function ($scope) { 
    $scope.version = $versionNumber;//possible values - text|website|  
    $scope.url = 'https://saas.tilde.com/bb7_updateinfo/downloads/translateMPFOODupdates.js';//possible values - mobile|about
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
                console.log($scope.version.match(update.forVersion));
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






app.controller("myPageCtrl", function ($scope, $location) {
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
    $scope.website.base = "https://hugo.lv/en"
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
        else if ($scope.isActive('www')) {
            $location.path('/website');//?embeddedStyle=noUI
            window.open($scope.website.base + "/Translate/WebsiteEmbedded?embeddedStyle=noUI&appId=presidency.desktop", "websiteFrame");
            $scope.website.frame = jQuery("#websiteFrame")[0].contentWindow;
        } else {
            switch ($scope.website.status) {//initial|ready|loading|translating|loaded|translated
                case "initial":
                    break;
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
        $scope.website.changeSystem();
        $scope.website.loadUrl(true);
    };



    $scope.website.loadUrl = function (translateAfterLoad) {
        console.log("Es: loadURL + translate it:  " + $scope.website.url);
        $scope.website.status = 'loading';
        $scope.website.frame.postMessage(
            { "message": "loadUrl", "url": $scope.website.url, "translateAfterLoad": translateAfterLoad },
            "*");
    }

    $scope.website.translate = function () {
        console.log("Es: translate");
        $scope.website.frame.postMessage({ "message": "translate", },
            "*");
    }

    $scope.website.untranslate = function () {
        console.log("Es: untranslate");
        $scope.website.frame.postMessage({ "message": "untranslate", }, "*");
    }

    $scope.website.changeSystem = function () {
        console.log("Es: change system to " + $scope.website.system);
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
});

app.controller('TranslateCtrl', function ($scope, $routeParams) {
    $scope.website.reset();
    $('#fileWidget').empty();
    initTextWidget($scope);
});

function initTextWidget($scope, mustApply) {

    var textWidget = new Tilde.TranslatorWidget('#textWidget', {
        _language: 'en',
        _systemListUrl: 'https://letsmt.eu/npfoods/Service.svc/json/GetSystemList',
        _translationUrl: 'https://letsmt.eu/npfoods/Service.svc/json/GetTranslations',
        _clientId: 'u-918f738b-7413-405d-acda-577ac8825db2',
        _templateId: 'translatetext-template',
        _appId: "npfoods",
        _systemSelectType: 'domain',
        _landingView: true,
        _getFilteredSystems: true,
        _onSystemsLoaded: function (systems) {
            $widget.settings._systems = [];
            $.each(systems, function (idx, sys) {
                var ids = $widget.getSystemMetaValue(sys.Metadata, 'app-ids');
                if (ids !== null && ids.indexOf("npfoods") !== -1) {
                    $widget.settings._systems.push(sys);
                }
            });
        },
        _onWidgetLoaded: function () {
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
        _systemListUrl: 'https://letsmt.eu/npfoods/Service.svc/json/GetSystemList',
        _uploadUrl: 'https://letsmt.eu/npfoods/Files/Upload',
        _deleteUrl: 'https://letsmt.eu/npfoods/Files/Delete',
        _downloadUrl: 'https://letsmt.eu/npfoods/Files/Download',
        _translateUrl: 'https://letsmt.eu/npfoods/Files/StartTranslation',
        _previewUrl: 'https://letsmt.eu/npfoods/Files/GetDocumentPreview',
        _checkStatusUrl: 'https://letsmt.eu/npfoods/Files/GetStatus',
        _clientId: 'u-918f738b-7413-405d-acda-577ac8825db2',
        _templateId: 'translatefile-template',
        _appId: "npfoods",
        _systemSelectType: 'domain',
        _landingView: true,
        _getFilteredSystems: true,
        _allowedFileTypes: [
            { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
            { ext: "txt", mime: "text/plain" }
        ],
        _onSystemsLoaded: function (systems) {
            $widget.settings._systems = [];
            $.each(systems, function (idx, sys) {
                var ids = $widget.getSystemMetaValue(sys.Metadata, 'app-ids');
                if (ids !== null && ids.indexOf("npfoods") !== -1) {
                    $widget.settings._systems.push(sys);
                }
            });
        },
        _mimetypeFilter: false,
        _replaceContainer: false
    });
  
});

app.controller('websiteTranslatorCtrl', function ($scope, $routeParams) {
    $scope.website.reset();

    if (typeof $widget == "undefined") {
        initTextWidget($scope, true);
    }
    else {
        $scope.website.languagesReady = 'yes';
    }

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

app.controller('homeCtrl', function ($scope, $routeParams) {

    $scope.website.url = '';
    $scope.website.reset();
    jQuery('#versionNR').text(" " + $versionNumber);
});

app.directive('ngMessage', function ($window) {
    return {
        link: function (scope) {
            angular.element($window).on('message', function (event) {
                if (event.originalEvent) event = event.originalEvent;
                if (event.data && event.data.message) {
                    console.log("Tu: " + event.data.message);

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
                            console.log("Tu: " + event.data.systemId);
                            if (scope.website.updateSystem(event.data.systemId)) console.log("Es: system changed");
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
                            console.log("Tu: Error - " + event.data.description);
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