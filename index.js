const express = require("express");
const app = express();
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const db = require("./utils/db");

// const csurf = require("csurf");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("./public"));
// app.use(cookieSession());
app.use(express.urlencoded({ extended: false }));

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

// app.use(function(req, res, next) {
//     res.setHeader("x-frame-options", "DENY");
// res.locals.csrfToken = req.csrToken
// });

// app.use(csurf());

// app.get("/", (req, res) => {
//     console.log("********* / *****");
//     console.log("req.session before: ", req.session);
//     req.session.habanero = "<3";
//     console.log("req.session after: ", req.session);
//     console.log("req.session: ", req.session);
//     res.redirect("/petition");
// });signature

app.get("/petition", (req, res) => {
    // console.log("********* / Petition route *****");
    // console.log("req.session in petition: ", req.session.habareno);
    res.render("petition", {
        layout: "main"
    });
});
//
//

app.post("/petition", (req, res) => {
    let first = req.body.first;
    let last = req.body.last;
    let signature = req.body.signature;
    // console.log("body: ", req.body);
    db.addSignature(first, last, signature)
        .then(results => {
            // console.log("success!!: ", results);
            req.session.first = results.rows[0].first;
            req.session.last = results.rows[0].last;
            req.session.id = results.rows[0].id;
            res.redirect("/signed");
        })
        .catch(err => {
            console.log("failed", err);
        });
});

app.get("/signed", (req, res) => {
    Promise.all([db.getImage(req.session.id), db.getSignNames()]).then(
        results => {
            let image = results[0];
            let data = results[1];

            res.render("signed", {
                layout: "main",
                image: image.rows[0].signature,
                name: image.rows[0].first,
                lastname: image.rows[0].last,
                count: data.rows[0].count
            });
        }
    );
    // db.getImage(req.session.id).then(image => {
    //     // console.log("image: ", image);
    //     res.render("signed", {
    //         layout: "main",
    //         image: image.rows[0].signature,
    //         name: image.rows[0].first,
    //         lastname: image.rows[0].last
    //     });
    // });
    // db.getSignNames().then(data => {
    //     console.log("DATA: ", data.rows[0].count);
    //     res.render("signed", {
    //         layout: "main",
    //         count: data.rows[0].count
    //     });
    // });
});

// app.get("/petition", (req, res) => {
//     db.getSignNames()
//         .then(({ rows }) => {
//             console.log("results: ", rows);
//         })
//
//         .catch(err => {
//             console.log(err);
//         });
// });

app.listen(8080, () => console.log("listening"));

// const db = require("./utils/db");
//
// });
//

// app.get("/test", (req, res) => {
//     res.send("<h1>petition...!!!</h1>");
// });
