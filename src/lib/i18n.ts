import { useLanguageStore } from '../store/languageStore';

type Translations = Record<string, Record<string, string>>;

const dictionary: Translations = {
  FR: {
    "Shop": "Boutique",
    "Collections": "Collections",
    "Our Story & Origin Fields": "Notre Histoire et Origines",
    "Checkout Terminal & Cart": "Caisse & Panier",
    "Profile & Ledger": "Profil & Grand Livre",
    "Search...": "Rechercher...",
    "Sign In": "Se Connecter",
    "Sign Out": "Se Déconnecter",
    "Your cart is empty.": "Votre panier est vide.",
    "Subtotal": "Sous-total",
    "Proceed to Secure Checkout": "Procéder au Paiement Sécurisé",
    "Warmth Reimagined": "La Chaleur Réinventée",
    "Explore Collection": "Explorer la Collection",
    "View Details": "Voir les Détails",
    "Add to Cart": "Ajouter au Panier",
    "My Orders": "Mes Commandes",
    "Wishlist": "Liste de Souhaits",
    "Settings": "Paramètres",
    "Gross Sizing Subtotal": "Sous-total Brut",
    "Aggregate Total": "Total Agrégé",
    "Confirm Dispatch": "Confirmer l'Expédition",
    "Transaction ID": "ID de Transaction"
  },
  ES: {
    "Shop": "Tienda",
    "Collections": "Colecciones",
    "Our Story & Origin Fields": "Nuestra Historia",
    "Checkout Terminal & Cart": "Caja y Carrito",
    "Profile & Ledger": "Perfil y Libro Mayor",
    "Search...": "Buscar...",
    "Sign In": "Iniciar Sesión",
    "Sign Out": "Cerrar Sesión",
    "Your cart is empty.": "Tu carrito está vacío.",
    "Subtotal": "Subtotal",
    "Proceed to Secure Checkout": "Proceder al Pago Seguro",
    "Warmth Reimagined": "Calidez Reimaginada",
    "Explore Collection": "Explorar Colección",
    "View Details": "Ver Detalles",
    "Add to Cart": "Añadir al Carrito",
    "My Orders": "Mis Pedidos",
    "Wishlist": "Lista de Deseos",
    "Settings": "Ajustes",
    "Gross Sizing Subtotal": "Subtotal Bruto",
    "Aggregate Total": "Total Agregado",
    "Confirm Dispatch": "Confirmar Envío",
    "Transaction ID": "ID de Transacción"
  },
  DE: {
    "Shop": "Geschäft",
    "Collections": "Kollektionen",
    "Our Story & Origin Fields": "Unsere Geschichte",
    "Checkout Terminal & Cart": "Kasse & Warenkorb",
    "Profile & Ledger": "Profil & Hauptbuch",
    "Search...": "Suchen...",
    "Sign In": "Anmelden",
    "Sign Out": "Abmelden",
    "Your cart is empty.": "Ihr Warenkorb ist leer.",
    "Subtotal": "Zwischensumme",
    "Proceed to Secure Checkout": "Zur sicheren Kasse gehen",
    "Warmth Reimagined": "Wärme neu konzipiert",
    "Explore Collection": "Kollektion erkunden",
    "View Details": "Details ansehen",
    "Add to Cart": "In den Warenkorb",
    "My Orders": "Meine Bestellungen",
    "Wishlist": "Wunschzettel",
    "Settings": "Einstellungen",
    "Gross Sizing Subtotal": "Brutto-Zwischensumme",
    "Aggregate Total": "Gesamtsumme",
    "Confirm Dispatch": "Versand bestätigen",
    "Transaction ID": "Transaktions-ID"
  }
};

export function useTranslation() {
  const { language } = useLanguageStore();

  const t = (text: string) => {
    if (language === 'EN') return text;
    return dictionary[language]?.[text] || text;
  };

  return { t, language };
}
