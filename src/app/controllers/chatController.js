const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  res.json({msg: 'ola mundo'})
});


module.exports = (app) => app.use('/chat', router);
