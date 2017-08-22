
var app = angular.module("myTranslatorApp", ['ngRoute', 'angular.filter', 'pascalprecht.translate'])
    .run(function ($rootScope) {
        $rootScope.language = 'en';
        $rootScope.languages = ['en', 'ee'];
        $rootScope.workshopURLs = {
            'en': 'https://www.tilde.lv/presidency-translator-workshop-registration',
            'ee': 'https://www.tilde.lv/presidency-translator-workshop-registration-ee'
        }
    })
    .filter('trustAsResourceUrl', ['$sce', function ($sce) {
        return function (val) {
            return $sce.trustAsResourceUrl(val);
        };
    }]);

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
        MENU_ABOUT: 'About Translate 2017',
        MENU_CONTACT: 'Contact us',
        MENU_PLUGIN: 'SDL Trados Studio plug-in',
        MENU_WORKSHOP: 'Translate 2017 workshop',
        TEXT: '<span class="transl_type_long">Translate text</span><span style="display:none" class="transl_type_short">Text</span>',
        DOC: '<span class="transl_type_long">Translate document</span><span style="display:none" class="transl_type_short">Document</span>',
        WEB: '<span class="transl_type_long">Translate website</span><span style="display:none" class="transl_type_short">Website</span>',
        POWERED: 'Powered by <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>, the EU\'s automated translation service',
        DEVELOPED: 'Developed by <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
        CONTACT1: 'For more information about Translate 2017, or to receive a consultation about how to use the service, please contact us at <a href="mailto:info@translate2017.eu">info@translate2017.eu</a>.',
        CONTACT2: 'Staff translators working for the Estonian public administration can request a SDL Trados Studio plugin for Translate 2017 and receive customer support by contacting <a href="mailto:support@translate2017.eu">support@translate2017.eu</a>.',
        ABOUT1: 'Translate 2017 is an automated translation service specially designed for the <a href="https://www.eu2017.ee/" target="_blank">2017 Estonian Presidency of the Council of the European Union</a>.',
        ABOUT2: 'The service provides the world’s best automated translation systems for Estonian, built with the latest innovations in language technology. The systems can be used to translate texts, full documents, and websites.',
        ABOUT3: 'Translate 2017 also integrates the European Commission’s <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">CEF eTranslation platform</a>, which offers automated translation systems for translating between the 24 official languages of the EU.',
        ABOUT4: 'The Estonian-language automated translation systems and user interface of Translate 2017 were developed by <a href="https://www.tilde.com" target="_blank">Tilde</a>, a language technology company based in Tallinn, Riga, and Vilnius.',
        PLUGIN1: 'Instructions for use',
        PLUGIN2: '<ul><li>Download and install the Translate 2017 plug-in for SDL Trados Studio.</li><li>In SDL Trados, select your language pair in Project Settings.</li><li>Check "Use different translation providers for this language pair".</li><li>Add Translate 2017.</li><li>Enter your ID in the authentication window (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">request an ID</a>).</li><li>Start your project.</li><li>Translation suggestions from your Translate 2017 system will appear on screen during the translation process (users can also apply Translate 2017 to pre-translate files in batch processing).</li></ul>',
        PLUGIN3: 'I accept the end-user license agreement.',
        PLUGIN4: 'Read agreement',
        PLUGIN5: 'Download',
        WORKSHOP_URL: 'presidency-translator-workshop-registration',
        WORKSHOP1: '<table class="workshop_table"><tr><td>What:</td><td>Translate 2017 workshop</td></tr><tr><td>Where:</td><td><a href="http://www.nlib.ee/en" target="_blank">Estonian National Library [TBC]</a></td></tr><tr><td>When:</td><td>[TBC]</td></tr></table>',
        WORKSHOP2: 'About',
        WORKSHOP3: 'This workshop for EU Council Presidency translators, staff members, and Estonian public sector communications professionals will introduce the Translate 2017, an automated translation service specially designed for the 2017 Estonian Presidency of the Council of the European Union.',
        WORKSHOP4: 'The Translate 2017 is freely available to all Estonian public sector translators for the duration of the Estonian EU Council Presidency. The service provides the world’s best automated translation systems for Estonian, built with the latest innovations in language technology, and can be used to translate texts, full documents, and websites.',
        WORKSHOP5: 'In this workshop, organized by the Tallinn-based language technology company Tilde, translators and other communications professionals will<ul><li>learn how to leverage machine translation in their work, making their daily translation tasks easier and more efficient,</li><li>gain insight into the EU’s efforts to provide a pan-European machine translation infrastructure for all public administrations and citizens,</li><li>acquire practical knowledge about how to boost their translation productivity with the Translate 2017.</li></ul>',
        WORKSHOP6: 'Agenda',
        WORKSHOP7: '<table class="workshop_table"><tr><td>13:30-13:45:</td><td>Trends in machine translation technology (in English, presented by Tilde)</td></tr><tr><td>13:45-14:00:</td><td>About the EU’s automated translation platform, CEF eTranslation (in English, presented by Tilde)</td></tr><tr><td>14:00-14:15:</td><td>Introducing the Translate 2017 for Estonia (in Estonian, presented by Tilde)</td></tr><tr><td>14:15-15:00:</td><td>Translate 2017 for EU Council Presidency translators and staff – how to post-edit Estonian texts with online translation tool (in Estonian, presented by Tilde)</td></tr><tr><td>15:00-15:20:</td><td>Coffee break</td></tr><tr><td>15:20-16:00:</td><td>Translate 2017 for public sector translators – how to post-edit Estonian texts with the SDL Trados Studio plugin (in Estonian, presented by Tilde)</td></tr></table>',
        WORKSHOP8: 'Registration',
        WORKSHOP9: 'https://www.tilde.lv/presidency-translator-workshop-registration'
    })
    .translations('ee', {
        MENU: 'Menüü',
        MENU_ABOUT: 'Teenusest Translate 2017',
        MENU_CONTACT: 'Kontaktteave',
        MENU_PLUGIN: 'SDL Trados Studio lisandmoodul ',
        MENU_WORKSHOP: 'EL-i eesistumise tõlketööriista töötuba',
        TEXT: '<span class="transl_type_long">Tõlgi tekst</span><span style="display:none" class="transl_type_short">Tekst</span>',
        DOC: '<span class="transl_type_long">Tõlgi dokument</span><span style="display:none" class="transl_type_short">Dokument</span>',
        WEB: '<span class="transl_type_long">Tõlgi veebileht</span><span style="display:none" class="transl_type_short">Veebileht</span>',
        POWERED: 'Platvorm: EL-i automaattõlketeenus <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>',
        DEVELOPED: 'Välja töötanud <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
        CONTACT1: 'Teenuse Translate 2017 kohta lisateabe saamiseks või teenuse kasutamise kohta nõu küsimiseks võtke meiega ühendust meiliaadressil <a href="mailto:info@translate2017.eu">info@translate2017.eu</a>.',
        CONTACT2: 'Meiliaadressi <a href="mailto:support@translate2017.eu">support@translate2017.eu</a> kaudu saavad Eesti riigiasutuste tõlkijad teenuse Translate 2017 jaoks taotleda SDL Trados Studio lisandmoodulit ja võtta ühendust klienditoega.',
        ABOUT1: 'Translate 2017 on automaattõlketeenus, mis on spetsiaalselt välja töötatud <a href="https://www.eu2017.ee/" target="_blank">Eesti Euroopa Liidu Nõukogu eesistumiseks 2017. aastal</a>.',
        ABOUT2: 'Teenus hõlmab eesti keele jaoks tipptasemel automaattõlkesüsteeme, mis rajanevad uusimatel keeletehnoloogiasaavutustel. Süsteeme saab kasutada tekstide, dokumentide ja veebisaitide tõlkimiseks.',
        ABOUT3: 'Translate 2017 on integreeritav ka Euroopa ühendamise rahastu toel valminud Euroopa Komisjoni <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">platvormiga eTranslation</a>, mille automaattõlkesüsteemid võimaldavad tõlkida EL-i 24 ametlikku keelt.',
        ABOUT4: 'Translate 2017 kasutajaliidese ja eesti keele automaattõlkesüsteemid töötas välja keeletehnoloogia alal tegutsev ettevõte <a href="https://www.tilde.com" target="_blank">Tilde</a>, kelle kontorid asuvad Tallinnas, Riias ja Vilniuses.',
        PLUGIN1: 'Kasutusjuhend',
        PLUGIN2: '<ul><li>Laadige alla ja installige EL-i eesistumise tõlketööriista lisandmoodul SDL Trados Studio jaoks.</li><li>Valige SDL Tradose jaotises „Project Settings“ (Projekti sätted) oma keelepaar.</li><li>Märkige ruut „Use different translation providers for this language pair“ (Kasuta selle keelepaari jaoks erinevaid tõlketeenuse pakkujaid).</li><li>Lisage EL-i eesistumise tõlketööriist.</li><li>Sisestage autentimisaknasse oma ID (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">ID-d saab taotleda veebilehel</a>)</li><li>Avage oma projekt.</li><li>Tõlkimise käigus kuvatakse EL-i eesistumise tõlketööriistas tõlkesoovitused (kasutajatel on võimalus lasta EL-i eesistumise tõlketööriistal failid pakktöötlustoiminguga ka eeltõlkida).</li></ul>',
        PLUGIN3: 'Nõustun lõppkasutaja litsentsilepinguga.',
        PLUGIN4: 'Lugege lepingut',
        PLUGIN5: 'Laadi alla',
        WORKSHOP_URL: 'presidency-translator-workshop-registration-ee',
        WORKSHOP1: '<table class="workshop_table"><tr><td>Üritus:</td><td>EL-i eesistumise tõlketööriista kasutamise töötuba</td></tr><tr><td>Toimumiskoht:</td><td><a href="http://www.nlib.ee/kuppelsaal-4/" target="_blank">Rahvusraamatukogu Kuppelsaal [TBC]</a></td></tr><tr><td>Aeg:</td><td>[TBC]</td></tr></table>',
        WORKSHOP2: 'Teave',
        WORKSHOP3: 'Euroopa Liidu Nõukogu eesistumisega seotud tõlkijatel, töötajatel ja Eesti avaliku sektori kommunikatsioonispetsialistidel on võimalus osaleda töötoas, kus tutvustatakse EL-i eesistumise tõlketööriista &#8211; automaattõlketeenust, mis on välja töötatud just Eesti Euroopa Liidu Nõukogu 2017. aasta eesistumise jaoks.',
        WORKSHOP4: 'EL-i eesistumise tõlketööriist on vabalt kättesaadav kõigile Eesti avaliku sektori tõlkijatele kogu Eesti Euroopa Liidu Nõukogu eesistumise ajaks. Teenus pakub maailma parimat eesti keele jaoks loodud automaattõlkesüsteemi, mille arendamisel on kasutatud uusimaid keeletehnoloogialahendusi ning mida saab kasutada tekstide, dokumentide ja veebilehtede tõlkimiseks.',
        WORKSHOP5: '2,5-tunnises töötoas, mille korraldaja on Tallinnas tegutsev keeletehnoloogiaettevõtte Tilde, saavad tõlkijad ja teised kommunikatsioonispetsialistid teada,<ul><li>kuidas kasutada töös masintõlget, mis aitab muuta igapäevase tõlketöö lihtsamaks ja tõhusamaks,</li><li>milline on Euroopa Liidu panus üleeuroopalise masintõlketaristu loomisse riigiasutuste ja kodanike jaoks ning,</li><li>kuidas oma praktilises töös suuurenda tõlkeviljakust EL-i eesistumise tõlketööriista abil.</li></ul>',
        WORKSHOP6: 'Päevakava',
        WORKSHOP7: '<table class="workshop_table"><tr><td>13.30-13.45:</td><td>Masintõlketehnoloogia arengusuunad (inglise keeles, esineja Tilde)</td></tr><tr><td>13:45-14:00:</td><td>Ülevaade Euroopa Liidu automaattõlkeplatvormist CEF eTranslation (inglise keeles, esineja Tilde)</td></tr><tr><td>14:00-14:15:</td><td>Eesti keele jaoks loodud EL-i eesistumise tõlketööriista tutvustus (eesti keeles, esineja Tilde)</td></tr><tr><td>14:15-15:00:</td><td>EL-i eesistumise tõlketööriist Euroopa Liidu Nõukogu eesistumise tõlkijatele ja töötajatele: eestikeelsete tekstide järeltoimetamine veebitõlketööriista abil (eesti keeles, esineja Tilde)</td></tr><tr><td>15:00-15:20:</td><td>Kohvipaus</td></tr><tr><td>15:20-16:00:</td><td>EL-i eesistumise tõlketööriist avaliku sektori tõlkijatele: eestikeelsete tekstide järeltoimetamine SDL Trados Studio lisandmooduli abil (eesti keeles, esineja Tilde)</td></tr></table>',
        WORKSHOP8: 'Registreerimine',
        WORKSHOP9: 'https://www.tilde.lv/presidency-translator-workshop-registration-ee'
    });

    $translateProvider.preferredLanguage('en');
});


    


