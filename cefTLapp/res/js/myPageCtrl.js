var $versionNumber = '1.22',
    $publicKey = 'tt-demo-u-0da5622e-98bc-470d-8e61-6e3ee6173cd4',
    $currentKey = '';

app.controller("updateCtrl", function ($scope, $location) {
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
    $scope.keyTitle = '';

    $scope.keyIsChanged = function () {
        $scope.keySkipped = ($currentKey === $publicKey && $currentKey !== '');
        $scope.keyTitle = ($scope.keySkipped) ? 'Enter key' : 'Change key';
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

    if (typeof $widget !== 'undefined') { $widget.textPluginUnload() };

    var fileWidget = new Tilde.TranslatorWidget('#fileWidget', {
        _language: 'en',
        _systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList',
        _uploadUrl: 'https://letsmt.eu/ws/Files/Upload',
        _deleteUrl: 'https://letsmt.eu/ws/Files/Delete',
        _downloadUrl: 'https://letsmt.eu/ws/Files/Download',
        _translateUrl: 'https://letsmt.eu/ws/Files/StartTranslation',
        _previewUrl: 'https://letsmt.eu/ws/Files/GetDocumentPreview',
        _checkStatusUrl: 'https://letsmt.eu/ws/Files/GetStatus',
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
        _onWidgetLoaded: function () {
            $('#fileWidget').removeClass('loading');
            initLanguages($scope);
        },
        _onSystemChanged: function (id) {
            //$scope.website.system = id;
        },
        _replaceContainer: false
    });
});

app.controller('WebCtrl', function ($scope, $routeParams) {
    showWebLanding();

    $('#textWidget').empty();

    if (typeof $widget !== 'undefined') { $widget.textPluginUnload() };

    var webWidget = new Tilde.TranslatorWidget('#webWidget', {
        _language: 'en',
        _systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList',
        _systemSelectType: 'domain',
        _clientId: parseClientKey($currentKey).clientid,
        _appId: parseClientKey($currentKey).appid,
        _templateId: 'translateweb-template',
        _getFilteredSystems: true,
        _replaceContainer: false,
        _apiIsInTheSameDomain: false,
        _websiteTranslationUrl: 'https://readymt.tilde.com/Translate/WebsiteEmbedded?embeddedStyle=noUI',
        _onWidgetLoaded: function () {
            $('#webWidget .url').keyup(function () {
                $('#webpageLanding .bigText input').val(this.value);
            });
        },
        _onWebTranslateUrlLoaded: function (url) {
            hideWebLanding();
        }
    });
});

app.controller('homeCtrl', function ($scope, $location) {
    if ($currentKey.replace(/\s/g, '') === '') {
        $location.url('/key');
    }

    $scope.clientid = '';
    $scope.changeKey = function () {
        if ($scope.clientid.replace(/\s/g, '') !== '') {
            // save to registry
            $location.url('/setkey/?keyName=letsMTKey&key=' + $scope.clientid);
            $currentKey = $scope.clientid;
        }
        $scope.keyIsChanged();
    }
    $scope.skipKey = function () {
        $location.url('/setkey/?keyName=letsMTKey&key=' + $publicKey);
        $currentKey = $publicKey;
        $scope.keyIsChanged();
    }
    $scope.toolTipClass = 'dontShow';
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

function parseClientKey(key) {
    // applicationid-u-xxxxxxxxxxxxxxxxxxxxxxxxxxx
    var clientid = key.substr(key.indexOf('-u-') + 1).replace(/ /g, ''),
        appid = key.replace(clientid, '').slice(0, -1).replace(/ /g, '');

    return {
        clientid: clientid,
        appid: (appid === '') ? 'trtool.desktop' : appid
    };
}

function initTextWidget($scope) {
    var textWidget = new Tilde.TranslatorWidget('#textWidget', {
        _language: 'en',
        _systemListUrl: 'https://letsmt.eu/ws/Service.svc/json/GetSystemList',
        _translationUrl: 'https://letsmt.eu/ws/Service.svc/json/Translate',
        _clientId: parseClientKey($currentKey).clientid,
        _appId: parseClientKey($currentKey).appid,
        _templateId: 'translatetext-template',
        _systemSelectType: 'domain',
        _landingView: true,
        _getFilteredSystems: true,
        _onWidgetLoaded: function () {
            $('#textWidget').removeClass('loading');
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

function initLanguages($scope) {

    $.each($widget.settings._systems, function (idx, sys) {
        if ($('.w .translateSourceLang option[value="' + sys.SourceLanguage.Code + '"]').length == 0) {
            $('.w .translateSourceLang').append($('<option>', {
                value: sys.SourceLanguage.Code,
                text: sys.SourceLanguage.Name.Text
            }));
        }
    });

    $('.w .translateSourceLang').fancySelect({
        triggerTemplate: function (el) {
            loadTargetLangList(el.val(), null, true);
            return el.text();
        }
    });

    // default target lang        
    if ($widget.settings._defaultTargetLang !== null) {

        $('.w .translateTargetLang option[lang="' + $widget.settings._defaultTargetLang + '"]').val($widget.settings._defaultTargetLang);
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
        //$scope.website.languagesReady = 'yes';
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
        $('.w .translateSourceLang').trigger('update.fs');
    }
    loadTargetLangList(src, trg, true);
}

function getKey(key, value) {
    //alert('getKey(' + key + ', ' + value + ')');
    if (key === 'letsMTKey') {
        $currentKey = value;
    }
}

$(document).ready(function () {
    $('#webpageLanding .bigText input').keyup(function () {
        $('#webWidget .url').val(this.value);
    });
});