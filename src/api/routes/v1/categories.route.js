const express = require('express');
// const validate = require('express-validation');
// const passport = require('passport');
const controller = require('../../controllers/categories.controller');
// const oAuthLogin = require('../../middlewares/auth').oAuth;
// const { login, register, oAuth, refresh, sendPasswordReset, passwordReset } = require('../../validations/auth.validation');

const router = express.Router();

router.route('/register')
  .post(controller.register);

// router.route('/getCategoryById')
//   .post(controller.getCategoryById);
router.route('/getAllCategories')
  .get(controller.getAllCategories);

router.route('/getAllCategoriesList')
  .get(controller.getAllCategoriesList);

module.exports = router;
