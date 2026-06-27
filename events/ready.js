module.exports = {
  name: 'ready',
  once: true,

  execute(client) {
    console.log(`✅ PDR Manager online como ${client.user.tag}`);
  }
};