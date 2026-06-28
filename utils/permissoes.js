function isOwner(interaction) {
  return interaction.user.id === '704404734672371763';
}

module.exports = {
  isOwner
};