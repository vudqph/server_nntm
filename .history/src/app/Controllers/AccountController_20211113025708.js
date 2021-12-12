const db = require("../../config/db");
const bcryptjs = require("bcryptjs");
const User = require("../Models/userModal");
const UserModal = require("../Models/userModal");
const { create, login } = require("../Models/userModal");
const { sign } = require("jsonwebtoken");

const { registerValidate, loginValidate } = require("../../middleware/users");
const { getUsersByUsername } = require("./DatasController");
class AccountController {
  async login(req, res, next) {
    const { error } = loginValidate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const body = req.body;
    login(body.userName, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
      const result =  bcryptjs.compareSync(
        body.password,
        results.password
      );
      if (result) {
        results.password = undefined;
        const token = sign({ result: results }, "qwenntm", {
          expiresIn: "1h",
        });
        return res.json({ success: 1, message: "Login Success", token: token });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  }
  async register(req, res, next) {
    const { error } = registerValidate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const body = req.body;
    try {
      const salt = await bcryptjs.genSaltSync(10);
      body.password = await bcryptjs.hashSync(body.password, salt);
      create(body, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
        return res.status(200).json({ success: 1, data: results });
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

module.exports = new AccountController();
