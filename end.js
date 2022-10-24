
//on définit le onclick du button "save"
const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
//on récupère le score qui est dans le local Storage grâce à la méthohde "getItem" et on l'insère dans le h1 "final score"
const mostRecentScore = localStorage.getItem('mostRecentScore');


const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
console.log(highScores);

//on définit le nombre de places sur le podium des highscores
const MAX_HIGH_SCORES = 5;





finalScore.innerText = mostRecentScore;




username.addEventListener('keyup', () =>{
    // console.log(username.value);
    saveScoreBtn.disabled = !username.value; 
})
saveHighScore = (e) =>{
    
    
    console.log("clicked the save button");
    
    //on fait cela pour pouvoir afficher correctement le console log, sinon il s'affiche très brièvement avant de soumettre vers la nouvelle page avec le form action
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value
    };

    highScores.push(score);
    
    //on trie le tableau par ordre croissant (si b.score > a.score, place b.score avant a.score )
    highScores.sort((a,b) => {
        return b.score - a.score;
    });  //raccourci : highScores.sort((a,b) => b.score - a.score);
   
    //On coupe du tableau tout ce qui se trouve après l'indice donné
    highScores.splice(MAX_HIGH_SCORES);

    localStorage.setItem('highScores', JSON.stringify(highScores))
    // console.log(highScores);
    
    //Quand on a fini d'enregistrer le score dans le tableau, on retourne à la page d'accueil
    window.location.assign("/");
    
    
    
}