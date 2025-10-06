'use client';

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {
  FirestorePermissionError,
  type SecurityRuleContext,
} from '@/firebase/errors';

export type User = {
  id: string;
  name: string;
  email: string;
  userType: 'caregiver' | 'endUser';
  language: string;
  status: 'Active' | 'Inactive';
  lastActivity: string;
};

// Function to add a new user to Firestore
export const addUser = (db: Firestore, user: Omit<User, 'id'>) => {
  const usersCollection = collection(db, 'users');
  addDoc(usersCollection, user).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: usersCollection.path,
      operation: 'create',
      requestResourceData: user,
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', permissionError);
  });
};

// Function to update an existing user in Firestore
export const updateUser = (db: Firestore, userId: string, data: Partial<User>) => {
  const userDoc = doc(db, 'users', userId);
  updateDoc(userDoc, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userDoc.path,
      operation: 'update',
      requestResourceData: data,
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', permissionError);
  });
};

// Function to delete a user from Firestore
export const deleteUser = (db: Firestore, userId: string) => {
  const userDoc = doc(db, 'users', userId);
  deleteDoc(userDoc).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userDoc.path,
      operation: 'delete',
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', permissionError);
  });
};
