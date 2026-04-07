"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Star,
  Crosshair,
  Layers,
  Maximize2,
  Minus,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { gradingDemoResults } from "@/lib/mock-data";
import { cn, scoreToGrade } from "@/lib/utils";
import type { GradingResult } from "@/lib/types";

// ─── Score Bar ─────────────────────────────────────────────────────────────────

function ScoreBar({
  label,
  score,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  score: number;
  icon: React.ElementType;
  delay?: number;
}) {
  const pct = (score / 10) * 100;
  const color =
    score >= 9 ? "#10b981" : score >= 7.5 ? "#D4A017" : "#ef4444";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Icon className="h-3.5 w-3.5" />
          <span className="font-medium">{label}</span>
        </div>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}90, ${color})`,
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── Grade Display ─────────────────────────────────────────────────────────────

function GradeDisplay({
  min,
  max,
}: {
  min: number;
  max: number;
}) {
  const avg = (min + max) / 2;
  const color =
    avg >= 9 ? "#10b981" : avg >= 7 ? "#D4A017" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative flex h-20 w-20 items-center justify-center rounded-full border-2"
        style={{
          borderColor: `${color}40`,
          background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
          boxShadow: `0 0 24px ${color}20`,
        }}
      >
        <div className="text-center">
          <div
            className="font-display text-2xl font-black leading-none"
            style={{ color }}
          >
            {min === max ? max : `${min}–${max}`}
          </div>
          <div className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">
            PSA Est.
          </div>
        </div>
      </div>
      <span className="text-[11px] font-semibold text-white/50">
        {scoreToGrade(avg)}
      </span>
    </div>
  );
}

// ─── Recommendation Badge ──────────────────────────────────────────────────────

function RecommendationBadge({
  rec,
}: {
  rec: GradingResult["recommendation"];
}) {
  const configs = {
    "Send to PSA": {
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/25",
      desc: "This card is a strong grading candidate.",
    },
    "Review Again": {
      icon: AlertCircle,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/25",
      desc: "Rescan in better lighting before submission.",
    },
    "Good Raw Condition": {
      icon: Star,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/25",
      desc: "Strong raw card. Grade may not add premium.",
    },
  };

  const { icon: Icon, color, bg, desc } = configs[rec];

  return (
    <div className={cn("flex items-start gap-3 rounded-xl border p-3.5", bg)}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
      <div>
        <p className={cn("text-xs font-bold", color)}>{rec}</p>
        <p className="mt-0.5 text-[11px] text-white/40">{desc}</p>
      </div>
    </div>
  );
}

// ─── Result Panel ──────────────────────────────────────────────────────────────

function GradingResultPanel({
  result,
  imageUrl,
  fileName,
  onReset,
}: {
  result: GradingResult;
  imageUrl: string | null;
  fileName: string;
  onReset: () => void;
}) {
  const { scores, estimatedGradeMin, estimatedGradeMax, recommendation, notes, processingMs, psaSubmitEstimate } = result;
  const avgScore = (scores.centering + scores.corners + scores.edges + scores.surface) / 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-5"
    >
      {imageUrl && (
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a12]">
          <div className="relative h-40 w-full sm:h-44">
            <img
              src={imageUrl}
              alt={fileName || "Your card"}
              className="h-full w-full object-contain object-center"
            />
          </div>
          {fileName ? (
            <p className="truncate border-t border-white/[0.06] px-3 py-1.5 text-center text-[10px] text-white/40">
              {fileName}
            </p>
          ) : null}
        </div>
      )}
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="text-sm font-bold text-white">AI Grade Report</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/25">
          <Cpu className="h-3 w-3" />
          <span>{(processingMs / 1000).toFixed(2)}s</span>
        </div>
      </div>

      {/* Grade + scores */}
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <GradeDisplay min={estimatedGradeMin} max={estimatedGradeMax} />
        <div className="flex w-full flex-1 flex-col gap-3">
          <ScoreBar label="Centering" score={scores.centering} icon={Crosshair} delay={0} />
          <ScoreBar label="Corners" score={scores.corners} icon={Maximize2} delay={0.1} />
          <ScoreBar label="Edges" score={scores.edges} icon={Minus} delay={0.2} />
          <ScoreBar label="Surface" score={scores.surface} icon={Layers} delay={0.3} />
        </div>
      </div>

      {/* Overall average */}
      <div className="flex flex-col gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <span className="text-[11px] text-white/40">Overall Average Score</span>
        <span className="font-mono text-sm font-bold text-white tabular-nums">
          {avgScore.toFixed(2)} / 10.0
        </span>
      </div>

      {/* Recommendation */}
      <RecommendationBadge rec={recommendation} />

      {/* Notes */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
        <p className="text-[11px] leading-relaxed text-white/45">
          <span className="font-semibold text-white/60">Notes: </span>
          {notes}
        </p>
      </div>

      {/* PSA cost estimate */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-white/30">Estimated PSA cost</span>
        <span className="font-semibold text-white/60">{psaSubmitEstimate}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-medium text-white/50 transition-all hover:border-white/20 hover:text-white/70 sm:min-h-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Analyze Another
        </button>
        {recommendation === "Send to PSA" && (
          <button
            type="button"
            className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-gold/25 bg-gold/10 py-2.5 text-xs font-semibold text-gold transition-all hover:bg-gold/15 sm:min-h-0"
          >
            <ChevronRight className="h-3.5 w-3.5" />
            Submit to PSA
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function GradingAssistant() {
  const [phase, setPhase] = useState<"idle" | "analyzing" | "result">("idle");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState("");
  const [gradingFileName, setGradingFileName] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const demoIndex = useRef(0);
  const previewUrlRef = useRef<string | null>(null);

  const setPreviewFromFile = useCallback((file: File) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, []);

  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setImagePreviewUrl(null);
    setGradingFileName("");
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const STEPS = [
    { label: "Loading card image…", progress: 20 },
    { label: "Detecting card boundaries…", progress: 42 },
    { label: "Measuring centering offset…", progress: 58 },
    { label: "Analyzing corner sharpness…", progress: 72 },
    { label: "Scanning edge wear…", progress: 85 },
    { label: "Assessing surface gloss…", progress: 95 },
  ];

  const runAnalysis = (file: File | null) => {
    if (phase !== "idle") return;
    if (!file) return;
    setGradingFileName(file.name || "");
    setPreviewFromFile(file);
    setPhase("analyzing");
    setProgress(0);

    let stepIdx = 0;
    function nextStep() {
      if (stepIdx >= STEPS.length) {
        setProgress(100);
        setStepLabel("Analysis complete");
        const r = gradingDemoResults[demoIndex.current % gradingDemoResults.length];
        demoIndex.current++;
        setResult(r);
        setTimeout(() => setPhase("result"), 600);
        return;
      }
      const { label, progress: pv } = STEPS[stepIdx];
      setStepLabel(label);
      setProgress(pv);
      stepIdx++;
      setTimeout(nextStep, 700 + Math.random() * 300);
    }
    setTimeout(nextStep, 200);
  };

  const handleReset = () => {
    setPhase("idle");
    setResult(null);
    setProgress(0);
    setStepLabel("");
    clearPreview();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="bg-[#080812]">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Section header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-gold" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gold/70">
                AI Grading Assistant
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl md:text-3xl">
              Pre-Grading Intelligence
            </h2>
            <p className="mt-1.5 max-w-md text-sm text-white/40">
              Get instant pre-grading feedback before paying for official
              grading. Powered by computer vision.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 sm:px-4">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/50">
              Vision Engine v2.1
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left: Upload + processing */}
          <div className="flex flex-col gap-4">
            <div
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border",
                phase === "idle"
                  ? "border-dashed border-white/15 bg-white/[0.02] hover:border-gold/25 cursor-pointer transition-colors"
                  : "border-white/[0.08] bg-[#0E0E1A]"
              )}
              onClick={() => phase === "idle" && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => runAnalysis(e.target.files?.[0] ?? null)}
              />

              <AnimatePresence mode="wait">
                {phase === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 sm:py-12"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10">
                      <Upload className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/80">
                        Upload card for AI grading analysis
                      </p>
                      <p className="mt-1 text-xs text-white/30">
                        or{" "}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            runAnalysis(new File([], "demo-card.jpg"));
                          }}
                          className="text-gold/70 hover:text-gold underline underline-offset-2"
                        >
                          run demo analysis
                        </button>
                      </p>
                    </div>
                    <p className="text-[11px] text-white/20 italic">
                      * Demo mode: uses simulated grading data
                    </p>
                  </motion.div>
                )}

                {phase === "analyzing" && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6"
                  >
                    {/* Card preview + scan overlay */}
                    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a0a12] sm:h-48">
                      {imagePreviewUrl ? (
                        <img
                          src={imagePreviewUrl}
                          alt={gradingFileName || "Analyzing"}
                          className="absolute inset-0 z-0 h-full w-full object-contain object-center"
                        />
                      ) : (
                        <div className="absolute inset-0 z-0 flex items-center justify-center bg-white/[0.03] text-white/10">
                          <Cpu className="h-10 w-10" />
                        </div>
                      )}
                      {/* Scanning lines */}
                      <motion.div
                        className="pointer-events-none absolute left-0 right-0 z-[1] h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"
                        initial={{ top: "0%" }}
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      {/* Analysis overlay zones */}
                      {[
                        { top: "5%", left: "5%", w: "20%", h: "20%", label: "TL" },
                        { top: "5%", left: "75%", w: "20%", h: "20%", label: "TR" },
                        { top: "75%", left: "5%", w: "20%", h: "20%", label: "BL" },
                        { top: "75%", left: "75%", w: "20%", h: "20%", label: "BR" },
                      ].map(({ top, left, w, h, label }) => (
                        <motion.div
                          key={label}
                          className="absolute z-[1] flex items-center justify-center rounded-sm border border-gold/40"
                          style={{ top, left, width: w, height: h }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
                        >
                          <span className="text-[8px] text-gold/40">{label}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/60 font-medium">{stepLabel}</span>
                        <span className="text-xs font-mono text-white/40">{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Running metrics */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {["Centering", "Corners", "Edges", "Surface"].map((m) => (
                        <div
                          key={m}
                          className="flex flex-col items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] py-2"
                        >
                          <motion.div
                            className="h-4 w-8 rounded bg-white/[0.06]"
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: Math.random() }}
                          />
                          <span className="text-[9px] text-white/25">{m}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Feature list */}
            {phase === "idle" && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Crosshair, label: "Centering", full: "Centering Detection" },
                  { icon: Maximize2, label: "Corners", full: "Corner Analysis" },
                  { icon: Minus, label: "Edges", full: "Edge Wear Check" },
                  { icon: Layers, label: "Surface", full: "Surface Inspection" },
                ].map(({ icon: Icon, label, full }) => (
                  <div
                    key={full}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 sm:py-2"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-white/30" />
                    <span className="text-[11px] text-white/40 sm:hidden">{label}</span>
                    <span className="hidden text-[11px] text-white/40 sm:inline">{full}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Result or placeholder */}
          <div>
            <AnimatePresence mode="wait">
              {phase === "result" && result ? (
                <GradingResultPanel
                  key="result"
                  result={result}
                  imageUrl={imagePreviewUrl}
                  fileName={gradingFileName}
                  onReset={handleReset}
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/[0.06] bg-white/[0.01] p-8"
                >
                  <Cpu className="h-8 w-8 text-white/10" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/20">
                      Grading analysis appears here
                    </p>
                    <p className="mt-1 text-xs text-white/15">
                      Upload a card or run demo to see scores
                    </p>
                  </div>
                  {/* Ghost score bars */}
                  <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
                    {["Centering", "Corners", "Edges", "Surface"].map((m, i) => (
                      <div key={m} className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span className="text-[10px] text-white/15">{m}</span>
                          <span className="text-[10px] text-white/10">—</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/[0.04]">
                          <div
                            className="h-full rounded-full bg-white/[0.06]"
                            style={{ width: `${[60, 50, 65, 55][i]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
