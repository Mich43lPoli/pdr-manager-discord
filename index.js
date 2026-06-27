require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

console.log('🚀 Iniciando PDR Manager...');

if (!process.env.TOKEN) {
  console.error('❌ TOKEN não encontrado no .env');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

function loadCommands(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      loadCommands(filePath);
    } else if (file.endsWith('.js')) {
      const command = require(filePath);

      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando carregado: /${command.data.name}`);
      }
    }
  }
}

function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');

  if (!fs.existsSync(eventsPath)) {
    console.error('❌ Pasta events não encontrada.');
    return;
  }

  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    console.log(`✅ Evento carregado: ${event.name}`);
  }
}

loadCommands(path.join(__dirname, 'commands'));
loadEvents();

client.login(process.env.TOKEN);