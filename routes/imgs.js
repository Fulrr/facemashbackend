const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
const imgsController = require('../controllers/imgs');

router.use(bodyParser.json());
router.use(cors()); 

router.get('/', imgsController.fetchAll);
router.put('/update-score/:id', imgsController.updatePoints);
router.get('/top-ten', imgsController.fetchTopTen);
router.get('/top-ten-user', imgsController.fetchTopTenUser);
router.get('/find/:id', imgsController.onlyone);
router.post('/add-image', imgsController.upload);

module.exports = router;
