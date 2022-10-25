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
        question: "You consider yourself as a creative person and you love working on your personal projects eg. Photography/writing etc. ",
        choice1:"Absolutely",
        choice2:"It depends on my mood",
        choice3:"Not really, but I try to",
        choice4:"I'm not creative at all",
        answer: {"1" : ["web", "game"], "2" : ["wad"], "3" : ["wad"], "4" : ["AI"]} 
    },
    {
        question: "You can easily motivate yourself even you have a difficult task to perform",
        choice1:"Yes ! I like challenges",
        choice2:"I will do my best but I know my limits",
        choice3:"Yes, I consider myself a patient and diligent person",
        choice4:"Not really, I prefer to focus on the tasks I can do best",
        answer: {"1" : ["game", "wad", "AI"], "2" : ["web", "wad"], "3" : ["web", "game", "wad", "AI"], "4" : ["web"]} 
    },

    {
        question: "Do you enjoy working in a team?",
        choice1:"I am a rather solitary person",
        choice2:"If I am the leader, why not!",
        choice3:"Yes, the best ideas come from a team",
        choice4:"Yes, if the roles of each are well defined",
        answer: {"1" : ["AI"], "2" : ["game", "web"], "3" : ["wad", "game", "web"], "4" : ["wad", "game", "web", "AI"]}
    },

    {
        question: "Do you like learning new things?",
        choice1:"I already know everything",
        choice2:"I hate learning new things",
        choice3:"Learning something new every day is my leitmotiv",
        choice4:"I like to focus on one subject and learn everything about it",
        answer: {"1" : [], "2" : [], "3" : ["wad", "game", "web", "AI"], "4" : ["wad", "game", "web", "AI"]}
    },

    {
        question: "You spend a lot of your free time exploring various random topics that pique your interest.",
        choice1:"I don't have any free time !",
        choice2:"I prefer to spend my free time playing video games",
        choice3:"Yes, I love to drown in the meanders of the internet",
        choice4:"Free time is for resting !",
        answer: {"1" : ["AI"], "2" : ["game"], "3" : ["web"], "4" : ["wad"]}
    },

    {
        question: "You often make a backup plan for a backup plan",
        choice1:"Yes, I consider risk management to be an important part of any plan!",
        choice2:"Knowing how to improvise, that's real talent!",
        choice3:"A good plan A is more than enough",
        choice4:"It depends on the importance of the project",
        answer: {"1" : ["wad"], "2" : ["web"], "3" : ["game"], "4" : ["AI"]}
    },

    {
        question: "You usually stay calm, even under a lot of pressure.",
        choice1:"I'm more of a nervous person",
        choice2:"I stay calm and relax the atmosphere",
        choice3:"If I feel I am too stressed, I go outside to get some fresh air",
        choice4:"Working under pressure is not something for me",
        answer: {"1" : ["wad"], "2" : ["web"], "3" : ["game"], "4" : ["AI"]}
    },

    {
        question: "You usually stay calm, even under a lot of pressure",
        choice1:"I'm more of a nervous person",
        choice2:"I stay calm and relax the atmosphere",
        choice3:"If I feel I am too stressed, I go outside to get some fresh air",
        choice4:"Working under pressure is not something for me",
        answer: {"1" : ["wad"], "2" : ["web"], "3" : ["game"], "4" : ["AI"]}
    },

    {
        question: "You Easily come up with ideas and enjoy developing them",
        choice1:"Yes, I like to be in charge of projects",
        choice2:"I prefer to listen to other people's ideas and help them realize them",
        choice3:"When I have an idea, I prefer to deploy it by myself and not talk too much about it around me",
        choice4:"I don't have many ideas",
        answer: {"1" : ["game"], "2" : ["wad"], "3" : ["web"], "4" : ["AI"]}
    },
    
    {
        question: "You are more inclined to follow your head than your heart",
        choice1:"Both must be listened to",
        choice2:"Yes, I am a rather rational person",
        choice3:"I always listen to my emotions and intuition first",
        choice4:"I think emotions cause us to make bad decisions",
        answer: {"1" : ["game"], "2" : ["wad"], "3" : ["web"], "4" : ["AI"]}
    },

    {
        question: "Do you like visiting museums?",
        choice1:"Yes ! The museum of Modern art is my favorite !",
        choice2:"I love going to the museum, especially when they offer a virtual reality tour!",
        choice3:"Museum of sciences and Industry is the best !",
        choice4:"No, I don't really like it",
        answer: {"1" : ["web"], "2" : ["game"], "3" : ["AI"], "4" : ["wad"]}
    },

   {
        question: "You think the world would be a better place if people relied more on rationality and less on their feelings",
        choice1:"It is not rationality that offers so many beauties in the world...",
        choice2:"Certainly! If every decision made was first evaluated using IT tools, we wouldn't be where we are today!",
        choice3:"Probably more rationality would not hurt ",
        choice4:"I think the world would be better off if there were more sources of fun!",
        answer: {"1" : ["web"], "2" : ["AI"], "3" : ["wad"], "4" : ["game"]}
    },
    

];

// CONSTANTES nécessaires pour le jeu lui-même

//Combien vaut une bonne réponse ?
const CORRECT_BONUS = 10;

//À combien de questions le user doit-il répondre pour compléter le quizz ?
const MAX_QUESTIONS = 6;

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