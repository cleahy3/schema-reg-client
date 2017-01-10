var User = require('../models/user');

function getMain(req, res) {
    res.render('index', {
        title: 'Main'
    });
}

function newSession(req, res) {
    //handles loggin
    res.render("sessions/new", {
        title: "Login"
    })
};

function createSession(req, res) {
    //handles the submission of the login form
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        //checks if user with the inputted email exists and the password matches
        if (user && user.password === req.body.password) {
            //creating a user session and putting the user id in it
            req.session.user = user.id;
            console.log("SUCCESS!", user)
            res.redirect("/");
        } else {
            if (err) {

                res.redirect("/sessions/new");
            } else {
                console.log("There's no user with those credentials!");
            };
            res.redirect("/sessions/new");
        };
    });
};

function deleteSession(req, res) {
    //removes session
    delete req.session.user;

    res.redirect("/sessions/new")
};

module.exports = {
    new: newSession,
    create: createSession,
    delete: deleteSession,
    main: getMain
}
