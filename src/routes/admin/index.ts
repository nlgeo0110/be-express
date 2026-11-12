import { Router } from 'express';

import roleRoute from './role.route';
import permissionRoute from './permission.route';
import rolePermissionRoute from './role-permission.route';
import userRoute from './user.route';

import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { permissionMiddleware } from '@/middlewares/permission.middleware';

const router = Router();

router.use(authMiddleware, roleMiddleware(['ADMIN']));
router.use('/roles', roleRoute);
router.use('/permissions', permissionRoute);
router.use('/role-permissions', rolePermissionRoute);
router.use('/users', userRoute);

router.get('/posts', permissionMiddleware('post:read'), (req, res) => {
  return res.json({});
});

export default router;
