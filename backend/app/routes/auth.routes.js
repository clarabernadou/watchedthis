const { verifySignUp } = require("../middleware");
const upload = require('../middleware/multer');
const controller = require("../controllers/auth.controller");
const auth = require("../middleware/index.js")


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.post("/api/auth/signup",
        [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
        controller.signup
    );

    app.post("/api/auth/signin", controller.signin);
    app.post("/api/auth/logout", auth.authJwt.verifyToken, controller.logout);
    app.put("/api/auth/update/:userId", auth.authJwt.verifyToken, upload.single('profilePicture'), controller.updateProfile);
    app.get('/api/auth/:userId', auth.authJwt.verifyToken, controller.getUserById);
    app.get('/api/auth/verify/:token', controller.verifyAccount);
};