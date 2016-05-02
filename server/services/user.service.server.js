/**
 * Created by branden on 4/26/16.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, userModel) {

    passport.use('local-strategy', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post("/api/login", passport.authenticate('local-strategy'), loginUser);
    app.post("/api/logout", logout);
    app.post("/api/register", register);
    app.put("/api/update/:userId", update);
    app.get("/api/loggedin", loggedIn);
    //app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));
    //app.get('/auth/facebook/callback',
    //    passport.authenticate('facebook', {
    //        successRedirect: '#/profile',
    //        failureRedirect: '#/login'
    //    }));
    //
    //var facebookConfig = {
    //    clientID        : process.env.FACEBOOK_CLIENT_ID,
    //    clientSecret    : process.env.FACEBOOK_CLIENT_SECRET,
    //    callbackURL     : process.env.FACEBOOK_CALLBACK_URL
    //};
    //
    //passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    //
    //function facebookStrategy(token, refreshToken, profile, done) {
    //    userModel
    //        .findUserByFacebookId(profile.id)
    //        .then(
    //            function(user) {
    //                if(user) {
    //                    console.log(user);
    //                    return done(null, user);
    //                } else {
    //                    var names = profile.displayName.split(" ");
    //                    var newFacebookUser = {
    //                        username:  names[0],
    //                        facebook: {
    //                            id:    profile.id,
    //                            token: token
    //                        }
    //                    };
    //                    return userModel.createUser(newFacebookUser);
    //                }
    //            },
    //            function(err) {
    //                if (err) { return done(err); }
    //            }
    //        )
    //        .then(
    //            function(user){
    //                return done(null, user);
    //            },
    //            function(err){
    //                if (err) { return done(err); }
    //            }
    //        );
    //}

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    // if the user exists, compare passwords with bcrypt.compareSync
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function loggedIn(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loginUser(req, res) {
        var user = req.user;
        delete user.password;
        res.json(user);
    }

    function register(req, res) {
        var newUser = req.body;
        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    if (user) {
                        res.json(null);
                    } else {
                        // encrypt the password when registering
                        newUser.password = bcrypt.hashSync(newUser.password);
                        return userModel.createUser(newUser);
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                console.log(user);
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            );

    }

    function update(req, res) {
        var newUser = req.body;
        var userId = req.params.userId;
        delete newUser._id;

        if (newUser.password) {
            newUser.password = bcrypt.hashSync(newUser.password);
        }

        userModel.updateUser(userId, newUser)
            .then(
                function (user) {
                    return userModel.findUserById(userId);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function(user){
                    res.json(user);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function serializeUser(user, done) {
        delete user.password;
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    delete user.password;
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }


};