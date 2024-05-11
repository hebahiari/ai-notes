'use client';

import * as React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface Props {
    guestEmail: string,
    guestPassword: string
}

export default function GuestSignIn({ guestEmail, guestPassword }: Props) {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter()

    const handleSubmit = async () => {

        if (!isLoaded) {
            return;
        }

        try {

            const completeSignIn = await signIn.create({
                identifier: guestEmail,
                password: guestPassword,
            });

            if (completeSignIn.status !== 'complete') {
                console.log(JSON.stringify(completeSignIn, null, 2));
            }

            if (completeSignIn.status === 'complete') {
                await setActive({ session: completeSignIn.createdSessionId });
                router.push('/');
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <div className='cursor-pointer text-gray-600' onClick={handleSubmit}>Try as a guest user</div>
    );
}