import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { env } from 'process';
interface DecodedValue {
    id: number;
    iat: number;
    exp: number;
}
const decodeJwt = (req: NextRequest) => {
    let token;
    if (
        req.headers.get('authorization') &&
        req.headers.get('authorization')?.startsWith('Bearer')
    ) {
        token = req.headers.get('authorization')?.split(' ')[1];
    } else if (req.cookies.has('token')) {
        token = req.cookies.get('token')?.value;
    }
    if (!token) return undefined;
    const decoded = jwt.verify(
        token,
        env.JWT_SECRET || 'no-secret`'
    ) as DecodedValue;
    return decoded;
};

export default decodeJwt;
