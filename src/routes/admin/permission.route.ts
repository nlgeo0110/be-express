import permissionController from '@/controllers/permission.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { Router } from 'express';

const router = Router();

router.use(authMiddleware, roleMiddleware(['ADMIN']));

router.get('/', permissionController.listPermissions);

export default router;
