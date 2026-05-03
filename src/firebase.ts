import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// CONFIGURACIÓN DE FIREBASE PARA C8L MUSIC AI
// El ID del proyecto fue proporcionado por el usuario: gen-lang-client-0744582882
const firebaseConfig = {
  apiKey: "AIzaSyDoWO_U1mu1wYF8jBEWKnjmjg27S1vC-Xg",
  authDomain: "gen-lang-client-0744582882.firebaseapp.com",
  projectId: "gen-lang-client-0744582882",
  storageBucket: "gen-lang-client-0744582882.firebasestorage.app",
  messagingSenderId: "216451866663",
  appId: "1:216451866663:web:04936ac4af98ddb25dee02"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
