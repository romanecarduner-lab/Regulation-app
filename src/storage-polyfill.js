/**
 * L'application a été conçue dans l'environnement Claude, qui fournit une
 * API `window.storage` (get/set/delete/list) pour sauvegarder les données.
 * En dehors de cet environnement (ici, sur Vercel), cette API n'existe pas.
 *
 * Ce fichier la recrée avec `localStorage`, qui stocke les données
 * directement sur l'appareil de la personne qui utilise l'application —
 * ce qui reste cohérent avec le principe de stockage local du cahier des
 * charges. Aucune donnée n'est envoyée à un serveur.
 */
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return value === null ? null : { key, value, shared: false };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    },
    async list(prefix = "") {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
      return { keys, prefix, shared: false };
    },
  };
}
