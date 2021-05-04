// Imports
var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var models    = require('../models');
var asyncLib  = require('async');


// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,12}$/;

// Routes
module.exports = {
    register: function(req, res) {

        // Params
        const login = req.body.matricule;
        const email     = req.body.email;
        const password  = req.body.password;

        if (login==='' || email===''  || password ==='') {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        /*if (login.length >= 13 || username.length <= 4) {
            return res.status(407).json({ 'error': 'wrong username (must be length 5 - 12)' });
         }*/

        if (!EMAIL_REGEX.test(email)) {
            return res.status(405).json({ 'error': 'email is not valid' });
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(406).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
        }

        asyncLib.waterfall([
            function(done) {
                models.compte_user.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                    .then(function(userFound) {
                        done(null, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'unable to verify matricule' });
                    });
            },
            function(userFound, done){
                if (!userFound) {
                    bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'addresse email déjà utilisées'  });
                }
            },
            function(bcryptedPassword, done) {
                    models.compte_user.create({
                        login: login,
                        email: email,
                        password: bcryptedPassword,
                })
                    .then(function(newProfil) {
                        done(null, newProfil);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'cannot add user' });
                    });
            },
            function(done) {
                models.produit.create({
                    idCompt: newUser.id
            })
                .then(function(newUser) {
                    done(newUser);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'cannot add user' });
                });
        }
        ], function(newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id,
                    'email':email
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add user' });
            }
        });
    },
    login: function(req, res) {

        // Params
        var email    = req.body.email;
        var password = req.body.password;

        if (email ===''  ||  password ==='') {
            return res.status(400).json({ 'error': 'missing parameters' })
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(405).json({ 'error': 'email is not valid' });
        }
        asyncLib.waterfall([
            function(done) {
                models.compte_user.findOne({
                    attributes: ['email','password'],
                    where: { email: email}
                })
                    .then(function(userFound) {
                        done(null, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'serveur error' });
                    });
            },
            function(userFound, done) {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({ 'error': 'user not exist in DB' });
                }
            },
            function(userFound, resBycrypt, done) {
                if(resBycrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({ 'error': 'invalid password' });
                }
            }
        ], function(userFound) {
            if (userFound) {
                return res.status(201).json({
                    'userId': userFound.id,
                    'email':userFound.email,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
            } else {
                return res.status(500).json({ 'error': 'cannot log on user' });
            }
        });
    },
    getUserProfile: function(req, res) {
        // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({ 'error': 'wrong token' });

        models.compte_user.findOne({
            attributes: [ 'email', 'login'],
            where: { id: userId }
        }).then(function(user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot fetch user' });
        });
    },
    updateUserProfile: function(req, res) {
        // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUserId(headerAuth);

        // Params
        var type       = req.body.type,
        var adress     = req.body.adress,
        var phone      = req.body.phone,
        var num_ref    = req.body.num_ref,
        var num_id     = req.body.num_id,
        var specificite= req.body.specificite

        asyncLib.waterfall([
            function(done) {
                models.profil.findOne({
                    attributes: ['id', 'bio'],
                    where: { id: userId },
                    include: [
                        {model:compte_user, attributes:['id']
                    }
                  ]
                }).then(function (userFound) {
                    done(null, userFound);
                })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function(userFound, done) {
                if(userFound) {
                    userFound.update({
                        bio: (bio ? bio : userFound.bio)
                    }).then(function() {
                        done(userFound);
                    }).catch(function(err) {
                        res.status(500).json({ 'error': 'cannot update user' });
                    });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function(userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update user profile' });
            }
        });
    }
}
