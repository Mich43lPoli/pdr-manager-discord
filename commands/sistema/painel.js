const { SlashCommandBuilder } = require('discord.js');
const { painelPrincipal } = require('../../ui/panels/painelPrincipal');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('painel')
    .setDescription('Abre o painel principal do PDR Manager'),

  async execute(interaction) {
    await painelPrincipal(interaction);
  }
};