import { create } from 'zustand';
import { useCurrencyStore, CurrencyCode } from './currencyStore';

export type LanguageCode = 'EN' | 'FR' | 'ES' | 'DE' | 'IT' | 'PT' | 'NL' | 'RU' | 'JA' | 'ZH' | 'KO' | 'AR' | 'HI' | 'TR';

const defaultCurrencyForLanguage: Record<LanguageCode, CurrencyCode> = {
  EN: 'USD', FR: 'EUR', ES: 'EUR', DE: 'EUR', IT: 'EUR', PT: 'BRL', 
  NL: 'EUR', RU: 'RUB', JA: 'JPY', ZH: 'CNY', KO: 'KRW', AR: 'AED', 
  HI: 'INR', TR: 'TRY'
};

interface LanguageState {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'EN',
  setLanguage: (language) => {
    set({ language });
    
    // Automatically switch currency based on language selected
    const currency = defaultCurrencyForLanguage[language];
    if (currency) {
      useCurrencyStore.getState().setCurrency(currency);
    }
    
    // Trigger Google Translate manually if script has loaded
    const triggerTranslation = () => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        // Map language code to Google Translate code string
        const gtLang = language === 'ZH' ? 'zh-CN' : language.toLowerCase();
        if (select.value !== gtLang) {
          select.value = gtLang;
          select.dispatchEvent(new Event('change'));
        }
      }
    };
    
    // Slight delay to ensure DOM is ready or GT is loaded
    setTimeout(triggerTranslation, 100);
  },
}));
