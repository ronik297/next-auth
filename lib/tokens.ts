import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { db } from './db';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(10_00_00, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
        await db.twoFactorToken.delete({
            where: { id: existingToken.id }
        })
    }
    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            token,
            email,
            expires
        }
    })

    return twoFactorToken;
 }

export const generatePasswordResetToken = async ( email:string) => {
    const token = uuidv4();

    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const existingToken = await getPasswordResetTokenByEmail(email);
    if(existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            token,
            email,
            expires
        }
    })

    return passwordResetToken;
}

export const generateVerificationToken = async ( email:string) => {
    const token = uuidv4();

    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken) {
        await db.verificationToken.delete({
            where: { id: existingToken.id }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            token,
            email,
            expires
        }
    })

    return verificationToken;
}

