const fs = require("fs");
const parse = require("csv-parse/lib/sync");

/**
 * Computes the emotion score for each game in gameData.
 * @param {*} gameData game data as returned by `loadGameData`
 * @param {*} gameProperties game properties as returned by `loadGameProperties`
 */
function computeEmotionScores(gameData, gameProperties) {
  const propertiesById = {};
  gameProperties.forEach(properties => {
    propertiesById[properties.gameId] = properties;
  });

  return gameData.map(game => {
    if (!propertiesById[game.gameId]) {
      throw Error(`No game properties for game ID ${game.gameId}`);
    }
    return _computeEmotionScore(game, propertiesById[game.gameId]);
  });
}

/** Computes the emotion score for a single game play given its data and properties. */
function _computeEmotionScore(game, properties) {
  const red = 0,
    blue = 1,
    states = game.heartRates.map(heartRate =>
      heartRate > game.thresholdHr ? red : blue
    );

  let emotionScore = 0,
    hasEnteredRed = false;
  for (let i = 1; i < states.length; i++) {
    if (states[i] === blue && states[i - 1] === red) {
      emotionScore += hasEnteredRed ? 10 : 5;
    } else if (states[i] === red && states[i - 1] === blue) {
      hasEnteredRed = true;
    }
  }
  emotionScore *= properties.scoreMultiplier;

  return {
    playDate: game.gameDate,
    gameDisplayName: properties.displayName,
    emotionScore
  };
}

/**
 * Returns an array of game data objects parsed from the given JSON file.
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
function printEmotionScores(gameDataJsonPath, gamePropertiesCsvPath) {
  const scores = computeEmotionScores(
    loadGameData(gameDataJsonPath),
    loadGameProperties(gamePropertiesCsvPath)
  );
  scores.forEach(score => {
    console.log(score.playDate);
    console.log(score.gameDisplayName);
    console.log(score.emotionScore);
  });
}

module.exports = {
  computeEmotionScores,
  loadGameData,
  loadGameProperties,
  printEmotionScores
};
