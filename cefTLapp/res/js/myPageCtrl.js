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
    $scope.controls = {};
    $scope.website.base = "https://hugo.lv/en"
    $scope.website.url = '';
    $scope.website.errorMsg = '';
    $scope.website.freeze = false;
    $scope.website.status = 'initial';
    $scope.website.focus = false;
    // $scope.website.frame = jQuery("#websiteFrame")[0].contentWindow;
    $scope.website.samples = listOfWebsites();
    $scope.updateWebsite = function () {
        if (!$scope.website.url || $scope.website.url.lenght == 0) {

        }
        else if ($scope.isActive('www')) {
            $location.path('/website');//?embeddedStyle=noUI
            window.open($scope.website.base + "/Translate/WebsiteEmbedded?embeddedStyle=noUI", "websiteFrame");
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

    $scope.website.initLanguages = function (mustApply) {
        //callback from text translation widget - loaded  
        $scope.controls.systems = $widget.settings._systems; /*language controls $widget.settings._systems*/
        $scope.controls.activeSystem = {};
        $scope.controls.activeSystem = $scope.controls.systems[0];
        $scope.controls.activeSystemSource = $scope.controls.activeSystem;
        if (mustApply) $scope.$apply($scope.controls.activeSystemSource);
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
        console.log("Es: change system to " + $scope.controls.activeSystem.ID);
        jQuery("#websiteFrame")[0].contentWindow.postMessage({ "message": "changeSystem", "systemId": $scope.controls.activeSystem.ID },
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
        _systemListUrl: 'https://hugo.lv/ws/Service.svc/json/GetSystemList',
        _clientId: 'u-bfcaf986-8147-4901-a131-f0d618a7354b',
        _templateId: 'translatetext-template',
        _appId: "web",
        _landingView: true,
        _getFilteredSystems: true,
        _onWidgetLoaded: function () {
            $scope.website.initLanguages((typeof mustApply === "undefined") ? false : mustApply);
        },
        _onSystemChanged: function (id) {
            //console.log('_onSystemChanged(' + id + ')');
        },
        _replaceContainer: false
    });
}

app.controller('DocumentCtrl', function ($scope, $routeParams) {
    $scope.website.reset();
    $scope.website.url = '';
    $('#textWidget').empty();
    if (typeof $widget !== undefined) { $widget.textPluginUnload() };

    var fileWidget = new Tilde.TranslatorWidget('#fileWidget', {
        _language: 'en',
        _systemListUrl: 'https://hugo.lv/ws/Service.svc/json/GetSystemList',
        _uploadUrl: 'https://hugo.lv/ws/Files/Upload',
        _deleteUrl: 'https://hugo.lv/ws/Files/Delete',
        _downloadUrl: 'https://hugo.lv/Files/Download',
        _translateUrl: 'https://hugo.lv/ws/Files/StartTranslation',
        _previewUrl: 'https://hugo.lv/ws/Files/GetDocumentPreview',
        _checkStatusUrl: 'https://hugo.lv/ws/Files/GetStatus',
        _clientId: 'u-bfcaf986-8147-4901-a131-f0d618a7354b',
        _templateId: 'translatefile-template',
        _appId: "web",
        _landingView: true,
        _getFilteredSystems: true,
        _allowedFileTypes: [{ ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }],
        _onWidgetLoaded: function () {
            $scope.website.initLanguages();
        },
        _onSystemChanged: function (id) {
            //console.log('_onSystemChanged(' + id + ')');
        },
        _replaceContainer: false
    });

});


app.controller('websiteTranslatorCtrl', function ($scope, $routeParams) {
    $scope.website.reset();
    if (!$scope.controls.activeSystem) {
        initTextWidget($scope, true);
    }

    $scope.controls.updated = function () {
        jQuery("#websiteFrame")[0].contentWindow.postMessage(
                   { "method": "changeSystem", "systemId": $scope.controls.activeSystem.id },
                     $scope.website.base);
    };
    $scope.website.updateSystem = function (systemID) {
        if ($scope.controls.activeSystem.ID == systemID) return false;
        $scope.$apply($scope.controls.activeSystem = $scope.controls.activeSystem = $scope.controls.systems.filter(function (x) { return x.ID == systemID; })[0]);
        return true;
    }
});

app.controller('homeCtrl', function ($scope, $routeParams) {
    initTextWidget($scope);
    $scope.website.url = '';
    $scope.website.reset();
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

    $('#source.language').click(function () {
        $('#source ul').slideToggle(400);
        return false;
    });

    $('#target.language').click(function () {
        $('#target ul').slideToggle(400);
        return false;
    });




    $('.language ul').mouseenter(function () {
        $(this).children('ul').css('display', 'none').stop(true, true).slideToggle(250).css('display', 'block').children('ul').css('display', 'none');
    });

    $('#source ul').mouseleave(function () {
        $('#source>ul').stop(true, true).fadeOut(250).css('display', 'none');
    })
    $('#target ul').mouseleave(function () {
        $('#target>ul').stop(true, true).fadeOut(250).css('display', 'none');
    })



    $("body").bind('click', function (e) {
        if (e.which == 2) {
            e.preventDefault();
        }
    });

}

