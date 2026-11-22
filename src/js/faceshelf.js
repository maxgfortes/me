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
    { title: "Pergunta 1/16", text: "Você gosta de mim?", correct: "yes" },
    { title: "Pergunta 2/16", text: "Você fala inglês, ou topa praticar comigo?", correct: "yes" },
    { title: "Pergunta 3/16", text: "Você gosta de conversar por horas sobre qualquer coisa, até sobre nada?", correct: "yes" },
    { title: "Pergunta 4/16", text: "Você acha que um relacionamento precisa ser amizade antes de tudo?", correct: "yes" },
    { title: "Pergunta 5/16", text: "Você gosta de brincar e fazer piada com quem ama, sem ofender de verdade?", correct: "yes" },
    { title: "Pergunta 6/16", text: "Quando algo te incomoda, você consegue falar com calma em vez de explodir ou xingar?", correct: "yes" },
    { title: "Pergunta 7/16", text: "Você respeita quando alguém diz 'isso eu não quero que você faça ou poste'?", correct: "yes" },
    { title: "Pergunta 8/16", text: "Você acha ridículo homens/garotos que jogam como hobby?", correct: "no" },
    { title: "Pergunta 9/16", text: "Você se sente bem em momentos tranquilos, com música, filme e silêncio juntos?", correct: "yes" },
    { title: "Pergunta 10/16", text: "Você gosta de frio, chuva e dias nublados?", correct: "yes" },
    { title: "Pergunta 11/16", text: "Você gosta do estilo preppy, college 2005/2012?", correct: "yes" },
    { title: "Pergunta 12/16", text: "Você se sente sozinha às vezes?", correct: "yes" },
    { title: "Pergunta 13/16", text: "Você consegue ouvir sobre medos, inseguranças e passado difícil sem rir nem julgar?", correct: "yes" },
    { title: "Pergunta 14/16", text: "Você toparia construir algo comigo (um projeto, um mundo, uma rotina), mesmo devagar?", correct: "yes" },
    { title: "Pergunta 15/16", text: "Mesmo com medo, você escolheria tentar melhorar, pensando em quem você ama?", correct: "yes" },
    { title: "Pergunta 16/16", text: "Você gostaria de ser feliz?", correct: "yes" },
];

// voce nunca vai ser como a anastasia foi para mim.
// mas eu to disposto a tentar...

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
