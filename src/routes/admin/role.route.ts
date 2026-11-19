import roleController from '@/controllers/role.controller';
import { Router } from 'express';

const router = Router();

router.get('/', roleController.listRoles);

router.post('/', roleController.createRole);

router.post('/assign', roleController.assignRole);

export default router;
