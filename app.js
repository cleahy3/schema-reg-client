var express = require('express');

var mongoose = require('mongoose');
var app = express();

var ejs = require('ejs');
var session = require('express-session');
var layouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var routes = require('./config/routes');
var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
var User = require('./models/user');
app.use(layouts);
app.use(bodyParser.urlencoded({
    extended: false
}));
mongoose.connect("mongodb://localhost/src");

app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

app.use(cookieParser());

app.use(function(req, res, next) {
    //saving the cookie to a variable
    var views = req.cookies.views;
    //incrementing views
    views ? views++ : views = 1;
    //adding views to the response
    res.cookie('views', views, {
        maxAge: 60 * 60 * 1000
    });
    next();
});
app.use(session({
    // stored in database
    //resave says should sessions be resaved to database if nothing is run
    resave: false,
    //should new sessions be saved even if they're empty
    saveUninitialized: true,
    //encryption
    secret: 'spartasupersecretkey'
}));
app.use(function(req, res, next) {
    //saving the cookie to a variable
    var views = req.session.views;
    //incrementing views
    views ? views++ : views = 1;
    //adding views to the response
    console.log("User has " + views + " page views");
    req.session.views = views;
    next();
});
//load current user
app.use(function(req, res, next) {
    if (!req.session.user) {
        res.locals.user = false;
        next();
    } else {
        User.findById(req.session.user, function(err, user) {
            if (user) {
                req.user = user;
                res.locals.user = user;
            } else {
                req.session.user = null;
            }
            next(err);
        });

    };
});

app.use(express.static(__dirname + '/public'));

app.use(/^\/(?!sessions|users).*/, function(req, res, next) {
    if (!req.user) {
        res.redirect('/sessions/new');
    } else {
        next();
    }
});


app.use(routes);

app.listen(port, function() {
    console.log('app is listening on port' + port);
});


module.exports = app;
