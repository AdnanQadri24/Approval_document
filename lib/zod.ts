import {object, string} from "zod";

export const SignInSchema = object({
    email: string().email("Invalid Email"),
    password: string().min(8, "Password must be 8 character or more").max(32, "Password must be less than 32 character"),
});

export const RegisterSchema = object({
    name: string().min(1, "Name must be more than 1 Character"),
    email: string().email("Invalid Email"),
    password: string().min(8, "Password must be 8 character or more").max(32, "Password must be less than 32 character"),
    ConfirmPassword: string().min(8, "Password must be 8 character or more").max(32, "Password must be less than 32 character"),

}).refine((data) => data.password === data.ConfirmPassword, {
    message: "Password does not match",
    path:["ConfirmPassword"]
})