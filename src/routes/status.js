import express from 'express';
import { getUserFromAccessToken } from '../controllers';

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    const user = await getUserFromAccessToken(req.cookies.vueauth_access_token);
    if (!user) {
      throw new Error();
    }
    res.status(200).send({
      loggedIn: true,
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
