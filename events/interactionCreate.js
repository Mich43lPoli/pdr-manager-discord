const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require('discord.js');

const { criarPainelPrincipal } = require('../commands/sistema/painel');
const { painelCarros } = require('../ui/panels/painelCarros');
const { painelTecnicos } = require('../ui/panels/painelTecnicos');
const { painelRelatorios } = require('../ui/panels/painelRelatorios');
const { painelSistema } = require('../ui/panels/painelSistema');

const {
  cadastrarTecnico,
  listarTecnicos
} = require('../services/tecnicos/tecnicoService');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        return await command.execute(interaction, client);
      }

      if (interaction.isButton()) {
        const id = interaction.customId;

        if (id === 'painel_veiculos' || id === 'painel_carros') {
          return await painelCarros(interaction);
        }

        if (id === 'painel_tecnicos') {
          return await painelTecnicos(interaction);
        }

        if (id === 'painel_relatorios') {
          return await painelRelatorios(interaction);
        }

        if (id === 'painel_config' || id === 'painel_sistema') {
          return await painelSistema(interaction);
        }

        if (id === 'voltar_principal') {
          return await interaction.update(criarPainelPrincipal());
        }

        if (id === 'painel_fotos') {
          return await interaction.reply({
            content: '📸 Módulo de fotos em desenvolvimento.',
            ephemeral: true
          });
        }

        if (id === 'tecnico_cadastrar') {
          const modal = new ModalBuilder()
            .setCustomId('modal_cadastrar_tecnico')
            .setTitle('Cadastrar Técnico');

          const nome = new TextInputBuilder()
            .setCustomId('nome')
            .setLabel('Nome completo')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const discordId = new TextInputBuilder()
            .setCustomId('discordId')
            .setLabel('Discord ID')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const telefone = new TextInputBuilder()
            .setCustomId('telefone')
            .setLabel('Telefone')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

          const cargo = new TextInputBuilder()
            .setCustomId('cargo')
            .setLabel('Administrador, Técnico ou Visualizador')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder().addComponents(nome),
            new ActionRowBuilder().addComponents(discordId),
            new ActionRowBuilder().addComponents(telefone),
            new ActionRowBuilder().addComponents(cargo)
          );

          return await interaction.showModal(modal);
        }

        if (id === 'tecnico_listar') {
          const tecnicos = listarTecnicos();

          if (!tecnicos.length) {
            return await interaction.reply({
              content: '📋 Nenhum técnico cadastrado ainda.',
              ephemeral: true
            });
          }

          const lista = tecnicos
            .map((tecnico) => {
              const status = tecnico.ativo ? '🟢 Ativo' : '🔴 Inativo';

              return [
                `**${tecnico.id}**`,
                `👤 ${tecnico.nome}`,
                `🆔 Discord ID: ${tecnico.discordId || 'Não informado'}`,
                `📞 ${tecnico.telefone || 'Não informado'}`,
                `🔐 Cargo: ${tecnico.cargo || 'Não informado'}`,
                `${status}`
              ].join('\n');
            })
            .join('\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n');

          const embed = new EmbedBuilder()
            .setTitle('📋 Técnicos Cadastrados')
            .setColor(0xff0000)
            .setDescription(lista)
            .setFooter({ text: 'PDR Manager • Técnicos' });

          return await interaction.reply({
            embeds: [embed],
            ephemeral: true
          });
        }

        return await interaction.reply({
          content: `🚧 Botão ainda não configurado: ${id}`,
          ephemeral: true
        });
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'modal_cadastrar_tecnico') {
          const nome = interaction.fields.getTextInputValue('nome');
          const discordId = interaction.fields.getTextInputValue('discordId');
          const telefone = interaction.fields.getTextInputValue('telefone') || 'Não informado';
          const cargo = interaction.fields.getTextInputValue('cargo');

          const cargoNormalizado = cargo.trim().toLowerCase();
          const cargosPermitidos = ['administrador', 'tecnico', 'técnico', 'visualizador'];

          if (!cargosPermitidos.includes(cargoNormalizado)) {
            return await interaction.reply({
              content: '❌ Cargo inválido. Use: Administrador, Técnico ou Visualizador.',
              ephemeral: true
            });
          }

          const cargoFinal =
            cargoNormalizado === 'administrador'
              ? 'Administrador'
              : cargoNormalizado === 'visualizador'
                ? 'Visualizador'
                : 'Técnico';

          const tecnico = cadastrarTecnico({
            nome,
            discordId,
            telefone,
            cargo: cargoFinal
          });

          const embed = new EmbedBuilder()
            .setTitle('✅ Técnico cadastrado')
            .setColor(0x00ff66)
            .setDescription(
              [
                `**ID:** ${tecnico.id}`,
                `**Nome:** ${tecnico.nome}`,
                `**Discord ID:** ${tecnico.discordId}`,
                `**Telefone:** ${tecnico.telefone}`,
                `**Cargo:** ${tecnico.cargo}`,
                '',
                'O técnico foi salvo no banco de dados.'
              ].join('\n')
            );

          return await interaction.reply({
            embeds: [embed],
            ephemeral: true
          });
        }
      }
        } catch (error) {
      console.error('❌ Erro na interação:', error);

      const respostaErro = {
        content: '❌ Ocorreu um erro ao executar esta ação.',
        ephemeral: true
      };

      if (interaction.deferred || interaction.replied) {
        return await interaction.followUp(respostaErro).catch(() => {});
      }

      return await interaction.reply(respostaErro).catch(() => {});
    }
  }
};