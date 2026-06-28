const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const { listarTecnicos } = require('../../services/tecnicos/tecnicoService');

async function painelTecnicos(interaction) {
  const tecnicos = listarTecnicos();
  const ativos = tecnicos.filter(t => t.ativo).length;

  const embed = new EmbedBuilder()
    .setTitle('👨‍🔧 Módulo de Técnicos')
    .setColor(0xff0000)
    .setDescription(
      'Gestão dos técnicos cadastrados no PDR Manager.\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      `👨‍🔧 **Técnicos cadastrados:** \`${tecnicos.length}\`\n` +
      `🟢 **Ativos:** \`${ativos}\`\n\n` +
      '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      'Escolha uma ação abaixo:'
    )
    .setFooter({ text: 'PDR Manager • Técnicos' });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('tecnico_cadastrar')
      .setLabel('Cadastrar')
      .setEmoji('➕')
      .setStyle(ButtonStyle.Success),

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

  return await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true
  });
}

module.exports = { painelTecnicos };