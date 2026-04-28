import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAd7Ho1hmwKjhRSPjY38KLDu-TV0OcjgTI",
  authDomain: "ngo-connect-ba871.firebaseapp.com",
  projectId: "ngo-connect-ba871",
  appId: "1:1080295855865:web:06d2718db5c65185adb428"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
