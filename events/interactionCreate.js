module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          await interaction.deferReply({ ephemeral: true });
          return await interaction.editReply('❌ Comando não encontrado.');
        }

        return await command.execute(interaction, client);
      }

      if (interaction.isButton()) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.customId;

        if (id === 'painel_tecnicos') {
          return await interaction.editReply('✅ Clique em Técnicos recebido com sucesso.');
        }

        return await interaction.editReply(`🚧 Botão recebido: ${id}`);
      }
    } catch (error) {
      console.error('❌ Erro na interação:', error);
    }
  }
};