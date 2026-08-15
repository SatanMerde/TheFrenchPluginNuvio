# The French Plugin pour Nuvio 🇫🇷

Le meilleur plugin regroupant les sources de streaming francophones (Films, Séries, Animes) pour l'application Nuvio.

---

> ⚠️ **Avertissement & Projet Communautaire**
> 
> Ce plugin intègre des extracteurs et scrapers web en direct pour les plateformes francophones.
> 
> 💡 **Signaler un bug ou faire une suggestion :**
> Si vous rencontrez un dysfonctionnement ou souhaitez proposer l'ajout d'une nouvelle source, n'hésitez pas à **[ouvrir une Issue sur GitHub](https://github.com/SatanMerde/TheFrenchPluginNuvio/issues)** ou à soumettre une Pull Request ! Les contributions sont les bienvenues.

---

## 📦 Installation dans Nuvio

Pour installer ce plugin dans votre application Nuvio :

1. Ouvrez l'application Nuvio.
2. Allez dans les **Paramètres** (Settings).
3. Rendez-vous dans la section **Plugins** ou **Addons**.
4. Cliquez sur **Ajouter un dépôt** et collez l'URL directe du manifeste :
   ```
   https://raw.githubusercontent.com/SatanMerde/TheFrenchPluginNuvio/refs/heads/main/manifest.json
   ```
5. Cliquez sur **Installer le dépôt de plugin**.

---

## 🌐 Sources incluses (15 Sources Actives)

Toutes les sources sont équipées du moteur de **scraping web direct**, de la résolution des titres français via l'API TMDB, et de l'extraction des lecteurs vidéo réels :

| Source | Type de Contenu | Mode de Fonctionnement | Hébergeurs Pris en Charge |
| :--- | :--- | :--- | :--- |
| **French Stream** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Uqload, Sibnet, Vudeo, Vidmoly...* |
| **Vostfree** | 🇯🇵 Animes & Séries | ⚡ Scraper Direct HTML + TMDB | *Sibnet, Uqload, Vidmoly...* |
| **Wiflix** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Vudeo, Uqload, Streamtape...* |
| **Darkino** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Multi-Host, Vidmoly, Uqload...* |
| **Cpasbien** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Streaming VF / Lecteurs rapides* |
| **Empire Streaming** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Multi-qualités FHD/HD* |
| **PapaDuStream** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Uqload, Vudeo, Doodstream...* |
| **VoirSeries** | 📺 Séries uniquement | ⚡ Scraper Direct Saisons/Épisodes | *Sibnet, Uqload, Vidmoly...* |
| **HDSS** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Lecteurs HD/FHD* |
| **Sokroflix** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Lecteurs streaming VF* |
| **VFStreaming** | 🎬 Films (100% VF) | ⚡ Scraper Direct HTML + TMDB | *Lecteurs VF sans pub* |
| **Novaflix** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Multi-sources VF/VOSTFR* |
| **Filmstoon** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Lecteurs VF/VOSTFR* |
| **K-Streaming** | 🎬 Films & 📺 Séries | ⚡ Scraper Direct HTML + TMDB | *Lecteurs VF* |
| **Choupox** | 🎬 Films | ⚡ Scraper Direct HTML + TMDB | *Lecteurs directs* |

---

## ⚡ Fonctionnalités du Moteur

- **🇫🇷 Priorité Absolue à la VF :** Les flux en version française (`VF` et `MULTI`) sont automatiquement triés et affichés en tête de liste.
- **✨ Classement par Résolution :** Tri intelligent de la plus haute à la plus basse définition ($4\text{K} > 1080\text{p} > 720\text{p} > 480\text{p}$).
- **🎯 Filtrage Automatique des Flux Vides :** Si une source ne possède pas le titre ou si un média n'est pas supporté (ex: film sur une source séries), elle n'affiche aucun bouton inutile dans Nuvio.
- **🛡️ Tolérance aux Pannes :** Gestion dynamique des changements d'adresses et protections anti-bots.

---

## 💻 Pour les Développeurs

Ce projet utilise l'architecture officielle `nuvio-providers` optimisée pour le moteur Hermes.

### Prérequis
- Node.js (v18+)

### Installation locale & Contribution
```bash
git clone https://github.com/SatanMerde/TheFrenchPluginNuvio.git
cd TheFrenchPluginNuvio
npm install
```

### Compiler les sources
Pour recompiler un provider spécifique (ex: `wiflix`) ou tous les providers :
```bash
# Compiler un seul provider :
npm run build wiflix

# Compiler l'intégralité des 15 providers :
npm run build
```
Les fichiers compilés se trouvent dans le dossier `providers/`.

---

## 🤝 Contributions
Toutes les contributions sont appréciées ! N'hésitez pas à forker le projet, ouvrir une Issue ou soumettre vos Pull Requests pour ajuster les sélecteurs de scraping selon l'évolution des sites.
