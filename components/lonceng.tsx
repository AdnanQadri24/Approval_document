// components/lonceng.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    document?: {
        id: string;
        title: string;
        user: {
            name: string;
        };
    };
}

export default function Lonceng({ role }: { role: "admin" | "manager" | "standarisasi" }) {
    const [pendingCount, setPendingCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch badge count
    useEffect(() => {
        let url = "";
        if (role === "manager") url = "/api/manager/pending-count";
        if (role === "standarisasi") url = "/api/standarisasi/pending-count";
        if (role === "admin") url = "/api/notifications";
        if (role === "admin") {
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setNotifications(data);
                    setPendingCount(data.filter((n: Notification) => !n.isRead).length);
                });
        } else {
            fetch(url)
                .then(res => res.json())
                .then(data => setPendingCount(data.count));
        }
    }, [role]);

    // Dropdown close on click outside (for admin)
    useEffect(() => {
        if (role !== "admin") return;
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [role]);

    // Mark as read & delete (for admin)
    const markAsRead = async (id: string) => {
        await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
        await fetch(`/api/notifications/${id}`, { method: "DELETE" });
        // Refresh notifications
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setNotifications(data);
        setPendingCount(data.filter((n: Notification) => !n.isRead).length);
    };

    // --- RENDER ---
    if (role === "admin") {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 hover:bg-gray-400 p-2 rounded-md hover:text-white relative"
                >
                    <span>Pesan</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    {pendingCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {pendingCount}
                        </span>
                    )}
                </button>
                {isOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
                        <div className="px-4 py-2 border-b">
                            <h3 className="text-sm font-semibold">Notifikasi</h3>
                        </div>
                        {notifications.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-500">
                                Tidak ada notifikasi
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? "bg-blue-50" : ""}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {notification.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notification.createdAt).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Untuk manager & standarisasi: hanya badge
    return (
        <div className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
            </svg>
            {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {pendingCount}
                </span>
            )}
        </div>
    );
}