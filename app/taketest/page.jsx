"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ProcessingStatus = () => (
    <div aria-live="polite" className="relative z-10 text-center" role="status">
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-700">
            PROCESSING SUBMISSION
        </p>
        <div aria-hidden="true" className="mt-5 flex justify-center gap-2">
            <span className="size-2 animate-bounce rounded-full bg-neutral-500 motion-reduce:animate-none" />
            <span className="size-2 animate-bounce rounded-full bg-neutral-500 [animation-delay:150ms] motion-reduce:animate-none" />
            <span className="size-2 animate-bounce rounded-full bg-neutral-500 [animation-delay:300ms] motion-reduce:animate-none" />
        </div>
    </div>
);

const CompletionMessage = ({ onProceed }) => (
    <section className="relative z-10 flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-normal text-neutral-900">Thank You!</h1>
        <p className="text-xs text-neutral-600">
            Please proceed to the next step
        </p>
        <button
            className="group mt-2 flex items-center gap-2 text-[10px] font-semibold tracking-tight text-neutral-900"
            onClick={onProceed}
            type="button"
        >
            <span>PROCEED</span>
            <span
                aria-hidden="true"
                className="button-arrow group-hover:bg-black group-hover:text-white group-focus-visible:bg-black group-focus-visible:text-white"
            >
                →
            </span>
        </button>
    </section>
);

const page = () => {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [answer, setAnswer] = useState("");
    const [phase, setPhase] = useState("input");
    const submissionStarted = useRef(false);

    useEffect(() => {
        if (phase !== "processing") return;

        if (!submissionStarted.current) {
            submissionStarted.current = true;

            const name = sessionStorage
                .getItem("skinstric.analysisName")
                ?.trim();
            const location = sessionStorage
                .getItem("skinstric.analysisLocation")
                ?.trim();

            if (name && location) {
                fetch(
                    "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, location }),
                    },
                )
                    .then(async (response) => {
                        if (!response.ok) {
                            throw new Error(
                                `Submission failed with status ${response.status}`,
                            );
                        }

                        const result = await response.json();
                        if (!result.success) {
                            throw new Error(
                                result.message ||
                                    "Submission was not successful",
                            );
                        }

                        console.log(`Success: added ${name} from ${location}`);
                    })
                    .catch((error) => {
                        console.error(
                            "Could not submit analysis details",
                            error,
                        );
                    });
            }
        }

        const timeoutId = window.setTimeout(() => {
            setPhase("complete");
        }, 5000);

        return () => window.clearTimeout(timeoutId);
    }, [phase]);

    const storeAnswer = (value) => {
        const trimmedValue = value.trim();
        const storageKey =
            step === 0
                ? "skinstric.analysisName"
                : "skinstric.analysisLocation";

        if (trimmedValue) {
            sessionStorage.setItem(storageKey, trimmedValue);
        } else {
            sessionStorage.removeItem(storageKey);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!answer.trim()) return;

        storeAnswer(answer);
        if (step === 0) {
            setStep(1);
            setAnswer("");
        } else {
            setPhase("processing");
        }
    };

    return (
        <main className="relative grid min-h-screen place-items-center overflow-hidden px-6">
            <p className="absolute left-6 top-24 text-xs font-semibold uppercase tracking-tight text-black">
                To Start Analysis
            </p>
            <div className="relative grid size-[min(88vw,34rem)] place-items-center">
                <div
                    aria-hidden="true"
                    className="absolute size-[min(72vw,28rem)] rotate-45 border border-dotted border-neutral-400/70 animate-[diamond-pulse_1800ms_ease-in-out_infinite_alternate] motion-reduce:animate-none"
                />
                <div
                    aria-hidden="true"
                    className="absolute size-[min(63vw,24.5rem)] rotate-45 border border-dotted border-neutral-400/70 animate-[diamond-pulse_1800ms_ease-in-out_infinite_alternate] [animation-delay:900ms] motion-reduce:animate-none"
                />
                {phase === "input" ? (
                    <form
                        className="relative z-10 flex w-[min(66vw,20rem)] flex-col items-center gap-2 text-center"
                        onSubmit={handleSubmit}
                    >
                        <label
                            className="text-[14px] font-normal uppercase tracking-tight text-neutral-500"
                            htmlFor="analysis-name"
                        >
                            Click To Type
                        </label>
                        <p className="sr-only" id="analysis-name-description">
                            {step === 0
                                ? "Type your name to start the analysis."
                                : "Enter where you are from."}
                        </p>
                        <input
                            aria-describedby="analysis-name-description"
                            autoComplete={step === 0 ? "name" : "country-name"}
                            autoFocus
                            className="h-14 w-full border-b-2 border-neutral-300 px-2 text-center text-xl text-neutral-900 placeholder:text-black focus:border-neutral-700 focus:outline-none"
                            id="analysis-name"
                            name={step === 0 ? "name" : "location"}
                            onBlur={(event) =>
                                storeAnswer(event.currentTarget.value)
                            }
                            onChange={(event) =>
                                setAnswer(event.currentTarget.value)
                            }
                            placeholder={
                                step === 0
                                    ? "Introduce Yourself"
                                    : "Where Are You From?"
                            }
                            required
                            type="text"
                            value={answer}
                        />
                    </form>
                ) : phase === "processing" ? (
                    <ProcessingStatus />
                ) : (
                    <CompletionMessage
                        onProceed={() => router.push("/ScanFace")}
                    />
                )}
            </div>
        </main>
    );
};

export default page;
