const words = [
    "La récolte", "La fleur", "Le fruit", "La cabosse de cacao", "La peste",
    "La plantation", "Le producteur", "Produire", "La forêt", "La graine (la semance)",
    "Couper", "Croître", "La croissance", "Cultiver", "La culture", "Couper à la main", "Manuellement"
];

const translations = [
    "La cosecha", "La flor", "El fruto", "La mazorca de cacao", "La plaga",
    "La plantación", "El productor", "Producir", "La selva", "La semilla",
    "Cortar", "Crecer", "El crecimiento", "Cultivar", "El cultivo",
    "Recoger a mano", "Manualmente"
];

const verbesAConjuger = ["Producir", "Cortar", "Crecer", "Cultivar", "Recoger"];
const pronoms = ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"];

const futureEndings = {
    "yo": "é",
    "tú": "ás",
    "él/ella": "á",
    "nosotros": "emos",
    "vosotros": "éis",
    "ellos": "án"
};

let currentIndex = 0;
let score = 0;
let userAnswers = [];
let currentExercise = 1;
let selectedPronoun = "";
let selectedPronouns = []; // Nouvelle liste pour enregistrer chaque pronom par question

function displayWord() {
    if (currentExercise === 1) {
        document.getElementById("wordList").innerText = words[currentIndex];
    } else {
        selectedPronoun = pronoms[Math.floor(Math.random() * pronoms.length)];
        selectedPronouns.push(selectedPronoun); // Enregistrer le pronom pour cette question
        const infinitive = verbesAConjuger[currentIndex];
        document.getElementById("wordList").innerText = `${selectedPronoun} ${infinitive}`;
    }
    document.getElementById("userInput").value = "";
}

function normalize(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/[.,;:!?\s]/g, "");
}

function checkAnswer() {
    const userAnswer = normalize(document.getElementById("userInput").value);

    if (currentExercise === 1) {
        const correctAnswer = normalize(translations[currentIndex]);
        userAnswers.push(document.getElementById("userInput").value);
        if (userAnswer === correctAnswer) score++;
    } else {
        const infinitive = verbesAConjuger[currentIndex];
        const correctAnswer = normalize(infinitive + futureEndings[selectedPronoun]);
        userAnswers.push(document.getElementById("userInput").value);
        if (userAnswer === correctAnswer) score++;
    }

    currentIndex++;
    if (currentIndex < (currentExercise === 1 ? words.length : verbesAConjuger.length)) {
        displayWord();
    } else {
        if (currentExercise === 1) {
            displayResultEx1();
        } else {
            displayResultEx2();
        }
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
}

function displayResultEx1() {
    const resultDiv = document.getElementById("result");
    const percentage = ((score / words.length) * 100).toFixed(2);

    resultDiv.innerHTML = `
        <p>Votre score pour l'exercice 1 est de ${percentage}% (${score}/${words.length}).</p>
        <p>Correction complète :</p>
        <ul>
            ${words.map((word, index) => {
                const isCorrect = normalize(userAnswers[index]) === normalize(translations[index]);
                return `
                    <li>
                        <strong>${word} :</strong> ${translations[index]} 
                        (Votre réponse : <span style="color: ${isCorrect ? 'black' : 'red'};">
                            ${userAnswers[index] || "pas de réponse"}
                        </span>)
                    </li>
                `;
            }).join('')}
        </ul>
        <button onclick="startExercise2()" class="button">Passer à l'exercice 2</button>
        <button onclick="restartTest()" class="button-red">Recommencer l'exercice 1</button>
    `;
    resultDiv.style.display = "block";
}

// Fonction qui met en majuscule la première lettre du pronom
function capitalizePronoun(pronoun) {
    return pronoun.charAt(0).toUpperCase() + pronoun.slice(1); // Met la première lettre en majuscule
}

// Fonction pour afficher la question de l'exercice
function displayWord() {
    const questionSection = document.getElementById("questionSection");
    const userInputSection = document.getElementById("userInputSection");

    if (currentExercise === 1) {
        // Afficher le mot en français, pas de modification nécessaire ici
        document.getElementById("wordList").innerText = words[currentIndex];
        questionSection.style.display = "block";
        userInputSection.style.display = "block";
    } else {
        // Sélectionner un pronom aléatoire parmi la liste
        selectedPronoun = pronoms[Math.floor(Math.random() * pronoms.length)];
        selectedPronouns.push(selectedPronoun); // Enregistrer le pronom pour cette question

        // Afficher le verbe à l'infinitif en minuscule et le pronom en majuscule
        const infinitive = verbesAConjuger[currentIndex];
        document.getElementById("wordList").innerText = `${capitalizePronoun(selectedPronoun)} ${infinitive.toLowerCase()}`;
        
        questionSection.style.display = "block";
        userInputSection.style.display = "block";
    }
    document.getElementById("userInput").value = "";
}

function startExercise2() {
    currentExercise = 2;
    currentIndex = 0;
    score = 0;
    userAnswers = [];
    selectedPronouns = []; // Réinitialiser pour l'exercice 2
    document.getElementById("result").style.display = "none";
    document.getElementById("questionText").innerText = "Conjuguez le verbe suivant au futur avec le pronom :";
    displayWord();
}

function displayResultEx2() {
    const resultDiv = document.getElementById("result");
    const percentage = ((score / verbesAConjuger.length) * 100).toFixed(2);

    resultDiv.innerHTML = `
        <p>Votre score pour l'exercice 2 est de ${percentage}% (${score}/${verbesAConjuger.length}).</p>
        <p>Correction complète :</p>
        <ul>
            ${verbesAConjuger.map((verb, index) => {
                const pronoun = selectedPronouns[index];
                const correctAnswer = normalize(verb.toLowerCase() + futureEndings[pronoun]);
                const isCorrect = normalize(userAnswers[index]) === correctAnswer;

                // Appliquer capitalizePronoun au pronom
                const capitalizedPronoun = capitalizePronoun(pronoun);

                return `
                    <li>
                        <strong>${capitalizedPronoun} ${verb.toLowerCase()} (futur) :</strong> ${verb.toLowerCase() + futureEndings[pronoun]}
                        (Votre réponse : <span style="color: ${isCorrect ? 'black' : 'red'};">
                            ${userAnswers[index] || "pas de réponse"}
                        </span>)
                    </li>
                `;
            }).join('')}
        </ul>
        <button onclick="startExercise1()" class="button">Revenir à l'exercice 1</button>
        <button onclick="startExercise2()" class="button-red">Recommencer l'exercice 2</button>
    `;
    resultDiv.style.display = "block";
}

function startExercise1() {
    currentExercise = 1;
    currentIndex = 0;
    score = 0;
    userAnswers = [];
    document.getElementById("result").style.display = "none";
    document.getElementById("questionText").innerText = "Traduisez le mot suivant en espagnol :";
    displayWord();
}

function restartTest() {
    score = 0;
    currentIndex = 0;
    userAnswers = [];
    selectedPronouns = [];
    currentExercise = 1;
    document.getElementById("result").style.display = "none";
    document.getElementById("questionText").innerText = "Traduisez le mot suivant en espagnol :";
    displayWord();
}

// Initialiser le test
displayWord();