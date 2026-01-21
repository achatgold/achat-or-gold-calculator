
export interface KaratConfig {
  label: string;
  value: number;
  purity: number; // e.g., 0.417 for 10k
}

export interface MarketData {
  spotPriceCAD: number; // Per troy ounce
  lastUpdated: string;
  source: string;
  groundingSources?: { title?: string; uri?: string }[];
}

export interface CalculationRow {
  karat: number;
  grams: number;
  ratePerGram: number;
  total: number;
}
