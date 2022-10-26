//On récupère le h2 #question
const question = document.getElementById("question");

//On récupère les différents choix #choix-text dans un tableau
const choices = Array.from(document.getElementsByClassName("choice-text"));
// console.log(choices);

//on récupère les éléments du 'HUD' (head-up display) :
//text qui indique 1/3 et le score + la progress bar
const progressText = document.getElementById("progressText");

const progressBarFull = document.getElementById("progressBarFull");

// (objet)
let currentQuestion = {};

//pour ajouter un délai : si le user a répondu, on crée un délai avant qu'il puisse répondre à nouveau
let acceptingAnwswers = false;

let score = 0;
let results = {
  wad: 0,
  web: 0,
  game: 0,
  AI: 0,
};
//quelle question 
let questionCounter = 0;

//copie du set de questions : on prendra les questions depuis ce tableau et on les enlèvera pour être surs que la question ne soit pas posée plusieurs fois
let availableQuestions = [];

// set des questions (tableau d'objets)
let questions = [
    {
        question: "You consider yourself as a creative person and you love working on your personal projects eg. Photography/writing etc. ",
        choice0:"Absolutely",
        choice1:"It depends on my mood",
        choice2:"Not really, but I try to",
        choice3:"I'm not creative at all",
        answer: ["web", "game", "wad", "AI"]
    },
    {
        question: "You can easily motivate yourself even you have a difficult task to perform",
        choice0:"Yes ! I like challenges",
        choice1:"I will do my best but I know my limits",
        choice2:"Yes, I consider myself a patient and diligent person",
        choice3:"Not really, I prefer to focus on the tasks I can do best",
        answer: ["game", "wad", "AI", "web"] 
    },

    {
        question: "Do you enjoy working in a team?",
        choice0:"I am a rather solitary person",
        choice1:"If I am the leader, why not!",
        choice2:"Yes, the best ideas come from a team",
        choice3:"Yes, if the roles of each are well defined",
        answer: ["AI","game", "web", "wad"]
    },

    {
        question: "Do you like learning new things?",
        choice0:"I already know everything",
        choice1:"I hate learning new things",
        choice2:"Learning something new every day is my leitmotiv",
        choice3:"I like to focus on one subject and learn everything about it",
        answer: ["", "", "game", "AI"]
    },

    {
        question: "You spend a lot of your free time exploring various random topics that pique your interest.",
        choice0:"I don't have any free time !",
        choice1:"I prefer to spend my free time playing video games",
        choice2:"Yes, I love to drown in the meanders of the internet",
        choice3:"Free time is for resting !",
        answer: ["AI", "game", "web", "wad"]
    },

    {
        question: "You often make a backup plan for a backup plan",
        choice0:"Yes, I consider risk management to be an important part of any plan!",
        choice1:"Knowing how to improvise, that's real talent!",
        choice2:"A good plan A is more than enough",
        choice3:"It depends on the importance of the project",
        answer: ["wad", "web", "game", "AI"]
    },

    {
        question: "You usually stay calm, even under a lot of pressure.",
        choice0:"I'm more of a nervous person",
        choice1:"I stay calm and relax the atmosphere",
        choice2:"If I feel I am too stressed, I go outside to get some fresh air",
        choice3:"Working under pressure is not something for me",
        answer: ["wad", "web", "game", "AI"]
    },

    
    {
        question: "You Easily come up with ideas and enjoy developing them",
        choice0:"Yes, I like to be in charge of projects",
        choice1:"I prefer to listen to other people's ideas and help them realize them",
        choice2:"When I have an idea, I prefer to deploy it by myself and not talk too much about it around me",
        choice3:"I don't have many ideas",
        answer: ["game", "wad", "web","AI"]
    },
    
    {
        question: "You are more inclined to follow your head than your heart",
        choice0:"Both must be listened to",
        choice1:"Yes, I am a rather rational person",
        choice2:"I always listen to my emotions and intuition first",
        choice3:"I think emotions cause us to make bad decisions",
        answer: ["game", "wad", "web", "AI"]
    },

    {
        question: "Do you like visiting museums?",
        choice0:"Yes ! The museum of Modern art is my favorite !",
        choice1:"I love going to the museum, especially when they offer a virtual reality tour!",
        choice2:"Museum of sciences and Industry is the best !",
        choice3:"No, I don't really like it",
        answer: ["web", "game", "AI", "wad"]
    },

   {
        question: "You think the world would be a better place if people relied more on rationality and less on their feelings",
        choice0:"It is not rationality that offers so many beauties in the world...",
        choice1:"Certainly! If every decision made was first evaluated using IT tools, we wouldn't be where we are today!",
        choice2:"Probably more rationality would not hurt ",
        choice3:"I think the world would be better off if there were more sources of fun!",
        answer: ["web", "AI", "wad", "game"]
    },
    

];

// CONSTANTES nécessaires pour le jeu lui-même

//Combien vaut une bonne réponse ?
const CORRECT_BONUS = 10;

//À combien de questions le user doit-il répondre pour compléter le quizz ?
const MAX_QUESTIONS = 6;

startGame = () => {

    questionCounter = 0;
    
    score = [];
    availableQuestions = [...questions]; //[...questions] permet de faire une full copie du tableau "questions" (si on fait juste "= questions" le lien sera référenciel !)
    console.log(availableQuestions);
    getNewQuestion();

};

getNewQuestion = () => {
    //s'il n'y a plus de question disponible, on renvoie vers une page de fin
    if(availableQuestions === 0 || questionCounter >= MAX_QUESTIONS){
        //on stocke le tableau de résultat final dans le local storage grâce à la méthode "setItem" (on caste le tableau en string grâce à la méthode JSON.stringify )
        localStorage.setItem('results', JSON.stringify(results));
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
        const selectedAnswer = e.target.dataset['number'];
        results[currentQuestion.answer[selectedAnswer]] += 1;
        console.log(results);
        // console.log(selectedAnswer == currentQuestion.answer)
        //style "incorrect par défaut"
        // const classToApply = "incorrect";
        // if(selectedAnswer == currentQuestion.answer){
        //     classToApply = "correct";
        // }
        //en version ternaire : 
        // const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        // console.log(classToApply);
        // if (classToApply == "correct"){
        //     incrementScore(CORRECT_BONUS);
        // }

        // selectedChoice.parentElement.classList.add(classToApply);

        //on doit supprimer la classe pour ne pas qu'elle reste d'une question à l'autre. Mais si on le fait directement après l'avoir ajouté, on ne voit rien ! Donc on a mis avant un set TimeOut
        setTimeout( ()=>{
            // selectedChoice.parentElement.classList.remove(classToApply);
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