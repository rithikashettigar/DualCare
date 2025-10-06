'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    // If already initialized, return the SDKs with the already initialized App
    return getSdks(getApp());
  }
  
  // In a local development environment, Next.js can render components multiple times,
  // so we need to be careful not to re-initialize Firebase.
  // We'll use the presence of the NEXT_PUBLIC_FIREBASE_PROJECT_ID env var to determine
  // if we're in a Firebase App Hosting environment.
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    // In a deployed environment, initializeApp() without args will use the
    // auto-configured environment variables.
    const firebaseApp = initializeApp();
    return getSdks(firebaseApp);
  } else {
    // In a local environment, we'll use the config object.
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
