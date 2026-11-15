import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    getCountFromServer,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const cache = "hasVisited";
const expiration = 9 * 60 * 1000;

async function updateCounter() {
    const counter = document.getElementById("visitCounter");

    const cached = Number(localStorage.getItem(cache));
    const now = Date.now();

    if (cached && now - cached < expiration) {
        return;
    }

    try {
        await addDoc(collection(db, "visitCounters"), {
            date: serverTimestamp()
        });

        localStorage.setItem(cache, now.toString());

    } catch (error) {
        console.error("Erro ao registrar visita:", error);
        localStorage.removeItem(cache);
    }
}

function readCounter() {
    const counter = document.getElementById("visitCounter");

    const visitsRef = collection(db, "visitCounters");

    onSnapshot(visitsRef, (snapshot) => {
        counter.textContent = snapshot.size.toLocaleString("pt-BR");
    }, (error) => {
        console.error("Erro ao atualizar contador:", error);
    });
}

readCounter();
updateCounter();