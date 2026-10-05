"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { discardCameraStream, storeCameraStream } from "../camera-stream";

const ScanFacePage = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [cameraError, setCameraError] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [zoom, setZoom] = useState(1);
    const [verticalPosition, setVerticalPosition] = useState(50);
    const [isPreparingImage, setIsPreparingImage] = useState(false);
    const [imageError, setImageError] = useState("");
    const dragStart = useRef(null);
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
            setImagePreview(String(reader.result));
            setZoom(1);
            setVerticalPosition(50);
            setImageError("");
        };
        reader.onerror = () => setImageError("Unable to read this image.");
        reader.readAsDataURL(file);
        event.target.value = "";
    };

    const handleImageConfirm = () => {
        if (!imagePreview || isPreparingImage) {
            return;
        }

        setIsPreparingImage(true);
        setImageError("");

        const image = new window.Image();
        image.onload = () => {
            const size = 1024;
            const scale = Math.max(
                size / image.naturalWidth,
                size / image.naturalHeight,
            );
            const drawWidth = image.naturalWidth * scale;
            const drawHeight = image.naturalHeight * scale;
            const drawTop = (size - drawHeight) * (verticalPosition / 100);
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext("2d");

            if (!context) {
                setImageError("Unable to prepare this image.");
                setIsPreparingImage(false);
                return;
            }

            context.translate(size / 2, size / 2);
            context.scale(zoom, zoom);
            context.drawImage(
                image,
                -drawWidth / 2,
                drawTop - size / 2,
                drawWidth,
                drawHeight,
            );

            sessionStorage.setItem(
                "skinstric.uploadedImage",
                canvas.toDataURL("image/jpeg", 0.92),
            );
            router.push("/result");
        };
        image.onerror = () => {
            setImageError("Unable to prepare this image.");
            setIsPreparingImage(false);
        };
        image.src = imagePreview;
    };

    const handlePreviewWheel = (event) => {
        event.preventDefault();
        setVerticalPosition((position) =>
            Math.min(100, Math.max(0, position + Math.sign(event.deltaY) * 3)),
        );
    };

    const handlePreviewPointerDown = (event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        dragStart.current = {
            pointerY: event.clientY,
            position: verticalPosition,
        };
    };

    const handlePreviewPointerMove = (event) => {
        if (!dragStart.current) {
            return;
        }

        const movement =
            ((event.clientY - dragStart.current.pointerY) /
                event.currentTarget.clientHeight) *
            100;
        setVerticalPosition(
            Math.min(100, Math.max(0, dragStart.current.position - movement)),
        );
    };

    const handlePreviewPointerUp = () => {
        dragStart.current = null;
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
                    Hi {name} from {location}, <br /> Let&apos;s have a look at
                    your skin!
                </p>

                <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0">
                    <div className="flex flex-col items-center justify-center gap-4 md:min-h-60">
                        <div className="relative flex h-54 w-54 items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_240s_linear_infinite_reverse]">
                                <div className="h-40 w-40 rotate-45 border border-dotted border-gray-600 bg-transparent" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_220s_linear_infinite_reverse]">
                                <div className="h-45 w-45 rotate-45 border border-dotted border-gray-600 bg-transparent" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_200s_linear_infinite_reverse]">
                                <div className="h-50 w-50 rotate-45 border border-dotted border-gray-600 bg-transparent" />
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
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_240s_linear_infinite]">
                                <div className="h-40 w-40 rotate-45 border border-dotted border-black bg-transparent" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_220s_linear_infinite]">
                                <div className="h-45 w-45 rotate-45 border border-dotted border-black bg-transparent" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_200s_linear_infinite]">
                                <div className="h-50 w-50 rotate-45 border border-dotted border-black bg-transparent" />
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
                {!imagePreview && imageError ? (
                    <p
                        role="alert"
                        className="mt-4 text-center text-sm text-red-600"
                    >
                        {imageError}
                    </p>
                ) : null}
            </div>

            {imagePreview ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#f5f5f3] px-5 py-8 text-neutral-900">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="image-frame-title"
                        className="flex w-full max-w-md flex-col items-center gap-6"
                    >
                        <div className="flex w-full items-center justify-between">
                            <h2
                                id="image-frame-title"
                                className="text-xs font-semibold uppercase tracking-[0.16em]"
                            >
                                Frame your face
                            </h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview("");
                                    setImageError("");
                                }}
                                className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] underline underline-offset-4"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div
                                className="relative aspect-square w-[min(72vw,24rem)] shrink-0 overflow-hidden bg-neutral-200 touch-none"
                                onWheel={handlePreviewWheel}
                                onPointerDown={handlePreviewPointerDown}
                                onPointerMove={handlePreviewPointerMove}
                                onPointerUp={handlePreviewPointerUp}
                                onPointerCancel={handlePreviewPointerUp}
                            >
                                <img
                                    src={imagePreview}
                                    alt="Selected image being framed"
                                    draggable="false"
                                    className="h-full w-full select-none object-cover"
                                    style={{
                                        objectPosition: `center ${verticalPosition}%`,
                                        transform: `scale(${zoom})`,
                                        transformOrigin: "center",
                                    }}
                                />
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 border border-black/30"
                                />
                            </div>
                            <div className="flex h-[min(72vw,24rem)] items-center">
                                <label
                                    htmlFor="image-position"
                                    className="sr-only"
                                >
                                    Vertical position
                                </label>
                                <input
                                    id="image-position"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={verticalPosition}
                                    onChange={(event) =>
                                        setVerticalPosition(
                                            Number(event.target.value),
                                        )
                                    }
                                    aria-label="Vertical position"
                                    className="h-full w-6 accent-neutral-900"
                                    style={{
                                        writingMode: "vertical-lr",
                                        direction: "rtl",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="w-full space-y-5">
                            <div>
                                <label
                                    htmlFor="image-zoom"
                                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em]"
                                >
                                    Zoom {Math.round(zoom * 100)}%
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setZoom((value) =>
                                                Math.max(1, value - 0.1),
                                            )
                                        }
                                        aria-label="Zoom out"
                                        className="flex h-8 w-8 items-center justify-center border border-neutral-400 text-lg"
                                    >
                                        −
                                    </button>
                                    <input
                                        id="image-zoom"
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.05"
                                        value={zoom}
                                        onChange={(event) =>
                                            setZoom(Number(event.target.value))
                                        }
                                        className="w-full accent-neutral-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setZoom((value) =>
                                                Math.min(3, value + 0.1),
                                            )
                                        }
                                        aria-label="Zoom in"
                                        className="flex h-8 w-8 items-center justify-center border border-neutral-400 text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {imageError ? (
                            <p role="alert" className="text-sm text-red-600">
                                {imageError}
                            </p>
                        ) : null}

                        <button
                            type="button"
                            onClick={handleImageConfirm}
                            disabled={isPreparingImage}
                            className="w-full border border-neutral-900 bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-60"
                        >
                            {isPreparingImage
                                ? "Preparing image"
                                : "Use this image"}
                        </button>
                    </section>
                </div>
            ) : null}
        </main>
    );
};

export default ScanFacePage;
