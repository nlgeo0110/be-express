import { Router } from 'express';
import authController from '@/controllers/auth.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validateBody } from '@/middlewares/validate.middleware';
import {
  loginBodySchema,
  refreshTokenBodySchema,
  registerBodySchema,
} from '@/validators/auth.schema';

const router = Router();

router.post('/login', validateBody(loginBodySchema), authController.login);
router.post(
  '/register',
  validateBody(registerBodySchema),
  authController.register
);
router.post(
  '/refresh-token',
  validateBody(refreshTokenBodySchema),
  authController.refreshToken
);
router.delete('/logout', authMiddleware, authController.logout);
router.post(
  '/revoke-other-tokens',
  authMiddleware,
  authController.revokeOtherTokens
);
router.get('/me', authMiddleware, authController.getMe);

export default router;
