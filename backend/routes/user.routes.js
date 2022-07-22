const userController = require("./../controllers/user.controller");
const {body} = require("express-validator");
const Router = require("express");
const router = new Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  userController.register
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  userController.login
);

router.post(
  "/refresh",
  userController.refresh
);

router.post(
  "/logout",
  userController.logout
);

// router.get("/test", (req, res, next) => {
//   res.status(200).json({
//     message: "Success",
//   });
// });

module.exports = router;
