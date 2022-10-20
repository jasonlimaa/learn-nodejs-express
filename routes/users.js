const router = require("express").Router();
const {
  createUser,
  listOfUsers,
  getUserById,
  deleteUserById,
  updateUser,
  updateProfileImage,
} = require("../controllers/user.controller");
const { autoLogin } = require("../middlewares/checkLogin");
const { upload } = require("../modules/utils");

router.post("/create", createUser);
router.get("/profile", autoLogin, (req, res, next) => {
  const headers = req.headers;
  res.json(req.user);
});
router.get("/", listOfUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUserById);
router.patch("/:id", updateUser);
router.put("/profile/:id", upload.single("image"), updateProfileImage);

module.exports = router;
