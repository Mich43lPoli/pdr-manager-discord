function isOwner(interaction) {
  const ownerId = process.env.OWNER_ID || '704404734672371763';
  return interaction.user.id === ownerId;
}

module.exports = {
  isOwner
};