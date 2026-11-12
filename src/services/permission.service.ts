import permissionRepository from '@/repositories/permission.repository';

export default {
  listPermissions() {
    return permissionRepository.findMany();
  },
};
