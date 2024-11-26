import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
] as const;

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required Firebase configuration. Please add the following to your .env file:\n${missingEnvVars.join('\n')}`
  );
}

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

console.log('Initializing Firebase with config:', { 
  ...firebaseConfig, 
  apiKey: '***' 
});

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');

  // Initialize Firebase services
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');
  
  db = getFirestore(app);
  console.log('Firestore initialized successfully');

  // Set persistence to local
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Auth persistence set successfully');
    })
    .catch((error) => {
      console.error('Error setting auth persistence:', error);
    });

} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

// Function to check Firebase connection
export const checkFirebaseConnection = async () => {
  try {
    // First check if we have internet connection
    const online = navigator.onLine;
    console.log('Internet connection status:', online ? 'online' : 'offline');
    
    if (!online) {
      throw new Error('No internet connection');
    }

    // Try to get the current user
    const currentUser = auth.currentUser;
    console.log('Current user status:', currentUser ? 'logged in' : 'not logged in');
    
    // Try a simple Firebase operation
    await auth.updateCurrentUser(currentUser);
    console.log('Firebase connection test successful');
    
    return true;
  } catch (error) {
    console.error('Firebase connection check failed:', error);
    return false;
  }
};

export { auth, db };
