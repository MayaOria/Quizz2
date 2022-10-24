//On récupère le h2 #question
const question = document.getElementById("question");

//On récupère les différents choix #choix-text dans un tableau
const choices = Array.from(document.getElementsByClassName("choice-text"));
// console.log(choices);

//on récupère les éléments du 'HUD' (head-up display) :
//text qui indique 1/3 et le score + la progress bar
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");
const progressBarFull = document.getElementById("progressBarFull");

// (objet)
let currentQuestion = {};

//pour ajouter un délai : si le user a répondu, on crée un délai avant qu'il puisse répondre à nouveau
let acceptingAnwswers = false;

let score = 0;

//quelle question 
let questionCounter = 0;

//copie du set de questions : on prendra les questions depuis ce tableau et on les enlèvera pour être surs que la question ne soit pas posée plusieurs fois
let availableQuestions = [];

// set des questions (tableau d'objets)
let questions = [
    {
        question: "Inside which HTML element do we put the Javascript ?",
        choice1:"<script>",
        choice2:"<javascript>",
        choice3:"<js>",
        choice4:"<scripting>",
        answer: 1
    },
    {
        question: "What is the correct syntax for referring to an external script called 'xxx.js'",
        choice1:"<script href= 'xxx.js'>",
        choice2:"<script name= 'xxx.js'>",
        choice3:"<script src= 'xxx.js'>",
        choice4:"<script file= 'xxx.js'>",
        answer: 3
    },

    {
        question: "How do you write 'Hello world' in an alert box ?",
        choice1:"msgBox('Hello world')",
        choice2:"alertBox('Hello world')",
        choice3:"msg('Hello world')",
        choice4:"alert('Hello world')",
        answer: 4
    },

];

// CONSTANTES nécessaires pour le jeu lui-même

//Combien vaut une bonne réponse ?
const CORRECT_BONUS = 10;

//À combien de questions le user doit-il répondre pour compléter le quizz ?
const MAX_QUESTIONS = 3;

startGame = () => {

    questionCounter = 0;
    
    score = 0;
    availableQuestions = [...questions]; //[...questions] permet de faire une full copie du tableau "questions" (si on fait juste "= questions" le lien sera référenciel !)
    console.log(availableQuestions);
    getNewQuestion();

};

getNewQuestion = () => {
    //s'il n'y a plus de question disponible, on renvoie vers une page de fin
    if(availableQuestions === 0 || questionCounter >= MAX_QUESTIONS){
        //on stocke le score final dans le local storage grâce à la méthode "setItem"
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign("/end.html")
    }

    questionCounter++;
    //on set le "Question x/3 en fonction du questionCounter"
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    //On update la width de la progressBarFull en fonction de l'avancée en question
    // console.log((questionCounter/MAX_QUESTIONS)*100);
    // console.log(progressBarFull);

    // progressBarFull.style.width = (questionCounter/MAX_QUESTIONS)*100; => ne fonctionne pas pcq la valeur doit être en % !
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`;

    //random question => Math.floor(Math.random()* nb de question)
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);

    //on set la currentQuestion
    currentQuestion = availableQuestions[questionIndex];
    console.log(currentQuestion);
    //on remplacer l'innerText de la div "question" par la propriété "question" de la currentQuestion
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        //on récupère le data-number de chaque choice
        const number = choice.dataset['number'];

        //on remplace le texte de l'élément 'choice' par le currentQuestion[choice1, 2, 3, 4]
        choice.innerText = currentQuestion['choice'+number];
        //on réussit à accéder aux propriétés choice1, 2, ... grace aux [] => Pourquoi ???
        console.log(currentQuestion[`choice${number}`])
    });
    //splice (where?, how many ?)
    availableQuestions.splice(questionIndex, 1);
    //to allow the user to answer when the question is loaded
    acceptingAnwswers = true;

};

choices.forEach(choice => {
    choice.addEventListener("click", e =>{
        // console.log(e.target);
        //si on n'est pas prêts à recevoir la question, on ignore le fait qu'il y a eu un click
        if(!acceptingAnwswers) return;

        acceptingAnwswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        
        // console.log(selectedAnswer == currentQuestion.answer)
        //style "incorrect par défaut"
        // const classToApply = "incorrect";
        // if(selectedAnswer == currentQuestion.answer){
        //     classToApply = "correct";
        // }
        //en version ternaire : 
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        console.log(classToApply);
        if (classToApply == "correct"){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        //on doit supprimer la classe pour ne pas qu'elle reste d'une question à l'autre. Mais si on le fait directement après l'avoir ajouté, on ne voit rien ! Donc on a mis avant un set TimeOut
        setTimeout( ()=>{
            selectedChoice.parentElement.classList.remove(classToApply);
            //quand on a répondu a une question, on en a une nouvelle
            getNewQuestion();
        }, 500);

        });



    });


incrementScore = num => {
    score +=num;
    scoreText.innerText = score;
}

startGame();