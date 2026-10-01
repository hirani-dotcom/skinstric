"use client";

import { useState, type FormEvent } from "react";

export default function SiteHeader() {
    const [isCodeOpen, setIsCodeOpen] = useState(false);
    const [codeMessage, setCodeMessage] = useState("");

    function submitCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCodeMessage("Code entry is not connected in this preview.");
    }

    return (
        <>
            <header className="site-header">
                <a className="wordmark" href="/" aria-label="Skinstric home">
                    SKINSTRIC
                </a>
                <span className="header-section">INTRO</span>
                <button
                    className="code-button"
                    onClick={() => setIsCodeOpen(true)}
                >
                    ENTER CODE <span aria-hidden="true">↗</span>
                </button>
            </header>

            {isCodeOpen && (
                <div
                    className="dialog-backdrop"
                    onClick={() => setIsCodeOpen(false)}
                >
                    <section
                        className="code-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="code-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="dialog-close"
                            onClick={() => setIsCodeOpen(false)}
                            aria-label="Close dialog"
                        >
                            ×
                        </button>
                        <p className="dialog-eyebrow">SKINSTRIC / ACCESS</p>
                        <h2 id="code-title">Enter your code</h2>
                        <form onSubmit={submitCode}>
                            <label htmlFor="access-code">ACCESS CODE</label>
                            <input
                                id="access-code"
                                name="code"
                                autoComplete="one-time-code"
                                required
                            />
                            <button className="dialog-submit" type="submit">
                                CONTINUE <span aria-hidden="true">↗</span>
                            </button>
                        </form>
                        {codeMessage && (
                            <p className="code-message" role="status">
                                {codeMessage}
                            </p>
                        )}
                    </section>
                </div>
            )}
        </>
    );
}
