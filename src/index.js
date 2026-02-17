#!/usr/bin/env node

const { startWhatsApp } = require("./lib/whatsapp");
const { startTelegram } = require("./lib/telegram");
const { startDiscord } = require("./lib/discord");

async function main(options = {}) {
  const logger = options.logger || console;
  logger.log("Menjalankan Sherif Multi Bot...");
  try {
    await startWhatsApp({
      logger,
      ...(options.whatsapp || {})
    });
  } catch (error) {
    logger.error("[WA] Error:", error.message);
  }

  try {
    startTelegram({
      logger,
      ...(options.telegram || {})
    });
  } catch (error) {
    logger.error("[TG] Error:", error.message);
  }

  try {
    startDiscord({
      logger,
      ...(options.discord || {})
    });
  } catch (error) {
    logger.error("[DC] Error:", error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  startWhatsApp,
  startTelegram,
  startDiscord,
  startAll: main
};
