export type CardCategory = "Football" | "One Piece" | "Pokemon";

export type SellerTier = "Elite" | "Verified" | "Standard";
export type CardRarity = "Iconic" | "Ultra Rare" | "Rare" | "Uncommon";
export type VerificationStatus = "Verified" | "Needs Manual Review" | "Risk Flag";
export type GradingRecommendation = "Send to PSA" | "Review Again" | "Good Raw Condition";
export type SurfaceCondition = "Mint" | "Near Mint" | "Excellent" | "Good" | "Poor";
export type CornerCondition = "Sharp" | "Near Mint" | "Slightly Worn" | "Worn";

export interface MarketCard {
  id: string;
  name: string;
  category: CardCategory;
  currentPrice: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  sparkline: number[];
  psaGrade?: number;
  year?: number;
}

export interface VaultListing {
  id: string;
  cardName: string;
  subtitle: string;
  category: CardCategory;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  psaGrade: number | null;
  currentBid: number;
  buyNowPrice: number | null;
  isVerified: boolean;
  sellerRegion: string;
  sellerTier: SellerTier;
  timeLeft: string;
  rarity: CardRarity;
  bids: number;
  year: string;
  population?: number;
}

export interface RSAVerificationResult {
  status: VerificationStatus;
  confidenceScore: number;
  serialId: string;
  referenceId: string;
  surface: SurfaceCondition;
  corners: CornerCondition;
  centeringLR: string;
  centeringTB: string;
  timestamp: string;
  cardName: string;
  notes: string;
  processingMs: number;
}

export interface GradingScores {
  centering: number;
  corners: number;
  edges: number;
  surface: number;
}

export interface GradingResult {
  scores: GradingScores;
  estimatedGradeMin: number;
  estimatedGradeMax: number;
  recommendation: GradingRecommendation;
  notes: string;
  processingMs: number;
  psaSubmitEstimate: string;
}
