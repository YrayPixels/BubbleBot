import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import dotenv from 'dotenv';

dotenv.config()

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APPID,
};

// Initialize Firebase
const fireapp = initializeApp(firebaseConfig);

const db = getFirestore(fireapp);

const storage = {
    get: async (key) => {
        const docRef = doc(db, "storage", key);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("db (get)", docSnap.data().value);
            return docSnap.data().value;
        } else {
            console.log("No such document!");
            return null;
        }
    },

    set: async (key, value) => {
        const docRef = doc(db, "storage", key);
        await setDoc(docRef, { value });
        console.log(`db (set) ${key}:`, value);
    },

    delete: async (key) => {
        const docRef = doc(db, "storage", key);
        await deleteDoc(docRef);
        console.log(`db (delete) ${key}`);
    },

    clearAll: async () => {
        // Firestore doesn't allow collection deletes directly.
        // You'd need to list all docs and delete them manually.
        const storageCollection = await import("firebase/firestore/lite").then(m => m.collection(db, "storage"));
        const snapshot = await import("firebase/firestore/lite").then(m => m.getDocs(storageCollection));

        const batchDelete = import("firebase/firestore/lite").then(m => m.writeBatch(db));

        for (const docSnap of snapshot.docs) {
            const docRef = doc(db, "storage", docSnap.id);
            (await batchDelete).delete(docRef);
        }

        (await batchDelete).commit();
        console.log("db (clearAll): Storage cleared");
    }
};

export default storage;