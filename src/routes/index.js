import express from 'express';
import loginRoutes from './login';
import { authorization } from '../controllers';
import statusRoute from './status';
import columnRoute from './column';
import taskRoute from './task';

const router = express.Router();

router.use('/', statusRoute);
router.use('/auth', loginRoutes);
router.use('/api', authorization);
router.use('/api/column', columnRoute);
router.use('/api/column/task', taskRoute);


export default router;
