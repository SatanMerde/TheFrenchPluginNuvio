# The French Plugin pour Nuvio 🇫🇷

Le meilleur plugin regroupant les sources de streaming francophones (Films, Séries, Animes) pour l'application Nuvio.

---

> ⚠️ **Avertissement & Projet IA**
> 
> L'intégralité de ce projet a été créée et structurée **exclusivement à l'aide d'une Intelligence Artificielle**.
> Par conséquent, il est possible que vous rencontriez des bugs, des erreurs ou des sources temporairement inaccessibles.
> 
> 💡 **Signaler un bug ou faire une suggestion :**
> Si vous rencontrez un dysfonctionnement ou souhaitez proposer l'ajout d'une nouvelle source, n'hésitez pas à **[ouvrir une Issue sur GitHub](https://github.com/SatanMerde/TheFrenchPluginNuvio/issues)** ou à soumettre une Pull Request ! Les contributions de la communauté sont les bienvenues.

---

## 📦 Installation dans Nuvio

Pour installer ce plugin dans votre application Nuvio :

1. Ouvrez l'application Nuvio.
2. Allez dans les **Paramètres**.
3. Cherchez la section **Addons** (ou Plugins).
4. Copiez et collez l'URL suivante (Manifest) pour l'ajouter :
   ```
   https://raw.githubusercontent.com/SatanMerde/TheFrenchPluginNuvio/main/manifest.json
   ```

## 🌐 Sources incluses (Statut)

Actuellement, ce plugin contient la structure et les templates pour les 10 sources suivantes :
- **Wiflix**
- **French Stream**
- **Vostfree** (Spécialisé Animes)
- **Darkino**
- **Cpasbien**
- **Empire Streaming**
- **PapaDuStream**
- **VoirSeries**
- **HDSS**
- **Sokroflix**

*(Toutes ces sources sont configurées avec le template d'extraction Nuvio. La communauté peut contribuer et ajuster les sélecteurs de scraping selon l'évolution des sites cibles).*

## 💻 Pour les développeurs

Ce projet utilise l'architecture officielle `nuvio-providers` avec le moteur Hermes.

### Prérequis
- Node.js (v18+)

### Installation locale
```bash
git clone https://github.com/SatanMerde/TheFrenchPluginNuvio.git
cd TheFrenchPluginNuvio
npm install
```

### Compiler les sources
Pour recompiler un provider spécifique (ex: Wiflix) ou tous les providers :
```bash
npm run build wiflix
# ou pour tout compiler :
npm run build
```
Les fichiers compilés se trouvent dans le dossier `providers/`.

### Tester en local
Démarrez le serveur local :
```bash
npm start
```
Puis, utilisez le **Plugin Tester** dans l'application Nuvio avec l'URL de votre réseau local (ex: `http://192.168.1.X:3000/manifest.json`).

## 🤝 Contributions & Retours
Toutes les contributions sont appréciées ! N'hésitez pas à forker le projet et proposer vos améliorations via les Pull Requests ou à signaler tout problème via l'onglet [Issues](https://github.com/SatanMerde/TheFrenchPluginNuvio/issues).
