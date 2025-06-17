import Image from "next/image";

const Dashboard = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="rounded-xl shadow-lg mx-4 p-8 w-full flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2 flex justify-center">
                    <Image
                        src="/dashSPF.avif"
                        alt="Gambar Dashboard"
                        width={350}
                        height={200}
                        className="rounded-lg shadow-md object-cover"
                        priority
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Approval Document</h1>
                    <p className="text-gray-600 leading-relaxed">
                        Selamat datang di halaman Approval Document. Di sini Anda dapat melihat dan mengelola dokumen yang memerlukan persetujuan. Pastikan untuk memeriksa setiap dokumen dengan teliti sebelum memberikan persetujuan. Jika ada pertanyaan atau masalah, silakan hubungi tim dukungan kami.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;