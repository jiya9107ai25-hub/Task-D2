const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const FormData = require("form-data");
const Mailgun = require("mailgun.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    FieldValue
} = require("firebase-admin/firestore");

const db = require("./firebaseAdmin");

// ----------------------------------------------------
// ENVIRONMENT
// ----------------------------------------------------

dotenv.config({
    path: path.join(__dirname, ".env")
});

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------
// GENERAL MIDDLEWARE
// ----------------------------------------------------

app.use(cors());

app.use(
    express.json({
        limit: "10kb"
    })
);

// ----------------------------------------------------
// REQUIRED ENVIRONMENT VARIABLES
// ----------------------------------------------------

if (!process.env.JWT_SECRET) {
    console.error(
        "Missing JWT_SECRET in backend/.env"
    );

    process.exit(1);
}

if (
    !process.env.MAILGUN_API_KEY ||
    !process.env.MAILGUN_DOMAIN
) {
    console.error(
        "Missing MAILGUN_API_KEY or MAILGUN_DOMAIN in backend/.env"
    );

    process.exit(1);
}

// ----------------------------------------------------
// MAILGUN
// ----------------------------------------------------

const mailgun =
    new Mailgun(FormData);

const mg =
    mailgun.client({
        username: "api",
        key:
            process.env.MAILGUN_API_KEY
    });

// ====================================================
// HEALTH CHECK
// ====================================================

app.get(
    "/",
    function (req, res) {
        return res.status(200).json({
            message:
                "DEV@Deakin D2 backend is running."
        });
    }
);

// ====================================================
// AUTHENTICATION MIDDLEWARE
// ====================================================

// Used for routes where the user MUST be logged in.
function authenticateToken(
    req,
    res,
    next
) {
    const authorizationHeader =
        req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({
            message:
                "You must be logged in."
        });
    }

    const parts =
        authorizationHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer" ||
        !parts[1]
    ) {
        return res.status(401).json({
            message:
                "Invalid authentication token."
        });
    }

    try {
        const decoded =
            jwt.verify(
                parts[1],
                process.env.JWT_SECRET
            );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message:
                "Your session is invalid or has expired."
        });
    }
}


// Used by Browse Posts.
//
// Visitors are allowed to use the route without
// being logged in.
//
// If a valid JWT exists, the backend can determine
// the real Firestore plan of the logged-in user.
function optionalAuthentication(
    req,
    res,
    next
) {
    const authorizationHeader =
        req.headers.authorization;

    if (!authorizationHeader) {
        req.user = null;
        return next();
    }

    const parts =
        authorizationHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer" ||
        !parts[1]
    ) {
        return res.status(401).json({
            message:
                "Invalid authentication token."
        });
    }

    try {
        const decoded =
            jwt.verify(
                parts[1],
                process.env.JWT_SECRET
            );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message:
                "Your session is invalid or has expired."
        });
    }
}


// ====================================================
// NEWSLETTER SUBSCRIPTION
// ====================================================

app.post(
    "/subscribe",
    async function (req, res) {
        const email =
            req.body?.email;

        if (
            typeof email !== "string" ||
            !email.trim()
        ) {
            return res.status(400).json({
                message:
                    "Please enter an email address."
            });
        }

        const cleanEmail =
            email.trim();

        const emailPattern =
            /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;

        if (
            cleanEmail.length > 254 ||
            !emailPattern.test(
                cleanEmail
            )
        ) {
            return res.status(400).json({
                message:
                    "Please enter a valid email address."
            });
        }

        try {
            await mg.messages.create(
                process.env.MAILGUN_DOMAIN,
                {
                    from:
                        `DEV@Deakin <postmaster@${process.env.MAILGUN_DOMAIN}>`,

                    to: [
                        cleanEmail
                    ],

                    subject:
                        "Welcome to DEV@Deakin",

                    text:
                        "Welcome to DEV@Deakin! Thank you for subscribing to our Daily Insider.",

                    html: `
                        <h2>Welcome to DEV@Deakin!</h2>
                        <p>Thank you for subscribing to our Daily Insider.</p>
                        <p>Stay connected for developer news and updates.</p>
                    `
                }
            );

            return res.status(200).json({
                message:
                    "Subscription successful! Your welcome email is on its way."
            });

        } catch (error) {
            console.error(
                "Mailgun request failed:",
                error
            );

            return res.status(502).json({
                message:
                    "We could not send your welcome email. Please try again later."
            });
        }
    }
);


// ====================================================
// USER REGISTRATION
// ====================================================

app.post(
    "/register",
    async function (req, res) {
        const name =
            req.body?.name;

        const email =
            req.body?.email;

        const password =
            req.body?.password;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message:
                    "Invalid registration data."
            });
        }

        const cleanName =
            name.trim();

        const cleanEmail =
            email
                .trim()
                .toLowerCase();

        if (
            !cleanName ||
            !cleanEmail ||
            !password
        ) {
            return res.status(400).json({
                message:
                    "Please complete all required fields."
            });
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailPattern.test(
                cleanEmail
            )
        ) {
            return res.status(400).json({
                message:
                    "Please enter a valid email address."
            });
        }

        if (
            password.length < 6
        ) {
            return res.status(400).json({
                message:
                    "Password must contain at least 6 characters."
            });
        }

        try {
            const existingUsers =
                await db
                    .collection("users")
                    .where(
                        "email",
                        "==",
                        cleanEmail
                    )
                    .limit(1)
                    .get();

            if (
                !existingUsers.empty
            ) {
                return res.status(409).json({
                    message:
                        "An account with this email already exists."
                });
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            const userReference =
                await db
                    .collection("users")
                    .add({
                        name:
                            cleanName,

                        email:
                            cleanEmail,

                        password:
                            hashedPassword,

                        plan:
                            "free"
                    });

            return res.status(201).json({
                message:
                    "Account created successfully.",

                user: {
                    id:
                        userReference.id,

                    name:
                        cleanName,

                    email:
                        cleanEmail,

                    plan:
                        "free"
                }
            });

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to create your account. Please try again."
            });
        }
    }
);


// ====================================================
// LOGIN
// ====================================================

app.post(
    "/login",
    async function (req, res) {
        const email =
            req.body?.email;

        const password =
            req.body?.password;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message:
                    "Invalid login data."
            });
        }

        const cleanEmail =
            email
                .trim()
                .toLowerCase();

        if (
            !cleanEmail ||
            !password
        ) {
            return res.status(400).json({
                message:
                    "Please enter your email and password."
            });
        }

        try {
            const result =
                await db
                    .collection("users")
                    .where(
                        "email",
                        "==",
                        cleanEmail
                    )
                    .limit(1)
                    .get();

            if (result.empty) {
                return res.status(401).json({
                    message:
                        "Incorrect email or password."
                });
            }

            const userDocument =
                result.docs[0];

            const userData =
                userDocument.data();

            const passwordIsCorrect =
                await bcrypt.compare(
                    password,
                    userData.password
                );

            if (
                !passwordIsCorrect
            ) {
                return res.status(401).json({
                    message:
                        "Incorrect email or password."
                });
            }

            const token =
                jwt.sign(
                    {
                        userId:
                            userDocument.id,

                        email:
                            userData.email
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "2h"
                    }
                );

            return res.status(200).json({
                message:
                    "Login successful.",

                token,

                user: {
                    id:
                        userDocument.id,

                    name:
                        userData.name,

                    email:
                        userData.email,

                    plan:
                        userData.plan ||
                        "free"
                }
            });

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to log in. Please try again."
            });
        }
    }
);


// ====================================================
// UPGRADE FREE USER TO PAID
// ====================================================

app.patch(
    "/upgrade-plan",
    authenticateToken,
    async function (req, res) {
        const nameOnCard =
            req.body?.nameOnCard;

        const cardNumber =
            req.body?.cardNumber;

        const expiry =
            req.body?.expiry;

        const cvv =
            req.body?.cvv;

        if (
            typeof nameOnCard !== "string" ||
            typeof cardNumber !== "string" ||
            typeof expiry !== "string" ||
            typeof cvv !== "string"
        ) {
            return res.status(400).json({
                message:
                    "Please enter valid payment details."
            });
        }

        const cleanName =
            nameOnCard.trim();

        const cleanCard =
            cardNumber.replace(
                /\s/g,
                ""
            );

        const cleanExpiry =
            expiry.trim();

        const cleanCvv =
            cvv.trim();

        if (!cleanName) {
            return res.status(400).json({
                message:
                    "Please enter the name on the card."
            });
        }

        if (
            !/^\d{16}$/.test(
                cleanCard
            )
        ) {
            return res.status(400).json({
                message:
                    "Card number must contain 16 digits."
            });
        }

        if (
            !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
                cleanExpiry
            )
        ) {
            return res.status(400).json({
                message:
                    "Expiry must be in MM/YY format."
            });
        }

        if (
            !/^\d{3,4}$/.test(
                cleanCvv
            )
        ) {
            return res.status(400).json({
                message:
                    "Please enter a valid CVV."
            });
        }

        try {
            const userReference =
                db
                    .collection("users")
                    .doc(
                        req.user.userId
                    );

            const userDocument =
                await userReference.get();

            if (
                !userDocument.exists
            ) {
                return res.status(404).json({
                    message:
                        "User account could not be found."
                });
            }

            const userData =
                userDocument.data();

            if (
                userData.plan ===
                "paid"
            ) {
                return res.status(409).json({
                    message:
                        "You are already on the Paid plan."
                });
            }

            await userReference.update({
                plan:
                    "paid"
            });

            return res.status(200).json({
                message:
                    "Your account has been upgraded successfully.",

                user: {
                    id:
                        userDocument.id,

                    name:
                        userData.name,

                    email:
                        userData.email,

                    plan:
                        "paid"
                }
            });

        } catch (error) {
            console.error(
                "Plan upgrade error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to upgrade your plan. Please try again."
            });
        }
    }
);


// ====================================================
// D2 - CREATE POST
// ====================================================
//
// IMPORTANT:
// Posts are saved through the backend.
// The frontend does not write directly to Firestore.
//

app.post(
    "/posts",
    authenticateToken,
    async function (req, res) {
        const postType =
            req.body?.postType;

        const title =
            req.body?.title;

        const description =
            req.body?.description;

        const abstract =
            req.body?.abstract;

        const articleText =
            req.body?.articleText;

        const tags =
            req.body?.tags;

        const plan =
            req.body?.plan;

        // --------------------------------------------
        // POST TYPE VALIDATION
        // --------------------------------------------

        if (
            typeof postType !==
            "string"
        ) {
            return res.status(400).json({
                message:
                    "Please select Question or Article."
            });
        }

        const cleanPostType =
            postType
                .trim()
                .toLowerCase();

        if (
            ![
                "question",
                "article"
            ].includes(
                cleanPostType
            )
        ) {
            return res.status(400).json({
                message:
                    "Please select Question or Article."
            });
        }

        // --------------------------------------------
        // TITLE VALIDATION
        // --------------------------------------------

        if (
            typeof title !==
            "string"
        ) {
            return res.status(400).json({
                message:
                    "Please enter a post title."
            });
        }

        const cleanTitle =
            title.trim();

        if (
            cleanTitle.length < 3 ||
            cleanTitle.length > 150
        ) {
            return res.status(400).json({
                message:
                    "Title must contain between 3 and 150 characters."
            });
        }

        // --------------------------------------------
        // ACCESS PLAN VALIDATION
        // --------------------------------------------

        if (
            typeof plan !==
            "string"
        ) {
            return res.status(400).json({
                message:
                    "Please select Free or Paid access."
            });
        }

        const cleanPlan =
            plan
                .trim()
                .toLowerCase();

        if (
            ![
                "free",
                "paid"
            ].includes(
                cleanPlan
            )
        ) {
            return res.status(400).json({
                message:
                    "Please select Free or Paid access."
            });
        }

        // --------------------------------------------
        // TAG VALIDATION
        // --------------------------------------------

        if (
            !Array.isArray(tags)
        ) {
            return res.status(400).json({
                message:
                    "Tags must be provided as a list."
            });
        }

        const cleanTags =
            tags
                .filter(
                    (tag) =>
                        typeof tag ===
                        "string"
                )
                .map(
                    (tag) =>
                        tag.trim()
                )
                .filter(Boolean)
                .slice(0, 3);

        // --------------------------------------------
        // QUESTION VALIDATION
        // --------------------------------------------

        if (
            cleanPostType ===
            "question"
        ) {
            if (
                typeof description !==
                    "string" ||
                !description.trim()
            ) {
                return res.status(400).json({
                    message:
                        "Please describe your question."
                });
            }

            if (
                description
                    .trim()
                    .length < 10
            ) {
                return res.status(400).json({
                    message:
                        "Question description must contain at least 10 characters."
                });
            }
        }

        // --------------------------------------------
        // ARTICLE VALIDATION
        // --------------------------------------------

        if (
            cleanPostType ===
            "article"
        ) {
            if (
                typeof abstract !==
                    "string" ||
                !abstract.trim()
            ) {
                return res.status(400).json({
                    message:
                        "Please enter an article abstract."
                });
            }

            if (
                typeof articleText !==
                    "string" ||
                !articleText.trim()
            ) {
                return res.status(400).json({
                    message:
                        "Please enter the article content."
                });
            }
        }

        try {
            // ----------------------------------------
            // GET AUTHENTICATED USER
            // ----------------------------------------

            const userReference =
                db
                    .collection("users")
                    .doc(
                        req.user.userId
                    );

            const userDocument =
                await userReference.get();

            if (
                !userDocument.exists
            ) {
                return res.status(404).json({
                    message:
                        "User account could not be found."
                });
            }

            const userData =
                userDocument.data();

            // ----------------------------------------
            // POST DATA
            // ----------------------------------------

            const postData = {
                postType:
                    cleanPostType,

                title:
                    cleanTitle,

                tags:
                    cleanTags,

                plan:
                    cleanPlan,

                userId:
                    userDocument.id,

                authorName:
                    userData.name ||
                    "DEV@Deakin User",

                authorEmail:
                    userData.email,

                createdAt:
                    FieldValue.serverTimestamp()
            };

            if (
                cleanPostType ===
                "question"
            ) {
                postData.description =
                    description.trim();
            }

            if (
                cleanPostType ===
                "article"
            ) {
                postData.abstract =
                    abstract.trim();

                postData.articleText =
                    articleText.trim();
            }

            // ----------------------------------------
            // SAVE THROUGH BACKEND TO FIRESTORE
            // ----------------------------------------

            const newPost =
                await db
                    .collection("posts")
                    .add(
                        postData
                    );

            return res.status(201).json({
                message:
                    "Post created successfully.",

                post: {
                    id:
                        newPost.id,

                    postType:
                        cleanPostType,

                    title:
                        cleanTitle,

                    plan:
                        cleanPlan,

                    tags:
                        cleanTags,

                    userId:
                        userDocument.id,

                    authorName:
                        userData.name ||
                        "DEV@Deakin User",

                    authorEmail:
                        userData.email
                }
            });

        } catch (error) {
            console.error(
                "Create post error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to create the post. Please try again."
            });
        }
    }
);


// ====================================================
// D2 - BROWSE POSTS
// ====================================================
//
// The backend determines which posts the visitor
// is allowed to receive.
//
// Visitor:
// Free posts only.
//
// Logged-in Free user:
// Free posts only.
//
// Logged-in Paid user:
// Free + Paid posts.
//
// Paid posts are never sent to Free users.
//

app.get(
    "/posts",
    optionalAuthentication,
    async function (req, res) {
        try {
            let viewerPlan =
                "visitor";

            // ----------------------------------------
            // DETERMINE REAL USER PLAN
            // ----------------------------------------

            if (req.user) {
                const userDocument =
                    await db
                        .collection("users")
                        .doc(
                            req.user.userId
                        )
                        .get();

                if (
                    !userDocument.exists
                ) {
                    return res.status(404).json({
                        message:
                            "User account could not be found."
                    });
                }

                const userData =
                    userDocument.data();

                viewerPlan =
                    userData.plan ===
                    "paid"
                        ? "paid"
                        : "free";
            }

            // ----------------------------------------
            // LOAD POSTS ON BACKEND
            // ----------------------------------------

            const snapshot =
                await db
                    .collection("posts")
                    .get();

            let posts =
                snapshot.docs.map(
                    (document) => {
                        const data =
                            document.data();

                        // Older posts without a plan
                        // are treated as Free.
                        const postPlan =
                            data.plan ===
                            "paid"
                                ? "paid"
                                : "free";

                        // Older posts may contain
                        // differently-cased postType.
                        const postType =
                            typeof data.postType ===
                            "string"
                                ? data.postType
                                    .toLowerCase()
                                : "question";

                        let createdAt =
                            null;

                        if (
                            data.createdAt &&
                            typeof data
                                .createdAt
                                .toDate ===
                                "function"
                        ) {
                            createdAt =
                                data.createdAt
                                    .toDate()
                                    .toISOString();

                        } else if (
                            data.createdAt
                        ) {
                            createdAt =
                                data.createdAt;
                        }

                        return {
                            id:
                                document.id,

                            ...data,

                            postType,

                            plan:
                                postPlan,

                            createdAt
                        };
                    }
                );

            // ----------------------------------------
            // SUBSCRIPTION AUTHORIZATION
            // ----------------------------------------
            //
            // This is intentionally done on the
            // backend, not React.
            //

            if (
                viewerPlan !==
                "paid"
            ) {
                posts =
                    posts.filter(
                        (post) =>
                            post.plan ===
                            "free"
                    );
            }

            // ----------------------------------------
            // NEWEST FIRST
            // ----------------------------------------

            posts.sort(
                (
                    firstPost,
                    secondPost
                ) => {
                    const firstDate =
                        firstPost.createdAt
                            ? new Date(
                                firstPost.createdAt
                            ).getTime()
                            : 0;

                    const secondDate =
                        secondPost.createdAt
                            ? new Date(
                                secondPost.createdAt
                            ).getTime()
                            : 0;

                    return (
                        secondDate -
                        firstDate
                    );
                }
            );

            return res.status(200).json({
                viewerPlan,
                count:
                    posts.length,
                posts
            });

        } catch (error) {
            console.error(
                "Browse posts error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to load posts. Please try again."
            });
        }
    }
);


// ====================================================
// ERROR HANDLER
// ====================================================

app.use(
    function (
        error,
        req,
        res,
        next
    ) {
        if (
            error.type ===
            "entity.parse.failed"
        ) {
            return res.status(400).json({
                message:
                    "The request contains invalid JSON."
            });
        }

        if (
            error.type ===
            "entity.too.large"
        ) {
            return res.status(413).json({
                message:
                    "The request is too large."
            });
        }

        console.error(
            "Unexpected server error:",
            error
        );

        return res.status(500).json({
            message:
                "Something went wrong. Please try again later."
        });
    }
);


// ====================================================
// START SERVER
// ====================================================

app.listen(
    PORT,
    function () {
        console.log(
            `Backend running on http://localhost:${PORT}`
        );
    }
);