import {AuthPages} from "@/translations/en/authForms";

export const authPages: AuthPages = {
    AuthForms: {
        titleRegister: "Samee Akoon Cusub",
        titleLogin: "Ku Soo Dhawoow!",
        subtitleRegister: "Fadlan buuxi faahfaahinta si aad u abuurto akoon.",
        subtitleLogin: "Fadlan gal akoonkaaga si aad u sii wadato.",
        firstName: "Magacaga",
        middleName: "Magaca Abaha",
        lastName: "Magaca Awowga",
        phone: "Nambarka Taleefanka",
        gender: "Jinsiga",
        genderPlaceholder:"-- Dooro Jinsiga --",
        genderOptions: [
            { value: "Male", label: "Lab" },
            { value: "Female", label: "Dhedig" },
        ],
        email: "Email",
        password: "Furaha Sirta",
        showPasswordText: "Muuji Furaha Sirta",
        resetPassword: "Furaha waa ilaaway",
        register: "Is Diiwaangeli",
        login: "Soo gal",
        signupLinkRegister: "Soo gal",
        signupLinkLogin: "Samee mid",
        signupTextRegister: "Miyaad horey u lahayd akoon?",
        signupTextLogin: "Ma lihid akoon?",
    },
    SetPassword: {
        title: "Dooro Furaha Cusub",
        newPassword: "Furaha Cusub",
        confirmPassword: "Xaqiiji Furaha",
        showPasswordText: "Muuji Furaha",
        resetPasswordText: "Cusboonaysii Furaha Sirta",
        backToLogin: "Ku Noqo Soo Galida",
        greetingLine1: "Salaam,",
        greetingLine2: "Fadlan geli furaha cusub hoos.",
    },
    PasswordResetConfirmation: {
        title: "Codsiga Furaha Sirta ah",
        message: (email: string) => `Haddii akoon uu jiro ${email}, waxaad heli doontaa email leh tilmaamo ku saabsan sida loo cusboonaysiiyo furahaaga sirta ah. Haddii uusan imaanin, fadlan hubi sanduuqaaga spam.`,
        backLinkText: "Ku Noqo Galitaanka"
    },
    ResetPasswordRequest: {
        title: "Gali email-kaaga si aad u cusboonaysiiso furaha sirta ah",
        buttonText: "Cusboonaysii Furaha Sirta ah",
        cancelText: "Jooji",
    },
    MfaTranslations:{
        title: "Xaqiijin Dheeraad ah ayaa loo Baahan Yahay",
        descriptionStart: "Akaawnkaaga waxaa lagu ilaaliyaa xaqiijin laba-marxaladood ah",
        mfaLinkText: "(MFA)",
        instructions: "Si aad u dhammaystirto galitaanka, fadlan geli koodhka laga soo qaaday qalabkaaga MFA hoos.",
        inputLabel: "Koodhka MFA",
        inputPlaceholder: "123456",
        verifyButton: {
            default: "Xaqiiji",
            submitting: "Waxaa la xaqiijinayaa..."
        },
        errorEmptyCode: "Fadlan geli koodhka MFA."
    }
}