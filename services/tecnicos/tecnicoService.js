const { readDatabase, writeDatabase, gerarId } = require('../sistema/databaseService');

function cadastrarTecnico({ nome, telefone, documento }) {
  const db = readDatabase();

  const tecnico = {
    id: gerarId('TEC', db.tecnicos),
    nome,
    telefone,
    documento,
    ativo: true,
    criadoEm: new Date().toISOString()
  };

  db.tecnicos.push(tecnico);
  writeDatabase(db);

  return tecnico;
}

function listarTecnicos() {
  const db = readDatabase();
  return db.tecnicos;
}

module.exports = {
  cadastrarTecnico,
  listarTecnicos
};