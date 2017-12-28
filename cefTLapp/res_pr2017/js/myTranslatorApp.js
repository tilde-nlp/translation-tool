
var app = angular.module("myTranslatorApp", ['ngRoute', 'angular.filter', 'pascalprecht.translate'])
    .run(function ($rootScope) {
        $rootScope.language = 'en';
        $rootScope.languages = ['en', 'bg'];
        $rootScope.workshopURLs = {
            'en': 'https://www.tilde.lv/presidency-translator-workshop-registration',
            'et': 'https://www.tilde.lv/presidency-translator-workshop-registration-ee'
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
        SUBTITLE: 'in cooperation with the Bulgarian Presidency of the Council of the EU',
        MENU: 'Menu',
        MENU_ABOUT: 'About',
        MENU_CONTACT: 'Contact us',
        MENU_PLUGIN: 'SDL Trados Studio plug-in',
        MENU_WORKSHOP: 'EU Council Presidency Translator workshop',
        TEXT: 'Translate text',
        TEXT_SHORT: 'Text',
        DOC: 'Translate document',
        DOC_SHORT: 'Document',
        WEB: 'Translate website',
        WEB_SHORT: 'Website',
        WEB_PLACEHOLDER: 'Type the web address here...',
        WEB_EXAMPLES: '',
        WEB_REFRESH: 'Refresh',
        WEB_RETURN: 'Back',
        POWERED: 'Powered by <a class="footer_link" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation</a>, the EU\'s automated translation service',
        DEVELOPED: 'Developed by <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
        CONTACT1: 'For more information about the EU Council Presidency Translator, or to receive a consultation about how to use the service, please contact us at <a href="mailto:info@translate2018.eu">info@translate2018.eu</a>.',
        ABOUT1: 'The EU Council Presidency Translator is a multilingual communication tool that enables delegates, journalists, translators, and visitors to cross language barriers and access information during the Presidency of the Council of the EU in 2017-2018.',
        ABOUT2: 'The tool enables users to automatically translate texts, full documents, and local websites with the European Commission’s <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">CEF eTranslation</a> platform, which includes secure machine translation (MT) systems for all official EU languages.',
        ABOUT3: 'To provide more fluent translations for the local languages of the hosting countries in 2017-2018, the tool also features AI-powered Neural MT systems. When translating, Neural MT systems examine the full context of a sentence, producing highly readable translations that are almost human-like in style.',
        ABOUT4: 'The EU Council Presidency Translator was designed and developed by <a href="http://www.tilde.com/" target="_blank">Tilde</a>, a language technology company that specializes in Neural MT, in close partnership with the <a href="http://ibl.bas.bg/en/" target="_blank">Institute for Bulgarian Language</a> and the <a href="https://www.univie.ac.at/en/" target="_blank">University of Vienna</a> and support from the CEF eTranslation building block.',
        PLUGIN1: 'Instructions for use',
        PLUGIN2: '<ul><li>Download and install the EU Council Presidency Translator plug-in for SDL Trados Studio.</li><li>In SDL Trados, select your language pair in Project Settings.</li><li>Check "Use different translation providers for this language pair".</li><li>Add the EU Council Presidency Translator.</li><li>Enter your ID in the authentication window (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">request an ID</a>).</li><li>Start your project.</li><li>Translation suggestions from your EU Council Presidency Translator system will appear on screen during the translation process (users can also apply EU Council Presidency Translator to pre-translate files in batch processing).</li></ul>',
        PLUGIN3: 'I accept the end-user license agreement.',
        PLUGIN4: 'Read agreement',
        PLUGIN5: 'Download',
        WORKSHOP_URL: 'presidency-translator-workshop-registration',
        WORKSHOP1: '<table class="workshop_table"><tr><td>What:</td><td>The EU Council Presidency Translator workshop</td></tr><tr><td>For whom:</td><td>2018 EU Council Presidency translators, staff members, and Estonian public sector communications professionals</td></tr><tr><td>Where:</td><td><a href="http://www.nlib.ee/en/cupola-hall-3/" target="_blank">National Library of Estonia, Cupola Hall</a></td></tr><tr><td>When:</td><td>September 27, 13:30-16:00</td></tr></table> ',
        WORKSHOP2: '<p>Registration is mandatory. Please fill out and submit the registration form below.</p><br/><br/>About',//<p><a href="#agenda">Register now!</a></p>
        WORKSHOP3: 'This workshop for EU Council Presidency translators, staff members, and Estonian public sector communications professionals will introduce the EU Council Presidency Translator toolkit, an automated translation service specially designed for the 2018 Bulgarian Presidency of the Council of the European Union.</p><p>The EU Council Presidency Translator is a multilingual communication tool that enables users to instantly translate texts, documents, and websites between Estonian and English. The EU Council Presidency Translator features the world’s first Estonian-English-Estonian machine translation systems built with Neural Networks, a high-powered approach to AI and machine learning. When translating, Neural MT systems examine the full context of a sentence, producing more fluent, readable, humanlike translations than ever.',
        WORKSHOP4: 'The tool is freely available to all Estonian public sector translators for the duration of the Estonian EU Council Presidency, for use either online or in the EU Council Presidency Translator plugin for SDL Trados Studio. The tool is powered by the <a target="_blank" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation"> CEF eTranslation</a> platform.',
        WORKSHOP5: 'In this workshop, organized by the language technology company Tilde, translators and other communications professionals will:<ul><li>learn how to leverage machine translation in their work, making their daily translation tasks easier and more efficient</li><li>discover the benefits of Neural MT, which is revolutionizing the world of translation by providing fluent, readable translations</li><li>gain insight into the EU’s efforts to provide a pan-European automated translation platform (CEF eTranslation) for all public administrations and citizens</li><li>acquire practical knowledge about how to boost their translation productivity with the EU Council Presidency Translator</li><li>watch a hands-on demo for using the EU Council Presidency Translator in SDL Trados Studio</li></ul>',
        WORKSHOP6: 'Agenda',
        WORKSHOP7: '<table id="agenda" class="workshop_table"><tr><td>13:30-13:45</td><td><p><b>Trends in machine translation technology<br/><i>Rihards Kalnins, Tilde (in English)</i></b></p><p>In this presentation, the audience will hear what’s new in machine translation technology, particularly Neural MT; learn recent applications of MT in localization, tech, e-commerce, and the public sector; and discover the benefits of Neural MT, which is revolutionizing the world of translation by providing fluent, readable, almost humanlike translations.</p></td></tr><tr><td>13:45-14:00</td><td> <p><b>Integrating the EU’s automated translation platform, CEF eTranslation<br/><i>Rihards Kalnins, Tilde (in English)</i></b></p><p>The EU’s automated translation platform CEF eTranslation enables public administrations to exchange information across language barriers. The platform is currently being integrated into cross-border digital platforms, including the EU Council Presidency Translator. Learn more about the integration of CEF eTranslation in this presentation!</p></td></tr><tr><td>14:00-14:15</td><td><p><b>Introducing the world’s first Neural MT engines for Estonian-English<br/><i>Kaspars Kaulins, Tilde (in Estonian)</i></b></p><p>The EU Council Presidency Translator features the world’s first Estonian MT systems built with Neural Networks, a high-powered approach to AI. Get a first look at the system’s performance for Estonian during this presentation, as well as an introduction to the many practical uses and benefits of the EU Council Presidency Translator.</p></td></tr><tr><td>14:15-15:00</td><td><p><b>How to post-edit Estonian texts with the EU Council Presidency Translator online translation tool<br/><i>Martin Luts, Tilde (in Estonian)</i></b></p><p>In this hands-on presentation, you will learn how to use the EU Council Presidency online translation tool to translate texts, documents, and websites, as well as practical advice on how to easily post-edit translations. The presentation will also touch on the specific aspects of developing machine translation for Estonian.</p></td></tr><tr><td>15:00-15:20</td><td><p><b>Coffee break</b></p></td></tr><tr><td>15:20-16:00</td><td><p><b>Tips for post-editing Estonian texts with the SDL Trados Studio plugin<br/><i>Katre Sepp, Tilde (in Estonian)</i></b></p><p>The EU Council Presidency Translator is also available as a plugin for SDL Trados Studio, helping translators to boost productivity in their everyday work. Learn how to use the plugin, including tips and tricks for post-editing Estonian texts in CAT tools, in this comprehensive presentation.</p></td></tr></table>',
        WORKSHOP8: 'Registration',
        WORKSHOP9: 'https://www.tilde.lv/presidency-translator-workshop-registration',
        CO_FINANCED_LOGO: 'img/CoFinanced_en.png',
        CO_FINANCED_ALT: 'Co-financed by the European Union',
        ETRANSLATION: 'You have chosen to translate with a <b>CEF eTranslation system</b>, developed by the European Commission.'
    })
        .translations('bg', {
            SUBTITLE: 'в сътрудничество с Българското председателство на Съвета на ЕС',
            MENU: 'Меню',
            MENU_ABOUT: 'Повече информация',
            MENU_CONTACT: 'Контакти',
            MENU_PLUGIN: 'Приставка SDL Trados Studio',
            MENU_WORKSHOP: '...',
            TEXT: 'Преведи текста',
            TEXT_SHORT: 'Текст',
            DOC: 'Преведи документа',
            DOC_SHORT: 'Документ',
            WEB: 'Преведи уебсайта',
            WEB_SHORT: 'Уебсайт',
            WEB_PLACEHOLDER: 'Напиши уебадреса тук...',
            WEB_EXAMPLES: '',
            WEB_REFRESH: 'Обнови',
            WEB_RETURN: 'Обратно',
            POWERED: 'Поддръжка: <a class="footer_link" href= "https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target= "_blank" > eTranslation</a >, услугата за машинен превод на ЕС',
            DEVELOPED: 'Разработвано от <a class="footer_link" href="https://www.tilde.com" target="_blank">Tilde</a>',
            CONTACT1: 'За повече информация за Преводач 2017 или за помощ при използването на услугата, моля, пишете ни на: <a href="mailto:info@translate2018.eu">info@translate2018.eu</a>.',
            ABOUT1: 'Преводачът за Председателството на Съвета на ЕС е инструмент за многоезична комуникация, който помага на делегатите, журналистите, преводачите и гостите да преодолеят езиковите бариери и да получат достъп до информация по време на Председателството на Съвета на ЕС през 2017 и 2018 г.',
            ABOUT2: 'Инструментът помага на потребителите да превеждат текстове, цели документи и местни уебсайтове с помощта на платформата a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation на Механизма за свързване на Европа</a> към Европейската комисия, която осигурява системи за машинен превод за всички официални езици на ЕС.',
            ABOUT3: 'За да осигури по-ясен и близък до естествения език превод за националните езици на страните - домакини на Председателството на Съвета на ЕС през 2017 и 2018 г., инструментът използва системи за машинен превод, които са основани на невронни мрежи и използват изкуствен интелект. При превод системите за машинен превод, основани на невронни мрежи, анализират пълния контекст на изречението, за да направят прецизен и разбираем превод, който е много близък стилистично до превода, направен от човек.',
            ABOUT4: 'Преводачът за Председателството на Съвета на ЕС е проектиран и разработен от езиковотехнологичната компания <a href="http://www.tilde.com/" target="_blank">Tilde</a>, която работи в областта на машинния превод, базиран на невронни мрежи, в тясно сътрудничество с <a href="http://ibl.bas.bg/" target="_blank">Института за български език</a> и <a href="https://www.univie.ac.at/en/" target="_blank">Виенския университет</a> и с подкрепата на градивния елемент eTranslation на Механизма за свързване на Европа.',
            PLUGIN1: 'Инструкции за употреба',
            PLUGIN2: '<ul><li> Изтеглете и инсталирайте приставката за Преводач за Председателството на Съвета на ЕС за SDL Trados Studio.</li><li>В SDL Trados изберете желаната езикова двойка от Настройки на проекта.</li><li>Проверете „Използвайте различни доставчици на превод за тази езикова двойка".</li><li>Добавете Преводач за Председателството на Съвета на ЕС.</li><li>Въведете идентификационния си номер в прозореца за удостоверяване (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">поискайте идентификационен номер</a>).</ li ><li>Стартирайте проекта си.</li><li>Предложенията за превод от системата Преводач за Председателството на Съвета на ЕС ще се появят на екрана по време на превода (потребителите могат да използват Преводача за Председателството на Съвета на ЕС, за да превеждат файлове в пакетна обработка).</li></ul >',
            PLUGIN3: 'Приемам условията на лицензионния договор като краен потребител.',
            PLUGIN4: 'Прочетете договора',
            PLUGIN5: 'Свали',
            WORKSHOP_URL: 'presidency-translator-workshop-registration-bg',
            WORKSHOP1: '',
            WORKSHOP2: '',
            WORKSHOP3: '',
            WORKSHOP4: '',
            WORKSHOP5: '',
            WORKSHOP6: '',
            WORKSHOP7: '',
            WORKSHOP8: '',
            WORKSHOP9: '',
            CO_FINANCED_LOGO: 'img/CoFinanced_bg.png',
            CO_FINANCED_ALT: 'Съфинансиран от Европейския съюз',
            ETRANSLATION: 'Избрахте да превеждате със <b>системата CEF eTranslation</b>, разработена от Европейската комисия.'
        });

    $translateProvider.preferredLanguage('en');
});





