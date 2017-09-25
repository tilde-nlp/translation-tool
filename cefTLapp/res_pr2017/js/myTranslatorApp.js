
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
        SUBTITLE: 'in cooperation with the Estonian Presidency of the Council of the EU',
        MENU: 'Menu',
        MENU_ABOUT: 'About Translate 2017',
        MENU_CONTACT: 'Contact us',
        MENU_PLUGIN: 'SDL Trados Studio plug-in',
        MENU_WORKSHOP: 'Translate 2017 workshop',
        TEXT: 'Translate text',
        TEXT_SHORT: 'Text',
        DOC: 'Translate document',
        DOC_SHORT: 'Document',
        WEB: 'Translate website',
        WEB_SHORT: 'Website',
        WEB_PLACEHOLDER: 'Type web address here...',
        WEB_EXAMPLES: 'Links to Estonian media and information resources:',
        WEB_REFRESH: 'Refresh',
        WEB_RETURN: 'Back',
        POWERED: 'Powered by <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>, the EU\'s automated translation service',
        DEVELOPED: 'Developed by <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
        CONTACT1: 'For more information about Translate 2017, or to receive a consultation about how to use the service, please contact us at <a href="mailto:info@translate2017.eu">info@translate2017.eu</a>.',
        CONTACT2: 'Staff translators working for the Estonian public administration can request a SDL Trados Studio plugin for Translate 2017 and receive customer support by contacting <a href="mailto:support@translate2017.eu">support@translate2017.eu</a>.',
        ABOUT1: 'The EU Council Presidency Translator is a multilingual communication tool that uses AI to instantly translate texts, documents, and websites between Estonian and English.',
        ABOUT2: 'Specially designed for delegates, journalists, and translators at Estonia’s <a href="https://www.eu2017.ee/" target="_blank">2017 EU Council Presidency</a>, the tool features the world’s first AI-powered Neural Machine Translation systems for Estonian.',
        ABOUT3: 'When translating, Neural MT systems examine the full context of a sentence, producing more fluent and readable translations that are almost human-like in style.',
        ABOUT4: 'The EU Council Presidency Translator complements Estonia’s e-government platform and is part of the European Commission’s <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">CEF eTranslation</a> infrastructure, which enables digital services to become fully multilingual.',
        ABOUT5: 'Developed by <a href="https://www.tilde.com" target="_blank">Tilde</a>, a language technology company based in Tallinn, Riga, and Vilnius',
        PLUGIN1: 'Instructions for use',
        PLUGIN2: '<ul><li>Download and install the Translate 2017 plug-in for SDL Trados Studio.</li><li>In SDL Trados, select your language pair in Project Settings.</li><li>Check "Use different translation providers for this language pair".</li><li>Add Translate 2017.</li><li>Enter your ID in the authentication window (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">request an ID</a>).</li><li>Start your project.</li><li>Translation suggestions from your Translate 2017 system will appear on screen during the translation process (users can also apply Translate 2017 to pre-translate files in batch processing).</li></ul>',
        PLUGIN3: 'I accept the end-user license agreement.',
        PLUGIN4: 'Read agreement',
        PLUGIN5: 'Download',
        WORKSHOP_URL: 'presidency-translator-workshop-registration',
        WORKSHOP1: '<table class="workshop_table"><tr><td>What:</td><td>EU Council Presidency Translator workshop</td></tr><tr><td>For whom:</td><td>2017 EU Council Presidency translators, staff members, and Estonian public sector communications professionals</td></tr><tr><td>Where:</td><td><a href="http://www.nlib.ee/en/cupola-hall-3/" target="_blank">National Library of Estonia, Cupola Hall</a></td></tr><tr><td>When:</td><td>September 27, 13:30-16:00</td></tr></table> ',
        WORKSHOP2: '<p>Registration is mandatory. Please fill out and submit the registration form below.</p><br/><br/>About',//<p><a href="#agenda">Register now!</a></p>
        WORKSHOP3: 'This workshop for EU Council Presidency translators, staff members, and Estonian public sector communications professionals will introduce the EU Council Presidency Translator toolkit, an automated translation service specially designed for the 2017 Estonian Presidency of the Council of the European Union.</p><p>The EU Council Presidency Translator is a multilingual communication tool that enables users to instantly translate texts, documents, and websites between Estonian and English. The EU Council Presidency Translator features the world’s first Estonian-English-Estonian machine translation systems built with Neural Networks, a high-powered approach to AI and machine learning. When translating, Neural MT systems examine the full context of a sentence, producing more fluent, readable, humanlike translations than ever.',
        WORKSHOP4: 'The tool is freely available to all Estonian public sector translators for the duration of the Estonian EU Council Presidency, for use either online or in the EU Council Presidency Translator plugin for SDL Trados Studio. The tool is powered by the <a target="_blank" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation"> CEF eTranslation</a> platform.',
        WORKSHOP5: 'In this workshop, organized by the language technology company Tilde, translators and other communications professionals will:<ul><li>learn how to leverage machine translation in their work, making their daily translation tasks easier and more efficient</li><li>discover the benefits of Neural MT, which is revolutionizing the world of translation by providing fluent, readable translations</li><li>gain insight into the EU’s efforts to provide a pan-European automated translation platform (CEF eTranslation) for all public administrations and citizens</li><li>acquire practical knowledge about how to boost their translation productivity with the EU Council Presidency Translator</li><li>watch a hands-on demo for using the EU Council Presidency Translator in SDL Trados Studio</li></ul>',
        WORKSHOP6: 'Agenda',
        WORKSHOP7: '<table id="agenda" class="workshop_table"><tr><td>13:30-13:45</td><td><p><b>Trends in machine translation technology<br/><i>Rihards Kalnins, Tilde (in English)</i></b></p><p>In this presentation, the audience will hear what’s new in machine translation technology, particularly Neural MT; learn recent applications of MT in localization, tech, e-commerce, and the public sector; and discover the benefits of Neural MT, which is revolutionizing the world of translation by providing fluent, readable, almost humanlike translations.</p></td></tr><tr><td>13:45-14:00</td><td> <p><b>Integrating the EU’s automated translation platform, CEF eTranslation<br/><i>Rihards Kalnins, Tilde (in English)</i></b></p><p>The EU’s automated translation platform CEF eTranslation enables public administrations to exchange information across language barriers. The platform is currently being integrated into cross-border digital platforms, including the EU Council Presidency Translator. Learn more about the integration of CEF eTranslation in this presentation!</p></td></tr><tr><td>14:00-14:15</td><td><p><b>Introducing the world’s first Neural MT engines for Estonian-English<br/><i>Kaspars Kaulins, Tilde (in Estonian)</i></b></p><p>The EU Council Presidency Translator features the world’s first Estonian MT systems built with Neural Networks, a high-powered approach to AI. Get a first look at the system’s performance for Estonian during this presentation, as well as an introduction to the many practical uses and benefits of the EU Council Presidency Translator.</p></td></tr><tr><td>14:15-15:00</td><td><p><b>How to post-edit Estonian texts with the EU Council Presidency Translator online translation tool<br/><i>Martin Luts, Tilde (in Estonian)</i></b></p><p>In this hands-on presentation, you will learn how to use the EU Council Presidency online translation tool to translate texts, documents, and websites, as well as practical advice on how to easily post-edit translations. The presentation will also touch on the specific aspects of developing machine translation for Estonian.</p></td></tr><tr><td>15:00-15:20</td><td><p><b>Coffee break</b></p></td></tr><tr><td>15:20-16:00</td><td><p><b>Tips for post-editing Estonian texts with the SDL Trados Studio plugin<br/><i>Katre Sepp, Tilde (in Estonian)</i></b></p><p>The EU Council Presidency Translator is also available as a plugin for SDL Trados Studio, helping translators to boost productivity in their everyday work. Learn how to use the plugin, including tips and tricks for post-editing Estonian texts in CAT tools, in this comprehensive presentation.</p></td></tr></table>',
        WORKSHOP8: 'Registration',
        WORKSHOP9: 'https://www.tilde.lv/presidency-translator-workshop-registration',
        CO_FINANCED_LOGO: 'img/CoFinanced_en.png',
        CO_FINANCED_ALT: 'Co-financed by the European Union'
    })
    .translations('ee', {
        SUBTITLE: 'koostöös Euroopa Nõukogu Eesti eesistumisega',
        MENU: 'Menüü',
        MENU_ABOUT: 'Teenusest Translate 2017',
        MENU_CONTACT: 'Kontaktteave',
        MENU_PLUGIN: 'SDL Trados Studio lisandmoodul ',
        MENU_WORKSHOP: 'EL-i eesistumise tõlketööriista töötuba',
        TEXT: 'Tõlgi tekst',
        TEXT_SHORT: 'Tekst',
        DOC: 'Tõlgi dokument',
        DOC_SHORT: 'Dokument',
        WEB: 'Tõlgi veebileht',
        WEB_SHORT: 'Veebileht',
        WEB_PLACEHOLDER: 'Kirjuta web-i aadress siia...',
        WEB_EXAMPLES: 'Lingid Eesti meedia ja informatsiooni allikatele:',
        WEB_REFRESH: 'Uuendada',
        WEB_RETURN: 'Tagasi',
        POWERED: 'Platvorm: EL-i automaattõlketeenus <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>',
        DEVELOPED: 'Välja töötanud <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
        CONTACT1: 'Teenuse Translate 2017 kohta lisateabe saamiseks või teenuse kasutamise kohta nõu küsimiseks võtke meiega ühendust meiliaadressil <a href="mailto:info@translate2017.eu">info@translate2017.eu</a>.',
        CONTACT2: 'Meiliaadressi <a href="mailto:support@translate2017.eu">support@translate2017.eu</a> kaudu saavad Eesti riigiasutuste tõlkijad teenuse Translate 2017 jaoks taotleda SDL Trados Studio lisandmoodulit ja võtta ühendust klienditoega.',
        ABOUT1: 'EL-i Nõukogu eesistumise tõlketööriist on mitmekeelne tehisintellektil põhinev suhtlusvahend, mis võimaldab kiiresti tõlkida tekste, dokumente ja veebilehti eesti ja inglise keeles. ',
        ABOUT2: 'Tööriist, mis on mõeldud spetsiaalselt Eesti <a href="https://www.eu2017.ee/" target="_blank">EL-i Nõukogu 2017. aasta eesistumisega</a> seotud delegaatidele, ajakirjanikele ja tõlkijatele, on esimene eesti keele jaoks loodud masintõlkesüsteem, mis põhineb närvivõrkudel ja tehisintellektil.',
        ABOUT3: 'Tõlkimise käigus uurivad närvivõrkudel põhinevad masintõlkesüsteemid lause kogu konteksti ning loovad senisest soravama, paremini loetava ja inimlähedasema tõlketeksti.',
        ABOUT4: 'EL-i Nõukogu eesistumise tõlketööriist täiendab Eesti e-valitsuse lahendusi ning on osa Euroopa Komisjoni platvormist <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">CEF eTranslation</a>, mille eesmärk on muuta digiteenused täielikult mitmekeelseks. ',
        ABOUT5: 'Tööriista on välja töötanud keeletehnoloogiaga tegelev ettevõtte <a href="https://www.tilde.com" target="_blank">Tilde</a>, mis tegutseb Tallinnas, Riias ja Vilniuses',
        PLUGIN1: 'Kasutusjuhend',
        PLUGIN2: '<ul><li>Laadige alla ja installige EL-i eesistumise tõlketööriista lisandmoodul SDL Trados Studio jaoks.</li><li>Valige SDL Tradose jaotises „Project Settings“ (Projekti sätted) oma keelepaar.</li><li>Märkige ruut „Use different translation providers for this language pair“ (Kasuta selle keelepaari jaoks erinevaid tõlketeenuse pakkujaid).</li><li>Lisage EL-i eesistumise tõlketööriist.</li><li>Sisestage autentimisaknasse oma ID (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">ID-d saab taotleda veebilehel</a>)</li><li>Avage oma projekt.</li><li>Tõlkimise käigus kuvatakse EL-i eesistumise tõlketööriistas tõlkesoovitused (kasutajatel on võimalus lasta EL-i eesistumise tõlketööriistal failid pakktöötlustoiminguga ka eeltõlkida).</li></ul>',
        PLUGIN3: 'Nõustun lõppkasutaja litsentsilepinguga.',
        PLUGIN4: 'Lugege lepingut',
        PLUGIN5: 'Laadi alla',
        WORKSHOP_URL: 'presidency-translator-workshop-registration-ee',
        WORKSHOP1: '<table  id="agenda" class="workshop_table"><tr><td>Üritus:</td><td>EL-i Nõukogu eesistumise tõlketööriista kasutamise töötuba</td></tr><tr><td>Sihtrühm:</td><td>2017. a. EL-i Nõukogu eesistumisega seotud tõlkijad, töötajad ja Eesti avaliku sektori kommunikatsioonispetsialistid</td></tr><tr><td>Toimumiskoht:</td><td><a href="http://www.nlib.ee/kuppelsaal-4/" target="_blank">Eesti Rahvusraamatukogu, Kuppelsaal</a></td></tr><tr><td>Aeg:</td><td>27. september, 13.30–16.00</td></tr></table>',
        WORKSHOP2: '<p>Registreerimine on kohustuslik. Palun täida ning saada meile allolev registreerimisvorm.</p><br/><br/>Teave',
        WORKSHOP3: 'Euroopa Liidu Nõukogu eesistumisega seotud tõlkijatel, töötajatel ja Eesti avaliku sektori kommunikatsioonispetsialistidel on võimalus osaleda töötoas, kus tutvustatakse EL-i Nõukogu eesistumise tõlketööriista – automaattõlketeenust, mis on välja töötatud just Eesti Euroopa Liidu Nõukogu 2017. aasta eesistumise jaoks.',
        WORKSHOP4: 'EL-i Nõukogu eesistumise tõlketööriist on mitmekeelne suhtlusvahend, mis võimaldab kasutajatel tõlkida kiiresti tekste, dokumente ja veebilehti eesti ja inglise keeles. Tõlketööriist hõlmab maailma esimest eesti-inglise-eesti masintõlkesüsteemi, mille loomisel on kasutatud ulatuslikult tehisintellektile ja masinõppele tuginevaid närvivõrke. Tõlkimise käigus uurivad närvivõrkudel põhineva masintõlke süsteemid lause kogu konteksti ja loovad seni saavutatust oluliselt soravama, paremini loetava ja inimlähedasema tõlketeksti.</p><p>Tõlketööriist on vabalt kättesaadav kõigile Eesti avaliku sektori tõlkijatele kogu Eesti Euroopa Liidu Nõukogu eesistumise ajaks. Seda saab kasutada kas veebis või programmi SDL Trados Studio jaoks mõeldud tõlketööriista lisandmooduli abil. Tõlketööriist töötab platvormil <a target="_blank" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation"> CEF eTranslation</a>.',
        WORKSHOP5: 'Keeletehnoloogiaettevõtte Tilde korraldatud töötoas tutvuvad tõlkijad ja teised kommunikatsioonispetsialistid järgnevaga:<ul><li>kuidas kasutada töös masintõlget, mis aitab muuta igapäevase tõlketöö lihtsamaks ja tõhusamaks,</li><li>millised eeliseid annab närvivõrkudel põhinev masintõlge, mille soravad ja hästiloetavad tõlketekstid on tegemas revolutsiooni tõlkemaailmas,</li><li>milline on Euroopa Liidu panus üleeuroopalise automaattõlke platvormi (CEF eTranslation) loomisse riigiasutuste ja kodanike jaoks ning,</li><li>omandavad praktilisi teadmisi kuidas tõlketööriista abil oma tõlkeviljakust suurendada,</li><li>kuidas töötab tõlketööriist programmis SDL Trados Studio, vaadates selle kohta praktilist demonstratsiooni.</li></ul>',
        WORKSHOP6: 'Päevakava',
        WORKSHOP7: '<table class="workshop_table"><tr><td>13:30-13:45</td><td><b>Masintõlketehnoloogia arengusuunad<br/><i>Rihards Kalnins, Tilde (inglise keeles)</i></b><p>Kuulajatele tutvustatakse masintõlketehnoloogia uudiseid, eriti viimaseid suundumusi närvivõrkudel põhineva masintõlke vallas; masintõlke uusimaid rakendusi lokaliseerimise, tehnoloogia, e-kaubanduse ja avaliku sektori valdkondades; ning eeliseid, mida pakub närvivõrkudel põhinev masintõlge, mille soravad, hästiloetavad ja peaaegu inimloodule vastavad tõlketekstid teevad tõlkemaailmas revolutsiooni.</p></td></tr><tr><td>13:45-14:00</td><td><b>Euroopa Liidu automaattõlke platvormi CEF eTranslation integreerimine<br/><i>Rihards Kalnins, Tilde (inglise keeles)</i></b><p>EL-i automaattõlke platvorm CEF eTranslation võimaldab riigiasutustel vahetada teavet ilma keelebarjääridesse takerdumata. Praegu toimub platvormi integreerimine piiriüleste digitaalsete platvormidega, sealhulgas EL-i Nõukogu eesistumise tõlketööriistaga. Selles ettekandes tutvustatakse lähemalt platvormi CEF eTranslation integreerimise kulgu.</p></td></tr><tr><td>14:00-14:15</td><td><b>Maailma esimeste närvivõrkudel põhinevate eesti-inglise masintõlkemootorite tutvustus<br/><i>Kaspars Kaulins, Tilde (eesti keeles)</i></b><p>EL-i Nõukogu eesistumise tõlketööriist hõlmab maailma esimest eesti keele masintõlkesüsteemi, mille loomisel on kasutatud ulatuslikult tehisintellektile tuginevaid närvivõrke. Ettekande käigus demonstreeritakse süsteemi jõudlust eestikeelsete tekstide tõlkimisel ning tutvustatakse tõlketööriista arvukaid eeliseid ja praktilisi kasutusvõimalusi.</p></td></tr><tr><td>14:15-15:00</td><td><b>Eestikeelsete tekstide järeltoimetamine EL-i Nõukogu eesistumise tõlketööriista veebiversiooni abil<br/><i>Martin Luts, Tilde (eesti keeles)</i></b><p>Praktilise ettekande käigus tutvustatakse EL-i Nõukogu eesistumise tõlketööriista veebiversiooni kasutamist tekstide, dokumentide ja veebilehtede tõlkimisel ning jagatakse praktilisi nõuandeid tõlgete hõlpsaks järeltoimetamiseks. Samuti käsitletakse spetsiifilisi tahke eesti keele masintõlke arendamisel.</p></td></tr><tr><td>15:00-15:20</td><td><b>Kohvipaus</b></td></tr><tr><td>15:20-16:00</td><td><b>Näpunäiteid eestikeelsete tekstide järeltoimetamiseks SDL Trados Studio lisandmooduli abil<br/><i>Katre Sepp, Tilde (eesti keeles)</i></b><p>EL-i Nõukogu eesistumise tõlketööriist on saadaval ka programmi SDL Trados Studio lisandmoodulina, mis aitab tõlkijatel suurenda oma igapäevast tööviljakust. Põhjalikus ettekandes tutvustatakse lisandmooduli kasutamist ning antakse soovitusi ja näpunäiteid eestikeelsete tekstide järeltoimetamiseks arvutipõhiste tõlketööriistadega.</p></td></tr></table>',
        WORKSHOP8: 'Registreerimine',
        WORKSHOP9: 'https://www.tilde.lv/presidency-translator-workshop-registration-ee',
        CO_FINANCED_LOGO: 'img/CoFinanced_ee.png',
        CO_FINANCED_ALT: 'Kaasrahastatud Euroopa Liidu poolt'
    });

    $translateProvider.preferredLanguage('en');
});


    


