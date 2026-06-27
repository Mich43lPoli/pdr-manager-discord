const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

async function painelFinanceiro(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('💰 Módulo Financeiro')
    .setDescription('Controle de pagamentos, pendências e recebimentos.')
    .setColor(0xff0000);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('financeiro_pendentes')
      .setLabel('Pendentes')
      .setEmoji('📄')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('financeiro_recebidos')
      .setLabel('Recebidos')
      .setEmoji('💵')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('financeiro_relatorio')
      .setLabel('Relatório')
      .setEmoji('📊')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('voltar_principal')
      .setLabel('Voltar')
      .setEmoji('⬅️')
      .setStyle(ButtonStyle.Danger)
  );

  await interaction.update({ embeds: [embed], components: [row] });
}

module.exports = { painelFinanceiro };