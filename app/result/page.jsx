"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ANALYSIS_ENDPOINT =
    "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo";

export default function ResultPage() {
    const [imageSrc, setImageSrc] = useState("");
    const [isPreparing, setIsPreparing] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        let timeoutId;
        const savedImage = sessionStorage.getItem("skinstric.uploadedImage");
        setImageSrc(savedImage || "");

        if (!savedImage) {
            return () => {
                cancelled = true;
            };
        }

        setIsPreparing(true);
        const uploadImage = async () => {
            try {
                const separatorIndex = savedImage.indexOf(",");
                const base64Image = savedImage.slice(separatorIndex + 1);

                if (separatorIndex === -1 || !base64Image) {
                    throw new Error("The captured image is invalid.");
                }

                const response = await fetch(ANALYSIS_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64Image }),
                });
                const responseData = await response.json();

                if (!response.ok || responseData?.success === false) {
                    throw new Error(
                        responseData?.message || "Image upload failed.",
                    );
                }

                const demographics =
                    responseData?.data ??
                    responseData?.demographics ??
                    responseData;
                sessionStorage.setItem(
                    "skinstric.demographics",
                    JSON.stringify(demographics),
                );
                console.info("Skinstric image upload successful.");

                if (!cancelled) {
                    timeoutId = window.setTimeout(() => {
                        router.push("/select");
                    }, 5000);
                }
            } catch (error) {
                console.error("Skinstric image upload failed", error);
                if (!cancelled) {
                    setUploadError(
                        error instanceof Error
                            ? error.message
                            : "Unable to upload the image. Please try again.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsPreparing(false);
                }
            }
        };

        uploadImage();

        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, [router]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f5f5f3] px-6 text-neutral-900">
            <div className="flex flex-col items-center gap-6 text-center">
                <div
                    className="relative flex h-72 w-72 items-center justify-center"
                    role="status"
                    aria-live="polite"
                >
                    <div
                        aria-hidden="true"
                        className="absolute h-48 w-48 rotate-45 border border-dotted border-[#b8b9b9]"
                    />
                    <div className="relative z-10 flex max-w-32 flex-col items-center gap-3">
                        <p
                            className={`text-xs font-semibold uppercase tracking-[0.16em] ${isPreparing ? "animate-pulse" : ""}`}
                        >
                            {isPreparing
                                ? "Uploading your image"
                                : imageSrc
                                  ? uploadError
                                      ? "Upload unsuccessful"
                                      : "Upload complete"
                                  : "No image selected"}
                        </p>
                        {isPreparing ? (
                            <span
                                aria-hidden="true"
                                className="flex items-center gap-2"
                            >
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-700 [animation-delay:-0.3s]" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-700 [animation-delay:-0.15s]" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-700" />
                            </span>
                        ) : null}
                    </div>
                </div>

                {imageSrc ? (
                    <figure className="fixed right-4 top-[30vh] text-left sm:right-6">
                        <figcaption className="mb-2 text-xs font-semibold uppercase tracking-[0.16em]">
                            Preview
                        </figcaption>
                        <div className="h-32 w-32 border-4 border-white bg-white shadow-lg sm:h-40 sm:w-40">
                            <img
                                src={imageSrc}
                                alt="Captured facial image"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </figure>
                ) : (
                    <p className="text-sm uppercase tracking-[0.2em] text-neutral-600">
                        {uploadError || "No image selected"}
                    </p>
                )}
                {imageSrc && uploadError ? (
                    <p role="alert" className="text-sm text-red-600">
                        {uploadError}
                    </p>
                ) : null}
            </div>
        </main>
    );
}
