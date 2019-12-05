#!/usr/bin/env node

const { printEmotionScores } = require("./emotion_score");

function cli() {
  if (process.argv.length !== 4) {
    console.log("Usage: ./cli.js gameDataJsonPath gamePropertiesCsvPath");
    return;
  }

  const gameDataJsonPath = process.argv[2],
    gamePropertiesCsvPath = process.argv[3];
  printEmotionScores(gameDataJsonPath, gamePropertiesCsvPath);
}

cli();
