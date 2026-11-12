import roleRepository from '@/repositories/role.repository';

export default {
  listRoles() {
    return roleRepository.findMany();
  },

  createRole(data) {
    return roleRepository.create(data);
  },

  assignRole(data) {
    return roleRepository.assignRole(data);
  },
};
