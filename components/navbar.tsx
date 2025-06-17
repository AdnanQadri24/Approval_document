import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import DocDropdown from "./adm-drop";
import StdDropdown from "./std-drop";

const Navbar = async () => {
    const session = await auth();

    return (
        <nav className="bg-white border-gray-400 border-b">
            <div className="flex max-w-screen-xl items-center mx-auto justify-between p-4">
                <Link href="/dashboard">
                    <Image
                        src="/logo1.avif"
                        alt="logo"
                        width={300}
                        height={36}
                        priority
                    />
                </Link>

                <div className="flex items-center gap-12">
                    <ul className="flex items-center gap-4 font-semibold text-gray-600 hover-text-400">
                        <li className="hover:bg-gray-400 p-2 rounded-md hover:text-white">
                            <Link href="/dashboard">Home</Link>
                        </li>
                        {session && (
                            <>
                                {session.user.role === "admin" && <DocDropdown />}
                                {session.user.role === "manager" && <li className="hover:bg-gray-400 p-2 rounded-md hover:text-white"><Link href="/manager">Mail</Link></li>}
                                {session.user.role === "standarisasi" && (
                                    <StdDropdown />
                                )}
                            </>
                        )}
                    </ul>

                    {session && (
                        <div className="flex gap-3 items-center">
                            <div className="flex flex-col items-center justify-center -space-y-1">
                                <span className="font-semibold text-gray-600 text-right capitalize">
                                    {session.user.name}
                                </span>
                                <span className="text-sm mx-auto text-gray-400 text-right capitalize">
                                    {session.user.role}
                                </span>
                            </div>
                        </div>
                    )}

                    {session ? (
                        <form
                            action={async () => {
                                "use server";
                                await signOut({ redirectTo: "/login" });
                            }}
                        >
                            <button
                                type="submit"
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-400"
                            >
                                Sign Out
                            </button>
                        </form>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;