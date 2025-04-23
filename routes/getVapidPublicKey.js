const express = require('express');
const router = express.Router();

router.get('/api/get-vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

module.exports = router;
