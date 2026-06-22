import { create } from 'zustand';

export type CurrencyCode = 
  | 'USD' | 'EUR' | 'GBP' | 'SEK' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' 
  | 'HKD' | 'NZD' | 'INR' | 'BRL' | 'ZAR' | 'MXN' | 'NOK' | 'SGD' | 'KRW' 
  | 'TRY' | 'RUB' | 'AED' | 'SAR' | 'THB' | 'IDR' | 'MYR' | 'PHP' | 'VND' 
  | 'PLN' | 'ARS' | 'CLP' | 'COP' | 'NGN';

interface CurrencyState {
  currency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  symbols: Record<CurrencyCode, string>;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (priceInUSD: number, forceDecimals?: boolean) => string;
  getVatRate: () => number;
}

const rates: Record<CurrencyCode, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, SEK: 10.45, JPY: 153.5, AUD: 1.52, CAD: 1.37, CHF: 0.91,
  CNY: 7.24, HKD: 7.83, NZD: 1.67, INR: 83.5, BRL: 5.12, ZAR: 18.5, MXN: 17.0, NOK: 10.9,
  SGD: 1.35, KRW: 1370, TRY: 32.5, RUB: 92.5, AED: 3.67, SAR: 3.75, THB: 37.0, IDR: 16200,
  MYR: 4.75, PHP: 57.5, VND: 25400, PLN: 3.95, ARS: 890, CLP: 935, COP: 3900, NGN: 1500
};

const symbols: Record<CurrencyCode, string> = {
  USD: '$', EUR: '€', GBP: '£', SEK: 'kr ', JPY: '¥', AUD: 'A$', CAD: 'C$', CHF: 'CHF ',
  CNY: '¥', HKD: 'HK$', NZD: 'NZ$', INR: '₹', BRL: 'R$', ZAR: 'R', MXN: '$', NOK: 'kr ',
  SGD: 'S$', KRW: '₩', TRY: '₺', RUB: '₽', AED: 'د.إ ', SAR: '﷼ ', THB: '฿', IDR: 'Rp ',
  MYR: 'RM', PHP: '₱', VND: '₫', PLN: 'zł ', ARS: '$', CLP: '$', COP: '$', NGN: '₦'
};

const vatRates: Record<CurrencyCode, number> = {
  USD: 0.08,   // Generic US standard
  EUR: 0.20,   // General EU Average
  GBP: 0.20,   // UK
  SEK: 0.25,   // Sweden
  NOK: 0.25,   // Norway
  CHF: 0.081,  // Switzerland
  AUD: 0.10,   // Australia
  CAD: 0.05,   // Generic Canada GST
  NZD: 0.15,   // New Zealand
  JPY: 0.10,   // Japan
  ZAR: 0.15,   // South Africa
  SGD: 0.09,   // Singapore
  INR: 0.18,   // India average
  CNY: 0.13,   // China
  PLN: 0.23,   // Poland
  BRL: 0.17,   // Brazil
  MXN: 0.16,   // Mexico
  KRW: 0.10,   // South Korea
  TRY: 0.20,   // Turkey
  RUB: 0.20,   // Russia
  AED: 0.05,   // UAE
  SAR: 0.15,   // Saudi Arabia
  THB: 0.07,   // Thailand
  IDR: 0.11,   // Indonesia
  MYR: 0.06,   // Malaysia
  PHP: 0.12,   // Philippines
  VND: 0.10,   // Vietnam
  ARS: 0.21,   // Argentina
  CLP: 0.19,   // Chile
  COP: 0.19,   // Colombia
  NGN: 0.075,  // Nigeria
  HKD: 0.00,   // Hong Kong (No VAT)
};

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: 'USD',
  rates,
  symbols,
  setCurrency: (currency) => set({ currency }),
  formatPrice: (priceInUSD: number, forceDecimals?: boolean) => {
    const { currency, rates, symbols } = get();
    const rate = rates[currency];
    const symbol = symbols[currency];
    const convertedPrice = priceInUSD * rate;
    
    if (!forceDecimals && ['SEK', 'NOK', 'JPY', 'KRW', 'IDR', 'VND', 'ARS', 'CLP', 'COP'].includes(currency)) {
      return `${symbol}${Math.round(convertedPrice).toLocaleString()}`;
    }
    
    const rounded = Math.round(convertedPrice * 100) / 100;
    const isInteger = rounded % 1 === 0;
    const showDec = forceDecimals || !isInteger;
    
    return `${symbol}${rounded.toLocaleString(undefined, { 
      minimumFractionDigits: showDec ? 2 : 0, 
      maximumFractionDigits: showDec ? 2 : 0 
    })}`;
  },
  getVatRate: () => {
    const { currency } = get();
    return vatRates[currency] ?? 0;
  }
}));
