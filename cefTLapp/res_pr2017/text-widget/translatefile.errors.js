/* UI texts */

uiResources = $.extend(true, uiResources, {
    'en': {
        "E_DEFAULT_ERROR": "Error occurred while translating.",
        "E_UNKNOWN_FILE_TYPE": "Unknown file type.",
        "E_CANNOT_READ_FILE": "Cannot read file, file may be corrupted.",
        "E_FAILED_IN_TRANSLATION": "Error occurred while translating.",
        "E_FORMAT_TRACK_CHANGES": "Could not translate because track changes was turned on. Changes must first be accepted.",
        "E_UNKNOWN_ERROR": "An unknown error occurred.",
        "E_UNAUTHORIZED": "Document translation was denied.",
        "W_TIMEOUT": "Some sentences are not translated, because translation took too much time.",
        "W_SENTENCE_TOO_LONG": "Some sentences are not translated, because they are too long."
    },
    'lv': {
        "E_DEFAULT_ERROR": "Tulkojot radās kļūda.",
        "E_UNKNOWN_FILE_TYPE": "Nezināms faila tips.",
        "E_CANNOT_READ_FILE": "Neizdevās nolasīt faila saturu, iespējams, fails ir bojāts.",
        "E_FAILED_IN_TRANSLATION": "Tulkojot radās kļūda.",
        "E_FORMAT_TRACK_CHANGES": "Nevarēja iztulkot dokumentu, jo bija ieslēgta izmaiņu reģistrēšana. Vispirms apstipriniet izmaiņas.",
        "E_UNKNOWN_ERROR": "Radās nezināma kļūda.",
        "E_UNAUTHORIZED": "Dokumenta tulkošana tika liegta.",
        "W_TIMEOUT": "Daži teikumi netika iztulkoti, jo tulkošana prasīja pārāk daudz laika.",
        "W_SENTENCE_TOO_LONG": "Daži teikumi nav iztulkoti, jo tie bija pārāk gari."
    },
    'ru': {
        "E_DEFAULT_ERROR": "Во время перевода возникла ошибка.",
        "E_UNKNOWN_FILE_TYPE": "Неизвестный тип файла.",
        "E_CANNOT_READ_FILE": "Не удалось считать содержание файла, возможно, файл поврежден.",
        "E_FAILED_IN_TRANSLATION": "Во время перевода возникла ошибка.",
        "E_FORMAT_TRACK_CHANGES": "Не удалось перевести, поскольку был включен режим отслеживания исправлений. Сначала примите исправления.",
        "E_UNKNOWN_ERROR": "Возникла неизвестная ошибка.",
        "E_UNAUTHORIZED": "Перевод документа запрещен.",
        "W_TIMEOUT": "Some sentences are not translated, because translation took too much time.",
        "W_SENTENCE_TOO_LONG": "Some sentences are not translated, because they are too long."
    },
    'lt': {
        'E_DEFAULT_ERROR': 'Verčiant įvyko klaida.',
        'E_UNKNOWN_FILE_TYPE': 'Nežinomas failo tipas.',
        'E_CANNOT_READ_FILE': 'Failo nuskaityti nepavyko. Jis gali būti sugadintas.',
        'E_FAILED_IN_TRANSLATION': 'Verčiant įvyko klaida.',
        'E_FORMAT_TRACK_CHANGES': 'Išversti nepavyko, nes įjungtas keitimų sekimas (angl. track changes). Pirmiausia sutikite su visais keitimais.',
        'E_UNKNOWN_ERROR': 'Aptikta nenustatyta klaida.',
        'E_UNAUTHORIZED': 'Dokumento vertimas atmestas.',
        "W_TIMEOUT": "Kai kurie sakiniai liko neišversti, nes baigėsi vertimui skirtas laikas.",
        "W_SENTENCE_TOO_LONG": "Kai kurie sakiniai liko neišversti, nes jie per ilgi."
    },
    'fr': {
        'E_DEFAULT_ERROR': 'Une erreur est survenue pendant la traduction.',
        'E_UNKNOWN_FILE_TYPE': 'Type de fichier inconnu.',
        'E_CANNOT_READ_FILE': 'Impossible de lire le fichier, le fichier est peut-être endommagé.',
        'E_FAILED_IN_TRANSLATION': 'Une erreur est survenue pendant la traduction.',
        'E_FORMAT_TRACK_CHANGES': 'Impossible de traduire car le suivi des corrections est activé. Les corrections doivent d\'abord être acceptées.',
        'E_UNKNOWN_ERROR': 'Une erreur inconnue s\'est produite.',
        'E_UNAUTHORIZED': 'La traduction du document a été refusée.',
        "W_TIMEOUT": "Some sentences are not translated, because translation timed out.",
        "W_SENTENCE_TOO_LONG": "Some sentences are not translated, because they are too long."
    },
    'et': {
        "E_DEFAULT_ERROR": "Tõlkimisel ilmnes tõrge.",
        "E_UNKNOWN_FILE_TYPE": "Tundmatu failitüüp.",
        "E_CANNOT_READ_FILE": "Faili ei saa lugeda. See võib olla rikutud.",
        "E_FAILED_IN_TRANSLATION": "Tõlkimisel ilmnes tõrge.",
        "E_FORMAT_TRACK_CHANGES": "Tõlkida ei saanud, kuna muutuste jälitus oli sisse lülitatud. Muutused tuleb esmalt aktsepteerida.",
        "E_UNKNOWN_ERROR": "Ilmnes tundmatu tõrge.",
        "E_UNAUTHORIZED": "Dokumendi tõlkimine keelati.",
        "W_TIMEOUT": "Mõni lause jäi tõlkimata, kuna tõlkimisel ilmnes ajalõpp.",
        "W_SENTENCE_TOO_LONG": "Mõnda lauset ei tõlgitud, kuna need on liiga pikad."
    },
    'bg': {
        "E_DEFAULT_ERROR": "Грешка в процеса на превод.",
        "E_UNKNOWN_FILE_TYPE": "Непознат формат на файл.",
        "E_CANNOT_READ_FILE": "Cannot read file, file may be corrupted.",
        "E_FAILED_IN_TRANSLATION": "Файлът не се чете, файлът може би е повреден.",
        "E_FORMAT_TRACK_CHANGES": "Преводът не можа да бъде осъществен, защото режимът „Проследете промените“ е включен. Направените промени трябва да бъдат одобрени.",
        "E_UNKNOWN_ERROR": "Възникна неизвестна грешка.",
        "E_UNAUTHORIZED": "Преводът на документа бе отказан.",
        "W_TIMEOUT": "Някои изречения не са преведени, защото преводът отне твърде много време.",
        "W_SENTENCE_TOO_LONG": "Някои изречения не са преведени, защото са прекалено дълги."
    },
    'de': {
        "E_DEFAULT_ERROR": "Beim Übersetzen ist ein Fehler aufgetreten.",
        "E_UNKNOWN_FILE_TYPE": "Unbekannter Dateityp.",
        "E_CANNOT_READ_FILE": "Die Datei kann nicht gelesen werden. Die Datei könnte beschädigt sein.",
        "E_FAILED_IN_TRANSLATION": "Beim Übersetzen ist ein Fehler aufgetreten.",
        "E_FORMAT_TRACK_CHANGES": "Übersetzen war nicht möglich, da \"Änderungen nachverfolgen\" aktiviert ist. Die Änderungen müssen zuerst angenommen werden.",
        "E_UNKNOWN_ERROR": "Ein unbekannter Fehler ist aufgetreten.",
        "E_UNAUTHORIZED": "Die Übersetzung des Dokuments wurde verweigert.",
        "W_TIMEOUT": "Manche Sätze wurden nicht übersetzt, da die Übersetzung zu viel Zeit in Anspruch nahm.",
        "W_SENTENCE_TOO_LONG": "Manche Sätze wurden nicht übersetzt, da sie zu lang sind."
    },
});