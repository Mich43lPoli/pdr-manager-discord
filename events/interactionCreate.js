const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require('discord.js');

const { painelPrincipal } = require('../ui/panels/painelPrincipal');
const { painelCarros } = require('../ui/panels/painelCarros');
const { painelTecnicos } = require('../ui/panels/painelTecnicos');
const { painelFinanceiro } = require('../ui/panels/painelFinanceiro');
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

        if (!command) {
          await interaction.deferReply({ ephemeral: true });
          return await interaction.editReply('❌ Comando não encontrado.');
        }

        return await command.execute(interaction, client);
      }

      if (interaction.isButton()) {
        const id = interaction.customId;

        if (id === 'painel_tecnicos') {
          await interaction.deferReply({ ephemeral: true });
          return await painelTecnicos(interaction);
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
          await interaction.deferReply({ ephemeral: true });

          const tecnicos = listarTecnicos();

          if (!tecnicos.length) {
            return await interaction.editReply('📋 Nenhum técnico cadastrado ainda.');
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

          return await interaction.editReply({
            embeds: [embed]
          });
        }

        if (id === 'painel_carros' || id === 'painel_veiculos') {
          await interaction.deferReply({ ephemeral: true });
          return await painelCarros(interaction);
        }

        if (id === 'painel_financeiro') {
          await interaction.deferReply({ ephemeral: true });
          return await painelFinanceiro(interaction);
        }

        if (id === 'painel_relatorios') {
          await interaction.deferReply({ ephemeral: true });
          return await painelRelatorios(interaction);
        }

        if (id === 'painel_sistema' || id === 'painel_config') {
          await interaction.deferReply({ ephemeral: true });
          return await painelSistema(interaction);
        }

        if (id === 'voltar_principal') {
          await interaction.deferReply({ ephemeral: true });
          return await painelPrincipal(interaction);
        }

        if (id === 'painel_fotos') {
          await interaction.deferReply({ ephemeral: true });
          return await interaction.editReply('📸 Módulo de fotos em desenvolvimento.');
        }

        if (id === 'painel_ajuda') {
          await interaction.deferReply({ ephemeral: true });
          return await interaction.editReply('📖 Central de ajuda em desenvolvimento.');
        }

        await interaction.deferReply({ ephemeral: true });
        return await interaction.editReply(`🚧 Botão recebido: ${id}`);
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'modal_cadastrar_tecnico') {
          await interaction.deferReply({ ephemeral: true });

          const nome = interaction.fields.getTextInputValue('nome');
          const discordId = interaction.fields.getTextInputValue('discordId');
          const telefone = interaction.fields.getTextInputValue('telefone') || 'Não informado';
          const cargo = interaction.fields.getTextInputValue('cargo');

          const cargosPermitidos = ['administrador', 'tecnico', 'técnico', 'visualizador'];
          const cargoNormalizado = cargo.trim().toLowerCase();

          if (!cargosPermitidos.includes(cargoNormalizado)) {
            return await interaction.editReply(
              '❌ Cargo inválido. Use: Administrador, Técnico ou Visualizador.'
            );
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
            )
            .setFooter({ text: 'PDR Manager • Cadastro de técnicos' });

          return await interaction.editReply({
            embeds: [embed]
          });
        }
      }
    } catch (error) {
      console.error('❌ Erro na interação:', error);
    }
  }
};