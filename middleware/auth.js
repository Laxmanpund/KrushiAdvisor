const isLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    next();
};


const isFarmer = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    if (res.locals.currentUser.role !== "farmer") {
        return res.status(403).send("Access denied");
    }

    next();
};


const isAdvisor = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    if (res.locals.currentUser.role !== "advisor") {
        return res.status(403).send("Access denied");
    }

    next();
};


const isAdmin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    if (res.locals.currentUser.role !== "admin") {
        return res.status(403).send("Access denied");
    }

    next();
};


module.exports = {isLoggedIn,isFarmer,isAdvisor,isAdmin};