const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());

let db = null;
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server is running");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

app.post("/players/", async (request, response) => {
  const dbDetails = request.body;
  const { playerName, jerseyNumber, role } = dbDetails;
  const addPlayerQuery = `INSERT INTO cricket_team(playerName,jerseyNumber,role)
    VALUES(${playerName},${jerseyNumber},${role});`;
  const dbArray = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

initializeDBAndServer();
