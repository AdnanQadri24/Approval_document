"use client"

import { useActionState } from 'react';
import Link from 'next/link'
import { SignInCredentials } from '@/lib/actions'

const FormLogin = () => {
    const [state, formAction] = useActionState(SignInCredentials, null)
  return (
    <form action={formAction} className="space-y-6">
        <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="John@gmail.com" required />
            <div aria-live="polite" aria-atomic="true">
                <span className="text-red-500 text-sm mt-2"> {state?.error?.email} </span>
            </div>
        </div>
        <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="********" required />
            <div aria-live="polite" aria-atomic="true">
                <span className="text-red-500 text-sm mt-2"> {state?.error?.password} </span>
            </div>
        </div>
        <button type='submit' className='w-full cursor-pointer text-white bg-blue-800 font-medium px-4 py-2 rounded-lg hover:bg-blue-400'>Submit</button>
        <p>Don&apos;t have an account <Link href="/register"><span className='text-blue-800 hover:text-blue-400 font-medium' >Sign Un here</span></Link> </p>
    </form>
  )
}

export default FormLogin;
