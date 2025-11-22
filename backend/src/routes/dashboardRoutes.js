const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ route: 'dashboard', ok: true });
});

module.exports = router;
