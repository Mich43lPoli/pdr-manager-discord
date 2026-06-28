const { readDatabase, writeDatabase, gerarId } = require("../sistema/databaseService");

function cadastrarTecnico({ nome, discordId, telefone, cargo }) {
  const db = readDatabase();

  if (!db.tecnicos) {
    db.tecnicos = [];
  }

  const tecnico = {
    id: gerarId("TEC", db.tecnicos),
    nome,
    discordId,
    telefone,
    cargo,
    ativo: true,
    criadoEm: new Date().toISOString(),
  };

  db.tecnicos.push(tecnico);
  writeDatabase(db);

  return tecnico;
}

function listarTecnicos() {
  const db = readDatabase();

  if (!db.tecnicos) {
    return [];
  }

  return db.tecnicos;
}

module.exports = {
  cadastrarTecnico,
  listarTecnicos,
};