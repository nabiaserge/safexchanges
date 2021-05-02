const express      = require('express');
const usersCtrl    = require('./routes/userCtrl');
const etudiantCtrl = require('./routes/edutiantsCtrl');
const pubCtrl      = require('./routes/homePageCrtl');
const employerCtrl     = require('./routes/employeCtrl');
//const uploadController = require("./routes/controllers/upload");

// Router
exports.router = (function() {
    const apiRouter = express.Router();

    // Users routes
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/me/').get(usersCtrl.getUserProfile);
    apiRouter.route('/users/me/').put(usersCtrl.updateUserProfile);
    apiRouter.route('/users/createEtd/').post(etudiantCtrl.createEtd);
    //apiRouter.route('/upload/').post(uploader.uploading);
    //apiRouter.route("/multiple-upload/").post(uploadController.multipleUpload);

    //employe controler
    apiRouter.route('/employe/registerEmpl/').post(employerCtrl.registerEmp);
    apiRouter.route('/employe/login-admin/').post(employerCtrl.login);
    // Messages routes
    apiRouter.route('/messages/new/').post(pubCtrl.createPub);
    //apiRouter.route('/messages/').get(messagesCtrl.listMessages);
    //apiRouter.route('/messages/').get(pubCtrl.listMessagesToken);
    return apiRouter;
})();
