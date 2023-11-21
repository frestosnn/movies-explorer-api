const router = require("express").Router();
const auth = require("../../middlewares/auth");

const { getUser, updateUser } = require("../../controllers/users");

router.get("/me", auth, getUser);
router.post("/me", auth, updateUser);

module.exports = router;
