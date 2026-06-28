const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  UserSelectMenuBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

const { criarPainelPrincipal } = require('../commands/sistema/painel');
const { painelCarros } = require('../ui/panels/painelCarros');
const { painelTecnicos } = require('../ui/panels/painelTecnicos');
const { painelRelatorios } = require('../ui/panels/painelRelatorios');
const { painelSistema } = require('../ui/panels/painelSistema');

const {
  cadastrarTecnico,
  atualizarCanalTecnico,
  listarTecnicos
} = require('../services/tecnicos/tecnicoService');

const { criarCanalTecnico } = require('../services/tecnicos/canalTecnicoService');
const { isOwner } = require('../utils/permissoes');

const cadastroTemporario = new Map();

function negarAcesso(interaction) {
  return interaction.reply({
    content: '❌ Você não tem permissão para usar esta função.',
    ephemeral: true
  });
}

function criarPainelCadastroTecnico(interaction, dados = {}) {
  const usuarioTexto = dados.usuarioId ? `<@${dados.usuarioId}>` : 'Não selecionado';
  const cargoTexto = dados.cargo || 'Não selecionado';

  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle('➕ Cadastrar Técnico')
    .setDescription(
      [
        'Selecione o usuário e o cargo do técnico.',
        '',
        `👤 **Usuário:** ${usuarioTexto}`,
        `🔐 **Cargo:** ${cargoTexto}`,
        '',
        'Depois clique em **Continuar** para informar o telefone.'
      ].join('\n')
    );

  const rowUsuario = new ActionRowBuilder().addComponents(
    new UserSelectMenuBuilder()
      .setCustomId('tecnico_select_usuario')
      .setPlaceholder('Selecione o usuário do Discord')
      .setMinValues(1)
      .setMaxValues(1)
  );

  const rowCargo = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('tecnico_select_cargo')
      .setPlaceholder('Selecione o cargo')
      .addOptions(
        {
          label: 'Administrador',
          description: 'Acesso total ao sistema',
          value: 'Administrador',
          emoji: '👑'
        },
        {
          label: 'Técnico',
          description: 'Acesso apenas ao próprio canal e tarefas',
          value: 'Técnico',
          emoji: '👨‍🔧'
        },
        {
          label: 'Visualizador',
          description: 'Acesso somente para leitura',
          value: 'Visualizador',
          emoji: '👁️'
        }
      )
  );

  const rowBotoes = new ActionRowBuilder().addComponents(
    new (require('discord.js').ButtonBuilder)()
      .setCustomId('tecnico_cadastro_continuar')
      .setLabel('Continuar')
      .setEmoji('➡️')
      .setStyle(require('discord.js').ButtonStyle.Success),

    new (require('discord.js').ButtonBuilder)()
      .setCustomId('painel_tecnicos')
      .setLabel('Cancelar')
      .setEmoji('❌')
      .setStyle(require('discord.js').ButtonStyle.Secondary)
  );

  return {
    embeds: [embed],
    components: [rowUsuario, rowCargo, rowBotoes]
  };
}

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
          if (!isOwner(interaction)) return await negarAcesso(interaction);

          cadastroTemporario.set(interaction.user.id, {});

          return await interaction.update(
            criarPainelCadastroTecnico(interaction, {})
          );
        }

        if (id === 'tecnico_cadastro_continuar') {
          if (!isOwner(interaction)) return await negarAcesso(interaction);

          const dados = cadastroTemporario.get(interaction.user.id);

          if (!dados || !dados.usuarioId || !dados.cargo) {
            return await interaction.reply({
              content: '❌ Selecione o usuário e o cargo antes de continuar.',
              ephemeral: true
            });
          }

          const modal = new ModalBuilder()
            .setCustomId('modal_cadastrar_tecnico_telefone')
            .setTitle('Telefone do Técnico');

          const telefone = new TextInputBuilder()
            .setCustomId('telefone')
            .setLabel('Telefone')
            .setPlaceholder('Ex: +49 000 000000')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

          modal.addComponents(
            new ActionRowBuilder().addComponents(telefone)
          );

          return await interaction.showModal(modal);
        }

        if (id === 'tecnico_gerenciar') {
          return await interaction.reply({
            content: '👥 Gerenciamento de técnicos será a próxima etapa.',
            ephemeral: true
          });
        }

        if (id === 'tecnico_listar') {
          if (!isOwner(interaction)) return await negarAcesso(interaction);

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
              const canal = tecnico.canalId ? `<#${tecnico.canalId}>` : 'Não criado';

              return [
                `**${tecnico.id}**`,
                `👤 ${tecnico.nome}`,
                `💬 Discord: <@${tecnico.discordId}>`,
                `📞 ${tecnico.telefone || 'Não informado'}`,
                `🔐 Cargo: ${tecnico.cargo || 'Não informado'}`,
                `📁 Canal: ${canal}`,
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

      if (interaction.isUserSelectMenu()) {
        if (interaction.customId === 'tecnico_select_usuario') {
          if (!isOwner(interaction)) return await negarAcesso(interaction);

          const usuarioId = interaction.values[0];
          const usuario = await client.users.fetch(usuarioId);

          const dados = cadastroTemporario.get(interaction.user.id) || {};
          dados.usuarioId = usuario.id;
          dados.username = usuario.username;
          dados.nome = usuario.globalName || usuario.username;

          cadastroTemporario.set(interaction.user.id, dados);

          return await interaction.update(
            criarPainelCadastroTecnico(interaction, dados)
          );
        }
      }

      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'tecnico_select_cargo') {
          if (!isOwner(interaction)) return await negarAcesso(interaction);

          const cargo = interaction.values[0];

          const dados = cadastroTemporario.get(interaction.user.id) || {};
          dados.cargo = cargo;

          cadastroTemporario.set(interaction.user.id, dados);

          return await interaction.update(
            criarPainelCadastroTecnico(interaction, dados)
          );
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'modal_cadastrar_tecnico_telefone') {
          if (!isOwner(interaction)) return await negarAcesso(interaction);

          await interaction.deferReply({ ephemeral: true });

          const dados = cadastroTemporario.get(interaction.user.id);

          if (!dados || !dados.usuarioId || !dados.cargo) {
            return await interaction.editReply({
              content: '❌ Cadastro incompleto. Comece novamente.'
            });
          }

          const telefone = interaction.fields.getTextInputValue('telefone') || 'Não informado';

          const resultado = cadastrarTecnico({
            nome: dados.nome,
            discordId: dados.usuarioId,
            discordUsername: dados.username,
            telefone,
            cargo: dados.cargo
          });

          if (resultado.existente) {
            cadastroTemporario.delete(interaction.user.id);

            return await interaction.editReply({
              content: `⚠️ Este técnico já está cadastrado: <@${resultado.tecnico.discordId}>`
            });
          }

          const canal = await criarCanalTecnico(interaction, resultado.tecnico);
          const tecnicoAtualizado = atualizarCanalTecnico(resultado.tecnico.discordId, canal);

          cadastroTemporario.delete(interaction.user.id);

          const embed = new EmbedBuilder()
            .setTitle('✅ Técnico cadastrado')
            .setColor(0x00ff66)
            .setDescription(
              [
                `**ID:** ${tecnicoAtualizado.id}`,
                `**Nome:** ${tecnicoAtualizado.nome}`,
                `**Discord:** <@${tecnicoAtualizado.discordId}>`,
                `**Telefone:** ${tecnicoAtualizado.telefone}`,
                `**Cargo:** ${tecnicoAtualizado.cargo}`,
                `**Canal:** <#${tecnicoAtualizado.canalId}>`,
                '',
                'Canal privado criado automaticamente.'
              ].join('\n')
            );

          return await interaction.editReply({
            embeds: [embed]
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