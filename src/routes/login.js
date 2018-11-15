import express from 'express';
import { authentificate } from '../controllers';

const router = express.Router();

router.post('/google', async (req, res) => {
  try {
    const result = await authentificate(req);
    res.cookie('token', result.access_token);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
