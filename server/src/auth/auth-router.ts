import { Router } from 'express';
import authController from './auth-controller';
import authMiddleware from './auth-middleware'; // Мідлвар для перевірки токену

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/validate', authController.verifyToken);

export default authRouter;
