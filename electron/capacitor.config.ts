import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4ebc4e12f17c4d3c8504747682a74b1a',
  appName: 'my-asus-voice-buddy',
  webDir: 'dist',
  server: {
    url: 'https://4ebc4e12-f17c-4d3c-8504-747682a74b1a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    App: {
      launchShowDuration: 0
    }
  }
};

export default config;