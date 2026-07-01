import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sirid.neuroassistant',
  appName: 'Neuro Assistant',
  webDir: 'out' // 🌟 This tells Capacitor to look where Next.js exports your static files
};

export default config;