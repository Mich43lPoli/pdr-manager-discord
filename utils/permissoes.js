function isOwner(interaction) {
  return interaction.user.id === process.env.OWNER_ID;
}

function somenteOwner(interaction) {
  return isOwner(interaction);
}

module.exports = {
  isOwner,
  somenteOwner
};