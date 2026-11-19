import permissionService from '@/services/permission.service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export default {
  getPermission() {},

  async listPermissions(req: Request, res: Response) {
    const data = await permissionService.listPermissions();

    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      success: true,
      message: 'Get permission list successfully',
      data,
    });
  },

  createPermission() {},
  updatePermission() {},
  deletePermission() {},
};
