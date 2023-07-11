import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import express from 'express';
import { getDb } from '../db';
import { generateAccessToken } from '../utils/jwt';
import { auth } from '../middleware/auth'


export const userRoutes = express.Router();

const db = getDb();

userRoutes.get('/', async (req: Request, res: Response) => {
  const users = await db.user.findMany();
  res.json(users);
});

userRoutes.get('/authenticate', auth, async (req: Request, res: Response) => {
  res.status(200);
  res.json({authenticated: true});
});

userRoutes.post('/login', async (req: Request, res: Response, next) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'invalid'});;
      throw new Error('Email and password required.');
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      res.status(400).json({ message: 'invalid'});;
      throw new Error('Invalid credentials.');
    };

    const validPassword = await compare(password, existingUser.password);

    if (!validPassword) {
      res.status(403).json({ message: 'invalid'});
      throw new Error('Invalid credentials.');
    };

     const token = await generateAccessToken(existingUser.id, existingUser.roles);
     console.log(token);
     res.json({token: token});

  } catch (err) {
    return res.json({message: 'invalid'})
  }
});

userRoutes.post('/create', auth, async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!name || !password || !email){ 
    res.status(400);
    throw new Error('Email, name, and password required.');
  }

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    res.status(420).json({message: 'Email in use'});
    throw new Error('Email in use');
  }
  const hashedPassword = await hash(password, 10);
  const user = await db.user.create({
    data: { name: name, email: email, password: hashedPassword },
  });
  res.status(200).json({data: user});
});

userRoutes.patch('/updatePassword', auth, async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  const hashedPassword = await hash(newPassword, 10);
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!existingUser) {
    throw new Error('User does not exist.');
  };
  const updatedUser = await db.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword
    }
  })
  return res.status(201).json({ data: updatedUser });
});




