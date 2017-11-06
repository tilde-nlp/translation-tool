/* tilde.translator.widget.RECENTLANGS.js */

$.extend(Tilde.TranslatorWidgetDefaultOptions, {
    _useRecentLangSelector: false
});

$.extend(Tilde.TranslatorWidget.prototype, {

    recentlangsPluginInit: function () {
        if (!$widget.settings._useRecentLangSelector) {
            return;
        }
        $widget.onSystemListLoadedHandlers.push(function () {
            $widget.loadPopularSourceLangList();
            $widget.loadPopularTargetLangList();
        });

        $widget.onSystemChangedHandlers.push(function (systemId) {
            $widget.changePopularLangList(systemId);
        });

        $(document).on('click', '.popSourceLangs li', function () {
            if (!$(this).hasClass('active')) {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
            }
            $('.translateSourceLang option[value="' + $(this).attr('data-value') + '"]').prop('selected', true);
            $widget.fancySource.trigger('update.fs');
        });

        $(document).on('click', '.popTargetLangs li', function () {
            if (!$(this).hasClass('active')) {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
            }
            $('.translateTargetLang option[lang="' + $(this).attr('data-value') + '"]').prop('selected', true);
            $widget.fancyTarget.trigger('update.fs');
        });

        $(window).on('resize', function () {
            $widget.loadPopularSourceLangList();
            $widget.loadPopularTargetLangList();
        });
    },

    loadPopularSourceLangList: function (languageCount) {
        if(!languageCount)
            languageCount = 3;
        languageIndexes = [];
        // select first N languages. always include selected language even if it is not in first N
        $('.translateSourceLang option').each(function (idx) {
            if (idx < languageCount) {
                languageIndexes.push(idx);
            } else if ($(this).val() === $(this).parent().val()) {
                if (languageIndexes.length > 0) {
                    languageIndexes.pop();
                }
                languageIndexes.push(idx);
            }
        });
        var list = '';
        $('.translateSourceLang option').each(function (idx) {
            if ($.inArray(idx, languageIndexes) >= 0) {
                // RL
                //list += '<li data-value="' + $(this).val() + '"' + ($(this).val() === $(this).parent().val() ? ' class="active"' : '') + '>' + $(this).text() + '</li>';
                list += '<li data-value="' + $(this).val() + '"' + ($(this).val() === $(this).parent().val() ? ' class="active"' : '') + '>' + angular.element($("#my_translator_app")).scope().localize($(this).text()) + '</li>';
                // / RL
            }
        });
        $(".translateSystemContainerLeft .fancy-select").toggle($('.translateSourceLang option').length > languageCount);
        $('.popSourceLangs').html(list);
        if ($(".translateSystemContainerLeft").height() > 50 && languageCount > 1){
            $widget.loadPopularSourceLangList(languageCount - 1);
        }
    },

    loadPopularTargetLangList: function (languageCount) {
        if (!languageCount)
            languageCount = 3;
        languageIndexes = [];
        // select first N languages. always include selected language even if it is not in first N
        $('.translateTargetLang option').each(function (idx) {
            if (idx < languageCount) {
                languageIndexes.push(idx);
            } else if ($(this).val() === $(this).parent().val()) {
                if (languageIndexes.length > 0) {
                    languageIndexes.pop();
                }
                languageIndexes.push(idx);
            }
        });
        var list = '';
        $('.translateTargetLang option').each(function (idx) {
            if ($.inArray(idx, languageIndexes) >= 0) {
                // RL
                // list += '<li data-value="' + $(this).attr('lang') + '"' + ($(this).val() === $(this).parent().val() ? ' class="active"' : '') + '>' + $(this).text() + '</li>';
                list += '<li data-value="' + $(this).attr('lang') + '"' + ($(this).val() === $(this).parent().val() ? ' class="active"' : '') + '>' + angular.element($("#my_translator_app")).scope().localize($(this).text()) + '</li>';
                // RL
            }
        });
        $(".translateSystemContainerRight .fancy-select").toggle($('.translateTargetLang option').length > languageCount);
        $('.popTargetLangs').html(list);
        if ($(".translateSystemContainerRight").height() > 50 && languageCount > 1) {
            $widget.loadPopularTargetLangList(languageCount - 1);
        }
    },

    changePopularLangList: function (systemId) {
        var sysObj = $widget.getActiveSystemObj();
        if (!sysObj)
            return;

        var src = sysObj.SourceLanguage.Code;
        var trg = sysObj.TargetLanguage.Code;

        $('.popSourceLangs li').removeClass('active');

        if ($('.popSourceLangs li[data-value="' + src + '"]').length > 0) {
            $('.popSourceLangs li[data-value="' + src + '"]').addClass('active');
        }
        else {
            // RL
            // $('.popSourceLangs').prepend('<li data-value="' + src + '" class="active">' + $('.translateSourceLang :selected').text() + '</li>');
            var newText = angular.element($("#my_translator_app")).scope().localize($('.translateSourceLang :selected').text());
            $('.popSourceLangs').prepend('<li data-value="' + src + '" class="active">' + newText + '</li>');
            // / RL
            $('.popSourceLangs li').last().remove();
            if ($('.popSourceLangs li').length > 1 && $(".translateSystemContainerLeft").height() > 50) {
                $('.popSourceLangs li').last().remove();
            }
        }

        $widget.loadPopularTargetLangList();
        $('.popTargetLangs li').removeClass('active');
        if ($('.popTargetLangs li[data-value="' + trg + '"]').length > 0) {
            $('.popTargetLangs li[data-value="' + trg + '"]').addClass('active');
        }
        else {
            // RL
            //$('.popTargetLangs').prepend('<li data-value="' + trg + '" class="active">' + $('.translateTargetLang :selected').text() + '</li>');
            var newText = angular.element($("#my_translator_app")).scope().localize($('.translateTargetLang :selected').text());
            $('.popTargetLangs').prepend('<li data-value="' + trg + '" class="active">' + newText + '</li>');
            // /RL
            $('.popTargetLangs li').last().remove();
            if ($('.popTargetLangs li').length > 1 && $(".translateSystemContainerRight").height() > 50)
            {
                $('.popTargetLangs li').last().remove();
            }
        }
    }

});

Tilde.TranslatorWidget.prototype.pluginInitializers.push(Tilde.TranslatorWidget.prototype.recentlangsPluginInit);