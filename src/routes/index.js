import express from 'express';
import loginRoutes from './login';
import { authorization } from '../controllers';
import statusRoute from './status';

const router = express.Router();

router.use('/', statusRoute);
router.use('/auth', loginRoutes);
router.use('/api', authorization);

export default router;
