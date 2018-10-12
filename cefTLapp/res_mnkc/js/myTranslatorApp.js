
var app = angular.module("myTranslatorApp", ['ngRoute', 'angular.filter', 'pascalprecht.translate'])
    .run(function ($rootScope) {
        $rootScope.language = 'lv';
        $rootScope.languages = ['lv', 'en'];
        $rootScope.workshopURLs = {
            'lv': 'https://www.tilde.lv/presidency-translator-workshop-registration',
            'en': 'https://www.tilde.lv/presidency-translator-workshop-registration-de'
        };
        $rootScope.eTranslationSystem = false;
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
            .when('/home', {
                templateUrl: 'templates/translate-text.html',
                controller: 'TranslateCtrl'
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
    $translateProvider.translations('lv', {
        SUBTITLE: 'in cooperation with the Austrian Presidency of the Council of the EU',
        MENU: 'Menu',
        MENU_CLOSE: 'Close',
        MENU_ABOUT: 'Par',
        MENU_CONTACT: 'Contact us',
        MENU_PLUGIN: 'SDL Trados Studio plug-in',
        MENU_WORKSHOP: 'Translate 2018 workshop',
        TEXT: 'Tulkot tekstu',
        TEXT_SHORT: 'Teksts',
        DOC: 'Tulkot dokumentu',
        DOC_SHORT: 'Dokuments',
        WEB: 'Tulkot tīmekļa lapu',
        WEB_SHORT: 'Lapa',
        WEB_PLACEHOLDER: 'Ievadiet tīmekļa vietas adresi šeit...',
        WEB_EXAMPLES: 'Links to Austrian media and information resources:',
        WEB_REFRESH: 'Pārlādēt',
        WEB_RETURN: 'Atpakaļ',
        POWERED: '© Tilde, 2018. Visas tiesības aizsargātas',
        DEVELOPED: 'Ražots <a class="footer_link" href="https://www.tilde.com" target="_blank">Tildē</a>',
        CONTACT1: 'For more information about the EU Council Presidency Translator, or to receive a consultation about how to use the service, please contact us at <a href="mailto:info@translate2018.eu">info@translate2018.eu</a>.',
        ABOUT1: 'Izmanto šo rīku, lai automātiski tulkotu ar meža nozari saistītus tekstus, dokumentus un mājas lapas. Ierakstot tulkošanai vienu vārdu, sinonīmu vārdnīca palīdzēs Tev atrast tā sinonīmus.',
        ABOUT2: 'Mežu nozares mašīntulka pētniecības un izstrādes process ir līdzfinansēts Meža nozares kompetences centra Darbības programmas “Izaugsme un nodarbinātība” 1.2.1. specifiskā atbalsta mērķa “Palielināt privātā sektora investīcijas P&A” 1.2.1.1. pasākuma “Atbalsts jaunu produktu un tehnoloģiju izstrādei kompetences centru ietvaros” otrās projektu iesniegumu atlases kārtas ietvaros',
        ABOUT3: 'Projekts Nr. 1.2.1.1/16/A/009',
        ABOUT4: 'Lai izstrādātu brīvi pieejamu Mežu nozare mašīntulku, kurš ir balstīts uz jaunākām neironu tīklu tehnoloģijām, ir veikti šādi soļi: <ol><li>Apzināti un apkopoti meža nozares valodas resursi, tā skaitā meža nozares terminoloģija.</li><li>Veikta valodas resursu analīze un apstrāde ar mašīnmācīšanās metodēm.</li><li>Izmantojot publiski pieejamos valodas resursus un īpaši sagatavotos meža nozares valodas resursus, izstrādāts mežu nozares neironu tīklu mašīntulks ar sinonīmu vārdnīcas integrāciju.</li><li>Izstrādāta ērta saskarne, lai veiktu tekstu, dokumentu un mājas lapas tulkojumus. Ir iespēja integrēt mašīntulkošanas funkcionalitāti nozares uzņēmumu un organizāciju mājaslapās un tiešsaistes risinājumos, izmantojot API programmsaskarnes.</li></ol>',
        PLUGIN1: 'Instructions for use',
        PLUGIN2: '<ul><li> Download and install the EU Council Presidency Translator plug-in for SDL Trados Studio.</li><li>In SDL Trados Studio, select your language pair in Project Settings.</li><li>Check "Use different translation providers for this language pair".</li><li>Add the EU Council Presidency Translator.</li><li>Enter your ID in the authentication window (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">request an ID</a>).</li><li>Start your project.</li><li>Translation suggestions from your EU Council Presidency Translator system will appear on screen during the translation process (users can also apply EU Council Presidency Translator to pre-translate files in batch processing).</li></ul>',
        PLUGIN3: 'I accept the end-user license agreement.',
        PLUGIN4: 'Read agreement',
        PLUGIN5: 'Download',
        WORKSHOP_URL: 'presidency-translator-workshop-registration',
        WORKSHOP_TITLE: '',
        WORKSHOP1: '',
        WORKSHOP2: '',
        WORKSHOP3: '',
        WORKSHOP4: '',
        WORKSHOP5: '',
        WORKSHOP6: '',
        WORKSHOP7: '',
        WORKSHOP8: '',
        WORKSHOP9: '',
        WORKSHOP10: 'https://www.tilde.lv/presidency-translator-workshop-registration',
        WORKSHOP11: '',
        CO_FINANCED_LOGO: 'img/cofinancer.png',
        CO_FINANCED_ALT: 'Co-financed by the European Union',
        ETRANSLATION: 'You have chosen to translate with a <b>CEF eTranslation system</b>, developed by the European Commission.'
    })
        .translations('en', {
            SUBTITLE: 'in cooperation with the Austrian Presidency of the Council of the EU',
            MENU: 'Menu',
            MENU_CLOSE: 'Close',
            MENU_ABOUT: 'About the EU Council Presidency Translator',
            MENU_CONTACT: 'Contact us',
            MENU_PLUGIN: 'SDL Trados Studio plug-in',
            MENU_WORKSHOP: 'Translate 2018 workshop',
            TEXT: 'Translate text',
            TEXT_SHORT: 'Text',
            DOC: 'Translate document',
            DOC_SHORT: 'Document',
            WEB: 'Translate website',
            WEB_SHORT: 'Website',
            WEB_PLACEHOLDER: 'Type the web address here...',
            WEB_EXAMPLES: 'Links to Austrian media and information resources:',
            WEB_REFRESH: 'Refresh',
            WEB_RETURN: 'Back',
            POWERED: 'Powered by <a class="footer_link" href="https://tilde.com/products-and-services/machine-translation" target="_blank">Tilde MT</a>',
            DEVELOPED: 'Developed by <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
            CONTACT1: 'For more information about the EU Council Presidency Translator, or to receive a consultation about how to use the service, please contact us at <a href="mailto:info@translate2018.eu">info@translate2018.eu</a>.',
            ABOUT1: 'The EU Council Presidency Translator is a multilingual communication tool that enables delegates, journalists, translators, and visitors to cross language barriers and access information during the Presidency of the Council of the EU in 2017-2018.',
            ABOUT2: 'The tool enables users to automatically translate texts, full documents, and local websites with the European Commission’s <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">CEF eTranslation</a> platform, which includes secure machine translation (MT) systems for all official EU languages.',
            ABOUT3: 'To provide more fluent translations for the local languages of the hosting countries in 2017-2018, the tool also features AI-powered Neural MT systems. When translating, Neural MT systems examine the full context of a sentence, producing highly readable translations that are almost human-like in style.',
            ABOUT4: 'The EU Council Presidency Translator was designed and developed by <a href="http://www.tilde.com/" target="_blank">Tilde</a>, a language technology company that specializes in Neural MT, in close partnership with <a href="http://ibl.bas.bg/en/" target="_blank">the Institute for Bulgarian Language</a> and <a href="https://transvienna.univie.ac.at/en/" target="_blank">the Centre for Translation Studies at University of Vienna</a> and support from the CEF eTranslation building block.',
            PLUGIN1: 'Instructions for use',
            PLUGIN2: '<ul><li> Download and install the EU Council Presidency Translator plug-in for SDL Trados Studio.</li><li>In SDL Trados Studio, select your language pair in Project Settings.</li><li>Check "Use different translation providers for this language pair".</li><li>Add the EU Council Presidency Translator.</li><li>Enter your ID in the authentication window (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">request an ID</a>).</li><li>Start your project.</li><li>Translation suggestions from your EU Council Presidency Translator system will appear on screen during the translation process (users can also apply EU Council Presidency Translator to pre-translate files in batch processing).</li></ul>',
            PLUGIN3: 'I accept the end-user license agreement.',
            PLUGIN4: 'Read agreement',
            PLUGIN5: 'Download',
            WORKSHOP_URL: 'presidency-translator-workshop-registration',
            WORKSHOP_TITLE: '',
            WORKSHOP1: '',
            WORKSHOP2: '',
            WORKSHOP3: '',
            WORKSHOP4: '',
            WORKSHOP5: '',
            WORKSHOP6: '',
            WORKSHOP7: '',
            WORKSHOP8: '',
            WORKSHOP9: '',
            WORKSHOP10: 'https://www.tilde.lv/presidency-translator-workshop-registration',
            WORKSHOP11: '',
            CO_FINANCED_LOGO: 'img/CoFinanced_en.png',
            CO_FINANCED_ALT: 'Co-financed by the European Union',
            ETRANSLATION: 'You have chosen to translate with a <b>CEF eTranslation system</b>, developed by the European Commission.'
        })
        ;

    $translateProvider.preferredLanguage('lv');
});





