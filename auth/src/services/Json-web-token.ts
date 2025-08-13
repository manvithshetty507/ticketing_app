import jwt from 'jsonwebtoken';
import { BadRequestError } from '@ms_tickets_app/common';

export class JWTUtil {

    static generateToken(userId: string, email: string): string {

        const token = jwt.sign({ id: userId, email }, process.env.JWT_KEY!, {
            expiresIn: '1h'
        });
        return token;
    }

    static verifyToken(token: string): { id: string; email: string } {

        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY!) as { id: string; email: string };
            return decoded;
        } catch (error) {
            throw new BadRequestError("Invalid token");
        }
    }
}