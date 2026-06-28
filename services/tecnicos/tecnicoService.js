const { readDatabase, writeDatabase, gerarId } = require('../sistema/databaseService');

function cadastrarTecnico({
  nome,
  discordId,
  discordUsername,
  telefone,
  cargo,
  canalId = null,
  canalNome = null
}) {
  const db = readDatabase();

  if (!db.tecnicos) {
    db.tecnicos = [];
  }

  const tecnicoExistente = db.tecnicos.find(
    (tecnico) => tecnico.discordId === discordId
  );

  if (tecnicoExistente) {
    return {
      existente: true,
      tecnico: tecnicoExistente
    };
  }

  const tecnico = {
    id: gerarId('TEC', db.tecnicos),
    nome,
    discordId,
    discordUsername,
    telefone,
    cargo,
    canalId,
    canalNome,
    ativo: true,
    criadoEm: new Date().toISOString()
  };

  db.tecnicos.push(tecnico);
  writeDatabase(db);

  return {
    existente: false,
    tecnico
  };
}

function atualizarCanalTecnico(discordId, canal) {
  const db = readDatabase();

  if (!db.tecnicos) {
    db.tecnicos = [];
  }

  const tecnico = db.tecnicos.find(
    (item) => item.discordId === discordId
  );

  if (!tecnico) {
    return null;
  }

  tecnico.canalId = canal.id;
  tecnico.canalNome = canal.name;
  tecnico.atualizadoEm = new Date().toISOString();

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
  atualizarCanalTecnico,
  listarTecnicos
};