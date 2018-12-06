import express from 'express';
import { getUserFromReq } from '../controllers';

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    const user = await getUserFromReq(req);
    if (!user) {
      throw new Error();
    }
    res.status(200).send({
      loggedIn: true,
      email: user.email,
      name: user.displayName,
      nickname: user.nickname,
    });
  } catch (err) {
    res.status(200).send({
      loggedIn: false,
    });
  }
});

export default router;
