const express = require("express");
const app = express();
const hb = require("express-handlebars");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("./public"));

app.get("/petition", (req, res) => {
    res.render("petition", {
        layout: "main"
    });
});

app.get("/sign", (req, res) => {
    res.render("sign", {
        layout: "main"
    });
});

//     app.post("/petition", (req, res) => {
//         db.addSignarure(dataURL)
//             .then(() => {
//                 console.log("success!!");
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     });
// });
// app.get("/petition", (req, res) => {
//     db.getNames()
//         .then(({ rows }) => {
//             console.log("results: ", rows);
//         })
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
