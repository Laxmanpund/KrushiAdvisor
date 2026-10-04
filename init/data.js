const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Crop = require("../models/crop");
const Disease = require("../models/disease");
const Advisor = require("../models/advisor");

const MONGO_URL = "mongodb://127.0.0.1:27017/krushi-advisor";

const crops = [
    {
        name: "गहू",
        category: "रब्बी पीक",
        season: "रब्बी",
        soil: "चांगला निचरा होणारी मध्यम ते भारी जमीन",
        irrigation: "गरजेनुसार नियमित सिंचन",
        sowing: "ऑक्टोबर ते नोव्हेंबर",
        harvesting: "पीक पूर्ण पक्व झाल्यावर",
        fertilizer: "माती परीक्षणानुसार खत व्यवस्थापन",
        commonDiseases: [
            "गव्हावरील तांबेरा रोग"
        ]
    },

    {
        name: "कापूस",
        category: "खरीप पीक",
        season: "खरीप",
        soil: "चांगला निचरा होणारी काळी जमीन",
        irrigation: "पावसाच्या प्रमाणानुसार आवश्यक सिंचन",
        sowing: "मान्सून सुरू झाल्यानंतर",
        harvesting: "बोंडे पूर्ण उघडल्यानंतर",
        fertilizer: "माती परीक्षणानुसार संतुलित खत व्यवस्थापन",
        commonDiseases: [
            "बोंडअळी",
            "पानावरील रोग"
        ]
    },

    {
        name: "सोयाबीन",
        category: "खरीप पीक",
        season: "खरीप",
        soil: "मध्यम ते भारी, चांगला निचरा असलेली जमीन",
        irrigation: "सामान्यतः पावसावर आधारित; गरजेनुसार सिंचन",
        sowing: "मान्सून सुरू झाल्यानंतर",
        harvesting: "शेंगा पूर्ण पक्व झाल्यावर",
        fertilizer: "माती परीक्षणानुसार खत व्यवस्थापन",
        commonDiseases: [
            "शेंगा पोखरणारी कीड",
            "पानावरील रोग"
        ]
    },

    {
        name: "भात",
        category: "खरीप पीक",
        season: "खरीप",
        soil: "पाणी धरून ठेवणारी चिकणमाती किंवा गाळाची जमीन",
        irrigation: "पिकाच्या गरजेनुसार नियमित पाणी व्यवस्थापन",
        sowing: "प्रदेश व पद्धतीनुसार",
        harvesting: "धान्य पूर्ण पक्व झाल्यावर",
        fertilizer: "माती परीक्षणानुसार खत व्यवस्थापन",
        commonDiseases: [
            "भातावरील करपा रोग"
        ]
    }
];

const diseases = [
    {
        name: "गव्हावरील तांबेरा रोग",
        type: "रोग",
        crop: "गहू",
        description:
            "गव्हाच्या पिकावर परिणाम करणारा बुरशीजन्य रोग, ज्यामुळे पिकाची वाढ आणि उत्पादन प्रभावित होऊ शकते.",
        symptoms: [
            "पानांवर तांबूस किंवा गंजासारखे डाग दिसणे",
            "पानांची हिरवळ कमी होणे",
            "पिकाच्या वाढीवर परिणाम होणे"
        ],
        favorableConditions: [
            "अनुकूल तापमान",
            "जास्त आर्द्रता",
            "पिकामध्ये जास्त ओलावा"
        ],
        management: [
            "पिकाची नियमित पाहणी करणे",
            "रोगाची सुरुवातीची लक्षणे दिसल्यास कृषी तज्ज्ञांचा सल्ला घेणे",
            "स्थानिक कृषी विभागाच्या शिफारशींनुसार व्यवस्थापन करणे"
        ],
        prevention: [
            "प्रतिरोधक किंवा शिफारस केलेल्या वाणांचा वापर",
            "योग्य पीक व्यवस्थापन",
            "नियमित पिकाची पाहणी"
        ]
    },


    {
        name: "कापसावरील बोंडअळी",
        type: "कीड",
        crop: "कापूस",
        description:
            "कापूस पिकाच्या बोंडांवर आणि इतर प्रजननक्षम भागांवर नुकसान करू शकणारी सामान्य कीड.",
        symptoms: [
            "बोंडांवर नुकसान झाल्याचे चिन्ह दिसणे",
            "फुलांमध्ये किंवा बोंडांमध्ये अळी आढळणे",
            "बोंडांच्या विकासावर परिणाम होणे"
        ],
        favorableConditions: [
            "अनुकूल हवामान",
            "पिकामध्ये किडीची वाढ होण्यासाठी अनुकूल परिस्थिती",
            "शेताची नियमित पाहणी न होणे"
        ],
        management: [
            "पिकाची नियमित पाहणी करणे",
            "किडीची लक्षणे आढळल्यास कृषी तज्ज्ञांचा सल्ला घेणे",
            "स्थानिक कृषी विभागाच्या शिफारशींनुसार व्यवस्थापन करणे"
        ],
        prevention: [
            "नियमित निरीक्षण",
            "योग्य पीक व्यवस्थापन",
            "शिफारस केलेल्या पद्धतींचा वापर"
        ]
    },


    {
        name: "भुरी रोग",
        type: "रोग",
        crop: "विविध पिके",
        description:
            "पिकाच्या पानांवर किंवा इतर भागांवर पांढऱ्या भुकटीसारखी वाढ दिसू शकणारा बुरशीजन्य रोग.",
        symptoms: [
            "पानांवर पांढऱ्या भुकटीसारखी वाढ दिसणे",
            "पानांची वाढ प्रभावित होणे",
            "पिकाच्या आरोग्यावर परिणाम होणे"
        ],
        favorableConditions: [
            "अनुकूल तापमान",
            "आर्द्रता",
            "पिकामध्ये अनुकूल सूक्ष्म वातावरण"
        ],
        management: [
            "पिकाची नियमित पाहणी करणे",
            "लक्षणे आढळल्यास कृषी तज्ज्ञांचा सल्ला घेणे",
            "स्थानिक शिफारशींनुसार व्यवस्थापन करणे"
        ],
        prevention: [
            "योग्य अंतर ठेवून लागवड",
            "नियमित पिकाची पाहणी",
            "योग्य पीक व्यवस्थापन"
        ]
    },


    {
        name: "सोयाबीनवरील शेंगा पोखरणारी कीड",
        type: "कीड",
        crop: "सोयाबीन",
        description:
            "सोयाबीनच्या शेंगांवर परिणाम करून बियांच्या विकासावर परिणाम करू शकणारी कीड.",

        symptoms: [
            "शेंगांमध्ये नुकसान झाल्याचे चिन्ह दिसणे",
            "शेंगांमध्ये अळी आढळणे",
            "बियांच्या विकासावर परिणाम होणे"
        ],

        favorableConditions: [
            "अनुकूल हवामान",
            "किडीसाठी अनुकूल परिस्थिती",
            "पिकाची नियमित पाहणी न होणे"
        ],

        management: [
            "पिकाची नियमित पाहणी करणे",
            "किडीची लक्षणे दिसल्यास कृषी तज्ज्ञांचा सल्ला घेणे",
            "स्थानिक कृषी विभागाच्या शिफारशींनुसार व्यवस्थापन करणे"
        ],

        prevention: [
            "नियमित निरीक्षण",
            "योग्य पीक व्यवस्थापन",
            "शिफारस केलेल्या पद्धतींचा वापर"
        ]
    }
];


async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    await Crop.deleteMany({});
    await Disease.deleteMany({});
    await Advisor.deleteMany({});

    // Only advisor users will be deleted.
    // Farmer/Admin users will remain safe.
    await User.deleteMany({
        role: "advisor"
    });
    await Crop.insertMany(crops);
    console.log("4 crops inserted");
    await Disease.insertMany(diseases);
    console.log("4 diseases/pests inserted");

    const hashedPassword = await bcrypt.hash(
        "advisor123",
        12
    );


    const advisorUsers = await User.insertMany([
        {
            name: "डॉ. राजेश पाटील",
            email: "rajesh@krushiadvisor.com",
            password: hashedPassword,
            role: "advisor"
        },

        {
            name: "डॉ. प्रिया शर्मा",
            email: "priya@krushiadvisor.com",
            password: hashedPassword,
            role: "advisor"
        },

        {
            name: "डॉ. अमित देशमुख",
            email: "amit@krushiadvisor.com",
            password: hashedPassword,
            role: "advisor"
        }
    ]);
    console.log("3 advisor users created");

    const advisors = [
        {
            user: advisorUsers[0]._id,
            name: "डॉ. राजेश पाटील",
            qualification: "M.Sc. Agriculture",
            expertise: [
                "पीक व्यवस्थापन",
                "मृदा विज्ञान",
                "सिंचन व्यवस्थापन",
                "अन्नद्रव्य व्यवस्थापन"
            ],
            experience: 8,
            location: "महाराष्ट्र",
            rating: 4.8,
            consultationFee: 500,
            isAvailable: true,
            about:
                "डॉ. राजेश पाटील हे कृषी क्षेत्रातील व्यावसायिक असून त्यांना पीक व्यवस्थापन आणि मृदा विज्ञानाचा अनुभव आहे. ते पिकाची परिस्थिती आणि शेतीच्या पद्धतीनुसार कृषी मार्गदर्शन देतात.",
            experienceDescription:
                "शेतकऱ्यांना कृषी मार्गदर्शन आणि पीक व्यवस्थापनाबाबत सहाय्य प्रदान करणे."
        },

        {
            user: advisorUsers[1]._id,
            name: "डॉ. प्रिया शर्मा",
            qualification: "Ph.D. Plant Pathology",
            expertise: [
                "वनस्पती रोग",
                "कीड व्यवस्थापन"
            ],
            experience: 10,
            location: "महाराष्ट्र",
            rating: 4.9,
            consultationFee: 700,
            isAvailable: true,
            about:
                "डॉ. प्रिया शर्मा यांना वनस्पती रोग आणि कीड व्यवस्थापन क्षेत्रात विशेष अनुभव आहे.",
            experienceDescription:
                "पिकांवरील रोग आणि किडींचे व्यवस्थापन करण्यासाठी कृषी मार्गदर्शन."
        },


        {
            user: advisorUsers[2]._id,
            name: "डॉ. अमित देशमुख",
            qualification: "M.Sc. Soil Science",
            expertise: [
                "माती व्यवस्थापन",
                "सिंचन व्यवस्थापन"
            ],

            experience: 6,
            location: "महाराष्ट्र",
            rating: 4.7,
            consultationFee: 400,
            isAvailable: true,
            about:
                "डॉ. अमित देशमुख हे माती आणि सिंचन व्यवस्थापन क्षेत्रातील कृषी सल्लागार आहेत.",
            experienceDescription:
                "शेतकऱ्यांना माती परीक्षण, माती व्यवस्थापन आणि सिंचनाबाबत मार्गदर्शन."
        }
    ];

    await Advisor.insertMany(advisors);
    console.log("3 advisor profiles created");
    await mongoose.connection.close();
    console.log("Database initialization completed");
}

main().catch((err) => {
    console.log(err);
});