const express      = require('express');
const usersCtrl    = require('./routes/userCtrl');

// Router
exports.router = (function() {
    const Routers = express.Router();

    // Users routes
    Routers.route('/users/register/').post(usersCtrl.register);
    Routers.route('/users/login/').post(usersCtrl.login);
    Routers.route('/users/me/').get(usersCtrl.getUserProfile);
    Routers.route('/users/me/').put(usersCtrl.updateUserProfile);
   
    return apiRouter;
})();
