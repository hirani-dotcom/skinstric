"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [showCookieNotice, setShowCookieNotice] = useState(true);
    const router = useRouter();

    return (
        <div className="landing-page">
            <main className="landing-main">
                <button className="discover-edge-link" onClick={() => router.push("/about")}>
                    <span className="discover-edge-control">
                        <span className="button-arrow" aria-hidden="true">
                            ←
                        </span>
                        <span>DISCOVER AI</span>
                    </span>
                </button>

                <button className="test-edge-link" onClick={() => router.push("/taketest")}>
                    <span className="test-edge-control">
                        <span>TAKE TEST</span>
                        <span className="button-arrow" aria-hidden="true">
                            →
                        </span>
                    </span>
                </button>

                <section className="hero-copy" aria-labelledby="hero-title">
                    <div className="medium-diamond-field" aria-hidden="true">
                        <span className="medium-diamond medium-diamond-left" />
                        <span className="medium-diamond medium-diamond-right" />
                    </div>
                    <p className="hero-kicker">
                        SKINSTRIC / PERSONALIZED SKINCARE
                    </p>
                    <h1 id="hero-title">
                        Sophisticated
                        <br />
                        skincare
                    </h1>
                    <p className="hero-description">
                        SKINSTRIC DEVELOPED AN A.I. THAT CREATES A
                        HIGHLY-PERSONALISED ROUTINE TAILORED TO WHAT YOUR SKIN
                        NEEDS.
                    </p>
                </section>
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
