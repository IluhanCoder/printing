import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../user/user-model'; 

export interface ExtendedRequest extends Request {
  user?: IUser;
}

const SECRET_KEY = process.env.JWT_SECRET || 'yourSecretKey';

const authMiddleware = async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Authorization token missing' });
      return;
    }

    // Верифікуємо токен
    const decoded = jwt.verify(token, SECRET_KEY); // Заміни на свій секретний ключ

    // Шукаємо користувача за ID
    const user = await User.findById((decoded as any).id); // Витягуємо id з токена

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Додаємо користувача до запиту
    req.user = user;

    // Продовжуємо виконання, якщо все гаразд
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
