import { toUserResponse } from '@/mappers/user.mapper';
import authService from '@/services/auth.service';
import {
  requireAuthContext,
  requireCurrentUser,
} from '@/utils/request-context';
import {
  LoginBody,
  RefreshTokenBody,
  RegisterBody,
} from '@/validators/auth.schema';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';

export default {
  async login(req, res) {
    const { username, password } = req.body as LoginBody;
    const data = await authService.login({ username, password });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Logged in successfully',
      data,
    });
  },

  async register(req, res) {
    const { username, password } = req.body as RegisterBody;
    const data = await authService.register({ username, password });

    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      success: true,
      message: 'Registered successfully',
      data,
    });
  },

  async logout(_req, res) {
    const { user, jti } = requireAuthContext();
    await authService.logout({ userId: user.id, jti });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Logged out successfully',
    });
  },

  async refreshToken(req, res) {
    const { refresh_token } = req.body as RefreshTokenBody;
    const data = await authService.refreshToken({ refresh_token });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Token refreshed successfully',
      data,
    });
  },

  async getMe(_req, res) {
    const currentUser = requireCurrentUser();

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Get current user successfully',
      data: toUserResponse(currentUser),
    });
  },

  async revokeOtherTokens(_req, res) {
    const { user, jti } = requireAuthContext();

    await authService.revokeOtherTokens(user.id, jti);

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Other tokens revoked successfully',
    });
  },
} satisfies Record<string, RequestHandler>;
