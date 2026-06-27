const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

async function painelRelatorios(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('📊 Relatórios')
    .setDescription('Área para PDFs, histórico e resumo geral.')
    .setColor(0xff0000);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('relatorio_tecnico')
      .setLabel('Por Técnico')
      .setEmoji('👨‍🔧')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('relatorio_geral')
      .setLabel('Geral')
      .setEmoji('📑')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('voltar_principal')
      .setLabel('Voltar')
      .setEmoji('⬅️')
      .setStyle(ButtonStyle.Danger)
  );

  await interaction.update({ embeds: [embed], components: [row] });
}

module.exports = { painelRelatorios };