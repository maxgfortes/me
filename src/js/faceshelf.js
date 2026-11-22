import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

let playerName = "";

const nameRegex = /^\p{L}+(?:[ '\-]\p{L}+)*$/u;

const welcome = document.getElementById("welcome");
const startBtn = document.getElementById("startBtn");

const questionsArea = document.getElementById("questions");

const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const nameField = document.getElementById("nameField");

const questions = [
    {
        title: "Pergunta 1/17",
        text: "Você gosta de mim?",
        correct: "yes"
    },
    {
        title: "Pergunta 2/17",
        text: "Você fala inglês?",
        correct: "yes"
    },
    {
        title: "Pergunta 3/17",
        text: "Você gostaria de viajar comigo?",
        correct: "yes"
    },
    {
        title: "Pergunta 4/17",
        text: "Você pesa menos de 64kg?",
        correct: "yes"
    },
    {
        title: "Pergunta 5/17",
        text: "Você gosta que seu namorado a chame de mommy?",
        correct: "yes"
    },
    {
        title: "Pergunta 6/17",
        text: "Você tem interesse em BDSM?",
        correct: "yes"
    },
    {
        title: "Pergunta 7/17",
        text: "Sua cor de pele é escala 4 ou abaixo na Escala de Fitzpatrick?",
        correct: "no"
    },
    {
        title: "Pergunta 8/17",
        text: "Você já teve pensamentos suicidas, automutilação ou depressão?",
        correct: "yes"
    },
    {
        title: "Pergunta 9/17",
        text: "Você acha ridículo homens/garotos que jogam como hobby?",
        correct: "no"
    },
    {
        title: "Pergunta 10/17",
        text: "Você se sente sozinha às vezes?",
        correct: "yes"
    },
    {
        title: "Pergunta 11/17",
        text: "Você tem hipersexualidade?",
        correct: "yes"
    },
    {
        title: "Pergunta 12/17",
        text: "Você gosta de dias quentes?",
        correct: "no"
    },
    {
        title: "Pergunta 13/17",
        text: "Você é loira naturalmente?",
        correct: "yes"
    },
    {
        title: "Pergunta 14/17",
        text: "Você se considera uma pessoa pobre de espírito?",
        correct: "no"
    },
    {
        title: "Pergunta 15/17",
        text: "Você gosta do estilo preppy, college 2005/2012?",
        correct: "yes"
    },
    {
        title: "Pergunta 16/17",
        text: "Você tem problemas, mas acha que ainda assim escolheria tentar melhorar se isso machucasse alguém que você ama?",
        correct: "yes"
    },
    {
        title: "Pergunta 17/17",
        text: "Você gostaria de ser feliz?",
        correct: "yes"
    },
];

let currentQuestion = 0;
let score = 0;

function startQuestions() {
    const value = nameField.value.trim();

    if (value.length < 2 || value.length > 30 || !nameRegex.test(value)) {
        nameField.classList.add("invalid");
        nameField.focus();
        return;
    }

    nameField.classList.remove("invalid");
    playerName = value;

    welcome.classList.add("hidden");
    questionsArea.classList.remove("hidden");

    showQuestion();
}

function showQuestion() {
    questionTitle.textContent = questions[currentQuestion].title;
    questionText.textContent = questions[currentQuestion].text;
}

function answerQuestion(answer) {

    if (questions[currentQuestion].correct === answer) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion >= questions.length) {
        showResult();
        return;
    }

    showQuestion();
}

function showResult() {

    const percentage = Math.round((score / questions.length) * 100);
    saveScore(playerName, score, percentage);

    questionTitle.textContent = "Você acabou!";
    questionText.textContent = "Sua compatibilidade foi de 0%";

    yesBtn.classList.add("hidden");
    noBtn.classList.add("hidden");

    let number = 0;

    const animation = setInterval(function() {

        if (number >= percentage) {
            clearInterval(animation);

            if (percentage >= 75) {
                questionText.textContent +=
                    " Se sua compatibilidade foi mais de 75%, mande uma mensagem no meu Instagram. @maxgfortes";
            }
            return;
        }

        number++;
        questionText.textContent = `Sua compatibilidade foi de ${number}%`;

    }, 20);
}

async function saveScore(name, points, percentage) {
    try {
        await addDoc(collection(db, "faceshelfScores"), {
            name: name,
            score: points,
            percentage: percentage,
            date: serverTimestamp()
        });
    } catch (err) {
        console.error("Erro ao salvar score:", err);
    }
}

startBtn.addEventListener("click", startQuestions);

nameField.addEventListener("keydown", function(e) {
    if (e.key === "Enter") startQuestions();
});

yesBtn.addEventListener("click", function() {
    answerQuestion("yes");
});

noBtn.addEventListener("click", function() {
    answerQuestion("no");
});