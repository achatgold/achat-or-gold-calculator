
import { MarketData } from "../types";

const CACHE_KEY = 'gold_price_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const SAFETY_FLOOR_PRICE = 3850.00; // CAD safety fallback
const GOLD_API_KEY = 'goldapi-57t1osmkmvasyw-io';

export async function fetchLiveGoldPrice(forceRefresh = false): Promise<MarketData> {
  const cached = localStorage.getItem(CACHE_KEY);
  let lastKnownGood: MarketData | null = null;
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    lastKnownGood = data;
    if (!forceRefresh && (Date.now() - timestamp < CACHE_DURATION)) {
      return data;
    }
  }

  try {
    // Fetch directly from GoldAPI.io for high accuracy
    const response = await fetch('https://www.goldapi.io/api/XAU/CAD', {
      method: 'GET',
      headers: {
        'x-access-token': GOLD_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    const spotPrice = result.price; // The API returns 'price' as the spot bid/mid price

    if (!spotPrice || isNaN(spotPrice) || spotPrice < 2500) {
      throw new Error("Invalid price received from GoldAPI");
    }

    const marketData: MarketData = {
      spotPriceCAD: spotPrice,
      lastUpdated: new Date().toLocaleTimeString('fr-CA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      source: 'Direct Gold Market Feed'
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: marketData,
      timestamp: Date.now()
    }));

    return marketData;

  } catch (error: any) {
    console.warn("GoldAPI error, falling back to safety protocols:", error.message);
    
    // Fallback to last known good or safety floor
    const fallbackPrice = lastKnownGood ? lastKnownGood.spotPriceCAD : SAFETY_FLOOR_PRICE;
    
    return {
      spotPriceCAD: fallbackPrice,
      lastUpdated: lastKnownGood ? lastKnownGood.lastUpdated : 'Calcul Auto',
      source: 'Estimation de Sécurité (Offline)'
    };
  }
}
