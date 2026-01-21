
import React from 'react';
import { KaratConfig } from '../types';

interface KaratInputProps {
  karat: KaratConfig;
  grams: string;
  ratePerGram: number;
  onChange: (value: string) => void;
  labels: {
    purityGrade: string;
    perGram: string;
    rowTotal: string;
    unit: string;
  };
}

const KaratInput: React.FC<KaratInputProps> = ({ karat, grams, ratePerGram, onChange, labels }) => {
  return (
    <div className="bg-[#141414] border border-gray-800/50 rounded-2xl p-5 transition-all hover:border-[#D4AF37]/40 hover:bg-[#1a1a1a] group">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-2xl font-black text-white group-hover:text-[#D4AF37] transition-colors leading-none">
            {karat.label}
          </h3>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.15em] mt-1">{labels.purityGrade}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#D4AF37]">
            ${ratePerGram.toFixed(2)}
          </p>
          <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">{labels.perGram}</p>
        </div>
      </div>
      
      <div className="relative group/input">
        <input
          type="number"
          value={grams}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-4 pl-5 pr-14 text-white font-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all text-xl placeholder:text-gray-800"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 font-black text-sm uppercase tracking-tighter">
          {labels.unit}
        </span>
      </div>

      <div className="mt-5 flex justify-between items-center bg-black/20 p-3 rounded-lg border border-gray-900">
        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-600">{labels.rowTotal}</span>
        <span className="text-white font-black text-sm">
          ${(Number(grams || 0) * ratePerGram).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

export default KaratInput;
