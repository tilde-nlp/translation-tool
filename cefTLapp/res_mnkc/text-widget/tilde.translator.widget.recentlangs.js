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

            $(".translate-source-language .dropdown-item[data-value=\"" + $(this).attr("data-value") + "\"]").addClass("active");
            $(".translate-source-language .dropdown-toggle").attr("data-value", $(this).attr("data-value"));
            $(".translate-source-language .dropdown-toggle").text($(this).text());
        });

        $(document).on('click', '.popTargetLangs li', function () {
            if (!$(this).hasClass('active')) {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
            }
            $('.translateTargetLang option[lang="' + $(this).attr('data-value') + '"]').prop('selected', true);
            $widget.fancyTarget.trigger('update.fs');

            $(".translate-target-language .dropdown-item[data-value=\"" + $(this).attr("data-value") + "\"]").addClass("active");
            $(".translate-target-language .dropdown-toggle").attr("data-value", $(this).attr("data-value"));
            $(".translate-target-language .dropdown-toggle").text($(this).text());
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
                list += '<li data-value="' + $(this).val() + '" class="page-item' + ($(this).val() === $(this).parent().val() ? ' active"' : '"') + '><a tabindex=0 class="page-link" title="' + $(this).text() + '">' + $(this).text() + '</a></li>';
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
                var lng = ($(this).attr('lang')) ? $(this).attr('lang') : $(this).val();
                list += '<li data-value="' + lng + '" class="page-item' + ($(this).val() === $(this).parent().val() ? ' active"' : '"') + '><a tabindex=0 class="page-link" title="' + $(this).text() + '">' + $(this).text() + '</a></li>';
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
            $('.popSourceLangs').prepend('<li data-value="' + src + '" class="page-item active"><a class="page-link" tabindex=0 title="' + $('.translateSourceLang :selected').text() + '">' + $('.translateSourceLang :selected').text() + '</a></li>');
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
            $('.popTargetLangs').prepend('<li data-value="' + trg + '" class="page-item active"><a tabindex=0 class="page-link" title="' + $('.translateTargetLang :selected').text() + '">' + $('.translateTargetLang :selected').text() + '</a></li>');
            $('.popTargetLangs li').last().remove();
            if ($('.popTargetLangs li').length > 1 && $(".translateSystemContainerRight").height() > 50)
            {
                $('.popTargetLangs li').last().remove();
            }
        }
    }

});

if (typeof $customWidgetInit === "undefined" || !$customWidgetInit) {
    Tilde.TranslatorWidget.prototype.pluginInitializers.push(Tilde.TranslatorWidget.prototype.recentlangsPluginInit);
}