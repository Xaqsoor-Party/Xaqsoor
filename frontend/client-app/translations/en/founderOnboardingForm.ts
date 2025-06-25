import {DocumentType} from "@/types/FounderFormData";

type OnboardingTranslation = {
    title: string,
    subtitle: string,
    loading: string,
    buttons: {
        submit: string,
        submitting: string
    },
    alerts: {
        validationTitle: string,
        validationMessage: string,
        submitSuccessTitle: string,
        submitSuccessMessage: string,
        submitErrorTitle: string,
        submitErrorMessage: string,
        fetchErrorMessage: string,
        genericErrorMessage: string,
        invalidPhoneNumberTitle: string,
        invalidPhoneNumberMessage: string
    },
    sections: {
        personal: string,
        contact: string,
        address: string,
        academic: SectionTranslation,
        work: SectionTranslation,
        documents: SectionTranslation,
    },
    fields: {
        firstName: {
            label: string,
            placeholder: string
        },
        middleName: {
            label: string,
            placeholder: string
        },
        lastName: {
            label: string,
            placeholder: string
        },
        gender: {
            label: string,
            placeholder: string,
            options: Array<{
                value: string,
                label: string
            }>
        },
        placeOfBirth: {
            label: string,
            placeholder: string
        },
        dateOfBirth: {
            label: string
        },
        email: {
            label: string,
            placeholder: string
        },
        phone: {
            label: string,
            placeholder: string
        },
        street: {
            label: string,
            placeholder: string
        },
        city: {
            label: string,
            placeholder: string
        },
        state: {
            label: string,
            placeholder: string
        },
        country: {
            label: string,
            placeholder: string
        },
        signature: {
            label: string,
            button: string
        },
        constitutionAgreement: string,
    };
    document: {
        fields: {
            documentType: {
                label: string;
                placeholder: string;
                options: Array<{
                    value: string;
                    label: string;
                }>;
            };
            documentNumber: {
                label: string;
                placeholder: string;
            };
            documentCountry: {
                label: string;
                placeholder: string;
            };
            issuedAt: {
                label: string;
            };
            expiresAt: {
                label: string;
            };
            fileUpload: {
                title: string;
                subTitle: string;
                button:string;
            };
        };
        buttons: {
            addButton: string,
            removeButton: string,
        }
    };
};

type SectionTranslation = {
    title: string;
    subtitle?: string; // Optional
}


export type FounderPageTranslation = {
    founderOnboarding: OnboardingTranslation;
}

export const founderPageTranslation: FounderPageTranslation = {
        "founderOnboarding": {
            "title": "Xaqsoor Core Founders Onboarding Form",
            "subtitle": "Be part of history. As a founding member, you help shape the direction, values, and future of the Xaqsoor Organization. Complete this application with care and conviction.",
            "loading": "Loading form...",
            "buttons": {
                "submit": "Submit Application",
                "submitting": "Submitting..."
            },
            "alerts": {
                "validationTitle": "Validation Error",
                "validationMessage": "Please correct the highlighted fields.",
                "submitSuccessTitle": "Success",
                "submitSuccessMessage": "Your application has been submitted successfully.",
                "submitErrorTitle": "Submission Failed",
                "submitErrorMessage": "Something went wrong during submission.",
                "fetchErrorMessage": "Error fetching data for the form.",
                "genericErrorMessage": "An unexpected error occurred while submitting the form.",
                "invalidPhoneNumberTitle": "Invalid Phone Number",
                "invalidPhoneNumberMessage": "Please enter a valid phone number."
            },
            "sections": {
                "personal": "Personal Information",
                "contact": "Contact Information",
                "address": "Address Information",
                "academic": {
                    title: "Academic Records",
                    subtitle: "Provide your most recent academic records. You can add up to 5 entries.",
                },
                work: {
                    title: "Work Experience",
                    subtitle: "Tell us about your most relevant professional experiences. You can add up to 5 entries.",
                },
                "documents": {
                    title: "Identification Documents",
                    subtitle: "Please upload a valid government-issued document such as a passport or national ID.",
                },
            },
            "fields": {
                "firstName": {
                    "label": "First Name",
                    "placeholder": "e.g. Mohamed"
                },
                "middleName": {
                    "label": "Middle Name",
                    "placeholder": "e.g. Ahmed"
                },
                "lastName":
                    {
                        "label": "Last Name",
                        "placeholder": "e.g. Ali"
                    },
                "gender": {
                    "label": "Gender",
                    "placeholder": "Select Gender",
                    options: [
                        {value: "Male", label: "Male"},
                        {value: "Female", label: "Female"},

                    ]
                },
                "placeOfBirth": {
                    "label": "Place of Birth",
                    "placeholder": "e.g. Mogadishu"
                },
                "dateOfBirth": {
                    "label": "Date of Birth"
                },
                "email": {
                    "label": "Email",
                    "placeholder": "e.g. example@example.com"
                },
                "phone": {
                    "label": "Phone Number",
                    "placeholder": "e.g. 0612345675"
                },
                "street": {
                    "label": "Street",
                    "placeholder": "e.g. KM4 Street"
                },
                "city": {
                    "label": "City",
                    "placeholder": "e.g. Mogadishu"
                },
                "state": {
                    "label": "State",
                    "placeholder": "e.g. Banaadir"
                },
                "country": {
                    "label": "Country",
                    "placeholder": "Select Country"
                },

                "signature": {
                    "label": "Signature",
                    "button": "clear"
                },
                "constitutionAgreement": "I am freely requesting to become a full member of the Xaqsoor Organization, fully prepared to uphold the constitution, principles, and values upon which the organization is founded. I have read them all and am fully convinced.",
            },
            "document": {
                "fields": {
                    "documentType": {
                        "label": "Type of Document",
                        "placeholder": "Select Document Type",
                        "options": [
                            { "value": DocumentType.PASSPORT, "label": "Passport" },
                            { "value": DocumentType.NATIONAL_ID, "label": "National ID" }
                        ]
                    },
                    "documentNumber": {
                        "label": "Document Number",
                        "placeholder": "Enter the ID or passport number"
                    },
                    "documentCountry": {
                        "label": "Issuing Country",
                        "placeholder": "e.g., Somalia"
                    },
                    "issuedAt": {
                        "label": "Issued At"
                    },
                    "expiresAt": {
                        "label": "Expires At"
                    },
                    "fileUpload": {
                        "title": "Upload your ID",
                        "subTitle": "JPG, PNG, or PDF format; maximum size of 20MB",
                        "button": "Upload",
                    }
                },
                buttons: {
                    addButton: "Add Document",
                    removeButton: "remove",
                }
            }
        }
}