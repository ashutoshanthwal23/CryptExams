import 'dotenv/config';

export default {
  expo: {
    name: "CryptExams",
    slug: "CryptExams",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      backenedUrl: process.env.BACKEND_API_URL,
      sendMsgToNumber: process.env.MOBILE_NUMBER
    }
  }
}
