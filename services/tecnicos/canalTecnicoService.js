const {
  ChannelType,
  PermissionFlagsBits
} = require('discord.js');

function limparNomeCanal(nome) {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function criarCanalTecnico(interaction, tecnico) {
  const guild = interaction.guild;

  let categoria = guild.channels.cache.find(
    (canal) =>
      canal.type === ChannelType.GuildCategory &&
      canal.name === '👨‍🔧 Técnicos'
  );

  if (!categoria) {
    categoria = await guild.channels.create({
      name: '👨‍🔧 Técnicos',
      type: ChannelType.GuildCategory
    });
  }

  const nomeCanal = `tecnico-${limparNomeCanal(tecnico.nome)}`;

  const canalExistente = guild.channels.cache.find(
    (canal) => canal.name === nomeCanal
  );

  if (canalExistente) {
    return canalExistente;
  }

  const canal = await guild.channels.create({
    name: nomeCanal,
    type: ChannelType.GuildText,
    parent: categoria.id,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: tecnico.discordId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      },
      {
        id: process.env.OWNER_ID,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageChannels
        ]
      },
      {
        id: interaction.client.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageChannels
        ]
      }
    ]
  });

  await canal.send({
    content: [
      `👋 Bem-vindo, <@${tecnico.discordId}>.`,
      '',
      'Este é o seu canal privado dentro do PDR Manager.',
      '',
      'Aqui ficarão seus veículos, fotos, serviços e relatórios.',
      '',
      `👑 Administrador responsável: <@${process.env.OWNER_ID}>`
    ].join('\n')
  });

  return canal;
}

module.exports = {
  criarCanalTecnico
};