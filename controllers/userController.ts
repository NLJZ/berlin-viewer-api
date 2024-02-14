// controllers/userController.ts
import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { getDb } from '../db';
import { generateAccessToken } from '../utils/jwt';

const db = getDb();

export async function getAllUsers(req: Request, res: Response) {
  const users = await db.user.findMany();
  res.json(users);
}

export async function authenticate(req: Request, res: Response) {
  res.status(200).json({ authenticated: true });
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const validPassword = await compare(password, existingUser.password);

    if (!validPassword) {
      return res.status(403).json({ message: 'Invalid credentials.' });
    }

    const token = await generateAccessToken(existingUser.id, existingUser.roles);
    res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function createUser(req: Request, res: Response) {
  const { email, password, name } = req.body;
  if (!name || !password || !email) {
    return res.status(400).json({ message: 'Email, name, and password required.' });
  }

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(420).json({ message: 'Email in use' });
  }

  const hashedPassword = await hash(password, 10);
  const user = await db.user.create({
    data: { name, email, password: hashedPassword },
  });
  res.status(200).json({ data: user });
}

export async function newPassword(req: Request, res: Response) {
  const { email, newPassword } = req.body;
  const hashedPassword = await hash(newPassword, 10);
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return res.status(404).json({ message: 'User does not exist.' });
  }

  const updatedUser = await db.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return res.status(201).json({ data: updatedUser });
}
