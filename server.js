const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid'); // Importa a função uuidv4 para gerar UUIDs
const db = require("./app/models");
const Sacola = db.sacolas
const app = express();


// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Todas tabelas Dropadas e Resicronizado o banco");
// });

db.sequelize.sync().then(() => {
  console.log("Todas tabelas Dropadas e Resicronizado o banco");
});
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let sacolas = [];
let assistidos = [];
let doadores = [];
let frenteAssistida = [];

app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo à Sacolinhas Happy Day 2023 - Bola de Neve Church." });
});

// Rotas para a entidade "Sacolas"
app.get("/sacolas", (req, res) => {
  // Use o modelo Sacola do Sequelize para buscar todas as sacolas no banco de dados
  Sacola.findAll()
    .then((sacolas) => {
      // Converta os dados retornados pelo Sequelize em um array JSON
      const sacolasJSON = sacolas.map((sacola) => sacola.toJSON());

      // Retorne os dados como resposta
      res.json({ sacolas: sacolasJSON });
    })
    .catch((error) => {
      console.error("Erro ao buscar sacolas:", error);
      res.status(500).json({ message: "Erro ao buscar sacolas" });
    });
});


app.post("/sacolas", (req, res) => {
  const { codigo, nome, conteudo, assistenteSocialId, frenteAssistidaId, assistidoId, doadorId } = req.body;

  // Use a instância do modelo Sacola para procurar um registro com base no código
  Sacola.findOne({ where: { codigo } })
    .then((sacolaExistente) => {
      if (sacolaExistente) {
        return res.status(400).json({ message: "Código de sacola já existe" });
      }

      // Crie uma nova instância do modelo Sacola com os dados fornecidos
      Sacola.create({
        codigo,
        nome,
        conteudo,
        assistenteSocialId,
        frenteAssistidaId,
        assistidoId,
        doadorId
      })
        .then((novaSacola) => {
          res.status(201).json({ message: "Sacola criada com sucesso", sacola: novaSacola });
        })
        .catch((error) => {
          console.error("Erro ao criar sacola:", error);
          res.status(500).json({ message: "Erro ao criar sacola" });
        });
    })
    .catch((error) => {
      console.error("Erro ao verificar a existência de sacola:", error);
      res.status(500).json({ message: "Erro ao verificar a existência de sacola" });
    });
});



app.put("/sacolas/:id", (req, res) => {
  const { id } = req.params;
  const { codigo, nome, conteudo, assistenteSocialId, frenteAssistidaId, assistidoId, doadorId } = req.body;

  const sacolaIndex = sacolas.findIndex((sacola) => sacola.id === id);

  if (sacolaIndex === -1) {
    return res.status(404).json({ message: "Sacola não encontrada" });
  }

  // Garante que os campos não informados sejam preenchidos com strings vazias
  const assistenteSocial = assistenteSocialId || "";
  const frenteAssistida = frenteAssistidaId || "";
  const assistido = assistidoId || "";
  const doador = doadorId || "";

  sacolas[sacolaIndex] = { id, codigo, nome, conteudo, assistenteSocial, frenteAssistida, assistido, doador };

  res.json({ message: "Sacola atualizada com sucesso", sacola: sacolas[sacolaIndex] });
});


app.delete("/sacolas/:id", (req, res) => {
  const { id } = req.params;

  const sacolaIndex = sacolas.findIndex((sacola) => sacola.id === id);

  if (sacolaIndex === -1) {
    return res.status(404).json({ message: "Sacola não encontrada" });
  }

  sacolas.splice(sacolaIndex, 1);

  res.json({ message: "Sacola excluída com sucesso" });
});

// Rotas para a entidade "Assistidos"
app.get("/assistidos", (req, res) => {
  res.json({ assistidos });
});

app.post("/assistidos", (req, res) => {
  const { nome, idade } = req.body;
  const id = uuidv4(); // Gera um UUID único
  const novoAssistido = { id, nome, idade };
  assistidos.push(novoAssistido);
  res.status(201).json({ message: "Assistido criado com sucesso", assistido: novoAssistido });
});

app.put("/assistidos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, idade } = req.body;

  const assistidoIndex = assistidos.findIndex((assistido) => assistido.id === id);

  if (assistidoIndex === -1) {
    return res.status(404).json({ message: "Assistido não encontrado" });
  }

  assistidos[assistidoIndex] = { id, nome, idade };

  res.json({ message: "Assistido atualizado com sucesso", assistido: assistidos[assistidoIndex] });
});

app.delete("/assistidos/:id", (req, res) => {
  const { id } = req.params;

  const assistidoIndex = assistidos.findIndex((assistido) => assistido.id === id);

  if (assistidoIndex === -1) {
    return res.status(404).json({ message: "Assistido não encontrado" });
  }

  assistidos.splice(assistidoIndex, 1);

  res.json({ message: "Assistido excluído com sucesso" });
});

// Rotas para a entidade "Doador"
app.get("/doadores", (req, res) => {
  res.json({ doadores });
});

app.post("/doadores", (req, res) => {
  const { nome, email } = req.body;
  const id = uuidv4(); // Gera um UUID único
  const novoDoador = { id, nome, email };
  doadores.push(novoDoador);
  res.status(201).json({ message: "Doador criado com sucesso", doador: novoDoador });
});

app.put("/doadores/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  const doadorIndex = doadores.findIndex((doador) => doador.id === id);

  if (doadorIndex === -1) {
    return res.status(404).json({ message: "Doador não encontrado" });
  }

  doadores[doadorIndex] = { id, nome, email };

  res.json({ message: "Doador atualizado com sucesso", doador: doadores[doadorIndex] });
});

app.delete("/doadores/:id", (req, res) => {
  const { id } = req.params;

  const doadorIndex = doadores.findIndex((doador) => doador.id === id);

  if (doadorIndex === -1) {
    return res.status(404).json({ message: "Doador não encontrado" });
  }

  doadores.splice(doadorIndex, 1);

  res.json({ message: "Doador excluído com sucesso" });
});

// Rotas para a entidade "Frente Assistida"
app.get("/frente-assistida", (req, res) => {
  res.json({ frenteAssistida });
});

app.post("/frente-assistida", (req, res) => {
  const { nome, endereco } = req.body;
  const id = uuidv4(); // Gera um UUID único
  const novaFrenteAssistida = { id, nome, endereco };
  frenteAssistida.push(novaFrenteAssistida);
  res.status(201).json({ message: "Frente Assistida criada com sucesso", frenteAssistida: novaFrenteAssistida });
});

app.put("/frente-assistida/:id", (req, res) => {
  const { id } = req.params;
  const { nome, endereco } = req.body;

  const frenteAssistidaIndex = frenteAssistida.findIndex((frente) => frente.id === id);

  if (frenteAssistidaIndex === -1) {
    return res.status(404).json({ message: "Frente Assistida não encontrada" });
  }

  frenteAssistida[frenteAssistidaIndex] = { id, nome, endereco };

  res.json({ message: "Frente Assistida atualizada com sucesso", frenteAssistida: frenteAssistida[frenteAssistidaIndex] });
});

app.delete("/frente-assistida/:id", (req, res) => {
  const { id } = req.params;

  const frenteAssistidaIndex = frenteAssistida.findIndex((frente) => frente.id === id);

  if (frenteAssistidaIndex === -1) {
    return res.status(404).json({ message: "Frente Assistida não encontrada" });
  }

  frenteAssistida.splice(frenteAssistidaIndex, 1);

  res.json({ message: "Frente Assistida excluída com sucesso" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}.`);
});
