
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchLiveGoldPrice } from './services/geminiService';
import { MarketData } from './types';
import { KARATS, GRAMS_PER_TROY_OUNCE, LUXURY_PAYOUT_PERCENTAGE, STANDARD_PAYOUT_PERCENTAGE, TRANSLATIONS, CONTACT_INFO } from './constants';
import KaratInput from './components/KaratInput';

type Language = 'fr' | 'en';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fr');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [luxuryWeights, setLuxuryWeights] = useState<Record<number, string>>({});
  const [standardWeights, setStandardWeights] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const t = useMemo(() => TRANSLATIONS[lang], [lang]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    if (langParam === 'en' || langParam === 'fr') {
      setLang(langParam as Language);
    }
  }, []);

  const loadData = useCallback(async (isManual = false) => {
    setIsLoading(true);
    const data = await fetchLiveGoldPrice(isManual);
    setMarketData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const spotPerGram = useMemo(() => {
    if (!marketData) return 0;
    return marketData.spotPriceCAD / GRAMS_PER_TROY_OUNCE;
  }, [marketData]);

  const calculateRate = useCallback((karatValue: number, isLuxury: boolean) => {
    const percentage = isLuxury ? LUXURY_PAYOUT_PERCENTAGE : STANDARD_PAYOUT_PERCENTAGE;
    return spotPerGram * (karatValue / 24) * percentage;
  }, [spotPerGram]);

  const totalPayout = useMemo(() => {
    const luxury = KARATS.reduce((sum, k) => {
      const grams = parseFloat(luxuryWeights[k.value] || '0');
      return sum + (grams * calculateRate(k.value, true));
    }, 0);
    const standard = KARATS.reduce((sum, k) => {
      const grams = parseFloat(standardWeights[k.value] || '0');
      return sum + (grams * calculateRate(k.value, false));
    }, 0);
    return luxury + standard;
  }, [luxuryWeights, standardWeights, calculateRate]);

  const totalWeight = useMemo(() => {
    const luxurySum = KARATS.reduce((acc, k) => acc + (parseFloat(luxuryWeights[k.value] || '0') || 0), 0);
    const standardSum = KARATS.reduce((acc, k) => acc + (parseFloat(standardWeights[k.value] || '0') || 0), 0);
    return luxurySum + standardSum;
  }, [luxuryWeights, standardWeights]);

  const handleWeightChange = (karat: number, value: string, isLuxury: boolean) => {
    if (isLuxury) {
      setLuxuryWeights(prev => ({ ...prev, [karat]: value }));
    } else {
      setStandardWeights(prev => ({ ...prev, [karat]: value }));
    }
  };

  const resetCalculator = () => {
    setLuxuryWeights({});
    setStandardWeights({});
  };

  if (isLoading && !marketData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#D4AF37] font-medium animate-pulse tracking-widest uppercase text-xs font-bold">{t.loading}</p>
      </div>
    );
  }

  const isFallback = marketData?.source?.includes('Estimation');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 pb-[550px] md:pb-[450px]">
      <div className="max-w-6xl mx-auto">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4 gap-2">
          {['fr', 'en'].map((l) => (
            <button 
              key={l}
              onClick={() => setLang(l as Language)} 
              className={`text-xs font-bold px-3 py-1 rounded transition-colors ${lang === l ? 'bg-[#D4AF37] text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-gray-800 pb-10 gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-4">
              <div className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-2">
                <span>ACHAT</span>
                <div className="bg-[#D4AF37] text-black px-4 py-1.5 rounded-lg rotate-[-2deg] shadow-lg shadow-[#D4AF37]/20">
                  <span className="font-black italic">OR</span>
                </div>
                <span>MONTRÉAL</span>
              </div>
            </div>
            <p className="text-gray-400 max-w-md text-lg leading-snug font-medium">
              {t.title} <br/>
              <span className="text-[#D4AF37]/60 italic font-serif">{t.tagline}</span>
            </p>
          </div>
          
          <div className={`p-6 rounded-3xl border ${isFallback ? 'border-red-900/50 bg-red-950/10' : 'border-[#D4AF37]/30 bg-[#111]'} w-full md:w-80 text-center shadow-[0_0_50px_rgba(212,175,55,0.05)] relative transition-colors duration-500`}>
            <button 
              onClick={() => loadData(true)}
              disabled={isLoading}
              className={`absolute -top-3 -right-3 bg-[#D4AF37] text-black p-2.5 rounded-full hover:scale-110 transition-transform shadow-xl z-10 ${isLoading ? 'animate-spin' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${isFallback ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-black">
                {isFallback ? t.safetyMode : t.marketLive}
              </span>
            </div>
            <div className="text-4xl font-black mb-1">
              ${marketData?.spotPriceCAD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              <span className="text-base text-gray-500 ml-1 font-bold">/oz</span>
            </div>
            <p className="text-[10px] text-[#D4AF37] font-bold tracking-widest uppercase opacity-80">
              {t.updatedAt} {marketData?.lastUpdated}
            </p>
          </div>
        </header>

        <div className="mb-12 bg-[#1a1300] border border-[#D4AF37]/20 p-6 rounded-3xl flex items-start gap-5 shadow-2xl">
          <div className="bg-[#D4AF37] text-black p-2 rounded-xl mt-1 shrink-0 shadow-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
          </div>
          <div>
            <h4 className="text-[#D4AF37] font-black text-xs uppercase tracking-widest mb-1">{t.disclaimerTitle}</h4>
            <p className="text-sm text-[#D4AF37]/90 leading-relaxed font-medium">
              {t.disclaimerText}
            </p>
          </div>
        </div>

        <div className="space-y-24">
          <section>
            <div className="mb-10 max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-1.5 bg-[#D4AF37] rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{t.luxuryTitle}</h2>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium border-l border-gray-800 pl-6 ml-1">
                {t.luxurySubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {KARATS.map((k) => (
                <KaratInput
                  key={`lux-${k.value}`}
                  karat={k}
                  grams={luxuryWeights[k.value] || ''}
                  ratePerGram={calculateRate(k.value, true)}
                  onChange={(val) => handleWeightChange(k.value, val, true)}
                  labels={{
                    purityGrade: t.purityGrade,
                    perGram: t.perGram,
                    rowTotal: t.rowTotal,
                    unit: t.unit
                  }}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-10 max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-1.5 bg-gray-600 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight opacity-80">{t.standardTitle}</h2>
              </div>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium border-l border-gray-800 pl-6 ml-1">
                {t.standardSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {KARATS.map((k) => (
                <KaratInput
                  key={`std-${k.value}`}
                  karat={k}
                  grams={standardWeights[k.value] || ''}
                  ratePerGram={calculateRate(k.value, false)}
                  onChange={(val) => handleWeightChange(k.value, val, false)}
                  labels={{
                    purityGrade: t.purityGrade,
                    perGram: t.perGram,
                    rowTotal: t.rowTotal,
                    unit: t.unit
                  }}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Floating Summary Bar */}
        <div className="fixed bottom-4 md:bottom-8 left-2 right-2 md:left-4 md:right-4 z-40">
          <div className="max-w-4xl mx-auto bg-[#D4AF37] text-black rounded-3xl md:rounded-[2.5rem] p-4 md:p-8 shadow-[0_15px_60px_-10px_rgba(212,175,55,0.8)] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 border-2 md:border-4 border-white/50 backdrop-blur-2xl">
            <div className="flex flex-row items-center justify-around md:justify-start gap-4 md:gap-10 w-full md:w-auto px-1 md:px-2">
              <div className="text-center md:text-left">
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-wider md:tracking-[0.25em] opacity-70 mb-0 md:mb-2 leading-none">{t.estTotal}</p>
                <div className="text-3xl md:text-6xl font-black tracking-tighter leading-none mt-1">
                  ${totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-[12px] md:text-2xl ml-1 font-bold opacity-70 uppercase">CAD</span>
                </div>
              </div>
              <div className="w-px h-10 md:h-16 bg-black/10 shrink-0"></div>
              <div className="text-center md:text-left">
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-wider md:tracking-[0.25em] opacity-70 mb-0 md:mb-2 leading-none">{t.weightTotal}</p>
                <div className="text-xl md:text-3xl font-black leading-none mt-1">
                  {totalWeight.toFixed(2)}<span className="text-[12px] md:text-lg ml-0.5 opacity-70">{t.unit}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-2 w-full md:w-auto">
              <button 
                onClick={resetCalculator}
                className="flex-1 md:flex-none px-3 md:px-8 py-3 md:py-6 bg-black/10 hover:bg-black/20 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-wide md:tracking-widest transition-all border border-black/5 whitespace-nowrap flex items-center justify-center"
              >
                {t.reset}
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-[2] md:flex-none px-3 md:px-12 py-3 md:py-6 bg-black text-[#D4AF37] rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-wide md:tracking-widest shadow-xl hover:bg-[#111] active:scale-95 transition-all whitespace-nowrap flex items-center justify-center"
              >
                {t.contactUs}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#111] border border-[#D4AF37]/30 w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.15)] flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div className="overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{t.modalTitle}</h2>
                <p className="text-[#D4AF37] font-bold text-sm mb-4 leading-tight">{t.modalTrust}</p>
                <p className="text-gray-400 text-xs md:text-sm">{t.modalDesc}</p>
              </div>

              {/* Action Links */}
              <div className="grid grid-cols-1 gap-3">
                <a href={`sms:+1${CONTACT_INFO.phone}`} className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-gray-800 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a.5.5 0 01-1 0V5a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1.172a2 2 0 011.414.586l.828.828A2 2 0 008.828 18H14a2 2 0 002-2v-4.5a.5.5 0 011 0V16a3 3 0 01-3 3H8.828a3 3 0 01-2.12-.879l-.83-.828A1 1 0 005.172 17H4a3 3 0 01-3-3V5z"/><path d="M15 4a2 2 0 100 4 2 2 0 000-4z"/></svg>
                  {t.textBtn}: (514) 965-6130
                </a>
                <a href={`tel:+1${CONTACT_INFO.phone}`} className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-gray-800 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.587 4.587l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                  {t.callBtn}: (514) 965-6130
                </a>
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-gray-800 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                  {t.emailBtn}
                </a>
              </div>

              {/* Location */}
              <div className="bg-black/40 border border-gray-800/50 p-6 rounded-2xl">
                <p className="text-gray-300 text-sm font-medium mb-4 text-center">{CONTACT_INFO.address}</p>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONTACT_INFO.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 text-[#D4AF37] font-black text-xs uppercase tracking-widest border-b border-[#D4AF37]/30 pb-1 hover:border-[#D4AF37] transition-all"
                >
                  {t.directionsBtn}
                </a>
              </div>

              <a href="/mail-in-service" className="w-full bg-[#D4AF37] text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center hover:scale-[1.02] transition-all block">
                {t.mailInBtn}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
