"use client";

import { useEffect, useState } from "react";

const getNestedValue = (obj, keys) => {
    if (!obj || typeof obj !== "object") return null;

    for (const key of keys) {
        if (key in obj && obj[key] !== undefined && obj[key] !== null) {
            return obj[key];
        }
    }

    for (const value of Object.values(obj)) {
        if (value && typeof value === "object") {
            const nestedValue = getNestedValue(value, keys);
            if (nestedValue !== null) {
                return nestedValue;
            }
        }
    }

    return null;
};

const formatDisplayValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.map(formatDisplayValue).join(" / ");

    if (typeof value === "object") {
        const entries = Object.entries(value);
        if (!entries.length) return "N/A";

        const formattedEntries = entries.map(([key, entryValue]) => {
            if (typeof entryValue === "number") {
                return `${key} (${entryValue})`;
            }
            return `${key}: ${formatDisplayValue(entryValue)}`;
        });

        return formattedEntries.join(" / ");
    }

    return String(value);
};

const getBreakdown = (demographicsObj, keys) => {
    if (!demographicsObj || typeof demographicsObj !== "object") return [];

    const candidates = keys.flatMap((key) => {
        const value = demographicsObj[key];
        return value ? [value] : [];
    });

    const breakdownObj = candidates.find(
        (value) => value && typeof value === "object" && !Array.isArray(value),
    );

    if (!breakdownObj) return [];

    return Object.entries(breakdownObj)
        .map(([label, value]) => {
            const numericValue =
                typeof value === "number"
                    ? value
                    : Number.parseFloat(String(value).replace(/%/g, ""));

            if (Number.isNaN(numericValue)) return null;

            return {
                label: String(label).replace(/_/g, " ").trim(),
                value: numericValue * 100,
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.value - a.value);
};

export default function SummaryPage() {
    const [demographics, setDemographics] = useState(null);
    const [activeCategory, setActiveCategory] = useState("race");
    const [selectedCategoryValues, setSelectedCategoryValues] = useState({
        race: "",
        age: "",
        sex: "",
    });
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        const savedDemographics = sessionStorage.getItem(
            "skinstric.demographics",
        );

        if (savedDemographics) {
            try {
                const parsedDemographics = JSON.parse(savedDemographics);
                const storedCorrections = JSON.parse(
                    sessionStorage.getItem(
                        "skinstric.demographicsCorrections",
                    ) || "{}",
                );
                const breakdowns = {
                    race: getBreakdown(parsedDemographics, [
                        "race",
                        "raceBreakdown",
                        "racialBreakdown",
                        "demographics",
                        "predictions",
                    ]),
                    age: getBreakdown(parsedDemographics, [
                        "age",
                        "ageBreakdown",
                        "ageRange",
                        "demographics",
                        "predictions",
                    ]),
                    sex: getBreakdown(parsedDemographics, [
                        "sex",
                        "gender",
                        "genderBreakdown",
                        "demographics",
                        "predictions",
                    ]),
                };
                const initialSelections = Object.fromEntries(
                    Object.entries(breakdowns).map(([category, breakdown]) => {
                        const correction = storedCorrections[category];
                        return [
                            category,
                            breakdown.some((item) => item.label === correction)
                                ? correction
                                : "",
                        ];
                    }),
                );
                setDemographics(parsedDemographics);
                setSelectedCategoryValues(initialSelections);
            } catch {
                setDemographics(null);
            }
        }
    }, []);

    const predictedAge = getNestedValue(demographics, [
        "predictedAge",
        "age",
        "estimatedAge",
        "ageRange",
    ]);
    const predictedRace = getNestedValue(demographics, [
        "predictedRace",
        "race",
        "ethnicity",
        "skinTone",
    ]);
    const predictedSex = getNestedValue(demographics, [
        "predictedSex",
        "sex",
        "gender",
        "maleFemale",
    ]);
    const raceBreakdown = getBreakdown(demographics, [
        "race",
        "raceBreakdown",
        "racialBreakdown",
        "demographics",
        "predictions",
    ]);
    const ageBreakdown = getBreakdown(demographics, [
        "age",
        "ageBreakdown",
        "ageRange",
        "demographics",
        "predictions",
    ]);
    const sexBreakdown = getBreakdown(demographics, [
        "sex",
        "gender",
        "genderBreakdown",
        "demographics",
        "predictions",
    ]);
    const highestRace = raceBreakdown[0] ?? null;
    const highestAge = ageBreakdown[0] ?? null;
    const highestSex = sexBreakdown[0] ?? null;

    const categoryBreakdownMap = {
        race: raceBreakdown,
        age: ageBreakdown,
        sex: sexBreakdown,
    };

    const getCategoryDisplayValue = (category) => {
        const breakdown = categoryBreakdownMap[category] ?? [];
        const selectedValue = selectedCategoryValues[category];

        if (
            selectedValue &&
            breakdown.some((item) => item.label === selectedValue)
        ) {
            return selectedValue;
        }

        if (breakdown[0]) {
            return breakdown[0].label;
        }

        if (category === "race") return formatDisplayValue(predictedRace);
        if (category === "age") return formatDisplayValue(predictedAge);
        return formatDisplayValue(predictedSex);
    };

    const visibleBreakdown =
        categoryBreakdownMap[activeCategory] ?? raceBreakdown;
    const selectedTopItem =
        visibleBreakdown.find(
            (item) => item.label === selectedCategoryValues[activeCategory],
        ) ??
        visibleBreakdown[0] ??
        null;
    const activeCategoryLabel =
        activeCategory === "race"
            ? "race"
            : activeCategory === "age"
              ? "age"
              : "sex";

    const currentCategoryValues = Object.fromEntries(
        Object.entries(categoryBreakdownMap).map(([category, breakdown]) => [
            category,
            selectedCategoryValues[category] || breakdown[0]?.label || "",
        ]),
    );
    const handleBreakdownSelection = (label) => {
        setIsConfirmed(false);
        setSelectedCategoryValues((prev) => ({
            ...prev,
            [activeCategory]: label,
        }));
    };

    const handleReset = () => {
        setIsConfirmed(false);
        setSelectedCategoryValues({
            race: raceBreakdown[0]?.label || "",
            age: ageBreakdown[0]?.label || "",
            sex: sexBreakdown[0]?.label || "",
        });
    };

    const handleConfirm = () => {
        const savedDemographics = {
            race: getCategoryDisplayValue("race"),
            age: getCategoryDisplayValue("age"),
            sex: getCategoryDisplayValue("sex"),
        };
        const corrections = Object.fromEntries(
            Object.entries(categoryBreakdownMap).flatMap(
                ([category, breakdown]) => {
                    const selectedValue = currentCategoryValues[category];
                    return selectedValue &&
                        selectedValue !== breakdown[0]?.label
                        ? [[category, selectedValue]]
                        : [];
                },
            ),
        );

        localStorage.setItem(
            "skinstric.savedDemographics",
            JSON.stringify(savedDemographics),
        );
        sessionStorage.setItem(
            "skinstric.demographicsCorrections",
            JSON.stringify(corrections),
        );
        setIsConfirmed(true);
    };

    return (
        <main className="min-h-screen bg-[#f5f5f3] px-4 pb-24 pt-32 text-neutral-900 sm:px-6 xl:px-10 2xl:px-14">
            <section className="mx-auto w-full">
                <h1 className="text-3xl font-medium uppercase leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
                    demographics
                </h1>
                <h2 className="mt-1 text-sm font-medium uppercase tracking-tight text-black sm:text-base">
                    predicted age & race
                </h2>

                <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3">
                    <div className="min-h-60 bg-white p-4 sm:p-5">
                        <div className="flex h-full flex-col gap-4">
                            <button
                                type="button"
                                onClick={() => setActiveCategory("race")}
                                className={[
                                    "flex min-h-15 flex-col justify-between p-3 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md group",
                                    activeCategory === "race"
                                        ? "bg-black text-white"
                                        : "bg-[#d0d0ce] text-black hover:bg-[#2f2f2f] hover:text-white",
                                ].join(" ")}
                            >
                                <p
                                    className={[
                                        "text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200",
                                        activeCategory === "race"
                                            ? "text-white"
                                            : "text-neutral-700 group-hover:text-white",
                                    ].join(" ")}
                                >
                                    race
                                </p>
                                <p
                                    className={[
                                        "text-lg font-medium uppercase tracking-tight transition-colors duration-200",
                                        activeCategory === "race"
                                            ? "text-white"
                                            : "text-black group-hover:text-white",
                                    ].join(" ")}
                                >
                                    {getCategoryDisplayValue("race")}
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveCategory("age")}
                                className={[
                                    "flex min-h-15 flex-col justify-between p-3 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md group",
                                    activeCategory === "age"
                                        ? "bg-black text-white"
                                        : "bg-[#d0d0ce] text-black hover:bg-[#2f2f2f] hover:text-white",
                                ].join(" ")}
                            >
                                <p
                                    className={[
                                        "text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200",
                                        activeCategory === "age"
                                            ? "text-white"
                                            : "text-neutral-700 group-hover:text-white",
                                    ].join(" ")}
                                >
                                    age
                                </p>
                                <p
                                    className={[
                                        "text-lg font-medium uppercase tracking-tight transition-colors duration-200",
                                        activeCategory === "age"
                                            ? "text-white"
                                            : "text-black group-hover:text-white",
                                    ].join(" ")}
                                >
                                    {getCategoryDisplayValue("age")}
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveCategory("sex")}
                                className={[
                                    "flex min-h-15 flex-col justify-between p-3 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md group",
                                    activeCategory === "sex"
                                        ? "bg-black text-white"
                                        : "bg-[#d0d0ce] text-black hover:bg-[#2f2f2f] hover:text-white",
                                ].join(" ")}
                            >
                                <p
                                    className={[
                                        "text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200",
                                        activeCategory === "sex"
                                            ? "text-white"
                                            : "text-neutral-700 group-hover:text-white",
                                    ].join(" ")}
                                >
                                    sex
                                </p>
                                <p
                                    className={[
                                        "text-lg font-medium uppercase tracking-tight transition-colors duration-200",
                                        activeCategory === "sex"
                                            ? "text-white"
                                            : "text-black group-hover:text-white",
                                    ].join(" ")}
                                >
                                    {getCategoryDisplayValue("sex")}
                                </p>
                            </button>
                        </div>
                    </div>

                    <div className="min-h-60 bg-[#e7e7e5] p-4 sm:p-5">
                        <div className="flex h-full flex-col">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-700">
                                {activeCategoryLabel}
                            </p>
                            <p className="mt-5 wrap-break-word text-3xl font-medium uppercase leading-tight tracking-tight text-black sm:mt-8 sm:text-4xl">
                                {selectedTopItem
                                    ? selectedTopItem.label
                                    : formatDisplayValue(
                                          activeCategory === "race"
                                              ? predictedRace
                                              : activeCategory === "age"
                                                ? predictedAge
                                                : predictedSex,
                                      )}
                            </p>

                            <div className="mt-6 flex items-center justify-center px-2">
                                <div
                                    className="relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 ease-out sm:h-32 sm:w-32 md:h-36 md:w-36"
                                    style={{
                                        background: `conic-gradient(#1f1f1f ${Math.min((selectedTopItem?.value ?? 0) / 100, 1) * 360}deg, rgba(31,31,31,0.18) 0deg)`,
                                        transition:
                                            "background 1.5s ease-in-out",
                                    }}
                                >
                                    <div className="flex h-26 w-26 items-center justify-center rounded-full bg-[#e7e7e5] text-center sm:h-30 sm:w-30 md:h-34 md:w-34">
                                        <span className="text-base font-semibold uppercase tracking-[0.12em] text-neutral-900 sm:text-lg md:text-xl">
                                            {selectedTopItem
                                                ? `${selectedTopItem.value.toFixed(2)}%`
                                                : "0.00%"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="min-h-60 bg-[#d9d9d6] p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-700">
                                {activeCategoryLabel}
                            </p>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-700">
                                a.i. confidence
                            </p>
                        </div>

                        {visibleBreakdown.length > 0 ? (
                            <ul className="mt-4 space-y-2">
                                {visibleBreakdown.map(({ label, value }) => {
                                    const isSelected =
                                        selectedCategoryValues[
                                            activeCategory
                                        ] === label;

                                    return (
                                        <li
                                            key={label}
                                            className={[
                                                "flex cursor-pointer items-center justify-between gap-3 border-b border-neutral-400/70 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em] transition-all duration-200",
                                                isSelected
                                                    ? "bg-black text-white"
                                                    : "bg-transparent text-neutral-800 hover:bg-[#2f2f2f] hover:text-white",
                                            ].join(" ")}
                                            onClick={() =>
                                                handleBreakdownSelection(label)
                                            }
                                        >
                                            <span className="min-w-0 wrap-break-word">
                                                {label}
                                            </span>
                                            <span className="shrink-0">
                                                {value.toFixed(2)}%
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : demographics !== null ? (
                            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-neutral-600">
                                {activeCategoryLabel} breakdown unavailable
                            </p>
                        ) : (
                            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-neutral-600">
                                No demographic results available
                            </p>
                        )}
                    </div>
                    <div className="mt-2 flex justify-center lg:col-start-2 lg:row-start-2">
                        <p className="text-center text-sm text-neutral-500">
                            If AI estimate is wrong, select the correct one
                        </p>
                    </div>
                    <div className="mt-2 flex justify-center gap-3 lg:col-start-3 lg:row-start-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="border border-neutral-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-700 transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                        >
                            {isConfirmed ? "Changes Saved" : "Confirm"}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
