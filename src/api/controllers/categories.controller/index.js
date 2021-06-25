/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
const { Op } = require('sequelize');
const db = require('../../../config/sequelize');

const Categories = db.categories;

exports.register = async (req, res, next) => {

  if (!req.body.CategoryName) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  Categories.findAll({ order: [['categoryPosition', 'DESC']], limit: 1 })
    .then((dataFind) => {
      const categories = {
        categoryName: req.body.CategoryName,
        parentCategoryID: req.body.ParentCategoryID,
        categoryPosition: (dataFind.length > 0 ? (dataFind[0].categoryPosition + 1) : 1),
        description: req.body.description,
        published: req.body.published ? req.body.published : false,
      };

      Categories.create(categories)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while creating the Categories.',
          });
        });

    })
    .catch((err) => {
      console.log(err);
    });
  
};

exports.getAllCategoriesList = async (req, res, next ) => {

  Categories.findAll({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving tutorials.',
      });
    });
}

async function getCategories(category) {
  const result = await Categories.findAll({
    where: { parentCategoryID: { [Op.like]: `%${category.id}%` } },
  });

  // let categoryTree: { id: number; categoryName: string; children: any[] } = {
  const categoryTree = {
    id: category.id,
    categoryName: category.categoryName,
    description: category.description,
    createdAt: new Date(category.createdAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    children: [],
  };
  if (result.length > 0) {
    for (const categoryItem of result) {
      const subCategory = await getCategories(categoryItem);
      categoryTree.children.push(subCategory);
    }
    return categoryTree;
  }
  return categoryTree;
};

exports.getAllCategories = async (req, res, next ) => {
  const rootCategories = await Categories.findAll({
    where: [{ parentCategoryId: null }],
  });
  const Result = [];
  for (const element of rootCategories) {
    const tempResult = await getCategories(element);
    Result.push(tempResult);
  }

  return res.json(Result);
  // return Result;
  // try {

  //   Categories.findAll()
  //     .then((data) => {
  //       res.send(data);
  //     })
  //     .catch((err) => {
  //       res.status(500).send({
  //         message:
  //           err.message || 'Some error occurred while retrieving tutorials.',
  //       });
  //     });
  //   // const allCategories = await CategoriesModel.getAllCategories();
  //   // // console.log(allCategories);
  //   // return res.json({ allCategories });
  // } catch (error) {
  //   return res.json(error);
  // }
}

// exports.appendUserSpecificDataFromMagento = async (req, res, next) => {
//   try {
//     const user = path(['locals', 'response', 'user'], req);
//     if (!user) {
//       throw new APIError({
//         status: httpStatus.BAD_REQUEST,
//         isPublic: false,
//       });
//     }
//     const { response } = req.locals;
    // response.user = new User(user).transform();
//     const cartData = await getCustomerCart(user.mageId, req.body.guestCartId || false);
//     response.cart = { items: cartData.items, cartId: cartData.id };
//     res.set({
//       'X-TOKEN': response.token.accessToken,
//       'X-CARTID': response.cart.cartId,
//     });
//     return res.json(response);
//   } catch (error) {
//     return next(error);
//   }
// };

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
// exports.login = async (req, res, next) => {
//   try {
//     const { intent = 'APP' } = req.body;
//     const {
//       user, accessToken, // resetPassword, email, id, hash,
//     } = await User.findAndGenerateToken(omit(['guestCartId'], req.body));
//     const token = generateTokenResponse(user, accessToken);
//     req.locals = { response: ({ token, user }) };
//     if (intent === 'APP') {
//       return next();
//     }
//     return res.json(req.locals.response);
//   } catch (error) {
//     return next(error);
//   }
// };

// exports.loginWithOTP = async (req, res, next) => {
//   try {
//     const {
//       user, accessToken,
//     } = await User.findAndGenerateToken({ withOTP: true, phone: req.body.contact });
//     const token = generateTokenResponse(user, accessToken);
//     req.locals = { response: ({ token, user }) };
//     return next();
//   } catch (error) {
//     return next(error);
//   }
// };


/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
// exports.oAuth = async (req, res, next) => {
//   try {
//     const { user } = req;
//     if (!user.mageId) {
//       const mageId = await createMagentoCustomerId(user);
//       const userWithmageId = Object.assign(user, { mageId });
//       await userWithmageId.save();
//     }
//     const accessToken = user.token();
//     const token = generateTokenResponse(user, accessToken);
//     const userTransformed = user.transform();
//     const addresses = await getCustomerAddresses(user.mageId);
//     return res.json({ token, user: { ...userTransformed, ...addresses } });
//   } catch (error) {
//     return next(new APIError({ message: 'Could not log in.', status: 400 }));
//   }
// };

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
// exports.refresh = async (req, res, next) => {
//   try {
//     const { email, refreshToken } = req.body;
//     const refreshObject = await RefreshToken.findOneAndRemove({
//       userEmail: email,
//       token: refreshToken,
//     });
//     const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
//     const response = generateTokenResponse(user, accessToken);
//     return res.json(response);
//   } catch (error) {
//     return next(error);
//   }
// };

// exports.generateOTP = async (req, res, next) => {
//   try {
//     const { contact } = req.body;
//     const user = await User.findOne({ phone: contact }).exec();
//     if (!user) {
//       throw new APIError({ message: 'We can\'t find an account with that phone.', status: 404 });
//     }
//     const otpResponse = await generateOTP(contact);
//     res.json(otpResponse);
//   } catch (error) {
//     next(error);
//   }
// };

// exports.generateOTPForGuest = async (req, res, next) => {
//   try {
//     const { contact } = req.body;
//     console.log(req.body);
//     const otpResponse = await generateOTP(contact);
//     console.log(otpResponse);
//     res.json(otpResponse);
//   } catch (error) {
//     next(error);
//   }
// };

// exports.verifyOTP = async (req, res, next) => {
//   try {
//     const { sessionId, otp } = req.body;
//     await verifyOTP({ sessionId, otp });
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// exports.sendSuccessMessageAfterOTPVerification = async (req, res, next) => {
//   res.json({ success: true });
// };

// exports.sendPasswordReset = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email }).exec();

//     if (user) {
//       const passwordResetObj = await PasswordResetToken.generate(user);
//       emailProvider.sendPasswordReset(passwordResetObj);
//       res.status(httpStatus.OK);
//       return res.json({ message: 'We\'ve sent an email to your account for password reset.', status: 'OK' });
//     }
//     throw new APIError({
//       status: httpStatus.UNAUTHORIZED,
//       message: 'No account found with that email',
//     });
//   } catch (error) {
//     // return next(error);
//     res.status(httpStatus.OK);
//     return res.json({ message: 'No account found with that email.', status: 'NoAccount' });
//   }
// };

// exports.resetPassword = async (req, res, next) => {
//   try {
//     const { email, password, resetToken } = req.body;
//     console.log(req.body);
//     const resetTokenObject = await PasswordResetToken.findOneAndRemove({
//       userEmail: email,
//       resetToken,
//     });

//     console.log(resetTokenObject);

//     const err = {
//       status: httpStatus.UNAUTHORIZED,
//       isPublic: true,
//     };
//     if (!resetTokenObject) {
//       err.message = 'Cannot find matching reset token';
//       throw new APIError(err);
//     }
//     if (moment().isAfter(resetTokenObject.expires)) {
//       err.message = 'Reset token is expired';
//       throw new APIError(err);
//     }

//     const user = await User.findOne({ email: resetTokenObject.userEmail }).exec();
//     user.password = password;
//     await user.save();
//     emailProvider.sendPasswordChangeEmail(user);

//     res.status(httpStatus.OK);
//     return res.json('Password Updated');
//   } catch (error) {
//     return next(error);
//   }
// };

// exports.sendCouponMessageOnPhone = async (req, res, next) => {
//   try {
//     const data = req.body;
//     const response = await axios.get(`${selfUrl}/v1/users/searchRegisteredPhone/${data.To}`);
//     const result = response.data;

//     const phoneWithoutCoupon = await Coupons.fetchCouponwithoutPhoneNumber();

//     if (result.code === 200) {
//       if (result.orderCount === 0) {
//         const couponCode = await Coupons.findByPhone({ Phone: data.To });
//         if (couponCode.length) {
//           const otpResponse = await sendMessageOnPhone(data, couponCode[0].CouponCode);
//           await Coupons.update({ CouponCode: couponCode[0].CouponCode }, { Name: data.VAR1, SessionID: otpResponse.sessionId });
//           res.json(otpResponse.sessionId);
//         } else {
//           const otpResponse = await sendMessageOnPhone(data, phoneWithoutCoupon.CouponCode);
//           await Coupons.update({ CouponCode: phoneWithoutCoupon.CouponCode }, { Name: data.VAR1, Phone: data.To, SessionID: otpResponse.sessionId });
//           res.json(otpResponse.sessionId);
//         }
//       } else {
//         res.json(result);
//       }
//     }
//   } catch (error) {
//     const response = error.response.data;
//     const data = req.body;
//     if (response.code === 404 && response.message === 'User does not exist') {
//       const couponCode = await Coupons.findByPhone({ Phone: data.To });

//       const phoneWithoutCoupon = await Coupons.fetchCouponwithoutPhoneNumber();
//       if (couponCode.length) {
//         const otpResponse = await sendMessageOnPhone(data, couponCode[0].CouponCode);
//         await Coupons.update({ CouponCode: couponCode[0].CouponCode }, { Name: data.VAR1, SessionID: otpResponse.sessionId });
//         res.json(otpResponse.sessionId);
//       } else {
//         const otpResponse = await sendMessageOnPhone(data, phoneWithoutCoupon.CouponCode);
//         await Coupons.update({ CouponCode: phoneWithoutCoupon.CouponCode }, { Name: data.VAR1, Phone: data.To, SessionID: otpResponse.sessionId });
//         res.json(otpResponse.sessionId);
//       }
//     } else {
//       next(error);
//     }
//   }
// };
