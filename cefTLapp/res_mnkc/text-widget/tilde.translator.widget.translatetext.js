/* tilde.translator.widget.TRANSLATETEXT.js */

$.extend(Tilde.TranslatorWidgetDefaultOptions, {
    _translationUrl: 'https://letsmt.eu/ws/Service.svc/json/Translate',
    _updateTranslationUrl: 'https://letsmt.eu/ws/Service.svc/json/UpdateTranslation',
    _dictionaryUrl: 'https://yoursite/api/ajax/GetDictionaryEntry',
    _ttsUrl: 'https://yoursite/TTS/GetSound',
    _textSource: '.translateTextSource', // source container <textarea>
    _textResult: '.translateTextResult', // target container <div>
    _landingView: false, // intro box with tooltip
    _enableParallelHover: true, // enable translation and source paralel hover
    _highlightTranslated: true, // toggle latest translation highlight in source and target
    _highlightTranslatedTimeout: 1500, // time in milissecond for highlight
    _focusAfterClear: true, // source field focus after clear
    _focusAfterTranslate: true, // source field focus after translation
    _focusAfterLoad: false, // source field focus after widget is loaded
    _translateAll: false, // allways translate all text (when?)
    _translationLimit: -1, // sentence count to translate. if -1 then no limit
    _useDictionary: false, // use dictionary when translating one word
    _useSpeakers: false, // use latvian tts
    _onTranslationStarted: null,
    _onTranslationFinished: null,
    _onUrlEntered: null,
    _onTextInput: null, // delayd event fired on user input
    _onScrollBarWidthChanged: null, // fired when scrollbar appears or disappears for source textarea
    _text: null //default text
});

$.extend(Tilde.TranslatorWidget.prototype, {
    textTranslator: null,
    translatedCnt: 0,
    hoveredElements: [],

    textPluginInit: function () {

        if ($('.translateTextSource', $widget.settings.container).length === 0)
            return;

        if ($widget.settings._focusAfterLoad) {
            // sets the focus to input textarea, while still showing the "Enter the text you want to translate" message
            $($widget.settings._textSource, $widget.settings.container).focus();
        }

        $widget.textPluginEvents();

        // intro box
        if ($widget.settings._landingView) {
            $('.fakeCursor', $widget.settings.container).removeClass('hide');
            $('.translateContainerRight', $widget.settings.container).addClass('hide');
            $('.translateContainerLeft, .translateContainerHeader', $widget.settings.container).addClass('intro');
        }

        // parallel hover
        if ($widget.settings._enableParallelHover) {
            $widget.textPluginInitParallelHover();
        }

        $widget.textTranslator = new Tilde.TextTranslator($.extend(
            $widget.settings
        ));

        if ($widget.settings._text) {
            $($widget.settings._textSource, $widget.settings.container).text($widget.settings._text);
            $($widget.settings._textSource, $widget.settings.container).trigger('paste');
        }
        else {
            $widget.textPluginSetTempText();
        }

        $widget.onSystemChangedHandlers.push(function () {
            $(".translateTextSource", $widget.settings.container).attr("lang", $widget.getActiveSystemObj().SourceLanguage.Code);
            $(".backGroundSource", $widget.settings.container).attr("lang", $widget.getActiveSystemObj().SourceLanguage.Code);
            $(".translateTextResult", $widget.settings.container).attr("lang", $widget.getActiveSystemObj().TargetLanguage.Code);
        });

        $widget.onSystemChangedHandlers.push($widget.textPluginTranslate);
        if (typeof ($widget.termCorpusChangedHandlers) !== "undefined") {
            $widget.termCorpusChangedHandlers.push($widget.textPluginTranslate);
        }

        $('.editButton', $widget.settings.container).click(function () {
            //disable keyboard focus for background elements
            $.each($("input,select,a,textarea"), function (index, focusableElement) {
                jQueryFocusableElement = $(focusableElement);
                jQueryFocusableElement.data("old-tab-index", jQueryFocusableElement.attr("tabindex"));
                jQueryFocusableElement.attr("tabindex", "-1");
            });
            if ($(".translateTextResult .selected", $widget.settings.container).length == 0) {
                //select first sentence if none is selected
                $(".translateTextResult p .sentence", $widget.settings.container).first().addClass("selected");
                $(".backGroundSource div .sentence", $widget.settings.container).first().addClass("selected");
            }

            var originalText = $(".backGroundSource .selected", $widget.settings.container).text();
            var translation = $(".translateTextResult .selected", $widget.settings.container).text();

            //draw the form
            $("body").append($("<div></div>", { "id": "translationEditBackground" }));
            var form = $("<div></div>", { "id": "translationEditForm", "class": "form" });
            $("body").append(form);
            form.append($("<a></a>", {"href":"javascript:;", id:"translationEditClose", "title": uiResources[$widget.settings._language]['translationEditClose']}));
            form.append($("<label></label>").text(uiResources[$widget.settings._language]['translationEditOriginal']));
            form.append($("<p>", { "id": "translationEditOriginal" }).text(originalText));
            form.append($("<label></label>", {"for": "translationEditTranslation"}).text(uiResources[$widget.settings._language]['translationEditTranslation']));
            textarea = $("<textarea></textarea>", { "id": "translationEditTranslation", "autofocus" : "autofocus", "maxlength" : "5000" }).val(translation);
            form.append(textarea);
            form.append($("<div></div>", {"id": "translationEditDescription"}).text(uiResources[$widget.settings._language]['translationEditDescription']));
            form.append($('<div class="translateProgress progress hide"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'));
            var buttons = $("<div></div>", { "id": "translationEditButtons" });
            form.append(buttons);
            buttons.append($("<a></a>", { "class": "button", "id": "translationEditBack", "href": "javascript:;" }).text("◄"));
            buttons.append($("<a></a>", {"class":"button", "id": "translationEditSave", "href": "javascript:;"}).text(uiResources[$widget.settings._language]['translationEditSave']));
            buttons.append($("<a></a>", { "class": "button", "id": "translationEditForward", "href": "javascript:;" }).text("►"));
            

            $widget.resizeEditForm();
            
            $(window).on("keydown.translationEditForm", function (event) {
                if (event.which == 27) {
                    $("#translationEditClose").trigger("click");
                }
            });

            $("#translationEditClose").click(function () {
                if ($(this).is("[disabled]")) {
                    event.preventDefault();
                    return;
                }

                $(window).off("keydown.translatioEditForm");

                $("#translationEditForm").remove();
                $("#translationEditBackground").remove();

                //restore keyboard focus to background elements
                $.each($("input,select,a,textarea"), function (index, focusableElement) {
                    jQueryFocusableElement = $(focusableElement);
                    if (typeof (jQueryFocusableElement.data("old-tab-index")) == "undefined") {
                        jQueryFocusableElement.removeAttr("tabindex");
                    } else {
                        jQueryFocusableElement.attr("tabindex", jQueryFocusableElement.data("old-tab-index"));
                    }
                });
            });

            $("#translationEditBack").click(function () {
                var originalSentences = $(".backGroundSource .sentence", $widget.settings.container);
                var translationSentences = $(".translateTextResult .sentence", $widget.settings.container);
                var selectedTranslation = $(".translateTextResult .sentence.selected", $widget.settings.container);
                var selectedSentenceIndex = -1;
                for (var i = 0; i < translationSentences.length; i++) {
                    if (translationSentences[i] == selectedTranslation[0]) {
                        selectedSentenceIndex = i;
                        break;
                    }
                }

                $(originalSentences[selectedSentenceIndex]).removeClass("selected");
                $(translationSentences[selectedSentenceIndex]).removeClass("selected");
                var previousSentenceIndex = selectedSentenceIndex > 0 ? selectedSentenceIndex - 1 : selectedSentenceIndex;
                $(originalSentences[previousSentenceIndex]).addClass("selected");
                $(translationSentences[previousSentenceIndex]).addClass("selected");

                $("#translationEditOriginal").text($(originalSentences[previousSentenceIndex]).text());
                $("#translationEditTranslation").val($(translationSentences[previousSentenceIndex]).text());

                $widget.resizeEditForm();
            });

            $("#translationEditForward").click(function () {
                var originalSentences = $(".backGroundSource .sentence", $widget.settings.container);
                var translationSentences = $(".translateTextResult .sentence", $widget.settings.container);
                var selectedTranslation = $(".translateTextResult .sentence.selected", $widget.settings.container);
                var selectedSentenceIndex = -1;
                for (var i = 0; i < translationSentences.length; i++) {
                    if (translationSentences[i] == selectedTranslation[0]) {
                        selectedSentenceIndex = i;
                        break;
                    }
                }

                $(originalSentences[selectedSentenceIndex]).removeClass("selected");
                $(translationSentences[selectedSentenceIndex]).removeClass("selected");
                var nextSentenceIndex = selectedSentenceIndex < translationSentences.length - 1 ? selectedSentenceIndex + 1 : selectedSentenceIndex;
                $(originalSentences[nextSentenceIndex]).addClass("selected");
                $(translationSentences[nextSentenceIndex]).addClass("selected");

                $("#translationEditOriginal").text($(originalSentences[nextSentenceIndex]).text());
                $("#translationEditTranslation").val($(translationSentences[nextSentenceIndex]).text());

                $widget.resizeEditForm();
            });

            $("#translationEditSave").click(function () {
                $("#translationEditButtons").addClass("hide")
                $("#translationEditForm .translateProgress").removeClass("hide");
                
                $.ajax({
                        url: $widget.settings._updateTranslationUrl,
                        headers: $widget.getAuthHeaders(),
                        method: "POST",
                        dataType: 'text',
                        type: 'GET',
                        contentType: 'application/json',
                        data: JSON.stringify({
                                appID: $widget.settings._appId,
                                systemID: $widget.activeSystemId,
                                text: $("#translationEditOriginal").text(),
                                translation: $("#translationEditTranslation").val(),
                                options: "suggestion"}),
                        success: function () {
                            $(".translateTextResult .sentence.selected", $widget.settings.container).text($("#translationEditTranslation").val());
                            $("#translationEditClose").trigger("click");
                        },
                        error: function (e) {
                            $("#translationEditButtons").removeClass("hide")
                            $("#translationEditForm .translateProgress").addClass("hide");
                            if (typeof (console) !== 'undefined') {
                                console.error(e);
                            }
                        }
                });
            });

            $("#translationEditTranslation").focus();
        });

        if (typeof ($widget.onSystemWokenUpHandlers) !== 'undefined') {
            $widget.onSystemWokenUpHandlers.push(function () {
                $widget.textTranslator.doTranslation({ translateAll: true });
            });
        }
    },

    resizeEditForm: function () {
        var form = $("#translationEditForm");
        var textarea = $("#translationEditForm textarea");
        // make sure scroll height is calculated
        textarea.height(0);

        // then make it as large as srollbar suggests
        var height = textarea[0].scrollHeight;

        if (navigator.userAgent.indexOf("Trident") > 0
            || navigator.userAgent.indexOf("MSIE") > 0
            || navigator.userAgent.indexOf("Chrome") > 0) {
            // add broder height for IE and Chrome
            height += textarea.outerHeight() - textarea.innerHeight();
        } else {
            // add border&padding for Firefox and all other 
            // (but maybe all other should be treated as Chrome&IE, not sure yet)
            // this is currently default option because it makes textarea larger,
            // which is less bad than smaller
            height += textarea.outerHeight() - textarea.height();
        }
        textarea.css("height", height + "px");
        var contentHeight = 0;
        $.each(form.children(), function (index, element) {
            if (!$(element).hasClass("hide") && $(element).attr("id") != "translationEditClose") {
                contentHeight += $(element).outerHeight(true);
            }
        });

        form.css("height", contentHeight + "px");
        form.css("top", "calc(50% - " + (contentHeight / 2) + "px)");
    },

    textPluginUnload: function () {
        if ($widget.textTranslator) {
            $widget.textTranslator.clearTranslation();
        }
    },

    textPluginEvents: function () {
        var focusEvents = "click";
        if (navigator.userAgent.indexOf("Android") > -1 && navigator.userAgent.indexOf("Version/") > -1) {
            // Android browser won't allow to scroll a textarea unless it is focused
            focusEvents += " touchstart";
        }

        $('.translateButton', $widget.settings.container).on('click', function () {
            if ($(this).attr('data-disabled') === 'true') {
                return false;
            }
            $widget.textPluginTranslate();
        });

        $('.translateResultClear').on('click', function () {
            $widget.textPluginResultClear();
        });

        $('.sourceSpeak').on('click', function () {
            $widget.textPluginSpeak('sourceAudio', $('.translateTextSource', $widget.settings.container).val());
        });

        $('.targetSpeak').on('click', function () {
            $widget.textPluginSpeak('targetAudio', $('.translateTextResult', $widget.settings.container).text());
        });

        $('.translateTextSourceContainer', $widget.settings.container).bind(focusEvents, function () {
            if ($('.translateTextTempSourceContainer').attr('data-disabled') === 'true') {
                return false;
            }
            $($widget.settings._textSource, $widget.settings.container).focus();
        });

        $($widget.settings._textSource, $widget.settings.container).bind('focusout', $.proxy(function () {
            if ($($widget.settings._textSource, $widget.settings.container).val() == '') {
                $widget.textPluginSetTempText();
            }
        }, this));

        $widget.settings._onTranslationStarted = function () {
            $widget.textPluginTranslationStarted();
        }
        $widget.settings._onTranslationFinished = function () {
            $widget.textPluginTranslationFinished();
        }

        if ($widget.settings._enableParallelHover) {
            $(".translateTextSource").on("mousemove mouseleave", function (event) {
                //emulate moseenter and mouseleave on invisible background elements
                //that can't normally get mouse event because they are covered by the textbox
                var hoveredElements = [];
                var hoveredParagraph = null;

                $.each($(".backGroundSource").find(".classMTsource"), function (index, element) {
                    var boundRectangles = element.getClientRects();
                    for (var rectIndex = 0; rectIndex < boundRectangles.length; rectIndex++) {
                        var boundRectangle = boundRectangles[rectIndex];
                        if (event.clientX >= boundRectangle.left && event.clientY >= boundRectangle.top && event.clientX <= boundRectangle.right && event.clientY <= boundRectangle.bottom) {
                            hoveredParagraph = element;
                            return false;
                        }
                    }
                });

                if (hoveredParagraph != null) {
                    $.each($(hoveredParagraph).find("span"), function (index, element) {
                        var boundRectangles = element.getClientRects();
                        for (var rectIndex = 0; rectIndex < boundRectangles.length; rectIndex++) {
                            var boundRectangle = boundRectangles[rectIndex];
                            if (event.clientX >= boundRectangle.left && event.clientY >= boundRectangle.top && event.clientX <= boundRectangle.right && event.clientY <= boundRectangle.bottom) {
                                hoveredElements.push(element);
                            }
                        }
                    });
                }
                for (var oldIndex = 0; oldIndex < $widget.hoveredElements.length; oldIndex++) {
                    var oldElement = $widget.hoveredElements[oldIndex];
                    if (-1 == $.inArray(oldElement, hoveredElements)) {
                        $(oldElement).trigger("mouseleave");
                    }
                }
                for (var newIndex = 0; newIndex < hoveredElements.length; newIndex++) {
                    var newElement = hoveredElements[newIndex];
                    if (-1 == $.inArray(newElement, $widget.hoveredElements)) {
                        $(newElement).trigger("mouseenter");
                    }
                }
                $widget.hoveredElements = hoveredElements;
            });
        }
    },

    textPluginTranslationStarted: function () {
        $($widget.settings._textResult, $widget.settings.container).removeClass('translateTextTemp');
        $('.translateProgress', this.settings.container).removeClass('hide');
    },

    textPluginTranslationFinished: function () {
        $('.translateProgress', $widget.settings.container).addClass('hide');

        if ($($widget.settings._textSource).length !== 0 && $($widget.settings._textSource).val().length == 0) {
            $widget.textPluginSetTempTextResult();
        }
    },

    textPluginResultClear: function () {
        $widget.translatedCnt = 0;
        $widget.textPluginSetTempText();

        if ($widget.settings._focusAfterClear) {
            $($widget.settings._textSource, $widget.settings.container).focus()
        }

        $('.translateResultClear').addClass('hide');
    },

    textPluginInitParallelHover: function () {
        var sourceScrolled = function () {
            var backgroundSource = $('.backGroundSource')[0];
            var translateTextSource = $('.translateTextSource')[0];

            if (backgroundSource.scrollTop != translateTextSource.scrollTop) {
                backgroundSource.scrollTop = translateTextSource.scrollTop;
            }

            if (!window.Tilde.targetScrollingTime || new Date().getTime() - window.Tilde.targetScrollingTime > 200) {
                var translateTextResult = $('.translateTextResult')[0];
                if (translateTextResult.scrollTop != translateTextSource.scrollTop) {
                    window.Tilde.sourceScrollingTime = new Date().getTime();
                    translateTextResult.scrollTop = translateTextSource.scrollTop;
                }
            }
        };

        var targetScrolled = function () {
            var translateTextSource = $('.translateTextSource');

            if (navigator.userAgent.indexOf("Android") > -1 && navigator.userAgent.indexOf("Version/") > -1) {
                if (document.activeElement != null && document.activeElement != document && document.activeElement != document.body /*translateTextSource.is(":focus")*/) {
                    // android browser bug
                    // scroll event keeps repeating when any input control is focused
                    return;
                }
            }

            if (!window.Tilde.sourceScrollingTime || new Date().getTime() - window.Tilde.sourceScrollingTime > 200) {
                if (translateTextSource[0].scrollTop != this.scrollTop) {
                    window.Tilde.targetScrollingTime = new Date().getTime();
                    translateTextSource[0].scrollTop = this.scrollTop;
                }
            }
        };

        var windowsPhoneVersion = /.*Windows Phone (\d.\d).*/.exec(navigator.userAgent);
        if (windowsPhoneVersion && windowsPhoneVersion.length && windowsPhoneVersion.length > 1 && windowsPhoneVersion[1] <= '8.0') {
            // not sure why, but on windows phone (8) scroling is halted
            // if in left panel scroll event you try to scroll the right panel
            // (even if the right panel then does not try to scroll the left panel back (which could form a loop))
            // I was unable to find a working solution, 
            // so, disabled scroll synchronisation for windows phone 8.0 and older

            // background highlighting under textarea also disabled for old windows phones
            // since line height for scrollbar and normal div does not match there
        } else {
            $('.translateTextSource').on('scroll', sourceScrolled);
            $('.translateTextResult').on('scroll', targetScrolled);
            if (navigator.userAgent.indexOf("Android") > -1 && navigator.userAgent.indexOf("Version/") > -1) {
                $('.translateContainerRight').bind('touchstart', function () { $(':focus').blur(); });
            }

            $('.translateTextResult').on('mouseenter mouseleave', '.mt-translation', function (e) {
                $('.hoverStyleSource').removeClass('hoverStyleSource');
                $('.mt-translation.hover').removeClass('hover');

                if (e.type === 'mouseenter') {
                    $(this).addClass('hover');
                    $('.classMTsource[cursorId="' + $(this).attr('cursorId') + '"]').addClass('hoverStyleSource');
                }
            });
        }
    },

    textPluginTranslate: function () {
        if ($widget.settings._onUrlEntered) {
            $widget.textTranslator.checkTextForUrl();
        }
        
        if ($widget.textTranslator) {
            $widget.textTranslator.doTranslation({ translateAll: true });
        }
    },

    textPluginSetTempText: function () {
        if ($widget.textTranslator) {
            $widget.textTranslator.clearTranslation();
        }
        $widget.textPluginSetTempTextResult();
        $widget.textPluginSetTempTextSource();

        $($widget.settings._textResult, $widget.settings.container).removeClass('transLimit');

        $('.sourceLang, .targetLang', $widget.settings.container).text('');
        $('.translateResultClear', $widget.settings.container).addClass('hide');
        $('.translateProgress', $widget.settings.container).addClass('hide');
        if ($widget.settings._useSpeakers) {
            $('.sourceSpeak, .targetSpeak', $widget.settings.container).addClass('hide');
        }
    },

    textPluginSetTempTextSource: function () {
        $($widget.settings._textSource, $widget.settings.container).val('');
        
        // show blink cursor
        if ($widget.settings._landingView) {
            $('.intro .fakeCursor', $widget.settings.container).removeClass('hide');
        }

        $('.translateTextTempSourceContainer', $widget.settings.container).removeClass('hide');
        $('.translateTextTempSourceContainer', $widget.settings.container).html(uiResources[$widget.settings._language]['sourceTextTooltip']);
        $('.translateTextTempSourceContainer', $widget.settings.container).unbind('focus');
        $('.translateTextTempSourceContainer', $widget.settings.container).bind('focus', function () {
            $('.translateTextTempSourceContainer', $widget.settings.container).addClass('hide');
        });

        $($widget.settings._textSource, $widget.settings.container).unbind('focus');
        $($widget.settings._textSource, $widget.settings.container).bind('focus', function () {

            // hide blink cursor
            if ($widget.settings._landingView) {
                $('.intro .fakeCursor', $widget.settings.container).addClass('hide');
            }

            $('.translateTextTempSourceContainer', $widget.settings.container).addClass('hide');
        });
    },

    textPluginSetTempTextResult: function () {
        $($widget.settings._textResult, $widget.settings.container).addClass('translateTextTemp');
        var txt = uiResources[$widget.settings._language]['targetTextTooltip'];

        if ($widget.settings._systemSelectType === 'domain') {
            var domain = $('.translateDomain option:selected', $widget.settings.container).text(),
                descr = uiResources[$widget.settings._language]['DOMAIN_' + domain.toUpperCase()];

            if (descr !== undefined) {
                txt = descr + '<p>' + txt + '</p>';
            }
        }

        $($widget.settings._textResult, $widget.settings.container).html(txt).removeClass('noNetwork');
    },

    textPluginSpeak: function (el, text) {
        $('audio[id="' + el + '"] source').attr('src', $widget.settings._ttsUrl + '?text=' + text.substring(0, 144));
        var audio = document.getElementById(el);
        if (audio.paused)
        {
            audio.load();
            audio.play();
        } else {
            audio.pause();
        }
    }

});

// RL
// Tilde.TranslatorWidget.prototype.pluginInitializers.push(Tilde.TranslatorWidget.prototype.textPluginInit);
// / RL

Tilde.TextTranslator = function (options) { this.init(options); };
Tilde.TextTranslator.prototype = {
    options: null,
    pta: null,
    timeoutParagraph: null,
    timeoutText: null,
    translationInProgress: false,

    init: function (options) {
        if (typeof (options) == 'undefined') {
            alert('no options specified for "Tilde.TextTranslator"');
        }

        this.options = options;

        var optionsTA = new Tilde.ProgressiveTextAreaOptions();

        optionsTA.directCompare = false;

        optionsTA.textAreaSelector = options._textSource;

        optionsTA.onNewParagraph = $.proxy(this.onNewParagraph, this);
        optionsTA.onTextChanged = $.proxy(this.onTextChanged, this);
        optionsTA.onTextInput = $.proxy(this.onTextInput, this);
        
        if (this.options._focusAfterLoad) {
            optionsTA.onTextChangedWithoutDelay = $.proxy(function () {
                // hide input hint as soon as user starts typing
                // (normally it is hidden when focusing input area,
                // but it can be visible when if textarea was focused automatically when page was loaded)
                if ($(this.options._textSource).val().length > 0) {
                    $('.translateTextTempSourceContainer', this.options.container).addClass('hide');
                }
            }, this);
        }

        if (this.options._onScrollBarWidthChanged)
        {
            $(window).resize(this.checkScrollbarWidth);
            var me = this;

            if (optionsTA.onTextChangedWithoutDelay) {
                var existingEventHandler = optionsTA.onTextChangedWithoutDelay;
                optionsTA.onTextChangedWithoutDelay = $.proxy(function () {
                    existingEventHandler();
                    window.setTimeout(me.checkScrollbarWidth, 0); // give it time to understand if it has a scrollbar
                }, this);
            }
        }

        optionsTA.onBackgroundHover = this.options.onBackgroundHover;

        this.pta = new Tilde.ProgressiveTextArea(optionsTA);
    },

    setSystem: function (system) {
        this.options.translatorSystem = system;
    },

    setTargetText: function (str) {
        $(this.options._textResult).html(str);
    },

    clearTranslation: function () {
        this.setSourceText('');
    },

    onNewParagraph: function () {
        if (typeof (this.timeoutParagraph) !== 'undefined' && this.timeoutParagraph != null) {
            clearTimeout(this.timeoutParagraph);
            this.timeoutParagraph = null;
        }
        if (typeof (this.timeoutText) !== 'undefined' && this.timeoutText != null) {
            clearTimeout(this.timeoutText);
            this.timeoutText = null;
        }

        $.proxy(this.onNewParagraphWork, this)();
    },

    onTextChanged: function () {
        if (typeof (this.timeoutText) !== 'undefined' && this.timeoutText != null) {
            clearTimeout(this.timeoutText);
            this.timeoutText = null;
        }

        this.timeoutText = setTimeout($.proxy(this.onNewParagraphWork, this), 250);
    },

    onTextInput: function (event) {
        if (this.options._onTextInput) {
            this.options._onTextInput(event);
        }
    },

    onBackgroundHover: function (id, afterId) {
        var cursor = this.obj;
        var parent = typeof (id) === 'undefined' ? $('.backGroundSource').html('') : null;
        do {
            if (cursor == null) {
                //an extra blank line at the end. or IE 11 won't scroll far enough
                $('.backGroundSource').append($("<br/>"));
                break;
            }
            else {
                if (typeof (id) === 'undefined' || cursor.id == id) {
                    var text = cursor.string;
                    var sourceHtml = null;
                    if (typeof (id) === 'undefined') {
                        sourceHtml = $('<div></div>', { 'id': 'source-mt-' + cursor.id, 'cursorId': cursor.id, 'class': 'classMTsource' + (cursor.latest ? ' latestHighlight' : '') });
                        sourceHtml.appendTo(parent);
                    } else {
                        sourceHtml = $("#source-mt-" + id);
                        if (sourceHtml.length == 0) {
                            sourceHtml = $('<div></div>', { 'id': 'source-mt-' + cursor.id, 'cursorId': cursor.id, 'class': 'classMTsource' + (cursor.latest ? ' latestHighlight' : '') });
                            if (afterId) {
                                sourceHtml.insertAfter($("#source-mt-" + afterId));
                            } else {
                                sourceHtml.appendTo($('.backGroundSource'));
                            }
                        }
                        sourceHtml.empty();
                    }
                    if (text.replace(/\s/g, '').length == 0) {
                        sourceHtml.html('<br />');
                    } else {
                        var translationData = cursor.translation;
                        if ($widget.settings._enableParallelHover
                            && translationData
                            && translationData.originalSentenceRanges
                            && translationData.sourceWordRanges
                            && translationData.phraseAlignment
                            && translationData.confidentWordAlignment) {
                            $widget.textTranslator.drawSentencePhraseWordTags(sourceHtml, text, cursor.id, translationData.sourceWordRanges, translationData.originalSentenceRanges, translationData.phraseAlignment, translationData.confidentWordAlignment, 0);
                        } else {
                            sourceHtml.text(text);
                        }
                    }
                }
                cursor = cursor.child;
            }
        } while (true);
        $('.translateTextSource').trigger('scroll');
    },

    clearAlltimeouts: function () {
        if (typeof (this.timeoutText) !== 'undefined' && this.timeoutText != null) {
            clearTimeout(this.timeoutText);
            this.timeoutText = null;
        }
        if (typeof (this.timeoutParagraph) !== 'undefined' && this.timeoutParagraph != null) {
            clearTimeout(this.timeoutParagraph);
            this.timeoutParagraph = null;
        }
    },

    onNewParagraphWork: function () {
        var cursor = this.pta.obj;
        do {
            if (cursor.changed) {
                cursor.translation = cursor.string;
                cursor.changed = false;
                cursor.translated = false;
                if (cursor.translating) {
                    cursor.retranslate = true;
                }
            }
            else {
                cursor = cursor.child;
                if (cursor == null)
                    break;
            }
        } while (true);

        this.redrawResult();

        if ($widget.settings._onUrlEntered) {
            $widget.textTranslator.checkTextForUrl();
        }

        this.doTranslation({ translateAll: $widget.settings._translateAll });
    },

    previousScrollBarWidth: 0,

    checkScrollbarWidth: function () {
        var textarea = $($widget.settings._textSource)[0];
        if (textarea !== undefined) {
            var scrollbarWidth = textarea.offsetWidth - textarea.clientWidth;
            if (this.previousScrollBarWidth != scrollbarWidth) {
                // must re-align also background, but a bit later, when it surely is filled with data
                window.setTimeout(function () { $('.translateTextSource').trigger('scroll'); }, 50);
                $widget.settings._onScrollBarWidthChanged(scrollbarWidth);
                this.previousScrollBarWidth = scrollbarWidth;
            }
        }
    },

    redrawResult: function () {
        var cursor = this.pta.obj;
        $(this.options._textResult).html('');
        $(".backGroundSource .selected").removeClass("selected");
        do {
            if (cursor != null) {
                var txt = cursor.translation;
                translationData = null;
                if (cursor.translation.translation !== undefined) {
                    txt = cursor.translation.translation;
                    translationData = cursor.translation;
                }

                var isTranslated = cursor.translated || txt.replace(/\s/g, '').length == 0;
                var isEmptyLine = txt.replace(/\s/g, '').length == 0;

                var translationLine = $('<p></p>', { 'cursorId': cursor.id, 'class': 'mt-translation', 'aria-haspopup': 'true', 'id': 'mt-result-' + cursor.id } );
                if (isEmptyLine) {
                    translationLine.append($('<br />'));
                }
                else {
                    if ($widget.settings._enableParallelHover
                        && translationData
                        && translationData.translationSentenceRanges
                        && translationData.targetWordRanges
                        && translationData.phraseAlignment
                        && translationData.confidentWordAlignment) {
                        this.drawSentencePhraseWordTags(translationLine, txt, cursor.id, translationData.targetWordRanges, translationData.translationSentenceRanges, translationData.phraseAlignment, translationData.confidentWordAlignment, 1)
                    } else {
                        translationLine.text(txt);
                    }
                }
                $(this.options._textResult).append(translationLine);

                if (cursor.scroll != null && this.options.scrollToTranslated) {
                    $(this.options._textResult)[0].scrollTop = translationLine[0].offsetTop - ($(this.options._textResult).height() / 2);
                    cursor.scroll = null;
                }

                if (cursor.latest != null && this.options._highlightTranslated) {
                    $('.mt-translation[cursorId="' + cursor.id + '"]').addClass('latestHighlight');
                    $('.classMTsource[cursorId="' + cursor.id + '"]').addClass('latestHighlight');
                    var idThatWillNotChangeToMinusOne = cursor.id;

                    setTimeout($.proxy(function () {
                        this.latest = null;
                        $('.mt-translation[cursorId="' + idThatWillNotChangeToMinusOne + '"]').removeClass('latestHighlight');
                        $('.classMTsource[cursorId="' + idThatWillNotChangeToMinusOne + '"]').removeClass('latestHighlight');
                    }, cursor), this.options._highlightTranslatedTimeout);
                }

                if (isTranslated) {
                    translationLine.removeAttr('translationProgress');
                }
                else {
                    translationLine.attr('translationProgress', 'true')
                }

                cursor = cursor.child;
            }
            else {
                break;
            }
        } while (true);
        if (this.options._onScrollBarWidthChanged) {
            this.checkScrollbarWidth();
        }
    },

    highlightMouseEnter: function (event) {
        var classes = $(this).attr("class").split(' ');
        var hoverClasses = [];
        var siblingClasses = [];
        for (var classIndex = 1; classIndex < classes.length; classIndex++) {
            if (classes[classIndex] && classes[classIndex] != "hover" && classes[classIndex] != "highlight-sibling" && !classes[classIndex].indexOf("sibling") == 0) {
                hoverClasses.push("." + classes[classIndex]);
            }
            if (classes[classIndex] && classes[classIndex].indexOf("sibling") == 0) {
                siblingClasses.push("." + classes[classIndex].replace("sibling", "word"));
            }
        }
        if (hoverClasses.length > 0) {
            $(hoverClasses.join(", ")).addClass("hover");
        }
        if (siblingClasses.length > 0) {
            $(siblingClasses.join(", "), $(this).parent().parent()).addClass("highlight-sibling");
        }
    },

    highlightMouseLeave: function (event) {
        var classes = $(this).attr("class").split(' ');
        var hoverClasses = [];
        var siblingClasses = [];
        for (var classIndex = 1; classIndex < classes.length; classIndex++) {
            if (classes[classIndex] && classes[classIndex] != "hover" && classes[classIndex] != "highlight-sibling" && !classes[classIndex].indexOf("sibling") == 0) {
                hoverClasses.push("." + classes[classIndex]);
            }
            if (classes[classIndex] && classes[classIndex].indexOf("sibling") == 0) {
                siblingClasses.push("." + classes[classIndex].replace("sibling", "word"));
            }
        }
        if (hoverClasses.length > 0) {
            $(hoverClasses.join(", ")).removeClass("hover");
        }
        if (siblingClasses.length > 0) {
            $(siblingClasses.join(", "), $(this).parent().parent()).removeClass("highlight-sibling");
        }
    },

    highlightMouseEnterWithoutBubble: function (event) {
        event.stopPropagation();
        $.proxy($widget.textTranslator.highlightMouseEnter, this)(event);
    },

    highlightMouseLeaveWithoutBubble: function (event) {
        event.stopPropagation();
        $.proxy($widget.textTranslator.highlightMouseLeave, this)(event);
    },

    translationSentenceClicked: function (event) {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $(".backGroundSource .sentence." + $(this).attr("class").split(' ')[1]).removeClass("selected");
        }
        else {
            $(".backGroundSource .sentence.selected").removeClass("selected");
            $(".translateTextResult .sentence.selected").removeClass("selected");
            $(this).addClass("selected");
            $(".backGroundSource .sentence." + $(this).attr("class").split(' ')[1]).addClass("selected");
        }
    },

    drawSentencePhraseWordTags: function (lineHtml, text, cursorId, wordRanges, sentenceRanges, phraseAlignment, wordAlignment, alignmentIndex) {

        if (alignmentIndex == 0) {
            //re-sort phrase alignment by source not target
            sortedPhraseAlignment = phraseAlignment.slice();
            sortedPhraseAlignment.sort(function (a, b) {
                return a[0][0] - b[0][0];
            });
            phraseAlignment = sortedPhraseAlignment;
        }

        lastRangeEnd = 0;
        phraseIndex = -1;
        phraseHtml = null;
        sentenceIndex = -1;
        sentenceHtml = null;
        for (var wordIndex = 0; wordIndex < wordRanges.length; wordIndex++) {
            var textPrefix = null;
            if (lastRangeEnd < wordRanges[wordIndex][0]) {
                textPrefix = document.createTextNode(
                    text.substring(
                        lastRangeEnd,
                        wordRanges[wordIndex][0]))
            }
            lastRangeEnd = wordRanges[wordIndex][1];
            if (phraseIndex >= 0 && $.inArray(wordIndex, phraseAlignment[phraseIndex][alignmentIndex]) > -1) {
                //still the same phrase
                if (textPrefix !== null) {
                    if ($.trim(textPrefix.nodeValue) == '') {
                        //whitespace between words
                        phraseHtml.append(textPrefix);
                    } else {
                        //if more than whitespace between words (like tags) then split the phrase
                        sentenceHtml.append(phraseHtml);
                        sentenceHtml.append(textPrefix);
                        phraseHtml = $('<span></span>', { 'class': 'phrase phrase-' + cursorId + '-' + phraseAlignment[phraseIndex][0].join("-") + "-" + phraseAlignment[phraseIndex][1].join("-") });
                        phraseHtml.hover(alignmentIndex == 1 ? this.highlightMouseEnter : this.highlightMouseEnterWithoutBubble, alignmentIndex == 1 ? this.highlightMouseLeave : this.highlightMouseLeaveWithoutBubble);
                    }
                }
            } else {
                //new phrase started
                if (phraseHtml) {
                    sentenceHtml.append(phraseHtml);
                }
                if (textPrefix !== null) {
                    if (sentenceIndex >= 0 && (wordRanges[wordIndex][0] <= (sentenceRanges[sentenceIndex][0] + sentenceRanges[sentenceIndex][1]))) {
                        //whitespace between phrases (and not between sentences)
                        sentenceHtml.append(textPrefix);
                    }
                }
                phraseIndex += 1;
                phraseHtml = $('<span></span>', { 'class': 'phrase phrase-' + cursorId + '-' + (phraseAlignment.length > 0 ? (phraseAlignment[phraseIndex][0].join("-") + "-" + phraseAlignment[phraseIndex][1].join("-")) : "0") });
                phraseHtml.hover(alignmentIndex == 1 ? this.highlightMouseEnter: this.highlightMouseEnterWithoutBubble, alignmentIndex == 1 ? this.highlightMouseLeave : this.highlightMouseLeaveWithoutBubble);
            }
            if (sentenceIndex < 0 || (wordRanges[wordIndex][0] > (sentenceRanges[sentenceIndex][0] + sentenceRanges[sentenceIndex][1]))) {
                // new sentence started
                if (sentenceHtml) {
                    lineHtml.append(sentenceHtml);
                }
                if (textPrefix !== null) {
                    // whitespace between sentences
                    lineHtml.append(textPrefix);
                }
                sentenceIndex += 1;
                sentenceHtml = $('<span></span>', { 'class': 'sentence sentence-' + cursorId + '-' + sentenceIndex });
                sentenceHtml.hover(alignmentIndex == 1 ? this.highlightMouseEnter : this.highlightMouseEnterWithoutBubble, alignmentIndex == 1 ? this.highlightMouseLeave : this.highlightMouseLeaveWithoutBubble);
                if (alignmentIndex == 1) {
                    sentenceHtml.click(this.translationSentenceClicked);
                }
            }
            var wordClasses = [];
            for (var i = 0; i < wordAlignment.length; i++) {
                if (wordAlignment[i][alignmentIndex] == wordIndex) {
                    wordClasses.push('word-' + cursorId + '-' + wordAlignment[i][0] + '-' + wordAlignment[i][1]);
                    for (var j = 0; j < wordAlignment.length; j++) {
                        if (wordAlignment[j][alignmentIndex == 1 ? 0 : 1] == wordAlignment[i][alignmentIndex == 1 ? 0 : 1] && j != i) {
                            wordClasses.push('sibling-' + cursorId + '-' + wordAlignment[j][0] + '-' + wordAlignment[j][1]);
                        }
                    }
                }
            }
            wordHtml = $('<span></span>', { 'class': 'word ' + wordClasses.join(' ')})
                .text(
                    text.substring(
                        wordRanges[wordIndex][0],
                        wordRanges[wordIndex][1]));
            wordHtml.hover(alignmentIndex == 1 ? this.highlightMouseEnter : this.highlightMouseEnterWithoutBubble, alignmentIndex == 1 ? this.highlightMouseLeave : this.highlightMouseLeaveWithoutBubble);
            phraseHtml.append(wordHtml);

        }
        //last phrase
        if (phraseHtml.html()) {
            sentenceHtml.append(phraseHtml);
        }
        //last sentence
        if (sentenceHtml.html()) {
            lineHtml.append(sentenceHtml);
        }
        //whitespace after sentence
        if (lastRangeEnd < text.length) {
            lineHtml.append(
                document.createTextNode(
                    text.substring(
                        lastRangeEnd,
                        text.length)));
        }
    },

    makeAllNotTranslated: function () {
        var cursor = this.pta.obj;
        do {
            if (cursor != null) {
                cursor.translated = false;
                cursor.changed = false;
                cursor.translating = false;
                cursor.retranslate = false;
                cursor.translation = cursor.string;
                cursor = cursor.child;
            }
            else
                break;
        } while (true);

        this.redrawResult();
    },

    setSourceText: function (str) {
        this.setTargetText('');
        this.pta.setSourceText(str);
        this.doTranslation({ translateAll: true });
    },

    checkTextForUrl: function () {
        var text = $(this.options._textSource, this.options.container).val();
        var urlPattern = /\b((?:https?:(?:\/{1,3}|[a-z0-9%])|[a-z0-9.\-]+[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\/)(?:[^\s()<>{}\[\]]+|\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\))+(?:\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])|(?:[a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\b\/?(?!@)))/gi;
        var urlMatch = urlPattern.exec(text);
        if (urlMatch) {
            var url = urlMatch[0];
            if (url.length / $.trim(text).length > 0.8) // most of the text is url
            {
                $widget.settings._onUrlEntered(url);
            }
        }
    },

    doTranslation: function (options) {
        $(".editButtonContainer").addClass("hide");
        $(".backGroundSource .selected").removeClass("selected");
        $(".translateTextResult .selected").removeClass("selected");

        
        this.redrawBackground();

        cursor = this.pta.obj;

        if (!this.translationInProgress && cursor) {
            this.translationInProgress = true;
            if (this.options._onTranslationStarted)
                this.options._onTranslationStarted();
        }

        if (typeof (options) === 'undefined') {
            options = { translateAll: false };
        }

        if (options.translateAll)
            this.makeAllNotTranslated();

        // tts speakers
        if ($widget.settings._useSpeakers) {
            $('.sourceSpeak').addClass('hide');
            if ($widget.getActiveSystemObj() && $(".translateTextSource").val()) {
                var src = $widget.getActiveSystemObj().SourceLanguage.Code;
                if (src === 'lv') {
                    $('.sourceSpeak').removeClass('hide');
                }
            }
        }

        // use dictonary service
        // only if source and target are 'lv' <-> 'en'
        // and if only one paragraph is entered
        if ($widget.getActiveSystemObj() !== null) {
            var sysSrcCode = $widget.getActiveSystemObj().SourceLanguage.Code,
                sysTrgCode = $widget.getActiveSystemObj().TargetLanguage.Code,
                lngDirection = sysSrcCode + '-' + sysTrgCode;
            if ($widget.settings._useDictionary && (lngDirection === 'en-lv' || lngDirection === 'lv-en' || lngDirection === 'lv-ru')) {
                // check if only one word is entered
                text = $(".translateTextSource").val().trim();
                if (text.length > 0 && text.search(/\s/g) == -1) {
                    this.doDictionaryTranslation(sysSrcCode, sysTrgCode, cursor.string, options);
                    return;
                }
            }
        }
        this.doTextTranslation(options);
    },

    doDictionaryTranslation: function (sysSrcCode, sysTrgCode, phrase, options) {
        $.ajax({
            context: {
                ref: this
            },
            dataType: this.options.jsonType,
            type: 'GET',
            contentType: 'application/json',
            url: this.options._dictionaryUrl,
            data: {
                appid: this.options._appId,
                srcLng: sysSrcCode,
                trgLng: sysTrgCode,
                phrase: phrase
            },
            success: function (result) {
                // if data is empty do mt translation
                var entry = result.data;
                if (entry !== '') {
                    //javascript replace operation replaces only the first occurance
                    //thus the strange split/join, which replaces all
                    entry = entry.split('SEE_FULL_ENTRY').join(uiResources[$widget.settings._language]['seeFullEntry']);
                    // RL
                    //entry = entry.split('<a href').join('<a target="_blank" href');
                    // / RL
                    $(this.ref.options._textResult).html(entry);

                    $('.translateResultClear', $widget.settings.container).removeClass('hide');

                    cursor.translating = false;
                    cursor.translated = true;

                    this.ref.checkIfStoppedTranslating();
                }
                else { 
                    this.ref.doTextTranslation(options)
                }
            },
            error: this.onSuccess
        });
    },

    checkIfStoppedTranslating: function () {
        var otherCursor = this.pta.obj;
        var somethingTranslating = false;
        do {
            if (otherCursor) {
                if (otherCursor.string != "" && (!otherCursor.translated || otherCursor.translating)) {
                    somethingTranslating = true;
                }
                otherCursor = otherCursor.child;
            }
        } while (otherCursor);

        if (!somethingTranslating) {
            this.translationInProgress = false;
            if (this.options._onTranslationFinished) {
                this.options._onTranslationFinished();
            }
            if ($(".editButtonContainer").hasClass("hide")) {
                if ($(".translateTextResult p").length > 0 && $(".translateTextResult p[translationprogress=true]").length == 0) {
                    $(".editButtonContainer").removeClass("hide");
                }
            }
        }
    },

    doTextTranslation: function (options) {
        var previousId = null;
        do {
            var that = this;
            if (cursor && cursor.translating) {
                window.setTimeout(function () { that.doTextTranslation(options); }, 100);
                break;
            }

            if (cursor && !cursor.changed && (!cursor.translated || cursor.retranslate) && !cursor.translating) {
                cursor.translating = true;
                cursor.retranslate = false;

                // case if there is no internet
                if ($('#hidOnline').val() === 'false') {
                    if (this.options._onTranslationFinished)
                        this.options._onTranslationFinished();

                    this.translationInProgress = false;

                    $($widget.settings._textResult, $widget.settings.container)
                        .text(uiResources[$widget.settings._language]['noInternet'])
                        .addClass('noNetwork');
                    cursor.translating = false;
                    return;
                }

                // case if there is translation limit reached
                if ($widget.settings._translationLimit !== -1 && $widget.translatedCnt > $widget.settings._translationLimit) {
                    if (this.options._onTranslationFinished)
                        this.options._onTranslationFinished();

                    this.translationInProgress = false;

                    $($widget.settings._textResult, $widget.settings.container)
                        .text(uiResources[$widget.settings._language]['transLimit'])
                        .addClass('transLimit');
                    cursor.translating = false;
                    return;
                }

                // case if system is not ready for translation
                if ($('.translateTextTempSourceContainer').attr('data-disabled') === "true") {
                    if (this.options._onTranslationFinished)
                        this.options._onTranslationFinished();

                    this.translationInProgress = false;
                    cursor.translating = false;
                    return;
                }

                this.redrawBackground(cursor.id, previousId);

                if (typeof(cursor.translation.translation) == "undefined" && cursor.translation.replace(/\s/g, '').length == 0) {
                    cursor.translated = true;
                    cursor.translating = false;
                }
                else {
                    if (!$widget.settings._focusAfterTranslate) {
                        $($widget.settings._textSource).blur();
                    }

                    $('.translateResultClear', $widget.settings.container).removeClass('hide');

                    $('.sourceLang', $widget.settings.container).text($('.translateSourceLang option:selected', $widget.settings.container).text());
                    $('.targetLang', $widget.settings.container).text($('.translateTargetLang option:selected', $widget.settings.container).text());

                    $($widget.settings._textResult, $widget.settings.container).removeClass('noNetwork');
                    
                    // hide intro
                    if ($widget.settings._landingView) {
                        $('.fakeCursor', $widget.settings.container).addClass('hide');
                        $('.translateContainerRight', $widget.settings.container).removeClass('hide');
                        $('.translateContainerLeft, .translateContainerHeader', $widget.settings.container).removeClass('intro');
                    }

                    $.ajax({
                        context: {
                            id: cursor.id,
                            obj: this,
                            onAjaxError: this.options.onAjaxError
                        },
                        dataType: this.options.jsonType,
                        type: 'POST',
                        contentType: 'application/json',
                        url: this.options._translationUrl,
                        headers: $widget.getAuthHeaders(),
                        data: JSON.stringify({
                            appID: this.options._appId,
                            text: cursor.string,
                            systemID: $widget.activeSystemId,
                            options: "widget=text,alignment,markSentences" + (($widget.termCorpusId && $widget.getSelectedTermCorpusStatus() == "Ready") ? ",termCorpusId=" + $widget.termCorpusId : "")
                        }),
                        success: this.onSuccess,
                        error: this.onSuccess
                    });
                    break;
                }
            }
            else {
                if (cursor == null) {
                    this.checkIfStoppedTranslating();
                    break;
                }
                previousId = cursor.id;
                cursor = cursor.child;
            }
        } while (true);
    },

    onSuccess: function (result) {
        if (result.status == 401 && $widget.settings._loginUrl) {
            window.location = $widget.settings._loginUrl;
        }

        var id = this.id;
        var previousId = null;
        if (typeof (this.obj) === "undefined") {
            return;
        }
        var cursor = this.obj.pta.obj;

        do {
            if (cursor.id == id) {
                cursor.translating = false;
            }

            if (cursor.id == id && !cursor.changed) {
                cursor.translated = true;
                cursor.latest = true;
                cursor.scroll = true;
                if (typeof (result) === 'undefined' || result == null || (result.status && result.status !== '200' ) || !(result.translation || result.replace)) {
                    // system is in standby mode
                    var waking = false;
                    if (typeof (result.responseJSON) !== 'undefined')
                        if (typeof (result.responseJSON.ErrorCode) !== 'undefined')
                            if (result.responseJSON.ErrorCode === '21') {
                                //wake up
                                if ($widget.showSystemWaking && typeof ($widget.showSystemWaking) === "function") {
                                    $widget.showSystemWaking(false);
                                    waking = true;
                                }
                            }
                    cursor.translation = (waking) ? cursor.translation : '{{' + cursor.translation + '}}';
                }
                else {
                    // increase sentence counter
                    if (result.countSentences !== undefined) {
                        var cnt = parseInt(result.countSentences);
                        $widget.translatedCnt += (cnt > 0) ? cnt : 1;
                    }
                    else {
                        $widget.translatedCnt++;
                    }
                    cursor.translation = result;

                    // tts speakers
                    if ($widget.settings._useSpeakers) {
                        $('.targetSpeak').addClass('hide');
                        var trg = $widget.getActiveSystemObj().TargetLanguage.Code;
                        if (trg === 'lv') {
                            $('.targetSpeak').removeClass('hide');
                        }
                    }
                }

                this.obj.checkIfStoppedTranslating();
                break;
            }
            else {
                previousId = cursor.id;
                cursor = cursor.child;
                if (cursor == null)
                    break;
            }
        } while (true);

        this.obj.redrawResult();
        this.obj.redrawBackground(id, previousId);

        this.obj.doTranslation({ translateAll: false });
    },

    redrawBackground: function (id, afterId) {
        if (this.options._enableParallelHover) {
            $.proxy(this.onBackgroundHover, this.pta)(id, afterId);
        }
    }
}

//------------------------------------------------------------------------------------------------

Tilde.ProgressiveTextAreaElement = function () { };
Tilde.ProgressiveTextAreaElement.prototype = {
    start: function () {
        var current = this;
        var start = 0;
        do {
            if (current.parent != null) {
                current = current.parent;
                start += current.string.length + 1;
            }
            else {
                break;
            }
        } while (true);

        return start;
    },
    string: '',
    end: function () {
        return this.start() + this.string.length;
    },
    child: null,
    parent: null,
    changed: true,
    translation: '',
    translated: false,
    translating: false,
    retranslate: false,
    latest: null,
    scroll: null,
    id: 0,
    copy: function (child) {
        var copyOf = new Tilde.ProgressiveTextAreaElement();

        if (typeof (child) === 'undefined') {
            child = this;
        }

        copyOf.string = child.string;
        copyOf.id = child.id;
        copyOf.changed = child.changed;
        copyOf.translated = child.translated;
        copyOf.translating = child.translating;
        copyOf.retranslate = child.retranslate;

        var copyOfChild = null;
        if (child.child != null) {
            copyOfChild = child.child.copy();
        }

        if (copyOfChild != null) {
            copyOf.child = copyOfChild;
            copyOfChild.parent = copyOf;
        }

        return copyOf;
    }
}

//------------------------------------------------------------------------------------------------

Tilde.ProgressiveTextAreaOptions = function () { };
Tilde.ProgressiveTextAreaOptions.prototype = {
    textAreaSelector: '',
    directCompare: false,
    onTextInput: null,
    onTextChanged: null,
    onNewParagraph: null,
    onBackgroundHover: null
}

Tilde.ProgressiveTextArea = function (options) { this.init(options); };
Tilde.ProgressiveTextArea.prototype = {
    NEW_LINE: '<BREAK>',
    obj: null,
    objID: 0,
    oldString: '',
    options: new Tilde.ProgressiveTextAreaOptions(),

    init: function (options) {

        if (typeof (options) === 'undefined') {
            alert('no options specified for "Tilde.ProgressiveTextArea"');
        }
        this.options = options;
        this.obj = new Tilde.ProgressiveTextAreaElement();
        $(this.options.textAreaSelector).off('keypress keyup keydown').keypress($.proxy(this.onKeyStroke, this)).keyup($.proxy(this.onKeyStroke, this)).keydown($.proxy(this.onKeyStroke, this));
        $(this.options.textAreaSelector).off('paste copy cut delete input').bind('paste', $.proxy(this.onKeyStroke, this)).bind('copy', $.proxy(this.onKeyStroke, this)).bind('cut', $.proxy(this.onKeyStroke, this)).bind('delete', $.proxy(this.onKeyStroke, this)).bind('input', $.proxy(this.onKeyStroke, this));
    },

    getLastChild: function (parent) {
        if (typeof (parent) === 'undefined') {
            return this.getLastChild(this.obj);
        }

        if (parent.child == null) {
            return parent;
        }
        else {
            return this.getLastChild(parent.child);
        }
    },

    getStringBetween: function (str, delimiter, position) {
        var end = str.length;
        var start = 0;

        for (var i = position; i < str.length; i++) {
            if (str.charAt(i) == '\n') {
                end = i;
                break;
            }
        }

        for (var i = position - 1; i >= 0; i--) {
            if (str.charAt(i) == '\n') {
                start = i + 1;
                break;
            }
        }

        return { string: str.substring(start, end), start: start, end: end };
    },

    getCharChanged: function (o, n) {
        var type = 'removed';
        var char = '';

        if (o.length <= n.length) {
            type = 'added';
            if (o.length == n.length) {
                type = 'changed';
                if (o == n)
                    type = 'equal';
            }
        }

        var start = 0;

        switch (type) {
            case 'added':
                for (var i = 0; i < n.length; i++) {
                    if (o.charAt(i) != n.charAt(i)) {
                        char = n.charAt(i);
                        start = i + (n.length - o.length);
                        break;
                    }
                }

                break;
            case 'removed':
            case 'changed':
                for (var i = 0; i < o.length; i++)
                    if (o.charAt(i) != n.charAt(i)) {
                        char = o.charAt(i);
                        start = i;
                        break;
                    }
                break;
        }

        if (char == '\n')
            char = this.NEW_LINE;

        return { type: type, char: char, start: start };
    },

    saveState: function () {
        var current = this.obj;

        do {
            if (current == null) {
                break;
            }
            else {
                current.changed = false;
            }

            current = current.child;
        } while (true);
    },

    recalculate: function () {
        this.obj = this.createNewObject();
    },

    createNewObject: function () {
        var newObjBase = new Tilde.ProgressiveTextAreaElement();
        var newObj = newObjBase;
        var newString = '';
        if ($(this.options.textAreaSelector).length !== 0) {
            newString = $(this.options.textAreaSelector).val();
        }
        var st = 0;
        var newObjID = this.objID;

        do {
            newObj.string = this.getStringBetween(newString, '\n', st).string;
            newObj.id = ++newObjID;
            newObj.changed = true;

            st = newObj.end() + 1;

            if (st > newString.length) {
                break;
            }
            else {
                newObj.child = new Tilde.ProgressiveTextAreaElement();
                newObj.child.parent = newObj;
                newObj = newObj.child;
            }

        } while (true);

        this.objID = newObjID;
        return newObjBase;
    },

    setSourceText: function (str) {
        this.objID = 0;
        this.oldString = '';
        $(this.options.textAreaSelector).val(str);
        this.recalculate();
        this.redrawBackground();
    },

    kayTimeout: null,

    onKeyStroke: function (event) {
        if (this.options.onTextChangedWithoutDelay){
            this.options.onTextChangedWithoutDelay();
        }

        if (typeof (this.kayTimeout) !== 'undefined' && this.kayTimeout != null) {
            clearTimeout(this.kayTimeout);
            this.kayTimeout = null;
        }

        if (typeof (event) === 'undefined' || event.keyCode == 13) {
            this.onKeyStrokeSub(event);
            this.triggerOnTextInput(event);
            return;
        }
        
        var e = event;
        this.kayTimeout = setTimeout($.proxy(function () {
            this.onKeyStrokeSub(e);
            this.kayTimeout = null;
            this.triggerOnTextInput(e);
        }, this), 2000);
    },

    onKeyStrokeSub: function (event) {
        var newString = $(this.options.textAreaSelector).val();
        var charsChanged = Math.abs(newString.length - this.oldString.length);
        var charsEqual = (newString == this.oldString);
        var range = $(this.options.textAreaSelector).getSelection();
        var res = this.getCharChanged(this.oldString, newString);
        var newPosStart = range.start;
        var charMultiChanges = false;

        activeSource = this.obj;
        current = this.getStringBetween(newString, '\n', newPosStart);

        if (newString.length == 0) {
            this.objID = 0;
        }

        if (!charsEqual && charsChanged < 2) {
            var t;
            var len = newString.length;

            if (newString.length > this.oldString.length) {
                len = this.oldString.length;
            }

            for (t = 0; t < len; t++) {
                if (newString.charAt(t) != this.oldString.charAt(t)) {
                    break;
                }
            }

            var z;
            for (z = 1; z < len - t; z++) {
                if (newString.charAt(newString.length - t) != this.oldString.charAt(this.oldString.length - t)) {
                    break;
                }
            }

            charsChanged = Math.abs(z - t);
        }

        if (!charsEqual && charsChanged == 0) { //TODO:FIX
            var c = 0;
            var res = 0;
            do {
                if (newString.charAt(c) !== this.oldString.charAt(c)) {
                    res++;
                    if (newString.charAt(c) == '\n' || this.oldString.charAt(c) == '\n')
                        res++;
                    if (res == 2) {
                        charMultiChanges = true;
                        break;
                    }
                }
                c++;
            } while (c < newString.length);
        }

        do {
            if (this.options.directCompare || (Math.abs(charsChanged) >= 1 || charMultiChanges)) {
                var newObjID = 0;
                var st = 0;

                var oldObj = this.obj;
                var newObjBase = this.createNewObject();
                var newObj = newObjBase;
                var linesChanged = 0;

                newObj = newObjBase;
                do {
                    oldObj = this.obj;

                    do {
                        if (oldObj != null && oldObj.id != -1 && oldObj.string == newObj.string) {
                            newObj.id = oldObj.id;
                            newObj.changed = oldObj.changed;
                            newObj.translated = oldObj.translated;
                            newObj.translating = oldObj.translating;
                            newObj.retranslate = oldObj.retranslate;
                            newObj.translation = oldObj.translation;
                            oldObj.id = -1;
                            break;
                        }
                        else {
                            oldObj = oldObj.child;
                            if (oldObj == null) {
                                newObj.id = ++this.objID;
                                newObj.changed = true;
                                linesChanged++;
                                break;
                            }
                        }
                    } while (true);
                    newObj = newObj.child;
                    if (newObj == null) {
                        break;
                    }

                } while (true);

                this.obj = newObjBase;
            }
            else {
                switch (res.type) {
                    case 'removed':
                        if (res.char == this.NEW_LINE) {
                            if (true) {
                                do {
                                    if (activeSource.end() > newPosStart) {
                                        var totalLen = activeSource.string.length;

                                        activeSource = activeSource.parent;
                                        activeSource.child = activeSource.child.child;

                                        totalLen += activeSource.string.length;

                                        if (activeSource.child != null)
                                            activeSource.child.parent = activeSource;

                                        if (activeSource.string.length != totalLen || activeSource.parent == null || activeSource.string != current.string) {
                                            activeSource.translated = false;
                                            activeSource.changed = true;
                                            activeSource.translation = '';
                                            activeSource.id = ++this.objID;
                                        }

                                        activeSource.string = current.string;

                                        break;
                                    }
                                    else {
                                        activeSource = activeSource.child;
                                    }
                                } while (true);
                            }
                            else {
                            }
                        }
                        else {

                            if (newString.charAt(newPosStart) == '\n') {
                                var prevChange = false;
                                var pre_current = this.getStringBetween(newString, '\n', newPosStart);
                                var post_current = this.getStringBetween(newString, '\n', newPosStart + 1);

                                do {
                                    if (activeSource.start() == pre_current.start) {
                                        prevChange = !(activeSource.string == pre_current.string);
                                        break;
                                    }
                                    else {
                                        activeSource = activeSource.child;
                                    }
                                } while (true);

                                if (prevChange) {
                                    current = pre_current;
                                }
                                else {
                                    current = post_current;
                                    newPosStart++;
                                }

                                activeSource = this.obj;
                            }
                            else {
                                current = this.getStringBetween(newString, '\n', newPosStart);
                            }

                            do {
                                if (activeSource.start() <= (newPosStart) && (activeSource.child == null || activeSource.end() >= newPosStart)) {
                                    activeSource.string = current.string;
                                    activeSource.changed = true;
                                    break;
                                }
                                else {
                                    activeSource = activeSource.child;
                                }
                            } while (true);
                        }
                        break;
                    case 'changed':
                    case 'added':
                        if (res.char == this.NEW_LINE) {
                            if (newString.length - 1 <= newPosStart) {
                                do {
                                    if (activeSource.child == null) {
                                        var parent = activeSource;
                                        activeSource.child = new Tilde.ProgressiveTextAreaElement();
                                        activeSource = activeSource.child;
                                        activeSource.parent = parent;
                                        activeSource.string = '';
                                        activeSource.id = ++this.objID;
                                        activeSource.changed = true;

                                        break;
                                    }
                                    else {
                                        activeSource = activeSource.child;
                                    }
                                } while (true);
                            } else {
                                do {
                                    if (activeSource.start() <= (newPosStart) && activeSource.end() >= (newPosStart)) {

                                        var postcurrent = null;
                                        var precurrent = null;

                                        if (newString.charAt(newPosStart) == '\n') {
                                            var postcurrent = this.getStringBetween(newString, '\n', newPosStart + 1);
                                            var precurrent = this.getStringBetween(newString, '\n', newPosStart);
                                        }
                                        else {
                                            var postcurrent = this.getStringBetween(newString, '\n', newPosStart);
                                            var precurrent = this.getStringBetween(newString, '\n', newPosStart - 1);
                                        }

                                        var n_id = null;
                                        var n_changed = null;
                                        var n_translated = null;
                                        var n_translation = null;
                                        var n_translating = null;
                                        var n_retranslate = null;

                                        if (activeSource.string == postcurrent.string) {
                                            var n_id = activeSource.id;
                                            var n_changed = activeSource.changed;
                                            var n_translated = activeSource.translated;
                                            var n_translation = activeSource.translation;
                                            var n_translating = activeSource.translating;
                                            var n_retranslate = activeSource.retranslate;
                                        }

                                        if (activeSource.string != precurrent.string) {
                                            activeSource.changed = true;
                                            activeSource.translated = false;
                                            activeSource.translation = '';
                                            activeSource.id = ++this.objID;
                                        }

                                        activeSource.string = precurrent.string;

                                        var oldChild = activeSource.child;
                                        activeSource.child = new Tilde.ProgressiveTextAreaElement();

                                        if (activeSource.child.string != postcurrent.string) {
                                            activeSource.child.changed = true;
                                            activeSource.child.translated = false;
                                            activeSource.child.translation = '';
                                            activeSource.child.id = ++this.objID;
                                        }

                                        if (n_id != null) {
                                            activeSource.child.id = n_id;
                                            activeSource.child.changed = n_changed;
                                            activeSource.child.translated = n_translated;
                                            activeSource.child.translation = n_translation;
                                            activeSource.child.translating = n_translating;
                                            activeSource.child.retranslate = n_retranslate;
                                        }
                                        else {
                                            activeSource.child.id = ++this.objID;
                                        }

                                        activeSource.child.string = postcurrent.string;
                                        activeSource.child.id = ++this.objID;
                                        activeSource.child.parent = activeSource;
                                        activeSource.child.child = oldChild;

                                        if (oldChild != null) {
                                            oldChild.parent = activeSource.child;
                                        }
                                        break;
                                    }
                                    else {
                                        activeSource = activeSource.child;
                                    }
                                } while (true);
                            }
                        }
                        else {
                            do {
                                if (activeSource.start() <= (newPosStart) && (activeSource.child == null || activeSource.end() + 1 >= newPosStart)) {
                                    activeSource.string = current.string;
                                    activeSource.changed = true;
                                    break;
                                }
                                else {
                                    activeSource = activeSource.child;
                                }
                            } while (true);
                        }
                        break;
                    case 'equal':
                        break;
                }
            }
        } while (false);


        var oldParaCount = (this.oldString.match(/\n/g) || []).length;
        var newParaCount = ($(this.options.textAreaSelector).val().match(/\n/g) || []).length;

        if (oldParaCount != newParaCount) {
            this.triggerOnNewParagraph();
        } else {
            if (!charsEqual) {
                this.triggerOnNewText();
            }
        }

        this.oldString = $(this.options.textAreaSelector).val();
        this.redrawBackground();
    },

    trimIfTooLarge: function () {
        var tempCursorCount = this.obj;
        var tempNewText = '';
        var totalLineCount = 1;
        do {
            if (tempCursorCount.child != null) {
                totalLineCount++;
                tempNewText += tempCursorCount.string + '\r\n';
                if (totalLineCount > 250) {
                    tempCursorCount.child = null;
                    //when text changes, cursor is moved to the bottom of text area - undesired behaviour
                    $(this.options.textAreaSelector).val(tempNewText);
                    break;
                }
                tempCursorCount = tempCursorCount.child;
            }
            else {
                break;
            }
        } while (true);
    },

    redrawBackground: function (id, afterId) {
        if (this.options.onBackgroundHover) {
            $.proxy(this.options.onBackgroundHover, this)(id, afterId);
        }
    },

    triggerOnTextInput: function (event) {
        if (this.options.onTextInput) {
            this.options.onTextInput(event);
        }
    },

    triggerOnNewParagraph: function () {
        if (this.options.onNewParagraph) {
            this.options.onNewParagraph();
        }
    },

    triggerOnNewText: function () {
        if (this.options.onTextChanged) {
            this.options.onTextChanged();
        }
    }
}