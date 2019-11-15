const express = require("express");
const app = express();
// module.export = app;
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const db = require("./utils/db");
//importing both functions from db.js
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");
const {
    requireLoggedOutUser,
    requireNoSignature,
    requireSignature
    // requireLoggedInUser
} = require("./middleware");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("./public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(
    cookieSession({
        secret: `I'm here.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
app.use(csurf());

app.use(function(req, res, next) {
    res.setHeader("x-frame-options", "DENY");
    res.locals.csrfToken = req.csrfToken;
    next();
});

const checkUrl = function(url) {
    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://") &&
        url != ""
    ) {
        url = "http://" + url;
    }
    return url;
};

app.get("/petition", requireNoSignature, (req, res) => {
    res.render("petition", {
        layout: "main"
    });
});
//
//

app.post("/petition", requireNoSignature, (req, res) => {
    // let first = req.body.first;
    // let last = req.body.last;
    let signature = req.body.signature;
    console.log("boooooooooooooooooooooody: ", req.body);
    let userId = req.session.user.id;
    // console.log("userId: ", userId);
    db.addSignature(signature, userId)
        .then(results => {
            console.log("suuuuuuuuuuuuuccess!!: ", results);
            // req.session.first = results.rows[0].first;
            // req.session.last = results.rows[0].last;
            req.session.user.signid = results.rows[0].id;

            res.redirect("/signed");
        })
        .catch(err => {
            console.log("failed", err);
        });
});

app.get("/signed", (req, res) => {
    Promise.all([db.getImage(req.session.user.signid), db.countSignNames()])
        .then(results => {
            let image = results[0];
            let data = results[1];
            console.log("image ", image);
            console.log("dataaaaaa ", data);
            console.log("req.session.signid...:", req.session.user.signid);

            res.render("signed", {
                layout: "main",
                image: image.rows[0].signature,
                name: image.rows[0].first,
                lastname: image.rows[0].last,
                count: data.rows[0].count
            });
        })
        .catch(err => {
            console.log("err :", err);
        });
});

app.get("/signers", requireSignature, (req, res) => {
    db.getSignNames()
        .then(({ rows }) => {
            console.log("////////////////rows: ", rows);
            let listofsigners = rows;

            res.render("signers", {
                layout: "main",
                listofsigners
            });
        })
        .catch(err => {
            console.log("err: ", err);
        });
});

app.get("/signers/:city", requireSignature, (req, res) => {
    console.log("req.params.city......    ", req.params);
    db.getCity(req.params.city)
        .then(results => {
            console.log(results);

            let listofsigners = results.rows;

            res.render("signers", {
                layout: "main",
                listofsigners
            });
        })
        .catch(err => {
            console.log("err: ", err);
        });
});
////////// Registration //////////////

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.get("/register", requireLoggedOutUser, (req, res) => {
    res.render("register", {
        layout: "main"
    });
});

app.post("/register", requireLoggedOutUser, (req, res) => {
    console.log("req.body: ", req.body);
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    hash(password).then(hashedPassword => {
        console.log("hash: ", hashedPassword);
        db.register(first, last, email, hashedPassword)
            .then(results => {
                console.log("results: ", results);
                let userId = results.rows[0].id;
                req.session.user = {
                    id: userId,
                    first: first,
                    last: last,
                    email: email
                };
                res.redirect("/profile");
            })
            .catch(err => {
                console.log("error in register: ", err);
                res.render("register", {
                    layout: "main",
                    error: "This email is already registered. Please try again!"
                });
            });
    });
});

//////// LOG IN ///////

app.get("/login", requireLoggedOutUser, (req, res) => {
    res.render("login", {
        layout: "main"
    });
});

app.post("/login", requireLoggedOutUser, (req, res) => {
    console.log("req.body of login: ", req.body);
    let email = req.body.email;
    let pass = req.body.password;

    db.getUserInfo(email)
        .then(results => {
            console.log("resuuuuuuuuuuuuuults : ", results);
            let hashPass = results.rows[0].password;
            let userId = results.rows[0].id;
            let signatureId = results.rows[0].signid;
            console.log("signatureIddddddddd  ", signatureId);
            console.log("hashPass: ", hashPass);
            // console.log("userId: ", userId);
            compare(pass, hashPass)
                .then(match => {
                    console.log("maaaatch ", match);

                    if (match) {
                        req.session.user = {
                            id: userId,
                            signid: signatureId
                        };
                        // req.session.user.id = userId;
                        // req.session.user.signatureid = signatureId;

                        console.log("signatureIddddddddd  ", signatureId);

                        if (signatureId != null) {
                            res.redirect("/signed");
                        } else {
                            res.redirect("/petition");
                        }
                    } else {
                        res.render("login", {
                            layout: "main",
                            error: "Wrong password! Please try again!"
                        });
                    }
                })
                .catch(err => {
                    console.log("err ", err);
                    // res.redirect("/register");
                });
        })
        .catch(err => {
            console.log("err: ", err);
            res.redirect("/register");
        });
});

// //////// PROFILE//////

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});

app.post("/profile", (req, res) => {
    console.log(req.body);
    let age = req.body.age;
    let city = req.body.city;
    let url = req.body.url;
    let userId = req.session.user.id;

    console.log("req.session: ", req.session);

    db.addUserInfo(age, city, checkUrl(url), userId)
        .then(results => {
            console.log("results  :", results);
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
        });
});

///////////////////    PROFILE EDIT      /////////////

app.get("/profile/edit", (req, res) => {
    // console.log("req.session: ", req.session);
    let userId = req.session.user.id;
    db.getProfile(userId).then(results => {
        // console.log("results..: ", results);
        let first = results.rows[0].first;
        let last = results.rows[0].last;
        let city = results.rows[0].city;
        let age = results.rows[0].age;
        let url = results.rows[0].url;
        let email = results.rows[0].email;

        res.render("edit", {
            layout: "main",
            first: first,
            last: last,
            city: city,
            age: age,
            url: url,
            email: email
        });
    });
});

app.post("/profile/edit", (req, res) => {
    console.log("update req.body: ", req.body);
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let userId = req.session.user.id;
    let age = req.body.age;
    let city = req.body.city;
    let url = req.body.url;
    let password = req.body.password;

    // console.log("userId :", userId)

    Promise.all([
        db.updateUsers(first, last, email, userId),
        db.updateProfileUsers(age, city, checkUrl(url), userId)
    ])
        .then(results => {
            console.log("resuuults :", results);
            let updateUsers = results[0].rows;
            let updateUserProfile = results[1].rows;

            let infoUpdate = [...updateUsers, ...updateUserProfile];
            console.log("infoUpdate :", infoUpdate);
            res.redirect("/signed");
        })
        .catch(err => {
            console.log(err);
        });
    if (password != "") {
        hash(password)
            .then(hashedPassword => {
                db.updatePassword(
                    first,
                    last,
                    email,
                    hashedPassword,
                    userId
                ).then(results => {
                    console.log("updated password: ", results);
                    res.redirect("/signed");
                });
            })
            .catch(err => {
                console.log("err: ", err);
            });
        db.updateProfileUsers(age, city, checkUrl(url), userId)
            .then(results => {
                console.log("results :", results);
                res.redirect("/signed");
            })
            .catch(err => {
                console.log("err :", err);
            });
    } else {
        Promise.all([
            db.updateUsers(first, last, email, userId),
            db.updateProfileUsers(age, city, checkUrl(url), userId)
        ])
            .then(results => {
                let updateUsers = results[0].rows;
                let updateProfileUsers = results[0].rows;
                let infoUpdate = [...updateUsers, ...updateProfileUsers];
                console.log("infoUpdate :", infoUpdate);
                res.redirect("/signed");
            })
            .catch(err => {
                console.log("err :", err);
                res.render("edit", {
                    layout: "main",
                    ageError: "Please try again!"
                });
                // res.redirect("/profile/edit");
            });
    }
});
/////////// DELETE SIGNATURE ///////

app.get("/signed/delete", (req, res) => {
    res.render("signed", {
        layout: "main"
    });
});

app.post("/signed/delete", (req, res) => {
    console.log("req.body....... ", req.session);

    db.deleteSignature(req.session.user.id)
        .then(results => {
            req.session.user.signid = null;
            res.redirect("/petition");
            console.log("Deletesignature results...:", results);
        })
        .catch(err => {
            console.log("err :", err);
        });
});

app.listen(process.env.PORT || 8080, () => console.log("listening"));

// prevent people that are log in and wanna login and register again
// app.use((req, res, next) => {
//     if (!req.session.userId && req.url != "/register" && req.url != "/login") {
//         return res.redirect("/register");
//     } else {
//         next();
//     }
// });
//
// // app.get("/register", (req, res, next) => {
// function requireLoggedOutUser (req, res, next) {
//     if (req.session.userId) {
//         res.redirect("/petition");
//     } else {
//         next();
//     }
// }
//
// app.get('/register', requireLoggedOutUser, (req, res) => {
//
// })
// function requireNosignature(req, res, next) {
//     if(req.session.userId) {
//         res.redirect("")
//     } else {
//             next()
//         }
//     }
// }
//
//const app = require("./index")
// const {} = require
// require("./auth")
//
// const {requireLoggedOutUser, } = require("./middleware")

// files with router
// const exxpress =require ("express");
// const router = express.Router();

//

//
// // in the index file
//
// const profileRouter = require("./profile")
// app.user(profileRouter);

// git remote add heroku + url
// git remote -v
