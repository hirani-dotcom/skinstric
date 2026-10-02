"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { discardCameraStream, storeCameraStream } from "../camera-stream";

const ScanFacePage = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [cameraError, setCameraError] = useState("");
    const router = useRouter();

    const handleGallerySelect = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const isImage = file.type.startsWith("image/");

        if (!isImage) {
            alert("Please upload a valid image file.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            sessionStorage.setItem(
                "skinstric.uploadedImage",
                String(reader.result),
            );
            router.push("/result");
        };
        reader.readAsDataURL(file);
    };

    const handleCameraClick = async () => {
        setCameraError("");
        discardCameraStream();

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraError("No camera is set up on this device.");
            return;
        }

        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });

            if (
                !stream
                    .getVideoTracks()
                    .some((track) => track.readyState === "live")
            ) {
                throw new Error("No active camera track is available.");
            }

            storeCameraStream(stream);
            router.push("/camera");
        } catch (error) {
            stream?.getTracks().forEach((track) => track.stop());
            discardCameraStream();
            setCameraError("No camera is set up on this device.");
        }
    };

    useEffect(() => {
        const storedName = sessionStorage.getItem("skinstric.analysisName");
        const storedLocation = sessionStorage.getItem(
            "skinstric.analysisLocation",
        );

        setName(storedName?.trim() || "there");
        setLocation(storedLocation?.trim() || "your location");
    }, []);

    return (
        <main className="min-h-screen bg-[#f5f5f3] px-6 pt-20 text-neutral-900">
            <div className="mx-auto max-w-5xl">
                <p className="mt-4 text-xs font-semibold uppercase tracking-tight text-black">
                    Hi {name} from {location}, <br /> Let&apos;s have a look at your skin!
                </p>

                <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0">
                    <div className="flex flex-col items-center justify-center gap-4 md:min-h-60">
                        <div className="relative flex h-54 w-54 items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_28s_linear_infinite]">
                                <div className="h-42 w-42 rotate-45 border border-dotted border-black bg-transparent" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_38s_linear_infinite_reverse]">
                                <div className="h-42 w-42 rotate-45 border border-dotted border-black bg-transparent" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_52s_linear_infinite]">
                                <div className="h-42 w-42 rotate-45 border border-dotted border-black bg-transparent" />
                            </div>
                            <button
                                type="button"
                                onClick={handleCameraClick}
                                className="relative z-10 flex h-30 w-30 -rotate-45 items-center justify-center text-black transition-transform duration-200 hover:scale-110"
                                aria-label="Open camera"
                            >
                                <Image
                                    src="/camera-icon.png"
                                    alt="Camera"
                                    width={150}
                                    height={150}
                                    className="h-25 w-25 object-contain"
                                />
                            </button>
                        </div>
                        <p className="max-w-35 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-black">
                            Allow AI <br /> to scan your face
                        </p>
                        {cameraError ? (
                            <p
                                role="alert"
                                className="max-w-40 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-red-600"
                            >
                                {cameraError}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 md:min-h-60">
                        <div className="relative flex h-54 w-54 items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_28s_linear_infinite]">
                                <div className="h-42 w-42 rotate-45 border border-dotted border-black bg-transparent" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_38s_linear_infinite_reverse]">
                                <div className="h-42 w-42 rotate-45 border border-dotted border-black bg-transparent" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_52s_linear_infinite]">
                                <div className="h-42 w-42 rotate-45 border border-dotted border-black bg-transparent" />
                            </div>
                            <label
                                className="relative z-10 flex h-30 w-30 -rotate-45 cursor-pointer items-center justify-center text-black transition-transform duration-200 hover:scale-110"
                                aria-label="Choose image from gallery"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleGallerySelect}
                                />
                                <Image
                                    src="/gallery-icon.png"
                                    alt="Gallery"
                                    width={150}
                                    height={150}
                                    className="h-25 w-25 object-contain"
                                />
                            </label>
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
