import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// 🔒 Configuração da conexão com o Neon
const pool = new Pool({
  host: "SEU_HOST_DO_NEON",
  user: "SEU_USUARIO",
  password: "SUA_SENHA",
  database: "SEU_BANCO",
  port: 5432,
  ssl: true
});

// 🧠 Teste de conexão
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({ msg: "API conectada ao Neon!", hora: result.rows[0].now });
});

// 🧾 Rota para listar doadores
app.get("/doadores", async (req, res) => {
  const result = await pool.query("SELECT * FROM doadores");
  res.json(result.rows);
});

// ➕ Rota para adicionar doador
app.post("/doadores", async (req, res) => {
  const { nome, cpf } = req.body;
  await pool.query("INSERT INTO doadores (nome, cpf) VALUES ($1, $2)", [nome, cpf]);
  res.send("Doador adicionado com sucesso!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
