/* tilde.translator.widget.TRANSLATEFILE.js */

$.extend(Tilde.TranslatorWidgetDefaultOptions, {
    _uploadUrl: 'https://letsmt.eu/ws/Files/Upload',
    _deleteUrl: 'https://letsmt.eu/ws/Files/Delete',
    _downloadUrl: 'https://letsmt.eu/ws/Files/Download',
    _translateUrl: 'https://letsmt.eu/ws/Files/StartTranslation',
    _previewUrl: 'https://letsmt.eu/ws/Files/GetDocumentPreview',
    _checkStatusUrl: 'https://letsmt.eu/ws/Files/GetStatus',
    _languageNamesUrl: 'https://letsmt.eu/ws/Files/GetLanguageNames',
    _landingView: false, //intro box with tooltip
    _allowedFileTypes: [{ ext: "txt", mime: "text/plain" }], //file translation types
    _showAllowedFileInfo: false, //show list of supported file types
    _mimetypeFilter: true, //show only allowed filetypes in open file dialog
    _uploadSizeLimit: 1024 * 1024 * 30, //doc translate upload size limit (default 15MB)
    _startPercent: 3, //translation progress init percentage
    _docMaxWordCount: 0, //document translation max word count
    _docMaxSegmentCount: -1, //translated segment count limitation. if -1 then no limit
    _docTransMetadata: {}, //custom metadata of translated file (json)
    _warnWhenRunningAway: false, //warn when navigating to different page while translation is in progess
    _onFileUpload: null, //callback function when document is uploaded
    _onDocTranslationStart: null, //callback function on document started translation 
    _onDocTranslationCancel: null, //callback function on document cancel translation 
    _onDocTranslationStop: null, //callback function on document translation stop
    _onDocTranslationFinished: null, //callback function on document finished translation 
    _onDocTranslationError: null, //callback function on document error translation
    _onDocTranslationProgress: null, // Callback function on document translation progress; 1st parameter is translated percentage
    _advancedOptions: false //show advenced file translation options
});

$.extend(Tilde.TranslatorWidget.prototype, {

    filePluginInit: function () {

        if ($('#docUploadFile', $widget.settings.container).length === 0)
            return;

        $widget.filePluginEvents();
        $widget.filePluginSetTempTextResult();

        if (navigator.userAgent.indexOf("iPhone OS") > -1) {
            $(".docAppleLimited").removeClass('hide');
        }

        // landing intro box
        if ($widget.settings._landingView) {
            $widget.filePluginShowIntro();
        }

        var extArray = [];
        var mimeArray = [];
        for (var idx in $widget.settings._allowedFileTypes) {
            var item = $widget.settings._allowedFileTypes[idx];
            if ($.inArray(item.ext, extArray) == -1) {
                extArray.push(item.ext);
            }

            if ($widget.settings._mimetypeFilter) {
                if ($.inArray(item.mime, mimeArray) == -1) {
                    mimeArray.push(item.mime);
                }
            }
        }

        $widget.onSystemChangedHandlers.push(function () {
            $("#docSourcePreview", $widget.settings.container).attr("lang", $widget.getActiveSystemObj().SourceLanguage.Code);
            $(".translateResult", $widget.settings.container).attr("lang", $widget.getActiveSystemObj().TargetLanguage.Code);
        });

        // supported formats
        var formatsHtml = '';
        if ($widget.settings._showAllowedFileInfo) {
            formatsHtml = '<span class="supTypesList">' + uiResources[$widget.settings._language]['docSupportedTypes'].replace('{extensions}', '<span class="format">' + extArray.join('</span>, <span class="format">') + '</span>') + '</span>';
        }

        // translation segment limit message
        if ($widget.settings._docMaxSegmentCount !== -1) {
            $('.stickyMessageBox').html(uiResources[$widget.settings._language]['docLimit'].replace('{limit}', $widget.settings._docMaxSegmentCount)).removeClass('hide');
        }

        var uploader = new qq.FileUploader({
            element: document.getElementById('docUploadFile'),
            multiple: false,
            allowedExtensions: extArray,
            allowedMimetypes: mimeArray,
            action: $widget.settings._uploadUrl,
            headers: $widget.getAuthHeaders(),
            debug: false,
            sizeLimit: $widget.settings._uploadSizeLimit,
            template: '<div class="qq-uploader">' +
                      ' <div class="qq-upload-drop-area"></div>' +
                      '	<div href="#" class="qq-upload-button">' +
                      '  <div class="qq-upload-button-image"></div>' +
                      '  <div class="qq-upload-button-text">' +
                      '     <span>' + uiResources[$widget.settings._language]['docUploadTooltip'] + '</span>' + formatsHtml +
                      '  </div>' +
                      ' </div>' +
                	  '	<ul class="qq-upload-list hide"></ul>' +
                	  '</div>',
            fileTemplate: '<li>' +
                          ' <div class="qq-upload-meta">' +
                          '     <span class="qq-upload-meta-title">' + uiResources[$widget.settings._language]['docUploadFilename'] + '</span>' +
                          '     <span class="qq-upload-file"></span>' +
                          '     <span class="qq-upload-failed-text">' + uiResources[$widget.settings._language]['docUploadFailed'] + '</span>' +
                          '     <a class="qq-upload-cancel hide"></a>' +
                          ' </div>' +
                          ' <div class="qq-upload-meta">' +
                          '     <span class="qq-upload-meta-title">' + uiResources[$widget.settings._language]['docUploadFilesize'] + '</span>' +
                          '     <span class="qq-upload-size"></span>' +
                          ' </div>' +
                          ' <div class="qq-upload-meta">' +
                          '     <span class="qq-upload-meta-title">' + uiResources[$widget.settings._language]['docUploadWordcount'] + '</span>' +
                          '     <span class="qq-upload-wordcount"></span>' +
                          ' </div>' +
                          '</li>',
            messages: {
                typeError: uiResources[$widget.settings._language]['docUploadMsgType'],
                sizeError: uiResources[$widget.settings._language]['docUploadMsgSize'],
                emptyError: uiResources[$widget.settings._language]['docUploadMsgEmpty']
            },

            onSubmit: $widget.filePluginUploadOnSubmit,

            onComplete: $widget.filePluginUploadOnComplete,

            showMessage: function (message) {
                $('.translateProgress').addClass('hide');
                $('.infoMessageBox').html(message).removeClass('hide');
            }
        });

        $widget.onSystemChangedHandlers.push(function (systemId) {
            if ($('.buttonDownDoc').length === 1 && !$('.buttonDownDoc').hasClass('hide')) {
                $widget.filePluginUploadNew();
            }
            $widget.filePluginSetTempTextResult();
        });

        if ($widget.settings._advancedOptions) {
            $(".buttonAdvancedOptions").removeClass("hide");
            $('.optionBox .optCheck').change(function () {
                if ($(this).is(':checked')) {
                    $(this).parent().find('.manualInput').slideDown();

                    if ($(this).attr('id') === 'cbAddSourcePrefix') {
                        if ($('#inputSourcePrefix').val() === '') {
                            $('#inputSourcePrefix').val('*M*');
                        }
                    }

                    if ($(this).attr('id') === 'cbAddTargetPrefix') {
                        if ($('#inputTargetPrefix').val() === '') {
                            $('#inputTargetPrefix').val('*M*');
                        }
                    }
                }
                else {
                    $(this).parent().find('.manualInput').slideUp();
                }
            });

            $('.optionBox  .langOptCheck').change(function () {
                if ($(this).is(':checked')) {

                    $(".tmxSourceLang").empty();
                    $(".tmxTargetLang").empty();

                    var trgValues = '';

                    var sysID = $widget.activeSystemId;
                    if (sysID) {
                        var systemObj = $widget.getActiveSystemObj();
                        var langs = systemObj.SourceLanguage.Code + "-" + systemObj.TargetLanguage.Code;

                        var ret = $.ajax({
                            type: 'POST',
                            url: $widget.settings._languageNamesUrl,
                            headers: $widget.getAuthHeaders(),
                            data: {
                                languagePair: langs
                            },
                            success: function (response) {
                                var parts = response.split("\n");
                                if (parts.length == 2) {
                                    $(".tmxSourceLang").empty().append(parts[0]);
                                    $(".tmxTargetLang").empty().append(parts[1]);
                                }
                            },
                            error: function (response) {
                                console.error(response);
                            }
                        });
                    }
                    $(this).parent().find('.manualInput').slideDown();
                }
                else {
                    $(this).parent().find('.manualInput').slideUp();
                }
            });
        }
    },

    filePluginUploadOnSubmit: function () {
        $('.qq-upload-list, .infoMessageBox').html('').addClass('hide');
        $('.translateProgress').removeClass('hide');
    },

    filePluginUploadOnComplete: function (id, fileName, responseJSON) {
        if (responseJSON.success) {
            // landing intro box
            if ($widget.settings._landingView) {
                $('.translateContainerRight', $widget.settings.container).removeClass('hide');
                $('.translateContainerLeft, .translateContainerHeader', $widget.settings.container).removeClass('intro');
            }

            $('.transFileMeta').html($('.qq-upload-success').html());
            $('.docUploadNewDoc').removeClass('hide');
            $('.translateButton').removeClass('hide');
            $widget.enableSystemChange();
            $('#sendEmail, #sendEmailLabel').removeClass('hide');
            $('#sendEmail').removeAttr("disabled");

            var filename = responseJSON.filename;
            var wordcount = responseJSON.wordcount;
            $('.qq-upload-wordcount').html(wordcount);
            $('#docUploadFile').addClass('hide');

            $('.translateProgress').addClass('hide');
            $('.uploadedDocumentName').text($('.qq-upload-file:first').text()).removeClass('hide');

            if ($('#hidTranslRealFilename').length == 0) {
                $('.docTranslateContent').after($('<input>', {
                    type: 'hidden',
                    id: 'hidTranslRealFilename',
                    value: filename
                }));

            }
            else {
                $('#hidTranslRealFilename').val(filename);
            }

            // detect language
            //if ($(".translate_source_lang option[value='" + responseJSON.detlang + "']").length !== 0) {
            //    $('.translate_source_lang').val(responseJSON.detlang);
            //    $('.translate_source_lang').trigger('change');
            //}

            $("#docSourcePreview").removeClass('hide');
            $('#docSourcePreview').html(responseJSON.preview);
            $('#docSourcePreview').toggleClass("bigIcon", $('.no-preview', $("#docSourcePreview")).length > 0);

            // file upload callback
            if ($widget.settings._onFileUpload && typeof ($widget.settings._onFileUpload) === "function") {
                $widget.settings._onFileUpload(filename, wordcount);
            }

            // max word count check
            if ($widget.settings._docMaxWordCount !== 0 && $widget.settings._docMaxWordCount < parseInt(wordcount)) {
                var message = uiResources[$widget.settings._language]['docUploadMsgWordcnt'].replace('{wordCount}', wordcount);
                $('.qq-upload-wordcount').addClass('warning');
                $('.infoMessageBox').html(message).removeClass('hide');
                if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                    $widget.settings._onDocTranslationError('FT_ERR_WORDCOUNT', message);
                }
            }
            else {
                $('.qq-upload-wordcount').removeClass('warning');
                $('.qq-upload-warn-msg').remove();
            }
        }
        else if (responseJSON.error || jQuery.isEmptyObject(responseJSON)) {
            var message = uiResources[$widget.settings._language]['docUploadFailed'];
            $('.translateProgress').addClass('hide');
            $('.infoMessageBox').html(message).show();
            if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                $widget.settings._onDocTranslationError('FT_ERR_UPLOAD', message);
            }
        }
    },

    filePluginTranslate: function () {
        $widget.disableSystemChange();
        $('.translateButton, .docUploadNewDoc').addClass('hide');
        if ($widget.settings._advancedOptions) {
            $('.advancedOptions').addClass("hide");
            $('.buttonAdvancedOptions').addClass("hide");
            $(".buttonAdvancedOptions .btnText").text($(".buttonAdvancedOptions .btnText").text().replace("▴", "▾"));
        }
        $('.buttonCancelDoc').removeClass('hide');
        $('.docTempTarget').addClass('hide');
        $('.translateContainerRight').addClass('docProgress');

        $('.translateResult').removeClass('hide');
        $('.translateResult').addClass("bigIcon");

        if ($widget.settings._onDocTranslationStart && typeof ($widget.settings._onDocTranslationStart) === "function") {
            $widget.settings._onDocTranslationStart();
        }

        $("#hidStopTranslation").val('false');

        $('.translateResult').html(
            '<div id="translProgress" class="starting">' +
            '   <div class="progressImage"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><div id="transItem" class="transItem">' +
            '	    <span class="percent">' + uiResources[$widget.settings._language]['docStarting'] + '</span>' +
            '   </div>' +
            '</div>'
        );

        var data = {
            systemid: $widget.activeSystemId,
            appid: $widget.settings._appId,
            filename: $('.transFileMeta .qq-upload-file').text(),
            tmpname: $('#hidTranslRealFilename').val(),
            wordlimit: $widget.settings._docMaxWordCount,
            segmentlimit: $widget.settings._docMaxSegmentCount,
            termcorpusid: ($widget.termCorpusId && $widget.getSelectedTermCorpusStatus() == "Ready") ? $widget.termCorpusId : null,
        };

        if ($widget.settings._advancedOptions) {
            data["sendEmail"] = $('#sendEmail:checked').length > 0;
            if ($('#cbAddSourcePrefix:checked').length > 0) {
                data["sourcePrefix"] = $("#inputSourcePrefix").val();
            }
            if ($('#cbAddTargetPrefix:checked').length > 0) {
                data["targetPrefix"] = $("#inputTargetPrefix").val();
            }
            data["doNotReplaceExistingTranslation"] = $('#cbReplaceTarget:checked').length > 0;
            if ($('#cbLangSpec:checked').length > 0) {
                data["sourceLanguage"] = $(".tmxSourceLang option:selected").val();
                data["targetLanguage"] = $(".tmxTargetLang option:selected").val();
            }
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: $widget.settings._translateUrl,
            headers: $widget.getAuthHeaders(),
            data: data,
            success: function (response) {
                if (response.success) {
                    if ($widget.settings._warnWhenRunningAway) {
                        // IE10 somehow manages to rise unload event when starting
                        // this ajax request, so, must wait until it gets response before listening to "unload"
                        $(window).bind('beforeunload.warn', function () {
                            return uiResources[$widget.settings._language]["docTranslInProgress"];
                        });
                    }
                    if ($('#hidUploadTempId').length == 0) {
                        $('.docTranslateContent').after($('<input>', {
                            type: 'hidden',
                            id: 'hidUploadTempId',
                            value: response.docid
                        }));
                    }
                    else {
                        $('#hidUploadTempId').val(response.docid);
                    }

                    $widget.filePluginTranslateProgress(response.docid);

                    if (typeof ($widget.checkSystemStatus) !== "undefined")
                    {
                        $widget.checkSystemStatus();
                    }
                }
                else {

                    //error
                    if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                        $widget.settings._onDocTranslationError('', uiResources[$widget.settings._language]['E_FAILED_IN_TRANSLATION']);
                    }

                    if ($widget.settings._onDocTranslationStop && typeof ($widget.settings._onDocTranslationStop) === "function") {
                        $widget.settings._onDocTranslationStop();
                    }

                    $('.infoMessageBox').html(uiResources[$widget.settings._language]['E_FAILED_IN_TRANSLATION']).removeClass('hide');
                    $('.buttonDelDoc').addClass('hide');
                    $('.docUploadNewDoc').removeClass('hide');
                    $('.translateContainerRight').removeClass('docProgress');
                    $('#translProgress').html('');
                    if ($widget.settings._advancedOptions) {
                        $('.buttonAdvancedOptions').removeClass("hide");
                    }
                    if (typeof (console) !== "undefined") {
                        console.log(response);
                    }
                }
            },
            error: function (response, status, error) {
                //error

                if (response.status == 401 && $widget.settings._loginUrl) {
                    window.location = $widget.settings._loginUrl;
                }

                if (response.status == 403) {
                    var errorMsg = uiResources[$widget.settings._language]['E_UNAUTHORIZED'];
                }
                else {
                    var errorMsg = uiResources[$widget.settings._language]['E_FAILED_IN_TRANSLATION'];
                }

                if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                    $widget.settings._onDocTranslationError('', errorMsg);
                }

                if ($widget.settings._onDocTranslationStop && typeof ($widget.settings._onDocTranslationStop) === "function") {
                    $widget.settings._onDocTranslationStop();
                }

                $('.infoMessageBox').html(errorMsg).removeClass('hide');
                $('.buttonDelDoc').addClass('hide');
                $('.docUploadNewDoc').removeClass('hide');
                $('.translateContainerRight').removeClass('docProgress');
                $('#translProgress').html('');
                if ($widget.settings._advancedOptions) {
                    $('.buttonAdvancedOptions').removeClass("hide");
                }

                if (typeof (console) !== "undefined") {
                    console.error(error);
                }
            },
            complete: function () {
                $('#translProgress').removeClass('starting');
                $('#translProgress #transItem .percent').text($widget.settings._startPercent + '%');
            }
        });
    },

    filePluginEvents: function () {
        $('.docUploadNewDoc', $widget.settings.container).on('click', function () {
            $widget.filePluginUploadNew();
        });

        $('.buttonDelDoc', $widget.settings.container).on('click', function () {
            $widget.filePluginDeleteFile();
        });

        $('.buttonCancelDoc', $widget.settings.container).on('click', function () {
            if ($widget.settings._warnWhenRunningAway) {
                $(window).unbind('beforeunload.warn');
            }
            $widget.filePluginDeleteFile();
        });
        
        $('.translateButton', $widget.settings.container).on('click', function () {
            if ($(this).attr('data-disabled') === 'true') {
                return false;
            }
            $widget.filePluginTranslate();
        });
        if ($widget.settings._advancedOptions) {
            $('.buttonAdvancedOptions', $widget.settings.container).on('click', function () {
                $(".advancedOptions").toggleClass("hide");
                if ($(".buttonAdvancedOptions .btnText").text().indexOf("▾") > 0) {
                    $(".buttonAdvancedOptions .btnText").text($(".buttonAdvancedOptions .btnText").text().replace("▾", "▴"));
                } else {
                    $(".buttonAdvancedOptions .btnText").text($(".buttonAdvancedOptions .btnText").text().replace("▴", "▾"));
                }
            });
        }
    },

    filePluginUploadNew: function () {
        var uploadId = $('#hidUploadTempId').val();
        if (typeof (uploadId) == 'undefined') { uploadId = ''; }

        this.filePluginDeleteFileOnServer();

        $('.docUploadNewDoc').addClass('hide');
        $('.buttonDownDoc').removeAttr('href').addClass('hide');
        $('#hidTranslRealFilename').remove();
        $('#hidTranslTempFilename').remove();
        $('#hidUploadTempId').remove();
        $('.uploadedDocumentName').text('').addClass('hide');
        $('.qq-upload-list').html('');
        $('.transFileMeta').html('');
        $('.infoMessageBox').html('').addClass('hide');
        $('#hidStopTranslation').val('false');
        $('#docUploadFile').removeClass('hide');
        $('#docSourcePreview').empty();
        $('#docSourcePreview').addClass('hide');
        $('.translateTextTempSourceContainer style').remove();
        $('.translateResult').empty();
        if ($widget.settings._advancedOptions) {
            $('.buttonAdvancedOptions').removeClass("hide");
        }

        $widget.filePluginSetTempTextResult();

        $widget.enableSystemChange();
        $('.translateButton').addClass('hide');

        if ($widget.settings._onDocTranslationCancel && typeof ($widget.settings._onDocTranslationCancel) === "function") {
            $widget.settings._onDocTranslationCancel(uploadId);
        }

        // landing intro box
        if ($widget.settings._landingView) {
            $widget.filePluginShowIntro();
        }
    },

    filePluginShowIntro: function () {
        $('.translateContainerRight', $widget.settings.container).addClass('hide');
        $('.translateContainerLeft, .translateContainerHeader', $widget.settings.container).addClass('intro');
    },

    filePluginDeleteFile: function () {
        $('.docUploadNewDoc').click();

        $('.docTranslateContent').after($('<input>', {
            type: 'hidden',
            id: 'hidStopTranslation',
            value: true
        }));

        $('.buttonDelDoc, .buttonCancelDoc').addClass('hide');
        $('.translateContainerRight').removeClass('docProgress');

        this.filePluginSetTempTextResult();

        this.filePluginDeleteFileOnServer();
    },

    filePluginDeleteFileOnServer: function () {
        var uploadId = $('#hidUploadTempId').val();
        if (typeof (uploadId) == 'undefined') { uploadId = ''; }
        if (uploadId.length > 0) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: $widget.settings._deleteUrl,
                headers: $widget.getAuthHeaders(),
                data: {
                    docid: uploadId
                },
                success: function (response) {
                    if (!response.success) {
                        if (typeof (console) !== "undefined") {
                            console.error('error while deleting: ' + response.error);
                        }
                    }
                    $widget.enableSystemChange();
                },
                error: function (response) {
                    if (typeof (console) !== "undefined") {
                        console.error('error while deleting: ' + response.error);
                    }
                    if (response.status == 401 && $widget.settings._loginUrl) {
                        window.location = $widget.settings._loginUrl;
                    }
                    $widget.enableSystemChange();
                }
            });
        }
    },
    filePluginTranslateProgress: function (docid) {
        if ($('#hidStopTranslation').val() === 'true') {
            return;
        }

        if (!$('.translateContainerRight').hasClass('docProgress')) {
            $('.translateContainerRight').addClass('docProgress');
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: $widget.settings._checkStatusUrl,
            headers: $widget.getAuthHeaders(),
            data: {
                docId: docid
            },
            success: function (response) {
                // be positive 0% will be showed as 10%
                var completed = (response.completed < $widget.settings._startPercent) ? $widget.settings._startPercent : response.completed;
                $('#translProgress').removeClass('starting');
                $('#translProgress .percent').text(completed + '%');

                // callback on error
                if (response.status === 'error') {
                    var error_msg = uiResources[$widget.settings._language]['E_DEFAULT_ERROR'];

                    if (uiResources[$widget.settings._language][response.error]) {
                        error_msg = uiResources[$widget.settings._language][response.error];
                    }

                    $('.docUploadNewDoc').removeClass('hide');
                    $('.buttonCancelDoc').addClass('hide');
                    $('.infoMessageBox').html(error_msg).removeClass('hide');
                    $('#translProgress').html('');

                    if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                        $widget.settings._onDocTranslationError('', error_msg);
                    }

                    if ($widget.settings._onDocTranslationStop && typeof ($widget.settings._onDocTranslationStop) === "function") {
                        $widget.settings._onDocTranslationStop();
                    }
                }

                if (response.reload) {
                    $('.buttonCancelDoc').removeClass('hide');

                    if ($widget.settings._onDocTranslationProgress && typeof $widget.settings._onDocTranslationProgress === 'function') {
                        $widget.settings._onDocTranslationProgress(completed);
                    }

                    setTimeout(function () {
                        $widget.filePluginTranslateProgress(docid);
                    }, 5 * 1000); //refresh interval -> 10 seconds
                }
                else if (response.status === 'completed') {

                    if (response.warnings)
                    {
                        var warnings = response.warnings.split(",");
                        var errorMessages = [];
                        for (counter = 0; counter < warnings.length; counter++) {
                            if (uiResources[$widget.settings._language][warnings[counter]]) {
                                errorMessages.push(uiResources[$widget.settings._language][warnings[counter]]);
                            } else {
                                errorMessages.push(warnings[counter]);
                            }
                        }
                        $('.infoMessageBox').html(errorMessages.join("<br /> ")).removeClass('hide');
                    }

                    var down = $widget.settings._downloadUrl + '?docid=' + encodeURIComponent(docid)
                        + '&filename=' + encodeURIComponent(response.filename);

                    var authHeders = $widget.getAuthHeaders();
                    if (authHeders) {
                        if(authHeders["client-id"]){
                            down += "&clientId=" + encodeURIComponent(authHeders["client-id"]);
                        }
                        if (authHeders["website-auth-cookie"]) {
                            down += "&websiteAuthCookie=" + encodeURIComponent(authHeders["website-auth-cookie"]);
                        }
                    }

                    $('.buttonDownDoc').attr('href', down).attr('target', '_blank').removeClass('hide');
                    $('.buttonDelDoc').addClass('hide');
                    $('.buttonCancelDoc').addClass('hide');
                    $('#hidTranslRealFilename').remove();
                    $('#hidTranslTempFilename').remove();
                    $('.docUploadNewDoc').removeClass('hide');

                    if ($widget.settings._warnWhenRunningAway) {
                        $(window).unbind('beforeunload.warn');
                    }

                    // translation finish callback
                    if ($widget.settings._onDocTranslationFinished && typeof ($widget.settings._onDocTranslationFinished) === "function") {
                        $widget.settings._onDocTranslationFinished(docid);
                    }

                    var downloadFileName = response.filename;

                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: $widget.settings._previewUrl,
                        headers: $widget.getAuthHeaders(),
                        data: {
                            filename: downloadFileName,
                            docid: docid
                        },
                        success: function (response) {
                            if (response.success) {
                                if (response.preview) {
                                    $('.translateResult').html(response.preview);
                                    $('.translateResult').removeClass("bigIcon");
                                }
                                else {
                                    $('.translateResult').html('<a href="' + down + '" target="_blank"><div class="translated-no-preview"></div><span>' + downloadFileName + '</span></a>');
                                    $('.translateResult').addClass("bigIcon");
                                }
                            }
                            else {
                                $('.infoMessageBox').html(uiResources[$widget.settings._language]['docPreviewError']).removeClass('hide');
                            }
                            $('.translateContainerRight').removeClass('docProgress');
                            $('#translProgress').html('');
                        },
                        error: function (response) {
                            if (response.status == 401 && $widget.settings._loginUrl) {
                                window.location = $widget.settings._loginUrl;
                            }
                            //error
                            $('.infoMessageBox').html(uiResources[$widget.settings._language]['docPreviewError']).removeClass('hide');
                            $('.translateContainerRight').removeClass('docProgress');
                            $('#translProgress').html('');
                        }
                    });
                }
            },
            error: function (response) {
                if ($widget.settings._warnWhenRunningAway) {
                    $(window).unbind('beforeunload.warn');
                }
                if (response.status == 401 && $widget.settings._loginUrl) {
                    window.location = $widget.settings._loginUrl;
                } else {
                    var errorMsg = uiResources[$widget.settings._language]['docTranslFailed'];

                    $('.docUploadNewDoc').removeClass('hide');
                    $('.infoMessageBox').html(errorMsg).removeClass('hide');

                    if ($widget.settings._onDocTranslationError && typeof ($widget.settings._onDocTranslationError) === "function") {
                        $widget.settings._onDocTranslationError('FT_ERR_DOCSTATUS', errorMsg);
                    }
                }

            }
        });
    },

    filePluginGetTranslationStatus: function () {
        // possible values: blank, uploaded, translating, translated

        if ($('.qq-upload-file').length === 0) {
            return 'blank';
        }
        else if ($('.translateContainerRight').hasClass('docProgress')) {
            var href = $('.buttonDownDoc').attr('href');
            if (href !== undefined && href.length === 0) {
                return 'translating';
            }
            else {
                return 'translated';
            }
        }
        else {
            return 'uploaded';
        }
    },

    filePluginSetTempTextResult: function () {
        var txt = uiResources[$widget.settings._language]['docTempTarget'];

        if ($widget.settings._systemSelectType === 'domain') {
            var domain = $('.translateDomain option:selected', $widget.settings.container).text(),
                descr = uiResources[$widget.settings._language]['DOMAIN_' + domain.toUpperCase()];

            if (descr !== undefined) {
                txt = descr + '<p>' + txt + '</p>';
            }
        }

        $('.docTempTarget', $widget.settings.container).html(txt).removeClass('hide');
        $('.translateResult', $widget.settings.container).addClass('hide');
    }

});

Tilde.TranslatorWidget.prototype.pluginInitializers.push(Tilde.TranslatorWidget.prototype.filePluginInit);