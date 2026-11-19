import { Router } from 'express';
import rolePermissionController from '@/controllers/role-permission';

const router = Router();

router.get('/', rolePermissionController.getMatrix);

router.put('/', rolePermissionController.setPermissions);

export default router;
