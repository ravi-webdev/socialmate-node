const express = require('express');
// con/st userRoutes = require('./user.route');

const categoriesRoutes = require('./categories.route');
const employeesRoutes = require('./employees.route');
const tutorialsRoutes = require('./tutorials.route');


// const authRoutes = require('./auth.route');
// const productRoutes = require('./product.route');
// const cartRoutes = require('./cart.route');
// const wishlistRoutes = require('./wishlist.route');
// const contentRoutes = require('./content.route');
// const contactUsRoutes = require('./contactus.route');
// const HelpMessageRoutes = require('./helpmessage.route');
// const payumoneyRoutes = require('./payumoney.route');
// const paytmCallback = require('./paytmCallback.route');
// const orderDetailsRouotes = require('./getOrderDetailsByOrderId.route.js');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
// router.use('/docs', express.static('docs'));

router.use('/categories', categoriesRoutes);

router.use('/employees', employeesRoutes);

router.use('/tutorials', tutorialsRoutes);

// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);
// router.use('/products', productRoutes);
// router.use('/carts', cartRoutes);
// router.use('/wishlist', wishlistRoutes);
// router.use('/content', contentRoutes);
// router.use('/contact-us', contactUsRoutes);
// router.use('/helpMessage', HelpMessageRoutes);
// router.use('/payumoney', payumoneyRoutes);
// router.use('/paytm/callback', paytmCallback);
// router.use('/getOrderDetailsByOrderId', orderDetailsRouotes);

module.exports = router;
