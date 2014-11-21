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
    $scope.website.base = "http://letsmt-logic.tilde.lv/en";
    $scope.website.url = '';
    $scope.website.errorMsg = '';
    $scope.website.freeze = false;
    $scope.website.status = 'initial';
    $scope.website.focus = false;
    $scope.website.frame = jQuery("#websiteFrame")[0].contentWindow;
    $scope.website.samples = listOfWebsites();
    $scope.updateWebsite = function () {
        if ($scope.isActive('website') || $scope.website.status != 'initial') {
            $scope.initWebsite();
        } else {
            $location.path('/website');//?embeddedStyle=noUI
            window.open($scope.website.base + "/Translate/WebsiteEmbedded?embeddedStyle=noUI", "websiteFrame");
            $scope.website.frame = jQuery("#websiteFrame")[0].contentWindow;
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
        console.log("Es: change system to " + $scope.controls.activeSystem.ID);
        jQuery("#websiteFrame")[0].contentWindow.postMessage({ "message": "changeSystem", "systemId": $scope.controls.activeSystem.ID },
          "*");
    }

    $scope.loadURL = function () {
        if ($event.which === 13) {
            $scope.website.loadUrl();
        }
    }

    /*end of language controls*/
    initEvents();
});

app.controller('TranslateCtrl', function ($scope, $routeParams) {
    $scope.website.status = 'initial';
    $scope.website.url = '';
    var widget = new Tilde.TranslatorWidget('#widget', {
        _language: 'en',
        _templateId: 'translatetext-template',
        _appId: "presidencyMT",
        _onWidgetLoaded: function () {
            //console.log('_onWidgetLoaded()');
        },
        _onSystemChanged: function (id) {
            //console.log('_onSystemChanged(' + id + ')');
        },
        _replaceContainer: true
    });
});

app.controller('websiteTranslatorCtrl', function ($scope, $routeParams) {
    $scope.website.status = 'initial';
    $scope.controls.systems = $widget.settings._systems; /*language controls $widget.settings._systems*/
    $scope.controls.activeSystem = {};
    $scope.controls.activeSystem = $scope.controls.systems[0];
    $scope.controls.activeSystemSource = $scope.controls.activeSystem;
    $scope.controls.updated = function () {
        jQuery("#websiteFrame")[0].contentWindow.postMessage(
                   { "method": "changeSystem", "systemId": $scope.controls.activeSystem.id },
                     $scope.website.base);
        console.log($scope.controls.activeSystem.id);
    };
    $scope.controls.activeSystem = {};
    $scope.controls.activeSystem = $scope.controls.activeSystemSource = $scope.controls.systems[0];
    $scope.controls.updated = function () {
        jQuery("#websiteFrame")[0].contentWindow.postMessage(
                   { "method": "changeSystem", "systemId": $scope.controls.activeSystem.id },
                     $scope.website.base);
        console.log($scope.controls.activeSystem.id);
    };
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
                            break;
                        case "systemChanged":
                            console.log("Tu: " + event.data.systemId);
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
        { "url": "www.delfi.lv" },
        { "url": "www.tvnet.lv" },
        { "url": "www.diena.lv" },
        { "url": "www.lsm.lv" },
        { "url": "www.apollo.lv" }
    ];
}

function initEvents() {

    $('#source.language').click(function () {
        $('#source ul').slideToggle(250);
        return false;
    });
    $('#target.language').click(function () {
        $('#target ul').slideToggle(250);
        return false;
    });

    $('.language').mouseenter(function () {
        $(this).children('ul').css('display', 'none').stop(true, true).slideToggle(250).css('display', 'block').children('ul').css('display', 'none');
    });

    $('#source').mouseleave(function () {
        $('#source>ul').stop(true, true).fadeOut(250).css('display', 'none');
    })
    $('#target').mouseleave(function () {
        $('#target>ul').stop(true, true).fadeOut(250).css('display', 'none');
    })

}