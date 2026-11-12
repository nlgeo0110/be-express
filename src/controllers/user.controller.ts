import userService from '@/services/user.service';
import {
  CreateUserBody,
  UpdateUserBody,
  UserIdParam,
} from '@/validators/user.schema';
import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';

export default {
  async listUsers(req: Request, res: Response) {
    const data = await userService.listUsers();

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Get user list successfully',
      data,
    });
  },

  async createUser(req: Request, res: Response) {
    const data = await userService.createUser(req.body as CreateUserBody);

    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      success: true,
      message: 'User created successfully',
      data,
    });
  },

  async updateUser(req: Request, res: Response) {
    const { id } = res.locals.params as UserIdParam;
    const body = req.body as UpdateUserBody;
    const data = await userService.updateUser(id, body);

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data,
    });
  },

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    await userService.deleteUser(+id);

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'User deleted successfully',
    });
  },
} satisfies Record<string, RequestHandler>;
