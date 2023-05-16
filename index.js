#!/usr/bin/env node
const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const uri = "";
let db;

// Initialize connection once
(async () => {
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db = client.db("spaceodyssey");
})();

// Route for inserting game data
app.post("/game_data", async (req, res) => {
    const { nickname, level, time } = req.body;

    if (!nickname || !level || !time) {
        res.status(400).json({ message: "Missing required data" });
    } else {
        try {
            await db
                .collection("game_data")
                .insertOne({ nickname, level, time });
            console.log("Data inserted successfully");
            res.status(200).json({ message: "Data inserted successfully" });
        } catch (err) {
            console.error("Error inserting data", err);
            res.status(500).json({ message: "Error inserting data" });
        }
    }
});

// Route for getting game data
app.get("/game_data", async (req, res) => {
    try {
        const result = await db
            .collection("game_data")
            .find()
            .sort({ level: -1, time: 1 })
            .toArray();
        console.log("Data retrieved successfully");
        res.status(200).json(result);
    } catch (err) {
        console.error("Error getting data", err);
        res.status(500).json({ message: "Error getting data" });
    }
});

// Route for getting profile data
app.get("/profile_data", async (req, res) => {
    const { nickname } = req.query;

    if (!nickname) {
        res.status(400).json({ message: "Missing required data" });
    } else {
        try {
            const result = await db
                .collection("game_data")
                .find({ nickname })
                .toArray();
            console.log("Data retrieved successfully");
            res.status(200).json(result);
        } catch (err) {
            console.error("Error getting data", err);
            res.status(500).json({ message: "Error getting data" });
        }
    }
});

// Start server
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
