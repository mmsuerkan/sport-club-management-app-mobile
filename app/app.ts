import { Application } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-database';

// Initialize Firebase at app startup
firebase().initializeApp({
    databaseURL: 'https://basketbolmanagementapp-default-rtdb.firebaseio.com'
}).then(() => {
    console.log("Firebase initialized successfully");
}).catch(error => {
    console.error("Firebase initialization error:", error);
});

Application.run({ moduleName: 'app-root' });