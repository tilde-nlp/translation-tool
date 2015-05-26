var $versionNumber = '1.0',
    $publicAppid = 'wikiapp',
    $apiUrl = 'https://letsmt.eu/ws',
    $webIframeUrl = 'https://readymt.tilde.com',
    $currentKey = $publicAppid + '-u-918f738b-7413-405d-acda-577ac8825db2'; // live;

app.controller("updateCtrl", function ($scope, $location) {
    $scope.version = $versionNumber;//possible values - text|website|  
    $scope.url = 'https://saas.tilde.com/bb7_updateinfo/downloads/wikiappupdates.js';//possible values - mobile|about
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

app.controller("myPageCtrl", function ($scope, $location) {
    try {
        //console.log("Location: " + document.location);
        //console.log("Domain: " + document.domain);
    }
    catch (err) {
        console.log(err.message);
    }

    $scope.isActive = function (viewLocation) {
        var active = ("/" + viewLocation === $location.path());
        return active;
    };
    $scope.website = {};
    $scope.website.samples = listOfWebsites();
    $scope.website.url = '';

    $scope.translateWebsite = function () {
        $('#webWidget .url').val($scope.website.url);
        hideWebLanding();
        $('#webWidget .translateButton').click();
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
    $('#fileWidget').empty();
    initTextWidget($scope);
});

app.controller('DocumentCtrl', function ($scope, $routeParams) {
    $('#textWidget').empty();

    if (typeof $widget !== 'undefined') {
        $widget.textPluginUnload()
    };

    if (typeof $widget !== 'undefined') {
        Tilde.TranslatorWidget.prototype.onSystemChangedHandlers = [];
    }

    var fileWidget = new Tilde.TranslatorWidget('#fileWidget', {
        _language: 'lv',
        _systemListUrl: $apiUrl + '/Service.svc/json/GetSystemList',
        _translationUrl: $apiUrl + '/Service.svc/json/Translate',
        _uploadUrl: $apiUrl + '/Files/Upload',
        _deleteUrl: $apiUrl + '/Files/Delete',
        _downloadUrl: $apiUrl + '/Files/Download',
        _translateUrl: $apiUrl + '/Files/StartTranslation',
        _previewUrl: $apiUrl + '/Files/GetDocumentPreview',
        _checkStatusUrl: $apiUrl + '/Files/GetStatus',
        _allowedSystemStatuses: 'running,queuingtransl,standby',
        _clientId: parseClientKey($currentKey).clientid,
        _appId: parseClientKey($currentKey).appid,
        _templateId: 'translatefile-template',
        _systemSelectType: 'domain',
        _landingView: true,
        _getFilteredSystems: true,
        _allowedFileTypes: [
            { ext: "doc", mime: "application/msword" },
            { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
            { ext: "xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
            { ext: "pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
            { ext: "odt", mime: "application/vnd.oasis.opendocument.text" },
            { ext: "odp", mime: "application/vnd.oasis.opendocument.presentation" },
            { ext: "ods", mime: "application/vnd.oasis.opendocument.spreadsheet" },
            { ext: "rtf", mime: "application/rtf" },
            { ext: "html", mime: "text/html" },
            { ext: "htm", mime: "text/html" },
            { ext: "xhtml", mime: "application/xhtml" },
            { ext: "xht", mime: "application/xhtml+xml" },
            { ext: "txt", mime: "text/plain" }
        ],
        _mimetypeFilter: false,
        _onWidgetLoaded: function () {
            $('#fileWidget').removeClass('loading');
        },
        _replaceContainer: false
    });
});

app.controller('WebCtrl', function ($scope, $routeParams) {
    showWebLanding();

    $('#textWidget').empty();

    if (typeof $widget !== 'undefined') {
        $widget.textPluginUnload()
    };

    if (typeof $widget !== 'undefined') {
        Tilde.TranslatorWidget.prototype.onSystemChangedHandlers = [];
    }

    var webWidget = new Tilde.TranslatorWidget('#webWidget', {
        _language: 'lv',
        _systemListUrl: $apiUrl + '/Service.svc/json/GetSystemList',
        _translationUrl: $apiUrl + '/Service.svc/json/Translate',
        _allowedSystemStatuses: 'running,queuingtransl,standby',
        _systemSelectType: 'domain',
        _clientId: parseClientKey($currentKey).clientid,
        _appId: parseClientKey($currentKey).appid,
        _templateId: 'translateweb-template',
        _getFilteredSystems: true,
        _replaceContainer: false,
        _apiIsInTheSameDomain: false,
        _websiteTranslationUrl: $webIframeUrl + '/Translate/WebsiteEmbedded?embeddedStyle=noUI',
        _webLangAutodetect: false,
        _onWidgetLoaded: function () {
            $('#webWidget').removeClass('loading');
            $('#webWidget .url').keyup(function () {
                $('#webpageLanding .bigText input').val(this.value);
            });
        },
        _onWebTranslateUrlLoaded: function (url) {
            hideWebLanding();
        },
        _onTranslationDisabled: function () {
            $('.addressContainer .url').attr('disabled', 'disabled');
            $('.bigText .cursor').removeClass('blinker').addClass('disabled');
            $('.bigText input').attr('disabled', 'disabled');
            $('#webpageLanding #disableLinks').removeClass('hide');
        },
        _onTranslationEnabled: function () {
            $('.addressContainer .url').removeAttr('disabled');
            $('.bigText .cursor').addClass('blinker').addClass('disabled');
            $('.bigText input').removeAttr('disabled');
            $('#webpageLanding #disableLinks').addClass('hide');
        }
    });
});

app.controller('homeCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    //empty
}]);

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
        element.bind('focus', function () {
            $(target).addClass('hidden');
        });
        element.bind('blur', function () {
            $(target).removeClass('hidden');
        });
    };
    return {
        restrict: 'A',
        link: link
    };
});

function parseClientKey(key) {
    // applicationid-u-xxxxxxxxxxxxxxxxxxxxxxxxxxx
    var clientid = key.substr(key.indexOf('-u-') + 1).replace(/ /g, ''),
        appid = key.replace(clientid, '').slice(0, -1).replace(/ /g, '');

    return {
        clientid: clientid,
        appid: (appid === '') ? $publicAppid : appid
    };
}

function initTextWidget($scope) {
    if (typeof $widget !== 'undefined') {
        Tilde.TranslatorWidget.prototype.onSystemChangedHandlers = [];
    }

    var textWidget = new Tilde.TranslatorWidget('#textWidget', {
        _language: 'lv',
        _systemListUrl: $apiUrl + '/Service.svc/json/GetSystemList',
        _translationUrl: $apiUrl + '/Service.svc/json/Translate',
        _allowedSystemStatuses: 'running,queuingtransl,standby',
        _clientId: parseClientKey($currentKey).clientid,
        _appId: parseClientKey($currentKey).appid,
        _templateId: 'translatetext-template',
        _systemSelectType: 'domain',
        _landingView: true,
        _getFilteredSystems: true,
        _onWidgetLoaded: function () {
            $('#textWidget').removeClass('loading');
            $(document).keydown(function (e) {
                if (isCharacterKeyPress(e) && $scope.isActive('text')) {
                    $(".translateTextSource").click();
                }
                if (isCharacterKeyPress(e) && $scope.isActive('webpage') && !$("#url").is(":focus")) {
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

function showWebLanding() {
    $('#websiteFrameContainer').addClass('hide');
    $('#webpageLanding').removeClass('hide');
    $('#webpageLanding .bigText input').val('');
}

function hideWebLanding() {
    $('#websiteFrameContainer').removeClass('hide');
    $('#webpageLanding').addClass('hide');
}

function listOfWebsites() {
    return [
        { "url": "en.wikipedia.org/", "title": "Wikipedia", "description": "Brīvā enciklopēdija" }
    ];
}

function initEvents() {
    $("body").bind('click', function (e) {
        if (e.which == 2) {
            e.preventDefault();
        }
    });
}

$(document).ready(function () {
    $('#webpageLanding .bigText input').keyup(function () {
        $('#webWidget .url').val(this.value);
    });
});