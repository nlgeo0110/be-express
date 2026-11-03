import userRepository from '@/repositories/user.repository';

export default {
  getUserByUsername(username: string) {
    return userRepository.findByUsername(username);
  },

  getUserById(id: number) {
    return userRepository.findById(id);
  },
};
