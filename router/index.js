const express = require("express");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const Registration = mongoose.model("Registration");
const path = require("path");
const auth = require("http-auth");
const basic = auth.basic({
  file: path.join(__dirname, "../users.htpasswd"),
});
router.get("/", (req, res) => {
  res.render("form", { title: "Registration Form" });
});

router.post(
  "/",
  [
    check("name").isLength({ min: 1 }).withMessage("Please enter a name"),
    check("email").isLength({ min: 1 }).withMessage("Please enter an email"),
  ],
  (req, res) => {
    // console.log(req.body);
    const error = validationResult(req);
    if (error.isEmpty()) {
      const registration = new Registration(req.body);
      registration
        .save()
        .then(() => {
          res.send("Thank you for your registration!");
        })
        .catch(() => {
          res.send("Sorry! Something went wrong.");
        });
    } else {
      res.render("form", {
        title: "Registration form",
        error: error.array(),
        data: req.body,
      });
    }
  }
);

router.get("/registrations", basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render("index", { title: "Listing registrations", registrations });
    })
    .catch(() => {
      res.send("Sorry! Something went wrong.");
    });
}));



module.exports = router;
