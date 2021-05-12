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
        const login     = req.body.login;
        const email     = req.body.email;
        const password  = req.body.password;
        const role      =req.body.role;

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
                        return res.status(500).json({ 'error': 'unable to verify email' });
                    });
            },
            function(userFound, done){
                if (!userFound) {
                    bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
                        done(null,bcryptedPassword);
                    });
                    } 
                else {
                    return res.status(409).json({ 'error': 'addresse email déjà utilisées'  });
                    }
            },
            function(bcryptedPassword, done) {
                    models.compte_user.create({
                        login: login,
                        email: email,
                        password: bcryptedPassword,
                        role: role
                    })
                    .then(function(createProfil) {
                        done(null, createProfil);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'cannot add user' });
                    });
            },
            function(createProfil, done) {
                models.profil.create({
                idCompt: createProfil.id
             })
            .then(function(infoUser) {
                done(infoUser);
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'cannot initialize profil' });
            });
        }
        ], function(infoUser) {
            if (infoUser) {
                return res.status(201).json({
                    'userId': infoUser.idCompt,
                    'email':email
                });
            } else {
                return res.status(500).json({ 'error': 'cannot get user Info' });
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
                    attributes: ['email','password','id'],
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
            return res.status(400).json({ 'error': 'wrong token ' });

        models.profil.findOne({
            attributes: ['id'],
            where: { id: userId },
            include: [{
                model: models.compte_user('idCompt'),
                attributes: [ 'id' ]
              }]
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
        const type       = req.body.type;
        const adress     = req.body.adress;
        const phone      = req.body.phone;
        const num_ref    = req.body.num_ref;
        const num_id     = req.body.num_id;
        const specificite= req.body.specificite;

        asyncLib.waterfall([
            function(done) {
                models.profil.findOne({
                    attributes: ['id','idCompt'],
                    where: { idCompt: userId },
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
                        type: (type ? type : userFound.type),
                        adress: (adress ? adress : userFound.adress),
                        phone: (phone ? phone : userFound.phone) ,
                        num_ref: (num_ref ? num_ref : userFound.num_ref),
                        num_id: (num_id ? num_id : userFound.num_id),
                        specificite: (specificite ? specificite : userFound.specificite),
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
