import {SettingsPage} from "@/translations/en/settingsPage";

export const settingsPage: SettingsPage = {
    settings: {
        settingsTitle: "Settings",
        options: {
            profile: {
                title: "Xogta Shaqsiga",
                description: "Eeg macluumaadkaaga shaqsiga ah"
            },
            editProfile: {
                title: "Wax ka beddel Xogta",
                description: "Cusboonaysii magacaaga, address, ama faahfaahin kale"
            },
            changePassword: {
                title: "Beddel Furaha Sirta",
                description: "Cusboonaysii Furaha sirta ee akoonkaaga"
            },
            mfa: {
                title: "MFA",
                description: "Maamul xaqiijinta laba-marxaladood"
            },
            activeSessions: {
                title: "Fadhiyada Firfircoon",
                description: "Eeg dhammaan qalabka aad hadda ku gashan tahay oo maamul fadhiyadaada"
            }
        }
    },
    profile: {
        tabs: {
            about: "Ku Saabsan",
            work: "Shaqo",
            education: "Waxbarasho",
            contact: "La xidhiidh"
        },
        userData:{
            personalInformation: "Xogta Shaqsiga",
            gender: "Jinsi",
            dateOfBirth: "Taariikhda Dhalashada",
            placeOfBirth: "Goobta Dhalashada",
            accountCreatedDate: "Taariikhda La Sameeyey",
            lastLoginDate: "Gelidii Ugu Dambeysay",
            accountDetails: "Faahfaahinta Akoonka",
            biography: "Taariikh Nololeed"
        },
        workExperience: {
            loadingMessage: "Loading work experience...",
            noDataMessage: "Wax Shaqo ah laguma darin weli.",
            sectionTitle: "Khibradda Shaqo",
            errors: {
                noUser: "No user found.",
                noData: "No work experience data found.",
                failedToLoad: "Failed to load work experience. Please try again later."
            }
        },
        academicRecord: {
            loadingMessage: "Diiwaannada waxbarashada waa la rarayaa...",
            noDataMessage: "Diiwaanno waxbarasho laguma darin weli.",
            sectionTitle: "Diiwaannada Waxbarashada",
            errors: {
                noData: "Xog ku saabsan diiwaannada waxbarashada lama helin.",
                failedToLoad: "Ku guuldareystay in la load gareeyo diiwaannada waxbarashada. Fadlan isku day mar kale."
            }
        },
        contactInfo: {
            title: "Faahfaahinta La xidhiidh",
            noContactInfo: "Xog lama heli karo."
        }
    },
    editProfile: {
        title: "Tafatir Profile-ka",
        subtitle: "Cusbooneysii magacaaga, faahfaahinta xiriirka, iyo macluumaadka asalkaaga.",
        loading: "Profile-ka waa la rarayaa...",
        buttons: {
            submit: "Gudbi",
            submitting: "Waa la gudbinayaa..."
        },
        alerts: {
            validationTitle: "Khalad Xaqiijin",
            validationMessage: "Fadlan sax meelaha muujisan khaladaadka.",
            updateSuccessTitle: "Guul",
            updateSuccessMessage: "Profile-ka si guul leh ayaa loo cusbooneysiiyay!",
            updateErrorTitle: "Khalad",
            updateErrorMessage: "Profile-ka lama cusbooneysiin karin.",
            fetchErrorMessage: "Khalad ayaa dhacay markii la soo qaadayay profile-ka isticmaalaha.",
            genericErrorMessage: "Khalad lama filaan ah ayaa dhacay inta lagu cusbooneysiinayay profile-kaaga."
        },
        sections: {
            personal: "Macluumaadka Shakhsiyeed",
            address: "Macluumaadka Cinwaanka",
            academic: "Diiwaannada Waxbarashada",
            work: "Khibradda Shaqo"
        },
        fields: {
            firstName: {
                label: "Magacaga",
                placeholder: "Geli magacaaga"
            },
            middleName: {
                label: "Magaca Abaha",
                placeholder: "Geli magacaaga abaha"
            },
            lastName: {
                label: "Magaca Awowga",
                placeholder: "Geli magacaaga Awowga"
            },
            gender: {
                label: "Jinsiga",
                placeholder: "Dooro jinsigaaga",
                options: {
                    male: "Lab",
                    female: "Dhedig"
                }
            },
            placeOfBirth: {
                label: "Goobta Dhalashada",
                placeholder: "Geli goobta dhalashadaada"
            },
            dateOfBirth: {
                label: "Taariikhda Dhalashada"
            },
            street: {
                label: "Waddo",
                placeholder: "Geli magaca waddada"
            },
            city: {
                label: "Magaalo",
                placeholder: "Geli magaca magaalada"
            },
            state: {
                label: "Gobol",
                placeholder: "Geli magaca gobolka"
            },
            country: {
                label: "Dalka",
                placeholder: "Geli magaca dalka"
            },
            bio: {
                label: "Warbixin Gaaban",
                placeholder: "Noo sheeg wax yar naftaada"
            }
        },
    },
    academicRecordsForm: {
        sectionTitle: "Diiwaannada Waxbarashada",
        addButton: "Kudar Diiwaan Waxbarasho",
        removeButton: "Ka saar",
        entryTitle: "Diiwaan Waxbarasho",
        fields: {
            institutionName: {
                label: "Machadka / Jaamacadda",
                placeholder: "Magaca Hay’adda Waxbarashada"
            },
            degree: {
                label: "Shahaado La Helay",
                placeholder: "tusaale: Bachelor of Science in Computer Engineering"
            },
            fieldOfStudy: {
                label: "Xirfadda Waxbarasho",
                placeholder: "Xirfadda Waxbarasho"
            },
            level: {
                label: "Heerka Waxbarasho",
                placeholder: "Dooro heerkaaga waxbarasho",
                options: [
                    {value: "HIGH_SCHOOL", label: "Dugsiga Sare"},
                    {value: "DIPLOMA", label: "Diploma"},
                    {value: "BACHELORS", label: "Bachelor"},
                    {value: "MASTERS", label: "Master"},
                    {value: "PHD", label: "PhD"},
                    {value: "OTHER", label: "Kale"}
                ]
            },
            location: {
                label: "Goobta",
                placeholder: "Magaalo, Dal"
            },
            currentlyStudying: {
                label: "Weli Waan Bartaa"
            },
            startDate: {
                label: "Taariikhda Bilowga"
            },
            endDate: {
                label: "Taariikhda Dhammaadka"
            }
        }
    },
    workExperienceForm: {
        sectionTitle: "Khibradda Shaqo",
        addButton: "Kudar Khibrad Shaqo",
        removeButton: "Ka saar",
        entryTitle: "Khibrad Shaqo",
        fields: {
            jobTitle: {
                label: "Cinwaanka Shaqada",
                placeholder: "tusaale: Injineer Software"
            },
            companyName: {
                label: "Magaca Shirkadda",
                placeholder: "tusaale: Tech Solutions Inc."
            },
            location: {
                label: "Goobta",
                placeholder: "Magaalo, Dal"
            },
            currentlyWorking: {
                label: "Wali Halkaan Ayaan Ka Shaqeeyaa"
            },
            startDate: {
                label: "Taariikhda Bilowga"
            },
            endDate: {
                label: "Taariikhda Dhammaadka"
            },
            description: {
                label: "Sharaxaad (Optional)",
                placeholder: "Sharax mas'uuliyadahaaga, guulahaaga, iyo mashruucyada muhiimka ah."
            }
        }
    },
    changePasswordPage: {
        title: "Bedel Furaha Sirta ah",
        subtitle: "Cusbooneysii lambarkaaga sirta ah si aad u ilaaliso akoonkaaga.",
        fields: {
            currentPassword: {
                label: "Lambarka Sirta ah ee Hadda",
                placeholder: "Geli lambarkaaga sirta ah ee hadda"
            },
            newPassword: {
                label: "Furaha Sirta ah ee Cusub",
                placeholder: "Geli furaha sirta ah ee cusub"
            },
            confirmNewPassword: {
                label: "Xaqiiji furaha Sirta ah ee Cusub",
                placeholder: "Ku celi furaha sirta ah ee cusub"
            },
            showCurrentPassword: "Muuji Furaha Sirta ah",
            showNewPasswords: "Muuji Furaha Sirta ah ee cusub",
        },
        buttons: {
            submit: "Bedel Furaha Sirta ah",
            submitting: "Beddelaya..."
        },
        alerts: {
            validationTitle: "Khalad Xaqiijin",
            validationMessage: "Furaha sirta ah iyo Xaqiijinta Furaha sirta ah is ku mid ma aha.",
            updateSuccessTitle: "Guul",
            updateSuccessMessage: "Furaha sirta ah si guul leh ayaa loo cusbooneysiiyay!",
            updateErrorTitle: "Khalad",
            updateErrorMessage: "Furaha sirta ah lama cusbooneysiin. Fadlan isku day mar kale.",
            genericErrorMessage: "Khalad lama filaan ah ayaa ka dhacay intii la beddelayay Furaha sirta ah."
        }
    },
    mfa: {
        title: "Xaqiijinta Laba-Tallaabo (MFA)",
        status: {
            enabled: {
                title: "MFA waa la Daaray",
                description: "Akaawnkaaga waxaa ilaaliya lakab dheeraad ah oo amni"
            },
            disabled: {
                title: "MFA hadda waa la Damiay",
                description: "Si aad u hesho amni dheeraad ah, waxaan kugula talineynaa in aad daarato MFA"
            }
        },
        messages: {
            setupSuccess: "Dejinta MFA waa la bilaabay. Iskaan QR code-ka adigoo adeegsanaya app-kaaga xaqiijinta.",
            setupError: "Lama awoodo in la abuuro QR code-ka MFA. Fadlan isku day mar kale.",
            disableSuccess: "MFA si guul leh ayaa loo damiyay.",
            disableError: "Lama awoodo in la damiyo MFA. Fadlan isku day mar kale.",
            userNotFound: "Lambarka isticmaale lama helin. Fadlan gal akoonkaaga."
        },
        qr: {
            instruction: "Iskaan QR code-kan adigoo adeegsanaya app-kaaga xaqiijinta (tusaale: Google Authenticator, Authy, Microsoft Authenticator)",
            alt: "QR Code-ka MFA",
            hideButton: "Qari QR Code-ka",
            showButton: "Muuji QR Code-ka"
        },
        actions: {
            enable: "Daar MFA",
            disable: "Dami MFA"
        }
    },
    sessions: {
        title: "Fadhiyada Firfircoon",
        infoText:
            "Halkan waxaad ka daawan kartaa dhammaan fadhiyada gelitaanka ee firfircoon ee akoonkaaga. Tani waxay ka mid tahay qalabka, goobta (cinwaanka IP), iyo waqtigii ugu dambeeyay ee firfircoon. Waxa kale oo aad ka jari kartaa dhammaan fadhiyada kale marka laga reebo midka aad hadda ku jirto si loo ilaaliyo amniga.",
        errors: {
            userNotFound: "Isticmaale lama helin. Fadlan gal akoonkaaga.",
            fetchFailed: "Lama helin fadhiyadii. Fadlan isku day mar kale.",
            revokeFailed: "Lama joojin karin fadhiyada. Fadlan isku day mar kale.",
            noSessions: "Ma jiraan fadhiyo firfircoon (ama kaliya fadhigaaga hadda ayaa firfircoon).",
        },
        successMessages: {
            revokeSuccess: (count: number) => `Si guul leh ayaa loo joojiyay ${count} fadhiyo kale.`,
        },
        loading: {
            authenticating: "Isticmaalaha waa la xaqiijinayaa...",
            sessionsLoading: "Fadhiyada waa la rarayaa...",
        },
        sessions: {
            unknownDevice: "Qalab aan la garanayn",
            unknownIp: "IP aan la garanayn",
            lastActiveLabel: "Waqtiga ugu dambeysay ee firfircoon:",
            revokeButton: "Jooji Dhammaan Fadhiyada Kale",
            revokeButtonHint: "Waxaad kaliya joojin kartaa fadhiyada kale haddii ka badan hal ay firfircoon yihiin.",
            confirmModal: {
                title: "Xaqiiji Joojinta Fadhiyada",
                message:
                    "Ma hubtaa inaad rabto inaad joojiso dhammaan fadhiyada firfircoon ee kale? Adigu weli waad sii ahaan doontaa gal.",
                confirmButtonText: "Haa, Jooji",
            },
        },
    }
}