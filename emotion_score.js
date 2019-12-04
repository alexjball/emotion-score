const fs = require("fs");
const parse = require("csv-parse/lib/sync");

/**
 * Returns an array of game data parsed from the given JSON file.
 *
 * The JSON file may be a single game data object or an array of such objects.
 */
function loadGameData(gameDataJsonPath) {
  const gameData = JSON.parse(fs.readFileSync(gameDataJsonPath, "utf8"));
  return (Array.isArray(gameData) ? gameData : [gameData]).map(game => ({
    gameDate: game.game_date,
    gameId: game.game_id,
    thresholdHr: game.threshold_hr,
    heartRates: game.heartRates
  }));
}

/** Returns an array of game property objects parsed from the given CSV file. */
function loadGameProperties(gamePropertiesCsvPath) {
  const properties = parse(fs.readFileSync(gamePropertiesCsvPath, "utf8"), {
    columns: true,
    cast: true
  });
  return properties.map(game => ({
    gameId: game.game_id,
    displayName: game.display_name,
    scoreMultiplier: game.score_multiplier
  }));
}

/** Prints the emotion score to the console. */
function printEmotionScore(scores) {
  scores.forEach(score => {
    console.log(score.playDate);
    console.log(score.gameDisplayName);
    console.log(score.emotionScore);
    console.log();
  });
}

module.exports = {
  loadGameData,
  loadGameProperties,
  printEmotionScore
};
