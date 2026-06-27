const { painelPrincipal } = require('../ui/panels/painelPrincipal');
const { painelCarros } = require('../ui/panels/painelCarros');
const { painelTecnicos } = require('../ui/panels/painelTecnicos');
const { painelFinanceiro } = require('../ui/panels/painelFinanceiro');
const { painelRelatorios } = require('../ui/panels/painelRelatorios');
const { painelSistema } = require('../ui/panels/painelSistema');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          return interaction.reply({
            content: '❌ Comando não encontrado.',
            ephemeral: true
          });
        }

        await command.execute(interaction, client);
        return;
      }

      if (interaction.isButton()) {
        const id = interaction.customId;

        if (id === 'painel_carros') return await painelCarros(interaction);
        if (id === 'painel_tecnicos') return await painelTecnicos(interaction);
        if (id === 'painel_financeiro') return await painelFinanceiro(interaction);
        if (id === 'painel_relatorios') return await painelRelatorios(interaction);
        if (id === 'painel_sistema') return await painelSistema(interaction);
        if (id === 'voltar_principal') return await painelPrincipal(interaction);

        if (id === 'painel_ajuda') {
          return await interaction.reply({
            content: '📖 Central de ajuda em desenvolvimento.',
            ephemeral: true
          });
        }

        return await interaction.reply({
          content: '🚧 Esta função ainda está em desenvolvimento.',
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('❌ Erro na interação:', error);

      if (interaction.replied || interaction.deferred) {
        return await interaction.followUp({
          content: '❌ Ocorreu um erro ao executar esta ação.',
          ephemeral: true
        });
      }

      return await interaction.reply({
        content: '❌ Ocorreu um erro ao executar esta ação.',
        ephemeral: true
      });
    }
  }
};