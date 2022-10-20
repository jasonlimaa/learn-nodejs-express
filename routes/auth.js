const {userRegister, userLogin} = require("../controllers/auth.controller");
const router = require("express").Router();

router.post("/register", userRegister);
router.post("/login", userLogin);

router.post("/reset-password", (req, res, next) => {
    try {
    } catch (error) {
        next(error);
    }
});

module.exports = router;
