import {joinPage as enJoinPage} from "@/translations/en/joinPage";
import {authPages as enAuthPages} from "@/translations/en/authForms";
import {notFoundPage as enNotFoundPage} from "@/translations/en/notFoundPage";
import {sidebarLabels as enSidebar} from "@/translations/en/sidebar";

import {joinPage as soJoinPage} from "@/translations/so/joinPage";
import {authPages as soAuthPages} from "@/translations/so/authForms";
import {notFoundPage as soNotFoundPage} from "@/translations/so/notFoundPage";
import {sidebarLabels as soSidebar} from "@/translations/so/sidebar";

import {LanguageTranslations} from "@/types/translationsTypes";

const translations: LanguageTranslations = {
    en: {
        joinPage : enJoinPage,
        authPages:enAuthPages,
        notFoundPage:enNotFoundPage,
        sidebar:enSidebar,
    },
    so: {
        joinPage : soJoinPage,
        authPages:soAuthPages,
        notFoundPage:soNotFoundPage,
        sidebar:soSidebar,
    },
};

export const getTranslations = <T extends keyof LanguageTranslations['en']>(
    language: keyof LanguageTranslations,
    module: T
): LanguageTranslations['en'][T] => {
    return translations[language][module];
};

export default translations;