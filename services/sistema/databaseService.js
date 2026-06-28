const fs = require('fs');
const path = require('path');

const databaseDir = path.join(__dirname, '../../database');
const databasePath = path.join(databaseDir, 'database.json');

const initialData = {
  empresa: {
    nome: 'PDR Manager',
    versao: '0.3.0'
  },
  tecnicos: [],
  carros: [],
  pagamentos: [],
  logs: []
};

function garantirDatabase() {
  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }

  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify(initialData, null, 2));
  }
}

function readDatabase() {
  garantirDatabase();

  const data = fs.readFileSync(databasePath, 'utf8');

  if (!data.trim()) {
    writeDatabase(initialData);
    return initialData;
  }

  return JSON.parse(data);
}

function writeDatabase(data) {
  garantirDatabase();
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
}

function gerarId(prefixo, lista) {
  const numero = Array.isArray(lista) ? lista.length + 1 : 1;
  return `${prefixo}-${String(numero).padStart(4, '0')}`;
}

module.exports = {
  readDatabase,
  writeDatabase,
  gerarId
};