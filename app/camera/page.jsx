"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { takeCameraStream } from "../camera-stream";

export default function CameraPage() {
    const videoRef = useRef(null);
    const [cameraStatus, setCameraStatus] = useState("checking");
    const [error, setError] = useState("");
    const [captureError, setCaptureError] = useState("");
    const router = useRouter();

    const handleCapture = () => {
        const video = videoRef.current;
        if (!video?.videoWidth || !video.videoHeight) {
            setCaptureError("The camera image is not ready. Please try again.");
            return;
        }

        try {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");

            if (!context) {
                throw new Error("Unable to create an image canvas.");
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            sessionStorage.setItem(
                "skinstric.uploadedImage",
                canvas.toDataURL("image/jpeg", 0.9),
            );
            router.push("/result");
        } catch {
            setCaptureError("Unable to save the photo. Please try again.");
        }
    };

    useEffect(() => {
        let stream = takeCameraStream();
        let cancelled = false;

        const startCamera = async () => {
            if (
                !stream &&
                (!navigator.mediaDevices ||
                    !navigator.mediaDevices.getUserMedia)
            ) {
                setCameraStatus("unavailable");
                setError("No camera is available on this device.");
                return;
            }

            try {
                stream ??= await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                if (cancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                if (
                    !stream
                        .getVideoTracks()
                        .some((track) => track.readyState === "live")
                ) {
                    throw new Error("No active camera track is available.");
                }

                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setCameraStatus("ready");
            } catch (err) {
                stream?.getTracks().forEach((track) => track.stop());
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
                setCameraStatus("unavailable");
                setError(
                    "Camera is unavailable. Check your camera connection and browser permissions, then try again.",
                );
            }
        };

        startCamera();

        return () => {
            cancelled = true;
            const activeStream = videoRef.current?.srcObject || stream;
            if (activeStream) {
                activeStream.getTracks().forEach((track) => track.stop());
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            }
        };
    }, []);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f5f5f3] px-6 text-neutral-900">
            <div className="flex max-w-lg flex-col items-center gap-4 text-center">
                <h1 className="text-2xl font-semibold uppercase tracking-[0.2em]">
                    Camera
                </h1>

                <div className="relative h-[60vh] w-full max-w-lg overflow-hidden rounded-2xl bg-black shadow-lg">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover"
                    />
                    {cameraStatus !== "ready" ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f3] px-6 text-neutral-700">
                            {cameraStatus === "checking" ? (
                                <p
                                    role="status"
                                    className="text-sm uppercase tracking-[0.2em]"
                                >
                                    Checking camera availability...
                                </p>
                            ) : (
                                <p
                                    role="alert"
                                    className="text-sm uppercase tracking-[0.2em]"
                                >
                                    {error}
                                </p>
                            )}
                        </div>
                    ) : null}
                </div>
                {cameraStatus === "ready" ? (
                    <button
                        type="button"
                        onClick={handleCapture}
                        className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
                    >
                        Take photo
                    </button>
                ) : null}
                {captureError ? (
                    <p role="alert" className="text-sm text-red-600">
                        {captureError}
                    </p>
                ) : null}
            </div>
        </main>
    );
}
