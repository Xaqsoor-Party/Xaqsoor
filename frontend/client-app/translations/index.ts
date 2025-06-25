import {joinPage as enJoinPage} from "@/translations/en/joinPage";
import {authPages as enAuthPages} from "@/translations/en/authForms";
import {notFoundPage as enNotFoundPage} from "@/translations/en/notFoundPage";
import {sidebarLabels as enSidebar} from "@/translations/en/sidebar";
import {settingsPage as enSetting} from "@/translations/en/settingsPage";
import {founderPageTranslation as enFounderOnboardingForm} from "@/translations/en/founderOnboardingForm";

import {joinPage as soJoinPage} from "@/translations/so/joinPage";
import {authPages as soAuthPages} from "@/translations/so/authForms";
import {notFoundPage as soNotFoundPage} from "@/translations/so/notFoundPage";
import {sidebarLabels as soSidebar} from "@/translations/so/sidebar";
import {settingsPage as soSetting} from "@/translations/so/settingsPage";
import {founderPageTranslation as soFounderOnboardingForm} from "@/translations/so/founderOnboardingForm";

import {LanguageTranslations} from "@/types/translationsTypes";

const translations: LanguageTranslations = {
    en: {
        joinPage : enJoinPage,
        authPages:enAuthPages,
        notFoundPage:enNotFoundPage,
        sidebar:enSidebar,
        settingsPage:enSetting,
        founderPages: enFounderOnboardingForm,
    },
    so: {
        joinPage : soJoinPage,
        authPages:soAuthPages,
        notFoundPage:soNotFoundPage,
        sidebar:soSidebar,
        settingsPage:soSetting,
        founderPages:soFounderOnboardingForm,
    },
};

export const getTranslations = <T extends keyof LanguageTranslations['en']>(
    language: keyof LanguageTranslations,
    module: T
): LanguageTranslations['en'][T] => {
    return translations[language][module];
};

export default translations;