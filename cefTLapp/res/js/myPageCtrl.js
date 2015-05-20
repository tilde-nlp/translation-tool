var $versionNumber = '1.0',
    $publicAppid = 'tt-demo',
    //$publicKey = $publicAppid + '-u-0da5622e-98bc-470d-8e61-6e3ee6173cd4',
    $publicKey = $publicAppid + '-u-da8f9331-f2f3-4d92-af76-ad2bc25a482a',
    $currentKey = '',
    $keyChanged = false,
    $systemList = null;

app.controller("updateCtrl", function ($scope, $location) {
    $scope.version = $versionNumber;//possible values - text|website|  
    $scope.url = 'https://saas.tilde.com/bb7_updateinfo/downloads/ttoolupdates.js';//possible values - mobile|about
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

    $location.url('/getkey/?keyName=letsMTKey');
});

app.controller("myPageCtrl", function ($scope, $location) {
    try {
        //console.log("Location: " + document.location);
        //console.log("Domain: " + document.domain);
    }
    catch (err) {
        console.log(err.message);
    }

    $scope.keySkipped = false;
    $scope.keyTitle = 'Change key';

    $scope.keyIsChanged = function () {
        $scope.keySkipped = ($currentKey === $publicKey && $currentKey !== '');
        $scope.keyTitle = ($scope.keySkipped) ? 'Enter key' : 'Change key';
        $keyChanged = true;
    };

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
        if ($keyChanged) {
            $widget.settings._systems = null;
            $keyChanged = false;
        }
        $widget.textPluginUnload()
    };

    if (typeof $widget !== 'undefined') {
        Tilde.TranslatorWidget.prototype.onSystemChangedHandlers = [];
    }

    var fileWidget = new Tilde.TranslatorWidget('#fileWidget', {
        _language: 'en',
        _systemListUrl: 'https://mtdevlogic.tilde.lv/ws/Service.svc/json/GetSystemList',
        _translationUrl: 'https://mtdevlogic.tilde.lv/ws/Service.svc/json/Translate',
        _uploadUrl: 'https://mtdevlogic.tilde.lv/ws/Files/Upload',
        _deleteUrl: 'https://mtdevlogic.tilde.lv/ws/Files/Delete',
        _downloadUrl: 'https://mtdevlogic.tilde.lv/ws/Files/Download',
        _translateUrl: 'https://mtdevlogic.tilde.lv/ws/Files/StartTranslation',
        _previewUrl: 'https://mtdevlogic.tilde.lv/ws/Files/GetDocumentPreview',
        _checkStatusUrl: 'https://mtdevlogic.tilde.lv/ws/Files/GetStatus',
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
        if ($keyChanged) {
            $widget.settings._systems = null;
            $keyChanged = false;
        }
        $widget.textPluginUnload()
    };

    if (typeof $widget !== 'undefined') {
        Tilde.TranslatorWidget.prototype.onSystemChangedHandlers = [];
    }

    var webWidget = new Tilde.TranslatorWidget('#webWidget', {
        _language: 'en',
        _systemListUrl: 'https://mtdevlogic.tilde.lv/ws/Service.svc/json/GetSystemList',
        _translationUrl: 'https://mtdevlogic.tilde.lv/ws/Service.svc/json/Translate',
        _allowedSystemStatuses: 'running,queuingtransl,standby',
        _systemSelectType: 'domain',
        _clientId: parseClientKey($currentKey).clientid,
        _appId: parseClientKey($currentKey).appid,
        _templateId: 'translateweb-template',
        _getFilteredSystems: true,
        _replaceContainer: false,
        _apiIsInTheSameDomain: false,
        _websiteTranslationUrl: 'https://readymtdevlogic.tilde.lv/Translate/WebsiteEmbedded?embeddedStyle=noUI',
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
    $scope.keyIsChanged();
    $scope.keyIsValid = true;
    $scope.ajaxProgress = false;
    if ($currentKey.replace(/\s/g, '') === '') {
        $location.url('/key');
    }

    $scope.clientid = '';
    $scope.changeKey = function () {
        if ($scope.clientid !== '') {
            // validate
            $scope.ajaxProgress = true;
            $http({
                method: 'GET',
                url: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList',
                headers: {
                    'client-id': parseClientKey($scope.clientid).clientid
                },
                params: {
                    appID: parseClientKey($scope.clientid).appid,
                    uiLanguageID: 'en',
                    options: 'filter'
                }
            }).
            success(function (data) {
                if (data.System.length > 0) {
                    $scope.keyIsValid = true;
                    // save to registry & change page
                    $location.url('/setkey/?keyName=letsMTKey&key=' + $scope.clientid);
                    $currentKey = $scope.clientid;
                }
                else {
                    $scope.keyIsValid = false;
                    $('#enterKey').addClass('keyInvalid');
                }
                $scope.ajaxProgress = false;
            }).
            error(function (data) {
                $scope.keyIsValid = false;
                $('#enterKey').addClass('keyInvalid');
                $scope.ajaxProgress = false;
            });
        }
        $scope.keyIsChanged();
    }
    $scope.$watch('clientid', function (newValue, oldValue) {
        $scope.clientid = $scope.clientid.replace(/\s/g, '');
        if ($scope.clientid === '') {
            $scope.keyIsValid = true;
            $('#enterKey').removeClass('keyInvalid');
        }
    });
    $scope.skipKey = function () {
        $location.url('/setkey/?keyName=letsMTKey&key=' + $publicKey);
        $currentKey = $publicKey;
        $scope.keyIsChanged();
    }
    $scope.toolTipClass = 'dontShow';
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
        element.bind('focus', function () { angular.element(target).addClass('hidden'); });
        element.bind('blur', function () { angular.element(target).removeClass('hidden'); });
    };

    return {
        restrict: 'A',
        link: link
    };

});

app.directive('keyMaxlength', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            attrs.$set("ngTrim", "false");
            var maxlength = parseInt(attrs.keyMaxlength, 10);
            ctrl.$parsers.push(function (value) {
                if (value.length > maxlength) {
                    value = value.substr(0, maxlength);
                    ctrl.$setViewValue(value);
                    ctrl.$render();
                }
                return value;
            });
        }
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
    if ($keyChanged) {
        if (typeof $widget !== 'undefined') {
            $widget.settings._systems = null;
        }
        $keyChanged = false;
    }

    if (typeof $widget !== 'undefined') {
        Tilde.TranslatorWidget.prototype.onSystemChangedHandlers = [];
    }

    var textWidget = new Tilde.TranslatorWidget('#textWidget', {
        _language: 'en',
        _systemListUrl: 'https://mtdevlogic.tilde.lv/ws/Service.svc/json/GetSystemList',
        _translationUrl: 'https://mtdevlogic.tilde.lv/ws/Service.svc/json/Translate',
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
        _onSystemChanged: function (id) {
            //$scope.website.system = id;
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
        $('.w .translateSourceLang').trigger('update.fs');
    }
    loadTargetLangList(src, trg, true);
}

function getKey(key, value) {
    //alert('getKey(' + key + ', ' + value + ')');
    if (key === 'letsMTKey') {
        $currentKey = value;
        $keyChanged = true;
    }
}

$(document).ready(function () {
    $('#webpageLanding .bigText input').keyup(function () {
        $('#webWidget .url').val(this.value);
    });
});