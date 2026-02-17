#!/usr/bin/env node

const { startWhatsApp } = require("./lib/whatsapp");
const { startTelegram } = require("./lib/telegram");
const { startDiscord } = require("./lib/discord");

function mergeSection(base, override) {
  return { ...(base || {}), ...(override || {}) };
}

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

function createShegraf(defaultConfig = {}) {
  const baseConfig = defaultConfig || {};

  async function start(overrides = {}) {
    const logger = overrides.logger || baseConfig.logger || console;
    const merged = {
      logger,
      whatsapp: mergeSection(baseConfig.whatsapp, overrides.whatsapp),
      telegram: mergeSection(baseConfig.telegram, overrides.telegram),
      discord: mergeSection(baseConfig.discord, overrides.discord)
    };
    return main(merged);
  }

  async function startWhatsAppWithConfig(options = {}) {
    const logger = options.logger || baseConfig.logger || console;
    return startWhatsApp({
      logger,
      ...mergeSection(baseConfig.whatsapp, options)
    });
  }

  function startTelegramWithConfig(options = {}) {
    const logger = options.logger || baseConfig.logger || console;
    return startTelegram({
      logger,
      ...mergeSection(baseConfig.telegram, options)
    });
  }

  function startDiscordWithConfig(options = {}) {
    const logger = options.logger || baseConfig.logger || console;
    return startDiscord({
      logger,
      ...mergeSection(baseConfig.discord, options)
    });
  }

  return {
    start,
    startWhatsApp: startWhatsAppWithConfig,
    startTelegram: startTelegramWithConfig,
    startDiscord: startDiscordWithConfig
  };
}

if (require.main === module) {
  main();
}

module.exports = {
  startWhatsApp,
  startTelegram,
  startDiscord,
  startAll: main,
  createShegraf
};
