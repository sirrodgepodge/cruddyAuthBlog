'use strict';
const passport = require('passport'),
      FacebookStrategy = require('passport-facebook').Strategy,
      mongoose = require('mongoose'),
      User = mongoose.model('User'),
      _ = require('lodash');

module.exports = function (app) {

    const facebookCredentials = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CLIENT_CALLBACK,
        profileFields: ['email', 'photos', 'link'] // this is the Google strategy's equivalent of "scope"
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        User.findOneAsync({
                'email': profile.emails[0].value
            })
            .then((user) => {
                if(user && user.facebook._id) return Promise.resolve(user); // no need to fill in info w/profile if user already has Facebook log-in
                user = user || new User();
                user = _.merge(user, { // use Facebook profile to fill out user info if it does not already exist
                    email: user.email || profile.emails[0].value,
                    // firstName: user.firstName || profile.name.givenName,
                    // lastName: user.lastName || profile.name.familyName,
                    facebook: {
                      _id: profile.id,
                      photo: profile.photos[0].value,
                      link: profile.profileUrl
                    }
                });
                return user.save();
            })
            .then((user) => done(null, user))
            .catch((err) => console.error('Error creating user from Facebook authentication', err) || done(err, null));
    };

    passport.use(new FacebookStrategy(facebookCredentials, verifyCallback));

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        function (req, res) {
            res.redirect('/');
        });

};
