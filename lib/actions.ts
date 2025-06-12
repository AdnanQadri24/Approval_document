"use server";
import { RegisterSchema } from "@/lib/zod";
import { hashSync } from "bcrypt-ts";
import {prisma} from "@/lib/prisma"
import { redirect } from "next/navigation";

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
    } catch (error) {
        return {message: "Failed to register user"}
    }
    redirect("/login");

}