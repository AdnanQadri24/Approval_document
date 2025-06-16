import Link from "next/link";
import Image from "next/image";
import {auth, signOut} from "@/auth"

const Navbar = async () => {
    const session = await auth();
    return (
        <nav className="bg-white border-gray-200 border-b">
            <div className="flex max-w-screen-xl items-center mx-auto justify-between p-4">
                <Link href="/dashboard">
                    <Image
                        src="/logo1.avif"
                        alt="logo"
                        width={300}
                        height={36}
                        priority/>
                </Link>
                <div className="flex items-center gap-3">
                    <ul
                        className="flex items-center gap-4 mr-5 font-semibold text-gray-600 hover-text-400">
                        <li>
                            <Link href="/dashboard">Home</Link>
                        </li>
                        <li>
                            <Link href="product">Product</Link>
                        </li>
                        <li>
                            <Link href="user">Users</Link>
                        </li>
                    </ul>
                    <div className="flex gap-3 items-center">
                        <div className="flex flex-col justify-center -space-y-1">
                            <span className="font-semibold text-gray-600 text-right capitalize">
                                username
                            </span>
                            <span className="font-xs text-gray-400 text-right capitalize">
                                admin
                            </span>
                        </div>
                        <button type="button" className="text-sm ring-2 bg-gray-100 rounded-full">
                            <Image
                                alt="avatar"
                                src={session
                                    ?.user.image || "/user.svg"}
                                width={64}
                                height={64}
                                className="w-8 h-8 rounded-full"/>
                        </button>
                    </div>
                    {
                        session
                            ? (
                                <form
                                    action={async () => {
                                        "use server";
                                        await signOut({redirectTo: "/login"})
                                    }}>
                                    <button
                                        type="submit"
                                        className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500 ">SignOut</button>
                                </form>
                            )
                            : (
                                <Link
                                    href="/login"
                                    className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500">Sign In</Link>
                            )
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar;