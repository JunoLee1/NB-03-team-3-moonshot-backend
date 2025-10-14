//JWT 토큰 생성 및 검증 로직

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'default_jwt_secret';

export function generateToken(userId: number): string {
    //TODO: 만료시간 협의 필요
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): { userId: number } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch {
        return null;
    }
}