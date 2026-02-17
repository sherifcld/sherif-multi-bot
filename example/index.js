const { startAll } = require("..");
const config = require("./config");

startAll({
  whatsapp: {
    phoneNumber: config.whatsapp.phoneNumber
  },
  telegram: {
    token: config.telegram.token
  },
  discord: {
    token: config.discord.token,
    commandPrefix: config.discord.commandPrefix
  }
});

