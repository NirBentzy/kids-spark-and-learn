
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.af18c2efb7804ffe98ea60ad26ad98e4',
  appName: 'kids-spark-and-learn',
  webDir: 'dist',
  server: {
    url: 'https://af18c2ef-b780-4ffe-98ea-60ad26ad98e4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null
    }
  }
};

export default config;
