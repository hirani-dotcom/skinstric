"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [showCookieNotice, setShowCookieNotice] = useState(true);
    const router = useRouter();

    return (
        <div className="landing-page relative min-h-svh overflow-hidden bg-[#fcfcfc] text-[#1a1b1c]">
            <main className="landing-main relative isolate grid min-h-svh place-items-center">
                <button
                    className="discover-edge-link absolute left-0 top-1/2 z-1 flex h-[min(60.29vw,701.31px)] w-[min(21.213vw,178.9px)] items-center justify-center text-inherit text-[9px] font-semibold transform-[translateY(-50%)] [transition:transform_520ms_cubic-bezier(0.22,1,0.36,1),opacity_280ms_ease] pointer-events-none no-underline"
                    onClick={() => router.push("/about")}
                >
                    <span
                        className="edge-diamond-frame absolute left-0 top-1/2 h-[min(30vw,253px)] w-[min(30vw,253px)] transform-[translate(-50%,-50%)_rotate(45deg)] border border-dotted border-[#333] pointer-events-none"
                        aria-hidden="true"
                    >
                        <span className="edge-diamond-middle absolute left-1/2 top-1/2 block aspect-square w-[108%] border border-dotted border-[#969696] opacity-0 transform-[translate(-50%,-50%)] [transition:opacity_220ms_ease]" />
                        <span className="edge-diamond-outer absolute left-1/2 top-1/2 block aspect-square w-[116%] border border-dotted border-[#d8d8d8] opacity-0 transform-[translate(-50%,-50%)] [transition:opacity_220ms_ease]" />
                    </span>
                    <span className="discover-edge-control flex items-center gap-2 pointer-events-auto">
                        <span
                            className="button-arrow grid w-7.25 aspect-square place-items-center border border-[#bfc0c0] text-[16px] font-normal [transition:background-color_180ms_ease,color_180ms_ease,transform_180ms_ease]"
                            aria-hidden="true"
                        >
                            <span className="edge-arrow-glyph relative z-1">
                                ←
                            </span>
                        </span>
                        <span>DISCOVER AI</span>
                    </span>
                </button>

                <button
                    className="test-edge-link absolute right-0 top-1/2 z-1 flex h-[min(60.29vw,701.31px)] w-[min(21.213vw,178.9px)] items-center justify-center text-inherit text-[9px] font-semibold transform-[translateY(-50%)] [transition:transform_520ms_cubic-bezier(0.22,1,0.36,1),opacity_280ms_ease] pointer-events-none no-underline"
                    onClick={() => router.push("/taketest")}
                >
                    <span
                        className="edge-diamond-frame absolute right-0 top-1/2 h-[min(30vw,253px)] w-[min(30vw,253px)] transform-[translate(50%,-50%)_rotate(45deg)] border border-dotted border-[#333] pointer-events-none"
                        aria-hidden="true"
                    >
                        <span className="edge-diamond-middle absolute left-1/2 top-1/2 block aspect-square w-[108%] border border-dotted border-[#969696] opacity-0 transform-[translate(-50%,-50%)] [transition:opacity_220ms_ease]" />
                        <span className="edge-diamond-outer absolute left-1/2 top-1/2 block aspect-square w-[116%] border border-dotted border-[#d8d8d8] opacity-0 transform-[translate(-50%,-50%)] [transition:opacity_220ms_ease]" />
                    </span>
                    <span className="test-edge-control flex items-center gap-2 pointer-events-auto">
                        <span>TAKE TEST</span>
                        <span
                            className="button-arrow grid w-7.25 aspect-square place-items-center border border-[#bfc0c0] text-[16px] font-normal [transition:background-color_180ms_ease,color_180ms_ease,transform_180ms_ease]"
                            aria-hidden="true"
                        >
                            <span className="edge-arrow-glyph relative z-1">
                                →
                            </span>
                        </span>
                    </span>
                </button>

                <section
                    aria-describedby="hero-description"
                    aria-labelledby="hero-title"
                    className="hero-copy relative left-0 flex w-[min(620px,80vw)] flex-col items-center pt-2 text-center [transition:left_520ms_cubic-bezier(0.22,1,0.36,1),width_520ms_cubic-bezier(0.22,1,0.36,1),transform_520ms_cubic-bezier(0.22,1,0.36,1)]"
                >
                    <div
                        className="medium-diamond-field hidden"
                        aria-hidden="true"
                    >
                        <span className="medium-diamond medium-diamond-left" />
                        <span className="medium-diamond medium-diamond-right" />
                    </div>
                    <h1
                        id="hero-title"
                        className="m-0 text-[86px] font-normal leading-[0.95] transform-[scaleX(0.834)] origin-center [transition:font-size_520ms_cubic-bezier(0.22,1,0.36,1),transform-origin_520ms_cubic-bezier(0.22,1,0.36,1)]"
                    >
                        Sophisticated
                        <br />
                        skincare
                    </h1>
                </section>
                <p
                    className="hero-description fixed bottom-20.5 left-8.5 m-0 max-w-76.25 text-left text-[11px] font-semibold leading-[1.45]"
                    id="hero-description"
                >
                    SKINSTRIC DEVELOPED AN A.I. THAT CREATES A
                    HIGHLY-PERSONALISED ROUTINE TAILORED TO WHAT YOUR SKIN
                    NEEDS.
                </p>
            </main>

            {showCookieNotice && (
                <aside
                    className="cookie-notice fixed bottom-4.5 left-1/2 z-3 flex w-max max-w-[calc(100vw-24px)] items-center gap-4.5 bg-[#1a1b1c] px-3.5 py-3 text-[#fcfcfc] transform-[translateX(-50%)]"
                    aria-label="Cookie notice"
                >
                    <p className="m-0 max-w-45 text-[8px] font-semibold leading-[1.4]">
                        WE USE COOKIES TO PROVIDE THE BEST EXPERIENCE
                    </p>
                    <button
                        className="cursor-pointer border border-[#858687] bg-transparent px-2.25 py-1.5 text-[9px] font-semibold text-[#fcfcfc]"
                        onClick={() => setShowCookieNotice(false)}
                    >
                        OK
                    </button>
                </aside>
            )}
        </div>
    );
}
