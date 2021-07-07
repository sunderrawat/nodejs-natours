const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/login', authController.isLoggedIn, viewsController.getLogin);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

module.exports = router;
