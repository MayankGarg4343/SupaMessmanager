const express = require('express');
const router = express.Router();
const { updateMenu, getMenu } = require('../controllers/menuController');

router.post('/', updateMenu);
router.get('/:date', getMenu);

module.exports = router;
