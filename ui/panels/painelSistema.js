const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

async function painelSistema(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('⚙️ Sistema')
    .setDescription('Configurações gerais do PDR Manager.')
    .setColor(0xff0000);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('sistema_setup')
      .setLabel('Setup')
      .setEmoji('🛠️')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('sistema_logs')
      .setLabel('Logs')
      .setEmoji('📜')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('sistema_backup')
      .setLabel('Backup')
      .setEmoji('💾')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('voltar_principal')
      .setLabel('Voltar')
      .setEmoji('⬅️')
      .setStyle(ButtonStyle.Danger)
  );

  await interaction.update({ embeds: [embed], components: [row] });
}

module.exports = { painelSistema };