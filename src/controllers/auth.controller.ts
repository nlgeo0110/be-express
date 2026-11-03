import authService from '@/services/auth.service';
import { asyncHandler } from '@/utils/async-handler';
import { UnauthorizedError } from '@/utils/errors';
import {
  LoginBody,
  RefreshTokenBody,
  RegisterBody,
} from '@/validators/auth.schema';
import httpStatus from 'http-status';

export default {
  login: asyncHandler(async (req, res) => {
    const { username, password } = req.body as LoginBody;
    const data = await authService.login({ username, password });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Logged in successfully',
      data,
    });
  }),

  register: asyncHandler(async (req, res) => {
    const { username, password } = req.body as RegisterBody;
    const data = await authService.register({ username, password });

    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      success: true,
      message: 'Registered successfully',
      data,
    });
  }),

  logout: asyncHandler(async (req, res) => {
    const { user, jti } = req;
    if (!jti || !user?.id) throw new UnauthorizedError();
    await authService.logout({ userId: user?.id, jti });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Logged out successfully',
    });
  }),

  refreshToken: asyncHandler(async (req, res) => {
    const { refresh_token } = req.body as RefreshTokenBody;
    const data = await authService.refreshToken({ refresh_token });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Token refreshed successfully',
      data,
    });
  }),

  getMe: asyncHandler(async (req, res) => {
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Get current user successfully',
      data: req.user,
    });
  }),

  revokeOtherTokens: asyncHandler(async (req, res) => {
    const { user, jti } = req;
    if (!jti || !user?.id) throw new UnauthorizedError();

    await authService.revokeOtherTokens(user.id, jti);

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Other tokens revoked successfully',
    });
  }),
};
