"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  X,
  Globe,
  HandCoins,
  LoaderCircle,
  PackageCheck,
  Radio,
  ShieldAlert,
  ScanLine,
  ShieldCheck,
  ShipWheel,
  Trophy,
  TrendingDown,
  TrendingUp,
  UserCheck,
} from "lucide-react";

type Locale = "en" | "zh";
type AccountId = "mary" | "good-tcg" | "jackson";
type VerificationStatus = "pending" | "approved" | "rejected";

type Submission = {
  id: string;
  fileName: string;
  submittedBy: string;
  submittedAt: string;
  status: VerificationStatus;
  previewUrl?: string;
};

// -----------------------------------------------------------------------------
// Copy dictionary (EN/ZH)
// -----------------------------------------------------------------------------
const copy = {
  en: {
    tag: "Elite Trader",
    title: "Trusted TCG Market Layer",
    subtitle: "Less text. More live interactions.",
    ctaPrimary: "Open Active Account",
    ctaSecondary: "KPI Panel",
    subHeading: "Account-driven",
    maryTitle: "Retail Collector",
    maryPain: "High grading cost, fake/repack risk, weak online trust.",
    maryAction: "Run Fair-Price Check",
    maryResult: "Fair range and trust badge are now visible.",
    dealerTitle: "Dealer",
    dealerPain: "High CAC, fixed costs, tight margin from spread trading.",
    dealerAction: "Advance Shipment Node",
    dealerUploadTitle: "Dealer Upload Queue",
    dealerUploadDesc: "Upload cards and wait for RSA verification.",
    dealerUploadButton: "Upload Card",
    pendingLabel: "Pending RSA",
    approvedLabel: "Approved",
    rejectedLabel: "Rejected",
    streamAction: "Join Stream Room",
    rsaTitle: "RSA Inspector",
    rsaPain: "Mission-based verification flow for anti-fake trust layer.",
    missionTitle: "Verification Mission",
    missionSteps: [
      "Accept mission",
      "Scan submitted card",
      "Compare serial and fingerprint",
      "Submit verdict",
      "Issue verification badge",
    ],
    missionAction: "Next Step",
    missionDone: "Mission complete. Verification badge issued.",
    rsaQueueTitle: "RSA Review Queue",
    rsaQueueDesc: "Approve or reject pending dealer submissions.",
    openImageAction: "Open Image",
    approveAction: "Approve",
    rejectAction: "Reject",
    emptyQueue: "No pending cards right now.",
    logisticsTitle: "Cross-Border Logistics",
    streamTitle: "Unified HK TCG Streaming Hub",
    leagueTitle: "Tournament Brackets + Team League APIs",
    joinRoom: "Join Room",
    joined: "Joined",
    runApi: "Run API Simulation",
    compactPitch: "Card-first, compact, action-driven mock app UX.",
    demoAccountsLabel: "Demo Accounts",
    footer: "Premium card infrastructure for serious collectors.",
  },
  zh: {
    tag: "Elite Trader",
    title: "可信賴 TCG 交易層",
    subtitle: "少字 + 高互動。",
    ctaPrimary: "開啟目前帳號",
    ctaSecondary: "KPI 面板",
    subHeading: "以帳號切換大型 demo",
    maryTitle: "散戶",
    maryPain: "鑑定成本高、假貨/repack 風險、網上信任不足。",
    maryAction: "執行合理定價檢查",
    maryResult: "已顯示合理價格區間與信任標章。",
    dealerTitle: "卡商",
    dealerPain: "獲客成本高、固定成本重、價差利潤壓縮。",
    dealerAction: "推進物流節點",
    dealerUploadTitle: "卡商上載隊列",
    dealerUploadDesc: "上載卡牌後進入待 RSA 認證。",
    dealerUploadButton: "上載卡牌",
    pendingLabel: "待 RSA",
    approvedLabel: "已批准",
    rejectedLabel: "已拒絕",
    streamAction: "加入直播房",
    rsaTitle: "RSA 驗卡員",
    rsaPain: "Mission 式驗卡流程，建立防假貨信任層。",
    missionTitle: "驗卡任務流程",
    missionSteps: ["接任務", "掃描卡牌", "比對序號與指紋", "提交判定", "發出驗證標章"],
    missionAction: "下一步",
    missionDone: "任務完成，已發出驗證標章。",
    rsaQueueTitle: "RSA 審核隊列",
    rsaQueueDesc: "批准或拒絕卡商待審卡牌。",
    openImageAction: "開啟圖片",
    approveAction: "批准",
    rejectAction: "拒絕",
    emptyQueue: "目前無待審卡牌。",
    logisticsTitle: "跨境物流追蹤",
    streamTitle: "香港 TCG 統一直播中樞",
    leagueTitle: "賽事 Bracket + Team League API",
    joinRoom: "加入房間",
    joined: "已加入",
    runApi: "執行 API 模擬",
    compactPitch: "介面方向：卡片化、精簡、操作優先。",
    demoAccountsLabel: "Demo 帳號",
    footer: "為高價值收藏打造的交易基礎設施。",
  },
} as const;

// -----------------------------------------------------------------------------
// Demo account presets
// -----------------------------------------------------------------------------
const demoAccounts: Array<{ id: AccountId; label: string; email: string }> = [
  { id: "mary", label: "散戶 Mary", email: "mary@demo.io" },
  { id: "good-tcg", label: "卡商 Good TCG Company", email: "ops@goodtcg.demo" },
  { id: "jackson", label: "RSA 驗卡員 Jackson", email: "jackson.rsa@demo.io" },
];

// -----------------------------------------------------------------------------
// Dealer logistics mock data
// -----------------------------------------------------------------------------
const logisticsSeeds = [
  {
    id: "HK-SG-188",
    route: "HK -> SG",
    checkpoints: [
      "Pickup Confirmed",
      "Export Customs Cleared",
      "In-Transit to SG",
      "Import Customs Cleared",
      "Delivered to Vault",
    ],
  },
  {
    id: "JP-HK-072",
    route: "JP -> HK",
    checkpoints: [
      "Pickup Confirmed",
      "In-Transit to HK",
      "Risk Scan Complete",
      "Vault Intake Complete",
      "Ready for Settlement",
    ],
  },
];

// -----------------------------------------------------------------------------
// Streaming room mock data
// -----------------------------------------------------------------------------
const streamRooms = {
  match: ["Asia League Round 3", "HK Friday Duel Night"],
  break: ["Premium Box Break Room", "Collector Pull Session"],
  commentary: ["Market Watch Live", "Meta Deck Review"],
};

// -----------------------------------------------------------------------------
// Retail market board mock data (stock-style)
// -----------------------------------------------------------------------------
const marketTrendCards = [
  {
    name: "One Piece",
    ticker: "OPX",
    floor: "$2,230",
    change24h: 5.7,
    volume24h: "$398K",
    dayHigh: "$2,310",
    dayLow: "$2,080",
    bid: "$2,220",
    ask: "$2,245",
    support: "$2,150",
    resistance: "$2,340",
    cards: [
      {
        name: "OP09 Manga Luffy",
        price: "$2,230",
        move: "+6.2%",
        trend: [42, 45, 43, 48, 53, 56, 60, 64],
      },
      {
        name: "OP06 Manga Sabo",
        price: "$3,840",
        move: "+4.1%",
        trend: [51, 50, 52, 55, 54, 57, 59, 61],
      },
    ],
  },
  {
    name: "Pokemon",
    ticker: "PKM",
    floor: "$8,250",
    change24h: 1.8,
    volume24h: "$1.20M",
    dayHigh: "$8,420",
    dayLow: "$8,050",
    bid: "$8,220",
    ask: "$8,280",
    support: "$8,100",
    resistance: "$8,500",
    cards: [
      {
        name: "Base Set Charizard",
        price: "$8,250",
        move: "+1.8%",
        trend: [58, 59, 60, 59, 61, 62, 63, 64],
      },
      {
        name: "Pikachu Illustrator",
        price: "$44,800",
        move: "+0.5%",
        trend: [69, 69, 70, 69, 70, 70, 71, 71],
      },
    ],
  },
  {
    name: "Football",
    ticker: "FTB",
    floor: "$12,480",
    change24h: 4.8,
    volume24h: "$842K",
    dayHigh: "$12,650",
    dayLow: "$11,980",
    bid: "$12,430",
    ask: "$12,510",
    support: "$12,100",
    resistance: "$12,780",
    cards: [
      {
        name: "Messi World Cup Gold",
        price: "$12,480",
        move: "+4.8%",
        trend: [47, 49, 51, 54, 58, 61, 64, 66],
      },
      {
        name: "Ronaldo CL Gold",
        price: "$4,520",
        move: "-1.4%",
        trend: [63, 62, 61, 60, 59, 58, 57, 56],
      },
    ],
  },
  {
    name: "NBA Basketball",
    ticker: "NBA",
    floor: "$6,920",
    change24h: -1.2,
    volume24h: "$514K",
    dayHigh: "$7,080",
    dayLow: "$6,860",
    bid: "$6,900",
    ask: "$6,940",
    support: "$6,850",
    resistance: "$7,120",
    cards: [
      {
        name: "Jordan Fleer Rookie",
        price: "$6,920",
        move: "-1.2%",
        trend: [61, 60, 60, 59, 58, 58, 57, 56],
      },
      {
        name: "LeBron Exquisite RPA",
        price: "$19,300",
        move: "+2.0%",
        trend: [53, 54, 55, 56, 58, 59, 60, 61],
      },
    ],
  },
];

export function PitchExperience() {
  // ---------------------------------------------------------------------------
  // Global UI state
  // ---------------------------------------------------------------------------
  const [locale, setLocale] = useState<Locale>("zh");
  const [activeAccount, setActiveAccount] = useState<AccountId>("mary");
  const activeProfile = demoAccounts.find((item) => item.id === activeAccount)!;

  const [pricingRan, setPricingRan] = useState(false);
  const [missionStep, setMissionStep] = useState(0);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [previewingSubmission, setPreviewingSubmission] = useState<Submission | null>(
    null
  );
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "sub-0",
      fileName: "IMG_0508.png",
      submittedBy: "Good TCG Company",
      submittedAt: "4/14/2026, 7:41:23 PM",
      status: "pending",
      previewUrl: "https://placehold.co/800x1100/17172a/f8fafc?text=IMG_0508.png",
    },
    {
      id: "sub-1",
      fileName: "OP09-Manga-Luffy.jpg",
      submittedBy: "Good TCG Company",
      submittedAt: "2026-04-14 19:42",
      status: "pending",
      previewUrl:
        "https://placehold.co/800x1100/0f172a/f8fafc?text=OP09-Manga-Luffy.jpg",
    },
  ]);
  const [shipmentIdx, setShipmentIdx] = useState(0);
  const [checkpointIdx, setCheckpointIdx] = useState(0);
  const [streamTab, setStreamTab] = useState<keyof typeof streamRooms>("match");
  const [joinedRoom, setJoinedRoom] = useState("");
  const [format, setFormat] = useState<"single" | "swiss">("single");
  const [apiPayload, setApiPayload] = useState("");

  // ---------------------------------------------------------------------------
  // Derived values and computed payloads
  // ---------------------------------------------------------------------------
  const t = copy[locale];
  const shipment = logisticsSeeds[shipmentIdx];
  const checkpoints = shipment.checkpoints;

  const apiPreview = useMemo(() => {
    return {
      format,
      season: "HK-TCG-2026-S1",
      teams: ["Victoria Dragons", "Kowloon Foxes", "Harbor Titans", "Shatin Blades"],
      nextRoundAt: "2026-05-18T19:30:00+08:00",
      status: "active",
    };
  }, [format]);

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------
  const advanceMission = () => {
    setMissionStep((prev) => Math.min(prev + 1, t.missionSteps.length));
  };

  const advanceCheckpoint = () => {
    setCheckpointIdx((prev) => Math.min(prev + 1, checkpoints.length - 1));
  };

  const pendingCount = submissions.filter((item) => item.status === "pending").length;
  const approvedCount = submissions.filter((item) => item.status === "approved").length;
  const rejectedCount = submissions.filter((item) => item.status === "rejected").length;

  const handleDealerUpload = (file: File | null) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setSubmissions((prev) => [
      {
        id: `sub-${Date.now()}`,
        fileName: file.name,
        submittedBy: "Good TCG Company",
        submittedAt: new Date().toLocaleString(),
        status: "pending",
        previewUrl,
      },
      ...prev,
    ]);
  };

  const reviewSubmission = (id: string, status: "approved" | "rejected") => {
    setSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  // ---------------------------------------------------------------------------
  // Account component: Mary (Retail)
  // ---------------------------------------------------------------------------
  const renderMaryComponent = () => {
    return (
      <section className="border-b border-white/[0.06] bg-[#080812]">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1A] p-5">
            <div className="mb-4 flex items-center gap-2">
              <HandCoins className="h-4 w-4 text-gold" />
              <h2 className="text-sm font-bold text-white">{t.maryTitle}</h2>
            </div>
            <p className="text-xs text-white/45">{t.maryPain}</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[10px] text-white/35">Fair Price Range</p>
                <p className="mt-1 text-sm font-semibold text-white">$1,720 - $1,860</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[10px] text-white/35">Risk Status</p>
                <p className="mt-1 text-sm font-semibold text-white">Low Repack Risk</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-2">
              {marketTrendCards.map((item) => {
                const positive = item.change24h >= 0;
                return (
                  <div
                    key={item.name}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {item.name} <span className="text-white/35">· {item.ticker}</span>
                        </p>
                        <p className="mt-1 text-[11px] text-white/35">24h Volume {item.volume24h}</p>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${
                          positive
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-red-500/10 text-red-300"
                        }`}
                      >
                        {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {positive ? "+" : ""}
                        {item.change24h}%
                      </div>
                    </div>
                    <p className="mt-2 text-lg font-bold text-white">{item.floor}</p>
                    <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] text-white/45">
                      <div className="rounded-md border border-white/10 bg-[#0A0A14] px-2 py-1">
                        Day High <span className="ml-1 text-white/80">{item.dayHigh}</span>
                      </div>
                      <div className="rounded-md border border-white/10 bg-[#0A0A14] px-2 py-1">
                        Day Low <span className="ml-1 text-white/80">{item.dayLow}</span>
                      </div>
                      <div className="rounded-md border border-white/10 bg-[#0A0A14] px-2 py-1">
                        Bid <span className="ml-1 text-white/80">{item.bid}</span>
                      </div>
                      <div className="rounded-md border border-white/10 bg-[#0A0A14] px-2 py-1">
                        Ask <span className="ml-1 text-white/80">{item.ask}</span>
                      </div>
                      <div className="rounded-md border border-white/10 bg-[#0A0A14] px-2 py-1">
                        Support <span className="ml-1 text-white/80">{item.support}</span>
                      </div>
                      <div className="rounded-md border border-white/10 bg-[#0A0A14] px-2 py-1">
                        Resistance <span className="ml-1 text-white/80">{item.resistance}</span>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1 rounded-md border border-white/10 bg-[#0A0A14] p-2">
                      {item.cards.map((card) => (
                        <div
                          key={card.name}
                          className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5 text-[10px]"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-white/75">{card.name}</p>
                            <svg
                              viewBox="0 0 100 24"
                              className="mt-1 h-5 w-full"
                              fill="none"
                              aria-hidden="true"
                            >
                              <polyline
                                points={card.trend
                                  .map(
                                    (value, idx) =>
                                      `${(idx / (card.trend.length - 1)) * 100},${24 - (value / 100) * 22}`
                                  )
                                  .join(" ")}
                                stroke={card.move.startsWith("-") ? "#f87171" : "#34d399"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span className="font-semibold text-white">{card.price}</span>
                          <span
                            className={
                              card.move.startsWith("-")
                                ? "rounded-sm bg-red-500/10 px-1.5 py-0.5 text-red-300"
                                : "rounded-sm bg-emerald-500/10 px-1.5 py-0.5 text-emerald-300"
                            }
                          >
                            {card.move}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPricingRan(true)}
                className="rounded-xl border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold"
              >
                {t.maryAction}
              </button>
              {pricingRan && <span className="text-xs text-emerald-400">{t.maryResult}</span>}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // ---------------------------------------------------------------------------
  // Account component: Good TCG Company (Dealer)
  // ---------------------------------------------------------------------------
  const renderDealerComponent = () => {
    return (
      <section className="border-b border-white/[0.06] bg-[#080812]">
        <div className="mx-auto max-w-screen-2xl space-y-4 px-4 py-8 sm:px-6 sm:py-10">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1A] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Boxes className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">{t.dealerTitle}</h2>
            </div>
            <p className="text-xs text-white/45">{t.dealerPain}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1A] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{t.dealerUploadTitle}</h3>
                <p className="text-xs text-white/45">{t.dealerUploadDesc}</p>
              </div>
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleDealerUpload(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="rounded-xl border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold"
              >
                {t.dealerUploadButton}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                {t.pendingLabel}: {pendingCount}
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                {t.approvedLabel}: {approvedCount}
              </div>
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {t.rejectedLabel}: {rejectedCount}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1A] p-4">
              <div className="mb-3 flex items-center gap-2">
                <ShipWheel className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">{t.logisticsTitle}</h3>
              </div>
              <div className="mt-3 flex gap-2">
                {logisticsSeeds.map((seed, idx) => (
                  <button
                    key={seed.id}
                    type="button"
                    onClick={() => {
                      setShipmentIdx(idx);
                      setCheckpointIdx(0);
                    }}
                    className={`rounded-lg border px-2 py-1 text-[10px] ${
                      shipmentIdx === idx
                        ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                        : "border-white/10 text-white/45"
                    }`}
                  >
                    {seed.route}
                  </button>
                ))}
              </div>
              <div className="mt-3 space-y-1.5">
                {checkpoints.map((item, idx) => (
                  <div
                    key={item}
                    className={`rounded-md border px-2 py-1 text-[11px] ${
                      idx <= checkpointIdx
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                        : "border-white/10 bg-white/[0.02] text-white/35"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={advanceCheckpoint}
                className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-semibold text-cyan-300"
              >
                {t.dealerAction}
              </button>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1A] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Radio className="h-4 w-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">{t.streamTitle}</h3>
              </div>
              <div className="mt-3 flex gap-2">
                {(["match", "break", "commentary"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStreamTab(tab)}
                    className={`rounded-lg border px-2 py-1 text-[10px] ${
                      streamTab === tab
                        ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
                        : "border-white/10 text-white/45"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                {streamRooms[streamTab].map((room) => (
                  <div
                    key={room}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2"
                  >
                    <span className="text-[11px] text-white/70">{room}</span>
                    <button
                      type="button"
                      onClick={() => setJoinedRoom(room)}
                      className="rounded-md border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-300"
                    >
                      {joinedRoom === room ? t.joined : t.streamAction}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // ---------------------------------------------------------------------------
  // Account component: Jackson (RSA Inspector)
  // ---------------------------------------------------------------------------
  const renderRsaComponent = () => {
    const pendingSubmissions = submissions.filter((item) => item.status === "pending");

    return (
      <section className="border-b border-white/[0.06] bg-[#080812]">
        <div className="mx-auto max-w-screen-2xl space-y-4 px-4 py-8 sm:px-6 sm:py-10">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1A] p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">{t.rsaTitle}</h2>
            </div>
            <p className="text-xs text-white/45">{t.rsaPain}</p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
              <BadgeCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-emerald-300">{activeProfile.label}</span>
              <span className="text-xs text-emerald-400">({activeProfile.email})</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1A] p-4">
            <div className="mb-3 flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">{t.rsaQueueTitle}</h3>
            </div>
            <p className="mb-3 text-xs text-white/45">{t.rsaQueueDesc}</p>
            <div className="space-y-2">
              {pendingSubmissions.length === 0 && (
                <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white/45">
                  {t.emptyQueue}
                </div>
              )}
              {pendingSubmissions.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">{item.fileName}</p>
                    <p className="text-[11px] text-white/35">
                      {item.submittedBy} · {item.submittedAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewingSubmission(item)}
                      className="rounded-md border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-300"
                    >
                      {t.openImageAction}
                    </button>
                    <button
                      type="button"
                      onClick={() => reviewSubmission(item.id, "approved")}
                      className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300"
                    >
                      {t.approveAction}
                    </button>
                    <button
                      type="button"
                      onClick={() => reviewSubmission(item.id, "rejected")}
                      className="rounded-md border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-300"
                    >
                      {t.rejectAction}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1A] p-4">
              <div className="mb-3 flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-gold" />
                <h3 className="text-sm font-bold text-white">{t.missionTitle}</h3>
              </div>
              <div className="space-y-2">
                {t.missionSteps.map((step, idx) => {
                  const done = missionStep > idx;
                  const active = missionStep === idx;
                  return (
                    <div
                      key={step}
                      className={`rounded-lg border px-2.5 py-2 text-[11px] ${
                        done
                          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                          : active
                          ? "border-gold/25 bg-gold/10 text-gold"
                          : "border-white/10 bg-white/[0.02] text-white/35"
                      }`}
                    >
                      {step}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={advanceMission}
                  className="rounded-xl border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold"
                >
                  {t.missionAction}
                </button>
                {missionStep >= t.missionSteps.length && (
                  <span className="text-xs text-emerald-400">{t.missionDone}</span>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1A] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">{t.leagueTitle}</h3>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormat("single")}
                  className={`rounded-lg border px-2 py-1 text-[10px] ${
                    format === "single"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                      : "border-white/10 text-white/45"
                  }`}
                >
                  Single Elim
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("swiss")}
                  className={`rounded-lg border px-2 py-1 text-[10px] ${
                    format === "swiss"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                      : "border-white/10 text-white/45"
                  }`}
                >
                  Swiss
                </button>
              </div>
              <button
                type="button"
                onClick={() => setApiPayload(JSON.stringify(apiPreview, null, 2))}
                className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-300"
              >
                {t.runApi}
              </button>
              <pre className="mt-3 max-h-44 overflow-auto rounded-lg border border-white/10 bg-[#0A0A14] p-2 text-[10px] text-white/65">
                {apiPayload || "{ }"}
              </pre>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // ---------------------------------------------------------------------------
  // Main layout
  // ---------------------------------------------------------------------------
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080812]">
      <section className="border-b border-white/[0.06] bg-[#080812]">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold/80">
              <Globe className="h-3.5 w-3.5" />
              {t.tag}
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-1">
                {demoAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => {
                      setActiveAccount(account.id);
                      setMissionStep(0);
                    }}
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                      activeAccount === account.id
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "text-white/60 hover:text-white/85"
                    }`}
                  >
                    {account.label}
                  </button>
                ))}
              </div>
              <div className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-1">
              <button
                type="button"
                onClick={() => setLocale("zh")}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${locale === "zh" ? "bg-gold/20 text-gold" : "text-white/50"}`}
              >
                中文
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${locale === "en" ? "bg-gold/20 text-gold" : "text-white/50"}`}
              >
                EN
              </button>
              </div>
            </div>
          </div>

          <h1 className="max-w-4xl font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {t.title}
          </h1>
          <p className="mt-2 text-sm text-white/45">{t.subtitle}</p>
          <p className="mt-1 text-xs text-white/30">{t.compactPitch}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveAccount(activeAccount)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gold/25 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold"
            >
              {t.ctaPrimary}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/70">
              {t.ctaSecondary}
            </button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <LoaderCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs text-white/65">{t.demoAccountsLabel}:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {demoAccounts.map((account) => (
                <button
                  key={`inline-${account.id}`}
                  type="button"
                  onClick={() => {
                    setActiveAccount(account.id);
                    setMissionStep(0);
                  }}
                  className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors ${
                    activeAccount === account.id
                      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                      : "border-white/10 bg-white/[0.02] text-white/55 hover:text-white/75"
                  }`}
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {activeAccount === "mary" && renderMaryComponent()}
      {activeAccount === "good-tcg" && renderDealerComponent()}
      {activeAccount === "jackson" && renderRsaComponent()}

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#080812]">
        <div className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <span className="text-xs text-white/25">© 2026 Elite Trader Platform. {t.footer}</span>
            <span className="inline-flex items-center gap-1 text-xs text-white/25">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              v0.2.0
            </span>
          </div>
        </div>
      </footer>

      {/* Global image preview modal (RSA queue) */}
      {previewingSubmission && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#0E0E1A] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{previewingSubmission.fileName}</h4>
                <p className="text-[11px] text-white/40">
                  {previewingSubmission.submittedBy} · {previewingSubmission.submittedAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingSubmission(null)}
                className="rounded-md border border-white/10 bg-white/[0.03] p-1.5 text-white/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative h-[420px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0A14]">
              {previewingSubmission.previewUrl ? (
                <Image
                  src={previewingSubmission.previewUrl}
                  alt={previewingSubmission.fileName}
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/40">
                  No preview available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
