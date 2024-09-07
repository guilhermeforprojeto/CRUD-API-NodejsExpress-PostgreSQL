const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid'); // Importa a função uuidv4 para gerar UUIDs
const db = require("./app/models");
const Sacola = db.sacolas
const Celula = db.celula
const app = express();


// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Todas tabelas Dropadas e Resicronizado o banco");
//console.log(`O servidor está rodando na porta ${PORT}.`);
// });

db.sequelize.sync().then(() => {
  console.log("Tabelas mantidas");
  console.log(`O servidor está rodando na porta ${PORT}.`);
});


var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let assistidos = [];
let doadores = [];
let frenteAssistida = [];

app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo ao Backend  das Sacolinhas Happy Day 2023 - Bola de Neve Church." });
});

// Rotas para a entidade "Sacolas"
app.get("/sacolas", (req, res) => {
  // Extrair os parâmetros da query string
  const { codigo, status, assistentesocial, nome, doador } = req.query;

  // Criar um objeto "where" dinâmico para filtrar os campos conforme os parâmetros fornecidos
  const whereClause = {};

  if (codigo) whereClause.codigo = codigo;
  if (status) whereClause.status = status;
  if (assistentesocial) whereClause.assistentesocial = assistentesocial;
  if (nome) whereClause.nome = nome;
  if (doador) whereClause.doador = doador;

  // Usar o Sequelize para buscar com base nos filtros fornecidos
  Sacola.findAll({ where: whereClause })
    .then((sacolas) => {
      // Se não houver sacolas, retorna um array vazio
      if (sacolas.length === 0) {
        return res.status(404).json({ message: "Nenhuma sacola encontrada." });
      }
      // Convertendo os dados retornados pelo Sequelize para JSON
      const sacolasJSON = sacolas.map((sacola) => sacola.toJSON());
      res.json({ sacolas: sacolasJSON });
    })
    .catch((error) => {
      console.error("Erro ao buscar sacolas:", error);
      res.status(500).json({ message: "Erro ao buscar sacolas" });
    });
});


//##POST 
//##POST 
//##POST 


app.post("/sacolas", async (req, res) => {
  const { codigo, status, assistentesocial, nomefrenteassistida, assistido, doador, obs } = req.body;

  try {
    // Verifique se já existe uma sacola com o mesmo código
    const sacolaExistente = await Sacola.findOne({ where: { codigo } });

    if (sacolaExistente) {
      return res.status(400).json({ message: "Código " + codigo + " já foi cadastrado" });
    }

    // Crie uma nova instância do modelo Sacolas com os dados fornecidos
    const novaSacola = await Sacola.create({
      codigo,
      status,
      assistentesocial,
      nomefrenteassistida,
      assistido,
      doador,
      obs,
    });

    return res.status(201).json({ message: "Sacola criada com sucesso", sacola: novaSacola });
  } catch (error) {
    console.error("Erro ao criar sacola:", error);
    return res.status(500).json({ message: "Erro ao criar sacola" });
  }
});

// Rota PUT para atualizar uma sacola existente
app.put("/sacolas/:id", async (req, res) => {
  const { id } = req.params;
  const { codigo, status, nome, conteudo, assistentesocial, nomefrenteassistida, assistido, doador, obs } = req.body;

  try {
    // Encontre a sacola pelo ID
    const sacola = await Sacola.findByPk(id);

    if (!sacola) {
      return res.status(404).json({ message: "Sacola não encontrada" });
    }

    // Atualize os campos da sacola
    sacola.codigo = codigo;
    sacola.status = status;
    sacola.nome = nome;
    sacola.conteudo = conteudo;
    sacola.assistentesocial = assistentesocial;
    sacola.nomefrenteassistida = nomefrenteassistida;
    sacola.assistido = assistido;
    sacola.doador = doador;
    sacola.obs = obs;

    // Salve a sacola atualizada no banco de dados
    await sacola.save();

    return res.json({ message: "Sacola atualizada com sucesso", sacola });
  } catch (error) {
    console.error("Erro ao atualizar sacola:", error);
    return res.status(500).json({ message: "Erro ao atualizar sacola" });
  }
});

app.delete("/sacolas/:id", (req, res) => {
  const { id } = req.params;

  // Use o método 'destroy' do Sequelize para excluir a sacola com o ID fornecido
  Sacola.destroy({ where: { id } })
    .then((rowsDeleted) => {
      if (rowsDeleted === 1) {
        // A sacola foi excluída com sucesso
        res.json({ message: "Sacola excluída com sucesso" });
      } else {
        // Nenhuma sacola com o ID fornecido foi encontrada
        res.status(404).json({ message: "Sacola não encontrada" });
      }
    })
    .catch((error) => {
      console.error("Erro ao excluir sacola:", error);
      res.status(500).json({ message: "Erro ao excluir sacola" });
    });
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

app.post("/doadores", async (req, res) => {
  const { status, nome, contato, sacolinhas, obs } = req.body;
  const id = uuidv4(); // Gera um UUID único
  const novoDoador = { id, status, nome, contato, sacolinhas, obs };

  try {
    // Simula o armazenamento do doador
    doadores.push(novoDoador);

    console.log(novoDoador.sacolinhas + " CHEGOU AGORA!!!!");

    // 1. Verifica se há sacolinhas associadas ao doador
    if (sacolinhas && sacolinhas.length > 0) {
      // 2. Atualiza o status das sacolinhas no banco de dados para "Com Doador"
      await Sacola.update(
        { status: "Com Doador" }, // Novo status
        { where: { codigo: sacolinhas } } // Atualiza apenas as sacolinhas com os códigos fornecidos
      );
      console.log(`${sacolinhas.length} sacolinhas atualizadas para 'Com Doador'`);
    }

    // 3. Retorna a resposta de sucesso com o doador criado
    res.status(201).json({ message: "Doador criado com sucesso", doador: novoDoador });
  } catch (error) {
    console.error("Erro ao criar doador ou atualizar sacolinhas:", error);
    res.status(500).json({ message: "Erro ao criar doador ou atualizar sacolinhas" });
  }
});




app.put("/doadores/:id", (req, res) => {
  const { id } = req.params;
  const { status, nome, contato, sacolinhas, obs } = req.body;

  const doadorIndex = doadores.findIndex((doador) => doador.id === id);

  if (doadorIndex === -1) {
    return res.status(404).json({ message: "Doador não encontrado" });
  }

  doadores[doadorIndex] = { id, status, nome, contato, sacolinhas, obs };

  res.json({ message: "Doador atualizado com sucesso", doador: doadores[doadorIndex] });
});

app.delete("/doadores/:id", async (req, res) => {
  const { id } = req.params;

  // Encontre o índice do doador na lista
  const doadorIndex = doadores.findIndex((doador) => doador.id === id);

  if (doadorIndex === -1) {
    return res.status(404).json({ message: "Doador não encontrado" });
  }

  // Pegue as sacolinhas associadas ao doador antes de removê-lo
  const sacolinhas = doadores[doadorIndex].sacolinhas;

  try {
    // Atualize o status das sacolinhas para "Registrada"
    if (sacolinhas && sacolinhas.length > 0) {
      await Sacola.update(
        { status: "Registrada" }, // Novo status
        { where: { codigo: sacolinhas } } // Atualiza apenas as sacolinhas com os códigos fornecidos
      );
      console.log(`${sacolinhas.length} sacolinhas atualizadas para 'Registrada'`);
    }

    // Remova o doador da lista
    doadores.splice(doadorIndex, 1);

    // Resposta de sucesso
    res.json({ message: "Doador excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir doador ou atualizar sacolinhas:", error);
    res.status(500).json({ message: "Erro ao excluir doador ou atualizar sacolinhas" });
  }
});

// Rotas para a entidade "Frente Assistida"
app.get("/frente-assistida", (req, res) => {
  res.json({ frenteAssistida });
});
app.get("/frente-assistida/:id", (req, res) => {
  const { id } = req.params;

  // Encontre a frente assistida com o ID correspondente
  const frenteEncontrada = frenteAssistida.find((frente) => frente.id === id);

  if (!frenteEncontrada) {
    return res.status(404).json({ message: "Frente Assistida não encontrada" });
  }

  res.json({ frenteAssistida: frenteEncontrada });
});
app.post("/frente-assistida", (req, res) => {
  const { nome, assistidos } = req.body;

  // Verifique se já existe uma Frente Assistida com o mesmo nome (sem distinção entre maiúsculas e minúsculas)
  const frenteAssistidaExistente = frenteAssistida.find((frente) => frente.nome.toLowerCase() === nome.toLowerCase());

  if (frenteAssistidaExistente) {
    return res.status(400).json({ message: "Frente Assistida com o mesmo nome já existe." });
  }

  const id = uuidv4(); // Gera um UUID único
  const novaFrenteAssistida = { id, nome, assistidos };
  frenteAssistida.push(novaFrenteAssistida);
  res.status(201).json({ message: "Frente Assistida criada com sucesso", frenteAssistida: novaFrenteAssistida });
});


app.put("/frente-assistida/:id", (req, res) => {
  const { id } = req.params;
  const { nome, assistidos } = req.body;

  const frenteAssistidaIndex = frenteAssistida.findIndex((frente) => frente.id === id);

  if (frenteAssistidaIndex === -1) {
    return res.status(404).json({ message: "Frente Assistida não encontrada" });
  }

  frenteAssistida[frenteAssistidaIndex] = { id, nome, assistidos };

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



// Rotas para a entidade "Celulas"
// Rotas para a entidade "Celulas"

// Rotas para a entidade "Celulas"
// Rotas para a entidade "Celulas"

// Rotas para a entidade "Celulas"
// Rotas para a entidade "Celulas"
app.get("/celulas", (req, res) => {
  // Use o modelo Celula do Sequelize para buscar todas as celulas no banco de dados
  Celula.findAll()
    .then((celulas) => {
      // Converta os dados retornados pelo Sequelize em um array JSON
      const celulasJSON = celulas.map((celula) => celula.toJSON());

      // Retorne os dados como resposta
      res.json({ celulas: celulasJSON });
    })
    .catch((error) => {
      console.error("Erro ao buscar celulas:", error);
      res.status(500).json({ message: "Erro ao buscar celulas" });
    });
});

// Rota POST para criar uma celula
app.post("/celulas", async (req, res) => {
  const { nome, nomeLider, contatoLider, obs } = req.body;

  try {
    // Verifique se já existe uma célula com o mesmo código
    const celulaExistente = await Celula.findOne({ where: { nome } });

    if (celulaExistente) {
      return res.status(400).json({ message: "Código " + nome + " já foi cadastrado" });
    }
    const id = uuidv4();
    // Crie uma nova instância do modelo Celulas com os dados fornecidos,
    // incluindo um UUID gerado automaticamente.
    const novaCelula = await Celula.create({
      id: id, // Gere um UUID
      nome,
      nomeLider,
      contatoLider,
      obs,
    });

    return res.status(201).json({ message: "Célula criada com sucesso", celula: novaCelula });
  } catch (error) {
    console.error("Erro ao criar célula:", error);
    return res.status(500).json({ message: "Erro ao criar célula" });
  }
});

// Rota PUT para atualizar uma celula existente
app.put("/celulas/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    nomeLider,
    contatoLider,
    obs,
  } = req.body;

  try {
    // Encontre a celula pelo ID
    const celula = await Celula.findByPk(id);

    if (!celula) {
      return res.status(404).json({ message: "Celula não encontrada" });
    }

    // Encontre a frente assistida associada à celula
    const frenteAssistida = await FrenteAssistida.findByPk(celula.nome);

    if (!frenteAssistida) {
      return res.status(404).json({ message: "Frente assistida não encontrada" });
    }

    // Atualize os campos da celula
    celula.nome = nome;
    celula.nomeLider = nomeLider;
    celula.contatoLider = contatoLider;
    celula.obs = obs;

    // Salve a celula atualizada no banco de dados
    await celula.save();

    // Retorne uma resposta ao cliente
    return res.json({ message: "Celula atualizada com sucesso", celula: nome });
  } catch (error) {
    console.error("Erro ao atualizar celula:", error);
    return res.status(500).json({ message: "Erro ao atualizar celula" });
  }
})
app.delete("/celulas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Encontre a celula pelo ID
    const celula = await Celula.findByPk(id);
    if (!celula) {
      return res.status(404).json({ message: "Celula não encontrada" });
    }
    // Exclua a celula do banco de dados
    await celula.destroy();
    return res.json({ message: "Celula excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir celula:", error);
    return res.status(500).json({ message: "Erro ao excluir celula" });
  }
});
