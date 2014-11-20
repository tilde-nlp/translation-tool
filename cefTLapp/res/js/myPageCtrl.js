app.controller("myPageCtrl", function ($scope, $location) {      
    
    $scope.isActive = function (viewLocation) {
        var active = ("/" + viewLocation === $location.path());
        return active;
    };

    $scope.website = {};
    $scope.controls = {};
    $scope.website.base = "http://letsmt-logic.tilde.lv/en";
    $scope.website.url = '';
    $scope.website.freeze = false;
    $scope.website.status='initial';
    $scope.website.focus = false;
    $scope.website.frame = jQuery("#websiteFrame")[0].contentWindow;

    $scope.updateWebsite = function () {
        if ($scope.isActive('website') ||  $scope.website.status!='initial')
        {
            $scope.initWebsite();
        } else {
            $location.path('/website');//?embeddedStyle=noUI
            window.open($scope.website.base + "/Translate/WebsiteEmbedded?embeddedStyle=noUI", "websiteFrame");
            $scope.website.frame = jQuery("#websiteFrame")[0].contentWindow;
        }
    };

    $scope.initWebsite = function () {      
        $scope.website.changeSystem();
        $scope.website.loadUrl(true);
    };

    $scope.website.loadUrl = function (translateAfterLoad) {
        console.log("Es: loadURL + translate it:  " + $scope.website.url);
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
        $scope.website.frame.postMessage({ "message": "untranslate", },"*");
    }

    $scope.website.changeSystem = function () {
        console.log("Es: change system to " + $scope.controls.activeSystem.id);
        jQuery("#websiteFrame")[0].contentWindow.postMessage({ "message": "changeSystem", "systemId": $scope.controls.activeSystem.id },
          "*");
    }

    $scope.loadURL = function () {        
        if ($event.which === 13) {
            $scope.website.loadUrl();
        }
    }

    /*end of language controls*/
     initEvents();
});

app.controller('TranslateCtrl', function ($scope, $routeParams) {     
   
        var widget = new Tilde.TranslatorWidget('#widget', {
            _language: 'en',
            _templateId: 'translatetext-template',
            _appId: "presidencyMT",         
            _onWidgetLoaded: function () {
                //console.log('_onWidgetLoaded()');
            },
            _onSystemChanged: function (id) {
                //console.log('_onSystemChanged(' + id + ')');
            },
            _replaceContainer: true
        });    
});

app.controller('websiteTranslatorCtrl', function ($scope, $routeParams) {
   
    $scope.controls.systems = $widget.settings._systems; /*language controls $widget.settings._systems*/
     $scope.controls.activeSystem = {};
     $scope.controls.activeSystem = $scope.controls.activeSystemSource = $scope.controls.systems[0];
     $scope.controls.updated = function ()
     {
         jQuery("#websiteFrame")[0].contentWindow.postMessage(
                    { "method": "changeSystem", "systemId": $scope.controls.activeSystem.id },
                      $scope.website.base);
         console.log($scope.controls.activeSystem.id);
     };
    $scope.controls.activeSystem = {};
    $scope.controls.activeSystem = $scope.controls.activeSystemSource = $scope.controls.systems[0];
    $scope.controls.updated = function () {
        jQuery("#websiteFrame")[0].contentWindow.postMessage(
                   { "method": "changeSystem", "systemId": $scope.controls.activeSystem.id },
                     $scope.website.base);
        console.log($scope.controls.activeSystem.id);
    };   
});

app.directive('ngMessage', function ($window) {
    return {
        link: function (scope) {
            angular.element($window).on('message', function (event) {              
                if (event.originalEvent) event = event.originalEvent;                      
                if (event.data && event.data.message)
                {
                    console.log("Tu: "+event.data.message);                  
                    switch (event.data.message) {
                        case "urlLoaded":
                            scope.website.url = event.data.url;
                            console.log(event.data.url);
                            break;
                        case "startedLoading":
                            scope.website.freeze = true;
                            scope.website.status = 'loading';
                            break;
                        case "stoppedLoading":
                            scope.website.freeze = false;
                            //scope.website.status = 'loaded';
                            break;
                        case "systemChanged":
                            console.log("Tu: " + event.data.systemId);
                            break;
                        case "translationStarted":
                            scope.website.freeze = true;
                            scope.website.status = 'translating';
                            break;
                        case "translationStopped":
                            scope.website.status = 'loaded';
                            scope.website.freeze = false;
                            break;
                        case "translated":
                            scope.website.status = 'translated';
                            scope.website.freeze = false;
                            break;
                        case "untranslated":
                            scope.website.status = 'loaded';
                            scope.website.freeze = false;
                            break;
                        case "ready":                            
                            scope.initWebsite();
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

app.directive('focusOn',function($timeout) {
    return {
        restrict : 'A',
        link : function($scope,$element,$attr) {
            $scope.$watch($attr.focusOn,function(_focusVal) {
                $timeout(function() {
                    _focusVal ? $element.focus() :
                        $element.blur();
                });
            });
        }
    }
})


function getSystems() {
    return [
                { "id": "smt-d8cdaa41-3837-499c-a923-562c6a8673d1", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "lv", "text": "Latvian" } }, "domain": "general", },
                { "id": "smt-6ad22e20-2277-4c8b-8125-96add0696475", "sourceLanguage": { "name": { "language": "lv", "text": "Latvian" } }, "targetLanguage": { "name": { "language": "en", "text": "English" } }, "domain": "geberal", }
    ];
}

function getSystems_test()
{
    return [
                { "id": "smt-62dd2ae1-4eb8-4458-a77b-74385d38479a", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "bg", "text": "Bulgarian" } }, "domain": "legal", },
                { "id": "smt-6db4383a-065a-4e73-b156-3a149c744570", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "cz", "text": "Czech" } }, "domain": "legal", },
                { "id": "smt-f5531cf0-0bcf-4ad5-9202-fae14065488d", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "dk", "text": "Danish" } }, "domain": "legal", },
                { "id": "smt-4ee1ed34-647e-48c1-838d-64eb3a9d89a3", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "nl", "text": "Dutch" } }, "domain": "legal", },
                { "id": "smt-9953e157-64dc-490a-8b71-f7a9e5e2828f", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "ee", "text": "Estonian" } }, "domain": "legal", },
                { "id": "smt-4882df5d-2105-4bea-97c7-b8783631e5aa", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "fi", "text": "Finnish" } }, "domain": "legal", },
                { "id": "smt-fcd8b27b-757f-4e4f-a580-f40e98759b77", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "fr", "text": "French" } }, "domain": "legal", },
                { "id": "smt-0eba8517-0cf8-43b9-8dc2-ed99b33e56b9", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "de", "text": "German" } }, "domain": "legal", },
                { "id": "smt-ef05abdf-7869-44fb-8067-b4d59e91179b", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "gr", "text": "Greek" } }, "domain": "legal", },
                { "id": "smt-c6b571b1-19f5-4b8b-8e06-25f0a22f8175", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "hu", "text": "Hungarian" } }, "domain": "legal", },
                { "id": "smt-46f66f61-4567-49d3-9a47-cf0e45969b0b", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "it", "text": "Italian" } }, "domain": "legal", },
                { "id": "smt-e3080087-866f-498b-977d-63ea391ba61e", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "lv", "text": "Latvian" } }, "domain": "legal", },
                { "id": "smt-5f850cd7-a5a6-40d6-b78a-0ec533a007d7", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "lt", "text": "Lithuanian" } }, "domain": "legal", },
                { "id": "smt-ca9c9b55-caef-4bfb-b5fa-41c657397734", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "pl", "text": "Polish" } }, "domain": "legal", },
                { "id": "smt-4d1ef8c2-d3c9-47da-9d55-7811dbd1ba15", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "pt", "text": "Portuguese" } }, "domain": "legal", },
                { "id": "smt-fe41b849-a778-442e-b6c1-5cdb8f40bb90", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "ro", "text": "Romanian" } }, "domain": "legal", },
                { "id": "smt-316bc361-3b08-4a0b-b73a-10af770c941b", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "ru", "text": "Russian" } }, "domain": "legal", },
                { "id": "smt-9a18d93b-b670-48f6-a34c-56305261c216", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "sl", "text": "Slovenian" } }, "domain": "legal", },
                { "id": "smt-b84be41d-0bfb-48ae-8b5c-a91ad219a954", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "es", "text": "Spanish" } }, "domain": "legal", },
                { "id": "smt-50623f40-8513-422e-9f85-5f7d0960b72f", "sourceLanguage": { "name": { "language": "en", "text": "English" } }, "targetLanguage": { "name": { "language": "se", "text": "Swedish" } }, "domain": "legal", },
                { "id": "smt-214cb238-f59f-41c5-99ab-5270ab74a5dc", "sourceLanguage": { "name": { "language": "lv", "text": "Latvian" } }, "targetLanguage": { "name": { "language": "ro", "text": "Romanian" } }, "domain": "pharmaceutical", },
                { "id": "smt-4f8104f8-a314-4b0f-a08d-c8eae860907f", "sourceLanguage": { "name": { "language": "lt", "text": "Lithuanian" } }, "targetLanguage": { "name": { "language": "en", "text": "English" } }, "domain": "pharmaceutical", },
                { "id": "smt-6b36e854-5afa-4cf0-a400-994eccdea802", "sourceLanguage": { "name": { "language": "lv", "text": "Latvian" } }, "targetLanguage": { "name": { "language": "es", "text": "Spanish" } }, "domain": "pharmaceutical", },
                { "id": "smt-8d4257f4-dfad-4fa0-827f-c1cca0eaed48", "sourceLanguage": { "name": { "language": "lv", "text": "Latvian" } }, "targetLanguage": { "name": { "language": "se", "text": "Swedish" } }, "domain": "pharmaceutical", }
    ];
}

function initEvents()
{
   
    $('#source.language').click(function () {
        $('#source ul').slideToggle(250);      
        return false;
    });
    $('#target.language').click(function () {
        $('#target ul').slideToggle(250);
        return false;
    });

    $('.language').mouseenter(function () {
            $(this).children('ul').css('display', 'none').stop(true, true).slideToggle(250).css('display', 'block').children('ul').css('display', 'none');
    });
 
    $('#source').mouseleave(function () {
        $('#source>ul').stop(true, true).fadeOut(250).css('display', 'none');
    })
    $('#target').mouseleave(function () {
        $('#target>ul').stop(true, true).fadeOut(250).css('display', 'none');
    })

}