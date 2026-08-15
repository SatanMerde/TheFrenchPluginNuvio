# The French Plugin pour Nuvio 🇫🇷

Le meilleur plugin regroupant les sources de streaming francophones (Films, Séries, Animes) pour l'application Nuvio.

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

Actuellement, ce plugin contient le **squelette** pour la source suivante :
- **Wiflix (FR)** : *(En cours de développement - La structure est prête, mais l'extraction vidéo doit encore être implémentée)*

*Note: N'hésitez pas à contribuer pour ajouter d'autres sources comme Vostfree, French Stream, etc.*

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
Pour recompiler le plugin après une modification (par exemple après avoir mis à jour Wiflix) :
```bash
npm run build wiflix
```
Le fichier compilé se trouvera dans le dossier `providers/`.

### Tester en local
Démarrez le serveur local :
```bash
npm start
```
Puis, utilisez le "Plugin Tester" dans l'application Nuvio avec l'URL de votre réseau local (ex: `http://192.168.1.X:3000/manifest.json`).
