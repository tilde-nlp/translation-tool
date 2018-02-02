
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
            .when('/registration-for-the-workshop', {
                templateUrl: 'templates/registration-for-the-workshop.html',
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
        MENU_WORKSHOP: 'Translate 2018 workshop',
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
        WORKSHOP_TITLE: 'EU Council Presidency Translator Workshop',
        WORKSHOP1: '<table class="workshop_table"><tr><td>What:</td><td>EU Council Presidency Translator workshop</td></tr><tr><td>For whom:</td><td>2018 EU Council Presidency translators, staff members, and Bulgarian public sector communications professionals</td></tr><tr><td>Where:</td><td><a href="http://www.ndk.bg/Tickets-24EN.html" target="_blank">National Palace of Culture, Hall 7</a></td></tr><tr><td>When:</td><td>February 12, 2018, 9:30 – 12:00</td></tr></table>',
        WORKSHOP2: '<p>Registration is mandatory. Please fill out and submit the registration form before 7 February 2018.</p><br/><br/>About',
        WORKSHOP3: 'This workshop for EU Council Presidency translators, staff members, and Bulgarian public sector communications professionals will introduce the EU Council Presidency Translator toolkit, an automated translation service specially designed for the 2018 Bulgarian Presidency of the Council of the European Union.</p><p>The EU Council Presidency Translator is a multilingual communication tool that enables users to instantly translate texts, documents, and websites between Bulgarian and English. The EU Council Presidency Translator features  unique Bulgarian-English-Bulgarian machine translation system built with Neural Networks, a high-powered approach to Artificial Intelligence and machine learning. When translating, Neural Machine translation systems examine the full context of a sentence, producing more fluent, readable, humanlike translations than ever.',
        WORKSHOP4: 'The tool is freely available to all Bulgarian public sector translators for use either online or in the EU Council Presidency Translator plugin for SDL Trados Studio. The tool is powered by the CEF <a target="_blank" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation">eTranslation</a> platform.',
        WORKSHOP5: 'In this workshop, organized by the language technology company Tilde and the Institute for Bulgarian Language at the Bulgarian Academy of Sciences, translators and other communications professionals will:<ul><li>learn how to leverage machine translation in their work, making their daily translation tasks easier and more efficient;</li><li>discover the benefits of Neural Machine translation, which is revolutionizing the world of translation by providing fluent, readable translations;</li><li>gain insight into the EU’s efforts to provide a pan-European automated translation platform (CEF <i>eTranslation</i>) for all public administrations and citizens;</li><li>acquire practical knowledge about how to boost their translation productivity with the EU Council Presidency Translator;</li><li>watch a hands-on demo for using the EU Council Presidency Translator in SDL Trados Studio.</li></ul>',
        WORKSHOP6: 'Agenda',
        WORKSHOP7: '<table id="agenda" class="workshop_table"><tr><td>9:30-10:00</td><td><p><b>Registration</b></p></td></tr><tr><td>10:00-10:20</td><td><p><b>Welcome and introduction<br/><i>Svetla Koeva, Institute for Bulgarian Language, Bulgarian Academy of Sciences (in Bulgarian)</i></b></p><p><b>Welcome by the Bulgarian Presidency of the Council of the European Union<br/><i>Minister Lilyana Pavlova</i></b></p><p><b>Welcome by the President of the Bulgarian Academy of Sciences<br/><i>Acad. Julian Revalski</i></b></p></td></tr><tr><td>10:20-10:45</td><td><p><b>Trends in machine translation technology<br/><i>Rihards Kalnins, Tilde (in English)</i></b></p><p>In this presentation, the audience will hear what’s new in machine translation technology, particularly Neural MT; learn recent applications of MT in localization, tech, e-commerce, and the public sector; and discover the benefits of Neural MT, which is revolutionizing the world of translation by providing fluent, readable, almost humanlike translations.</p></td></tr><tr><td>10:45-11:10</td><td><p><b>Integrating the EU’s automated translation platform, CEF eTranslation<br/><i>Rihards Kalnins, Tilde (in English)</i></b></p><p>The EU’s automated translation platform CEF eTranslation enables public administrations to exchange information across language barriers. The platform is currently being integrated into cross-border digital platforms, including the EU Council Presidency Translator.</p></td></tr><tr><td>11:10-11:35</td><td><p><b>EU Council Presidency Translator<br/><i>Dimiter Hristov, Institute for Bulgarian Language, Bulgarian Academy of Sciences (in Bulgarian)</i></b></p><p>This presentation will introduce the EU Council Presidency Translator – the automated translation tool for instant translation of texts, documents and websites, with an outline of its advantages for translation between Bulgarian and English in comparison to other systems.</p></td></tr><tr><td>11:35-12:00</td><td><p><b>Automated translation now - why and how?<br/><i>Elitsa Horozova, Sofita Translation Agency (in Bulgarian)</i></b></p><p>In the presentation, the following topics will be discussed: the computer-assisted translation – translation memory and translation tools; the Computer-Assisted Translation tool SDL Trados Studio;  the Translator plugin for SDL Trados Studio and its application and use for public administration.</p></td></tr></table>',
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
            MENU_PLUGIN: 'Приставка за SDL Trados Studio',
            MENU_WORKSHOP: 'Семинар „Преводач 2018“',
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
            CONTACT1: 'За повече информация за „Преводач 2018“ или за помощ при използването на услугата, моля, пишете ни на: <a href="mailto:info@translate2018.eu">info@translate2018.eu</a>.',
            ABOUT1: 'Системата „Преводач“ за Председателството на Съвета на ЕС е инструмент за многоезикова комуникация, който помага на делегатите, журналистите, преводачите и гостите да преодолеят езиковите бариери и да получат достъп до информация по време на Председателството на Съвета на ЕС през 2017 и 2018 г.',
            ABOUT2: '„Преводач“  помага на потребителите да превеждат текстове, цели документи и уебсайтове с помощта на платформата <a href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation" target="_blank">eTranslation на Механизма за свързване на Европа</a> към Европейската комисия, която осигурява системи за машинен превод за всички официални езици на ЕС.',
            ABOUT3: 'За да осигури по-ясен и близък до естествения език превод за националните езици на страните - домакини на Председателството на Съвета на ЕС през 2017 и 2018 г., инструментът използва системи за машинен превод, които са основани на невронни мрежи и използват изкуствен интелект. При превод системите за машинен превод, основани на невронни мрежи, анализират пълния контекст на изречението, за да направят прецизен и разбираем превод, който е много близък стилистично до превода, направен от човек.',
            ABOUT4: 'Системата „Преводач“  за Председателството на Съвета на ЕС е проектирана и разработена от компанията <a href="http://www.tilde.com/" target="_blank">Tilde</a>, която работи в областта на машинния превод, базиран на невронни мрежи, в тясно сътрудничество с <a href="http://ibl.bas.bg/" target="_blank">Института за български език</a> и <a href="https://www.univie.ac.at/en/" target="_blank">Виенския университет</a> и с подкрепата на eTranslation на Механизма за свързване на Европа.',
            PLUGIN1: 'Инструкции за употреба',
            PLUGIN2: '<ul><li>Изтеглете и инсталирайте приставката „Преводач“ за Председателството на Съвета на ЕС за SDL Trados Studio.</li><li>В SDL Trados изберете желаната двойка езици от Настройки на проекта.</li><li>Проверете „Използвайте различни доставчици на превод за тази двойка езици".</li><li>Добавете „Преводач“ за Председателството на Съвета на ЕС.</li><li>Въведете идентификационния номер в прозореца за удостоверяване (<a href="#/contactUs" ng-click="routeMe(\' / contactUs\');">поискайте идентификационен номер</a>).</ li ><li>Започнете проекта си.</li><li>Предложенията за превод от системата „Преводач“  за Председателството на Съвета на ЕС ще се появят на екрана по време на превода (потребителите могат да използват „Преводач“ за Председателството на Съвета на ЕС, за да превеждат група от файлове).</li></ul>',
            PLUGIN3: 'Приемам условията на лицензионния договор като краен потребител.',
            PLUGIN4: 'Прочетете договора',
            PLUGIN5: 'Изтегли',
            WORKSHOP_URL: 'presidency-translator-workshop-registration-bg',
            WORKSHOP_TITLE: 'Семинар „Преводач 2018“',
            WORKSHOP1: '<table class="workshop_table"><tr><td>Какво:</td><td>Семинар „Преводач 2018“ за Председателството на Съвета на Европейския съюз</td></tr><tr><td>За кого:</td><td>Преводачите и служителите към Министерството за Българското председателство на Съвета на ЕС и работещите в областта на връзките с обществеността в публичния сектор</td></tr><tr><td>Къде:</td><td><a href="http://www.ndk.bg/вътре-в-ндк/билетен-център" target="_blank">Национален дворец на културата, зала 7</a></td></tr><tr><td>Кога:</td><td>12 февруари 2018 г., 9:30 – 12:00</td></tr></table>',
            WORKSHOP2: '<p>Регистрацията е задължителна. Моля, попълнете и изпратете регистрационната форма до 7 февруари 2018 г.</p><br/><br/>За семинара',
            WORKSHOP3: 'Семинарът  „Преводач 2018“ е предназначен за преводачите и служителите към Министерството за Българското председателство на Съвета на ЕС и за работещите в областта на връзките с обществеността в публичния сектор. На семинара ще бъде представена системата <a target="_blank" href="https://eu2018bg.bg/bg/translation">„Преводач“</a> за Председателството на Съвета на ЕС – инструмент за автоматичен превод, създаден специално за Българското председателство на Съвета на Европейския съюз през 2018 г.</p><p>Системата „Преводач“ за Председателството на Съвета на ЕС е инструмент за многоезикова комуникация, който позволява на потребителите да превеждат автоматично текстове, документи и уебстраници от и на български и английски език. В „Преводач“ за Председателството на Съвета на ЕС се използват системи за машинен превод между български и английски, които са изградени на основата на невронни мрежи и използват изкуствен интелект и машинно обучение. Системите, базирани на невронни мрежи, анализират пълния контекст, в който се появява дадено изречение, и предлагат по-ясен и разбираем превод, стилистично близък до превода, направен от човек.',
            WORKSHOP4: 'Инструментът за автоматичен превод може да се използва както онлайн, така и чрез приставката „Преводач“ за „Ес Ди Ел Традос Студио“. В „Преводач“ е интегрирана платформата за машинен превод на ЕС <a target="_blank" href="https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation">eTranslation</a>.',
            WORKSHOP5: 'В рамките на семинара, организиран от латвийската компания „Тилде“ и Института за български език „Проф. Любомир Андрейчин“ при Българската академия на науките, преводачите и работещите в областта на връзките с обществеността:<ul><li>ще научат как да се възползват в своята работа от машинния превод, така че да се справят по-бързо и ефективно с ежедневните си задължения за превод на различни текстове;</li><li>ще се запознаят с предимствата на машинния превод, който използва невронни мрежи и представлява своеобразна революция в областта, тъй като предлага по-ясни и разбираеми преводи;</li><li>ще разберат повече за усилията на ЕС да изгради обща европейска платформа за машинен превод (<i>CEF eTranslation</i>) в полза на публичната администрация и гражданите;</li><li>ще придобият практически познания как да превеждат по-бързо и ефективно с помощта на системата „Преводач“ за Председателството на Съвета на Европейския съюз;</li><li>ще присъстват на демонстрация на работата с приставката „Преводач“ за Председателството на Съвета на Европейския съюз за „Ес Ди Ел Традос Студио“.</li></ul>',
            WORKSHOP6: 'Програма',
            WORKSHOP7: '<table id="agenda" class="workshop_table"><tr><td>9:30-10:00</td><td><p><b>Регистрация</b></p></td></tr><tr><td>10:00-10:20</td><td><p><b>Откриване на семинара<br/><i>Светла Коева, Институт за български език, Българска академия на науките (на български)</i></b></p><p><b>Приветствие от името на Министерството за Българското председателство на Съвета на Европейския съюз<br/><i>Министър Лиляна Павлова</i></b></p><p><b>Приветствие от Председателя на Българската академия на науките<br/><i>Aкад. Юлиан Ревалски</i></b></p></td></tr><tr><td>10:20-10:45</td><td><p><b>Тенденции в технологиите за машинен превод<br/><i>Рихардс Калнинш, „Тилде“, Латвия (на английски)</i></b></p><p>Представянето ще запознае публиката с новостите в развитието на технологиите за машинен превод, особено на машинния превод, основан на невронни мрежи; ще представи най-актуалните приложения на машинния превод в локализацията, технологиите, електронната търговия и публичния сектор; ще очертае ползите от машинния превод, основан на невронни мрежи, който  предлага по-ясен и разбираем превод, стилистично близък до превода, направен от човек.</p></td></tr><tr><td>10:45-11:10</td><td><p><b>Интегриране на <i>CEF eTranslation</i> –  платформата за машинен превод на ЕС, в „Преводач“ <br/><i>Рихардс Калнинш, „Тилде“, Латвия (на английски)</i></b></p><p>Платформата за машинен превод на Европейския съюз <i>CEF eTranslation</i> дава възможност на представителите на публичната администрация да обменят информация, преодолявайки езиковите бариери. Платформата е интегрирана в европейски цифрови платформи, включително в „Преводач“ за Председателството на Съвета на Европейския съюз.</p></td></tr><tr><td>11:10-11:35</td><td><p><b>„Преводач“ за Председателството на Съвета на Европейския съюз<br/><i>Димитър Христов, Институт за български език, Българска академия на науките (на български)</i></b></p><p>Ще бъде представен „Преводач“ – системата за автоматичен превод за Председателството на Съвета на Европейския съюз за онлайн превод на текстове, документи и уебстраници. Ще бъдат посочени предимствата на системата за превод между български и английски в сравнение с други системи.</p></td></tr><tr><td>11:35-12:00</td><td><p><b>Автоматизацията в съвременния превод – защо и как?<br/><i>Елица Хорозова, преводаческа агенция „Софита“ (на български)</i></b></p><p>Ще бъдат представени: компютърно подпомогнатият превод – преводна  памет и инструменти за превод; системата за компютърно подпомогнат превод „Ес Ди Ел Традос Студио“; приставката за „Ес Ди Ел Традос Студио“ и ползата от нейното използване за публичните институции.</p></td></tr></table>',
            WORKSHOP8: 'Регистрация',
            WORKSHOP9: 'https://www.tilde.lv/presidency-translator-workshop-registration-bg',
            CO_FINANCED_LOGO: 'img/CoFinanced_bg.png',
            CO_FINANCED_ALT: 'Съфинансиран от Европейския съюз',
            ETRANSLATION: 'Избрахте да превеждате със <b>системата CEF eTranslation</b>, разработена от Европейската комисия.'
        });

    $translateProvider.preferredLanguage('en');
});





