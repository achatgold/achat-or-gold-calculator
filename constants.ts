
import { KaratConfig } from './types';

export const GRAMS_PER_TROY_OUNCE = 31.1034768;
export const LUXURY_PAYOUT_PERCENTAGE = 0.95;
export const STANDARD_PAYOUT_PERCENTAGE = 0.86;

export const SHEETS_WEBHOOK_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE";

export const KARATS: KaratConfig[] = [
  { label: '9k', value: 9, purity: 9 / 24 },
  { label: '10k', value: 10, purity: 10 / 24 },
  { label: '14k', value: 14, purity: 14 / 24 },
  { label: '18k', value: 18, purity: 18 / 24 },
  { label: '21k', value: 21, purity: 21 / 24 },
  { label: '22k', value: 22, purity: 22 / 24 },
  { label: '24k', value: 24, purity: 24 / 24 },
];

export const TRANSLATIONS = {
  fr: {
    title: "Calculateur de prix de l'or en direct",
    tagline: "Expertise locale, prix mondiaux.",
    loading: "CHARGEMENT DES COURS...",
    marketLive: "MARCHÉ EN DIRECT",
    safetyMode: "MODE SÉCURITÉ",
    updatedAt: "Actualisé le",
    disclaimerTitle: "Information Importante",
    disclaimerText: "Le prix affiché est basé sur le cours spot actuel du marché. Les paiements finaux seront ajustés selon le cours officiel au moment de la transaction dans nos bureaux de Montréal.",
    luxuryTitle: "Évaluation de Luxe",
    luxurySubtitle: "Les prix indiqués pour les évaluations de luxe représentent des montants de base. Ils s’appliquent aux pièces authentiques de grandes maisons (telles que Tiffany, Cartier, Van Cleef & Arpels), à certains articles vintage ou antiques, ainsi qu’à des bijoux sertis de pierres précieuses. Les offres finales peuvent varier à la hausse selon la marque, la condition, la rareté et les caractéristiques spécifiques de chaque pièce, après une évaluation complète en personne.",
    standardTitle: "Évaluation Standard",
    standardSubtitle: "Les prix affichés correspondent à nos taux d’achat de base. Certains articles et volumes peuvent être évalués selon des conditions particulières. Contactez-nous ou visitez-nous pour une évaluation complète.",
    purityGrade: "Grade de Pureté",
    perGram: "par gramme",
    rowTotal: "Total Ligne:",
    estTotal: "Estimation Totale",
    weightTotal: "Poids Cumulé",
    reset: "Réinitialiser",
    contactUs: "Contactez-Nous",
    unit: "gr",
    modalTitle: "Contact Achat Or Montréal",
    modalTrust: "Sans obligation. Votre estimation peut être confirmée en quelques minutes.",
    modalDesc: "Rejoignez-nous par texto, appel ou courriel. Les rendez-vous sont confirmés par message.",
    textBtn: "Textez-nous",
    callBtn: "Appelez-nous",
    emailBtn: "Courriel",
    directionsBtn: "Obtenir l'itinéraire",
    mailInBtn: "Service de rachat par la poste (Canada)",
    formLabel: "Envoyez-moi mon estimation",
    namePlaceholder: "Nom (facultatif)",
    contactPlaceholder: "Téléphone ou Courriel",
    sendBtn: "Envoyer",
    consentText: "En soumettant, vous acceptez que nous puissions vous contacter au sujet de votre estimation.",
    successMsg: "Merci. Nous vous contacterons sous peu.",
    errorContact: "Veuillez fournir un téléphone ou un courriel."
  },
  en: {
    title: "Live Gold Price Calculator",
    tagline: "Local expertise, global prices.",
    loading: "LOADING MARKET DATA...",
    marketLive: "LIVE MARKET FEED",
    safetyMode: "SAFETY MODE",
    updatedAt: "Updated at",
    disclaimerTitle: "Important Information",
    disclaimerText: "The calculated price is based on the current live spot market. Final payouts will be based on the official spot price at the exact moment of transaction in our Montreal offices.",
    luxuryTitle: "Luxury Valuation",
    luxurySubtitle: "The prices shown for luxury evaluations represent base amounts. They apply to authentic pieces from major houses (such as Tiffany, Cartier, Van Cleef & Arpels), certain vintage or antique items, as well as jewelry set with precious stones. Final offers may vary upwards based on brand, condition, rarity, and specific characteristics of each piece, following a full in-person evaluation.",
    standardTitle: "Standard Valuation",
    standardSubtitle: "The prices displayed correspond to our base purchase rates. Certain items and volumes may be evaluated under special conditions. Contact us or visit us for a full evaluation.",
    purityGrade: "Purity Grade",
    perGram: "per gram",
    rowTotal: "Row Total:",
    estTotal: "Total Estimation",
    weightTotal: "Cumulative Weight",
    reset: "Reset",
    contactUs: "Contact Us",
    unit: "g",
    modalTitle: "Contact Achat Or Montréal",
    modalTrust: "No obligation. Your estimate can be confirmed in minutes.",
    modalDesc: "Reach us by text, call, or email. Appointments are confirmed by message.",
    textBtn: "Text Us",
    callBtn: "Call Us",
    emailBtn: "Email Us",
    directionsBtn: "Get Directions",
    mailInBtn: "Mail-In Service (Canada-wide)",
    formLabel: "Send me my estimate",
    namePlaceholder: "Name (optional)",
    contactPlaceholder: "Phone or Email",
    sendBtn: "Send",
    consentText: "By submitting, you agree we may contact you about your estimate.",
    successMsg: "Thanks. We will reach out shortly.",
    errorContact: "Please provide a phone or email."
  }
};

export const CONTACT_INFO = {
  phone: "5149656130",
  email: "achatormontreal@gmail.com",
  address: "801 Rue Sherbrooke Est Suite 200, Montréal, QC H2L 0B7"
};
