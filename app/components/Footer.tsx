export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black py-12 md:py-16 mt-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Nonton<span className="text-purple-500">Yuk</span></h3>
                        <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
                            Ketahui lebih lanjut tentang NontonYuk dan bagaimana kami beroperasi.
                            Website ini dibangun menggunakan teknologi modern dengan fokus pada pengalaman pengguna yang optimal.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Disclaimer</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed space-y-2">
                            <span className="block mb-2">
                                Kami <strong>TIDAK</strong> menyimpan satupun file film atau series di server kami.
                                Semua konten yang ditampilkan di website ini berasal dari API pihak ketiga.
                            </span>
                            <span className="block">
                                Kami hanya menyediakan interface untuk mengakses konten tersebut.
                                Jika terdapat konten yang melanggar hak cipta, silakan hubungi pemilik API langsung.
                            </span>
                        </p>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-600">
                        &copy; {new Date().getFullYear()} NontonYuk. Made for educational purposes.
                    </p>
                    <div className="flex gap-4 text-xs text-zinc-600">
                        <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
                        <a href="#" className="hover:text-zinc-400">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
