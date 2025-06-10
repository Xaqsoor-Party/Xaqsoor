type JoinForm = {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    email: string;
    phoneNumber: string;
    agree: string;
    submit: string;
    genderPlaceholder: string;
    genderOptions: Array<{ value: string; label: string }>;
    successTitle: string;
    successMessage:string;
    checkEmail:string;
}

type PartyJoinPageContent = {
    header: {
        title: string;
        description: string;
    };
    mainContent: {
        formSection: {
            title: string;
        };
        infoSection: {
            title: string;
            bulletPoints: Array<{
                icon: string;
                title: string;
                description: string;
            }>;
        };
    };
    footer: {
        title: string;
        description: string;
        visionList: Array<string>;
        callToAction: string;
    };
}

export type JoinPage = {
    joinForm: JoinForm;
    partyJoinPage:PartyJoinPageContent;
}

export const joinPage: JoinPage = {
    joinForm: {
        firstName: "First Name",
        middleName: "Middle Name",
        lastName: "Last Name",
        gender: "Gender",
        email: "Email",
        phoneNumber: "Phone Number",
        agree: "I agree to the terms and conditions",
        submit: "Submit",
        genderPlaceholder: "Select Gender",
        genderOptions: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" }
        ],
        checkEmail:"Please check your inbox for further instructions.",
        successMessage:"You will soon receive an email containing your username and a temporary password to complete your registration.",
        successTitle:"Registration Successful!",
    },
    partyJoinPage: {
        header: {
            title: "Join the Xaqsoor party",
            description: "Become part of a transformative political force dedicated to building a more just, equitable, and prosperous Somalia. By joining Xaqsoor, you're not just becoming a member - you're becoming part of a community committed to positive change, transparent governance, and national unity."
        },
        mainContent: {
            formSection: {
                title: "Join Our Movement Today"
            },
            infoSection: {
                title: "Why Become a Xaqsoor Member?",
                bulletPoints: [
                    {
                        icon: "FaLeaf",
                        title: "Shape Our Nation's Future",
                        description: "Directly influence policies and decisions that will build a sustainable, prosperous Somalia for future generations."
                    },
                    {
                        icon: "FaUsers",
                        title: "Join a Community of Changemakers",
                        description: "Connect with like-minded individuals passionate about creating positive change through meaningful dialogue and collective action."
                    },
                    {
                        icon: "FaHandshake",
                        title: "Participate in Democratic Processes",
                        description: "Gain opportunities to vote on party matters, run for internal positions, and help select our candidates for public office."
                    },
                    {
                        icon: "FaChartLine",
                        title: "Access Exclusive Development Programs",
                        description: "Benefit from leadership training, policy workshops, and professional development opportunities reserved for members."
                    },
                    {
                        icon: "FaComments",
                        title: "Amplify Your Voice",
                        description: "Contribute to policy formulation through our member consultation platforms and local chapter meetings."
                    },
                    {
                        icon: "FaUserShield",
                        title: "Support Transparent Governance",
                        description: "Be part of a movement that champions accountability, anti-corruption, and ethical leadership at all levels."
                    }
                ]
            }
        },
        footer: {
            title: "Our Vision for Somalia",
            description: "Xaqsoor envisions a Somalia where every citizen has equal opportunity to thrive, where transparent governance replaces corruption, and where national unity transcends clan divisions. We're building a nation where:",
            visionList: [
                "Quality education and healthcare are accessible to all",
                "Economic policies prioritize job creation and entrepreneurship",
                "Infrastructure development connects communities and powers progress",
                "Peace and security allow families to prosper without fear",
                "Cultural heritage is preserved while embracing innovation"
            ],
            callToAction: "By joining Xaqsoor, you become part of making this vision a reality. Your membership supports our efforts to field qualified candidates, develop evidence-based policies, and engage communities nationwide."
        }
    }
}