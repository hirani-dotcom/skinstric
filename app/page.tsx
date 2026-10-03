"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [showCookieNotice, setShowCookieNotice] = useState(true);
    const router = useRouter();

    return (
        <div className="landing-page">
            <main className="landing-main">
                <button
                    className="discover-edge-link"
                    onClick={() => router.push("/about")}
                >
                    <span className="edge-diamond-frame" aria-hidden="true">
                        <span className="edge-diamond-middle" />
                        <span className="edge-diamond-outer" />
                    </span>
                    <span className="discover-edge-control">
                        <span className="button-arrow" aria-hidden="true">
                            <span className="edge-arrow-glyph">←</span>
                        </span>
                        <span>DISCOVER AI</span>
                    </span>
                </button>

                <button
                    className="test-edge-link"
                    onClick={() => router.push("/taketest")}
                >
                    <span className="edge-diamond-frame" aria-hidden="true">
                        <span className="edge-diamond-middle" />
                        <span className="edge-diamond-outer" />
                    </span>
                    <span className="test-edge-control">
                        <span>TAKE TEST</span>
                        <span className="button-arrow" aria-hidden="true">
                            <span className="edge-arrow-glyph">→</span>
                        </span>
                    </span>
                </button>

                <section
                    aria-describedby="hero-description"
                    aria-labelledby="hero-title"
                    className="hero-copy"
                >
                    <div className="medium-diamond-field" aria-hidden="true">
                        <span className="medium-diamond medium-diamond-left" />
                        <span className="medium-diamond medium-diamond-right" />
                    </div>
                    <h1 id="hero-title">
                        Sophisticated
                        <br />
                        skincare
                    </h1>
                </section>
                <p className="hero-description" id="hero-description">
                    SKINSTRIC DEVELOPED AN A.I. THAT CREATES A
                    HIGHLY-PERSONALISED ROUTINE TAILORED TO WHAT YOUR SKIN
                    NEEDS.
                </p>
            </main>

            {showCookieNotice && (
                <aside className="cookie-notice" aria-label="Cookie notice">
                    <p>WE USE COOKIES TO PROVIDE THE BEST EXPERIENCE</p>
                    <button onClick={() => setShowCookieNotice(false)}>
                        OK
                    </button>
                </aside>
            )}
        </div>
    );
}
