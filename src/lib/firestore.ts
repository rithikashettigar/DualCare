'use client';

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Firestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {
  FirestorePermissionError,
  type SecurityRuleContext,
} from '@/firebase/errors';

export type User = {
  id: string;
  userType: 'caregiver' | 'endUser';
  name: string;
  email: string;
  language: string;
  status: 'Active' | 'Inactive';
  lastActivity: string;
};

export type Medicine = {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  time: string;
};

export type Task = {
  id: string;
  userId: string;
  description: string;
  time: string;
};

// User Functions
export const addUser = (db: Firestore, user: Omit<User, 'id'>) => {
  const userCollection = collection(db, 'users');
  addDoc(userCollection, user).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userCollection.path,
      operation: 'create',
      requestResourceData: user,
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const updateUser = (db: Firestore, userId: string, data: Partial<Omit<User, 'id'>>) => {
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


// Medicine Functions
export const addMedicine = (db: Firestore, userId: string, medicine: Omit<Medicine, 'id' | 'userId'>) => {
    const medicineCollection = collection(db, `users/${userId}/medicines`);
    addDoc(medicineCollection, { ...medicine, userId }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: medicineCollection.path,
            operation: 'create',
            requestResourceData: { ...medicine, userId },
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });
};

export const updateMedicine = (db: Firestore, userId: string, medicineId: string, data: Partial<Omit<Medicine, 'id'>>) => {
    const medicineDoc = doc(db, `users/${userId}/medicines`, medicineId);
    updateDoc(medicineDoc, data).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: medicineDoc.path,
            operation: 'update',
            requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });
}

export const deleteMedicine = (db: Firestore, userId: string, medicineId: string) => {
    const medicineDoc = doc(db, `users/${userId}/medicines`, medicineId);
    deleteDoc(medicineDoc).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: medicineDoc.path,
            operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });
}

// Task Functions
export const addTask = (db: Firestore, userId: string, task: Omit<Task, 'id' | 'userId'>) => {
    const taskCollection = collection(db, `users/${userId}/tasks`);
    addDoc(taskCollection, { ...task, userId }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: taskCollection.path,
            operation: 'create',
            requestResourceData: { ...task, userId },
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });
}

export const updateTask = (db: Firestore, userId: string, taskId: string, data: Partial<Omit<Task, 'id'>>) => {
    const taskDoc = doc(db, `users/${userId}/tasks`, taskId);
    updateDoc(taskDoc, data).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: taskDoc.path,
            operation: 'update',
            requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });
}

export const deleteTask = (db: Firestore, userId: string, taskId: string) => {
    const taskDoc = doc(db, `users/${userId}/tasks`, taskId);
    deleteDoc(taskDoc).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: taskDoc.path,
            operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });
}
