import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCYrLJRXQbiqiJRzt95dGtsYQtpiWDG3dE",
  authDomain: "movies-streaming-4d013.firebaseapp.com",
  projectId: "movies-streaming-4d013",
  storageBucket: "movies-streaming-4d013.appspot.com",
  messagingSenderId: "669166190287",
  appId: "1:669166190287:web:fca35df6ce3684b7a781ba"
};

console.log('Initializing Firebase with config:', { ...firebaseConfig, apiKey: '***' });

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } else {
    app = getApps()[0];
    console.log('Using existing Firebase app');
  }

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
  throw new Error('Failed to initialize Firebase. Please check your internet connection and try again.');
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
