"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SiteHeader() {
    const [isCodeOpen, setIsCodeOpen] = useState(false);
    const [codeMessage, setCodeMessage] = useState("");
    const router = useRouter();

    function submitCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCodeMessage("Code entry is not connected in this preview.");
    }

    return (
        <>
            <header className="flex items-center justify-between p-6 absolute top-0 left-0 right-0 z-50 text-black">
                <div>
                <button
                    className="text-xs font-medium tracking-tight hover:bg-black hover:text-white transition-colors px-4 py-2"
                    onClick={() => router.push("/")}
                    aria-label="Skinstric Home"
                >
                    SKINSTRIC
                </button>
                <span className="text-xs text-neutral-500 tracking-tight ml-4 ">
                    [  INTRO  ]
                </span>
                </div>
                <button
                    className="text-xs text-white bg-black border border-gray-300 px-4 py-2 hover:bg-white hover:text-black transition-colors"
                    onClick={() => setIsCodeOpen(true)}
                >
                    ENTER CODE <span aria-hidden="true">↗</span>
                </button>
            </header>

            {isCodeOpen && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-100 p-4 backdrop-blur-sm"
                    onClick={() => setIsCodeOpen(false)}
                >
                    <section
                        className="w-full max-w-md bg-black border border-white/10 p-8 relative text-white"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="code-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-6 text-3xl font-light hover:opacity-70 transition-opacity"
                            onClick={() => setIsCodeOpen(false)}
                            aria-label="Close dialog"
                        >
                            ×
                        </button>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-8">
                            SKINSTRIC / ACCESS
                        </p>
                        <h2
                            id="code-title"
                            className="text-2xl font-light mb-8"
                        >
                            Enter your code
                        </h2>
                        <form onSubmit={submitCode}>
                            <label
                                htmlFor="access-code"
                                className="block text-[10px] tracking-widest text-neutral-400 mb-2"
                            >
                                ACCESS CODE
                            </label>
                            <input
                                id="access-code"
                                name="code"
                                autoComplete="one-time-code"
                                required
                                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 focus:outline-none focus:border-white transition-colors mb-6 text-white"
                            />
                            <button
                                className="w-full py-4 border border-white text-xs tracking-widest hover:bg-white hover:text-black transition-colors"
                                type="submit"
                            >
                                CONTINUE <span aria-hidden="true">↗</span>
                            </button>
                        </form>
                        {codeMessage && (
                            <p
                                className="mt-4 text-xs text-neutral-400 text-center"
                                role="status"
                            >
                                {codeMessage}
                            </p>
                        )}
                    </section>
                </div>
            )}
        </>
    );
}
