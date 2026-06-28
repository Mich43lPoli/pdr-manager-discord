const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

async function painelTecnicos(interaction) {
  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle('👨‍🔧 Técnicos')
    .setDescription('Escolha uma ação para gestão de técnicos.');

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('tecnico_cadastrar')
      .setLabel('Cadastrar')
      .setEmoji('➕')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('tecnico_gerenciar')
      .setLabel('Gerenciar')
      .setEmoji('👥')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('tecnico_listar')
      .setLabel('Listar')
      .setEmoji('📋')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('voltar_principal')
      .setLabel('Voltar')
      .setEmoji('⬅️')
      .setStyle(ButtonStyle.Danger)
  );

  return await interaction.update({
    embeds: [embed],
    components: [row]
  });
}

module.exports = { painelTecnicos };