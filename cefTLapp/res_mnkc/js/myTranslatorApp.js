
var app = angular.module("myTranslatorApp", ['ngRoute', 'angular.filter', 'pascalprecht.translate'])
    .run(function ($rootScope) {
        $rootScope.language = 'en';
        $rootScope.languages = ['en', 'de'];
        $rootScope.workshopURLs = {
            'en': 'https://www.tilde.lv/presidency-translator-workshop-registration',
            'de': 'https://www.tilde.lv/presidency-translator-workshop-registration-de'
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
            .when('/registration-for-the-workshop', {
                templateUrl: 'templates/registration-closed.html',
                //templateUrl: 'templates/registration-for-the-workshop.html',
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
        POWERED: 'Powered by <a class="footer_link" href="https://tilde.com/products-and-services/machine-translation" target="_blank">Tilde MT</a> and <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>, the EU\'s automated translation service',
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
        .translations('de', {
            SUBTITLE: 'in Kooperation mit dem Exekutivsekretariat des österreichischen EU-Ratsvorsitzes 2018',
            MENU: 'Menü',
            MENU_CLOSE: 'Schließen',
            MENU_ABOUT: 'Über den EU Council Presidency Translator',
            MENU_CONTACT: 'Kontakt',
            MENU_PLUGIN: 'SDL Trados Studio Plug-in',
            MENU_WORKSHOP: '',
            TEXT: 'Text übersetzen',
            TEXT_SHORT: 'Text',
            DOC: 'Dokument übersetzen',
            DOC_SHORT: 'Dokument',
            WEB: 'Webseite übersetzen',
            WEB_SHORT: 'Webseite',
            WEB_PLACEHOLDER: 'Geben Sie hier die Webadresse ein…',
            WEB_EXAMPLES: 'Links zu österreichischen Medien und Informationsmaterialien:',
            WEB_REFRESH: 'Aktualisieren',
            WEB_RETURN: 'Zurück',
            POWERED: 'Unterstützt von <a class="footer_link" href="https://tilde.com/products-and-services/machine-translation" target="_blank">Tilde MT</a> und <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>, dem maschinellen Übersetzungsservice der Europäischen Kommission',
            DEVELOPED: 'Entwickelt von <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
            CONTACT1: 'Wenn Sie mehr über den "EU Council Presidency Translator" erfahren möchten oder Beratung zum Umgang mit dem Service suchen, kontaktieren Sie uns bitte unter <a href="mailto:info@translate2018.eu">info@translate2018.eu</a>.',
            ABOUT1: 'Der EU Council Presidency Translator (maschinelle Übersetzung für den Vorsitz im Rat der Europäischen Union) dient der mehrsprachigen Kommunikation, der es Delegierten, JournalistInnen, ÜbersetzerInnen und BesucherInnen während der EU-Ratspräsidentschaft 2017-2018 ermöglicht, Sprachbarrieren zu überwinden und auf Informationen zuzugreifen.',
            ABOUT2: 'Mit diesem System können BenutzerInnen Texte, vollständige Dokumente und lokale Webseiten mit der CEF <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation-Plattform</a> der Europäischen Kommission automatisch übersetzen lassen. Die Plattform umfasst sichere maschinelle Übersetzungssysteme für alle offiziellen EU-Sprachen.',
            ABOUT3: 'Um flüssig formulierte Übersetzungen in den Landessprachen der Gastgeberländer von 2017-2018 bereitstellen zu können, basiert das neuronale maschinelle Übersetzungssystem auf künstlicher Intelligenz. Neuronale maschinelle Übersetzungssysteme untersuchen beim Übersetzen den gesamten Kontext eines Satzes. Dadurch können sie sehr gut lesbare Texte produzieren, die stilistisch fast so wirken, als wären sie von Menschen übersetzt worden.',
            ABOUT4: 'Der EU Council Presidency Translator wurde von <a href="http://www.tilde.com/" target="_blank">Tilde</a> aufgesetzt und entwickelt, einer Sprachtechnologiefirma, die auf neuronale maschinelle Übersetzung spezialisiert ist. Tilde arbeitete in enger Partnerschaft mit <a href="http://ibl.bas.bg/en/" target="_blank">dem Institut für Bulgarische Sprache</a> in Sofia und <a href="https://transvienna.univie.ac.at/" target="_blank">dem Zentrum für Translationswissenschaft der Universität Wien</a> zusammen. Unterstützung erhielt Tilde auch durch den CEF eTranslation-Grundbaustein. Diese Grundbausteine (building blocks) sollen die Interoperabilität zwischen verschiedenen IT-Systemen innerhalb der EU-Mitgliedsstaaten gewährleisten.',
            PLUGIN1: 'Anleitung',
            PLUGIN2: '<ul><li> Laden Sie das Plug-In "EU Council Presidency Translator" herunter und installieren Sie es.</li><li>In SDL Trados Studio legen Sie ein Projekt an oder öffnen ein bereits vorhandenes Projekt.</li><li>Gehen Sie zu den Projekteinstellungen. Wählen Sie "Alle Sprachpaare" (oder das gewünschte Sprachpaar) und dann "Translation Memorys und maschinelle Übersetzung" aus.</li><li>Klicken Sie auf "Für dieses Sprachpaar sollen andere Übersetzungsquellen verwendet werden".</li><li>Unter "Verwenden" wird der "EU Presidency Translator" aufgelistet. Fügen Sie den EU Presidency Translator hinzu.</li><li>Wählen Sie die Sprachrichtung für den EU Presidency Translator aus.</li><li>Wählen Sie "CEF eTranslation" aus und klicken auf "OK".</li><li>Geben Sie Ihre ID-Nummer im Authentifizierungsfenster ein. (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">ID-Nummer anfordern</a>).</li ><li>Beginnen Sie dann mit Ihrem Projekt.</li><li>Die Übersetzungsvorschläge des EU Council Presidency Translators werden während des Übersetzungsprozesses als "Übersetzungsergebnisse" angezeigt. (Sie können mit dem EU Council Presidency Translator auch Dateien in der Batch-Verarbeitung vorübersetzen).</li></ul >',
            PLUGIN3: 'Ich akzeptiere die Endbenutzer-Lizenzvereinbarung.',
            PLUGIN4: 'Lizenzvereinbarung lesen',
            PLUGIN5: 'Download',
            WORKSHOP_URL: 'presidency-translator-workshop-registration-de',
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
            WORKSHOP10: 'https://www.tilde.lv/presidency-translator-workshop-registration-de',
            WORKSHOP11: '',
            CO_FINANCED_LOGO: 'img/CoFinanced_en.png',
            CO_FINANCED_ALT: 'Mitfinanziert von der Europäischen Union.',
            ETRANSLATION: 'Sie haben sich entschieden, mit einem <b>CEF eTranslation-System</b> zu arbeiten, das von der Europäischen Kommission entwickelt wurde.'
        });

    $translateProvider.preferredLanguage('en');
});





