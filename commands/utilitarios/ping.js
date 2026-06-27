const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Testa se o PDR Manager está online'),

  async execute(interaction) {
    await interaction.reply('🏓 Pong! PDR Manager online.');
  }
};