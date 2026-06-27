const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

async function painelCarros(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('🚗 Módulo de Carros')
    .setDescription('Escolha uma ação para gestão de veículos.')
    .setColor(0xff0000);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('carro_registrar')
      .setLabel('Registrar')
      .setEmoji('➕')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('carro_buscar')
      .setLabel('Buscar')
      .setEmoji('🔍')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('carro_listar')
      .setLabel('Listar')
      .setEmoji('📋')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('carro_editar')
      .setLabel('Editar')
      .setEmoji('✏️')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('voltar_principal')
      .setLabel('Voltar')
      .setEmoji('⬅️')
      .setStyle(ButtonStyle.Danger)
  );

  await interaction.update({ embeds: [embed], components: [row] });
}

module.exports = { painelCarros };