(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/jobs/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>JobsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bookmark.mjs [app-client] (ecmascript) <export default as Bookmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookmarkCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bookmark-check.mjs [app-client] (ecmascript) <export default as BookmarkCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.mjs [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.mjs [app-client] (ecmascript) <export default as Filter>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function JobsPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-12 text-center text-slate-500",
            children: "Loading jobs..."
        }, void 0, false, {
            fileName: "[project]/src/app/jobs/page.tsx",
            lineNumber: 31,
            columnNumber: 25
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(JobsSearchContent, {}, void 0, false, {
            fileName: "[project]/src/app/jobs/page.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/jobs/page.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c = JobsPage;
function JobsSearchContent() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Search filter states
    const initialQuery = searchParams.get("query") || "";
    const initialLocation = searchParams.get("location") || "";
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialQuery);
    const [locationQuery, setLocationQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialLocation);
    const [workplaceTypes, setWorkplaceTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [jobTypes, setJobTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [experienceLevels, setExperienceLevels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [minSalary, setMinSalary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedSkill, setSelectedSkill] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("relevance");
    const [savedJobIds, setSavedJobIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set([
        "job-1",
        "job-4"
    ]));
    const [mobileFilterOpen, setMobileFilterOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const toggleSaveJob = (id, e)=>{
        e.preventDefault();
        e.stopPropagation();
        setSavedJobIds((prev)=>{
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };
    const toggleWorkplace = (type)=>{
        setWorkplaceTypes((prev)=>prev.includes(type) ? prev.filter((t)=>t !== type) : [
                ...prev,
                type
            ]);
    };
    const toggleJobType = (type)=>{
        setJobTypes((prev)=>prev.includes(type) ? prev.filter((t)=>t !== type) : [
                ...prev,
                type
            ]);
    };
    const toggleExperience = (level)=>{
        setExperienceLevels((prev)=>prev.includes(level) ? prev.filter((l)=>l !== level) : [
                ...prev,
                level
            ]);
    };
    const resetFilters = ()=>{
        setSearchQuery("");
        setLocationQuery("");
        setWorkplaceTypes([]);
        setJobTypes([]);
        setExperienceLevels([]);
        setMinSalary(0);
        setSelectedSkill("");
        router.push("/jobs");
    };
    // Filtered & Sorted jobs
    const filteredJobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "JobsSearchContent.useMemo[filteredJobs]": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_JOBS"].filter({
                "JobsSearchContent.useMemo[filteredJobs]": (job)=>{
                    // Keyword query
                    if (searchQuery) {
                        const q = searchQuery.toLowerCase();
                        const matchesTitle = job.title.toLowerCase().includes(q);
                        const matchesCompany = job.companyName.toLowerCase().includes(q);
                        const matchesSkills = job.skills.some({
                            "JobsSearchContent.useMemo[filteredJobs].matchesSkills": (s)=>s.toLowerCase().includes(q)
                        }["JobsSearchContent.useMemo[filteredJobs].matchesSkills"]);
                        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
                    }
                    // Location query
                    if (locationQuery) {
                        const loc = locationQuery.toLowerCase();
                        const matchesLoc = job.location.toLowerCase().includes(loc);
                        const matchesRemote = loc.includes("remote") && job.workplaceType === "remote";
                        if (!matchesLoc && !matchesRemote) return false;
                    }
                    // Workplace type
                    if (workplaceTypes.length > 0 && !workplaceTypes.includes(job.workplaceType)) {
                        return false;
                    }
                    // Job type
                    if (jobTypes.length > 0 && !jobTypes.includes(job.jobType)) {
                        return false;
                    }
                    // Experience level
                    if (experienceLevels.length > 0 && !experienceLevels.includes(job.experienceLevel)) {
                        return false;
                    }
                    // Min Salary
                    if (minSalary > 0 && job.salaryMax < minSalary) {
                        return false;
                    }
                    // Skill filter
                    if (selectedSkill && !job.skills.includes(selectedSkill)) {
                        return false;
                    }
                    return true;
                }
            }["JobsSearchContent.useMemo[filteredJobs]"]).sort({
                "JobsSearchContent.useMemo[filteredJobs]": (a, b)=>{
                    if (sortBy === "salary_high") return b.salaryMax - a.salaryMax;
                    if (sortBy === "newest") return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
                    if (sortBy === "best_match") return (b.matchScore || 0) - (a.matchScore || 0);
                    return 0; // relevance
                }
            }["JobsSearchContent.useMemo[filteredJobs]"]);
        }
    }["JobsSearchContent.useMemo[filteredJobs]"], [
        searchQuery,
        locationQuery,
        workplaceTypes,
        jobTypes,
        experienceLevels,
        minSalary,
        selectedSkill,
        sortBy
    ]);
    const allSkills = Array.from(new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_JOBS"].flatMap((j)=>j.skills)));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-slate-50 min-h-screen py-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1 w-full flex items-center pl-3 bg-slate-50 rounded-xl border border-slate-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "h-5 w-5 text-slate-400 shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 170,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        placeholder: "Title, keyword, skill, or company",
                                        className: "border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm py-2.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 171,
                                        columnNumber: 15
                                    }, this),
                                    searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSearchQuery(""),
                                        className: "p-1 mr-2 text-slate-400 hover:text-slate-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/jobs/page.tsx",
                                            lineNumber: 183,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 179,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/jobs/page.tsx",
                                lineNumber: 169,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1 w-full flex items-center pl-3 bg-slate-50 rounded-xl border border-slate-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                        className: "h-5 w-5 text-slate-400 shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        value: locationQuery,
                                        onChange: (e)=>setLocationQuery(e.target.value),
                                        placeholder: "Location (city, state, or 'Remote')",
                                        className: "border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm py-2.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 15
                                    }, this),
                                    locationQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setLocationQuery(""),
                                        className: "p-1 mr-2 text-slate-400 hover:text-slate-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/jobs/page.tsx",
                                            lineNumber: 202,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 198,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/jobs/page.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                onClick: ()=>setMobileFilterOpen(!mobileFilterOpen),
                                className: "md:hidden w-full flex items-center justify-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 212,
                                        columnNumber: 15
                                    }, this),
                                    "Filters (",
                                    workplaceTypes.length + jobTypes.length + experienceLevels.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/jobs/page.tsx",
                                lineNumber: 207,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/jobs/page.tsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/jobs/page.tsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-4 gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: `md:block ${mobileFilterOpen ? "block fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"} md:static md:z-auto md:p-0 md:bg-transparent`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between border-b border-slate-100 pb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-bold text-slate-900 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                        className: "h-4 w-4 text-blue-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/jobs/page.tsx",
                                                        lineNumber: 229,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Filters"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 228,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: resetFilters,
                                                        className: "text-xs font-semibold text-blue-600 hover:underline cursor-pointer",
                                                        children: "Reset All"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/jobs/page.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 19
                                                    }, this),
                                                    mobileFilterOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setMobileFilterOpen(false),
                                                        className: "md:hidden p-1",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            className: "h-5 w-5 text-slate-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                            lineNumber: 241,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/jobs/page.tsx",
                                                        lineNumber: 240,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 232,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 227,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-xs font-bold uppercase tracking-wider text-slate-700 mb-3",
                                                children: "Workplace Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 249,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    "remote",
                                                    "hybrid",
                                                    "on-site"
                                                ].map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer capitalize",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: workplaceTypes.includes(type),
                                                                onChange: ()=>toggleWorkplace(type),
                                                                className: "rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                                lineNumber: 258,
                                                                columnNumber: 23
                                                            }, this),
                                                            type
                                                        ]
                                                    }, type, true, {
                                                        fileName: "[project]/src/app/jobs/page.tsx",
                                                        lineNumber: 254,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 252,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 248,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-4 border-t border-slate-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-xs font-bold uppercase tracking-wider text-slate-700 mb-3",
                                                children: "Job Type"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    "full-time",
                                                    "part-time",
                                                    "contract",
                                                    "internship"
                                                ].map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer capitalize",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: jobTypes.includes(type),
                                                                onChange: ()=>toggleJobType(type),
                                                                className: "rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                                lineNumber: 281,
                                                                columnNumber: 23
                                                            }, this),
                                                            type.replace("-", " ")
                                                        ]
                                                    }, type, true, {
                                                        fileName: "[project]/src/app/jobs/page.tsx",
                                                        lineNumber: 277,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 271,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-4 border-t border-slate-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-xs font-bold uppercase tracking-wider text-slate-700 mb-3",
                                                children: "Experience Level"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 295,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    "entry",
                                                    "mid",
                                                    "senior",
                                                    "lead"
                                                ].map((lvl)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer capitalize",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: experienceLevels.includes(lvl),
                                                                onChange: ()=>toggleExperience(lvl),
                                                                className: "rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                                lineNumber: 304,
                                                                columnNumber: 23
                                                            }, this),
                                                            lvl,
                                                            " level"
                                                        ]
                                                    }, lvl, true, {
                                                        fileName: "[project]/src/app/jobs/page.tsx",
                                                        lineNumber: 300,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 298,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-4 border-t border-slate-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-xs font-bold uppercase tracking-wider text-slate-700",
                                                        children: "Min Salary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/jobs/page.tsx",
                                                        lineNumber: 319,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-blue-600",
                                                        children: minSalary > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(minSalary) : "Any"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/jobs/page.tsx",
                                                        lineNumber: 322,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 318,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "range",
                                                min: "0",
                                                max: "200000",
                                                step: "10000",
                                                value: minSalary,
                                                onChange: (e)=>setMinSalary(Number(e.target.value)),
                                                className: "w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 326,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-4 border-t border-slate-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-xs font-bold uppercase tracking-wider text-slate-700 mb-3",
                                                children: "Key Skills"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 339,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-1.5",
                                                children: allSkills.slice(0, 10).map((skill)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setSelectedSkill(selectedSkill === skill ? "" : skill),
                                                        className: `text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${selectedSkill === skill ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
                                                        children: skill
                                                    }, skill, false, {
                                                        fileName: "[project]/src/app/jobs/page.tsx",
                                                        lineNumber: 344,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                lineNumber: 342,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 338,
                                        columnNumber: 15
                                    }, this),
                                    mobileFilterOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: ()=>setMobileFilterOpen(false),
                                        className: "w-full md:hidden mt-4",
                                        children: "Apply Filters"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 360,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/jobs/page.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/jobs/page.tsx",
                            lineNumber: 221,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "md:col-span-3 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-5 py-3 rounded-xl border border-slate-200/90 shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-semibold text-slate-800",
                                            children: [
                                                "Showing ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-blue-600",
                                                    children: filteredJobs.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                    lineNumber: 372,
                                                    columnNumber: 25
                                                }, this),
                                                " available jobs"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/jobs/page.tsx",
                                            lineNumber: 371,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-500 font-medium",
                                                    children: "Sort by:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                    lineNumber: 376,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: sortBy,
                                                    onChange: (e)=>setSortBy(e.target.value),
                                                    className: "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "relevance",
                                                            children: "Most Relevant"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                            lineNumber: 382,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "newest",
                                                            children: "Recently Posted"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                            lineNumber: 383,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "salary_high",
                                                            children: "Highest Salary"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                            lineNumber: 384,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "best_match",
                                                            children: "Highest Match Score"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                            lineNumber: 385,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/jobs/page.tsx",
                                            lineNumber: 375,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/jobs/page.tsx",
                                    lineNumber: 370,
                                    columnNumber: 13
                                }, this),
                                filteredJobs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                            className: "h-12 w-12 text-slate-300 mx-auto"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/jobs/page.tsx",
                                            lineNumber: 393,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold text-slate-900",
                                            children: "No matching jobs found"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/jobs/page.tsx",
                                            lineNumber: 394,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-slate-500 max-w-sm mx-auto",
                                            children: "Try adjusting your keywords, broadening the location filter, or resetting your salary criteria."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/jobs/page.tsx",
                                            lineNumber: 395,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: resetFilters,
                                            variant: "outline",
                                            size: "sm",
                                            children: "Clear All Filters"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/jobs/page.tsx",
                                            lineNumber: 398,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/jobs/page.tsx",
                                    lineNumber: 392,
                                    columnNumber: 15
                                }, this) : filteredJobs.map((job)=>{
                                    const isSaved = savedJobIds.has(job.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "card-hover border-slate-200/90 hover:border-blue-400/80 transition-all shadow-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col sm:flex-row items-start justify-between gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: job.companyLogo,
                                                                    alt: job.companyName,
                                                                    className: "h-12 w-12 rounded-xl object-cover border border-slate-200 shrink-0 mt-0.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                    lineNumber: 413,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2.5 flex-wrap",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: `/jobs/${job.slug}`,
                                                                                    className: "font-bold text-lg text-slate-900 hover:text-blue-600 transition-colors",
                                                                                    children: job.title
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                                    lineNumber: 420,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                job.matchScore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                    variant: "purple",
                                                                                    className: "gap-1 font-semibold text-[11px]",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                                            className: "h-3 w-3"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                                                            lineNumber: 428,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        job.matchScore,
                                                                                        "% Match"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                                    lineNumber: 427,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                                            lineNumber: 419,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-semibold text-slate-600 mt-1",
                                                                            children: [
                                                                                job.companyName,
                                                                                " •",
                                                                                " ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-slate-500 font-normal",
                                                                                    children: job.location
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                                    lineNumber: 436,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                                            lineNumber: 434,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed",
                                                                            children: job.description
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                                            lineNumber: 439,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-4 flex flex-wrap gap-1.5",
                                                                            children: job.skills.map((skill)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium",
                                                                                    children: skill
                                                                                }, skill, false, {
                                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                                    lineNumber: 445,
                                                                                    columnNumber: 33
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                                            lineNumber: 443,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                    lineNumber: 418,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                            lineNumber: 412,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>toggleSaveJob(job.id, e),
                                                            title: isSaved ? "Saved" : "Save Job",
                                                            className: `p-2 rounded-xl border transition-all cursor-pointer ${isSaved ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300"}`,
                                                            children: isSaved ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookmarkCheck$3e$__["BookmarkCheck"], {
                                                                className: "h-5 w-5 fill-blue-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                                lineNumber: 467,
                                                                columnNumber: 29
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"], {
                                                                className: "h-5 w-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                                lineNumber: 469,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                            lineNumber: 457,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                    lineNumber: 411,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-4 font-semibold text-slate-700",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm text-emerald-700",
                                                                    children: [
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(job.salaryMin),
                                                                        " - ",
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(job.salaryMax)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                    lineNumber: 476,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "•"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                    lineNumber: 479,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "capitalize",
                                                                    children: job.workplaceType
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                    lineNumber: 480,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "•"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                    lineNumber: 481,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "capitalize",
                                                                    children: job.jobType
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                    lineNumber: 482,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                            lineNumber: 475,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-400",
                                                                    children: [
                                                                        "Posted ",
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRelativeTime"])(job.postedAt)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                    lineNumber: 486,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: `/jobs/${job.slug}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        size: "sm",
                                                                        className: "font-semibold gap-1 text-xs",
                                                                        children: [
                                                                            "Apply Now ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                                className: "h-3.5 w-3.5"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/jobs/page.tsx",
                                                                                lineNumber: 491,
                                                                                columnNumber: 41
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/jobs/page.tsx",
                                                                        lineNumber: 490,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                                    lineNumber: 489,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/jobs/page.tsx",
                                                            lineNumber: 485,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/jobs/page.tsx",
                                                    lineNumber: 474,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/jobs/page.tsx",
                                            lineNumber: 410,
                                            columnNumber: 21
                                        }, this)
                                    }, job.id, false, {
                                        fileName: "[project]/src/app/jobs/page.tsx",
                                        lineNumber: 406,
                                        columnNumber: 19
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/jobs/page.tsx",
                            lineNumber: 368,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/jobs/page.tsx",
                    lineNumber: 219,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/jobs/page.tsx",
            lineNumber: 165,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/jobs/page.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
}
_s(JobsSearchContent, "zKTWWL1TwZQPmvr3fHO0QlqJ8pY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = JobsSearchContent;
var _c, _c1;
__turbopack_context__.k.register(_c, "JobsPage");
__turbopack_context__.k.register(_c1, "JobsSearchContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-blue-100 text-blue-800",
            secondary: "border-transparent bg-slate-100 text-slate-800",
            destructive: "border-transparent bg-red-100 text-red-800",
            outline: "text-slate-700 border border-slate-200",
            success: "border-transparent bg-emerald-100 text-emerald-800",
            warning: "border-transparent bg-amber-100 text-amber-800",
            purple: "border-transparent bg-purple-100 text-purple-800"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xl font-bold leading-tight tracking-tight text-slate-900", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-slate-500", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 transition-colors", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 9,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/mock-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_APPLICATIONS",
    ()=>MOCK_APPLICATIONS,
    "MOCK_ASSESSMENTS",
    ()=>MOCK_ASSESSMENTS,
    "MOCK_CANDIDATE_PROFILE",
    ()=>MOCK_CANDIDATE_PROFILE,
    "MOCK_COMPANIES",
    ()=>MOCK_COMPANIES,
    "MOCK_DASHBOARD_METRICS",
    ()=>MOCK_DASHBOARD_METRICS,
    "MOCK_INTERVIEWS",
    ()=>MOCK_INTERVIEWS,
    "MOCK_JOBS",
    ()=>MOCK_JOBS,
    "MOCK_JOB_ALERTS",
    ()=>MOCK_JOB_ALERTS,
    "MOCK_OFFERS",
    ()=>MOCK_OFFERS,
    "MOCK_RESUMES",
    ()=>MOCK_RESUMES
]);
const MOCK_COMPANIES = [
    {
        id: "comp-1",
        name: "NexusAI Technologies",
        slug: "nexusai",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
        website: "https://nexusai.example.com",
        industry: "Artificial Intelligence & Enterprise SaaS",
        size: "250-500 employees",
        location: "San Francisco, CA (Hybrid)",
        description: "NexusAI builds autonomous enterprise workflows powered by generative AI models, helping Fortune 500 companies streamline operations.",
        culture: [
            "Remote-first flexibility",
            "High engineering rigor",
            "Continuous learning allowance"
        ],
        benefits: [
            "Unlimited PTO",
            "Comprehensive Health & Dental",
            "$2,000 Annual Learning Stipend",
            "Home Office Setup"
        ],
        rating: 4.8,
        openJobsCount: 14
    },
    {
        id: "comp-2",
        name: "CloudScale Systems",
        slug: "cloudscale",
        logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80",
        website: "https://cloudscale.example.com",
        industry: "Cloud Infrastructure & DevOps",
        size: "500-1000 employees",
        location: "New York, NY (Remote)",
        description: "CloudScale is the next-generation distributed telemetry and Kubernetes orchestration platform for high-scale microservices.",
        culture: [
            "Open source contributors",
            "Transparent compensation",
            "Collaborative problem solving"
        ],
        benefits: [
            "401(k) 6% Match",
            "Full Medical Coverage",
            "Wellness Reimbursement",
            "Equity Grants"
        ],
        rating: 4.7,
        openJobsCount: 8
    },
    {
        id: "comp-3",
        name: "FinEdge Global",
        slug: "finedge",
        logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80",
        website: "https://finedge.example.com",
        industry: "Fintech & Digital Payments",
        size: "1000+ employees",
        location: "Boston, MA (On-site)",
        description: "Pioneering real-time cross-border payment settlements and algorithmic treasury solutions for modern global commerce.",
        culture: [
            "Innovation-focused",
            "Customer obsession",
            "High compliance & security standards"
        ],
        benefits: [
            "Competitive Bonus Structure",
            "Parental Leave (16 weeks)",
            "Transit Subsidies"
        ],
        rating: 4.6,
        openJobsCount: 22
    },
    {
        id: "comp-4",
        name: "HealthBridge Labs",
        slug: "healthbridge",
        logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80",
        website: "https://healthbridge.example.com",
        industry: "Digital Healthcare & Telemedicine",
        size: "100-250 employees",
        location: "Austin, TX (Hybrid)",
        description: "Transforming patient care with secure, compliant remote health monitoring and AI diagnostics.",
        culture: [
            "Mission-driven",
            "Empathy-led design",
            "Diverse and inclusive teams"
        ],
        benefits: [
            "Full Medical & Vision",
            "Gym Memberships",
            "Flexible Fridays"
        ],
        rating: 4.9,
        openJobsCount: 6
    }
];
const MOCK_JOBS = [
    {
        id: "job-1",
        slug: "senior-frontend-engineer-react-nextjs",
        title: "Senior Frontend Engineer (React / Next.js)",
        companyId: "comp-1",
        companyName: "NexusAI Technologies",
        companyLogo: MOCK_COMPANIES[0].logo,
        department: "Engineering",
        location: "San Francisco, CA",
        workplaceType: "remote",
        jobType: "full-time",
        experienceLevel: "senior",
        salaryMin: 140000,
        salaryMax: 175000,
        salaryCurrency: "USD",
        description: "We are looking for a Senior Frontend Engineer to lead the architecture of our real-time AI workflow dashboard. You will build high-performance canvas interfaces, optimize rendering pipelines, and craft state-of-the-art developer tooling using Next.js, React 19, and Tailwind CSS.",
        responsibilities: [
            "Architect and implement responsive, accessible, and performant web applications using Next.js App Router.",
            "Work closely with product designers and backend engineers to define API contracts and interactive UX.",
            "Profile and optimize client-side bundle sizes and rendering performance.",
            "Mentor mid-level engineers and drive frontend engineering best practices."
        ],
        requirements: [
            "5+ years of production experience in React, TypeScript, and modern CSS frameworks.",
            "Deep understanding of Next.js App Router, SSR, and client caching mechanisms.",
            "Demonstrated experience building complex stateful UIs (TanStack Query, state machines, canvas/drag-and-drop).",
            "Strong track record of accessibility (WCAG 2.1 AA) and cross-browser reliability."
        ],
        skills: [
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "TanStack Query",
            "REST / GraphQL"
        ],
        benefits: [
            "Equity options",
            "$2,000 learning budget",
            "Health & Dental",
            "Flexible working hours"
        ],
        postedAt: "2026-10-18T10:00:00Z",
        status: "open",
        applicantsCount: 38,
        matchScore: 94,
        isSaved: true
    },
    {
        id: "job-2",
        slug: "lead-backend-engineer-distributed-systems",
        title: "Lead Backend Engineer (Go / Distributed Systems)",
        companyId: "comp-2",
        companyName: "CloudScale Systems",
        companyLogo: MOCK_COMPANIES[1].logo,
        department: "Infrastructure",
        location: "New York, NY",
        workplaceType: "remote",
        jobType: "full-time",
        experienceLevel: "lead",
        salaryMin: 170000,
        salaryMax: 210000,
        salaryCurrency: "USD",
        description: "Join CloudScale to architect high-throughput event streaming engines handling tens of billions of metric events daily. We value concurrency mastery, distributed consensus protocols, and clean API design.",
        responsibilities: [
            "Lead the design of distributed telemetry ingestion services using Go and Apache Kafka.",
            "Ensure five-nines service availability and low-latency P99 SLA guarantees.",
            "Collaborate with security and SRE teams on zero-trust cloud architectures."
        ],
        requirements: [
            "7+ years software engineering experience with strong Go or Rust background.",
            "Hands-on expertise with Kafka, PostgreSQL, Redis, and Kubernetes.",
            "Experience leading architectural design reviews and cross-functional teams."
        ],
        skills: [
            "Go",
            "Kafka",
            "Kubernetes",
            "PostgreSQL",
            "Distributed Systems",
            "gRPC"
        ],
        benefits: [
            "Top-tier compensation",
            "401k 6% match",
            "Full health insurance",
            "Equity"
        ],
        postedAt: "2026-10-20T14:30:00Z",
        status: "open",
        applicantsCount: 24,
        matchScore: 78,
        isSaved: false
    },
    {
        id: "job-3",
        slug: "senior-product-designer-design-systems",
        title: "Senior Product Designer (Design Systems)",
        companyId: "comp-3",
        companyName: "FinEdge Global",
        companyLogo: MOCK_COMPANIES[2].logo,
        department: "Design",
        location: "Boston, MA",
        workplaceType: "hybrid",
        jobType: "full-time",
        experienceLevel: "senior",
        salaryMin: 130000,
        salaryMax: 160000,
        salaryCurrency: "USD",
        description: "Shape the visual and interaction foundations of FinEdge's treasury products. You will own the cross-platform design system, collaborate with frontend engineers, and design seamless payment experiences.",
        responsibilities: [
            "Maintain and evolve our Figma component library and token specifications.",
            "Conduct user research, prototype interactions, and validate usability.",
            "Partner with developers to ensure pixel-perfect, accessible component delivery."
        ],
        requirements: [
            "4+ years of UI/UX product design experience in B2B SaaS or Fintech.",
            "Expertise in Figma, design tokens, auto-layout, and prototyping tools.",
            "Deep understanding of design system governance and accessibility standards."
        ],
        skills: [
            "Figma",
            "Design Systems",
            "User Research",
            "Prototyping",
            "Accessibility"
        ],
        benefits: [
            "Annual performance bonus",
            "16 weeks parental leave",
            "Health/Dental/Vision"
        ],
        postedAt: "2026-10-22T08:15:00Z",
        status: "open",
        applicantsCount: 45,
        matchScore: 82,
        isSaved: false
    },
    {
        id: "job-4",
        slug: "devops-site-reliability-engineer",
        title: "DevOps & Site Reliability Engineer",
        companyId: "comp-4",
        companyName: "HealthBridge Labs",
        companyLogo: MOCK_COMPANIES[3].logo,
        department: "Platform Engineering",
        location: "Austin, TX",
        workplaceType: "hybrid",
        jobType: "full-time",
        experienceLevel: "mid",
        salaryMin: 115000,
        salaryMax: 145000,
        salaryCurrency: "USD",
        description: "Ensure HIPAA-compliant cloud resilience, continuous deployment automation, and proactive monitoring across our multi-cloud telehealth infrastructure.",
        responsibilities: [
            "Automate infrastructure provisioning using Terraform and AWS CloudFormation.",
            "Manage CI/CD deployment pipelines with GitHub Actions and ArgoCD.",
            "Establish automated alerting, error budgets, and incident post-mortems."
        ],
        requirements: [
            "3+ years managing production AWS/GCP cloud environments.",
            "Solid understanding of Docker, Kubernetes, Terraform, and Prometheus.",
            "Experience with healthcare or strict compliance standards is a plus."
        ],
        skills: [
            "AWS",
            "Terraform",
            "Kubernetes",
            "Docker",
            "CI/CD",
            "Prometheus"
        ],
        benefits: [
            "Comprehensive medical",
            "Gym stipend",
            "Flexible work hours"
        ],
        postedAt: "2026-10-23T11:45:00Z",
        status: "open",
        applicantsCount: 19,
        matchScore: 68,
        isSaved: true
    },
    {
        id: "job-5",
        slug: "machine-learning-engineer-nlp",
        title: "Machine Learning Engineer (NLP / LLMs)",
        companyId: "comp-1",
        companyName: "NexusAI Technologies",
        companyLogo: MOCK_COMPANIES[0].logo,
        department: "AI Research",
        location: "San Francisco, CA",
        workplaceType: "remote",
        jobType: "full-time",
        experienceLevel: "senior",
        salaryMin: 165000,
        salaryMax: 205000,
        salaryCurrency: "USD",
        description: "Develop domain-adapted language models, fine-tuning pipelines, and RAG architectures that power automated candidate resume screening and semantic matching.",
        responsibilities: [
            "Train, fine-tune, and evaluate embedding models and LLM agents.",
            "Deploy low-latency inference endpoints with vLLM, TensorRT-LLM, and Triton.",
            "Collaborate with backend teams to integrate vector search and retrieval."
        ],
        requirements: [
            "MS or BS in Computer Science, Machine Learning, or related field.",
            "Proficiency in PyTorch, Hugging Face, LangChain/LlamaIndex, and Python.",
            "Experience with vector databases (pgvector, Milvus, Qdrant)."
        ],
        skills: [
            "Python",
            "PyTorch",
            "LLMs",
            "Vector DBs",
            "Docker",
            "FastAPI"
        ],
        benefits: [
            "Equity grant",
            "Conference travel stipend",
            "Top-tier healthcare"
        ],
        postedAt: "2026-10-24T09:00:00Z",
        status: "open",
        applicantsCount: 52,
        matchScore: 88,
        isSaved: false
    },
    {
        id: "job-6",
        slug: "junior-full-stack-developer",
        title: "Junior Full Stack Developer",
        companyId: "comp-2",
        companyName: "CloudScale Systems",
        companyLogo: MOCK_COMPANIES[1].logo,
        department: "Engineering",
        location: "Chicago, IL",
        workplaceType: "on-site",
        jobType: "full-time",
        experienceLevel: "entry",
        salaryMin: 80000,
        salaryMax: 95000,
        salaryCurrency: "USD",
        description: "An exciting opportunity for a motivated junior developer to work with modern TypeScript, React, and Node.js on internal telemetry tooling and customer portal features.",
        responsibilities: [
            "Build and test new UI components with React and TypeScript.",
            "Assist in writing backend REST endpoints and Prisma database queries.",
            "Participate in code reviews and agile sprint planning."
        ],
        requirements: [
            "1+ year of project experience in TypeScript, React, and Node.js.",
            "Solid knowledge of relational databases and Git version control.",
            "Strong communication and eagerness to learn modern web architecture."
        ],
        skills: [
            "TypeScript",
            "React",
            "Node.js",
            "PostgreSQL",
            "Git"
        ],
        benefits: [
            "Mentorship program",
            "Health insurance",
            "Annual tech stipend"
        ],
        postedAt: "2026-10-24T12:00:00Z",
        status: "open",
        applicantsCount: 64,
        matchScore: 91,
        isSaved: false
    }
];
const MOCK_CANDIDATE_PROFILE = {
    id: "cand-1",
    userId: "user-cand-1",
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    headline: "Senior Frontend Engineer | React, Next.js & TypeScript Specialist",
    bio: "Passionate frontend engineer with 6+ years of experience crafting accessible, scalable, and delightful web applications. Obsessed with web performance, clean architecture, and modern design systems.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    completenessPercentage: 88,
    skills: [
        {
            name: "React",
            level: "Expert",
            yearsOfExperience: 6
        },
        {
            name: "TypeScript",
            level: "Expert",
            yearsOfExperience: 5
        },
        {
            name: "Next.js",
            level: "Advanced",
            yearsOfExperience: 4
        },
        {
            name: "Tailwind CSS",
            level: "Expert",
            yearsOfExperience: 4
        },
        {
            name: "TanStack Query",
            level: "Advanced",
            yearsOfExperience: 3
        },
        {
            name: "GraphQL",
            level: "Intermediate",
            yearsOfExperience: 3
        },
        {
            name: "Jest / Vitest",
            level: "Advanced",
            yearsOfExperience: 4
        }
    ],
    experiences: [
        {
            id: "exp-1",
            title: "Senior Frontend Developer",
            company: "Vanguard Tech",
            location: "San Francisco, CA",
            startDate: "2023-01-01",
            current: true,
            description: "Spearheaded the migration of legacy client portals to Next.js App Router, resulting in a 42% decrease in Largest Contentful Paint (LCP) and 30% higher user retention."
        },
        {
            id: "exp-2",
            title: "Frontend Engineer",
            company: "Aether Labs",
            location: "Austin, TX",
            startDate: "2020-06-01",
            endDate: "2022-12-31",
            current: false,
            description: "Built interactive data visualization components with D3 and React. Maintained shared UI component libraries used across 5 distinct web products."
        }
    ],
    educations: [
        {
            id: "edu-1",
            degree: "B.S. in Computer Science",
            institution: "University of California, Berkeley",
            fieldOfStudy: "Software Engineering & Computer Systems",
            startDate: "2016-09-01",
            endDate: "2020-05-15"
        }
    ],
    preferences: {
        desiredRoles: [
            "Senior Frontend Engineer",
            "Staff Frontend Engineer",
            "UI Architect"
        ],
        desiredLocations: [
            "San Francisco, CA",
            "Remote"
        ],
        workplaceType: [
            "remote",
            "hybrid"
        ],
        salaryFloor: 140000,
        noticePeriodWeeks: 2
    }
};
const MOCK_RESUMES = [
    {
        id: "res-1",
        fileName: "Alex_Rivera_Senior_Frontend_2026.pdf",
        fileSize: "184 KB",
        uploadedAt: "2026-10-15T09:30:00Z",
        isDefault: true,
        parsedData: {
            skillsDetected: [
                "React",
                "TypeScript",
                "Next.js",
                "Tailwind CSS",
                "GraphQL",
                "Jest"
            ],
            experienceSummary: "6 years as Senior/Frontend Engineer leading Next.js migrations and performance optimization.",
            educationSummary: "B.S. Computer Science from UC Berkeley"
        }
    },
    {
        id: "res-2",
        fileName: "Alex_Rivera_FullStack_Resume.pdf",
        fileSize: "210 KB",
        uploadedAt: "2026-09-10T14:15:00Z",
        isDefault: false,
        parsedData: {
            skillsDetected: [
                "React",
                "Node.js",
                "TypeScript",
                "PostgreSQL",
                "Docker"
            ],
            experienceSummary: "Full stack engineering portfolio with React and Node.js microservices.",
            educationSummary: "B.S. Computer Science from UC Berkeley"
        }
    }
];
const MOCK_APPLICATIONS = [
    {
        id: "app-1",
        jobId: "job-1",
        jobTitle: "Senior Frontend Engineer (React / Next.js)",
        companyId: "comp-1",
        companyName: "NexusAI Technologies",
        companyLogo: MOCK_COMPANIES[0].logo,
        candidateId: "cand-1",
        candidateName: "Alex Rivera",
        candidateEmail: "alex.rivera@example.com",
        candidateAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        candidateHeadline: "Senior Frontend Engineer | React, Next.js & TypeScript Specialist",
        stage: "interview",
        appliedAt: "2026-10-19T11:20:00Z",
        updatedAt: "2026-10-23T15:00:00Z",
        matchScore: 94,
        matchReasons: {
            matchedSkills: [
                "React",
                "TypeScript",
                "Next.js",
                "Tailwind CSS"
            ],
            missingSkills: [
                "Canvas WebGL"
            ],
            experienceFit: "Exceeds 5-year requirement with top-tier Next.js App Router background."
        },
        rating: 5,
        recruiterNotes: [
            {
                id: "note-1",
                author: "Sarah Jenkins (Lead Recruiter)",
                content: "Outstanding technical screen! Alex articulated deep knowledge of React 19 compiler internals and server actions.",
                createdAt: "2026-10-22T16:00:00Z"
            }
        ]
    },
    {
        id: "app-2",
        jobId: "job-2",
        jobTitle: "Lead Backend Engineer (Go / Distributed Systems)",
        companyId: "comp-2",
        companyName: "CloudScale Systems",
        companyLogo: MOCK_COMPANIES[1].logo,
        candidateId: "cand-2",
        candidateName: "David Chen",
        candidateEmail: "david.chen@example.com",
        candidateAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        candidateHeadline: "Staff Systems Engineer | Distributed Systems & Kafka Expert",
        stage: "assessment",
        appliedAt: "2026-10-21T09:40:00Z",
        updatedAt: "2026-10-23T10:15:00Z",
        matchScore: 91,
        rating: 4,
        recruiterNotes: [
            {
                id: "note-2",
                author: "Marcus Vance (Engineering Manager)",
                content: "Passed initial technical screening. Waiting on distributed system take-home assignment.",
                createdAt: "2026-10-22T11:30:00Z"
            }
        ]
    },
    {
        id: "app-3",
        jobId: "job-1",
        jobTitle: "Senior Frontend Engineer (React / Next.js)",
        companyId: "comp-1",
        companyName: "NexusAI Technologies",
        companyLogo: MOCK_COMPANIES[0].logo,
        candidateId: "cand-3",
        candidateName: "Sophia Martinez",
        candidateEmail: "sophia.m@example.com",
        candidateAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        candidateHeadline: "Frontend Architect | Design Systems & Web Performance",
        stage: "applied",
        appliedAt: "2026-10-24T08:10:00Z",
        updatedAt: "2026-10-24T08:10:00Z",
        matchScore: 89,
        rating: 4
    },
    {
        id: "app-4",
        jobId: "job-1",
        jobTitle: "Senior Frontend Engineer (React / Next.js)",
        companyId: "comp-1",
        companyName: "NexusAI Technologies",
        companyLogo: MOCK_COMPANIES[0].logo,
        candidateId: "cand-4",
        candidateName: "Liam Johnson",
        candidateEmail: "liam.j@example.com",
        candidateAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        candidateHeadline: "Full Stack Developer (React & Node.js)",
        stage: "screening",
        appliedAt: "2026-10-23T14:00:00Z",
        updatedAt: "2026-10-24T09:30:00Z",
        matchScore: 76,
        rating: 3
    },
    {
        id: "app-5",
        jobId: "job-1",
        jobTitle: "Senior Frontend Engineer (React / Next.js)",
        companyId: "comp-1",
        companyName: "NexusAI Technologies",
        companyLogo: MOCK_COMPANIES[0].logo,
        candidateId: "cand-5",
        candidateName: "Elena Rostova",
        candidateEmail: "elena.r@example.com",
        candidateAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
        candidateHeadline: "Lead UI Engineer & Design Technologist",
        stage: "offer",
        appliedAt: "2026-10-14T10:00:00Z",
        updatedAt: "2026-10-24T12:00:00Z",
        matchScore: 96,
        rating: 5
    },
    {
        id: "app-6",
        jobId: "job-1",
        jobTitle: "Senior Frontend Engineer (React / Next.js)",
        companyId: "comp-1",
        companyName: "NexusAI Technologies",
        companyLogo: MOCK_COMPANIES[0].logo,
        candidateId: "cand-6",
        candidateName: "Kevin Patel",
        candidateEmail: "kevin.p@example.com",
        candidateAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
        candidateHeadline: "Software Engineer | TypeScript & Cloud",
        stage: "hired",
        appliedAt: "2026-10-08T09:00:00Z",
        updatedAt: "2026-10-22T16:00:00Z",
        matchScore: 92,
        rating: 5
    },
    {
        id: "app-7",
        jobId: "job-1",
        jobTitle: "Senior Frontend Engineer (React / Next.js)",
        companyId: "comp-1",
        companyName: "NexusAI Technologies",
        companyLogo: MOCK_COMPANIES[0].logo,
        candidateId: "cand-7",
        candidateName: "Brian Miller",
        candidateEmail: "brian.m@example.com",
        candidateAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
        candidateHeadline: "Web Developer",
        stage: "rejected",
        appliedAt: "2026-10-18T16:00:00Z",
        updatedAt: "2026-10-20T11:00:00Z",
        matchScore: 55,
        rating: 2
    }
];
const MOCK_INTERVIEWS = [
    {
        id: "int-1",
        applicationId: "app-1",
        jobTitle: "Senior Frontend Engineer (React / Next.js)",
        candidateName: "Alex Rivera",
        companyName: "NexusAI Technologies",
        interviewerName: "Dr. Aris Vance (Principal Architect)",
        interviewType: "Technical",
        scheduledAt: "2026-10-26T17:00:00Z",
        durationMinutes: 60,
        meetingLink: "https://meet.talentbridge.io/room/int-1-nexusai",
        status: "scheduled"
    },
    {
        id: "int-2",
        applicationId: "app-2",
        jobTitle: "Lead Backend Engineer (Go)",
        candidateName: "David Chen",
        companyName: "CloudScale Systems",
        interviewerName: "Marcus Vance",
        interviewType: "Cultural Fit",
        scheduledAt: "2026-10-27T19:00:00Z",
        durationMinutes: 45,
        meetingLink: "https://meet.talentbridge.io/room/int-2-cloudscale",
        status: "scheduled"
    }
];
const MOCK_ASSESSMENTS = [
    {
        id: "asm-1",
        title: "Advanced TypeScript & React 19 State Architecture",
        jobTitle: "Senior Frontend Engineer",
        durationMinutes: 45,
        dueDate: "2026-10-27T23:59:59Z",
        status: "pending",
        totalQuestions: 15
    },
    {
        id: "asm-2",
        title: "Web Performance Profiling & Core Web Vitals Challenge",
        jobTitle: "Senior Frontend Engineer",
        durationMinutes: 30,
        dueDate: "2026-10-25T18:00:00Z",
        status: "completed",
        score: 96,
        totalQuestions: 10
    }
];
const MOCK_OFFERS = [
    {
        id: "ofr-1",
        jobTitle: "Senior Frontend Engineer",
        companyName: "NexusAI Technologies",
        compensation: "$168,000 / year + 0.15% Equity Options",
        startDate: "2026-11-16",
        deadline: "2026-10-30",
        status: "pending",
        letterUrl: "/sample-offer-letter.pdf"
    }
];
const MOCK_JOB_ALERTS = [
    {
        id: "alert-1",
        title: "Remote Next.js Senior Roles",
        query: "Next.js React Senior",
        location: "Remote",
        frequency: "daily",
        isActive: true,
        createdAt: "2026-10-12T08:00:00Z"
    },
    {
        id: "alert-2",
        title: "Staff UI / Design Systems Engineer",
        query: "Design Systems Staff",
        location: "San Francisco, CA",
        frequency: "weekly",
        isActive: true,
        createdAt: "2026-10-18T10:00:00Z"
    }
];
const MOCK_DASHBOARD_METRICS = {
    openJobs: 12,
    totalApplicants: 247,
    interviewsToday: 4,
    pendingOffers: 3,
    timeToHireDays: 18,
    funnelData: [
        {
            stage: "Applied",
            count: 247,
            color: "#3b82f6"
        },
        {
            stage: "Screening",
            count: 114,
            color: "#6366f1"
        },
        {
            stage: "Interview",
            count: 52,
            color: "#8b5cf6"
        },
        {
            stage: "Assessment",
            count: 28,
            color: "#a855f7"
        },
        {
            stage: "Offer",
            count: 8,
            color: "#10b981"
        },
        {
            stage: "Hired",
            count: 5,
            color: "#059669"
        }
    ]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=src_014to5a2ymngl._.js.map