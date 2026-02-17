const { Telegraf, Markup } = require("telegraf");

function startTelegram(options = {}) {
  const logger = options.logger || console;
  const token = options.token || process.env.TELEGRAM_BOT_TOKEN || "";

  if (!token) {
    logger.log(
      "[TG] Telegram dimatikan: tidak ada konfigurasi token."
    );
    return;
  }

  const bot = new Telegraf(token);

  bot.start((ctx) => sendTgMenu(ctx));
  bot.command("menu", (ctx) => sendTgMenu(ctx));

  bot.action("btn_red", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply("Kamu pilih 🔴 Merah");
  });

  bot.action("btn_green", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply("Kamu pilih 🟢 Hijau");
  });

  bot.action("btn_blue", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply("Kamu pilih 🔵 Biru");
  });

  bot.launch();
  logger.log("[TG] Bot Telegram berjalan.");

  return bot;
}

function sendTgMenu(ctx) {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("🔴 Merah", "btn_red")],
    [Markup.button.callback("🟢 Hijau", "btn_green")],
    [Markup.button.callback("🔵 Biru", "btn_blue")]
  ]);

  ctx.reply("Pilih warna favorite kamu:", keyboard);
}

module.exports = {
  startTelegram
};
