const fs = require("fs");
const {
  loadGameData,
  loadGameProperties
} = require("./emotion_score");

const testGameDataPath = "/tmp/test-game-data.json",
  sampleGameDataPath = "sample-game-data.json",
  sampleGamePropertiesPath = "sample-game-properties.csv";

const testGameData = JSON.parse(fs.readFileSync(sampleGameDataPath, "utf8"));

const testLoadedGameData = {
  gameDate: testGameData.game_date,
  gameId: testGameData.game_id,
  thresholdHr: testGameData.threshold_hr,
  heartRates: testGameData.heartRates
};

describe("loadGameData", () => {
  it("loads individual game data", () => {
    fs.writeFileSync(testGameDataPath, JSON.stringify(testGameData));
    const loadedData = loadGameData(testGameDataPath);
    expect(loadedData).toEqual([testLoadedGameData]);
  });

  it("loads array of game data", () => {
    fs.writeFileSync(
      testGameDataPath,
      JSON.stringify([testGameData, testGameData])
    );

    const loadedData = loadGameData(testGameDataPath);
    expect(loadedData).toEqual([testLoadedGameData, testLoadedGameData]);
  });
});

describe("loadGameProperties", () => {
  it("loads game properties", () => {
    const createProperties = (id, name, multiplier) => ({
      gameId: id,
      displayName: name,
      scoreMultiplier: multiplier
    });
    const loadedProperties = loadGameProperties(sampleGamePropertiesPath);
    expect(loadedProperties).toEqual([
      createProperties("BRICK_BREAKER", "Brick Breaker", 3),
      createProperties("MINI_METRO", "Mini Metro", 1),
      createProperties("HIBACHI_HERO", "Hibachi Hero", 4),
      createProperties("TIKI_TAKA_SOCCER", "Tiki Taka Soccer", 3)
    ]);
  });
});
