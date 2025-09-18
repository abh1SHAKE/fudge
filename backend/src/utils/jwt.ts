import jwt from 'jsonwebtoken'
import type { Secret, SignOptions } from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
    const secret: Secret = process.env.JWT_SECRET as Secret;
    const expiresIn: string | number = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign({ userId }, secret, {
        expiresIn
    } as SignOptions );
};

export const verifyToken = (token: string): { userId: string } => {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
};