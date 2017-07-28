﻿
var app = angular.module("myTranslatorApp", ['ngRoute', 'angular.filter', 'pascalprecht.translate'])
    /*.run(function ($rootScope) {
        $rootScope.language = 'ee';
        $rootScope.languages = ['en', 'ee'];

        $rootScope.localize = function (word) {
            var Estonian = {}
            Estonian["English"] = "Īnglise";
            Estonian["Estonian"] = "Eesti";

            if ($rootScope.language === 'ee') {
                return (Estonian[word]);
            }

            return word;
        }

        $rootScope.updateLanguage = function () {
            $scope.$translate.use($rootScope.language);
            $widget.settings._language = $rootScope.language;
            $widget.retrieveSystemData(function () {
                $widget.initPlugins();
            });
        };
    });*/

app.config(['$routeProvider',
  function ($routeProvider, $filter) {
      $routeProvider
        .when('/about', {
            templateUrl: 'templates/about.html',
            controller: 'myPageCtrl'
        })
        /*.when('/home', {
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl'
        })*/
        .when('/contactUs', {
            templateUrl: 'templates/contactUs.html',
            controller: 'myPageCtrl'
          })
          .when('/plugin', {
              templateUrl: 'templates/plugin.html',
              controller: 'myPageCtrl'
          })
          .when('/workshop', {
              templateUrl: 'templates/workshop.html',
              controller: 'myPageCtrl'
          })
        .when('/text', {
            templateUrl: 'templates/translate-text.html',
            controller: 'TranslateCtrl'
        })
          .when('/www', {
              templateUrl: 'templates/translate-website.html',
              controller: 'websiteTranslatorCtrl'
          })
           .when('/website', {
               templateUrl: 'templates/translate-website.html',
               controller: 'websiteTranslatorCtrl'
           })
           .when('/document', {
               templateUrl: 'templates/translate-document.html',
               controller: 'DocumentCtrl'
           })
        .otherwise({
            redirectTo: '/text'
        });
  }
]);

app.config(function ($translateProvider) {
    $translateProvider.translations('en', {
        MENU: 'Menu',
        MENU_ABOUT: 'About EU Presidency Translator',
        MENU_CONTACT: 'Contact us',
        MENU_PLUGIN: 'SDL Trados Studio plug-in',
        MENU_WORKSHOP: 'EU Presidency Translator workshop',
        TEXT: '<span class="transl_type_long">Translate text</span><span style="display:none" class="transl_type_short">Text</span>',
        DOC: '<span class="transl_type_long">Translate document</span><span style="display:none" class="transl_type_short">Document</span>',
        WEB: '<span class="transl_type_long">Translate website</span><span style="display:none" class="transl_type_short">Website</span>',
        POWERED: 'Powered by <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>, the EU\'s automated translation service',
        DEVELOPED: 'Developed by <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
        CONTACT1: 'For more information about EU Presidency Translator, or to receive a consultation about how to use the service, please contact us at <a href="mailto:info@translate2017.eu">info@translate2017.eu</a>.',
        CONTACT2: 'Staff translators working for the Estonian public administration can request a SDL Trados Studio plugin for EU Presidency Translator and receive customer support by contacting <a href="mailto:support@translate2017.eu">support@translate2017.eu</a>.',
        ABOUT1: 'EU Presidency Translator is an automated translation service specially designed for the <a href="https://www.eu2017.ee/" target="_blank">2017 Estonian Presidency of the Council of the European Union</a>.',
        ABOUT2: 'The service provides the world’s best automated translation systems for Estonian, built with the latest innovations in language technology. The systems can be used to translate texts, full documents, and websites.',
        ABOUT3: 'EU Presidency Translator also integrates the European Commission’s <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">CEF eTranslation platform</a>, which offers automated translation systems for translating between the 24 official languages of the EU.',
        ABOUT4: 'The Estonian-language automated translation systems and user interface of EU Presidency Translator were developed by <a href="https://www.tilde.com" target="_blank">Tilde</a>, a language technology company based in Tallinn, Riga, and Vilnius.',
        PLUGIN1: 'Instructions for use',
        PLUGIN2: '<ul><li>Download and install the EU Presidency Translator plug-in for SDL Trados Studio</li><li>In SDL Trados, select your language pair in Project Settings</li><li>Check "Use different translation providers for this language pair"</li><li>Add EU Presidency Translator</li><li>Enter your ID in the authentication window (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">request an ID</a>)</li><li>Start your project</li><li>Translation suggestions from your EU Presidency Translator system will appear on screen during the translation process (users can also apply EU Presidency Translator to pre-translate files in batch processing)</li></ul>',
        PLUGIN3: 'I accept the end-user license agreement.',
        PLUGIN4: 'Read agreement',
        PLUGIN5: 'Download',
        WORKSHOP_URL: 'presidency-translator-workshop-registration'
    })
    .translations('ee', {
        MENU: 'Menüü',
        MENU_ABOUT: 'Teenusest EU Presidency Translator',
        MENU_CONTACT: 'Kontaktteave',
        TEXT: '<span class="transl_type_long">Tõlgi tekst</span><span style="display:none" class="transl_type_short">Tekst</span>',
        DOC: '<span class="transl_type_long">Tõlgi dokument</span><span style="display:none" class="transl_type_short">Dokument</span>',
        WEB: '<span class="transl_type_long">Tõlgi veebileht</span><span style="display:none" class="transl_type_short">Veebileht</span>',
        POWERED: 'Platvorm: EL-i automaattõlketeenus <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>',
        DEVELOPED: 'Välja töötanud <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
        CONTACT1: 'Teenuse EU Presidency Translator kohta lisateabe saamiseks või teenuse kasutamise kohta nõu küsimiseks võtke meiega ühendust meiliaadressil <a href="mailto:info@translate2017.eu">info@translate2017.eu</a>.',
        CONTACT2: 'Meiliaadressi <a href="mailto:support@translate2017.eu">support@translate2017.eu</a> kaudu saavad Eesti riigiasutuste tõlkijad teenuse EU Presidency Translator jaoks taotleda SDL Trados Studio lisandmoodulit ja võtta ühendust klienditoega.',
        ABOUT1: 'EU Presidency Translator on automaattõlketeenus, mis on spetsiaalselt välja töötatud <a href="https://www.eu2017.ee/" target="_blank">Eesti Euroopa Liidu Nõukogu eesistumiseks 2017. aastal</a>.',
        ABOUT2: 'Teenus hõlmab eesti keele jaoks tipptasemel automaattõlkesüsteeme, mis rajanevad uusimatel keeletehnoloogiasaavutustel. Süsteeme saab kasutada tekstide, dokumentide ja veebisaitide tõlkimiseks.',
        ABOUT3: 'EU Presidency Translator on integreeritav ka Euroopa ühendamise rahastu toel valminud Euroopa Komisjoni <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">platvormiga eTranslation</a>, mille automaattõlkesüsteemid võimaldavad tõlkida EL-i 24 ametlikku keelt.',
        ABOUT4: 'EU Presidency Translator kasutajaliidese ja eesti keele automaattõlkesüsteemid töötas välja keeletehnoloogia alal tegutsev ettevõte <a href="https://www.tilde.com" target="_blank">Tilde</a>, kelle kontorid asuvad Tallinnas, Riias ja Vilniuses.',
        PLUGIN1: 'Instructions for use',
        PLUGIN2: '<ul><li>Download and install the EU Presidency Translator plug-in for SDL Trados Studio</li><li>In SDL Trados, select your language pair in Project Settings</li><li>Check "Use different translation providers for this language pair"</li><li>Add EU Presidency Translator</li><li>Enter your ID in the authentication window (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">request an ID</a>)</li><li>Start your project</li><li>Translation suggestions from your EU Presidency Translator system will appear on screen during the translation process (users can also apply EU Presidency Translator to pre-translate files in batch processing)</li></ul>',
        PLUGIN3: 'Nõustun lõppkasutaja litsentsilepinguga.',
        PLUGIN4: 'Lugege lepingut',
        PLUGIN5: 'Laadi alla',
        WORKSHOP_URL: 'presidency-translator-workshop-registration-ee'
    });

    $translateProvider.preferredLanguage('en');
});





