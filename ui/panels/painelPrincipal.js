const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

async function painelPrincipal(interaction) {
  const agora = new Date().toLocaleString('pt-PT');

  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle('🛠️ PDR MANAGER')
    .setDescription(
      'Sistema de gestão para Martelinho de Ouro.\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '🏢 **Empresa**\n' +
      'PDR Manager\n\n' +
      '👨‍🔧 **Técnicos:** `0`\n' +
      '🚗 **Carros:** `0`\n' +
      '💰 **Pendentes:** `€0`\n' +
      '📄 **Relatórios:** `0`\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      'Escolha um módulo abaixo:'
    )
    .setFooter({
      text: `PDR Manager • Versão 0.2 • Atualizado em ${agora}`
    });

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('painel_carros')
      .setLabel('Carros')
      .setEmoji('🚗')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('painel_tecnicos')
      .setLabel('Técnicos')
      .setEmoji('👨‍🔧')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('painel_financeiro')
      .setLabel('Financeiro')
      .setEmoji('💰')
      .setStyle(ButtonStyle.Success)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('painel_relatorios')
      .setLabel('Relatórios')
      .setEmoji('📊')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('painel_sistema')
      .setLabel('Sistema')
      .setEmoji('⚙️')
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId('painel_ajuda')
      .setLabel('Ajuda')
      .setEmoji('❓')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('voltar_principal')
      .setLabel('Atualizar')
      .setEmoji('🔄')
      .setStyle(ButtonStyle.Secondary)
  );

  if (interaction.isButton()) {
    await interaction.update({
      embeds: [embed],
      components: [row1, row2]
    });
    return;
  }

  await interaction.reply({
    embeds: [embed],
    components: [row1, row2]
  });
}

module.exports = { painelPrincipal };