// 로그인 기능 & 토큰 발급

import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserService from '../user/user.service';
import { generateToken } from './auth.utils';

const userService = new UserService();

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({
        error: 'Email and password required'
    });

    try {
        const user = await userService.getUserByEmail(email);
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = generateToken(user.id);
        return res.json({ token });
    } catch {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
