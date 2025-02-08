import User, { IUser } from '../user/user-model';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'yourSecretKey';

export default new class AuthService {
    validateToken = (token: string): boolean => {
        try {
          jwt.verify(token, SECRET_KEY);
          return true;
        } catch (error) {
          return false;
        }
    };

    registerUser = async (userData: any) => {
        const { email, cell, password, username, role } = userData;
      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User already exists');
        }
      
        const newUser: IUser = new User({
          email,
          password,
          username,
          cell,
          role,
        });
      
        return await newUser.save();
      };

      loginUser = async (email: string, password: string) => {
        const user: IUser = await User.findOne({ email });
      
        if (!user || user.password !== password) {
          throw new Error('Invalid credentials');
        }
      
        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
        return token;
      };

      verifyToken = async (authHeader: string | undefined) => {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new Error('Invalid token');
        }
      
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);
      
        const user = await User.findById((decoded as any).id);
        if (!user) {
          throw new Error('User not found');
        }
      
        return user;
      };
}