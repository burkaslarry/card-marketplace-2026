"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Scan,
  Clock,
  Hash,
  Layers,
  Crosshair,
  ChevronRight,
  RotateCcw,
  FileImage,
  Cpu,
} from "lucide-react";
import { rsaDemoResults } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { RSAVerificationResult } from "@/lib/types";

// ─── Phase Types ───────────────────────────────────────────────────────────────

type Phase = "idle" | "uploading" | "scanning" | "analyzing" | "result";

// ─── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
        initial={{ width: "0%" }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── Confidence Ring ───────────────────────────────────────────────────────────

function ConfidenceRing({ score }: { score: number }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 90 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle
          cx="40" cy="40" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        <motion.circle
          cx="40" cy="40" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold leading-none" style={{ color }}>
          {score.toFixed(1)}
        </span>
        <span className="text-[9px] text-white/40 uppercase tracking-wide">
          Score
        </span>
      </div>
    </div>
  );
}

// ─── Status Config ─────────────────────────────────────────────────────────────

const statusConfig = {
  Verified: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    label: "VERIFIED",
    ringColor: "#10b981",
  },
  "Needs Manual Review": {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    label: "MANUAL REVIEW",
    ringColor: "#f59e0b",
  },
  "Risk Flag": {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    label: "RISK FLAGGED",
    ringColor: "#ef4444",
  },
};

// ─── Result Panel ──────────────────────────────────────────────────────────────

function VerificationResultPanel({
  result,
  fileName,
  imageUrl,
  onReset,
}: {
  result: RSAVerificationResult;
  fileName: string;
  imageUrl: string | null;
  onReset: () => void;
}) {
  const cfg = statusConfig[result.status];
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border p-4 sm:p-6",
        cfg.bg,
        cfg.border,
        cfg.glow
      )}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
        <div className="flex min-w-0 items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", cfg.bg, "border", cfg.border)}>
            <StatusIcon className={cn("h-5 w-5", cfg.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-bold tracking-widest uppercase", cfg.color)}>
                {cfg.label}
              </span>
            </div>
            <p className="text-[11px] text-white/40 mt-0.5">RSA Authenticity Report</p>
          </div>
        </div>
        <div className="flex shrink-0 justify-start sm:justify-end">
          <ConfidenceRing score={result.confidenceScore} />
        </div>
      </div>

      {/* Card preview + details grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left: Card image placeholder */}
        <div className="relative flex flex-col gap-3">
          <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a12] sm:h-52">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={fileName || "Uploaded card"}
                className="relative z-0 h-full w-full object-contain object-center"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/20">
                <FileImage className="h-8 w-8" />
                <span className="max-w-[90%] truncate px-2 text-xs">
                  {fileName || "No preview"}
                </span>
              </div>
            )}
            {/* Scan line overlay */}
            <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
              <div className="scan-line absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            </div>
            {/* Corner brackets */}
            {[
              "top-2 left-2 border-t-2 border-l-2 rounded-tl",
              "top-2 right-2 border-t-2 border-r-2 rounded-tr",
              "bottom-2 left-2 border-b-2 border-l-2 rounded-bl",
              "bottom-2 right-2 border-b-2 border-r-2 rounded-br",
            ].map((cls, i) => (
              <div
                key={i}
                className={cn("pointer-events-none absolute z-[2] h-5 w-5 border-gold/60", cls)}
              />
            ))}
            {imageUrl && (
              <div className="pointer-events-none absolute bottom-2 left-2 right-2 z-[2] truncate rounded bg-black/55 px-2 py-0.5 text-center text-[10px] text-white/70 backdrop-blur-sm">
                {fileName}
              </div>
            )}
          </div>

          {/* Processing meta */}
          <div className="flex items-center justify-between rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2">
            <div className="flex items-center gap-1.5 text-[11px] text-white/40">
              <Cpu className="h-3 w-3" />
              <span>Processed in</span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-white/60">
              {(result.processingMs / 1000).toFixed(2)}s
            </span>
          </div>
        </div>

        {/* Right: Data fields */}
        <div className="flex flex-col gap-2">
          {[
            {
              icon: Hash,
              label: "Serial ID",
              value: result.serialId,
              mono: true,
            },
            {
              icon: Shield,
              label: "Reference",
              value: result.referenceId,
              mono: true,
            },
            {
              icon: Layers,
              label: "Surface",
              value: result.surface,
              mono: false,
            },
            {
              icon: Scan,
              label: "Corners",
              value: result.corners,
              mono: false,
            },
            {
              icon: Crosshair,
              label: "Centering L/R",
              value: result.centeringLR,
              mono: true,
            },
            {
              icon: Crosshair,
              label: "Centering T/B",
              value: result.centeringTB,
              mono: true,
            },
            {
              icon: Clock,
              label: "Timestamp",
              value: new Date(result.timestamp).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              mono: false,
            },
          ].map(({ icon: Icon, label, value, mono }) => (
            <div
              key={label}
              className="flex flex-col gap-1 rounded-lg border border-white/[0.05] bg-white/[0.03] px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
            >
              <div className="flex items-center gap-1.5 text-[11px] text-white/35">
                <Icon className="h-3 w-3 shrink-0" />
                <span>{label}</span>
              </div>
              <span
                className={cn(
                  "break-all text-[11px] font-semibold sm:text-right",
                  mono ? "font-mono text-white/70" : "text-white/70"
                )}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <p className="text-[11px] leading-relaxed text-white/50">
          <span className="font-semibold text-white/70">AI Notes: </span>
          {result.notes}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white/60 transition-all hover:border-white/20 hover:text-white sm:min-h-0 sm:py-2"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Scan Another Card
        </button>
        {result.status === "Verified" && (
          <button
            type="button"
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/15 px-4 py-2.5 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 sm:min-h-0 sm:py-2"
          >
            <ChevronRight className="h-3.5 w-3.5" />
            List on Vault
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Processing Steps ──────────────────────────────────────────────────────────

const SCAN_STEPS = [
  { phase: "uploading" as Phase, label: "Uploading card image…", progress: 25 },
  { phase: "scanning" as Phase, label: "Scanning surface & print layer…", progress: 55 },
  { phase: "analyzing" as Phase, label: "Running RSA signature analysis…", progress: 85 },
];

// ─── Main Component ────────────────────────────────────────────────────────────

export function RSAUploadPortal() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState("");
  const [result, setResult] = useState<RSAVerificationResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
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
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const runVerification = useCallback(
    (file: File) => {
      setPreviewFromFile(file);
      setFileName(file.name);
      setPhase("uploading");

    // Step through phases
    const steps = SCAN_STEPS;
    let stepIdx = 0;

    function nextStep() {
      if (stepIdx >= steps.length) {
        setProgress(100);
        setStepLabel("Verification complete");
        const r = rsaDemoResults[demoIndex.current % rsaDemoResults.length];
        demoIndex.current++;
        const ts = new Date().toISOString();
        setResult({ ...r, timestamp: ts });
        setTimeout(() => setPhase("result"), 500);
        return;
      }
      const { phase: p, label, progress: pv } = steps[stepIdx];
      setPhase(p);
      setStepLabel(label);
      setProgress(pv);
      stepIdx++;
      setTimeout(nextStep, 900 + Math.random() * 400);
    }
    setTimeout(nextStep, 300);
    },
    [setPreviewFromFile]
  );

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (phase !== "idle") return;
      runVerification(file);
    },
    [phase, runVerification]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const handleReset = () => {
    setPhase("idle");
    setResult(null);
    setProgress(0);
    setFileName("");
    setStepLabel("");
    clearPreview();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isProcessing =
    phase === "uploading" || phase === "scanning" || phase === "analyzing";

  return (
    <section className="border-b border-white/[0.06] bg-gradient-to-b from-[#080812] to-[#0A0A16]">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-14 md:py-20">
        {/* Section header */}
        <div className="mb-8 max-w-2xl sm:mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gold/70">
              RSA Secure Upload Portal
            </span>
          </div>
          <h1
            className="font-display mb-3 text-2xl font-bold leading-snug text-white sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Authenticate first.{" "}
            <span className="text-gold-gradient">Trade with confidence.</span>
          </h1>
          <p className="text-sm leading-relaxed text-white/50 md:text-base max-w-xl">
            A premium trading dashboard for Football, One Piece, and Pokémon
            cards — combining verification, pricing intelligence, grading
            support, and secure high-value trading.
          </p>
          <p className="mt-2 text-sm text-white/30">
            Eliminate the fear of fakes before the bid even starts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left: Upload zone */}
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {phase === "idle" ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative flex min-h-[14rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-6 transition-all sm:min-h-[16rem] sm:gap-4",
                    isDragOver
                      ? "border-gold/70 bg-gold/5 scale-[1.01]"
                      : "border-white/15 bg-white/[0.02] hover:border-gold/30 hover:bg-gold/[0.02] upload-zone-active"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10">
                    <Upload className="h-6 w-6 text-gold" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white/80">
                      Drop your card image here
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      or click to browse · JPG, PNG, WEBP · max 20MB
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[10px] text-white/25">
                    <span>256-bit RSA</span>
                    <span className="hidden sm:inline">·</span>
                    <span>AI scan</span>
                    <span className="hidden sm:inline">·</span>
                    <span>Instant result</span>
                  </div>
                  {/* Corner brackets */}
                  {[
                    "top-3 left-3 border-t-2 border-l-2 rounded-tl-lg",
                    "top-3 right-3 border-t-2 border-r-2 rounded-tr-lg",
                    "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg",
                    "bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg",
                  ].map((cls, i) => (
                    <div key={i} className={cn("absolute h-6 w-6 border-gold/40", cls)} />
                  ))}
                </motion.div>
              ) : isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="flex min-h-[14rem] flex-col items-center justify-center gap-4 rounded-2xl border border-gold/20 bg-gold/[0.03] px-4 sm:min-h-[16rem] sm:gap-5"
                >
                  {imagePreviewUrl && (
                    <div className="relative h-36 w-full max-w-[220px] overflow-hidden rounded-xl border border-white/10 bg-[#0a0a12] shadow-lg sm:h-40 sm:max-w-[260px]">
                      <img
                        src={imagePreviewUrl}
                        alt={fileName}
                        className="h-full w-full object-contain object-center"
                      />
                      <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="scan-line absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                      </div>
                    </div>
                  )}
                  {/* Spinning scanner */}
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-14 w-14"
                    >
                      <Scan className="h-14 w-14 text-gold/30" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="h-4 w-4 rounded-full bg-gold/60" />
                    </motion.div>
                  </div>
                  <div className="w-full max-w-xs px-6 text-center">
                    <p className="mb-3 text-sm font-semibold text-white/80">
                      {stepLabel}
                    </p>
                    <ProgressBar value={progress} />
                    <p className="mt-2 text-[11px] text-white/30">
                      {fileName}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Feature pills */}
            {phase === "idle" && (
              <div className="scroll-touch-x -mx-1 flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible">
                {[
                  { label: "RSA-2048 Signature", color: "text-gold" },
                  { label: "AI Surface Scan", color: "text-blue-400" },
                  { label: "Centering Analysis", color: "text-emerald-400" },
                  { label: "Instant Report", color: "text-purple-400" },
                ].map(({ label, color }) => (
                  <span
                    key={label}
                    className="flex shrink-0 items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium"
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full bg-current", color)} />
                    <span className="text-white/50">{label}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Demo note */}
            <p className="text-[11px] text-white/20 italic">
              * Demo mode: verification uses simulated RSA data. Upload any
              image to trigger the flow.
            </p>
          </div>

          {/* Right: Result or placeholder */}
          <div>
            <AnimatePresence mode="wait">
              {phase === "result" && result ? (
                <VerificationResultPanel
                  key="result"
                  result={result}
                  fileName={fileName}
                  imageUrl={imagePreviewUrl}
                  onReset={handleReset}
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[14rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/[0.06] bg-white/[0.01] px-4 sm:min-h-[16rem]"
                >
                  <Shield className="h-8 w-8 text-white/10" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/20">
                      Verification results appear here
                    </p>
                    <p className="mt-1 text-xs text-white/15">
                      Upload a card image to run the RSA scan
                    </p>
                  </div>
                  {/* Ghost data rows */}
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2 rounded-full bg-white/[0.04]"
                      style={{ width: `${60 - i * 8}%` }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
