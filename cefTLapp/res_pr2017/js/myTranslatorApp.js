
var app = angular.module("myTranslatorApp", ['ngRoute', 'angular.filter', 'pascalprecht.translate']);
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
        MENU_ABOUT: 'About Translate 2017',
        MENU_CONTACT: 'Contact us',
        TEXT: 'Translate text',
        DOC: 'Translate document',
        WEB: 'Translate website',
        POWERED: 'Powered by <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>, the EU\'s automated translation service',
        DEVELOPED: 'Developed by <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
        CONTACT1: 'For more information about Translate 2017, or to receive a consultation about how to use the service, please contact us at <a href="mailto:info@translate2017.eu">info@translate2017.eu</a>.',
        CONTACT2: 'Staff translators working for the Estonian public administration can request a SDL Trados Studio plugin for Translate 2017 and receive customer support by contacting <a href="mailto:support@translate2017.eu">support@translate2017.eu</a>.',
        ABOUT1: 'Translate 2017 is an automated translation service specially designed for the <a href="https://www.eu2017.ee/" target="_blank">2017 Estonian Presidency of the Council of the European Union</a>.',
        ABOUT2: 'The service provides the world’s best automated translation systems for Estonian, built with the latest innovations in language technology. The systems can be used to translate texts, full documents, and websites.',
        ABOUT3: 'Translate 2017 also integrates the European Commission’s <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">CEF eTranslation platform</a>, which offers automated translation systems for translating between the 24 official languages of the EU.',
        ABOUT4: 'The Estonian-language automated translation systems and user interface of Translate 2017 were developed by <a href="https://www.tilde.com" target="_blank">Tilde</a>, a language technology company based in Tallinn, Riga, and Vilnius.'
    })
    .translations('ee', {
        MENU: 'Menüü',
        MENU_ABOUT: 'Teenusest Translate 2017',
        MENU_CONTACT: 'Kontaktteave',
        TEXT: 'Tõlgi tekst',
        DOC: 'Tõlgi dokument',
        WEB: 'Tõlgi veebileht',
        POWERED: 'Platvorm: EL-i automaattõlketeenus <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>',
        DEVELOPED: 'Välja töötanud <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
        CONTACT1: 'Teenuse Translate 2017 kohta lisateabe saamiseks või teenuse kasutamise kohta nõu küsimiseks võtke meiega ühendust meiliaadressil <a href="mailto:info@translate2017.eu">info@translate2017.eu</a>.',
        CONTACT2: 'Meiliaadressi <a href="mailto:support@translate2017.eu">support@translate2017.eu</a> kaudu saavad Eesti riigiasutuste tõlkijad teenuse Translate 2017 jaoks taotleda SDL Trados Studio lisandmoodulit ja võtta ühendust klienditoega.',
        ABOUT1: 'Translate 2017 on automaattõlketeenus, mis on spetsiaalselt välja töötatud <a href="https://www.eu2017.ee/" target="_blank">Eesti Euroopa Liidu Nõukogu eesistumiseks 2017. aastal</a>.',
        ABOUT2: 'Teenus hõlmab eesti keele jaoks tipptasemel automaattõlkesüsteeme, mis rajanevad uusimatel keeletehnoloogiasaavutustel. Süsteeme saab kasutada tekstide, dokumentide ja veebisaitide tõlkimiseks.',
        ABOUT3: 'Translate 2017 on integreeritav ka Euroopa ühendamise rahastu toel valminud Euroopa Komisjoni <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">platvormiga eTranslation</a>, mille automaattõlkesüsteemid võimaldavad tõlkida EL-i 24 ametlikku keelt.',
        ABOUT4: 'Translate 2017 kasutajaliidese ja eesti keele automaattõlkesüsteemid töötas välja keeletehnoloogia alal tegutsev ettevõte <a href="https://www.tilde.com" target="_blank">Tilde</a>, kelle kontorid asuvad Tallinnas, Riias ja Vilniuses.'
    });

    $translateProvider.preferredLanguage('en');
});





