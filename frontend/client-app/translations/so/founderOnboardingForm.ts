import {FounderPageTranslation} from "@/translations/en/founderOnboardingForm";
import {DocumentType} from "@/types/FounderFormData";

export const founderPageTranslation: FounderPageTranslation = {
    "founderOnboarding": {
        title: "Foomka Diiwaangelinta Aasaasayaasha Xaqsoor",
        subtitle: "Noqo qayb ka mid ah taariikhda. Xubin ahaan oo ka mid ah aasaasayaasha, waxaad door weyn ku yeelan doontaa jihada, qiyamka, iyo mustaqbalka Ururka Xaqsoor. Buuxi codsigan si taxaddar iyo daacadnimo leh.",
        loading: "Loading form...",
        buttons: {
            submit: "Gudbi Codsiga",
            submitting: "Waa la gudbinayaa..."
        },
        alerts: {
            validationTitle: "Khalad Xaqiijin",
            validationMessage: "Fadlan sax meelaha la calaamadeeyay.",
            submitSuccessTitle: "Guul",
            submitSuccessMessage: "Codsigaaga si guul leh ayaa loo gudbiyay.",
            submitErrorTitle: "Gudbinta Waa Fashilantay",
            submitErrorMessage: "Wax qalad ah ayaa dhacay inta lagu guda jiray gudbinta.",
            fetchErrorMessage: "Khalad ayaa dhacay inta xogta foomka la soo helayay.",
            genericErrorMessage: "Khalad lama filaan ah ayaa dhacay inta la gudbinayay foomka.",
            invalidPhoneNumberTitle: "Lambarka Telefoonka Waa Khaldan",
            invalidPhoneNumberMessage: "Fadlan geli lambarka saxda ah ee telefoonka."
        },
        sections: {
            personal: "Xogta Shakhsiyeed",
            contact: "Xogta La Xiriirka",
            address: "Xogta Cinwaanka",
            academic: {
                title: "Diiwaanka Waxbarashada",
                subtitle: "Soo gudbi diiwaankaaga waxbarasho ee ugu dambeeyay. Waxaad ku dari kartaa illaa 5 xogood.",
            },
            work: {
                title: "Khibradda Shaqo",
                subtitle: "Noo sheeg khibradahaaga shaqo ee ugu muhiimsan. Waxaad ku dari kartaa illaa 5 xogood.",
            },
            documents: {
                title: "Dukumiintiyada Aqoonsiga",
                subtitle: "Fadlan soo geli dukumiinti sax ah oo dowladdu bixisay sida baasaboorka ama aqoonsiga qaranka.",
            },
        },
        fields: {
            firstName: {
                label: "Magacaga",
                placeholder: "tusaale: Maxamed"
            },
            middleName: {
                label: "Magaca Abaha",
                placeholder: "tusaale: Axmed"
            },
            lastName: {
                label: "Magaca Awowga",
                placeholder: "tusaale: Cali"
            },
            gender: {
                label: "Jinsi",
                placeholder: "Dooro Jinsi",
                options: [
                    {value: "Male", label: "Lab"},
                    {value: "Female", label: "Dheddig"},

                ],
            },
            placeOfBirth: {
                label: "Goobta Dhalashada",
                placeholder: "tusaale: Muqdisho"
            },
            dateOfBirth: {
                label: "Taariikhda Dhalashada"
            },
            email: {
                label: "Email",
                placeholder: "tusaale: tusaale@tusaale.com"
            },
            phone: {
                label: "Lambarka Telefoonka",
                placeholder: "tusaale: 0612345675"
            },
            street: {
                label: "Waddo",
                placeholder: "tusaale: Wadada KM4"
            },
            city: {
                label: "Magaalo",
                placeholder: "tusaale: Muqdisho"
            },
            state: {
                label: "Gobol",
                placeholder: "tusaale: Banaadir"
            },
            country: {
                label: "Waddan",
                placeholder: "Dooro Waddanka"
            },
            signature: {
                label: "Saxeexaaga",
                button: "tirtir"
            },
            constitutionAgreement: "Waxaan si xor ah u codsanayaa in aan xubin buuxda ka noqdo Ururka Xaqsoor, anigoo oggol in aan ilaaliyo dastuurka, mabaadi’da, iyo qiyamka uu ururku ku dhisan yahay, kuwaas oo aan dhammaantood akhriyey kuna qancay.",
        },
        document: {
            fields: {
                documentType: {
                    label: "Nooca Dukumiintiga",
                    placeholder: "Dooro Nooca Dukumiintiga",
                    options: [
                        { value: DocumentType.PASSPORT, label: "Baasaboor" },
                        { value: DocumentType.NATIONAL_ID, label: "Aqoonsi Qaran" }
                    ]
                },
                documentNumber: {
                    label: "Lambarka Dukumiintiga",
                    placeholder: "Geli lambarka baasaboorka ama aqoonsiga"
                },
                documentCountry: {
                    label: "Waddanka Soo Saaray",
                    placeholder: "tusaale: Soomaaliya"
                },
                issuedAt: {
                    label: "Taariikhda La Bixiyay"
                },
                expiresAt: {
                    label: "Taariikhda Dhammaanaysa"
                },
                fileUpload: {
                    title: "Soo geli Aqoonsigaaga",
                    subTitle: "Qaabab JPG, PNG, ama PDF; ugu badnaan 20MB",
                    button: "Soo geli"
                }
            },
            buttons: {
                addButton: "Ku dar Dukumiinti",
                removeButton: "Ka saar"
            }
        },
    }
}