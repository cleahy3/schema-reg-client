const express = require('express');
const controller = require('../controllers/controller');
const sessionsController = require('../controllers/sessions');

const router = express.Router();


module.exports = router;

router.route('/sessions')
    .post(sessionsController.create)
    .delete(sessionsController.delete);

router.route('/sessions/new')
    .get(sessionsController.new);


router.route('/')
    .get(controller.home);
