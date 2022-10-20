const router = require("express").Router();
const userRoutes = require("./users");
const authRoutes = require("./auth");
const taskRoutes = require("./tasks");
const { autoLogin } = require("../middlewares/checkLogin");
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/tasks", autoLogin, taskRoutes);

module.exports = router;
