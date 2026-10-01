"use client";

import { usePathname, useRouter } from "next/navigation";

export default function SiteFooter() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === "/") return null;

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    };

    return (
        <footer className="fixed inset-x-0 bottom-0 z-40 flex justify-center border-t border-neutral-200 bg-white/95 px-6 py-3 backdrop-blur-sm">
            <button
                aria-label="Go back"
                className="group flex items-center gap-2 text-[10px] font-semibold tracking-tight text-neutral-900"
                onClick={handleBack}
                type="button"
            >
                <span
                    aria-hidden="true"
                    className="button-arrow group-hover:bg-black group-hover:text-white group-focus-visible:bg-black group-focus-visible:text-white"
                >
                    ←
                </span>
                <span>BACK</span>
            </button>
        </footer>
    );
}
