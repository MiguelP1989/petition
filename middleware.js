exports.requireLoggedInUser = function(req, res, next) {
    if (!req.session.user && req.url != "/register" && req.url != "/login") {
        res.redirect("/register");
    } else {
        next();
    }
};

exports.requireLoggedOutUser = function(req, res, next) {
    if (req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
};

exports.requireNoSignature = function(req, res, next) {
    if (req.session.signid) {
        res.redirect("/signed");
    } else {
        next();
    }
};

exports.requireSignature = function(req, res, next) {
    if (!req.session.user.signid) {
        res.redirect("/petition");
    } else {
        next();
    }
};
