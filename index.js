const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "spaceodyssey",
    password: "spaceiscool",
    database: "spaceodyssey",
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database", err);
    } else {
        console.log("Connected to database");
    }
});

// Route for inserting game data
app.post("/game_data", (req, res) => {
    const { nickname, level, time } = req.body;

    if (!nickname || !level || !time) {
        res.status(400).json({ message: "Missing required data" });
    } else {
        const sql =
            "INSERT INTO game_data (nickname, level, time) VALUES (?, ?, ?)";
        const values = [nickname, level, time];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error inserting data", err);
                res.status(500).json({ message: "Error inserting data" });
            } else {
                console.log("Data inserted successfully");
                res.status(200).json({ message: "Data inserted successfully" });
            }
        });
    }
});

// Start server
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
