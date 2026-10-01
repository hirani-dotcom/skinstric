"use client";

import { useEffect, useState } from "react";
import { IoCloudUpload } from "react-icons/io5";
import { TbCapture } from "react-icons/tb";

const FaceScanIcon = () => (
    <TbCapture className="h-20 w-20 transition-transform duration-200 ease-out hover:scale-110" />
);

const GalleryIcon = () => (
    <IoCloudUpload className="h-20 w-20 transition-transform duration-200 ease-out hover:scale-110" />
);

const ScanFacePage = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        const storedName = sessionStorage.getItem("skinstric.analysisName");
        const storedLocation = sessionStorage.getItem(
            "skinstric.analysisLocation",
        );

        setName(storedName?.trim() || "there");
        setLocation(storedLocation?.trim() || "your location");
    }, []);

    return (
        <main className="min-h-screen bg-[#f5f5f3] px-6 py-10 text-neutral-900">
            <div className="mx-auto max-w-5xl">
                <p className="mt-4 text-xs font-semibold uppercase tracking-tight text-black">
                    Hi {name} from {location}, <br /> Let&apos;s continue with
                    your analysis
                </p>

                <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0">
                    <div className="flex flex-col items-center justify-center gap-4 md:min-h-60">
                        <div className="relative flex h-28 w-28 items-center justify-center">
                            <span className="absolute h-4 w-4 rotate-45 border border-black bg-transparent" />
                            <span className="absolute h-4 w-4 rotate-55 border border-black bg-transparent translate-y-px" />
                            <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-2 border-black text-black">
                                <FaceScanIcon />
                            </div>
                        </div>
                        <p className="max-w-35 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-black">
                            Allow AI <br /> to scan your face
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 md:min-h-60">
                        <div className="relative flex h-28 w-28 items-center justify-center">
                            <span className="absolute h-4 w-4 rotate-45 border border-black bg-transparent" />
                            <span className="absolute h-4 w-4 rotate-55 border border-black bg-transparent translate-y-px" />
                            <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-2 border-black text-black">
                                <GalleryIcon />
                            </div>
                        </div>
                        <p className="max-w-37.5 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-black">
                            Upload Your <br /> Image
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ScanFacePage;
