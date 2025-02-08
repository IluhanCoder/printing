import authService from '../auth/auth-service';
import User from './user-model';

export default new class UserService {
  getUsers = async () => {
    return await User.find();
  }

  createSpecialist = async (userData: any) => {
    return await authService.registerUser({...userData, role: "specialist"});
  }
};