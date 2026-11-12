import roleService from '@/services/role.service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export default {
  async listRoles(req: Request, res: Response) {
    const data = await roleService.listRoles();

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Get role list successfully',
      data,
    });
  },

  async createRole(req: Request, res: Response) {
    const { name } = req.body;
    const data = await roleService.createRole({ name });

    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      success: true,
      message: 'Role created successfully',
      data,
    });
  },

  async assignRole(req: Request, res: Response) {
    const { userId, roles } = req.body;
    const params = roles.map((roleId) => ({ userId, roleId }));
    const data = await roleService.assignRole(params);

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      success: true,
      message: 'Roles assigned to user successfully',
      data,
    });
  },
};
