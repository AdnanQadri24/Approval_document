// "use client";

// import Link from "next/link";
// import { useState, useEffect, useRef } from "react";

// const StdDropdown = () => {
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const dropdownRef = useRef<HTMLLIElement>(null);

//     // Contoh data pesan (misalnya, dari API atau state global)
//     const pesan = [
//         { id: 1, text: "Pesan Baru dari Admin", href: "/pesan/baru" },
//         { id: 2, text: "Pesan Lama dari Admin", href: "/pesan/lama" },
//     ];

//     useEffect(() => {
//         const handleClickOutside = (e: MouseEvent) => {
//             // Jika dropdownRef ada dan klik terjadi di luar dropdown (atau bukan di tombol notifikasi), tutup dropdown.
//             if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//                 setIsDropdownOpen(false);
//             }
//         };

//         // Menambahkan event listener ketika komponen di-mount
//         document.addEventListener("mousedown", handleClickOutside);

//         // Membersihkan event listener ketika komponen di-unmount
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     return (
//         <li className="relative" ref={dropdownRef}>
//             <button
//                 className="flex items-center gap-1 hover:bg-gray-400 p-2 rounded-md hover:text-white"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             >
//                 <span>Pesan</span>
//                 {/* Ikon Lonceng (Bell) */}
//                 <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                     />
//                 </svg>
//             </button>
//             {isDropdownOpen && (
//                 <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//                     <Link
//                         href="/standarisasi"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         onClick={() => setIsDropdownOpen(false)}
//                     >
//                         Review Dokumen
//                     </Link>
//                 </div>
//             )}
//         </li>
//     );
// };

// export default StdDropdown;