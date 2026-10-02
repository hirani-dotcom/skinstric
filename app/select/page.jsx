import Link from "next/link";

const categories = [
    { label: "Demographics", position: "left-1/2 top-[36%]" },
    { label: "Cosmetic concerns", position: "left-[36%] top-1/2" },
    { label: "Skin type details", position: "left-[64%] top-1/2" },
    { label: "Weather", position: "left-1/2 top-[64%]" },
];

export default function SelectPage() {
    return (
        <main className="min-h-screen bg-[#f5f5f3] px-6 pb-16 pt-20 text-neutral-900">
            <section className="mx-auto w-full max-w-5xl">
                <p className="mt-4 text-xs font-semibold uppercase tracking-tight text-black">
                    A.I. has estimated the following.
                    <br />
                    Please fine-tune any information if needed.
                </p>
                <div
                    aria-label="Estimated information categories"
                    className="relative mx-auto mt-8 aspect-square w-full max-w-136 sm:mt-12"
                    role="group"
                >
                    {categories.map((category) => {
                        const isDemographics =
                            category.label === "Demographics";
                        const diamondClassName = `peer absolute h-[68%] w-[68%] rotate-45 transition-colors duration-200 hover:bg-neutral-500 ${isDemographics ? "cursor-pointer bg-neutral-400 focus-visible:bg-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900" : "cursor-default bg-neutral-200"}`;

                        return (
                            <div
                                className={`absolute flex aspect-square w-[27%] -translate-x-1/2 -translate-y-1/2 items-center justify-center ${category.position}`}
                                key={category.label}
                            >
                                {isDemographics ? (
                                    <Link
                                        aria-label="Open demographics summary"
                                        className={diamondClassName}
                                        href="/summary"
                                    />
                                ) : (
                                    <div
                                        aria-hidden="true"
                                        className={diamondClassName}
                                    />
                                )}
                                <span
                                    className={`pointer-events-none relative z-10 max-w-full px-1 text-center text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 peer-hover:text-white ${isDemographics ? "peer-focus-visible:text-white" : ""}`}
                                >
                                    {category.label === "Cosmetic concerns" ? (
                                        <>
                                            Cosmetic
                                            <br />
                                            Concerns
                                        </>
                                    ) : category.label ===
                                      "Skin type details" ? (
                                        <>
                                            Skin type
                                            <br />
                                            details
                                        </>
                                    ) : (
                                        category.label
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
