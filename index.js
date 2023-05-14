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
    user: "root",
    password: "",
    multipleStatements: true, // Allow multiple statements in one query
    port: 3636,
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database", err);
    } else {
        console.log("Connected to database");
        connection.query(
            "CREATE DATABASE IF NOT EXISTS spaceodyssey; USE spaceodyssey; CREATE TABLE IF NOT EXISTS game_data (id INT AUTO_INCREMENT PRIMARY KEY, nickname VARCHAR(255) NOT NULL, level INT NOT NULL, time INT NOT NULL);",
            (err, result) => {
                if (err) {
                    console.error("Error creating database or table", err);
                } else {
                    console.log("Database and table created successfully");
                }
            }
        );
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

// Route for getting game data
app.get("/game_data", (req, res) => {
    const sql = "SELECT * FROM game_data ORDER BY level DESC, time ASC";

    connection.query(sql, (err, result) => {
        if (err) {
            console.error("Error getting data", err);
            res.status(500).json({ message: "Error getting data" });
        } else {
            console.log("Data retrieved successfully");
            res.status(200).json(result);
        }
    });
});

// Start server
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
