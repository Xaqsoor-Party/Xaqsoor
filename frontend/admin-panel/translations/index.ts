import {authPages as enAuthPages} from "@/translations/en/authForms";
import {notFoundPage as enNotFoundPage} from "@/translations/en/notFoundPage";
import {sidebarLabels as enSidebar} from "@/translations/en/sidebar";
import {settingsPage as enSetting} from "@/translations/en/settingsPage";

import {authPages as soAuthPages} from "@/translations/so/authForms";
import {notFoundPage as soNotFoundPage} from "@/translations/so/notFoundPage";
import {sidebarLabels as soSidebar} from "@/translations/so/sidebar";
import {settingsPage as soSetting} from "@/translations/so/settingsPage";

import {LanguageTranslations} from "@/types/translationsTypes";

const translations: LanguageTranslations = {
    en: {
        authPages:enAuthPages,
        notFoundPage:enNotFoundPage,
        sidebar:enSidebar,
        settingsPage:enSetting,
    },
    so: {
        authPages:soAuthPages,
        notFoundPage:soNotFoundPage,
        sidebar:soSidebar,
        settingsPage:soSetting,
    },
};

export const getTranslations = <T extends keyof LanguageTranslations['en']>(
    language: keyof LanguageTranslations,
    module: T
): LanguageTranslations['en'][T] => {
    return translations[language][module];
};

export default translations;