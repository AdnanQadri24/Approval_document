"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const DocDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        // Menambahkan event listener ketika komponen di-mount
        document.addEventListener("mousedown", handleClickOutside);

        // Membersihkan event listener ketika komponen di-unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <li className="relative" ref={dropdownRef}>
            <button
                className="flex items-center gap-1 hover:bg-gray-400 p-2 rounded-md hover:text-white"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                Document
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                        href="/admin-feature/create-doc"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        Create Document
                    </Link>
                    <Link
                        href="/admin-feature/view-doc"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        View Document
                    </Link>
                </div>
            )}
        </li>
    );
};

export default DocDropdown; 