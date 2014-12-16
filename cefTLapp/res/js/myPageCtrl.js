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
        _systemListUrl: 'https://hugo.lv/ws/Service.svc/json/GetSystemList',
        _clientId: 'u-bfcaf986-8147-4901-a131-f0d618a7354b',
        _templateId: 'translatetext-template',
        _appId: "presidency.desktop",
        _landingView: true,
        _getFilteredSystems: true,
        _onWidgetLoaded: function () {

            if ($scope.isActive('www') || $scope.isActive('website')) {
                initLanguages($scope);
            }
            $(document)
               .keydown(function (e) {
                   if (isCharacterKeyPress(e) && $scope.isActive('text')) $(".translateTextSource").click();
                   if (isCharacterKeyPress(e) && $scope.isActive('www')) { $("#url").focus(); }
               });
        },
        _onSystemChanged: function (id) {

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
        _systemListUrl: 'https://hugo.lv/ws/Service.svc/json/GetSystemList',
        _uploadUrl: 'https://hugo.lv/ws/Files/Upload',
        _deleteUrl: 'https://hugo.lv/ws/Files/Delete',
        _downloadUrl: 'https://hugo.lv/Files/Download',
        _translateUrl: 'https://hugo.lv/ws/Files/StartTranslation',
        _previewUrl: 'https://hugo.lv/ws/Files/GetDocumentPreview',
        _checkStatusUrl: 'https://hugo.lv/ws/Files/GetStatus',
        _clientId: 'u-bfcaf986-8147-4901-a131-f0d618a7354b',
        _templateId: 'translatefile-template',
        _appId: "presidency.desktop",
        _landingView: true,
        _getFilteredSystems: true,
        _allowedFileTypes: [{ ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }],
        _onWidgetLoaded: function () {
            initLanguages($scope);
        },
        _onSystemChanged: function (id) {
            //console.log('_onSystemChanged(' + id + ')');
        },
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
});

app.controller('homeCtrl', function ($scope, $routeParams) {

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

function initLanguages($scope) {

    $.each($widget.settings._systems, function (idx, sys) {
        if ($('.w .translateSourceLang option[value="' + sys.SourceLanguage.Code + '"]').length == 0) {
            $('.w .translateSourceLang').append($('<option>', {
                value: sys.SourceLanguage.Code,
                text: sys.SourceLanguage.Name.Text
            }));
        }
    });

    // if only one, replace source select with block
    if ($('.w .translateSourceLang option').length === 1) {
        var srcSelect = $('.w .translateSourceLang', $widget.settings.container),
            srcVal = srcSelect.val(),
            srcText = srcSelect.text();

        srcSelect.replaceWith('<div class="translateSingleSourceLang" data-value="' + srcVal + '">' + srcText + '</div>');
        loadTargetLangList(srcVal, null, null);
    }
    else {
        // default source lang
        if ($widget.settings._defaultSourceLang !== null) {
            $('.w .translateSourceLang').val($widget.settings._defaultSourceLang);
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
        $('.w .translateSourceLang').trigger('update.fs');
    }
    loadTargetLangList(src, trg, true);
}
