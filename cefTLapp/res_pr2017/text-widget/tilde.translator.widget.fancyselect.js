﻿// patched with: https://github.com/octopuscreative/FancySelect/pull/52/files#r16327745
(function () {
    var $;

    $ = window.jQuery || window.Zepto || window.$;

    $.fn.fancySelect = function (opts) {
        var settings, clicking = false, clickingEvenHarder = false;
        if (opts == null) {
            opts = {};
        }
        settings = $.extend({
            useNativeSelect: false,
            includeBlank: false,
            optionTemplate: function (optionEl) {
                return optionEl.text();
            },
            triggerTemplate: function (optionEl) {
                return optionEl.text();
            }
        }, opts);
        return this.each(function () {
            var copyOptionsToList, disabled, options, sel, trigger, updateTriggerText, wrapper;
            sel = $(this);
            if (sel.hasClass('fancified') || sel[0].tagName !== 'SELECT') {
                return;
            }
            sel.addClass('fancified');
            if (settings.useNativeSelect) {
                sel.css({
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0
                });
            }
            else {
                sel.css({
                    width: 1,
                    height: 1,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0
                });
            }
            sel.wrap('<div class="fancy-select">');
            wrapper = sel.parent();
            if (sel.data('class')) {
                wrapper.addClass(sel.data('class'));
            }
            wrapper.append('<div class="trigger">');
            if (!settings.useNativeSelect) {
                wrapper.append('<ul class="options">');
            }
            trigger = wrapper.find('.trigger');
            options = wrapper.find('.options');
            disabled = sel.prop('disabled');
            if (disabled) {
                wrapper.addClass('disabled');
            }
            updateTriggerText = function () {
                var triggerHtml;
                triggerHtml = settings.triggerTemplate(sel.find(':selected'));
                return trigger.html(triggerHtml);
            };
            sel.on('blur.fs', function () {
                if (clicking) return;
                if (clickingEvenHarder && !clicking) {
                    clickingEvenHarder = false;
                    sel.focus();
                    return;
                }
                if (trigger.hasClass('open')) {
                    return trigger.trigger('close.fs');
                }
            });
            trigger.on('close.fs', function () {
                clicking = false;
                trigger.removeClass('open');
                return options.removeClass('open');
            });
            trigger.on('mousedown.fs', function () {
                clicking = true;
            });
            trigger.on('click.fs', function () {
                clicking = false;
                var offParent, parent;
                if (!disabled) {
                    trigger.toggleClass('open');
                    if (settings.useNativeSelect) {
                        if (trigger.hasClass('open')) {
                            return sel.focus();
                        }
                    } else {
                        if (trigger.hasClass('open')) {
                            parent = trigger.parent();
                            offParent = parent.offsetParent();
                            if ((parent.offset().top + parent.outerHeight() + options.outerHeight() + 20) > $(window).height() + $(window).scrollTop()) {
                                options.addClass('overflowing');
                            } else {
                                options.removeClass('overflowing');
                            }
                        }
                        options.toggleClass('open');
                        if (!settings.useNativeSelect) {
                            return sel.focus();
                        }
                    }
                }
            });
            sel.on('enable', function () {
                sel.prop('disabled', false);
                wrapper.removeClass('disabled');
                return disabled = false;
            });
            sel.on('disable', function () {
                sel.prop('disabled', true);
                wrapper.addClass('disabled');
                return disabled = true;
            });
            sel.on('change.fs', function (e) {
                if (settings.useNativeSelect) {
                    return updateTriggerText();
                }
                else if (e.originalEvent && e.originalEvent.isTrusted) {
                    return e.stopPropagation();
                } else {
                    return updateTriggerText();
                }
            });
            sel.on('keydown', function (e) {
                var hovered, newHovered, w;
                w = e.which;
                hovered = options.find('.hover');
                hovered.removeClass('hover');
                if (!options.hasClass('open')) {
                    if (w === 13 || w === 32 || w === 38 || w === 40) {
                        e.preventDefault();
                        return trigger.trigger('click.fs');
                    }
                } else {
                    if (w === 38) {
                        e.preventDefault();
                        if (hovered.length && hovered.index() > 0) {
                            hovered.prev().addClass('hover');
                        } else {
                            options.find('li:last-child').addClass('hover');
                        }
                    } else if (w === 40) {
                        e.preventDefault();
                        if (hovered.length && hovered.index() < options.find('li').length - 1) {
                            hovered.next().addClass('hover');
                        } else {
                            options.find('li:first-child').addClass('hover');
                        }
                    } else if (w === 27) {
                        e.preventDefault();
                        trigger.trigger('click.fs');
                    } else if (w === 13 || w === 32) {
                        e.preventDefault();
                        hovered.trigger('click.fs');
                    } else if (w === 9) {
                        if (trigger.hasClass('open')) {
                            trigger.trigger('close.fs');
                        }
                    }
                    newHovered = options.find('.hover');
                    if (newHovered.length) {
                        options.scrollTop(0);
                        return options.scrollTop(newHovered.position().top - 12);
                    }
                }
            });
            options.on('click.fs', 'li', function (e) {
                var clicked;
                clicked = $(this);
                sel.val(clicked.data('raw-value'));
                if (!settings.useNativeSelect) {
                    sel.trigger('blur.fs').trigger('focus.fs');
                }
                options.find('.selected').removeClass('selected');
                clicked.addClass('selected');
                trigger.addClass('selected');
                var something = sel.val(clicked.data('raw-value')).trigger('change.fs').trigger('blur.fs').trigger('focus.fs');
                clicking = false;
                clickingEvenHarder = false;
                return something;
            });
            options.on('mousedown', function () {
                clickingEvenHarder = true;
            });
            options.on('mouseup', function () {
                if (clickingEvenHarder) {
                    clickingEvenHarder = false;
                    sel.focus();
                }
                clicking = false;
            });
            options.on('mousedown.fs', 'li', function () {
                clicking = true;
            });
            options.on('mouseenter.fs', 'li', function () {
                var hovered, nowHovered;
                nowHovered = $(this);
                hovered = options.find('.hover');
                hovered.removeClass('hover');
                return nowHovered.addClass('hover');
            });
            options.on('mouseleave.fs', 'li', function () {
                return options.find('.hover').removeClass('hover');
            });
            copyOptionsToList = function () {
                var selOpts;
                updateTriggerText();
                if (settings.useNativeSelect) {
                    return;
                }
                selOpts = sel.find('option');
                return sel.find('option').each(function(i, opt) {
                    var optHtml;
                    opt = $(opt);
                    if (!opt.prop('disabled') && (opt.val() || settings.includeBlank)) {
                        optHtml = settings.optionTemplate(opt);
                        if (opt.prop('selected')) {
                            // RL
                            //return options.append("<li data-raw-value=\"" + (opt.val()) + "\" class=\"selected\">" + optHtml + "</li>");
                            return options.append("<li data-raw-value=\"" + (opt.val()) + "\" class=\"selected\">" + angular.element($("#my_translator_app")).scope().localize(optHtml) + "</li>");
                            // /RL
                        } else {
                            // RL
                            //return options.append("<li data-raw-value=\"" + (opt.val()) + "\">" + optHtml + "</li>");
                            return options.append("<li data-raw-value=\"" + (opt.val()) + "\">" + angular.element($("#my_translator_app")).scope().localize(optHtml) + "</li>");
                            // /RL
                        }
                    }
                });
            };
            sel.on('update.fs', function () {
                wrapper.find('.options').empty();
                return copyOptionsToList();
            });
            return copyOptionsToList();
        });
    };

}).call(this);