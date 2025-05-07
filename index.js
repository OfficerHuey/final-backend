const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

app.use(cors());
app.use(express.json());

app.get("/api/items", async (req, res) => {
  const result = await pool.query("SELECT * FROM items ORDER BY id ASC");
  res.json(result.rows);
});

app.post("/api/items", async (req, res) => {
  const { name } = req.body;
  const result = await pool.query(
    "INSERT INTO items(name) VALUES($1) RETURNING *",
    [name]
  );
  res.status(201).json(result.rows[0]);
});

app.delete("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM items WHERE id = $1", [id]);
  res.sendStatus(204);
});

app.listen(5000, () => console.log("Backend running on port 5000"));
