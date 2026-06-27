const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

function modalCadastrarTecnico() {
  const modal = new ModalBuilder()
    .setCustomId('modal_cadastrar_tecnico')
    .setTitle('Cadastrar Técnico');

  const nome = new TextInputBuilder()
    .setCustomId('nome')
    .setLabel('Nome completo')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const telefone = new TextInputBuilder()
    .setCustomId('telefone')
    .setLabel('Telefone')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const documento = new TextInputBuilder()
    .setCustomId('documento')
    .setLabel('Documento / BI / Passaporte')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(nome),
    new ActionRowBuilder().addComponents(telefone),
    new ActionRowBuilder().addComponents(documento)
  );

  return modal;
}

module.exports = { modalCadastrarTecnico };