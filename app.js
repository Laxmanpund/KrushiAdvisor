const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");

const Crop = require("./models/crop");
const Disease = require("./models/disease");
const Advisor = require("./models/advisor");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();


const MONGO_URL = "mongodb://127.0.0.1:27017/krushi-advisor";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));


const sessionOptions = {
    secret: "krushi-advisor-secret",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());


app.get("/", (req, res) => {
    res.render("pages/home");
});

app.get("/crops", async (req, res) => {
    const crops = await Crop.find({});
    res.render("pages/crops", { crops });
});

// app.get("/seed-crops", async (req, res) => {
//     await Crop.deleteMany({});

//     const crops = [
//         {
//             name: "गहू",
//             category: "रब्बी पीक",
//             season: "रब्बी",
//             soil: "चांगला निचरा होणारी मध्यम ते भारी जमीन",
//             irrigation: "गरजेनुसार नियमित सिंचन",
//             sowing: "ऑक्टोबर ते नोव्हेंबर",
//             harvesting: "पीक पूर्ण पक्व झाल्यावर",
//             fertilizer: "माती परीक्षणानुसार खत व्यवस्थापन",
//             commonDiseases: [
//                 "गव्हावरील तांबेरा रोग"
//             ]
//         },

//         {
//             name: "कापूस",
//             category: "खरीप पीक",
//             season: "खरीप",
//             soil: "चांगला निचरा होणारी काळी जमीन",
//             irrigation: "पावसाच्या प्रमाणानुसार आवश्यक सिंचन",
//             sowing: "मान्सून सुरू झाल्यानंतर",
//             harvesting: "बोंडे पूर्ण उघडल्यानंतर",
//             fertilizer: "माती परीक्षणानुसार संतुलित खत व्यवस्थापन",
//             commonDiseases: [
//                 "बोंडअळी",
//                 "पानावरील रोग"
//             ]
//         },

//         {
//             name: "सोयाबीन",
//             category: "खरीप पीक",
//             season: "खरीप",
//             soil: "मध्यम ते भारी, चांगला निचरा असलेली जमीन",
//             irrigation: "सामान्यतः पावसावर आधारित; गरजेनुसार सिंचन",
//             sowing: "मान्सून सुरू झाल्यानंतर",
//             harvesting: "शेंगा पूर्ण पक्व झाल्यावर",
//             fertilizer: "माती परीक्षणानुसार खत व्यवस्थापन",
//             commonDiseases: [
//                 "शेंगा पोखरणारी कीड",
//                 "पानावरील रोग"
//             ]
//         },

//         {
//             name: "भात",
//             category: "खरीप पीक",
//             season: "खरीप",
//             soil: "पाणी धरून ठेवणारी चिकणमाती किंवा गाळाची जमीन",
//             irrigation: "पिकाच्या गरजेनुसार नियमित पाणी व्यवस्थापन",
//             sowing: "प्रदेश व पद्धतीनुसार",
//             harvesting: "धान्य पूर्ण पक्व झाल्यावर",
//             fertilizer: "माती परीक्षणानुसार संतुलित खत व्यवस्थापन",
//             commonDiseases: [
//                 "भातावरील करपा रोग"
//             ]
//         }
//     ];

//     await Crop.insertMany(crops);

//     res.send("4 crops inserted successfully!");
// });

app.get("/crops/:id", async (req, res) => {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
        return res.status(404).send("Crop not found");
    }
    res.render("pages/crop-details", { crop });
});

app.get("/diseases", async (req, res) => {
    const diseases = await Disease.find({});
    res.render("pages/diseases", { diseases });
});

// app.get("/seed-diseases", async (req, res) => {

//     await Disease.deleteMany({});

//     const diseases = [

//         {
//             name: "गव्हावरील तांबेरा रोग",

//             type: "रोग",

//             crop: "गहू",

//             description:
//                 "गव्हाच्या पिकावर परिणाम करणारा बुरशीजन्य रोग, ज्यामुळे पिकाची वाढ आणि उत्पादन प्रभावित होऊ शकते.",

//             symptoms: [
//                 "पानांवर तांबूस किंवा गंजासारखे डाग दिसणे",
//                 "पानांची हिरवळ कमी होणे",
//                 "पिकाच्या वाढीवर परिणाम होणे"
//             ],

//             favorableConditions: [
//                 "अनुकूल तापमान",
//                 "जास्त आर्द्रता",
//                 "पिकामध्ये जास्त ओलावा"
//             ],

//             management: [
//                 "पिकाची नियमित पाहणी करणे",
//                 "रोगाची सुरुवातीची लक्षणे दिसल्यास कृषी तज्ज्ञांचा सल्ला घेणे",
//                 "स्थानिक कृषी विभागाच्या शिफारशींनुसार व्यवस्थापन करणे"
//             ],

//             prevention: [
//                 "प्रतिरोधक किंवा शिफारस केलेल्या वाणांचा वापर",
//                 "योग्य पीक व्यवस्थापन",
//                 "नियमित पिकाची पाहणी"
//             ]
//         },


//         {
//             name: "कापसावरील बोंडअळी",

//             type: "कीड",

//             crop: "कापूस",

//             description:
//                 "कापूस पिकाच्या बोंडांवर आणि इतर प्रजननक्षम भागांवर नुकसान करू शकणारी सामान्य कीड.",

//             symptoms: [
//                 "बोंडांवर नुकसान झाल्याचे चिन्ह दिसणे",
//                 "फुलांमध्ये किंवा बोंडांमध्ये अळी आढळणे",
//                 "बोंडांच्या विकासावर परिणाम होणे"
//             ],

//             favorableConditions: [
//                 "अनुकूल हवामान",
//                 "पिकामध्ये किडीची वाढ होण्यासाठी अनुकूल परिस्थिती",
//                 "शेताची नियमित पाहणी न होणे"
//             ],

//             management: [
//                 "पिकाची नियमित पाहणी करणे",
//                 "किडीची लक्षणे आढळल्यास कृषी तज्ज्ञांचा सल्ला घेणे",
//                 "स्थानिक कृषी विभागाच्या शिफारशींनुसार व्यवस्थापन करणे"
//             ],

//             prevention: [
//                 "नियमित निरीक्षण",
//                 "योग्य पीक व्यवस्थापन",
//                 "शिफारस केलेल्या पद्धतींचा वापर"
//             ]
//         },


//         {
//             name: "भुरी रोग",
//             type: "रोग",
//             crop: "विविध पिके",
//             description:
//                 "पिकाच्या पानांवर किंवा इतर भागांवर पांढऱ्या भुकटीसारखी वाढ दिसू शकणारा बुरशीजन्य रोग.",
//             symptoms: [
//                 "पानांवर पांढऱ्या भुकटीसारखी वाढ दिसणे",
//                 "पानांची वाढ प्रभावित होणे",
//                 "पिकाच्या आरोग्यावर परिणाम होणे"
//             ],
//             favorableConditions: [
//                 "अनुकूल तापमान",
//                 "आर्द्रता",
//                 "पिकामध्ये अनुकूल सूक्ष्म वातावरण"
//             ],
//             management: [
//                 "पिकाची नियमित पाहणी करणे",
//                 "लक्षणे आढळल्यास कृषी तज्ज्ञांचा सल्ला घेणे",
//                 "स्थानिक शिफारशींनुसार व्यवस्थापन करणे"
//             ],
//             prevention: [
//                 "योग्य अंतर ठेवून लागवड",
//                 "नियमित पिकाची पाहणी",
//                 "योग्य पीक व्यवस्थापन"
//             ]
//         },


//         {
//             name: "सोयाबीनवरील शेंगा पोखरणारी कीड",
//             type: "कीड",
//             crop: "सोयाबीन",
//             description:
//                 "सोयाबीनच्या शेंगांवर परिणाम करून बियांच्या विकासावर परिणाम करू शकणारी कीड.",
//             symptoms: [
//                 "शेंगांमध्ये नुकसान झाल्याचे चिन्ह दिसणे",
//                 "शेंगांमध्ये अळी आढळणे",
//                 "बियांच्या विकासावर परिणाम होणे"
//             ],
//             favorableConditions: [
//                 "अनुकूल हवामान",
//                 "किडीसाठी अनुकूल परिस्थिती",
//                 "पिकाची नियमित पाहणी न होणे"
//             ],
//             management: [
//                 "पिकाची नियमित पाहणी करणे",
//                 "किडीची लक्षणे दिसल्यास कृषी तज्ज्ञांचा सल्ला घेणे",
//                 "स्थानिक कृषी विभागाच्या शिफारशींनुसार व्यवस्थापन करणे"
//             ],
//             prevention: [
//                 "नियमित निरीक्षण",
//                 "योग्य पीक व्यवस्थापन",
//                 "शिफारस केलेल्या पद्धतींचा वापर"
//             ]
//         }

//     ];

//     await Disease.insertMany(diseases);

//     res.send("4 diseases/pests inserted successfully!");
// });

app.get("/diseases/:id", async (req, res) => {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
        return res.status(404).send("Disease or pest not found");
    }
    res.render("pages/disease-details", { disease });
});

app.get("/advisors", async (req, res) => {
    const advisors = await Advisor.find({});
    res.render("pages/advisors", { advisors });
});

app.get("/seed-advisors", async (req, res) => {
    await Advisor.deleteMany({});
    const advisors = [
       {
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
            about: "डॉ. राजेश पाटील हे कृषी क्षेत्रातील व्यावसायिक असून त्यांना पीक व्यवस्थापन आणि मृदा विज्ञानाचा अनुभव आहे. ते पिकाची परिस्थिती आणि शेतीच्या पद्धतीनुसार कृषी मार्गदर्शन देतात.",
            experienceDescription: "शेतकऱ्यांना कृषी मार्गदर्शन आणि पीक व्यवस्थापनाबाबत सहाय्य प्रदान करणे."
        },

        {
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
            isAvailable: true
        },

        {
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
            isAvailable: true
        }
    ];
    await Advisor.insertMany(advisors);
    res.send("3 advisors inserted successfully!");
});

app.get("/advisors/:id", async (req, res) => {
    const advisor = await Advisor.findById(req.params.id);
    if (!advisor) {
        return res.status(404).send("Advisor not found");
    }
    res.render("pages/advisor-profile", { advisor });
});

app.get("/signup", (req, res) => {
    res.render("users/signup");
});

app.post("/signup", async (req, res) => {
    try {
        const {name,email,password,confirmPassword,role} = req.body;

        // Password match
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }

        // Check existing email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already registered");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Public signup मध्ये admin allow करू नये
        const userRole = role === "advisor"
            ? "advisor"
            : "farmer";

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: userRole
        });

        await user.save();
        res.send("Account created successfully!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

app.get("/about", (req, res) => {
    res.render("pages/about");
});

app.get("/contact", (req, res) => {
    res.render("pages/contact");
});

app.listen(7426, () => {
    console.log("server is listening port 7426");
});
