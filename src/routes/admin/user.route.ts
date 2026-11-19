import userController from '@/controllers/user.controller';
import {
  validateBody,
  validateParams,
} from '@/middlewares/validate.middleware';
import {
  createUserBodySchema,
  updateUserBodySchema,
  userIdParamSchema,
} from '@/validators/user.schema';
import { Router } from 'express';

const router = Router();

router.get('/', userController.listUsers);

router.post('/', validateBody(createUserBodySchema), userController.createUser);

router.patch(
  '/:id',
  validateParams(userIdParamSchema),
  validateBody(updateUserBodySchema),
  userController.updateUser
);

router.delete('/:id', userController.deleteUser);

export default router;
