/* tilde.translator.widget.TRANSLATEWEB.js */

$.extend(Tilde.TranslatorWidgetDefaultOptions, {
    _websiteTranslationUrl: 'http://localhost:53130/Translate/WebsiteEmbedded?embeddedStyle=noUI', // address of website translation page (that uses TranslateProxy)
    _debug: false, // should debug information be logged to console
    _onWebTranslateUrlLoaded: null, // callback on web page loaded
    _webLangAutodetect: true // after page is loaded auto detect language and change active system  
});

$.extend(Tilde.TranslatorWidget.prototype, {

    webPluginInit: function () {
        if ($('#websiteFrame', $widget.settings.container).length == 0)
            return;

        // schema, domain and port, used when passing messages to iframe
        // so that other domains don't see the messages
        var returnUrlIndex = $widget.settings._websiteTranslationUrl.indexOf("returnUrl");
        var websiteTranslationUrl;
        if (returnUrlIndex > -1) {
            websiteTranslationUrl = decodeURIComponent($widget.settings._websiteTranslationUrl.substring(returnUrlIndex + 10));
        } else {
            websiteTranslationUrl = $widget.settings._websiteTranslationUrl;
        }

        $widget.translateWeb_IframeSchemaPortDomain = websiteTranslationUrl.substring(
            0,
            websiteTranslationUrl.indexOf(
                "/",
                websiteTranslationUrl.indexOf("://") + 3));

        $widget.translateWeb_Url = $('.url', $widget.settings.container);
        $widget.translateWeb_Iframe = $('#websiteFrame')[0];
        $widget.translateWeb_IframeContainer = $('#websiteFrameContainer');
        $widget.translateWeb_translateButton = $('.translateButton', $widget.settings.container);
        $widget.translateWeb_cancelButton = $('.cancelButton', $widget.settings.container);
        $widget.translateWeb_restoreButton = $('.restoreButton', $widget.settings.container);
        $widget.translateWeb_spinner = $('.translateProgress', $widget.settings.container);
        $widget.translateWeb_translating = false;

        // pass appId to web translation widget
        var extraParams = "";
        if ($widget.settings._websiteTranslationUrl.indexOf("returnUrl") > -1) {
            // real url given in querystring param
            if ($widget.settings._websiteTranslationUrl.indexOf("%3f") > -1) {
                extraParams += "%26";
            } else {
                extraParams += "%3f";
            }
            extraParams += "appId%3d" + $widget.settings._appId;
            if ($widget.settings._clientId) {
                extraParams += "%26clientId%3d" + $widget.settings._clientId;
            }
            if ($widget.settings._allowedSystemStatuses) {
                extraParams += "%26allowedSystemStatuses%3d" + encodeURIComponent(encodeURIComponent($widget.settings._allowedSystemStatuses));
            }
            if ($widget.settings._getFilteredSystems) {
                extraParams += "%26filterSystemsByAppId%3dtrue";
            }
        }
        else {
            // normal url
            if ($widget.settings._websiteTranslationUrl.indexOf("?") > -1) {
                extraParams += "&";
            } else {
                extraParams += "?";
            }
            extraParams += "appId=" + $widget.settings._appId;
            if ($widget.settings._clientId) {
                extraParams += "&clientId=" + $widget.settings._clientId;
            }
            if ($widget.settings._allowedSystemStatuses) {
                extraParams += "&allowedSystemStatuses=" + encodeURIComponent($widget.settings._allowedSystemStatuses);
            }
            if ($widget.settings._getFilteredSystems) {
                extraParams += "&filterSystemsByAppId=true";
            }
        }
        $widget.settings._websiteTranslationUrl += extraParams;

        // when address is entered, start loading it in iframe
        $('.loadButton', $widget.settings.container).click(function () {
            $widget.translateWeb_loadUrl();
        });

        $('.url', $widget.settings.container).keypress(function (event) {
            if (event.which == 13) {
                $widget.translateWeb_loadUrl();
                event.preventDefault();
            }
        });

        // start translation when translate button is pressed (and load the entered url, if it was not loaded before)
        $widget.translateWeb_translateButton.click(function () {
            if ($widget.translateWeb_translateButton.attr('data-disabled') === 'true') {
                return false;
            }
            $widget.translateWeb_translateButton.attr('data-disabled', true);
            $widget.disableSystemChange();
            var message = { "message": "loadUrl", "url": $widget.translateWeb_Url.val(), "translateAfterLoad": true };
            if ($widget.termCorpusId && $widget.getSelectedTermCorpusStatus() == "Ready") {
                message["termCorpusId"] = $widget.termCorpusId;
            }
            $widget.translateWeb_sendMessageToIframe(message);
        });

        // cancel translation
        $widget.translateWeb_cancelButton.click(function () {
            $widget.translateWeb_cancelButton.attr('data-disabled', true);
            $widget.translateWeb_sendMessageToIframe({ "message": "untranslate" });
        });

        // restore translated page to original
        $widget.translateWeb_restoreButton.click(function () {
            $widget.translateWeb_restoreButton.attr('data-disabled', true);
            $widget.translateWeb_sendMessageToIframe({ "message": "untranslate" });
        });

        // handle messages received from iframe
        window.removeEventListener("message", $widget.translateWeb_initIframeMsg);
        window.addEventListener("message", $widget.translateWeb_initIframeMsg, false);

        $widget.translateWeb_IframeLastScrollWidth = null;
        $widget.translateWeb_IframeLastScrollHeight = null;
        $widget.translateWeb_resizeLayout();

        $widget.settings._onWidgetLoaded = function () {
            // load translation page in iframe
            window.open($widget.settings._websiteTranslationUrl, "websiteFrame");
        };
    },

    translateWeb_initIframeMsg: function (event) {
        if ($widget.settings._debug) {
            console.info("Message received from iframe:" + JSON.stringify(event.data));
        }

        if (event.data && event.data.message) {
            switch (event.data.message) {
                case "ready":
                    // when system is changed in UI, inform  translate widget in iframe
                    $widget.onSystemChangedHandlers.push(function (systemId) {
                        if ($widget.translateWeb_systemSuggestedByIframe == systemId) {
                            //if system change was initiated by iframe, don't loop the event back to iframe
                            $widget.translateWeb_systemSuggestedByIframe = null;
                        } else {
                            $widget.translateWeb_sendMessageToIframe({ "message": "changeSystem", "systemId": $widget.activeSystemId });
                        }
                    });

                    // push system list to iframe when it is changed
                    $widget.onSystemListLoadedHandlers.push(function (systemList) {
                        var data = [];
                        for (var i = 0; i < systemList.length; i++) {
                            data.push({ "id": systemList[i].ID, "sourceLanguage": systemList[i].SourceLanguage.Code, "targetLanguage": systemList[i].TargetLanguage.Code, "name": systemList[i].Title ? systemList[i].Title.Text : systemList[i].ID, "order": i });
                        }

                        $widget.translateWeb_sendMessageToIframe({ "message": "setSystemList", "systemList": data });
                    });

                    // push system list to iframe
                    var data = [];
                    var systemList = $widget.settings._systems;
                    if (systemList != null) {
                        for (var i = 0; i < systemList.length; i++) {
                            data.push({ "id": systemList[i].ID, "sourceLanguage": systemList[i].SourceLanguage.Code, "targetLanguage": systemList[i].TargetLanguage.Code, "name": systemList[i].Title ? systemList[i].Title.Text : systemList[i].ID, "order": i });
                        }
                    }

                    $widget.settingSystemListForFirstTime = true;
                    $widget.translateWeb_sendMessageToIframe({ "message": "setSystemList", "systemList": data });

                    $("input.url").blur().focus();//autofocus has stopped working in Chrome
                    break;
                case "urlLoaded":
                    // webpage finished loading, set the full url in address box
                    $widget.translateWeb_Url.val(event.data.url);
                    $widget.translateWeb_translateButton.removeClass("hide");
                    $widget.translateWeb_translateButton.attr('data-disabled', false);
                    break;
                case "startedLoading":
                    // show spinner
                    $widget.translateWeb_spinner.removeClass("hide");
                    $widget.translateWeb_cancelButton.addClass("hide");
                    $widget.translateWeb_restoreButton.addClass("hide");
                    $widget.translateWeb_translateButton.addClass("hide");
                    break;
                case "stoppedLoading":
                    if (!$widget.translateWeb_translating) {
                        // if not translating right after page load
                        $widget.enableSystemChange();
                        $widget.translateWeb_cancelButton.addClass("hide");
                        $widget.translateWeb_restoreButton.addClass("hide");
                        $widget.translateWeb_translateButton.removeClass("hide");
                        $widget.translateWeb_translateButton.attr('data-disabled', false);
                        $widget.translateWeb_spinner.addClass("hide");
                    }
                    break;
                case "systemChanged":

                    // set default system, right after web translation widget in iframe is loaded
                    if ($widget.settingSystemListForFirstTime) {
                        $widget.settingSystemListForFirstTime = false;
                        $widget.translateWeb_sendMessageToIframe({ "message": "changeSystem", "systemId": $widget.activeSystemId });
                    } else {
                        // if initiated by language of the loaded webpage being different
                        // than source language of currently selected  system
                        // we should change the system in UI and warn the user about the fact
                        if (event.data.auto && event.data.changed) {
                            if ($widget.settings._webLangAutodetect) {
                                $widget.translateWeb_systemSuggestedByIframe = event.data.systemId;
                                $widget.setActiveSystem(event.data.systemId);

                                // one of those must exist
                                $('.translateSourceLangContainer .fancy-select .trigger', $widget.settings.container).addClass("attention");
                                $('.translateSourceLangContainer .translateSingleSourceLang', $widget.settings.container).addClass("attention");
                                $('.translateSystemContainer .fancy-select .trigger', $widget.settings.container).addClass("attention");

                                setTimeout(function () {
                                    $('.translateSourceLangContainer .fancy-select .trigger', $widget.settings.container).removeClass("attention");
                                    $('.translateSourceLangContainer .translateSingleSourceLang', $widget.settings.container).removeClass("attention");
                                    $('.translateSystemContainer .fancy-select .trigger', $widget.settings.container).removeClass("attention");
                                }, 5000);
                            }
                            else {
                                $widget.translateWeb_systemSuggestedByIframe = $widget.activeSystemId;
                                $widget.translateWeb_sendMessageToIframe({ "message": "changeSystem", "systemId": $widget.activeSystemId });
                            }
                        }
                    }

                    break;
                case "translationStarted":
                    // disable system change, show cancel button
                    $widget.disableSystemChange();
                    $widget.translateWeb_translateButton.addClass("hide");
                    $widget.translateWeb_cancelButton.removeClass("hide");
                    $widget.translateWeb_cancelButton.attr('data-disabled', false);
                    $widget.translateWeb_spinner.removeClass("hide");
                    $widget.translateWeb_translating = true;
                    break;
                case "translationStopped":
                    $widget.translateWeb_translating = false;
                    $widget.translateWeb_spinner.addClass("hide");
                    break;
                case "translated":
                    // show restore button
                    $widget.translateWeb_cancelButton.addClass("hide");
                    $widget.translateWeb_restoreButton.removeClass("hide");
                    $widget.translateWeb_restoreButton.attr('data-disabled', false);
                    break;
                case "untranslated":
                    // enable system change, show translate button
                    $widget.enableSystemChange();
                    $widget.translateWeb_cancelButton.addClass("hide");
                    $widget.translateWeb_restoreButton.addClass("hide");
                    $widget.translateWeb_translateButton.removeClass("hide");
                    $widget.translateWeb_translateButton.attr('data-disabled', false);
                    break;
                case "error":
                    // enable system change, show translate button
                    $widget.enableSystemChange();
                    $widget.translateWeb_cancelButton.addClass("hide");
                    $widget.translateWeb_restoreButton.addClass("hide");
                    $widget.translateWeb_translateButton.removeClass("hide");
                    $widget.translateWeb_translateButton.attr('data-disabled', false);
                    if (console) {
                        console.error(event.data.description);
                    }
                    if (!event.data.shownInUI) {
                        // check wake up case
                        if (event.data.description.indexOf("system is starting") !== -1) {
                            if ($widget.showSystemWaking && typeof ($widget.showSystemWaking) === "function") {
                                $widget.showSystemWaking(false);
                            }
                            else {
                                alert(event.data.description);
                            }
                        }
                        else {
                            alert(event.data.description);
                        }
                    }
                    break;
                case "warning":
                    if (console) {
                        console.warn(event.data.description);
                    }
                    break;
                default:
                    break;
            }
        }
    },

    translateWeb_loadUrl: function () {
        $widget.translateWeb_sendMessageToIframe({ "message": "loadUrl", "url": $widget.translateWeb_Url.val(), "translateAfterLoad": false });

        // enable system change (if url changed in address box, but not if user clicked on link)
        $widget.enableSystemChange();

        // callback
        if ($widget.settings._onWebTranslateUrlLoaded && typeof ($widget.settings._onWebTranslateUrlLoaded) === "function") {
            $widget.settings._onWebTranslateUrlLoaded($widget.translateWeb_Url.val());
        }
    },

    translateWeb_sendMessageToIframe: function (message) {
        if ($widget.settings._debug) {
            console.info("Message sent to iframe:" + JSON.stringify(message));
        }

        // RL
        // $widget.translateWeb_Iframe.contentWindow.postMessage(
        // message,
        // $widget.translateWeb_IframeSchemaPortDomain);
        
        try {
            $widget.translateWeb_Iframe.contentWindow.postMessage( message, $widget.translateWeb_IframeSchemaPortDomain);
        }
        catch (err) {
            // console.log(err);
        }
        // / RL
    },

    translateWeb_resizeLayout: function () {
        // resize iframe to fit content on small screens and make iframe static
        // so that whole screen can be used for scrolling/zooming (scrolling the header away)
        if (window.innerWidth < $.fn.getDefaultFontSize()[0] * 50 || window.innerHeight < $.fn.getDefaultFontSize()[1] * 30) {
            if ($widget.translateWeb_Iframe.contentWindow && $widget.translateWeb_Iframe.contentWindow.document && $widget.translateWeb_Iframe.contentWindow.document.body) {
                if ($widget.translateWeb_IframeLastScrollWidth != $widget.translateWeb_Iframe.contentWindow.document.body.scrollWidth
                    || $widget.translateWeb_IframeLastScrollHeight != $widget.translateWeb_Iframe.contentWindow.document.body.scrollHeight) {
                    $widget.translateWeb_IframeLastScrollWidth = $widget.translateWeb_Iframe.contentWindow.document.body.scrollWidth;
                    $widget.translateWeb_IframeContainer.width($widget.translateWeb_IframeLastScrollWidth);
                    $widget.translateWeb_IframeLastScrollHeight = $widget.translateWeb_Iframe.contentWindow.document.body.scrollHeight;
                    $widget.translateWeb_IframeContainer.height($widget.translateWeb_IframeLastScrollHeight);
                }
            } else {
                $widget.translateWeb_IframeContainer.css("height", "");
                $widget.translateWeb_IframeContainer.css("width", "");
                $widget.translateWeb_IframeLastScrollWidth = null;
                $widget.translateWeb_IframeLastScrollHeight = null;
            }
            $widget.translateWeb_IframeContainer.css("position", "static");
        } else if (typeof $widget.translateWeb_IframeContainer !== "undefined") {
            $widget.translateWeb_IframeContainer.css("height", "");
            $widget.translateWeb_IframeContainer.css("width", "");
            $widget.translateWeb_IframeContainer.css("position", "");
        }
        window.setTimeout($widget.translateWeb_resizeLayout, 100);
    }
});

// RL
// Tilde.TranslatorWidget.prototype.pluginInitializers.push(Tilde.TranslatorWidget.prototype.webPluginInit);
// / RL