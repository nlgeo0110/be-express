import {
  toAdminUserResponse,
  toAuthUser,
  toUserResponse,
} from '@/mappers/user.mapper';
import roleRepository from '@/repositories/role.repository';
import userRepository from '@/repositories/user.repository';
import { BadRequestError, NotFoundError } from '@/utils/errors';
import { CreateUserBody, UpdateUserBody } from '@/validators/user.schema';
import { hashPassword } from '@/utils/hash';
import { RoleName } from '@/generated/prisma/enums';
import { requireCurrentUser } from '@/utils/request-context';

const resolveRoleIds = async (roles: RoleName[]) => {
  const found = await roleRepository.findByNames(roles);
  if (found.length !== roles.length)
    throw new BadRequestError('Role not found');
  return found.map((role) => role.id);
};

export default {
  async listUsers() {
    const users = await userRepository.findMany();
    return users.map((user) => toAuthUser(user));
  },

  async getUserByUsername(username: string) {
    const user = await userRepository.findByUsername(username);
    return user && toAuthUser(user);
  },

  async getUserById(id: number) {
    const user = await userRepository.findById(id);
    return user && toAuthUser(user);
  },

  async createUser({ username, password, name, roles }: CreateUserBody) {
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) throw new BadRequestError('Username already exists');

    const roleIds = await resolveRoleIds(roles);
    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
      username,
      password: hashedPassword,
      name,
      roleIds,
    });

    return {
      user: toUserResponse(toAuthUser(user)),
    };
  },

  async updateUser(id: number, { name, roles }: UpdateUserBody) {
    const existingUser = await userRepository.findById(id);
    if (!existingUser) throw new NotFoundError();

    if (roles && id === requireCurrentUser()?.id && !roles.includes('ADMIN')) {
      throw new BadRequestError('You cannot remove your own ADMIN role');
    }

    const roleIds = roles && (await resolveRoleIds(roles));

    const user = await userRepository.update(id, { name, roleIds });
    return toAdminUserResponse(toAuthUser(user));
  },

  deleteUser(id: number) {
    if (id === requireCurrentUser()?.id)
      throw new BadRequestError('You cannot delete yourself');

    return userRepository.delete(id);
  },
};
