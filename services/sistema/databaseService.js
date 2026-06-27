const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, '../../database/database.json');

function readDatabase() {
  if (!fs.existsSync(databasePath)) {
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

    fs.writeFileSync(databasePath, JSON.stringify(initialData, null, 2));
  }

  const data = fs.readFileSync(databasePath, 'utf8');
  return JSON.parse(data);
}

function writeDatabase(data) {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
}

function gerarId(prefixo, lista) {
  const numero = lista.length + 1;
  return `${prefixo}-${String(numero).padStart(4, '0')}`;
}

module.exports = {
  readDatabase,
  writeDatabase,
  gerarId
};