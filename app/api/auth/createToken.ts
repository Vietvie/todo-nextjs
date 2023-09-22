import jwt from 'jsonwebtoken';
import { env } from 'process';
const signToken = (id: number) => {
    return jwt.sign({ id }, env.JWT_SECRET || 'no-secret', {
        expiresIn: env.JWT_EXPIRES_IN || '90d',
    });
};

export default signToken;
