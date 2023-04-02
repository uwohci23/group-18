const NO_OF_HIGH_SCORES = 10;
const HIGH_SCORES = ' top scores';

export function isHighScore(score, game, difficulty) {
    var highScores = JSON.parse(localStorage.getItem(game + HIGH_SCORES)) ?? [];
    var highScoresForCurrentDifficulty = highScores[`${difficulty}_scores`] ?? [];
    const lowestScore = highScoresForCurrentDifficulty[NO_OF_HIGH_SCORES - 1]?.score ?? 0;
    if (!(score > lowestScore)){
        return false;
    }
    return true;
}

export function isHighestScore(score, game, difficulty){
    var highScores = JSON.parse(localStorage.getItem(game + HIGH_SCORES)) ?? [];
    var highScoresForCurrentDifficulty = highScores[`${difficulty}_scores`] ?? [];
    const highestScore = highScoresForCurrentDifficulty[0]?.score ?? 0;
    if (!(score > highestScore)){
        return false;
    }
    return true;
}

export function isFastScore(score, game, difficulty) {
    var highScores = JSON.parse(localStorage.getItem(game + HIGH_SCORES)) ?? [];
    var highScoresForCurrentDifficulty = highScores[`${difficulty}_scores`] ?? [];
    const slowestScore = highScoresForCurrentDifficulty[NO_OF_HIGH_SCORES - 1]?.score ?? 9999999;
    console.log(slowestScore);
    console.log(score);
    if ((score < slowestScore)){
        return true;
    }
    return false;
}

export function isFastestScore(score, game, difficulty) {
    var highScores = JSON.parse(localStorage.getItem(game + HIGH_SCORES)) ?? [];
    var highScoresForCurrentDifficulty = highScores[`${difficulty}_scores`] ?? [];
    const fastestScore = highScoresForCurrentDifficulty[0]?.score ?? 9999999;
    if (!(score < fastestScore)){
        return false;
    }
    return true;
}


export function saveHighScore(game, difficulty, score, name) {
    var highScores = JSON.parse(localStorage.getItem(game + HIGH_SCORES));
    if(highScores == null){
        const empty_score_obj = 
        {
            easy_scores: [],
            medium_scores: [],
            hard_scores: []
        }
        localStorage.setItem(game + HIGH_SCORES, JSON.stringify(empty_score_obj));
        highScores = empty_score_obj;
    }
    var highScoresForCurrentDifficulty = highScores[`${difficulty}_scores`] ?? [];

    const newScore = { score, name };
    
    // 1. Add to list
    highScoresForCurrentDifficulty.push(newScore);
  
    // 2. Sort the list
    if(game != "Minesweeper")
        highScoresForCurrentDifficulty.sort((a, b) => b.score - a.score);
    else
    highScoresForCurrentDifficulty.sort((a, b) => a.score - b.score);
    
    // 3. Select new list
    highScoresForCurrentDifficulty.splice(NO_OF_HIGH_SCORES);
    
    // 4. Save to local storage
    highScores[`${difficulty}_scores`] = highScoresForCurrentDifficulty;
    localStorage.setItem(game + HIGH_SCORES, JSON.stringify(highScores));

    document.getElementById('submit-button').disabled = true;
    document.getElementById('restart-game').disabled = false;
    document.getElementById('go-menu').disabled = false;
};