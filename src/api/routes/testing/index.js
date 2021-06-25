const express = require('express');
// const controller = require('../../controllers/test.controller');
const { authorize } = require('../../middlewares/auth');

const router = express.Router();

// exports.checkIfNeedsAuthAndContinue = async (req, res, next) => {
//   if (req.params.type === 'user') {
//     authorize(LOGGED_USER)(req, res, next);
//   } else {
//     next();
//   }
// };

// router.route('/guestOrderTest')
//   .get(controller.testKey, controller.testGuestOrder);

// router.route('/testTotals')
//   .post(authorize(), controller.testKey, controller.testTotals);


module.exports = router;
