"use server";
import { RegisterSchema, SignInSchema } from "@/lib/zod";
import { hashSync } from "bcrypt-ts";
import {prisma} from "@/lib/prisma"
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const SignUpCredentials = async(prevState:unknown, formData: FormData) => {
    
    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()))

    if(!validatedFields.success){
        return {
            error: validatedFields.error.flatten().fieldErrors
        }
    }

    const {name, email, password} = validatedFields.data
    const hashedPassword = hashSync(password, 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
        })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {message: "Failed to register user"}
    }
    redirect("/login");
};

export const SignInCredentials = async(prevState: unknown, formData:FormData) => {
    const validatedFields = SignInSchema.safeParse(Object.fromEntries(formData.entries()))

    if(!validatedFields.success){
        return {
            error: validatedFields.error.flatten().fieldErrors
        }
    }

    const {email, password} = validatedFields.data

    try {
        await signIn("credentials", {email, password, redirectTo: "/dashboard"})
    } catch (error) {
        if(error instanceof AuthError){
            switch (error.type) {
                case "CredentialsSignin":
                    return {message: "Invalid Credentials."}
                default:
                    return {message: "Something went wrong"}
            }
        }
        throw error;
        
    }
}