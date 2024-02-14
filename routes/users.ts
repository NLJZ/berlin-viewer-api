import express from 'express';
import * as userController from '../controllers/userController';
import { auth, isAdmin } from '../middleware/auth';

export const userRoutes = express.Router();

userRoutes.get('/', auth, isAdmin, userController.getAllUsers);
userRoutes.get('/authenticate', auth, userController.authenticate);
userRoutes.post('/login', userController.login);
userRoutes.post('/create', auth, isAdmin, userController.createUser);
userRoutes.patch('/newPassword', auth, isAdmin, userController.newPassword);