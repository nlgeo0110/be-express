import rolePermisionService from '@/services/role-permision.service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export default {
  async getMatrix(req: Request, res: Response) {
    const data = await rolePermisionService.getMatrix();

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Get role-permission matrix successfully',
      data,
    });
  },

  async setPermissions(req: Request, res: Response) {
    const { roles = [] } = req.body;
    const data = await rolePermisionService.setPermissions(roles);

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Role permissions updated successfully',
      data,
    });
  },
};
