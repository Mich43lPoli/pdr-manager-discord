const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

function criarPainelPrincipal() {
  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle('🚗 PDR Manager')
    .setDescription(
      [
        '**Painel principal do sistema**',
        '',
        'Escolha uma opção abaixo para continuar.',
        '',
        '🚗 **Veículos**',
        '👨‍🔧 **Técnicos**',
        '📸 **Fotos**',
        '📊 **Relatórios**',
        '⚙️ **Configurações**'
      ].join('\n')
    )
    .setFooter({
      text: 'PDR Manager • Sistema de gestão para Martelinho de Ouro'
    });

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('painel_veiculos')
      .setLabel('Veículos')
      .setEmoji('🚗')
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId('painel_tecnicos')
      .setLabel('Técnicos')
      .setEmoji('👨‍🔧')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('painel_fotos')
      .setLabel('Fotos')
      .setEmoji('📸')
      .setStyle(ButtonStyle.Secondary)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('painel_relatorios')
      .setLabel('Relatórios')
      .setEmoji('📊')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('painel_config')
      .setLabel('Configurações')
      .setEmoji('⚙️')
      .setStyle(ButtonStyle.Secondary)
  );

  return {
    embeds: [embed],
    components: [row1, row2]
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('painel')
    .setDescription('Abre o painel principal do PDR Manager'),

  async execute(interaction) {
    return await interaction.reply({
      ...criarPainelPrincipal(),
      ephemeral: false
    });
  }
};

module.exports.criarPainelPrincipal = criarPainelPrincipal;