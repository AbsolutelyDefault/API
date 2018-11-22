import express from 'express';
import loginRoutes from './login';
import { authorization } from '../controllers';
import statusRoute from './status';
import columnRoute from './column';

const router = express.Router();

router.use('/', statusRoute);
router.use('/auth', loginRoutes);
router.use('/api', authorization);
router.use('/api/column', columnRoute);

export default router;
