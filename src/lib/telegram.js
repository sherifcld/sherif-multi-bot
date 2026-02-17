const { Telegraf, Markup } = require("telegraf");

const defaultButtons = [
  { id: "btn_red", text: "🔴 Merah" },
  { id: "btn_green", text: "🟢 Hijau" },
  { id: "btn_blue", text: "🔵 Biru" }
];

const vpsMenuButtons = [
  { id: "status_vps", text: "🟥 L-1 STATUS VPS", row: 0 },
  { id: "vps_menu", text: "🟥 L-1 VPS MENU", row: 0 },
  { id: "cpanel_menu", text: "🟥 L-1 CPANEL MENU", row: 0 },
  { id: "project_menu", text: "🟥 L-1 PROJECT MENU", row: 1 },
  { id: "install_menu", text: "🟥 L-1 INSTALL MENU", row: 1 },
  { id: "tools_menu", text: "🟥 L-1 TOOLS MENU", row: 2 },
  { id: "cvps_menu", text: "🟥 L-1 CVPS MENU", row: 2 },
  { id: "encrypt_menu", text: "🟥 L-1 ENCRYPT MENU", row: 3 }
];

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

  const buttons =
    Array.isArray(options.menuButtons) && options.menuButtons.length > 0
      ? options.menuButtons
      : options.menuPreset === "vps"
      ? vpsMenuButtons
      : defaultButtons;

  bot.start((ctx) => sendTgMenu(ctx, buttons));
  bot.command("menu", (ctx) => sendTgMenu(ctx, buttons));

  buttons.forEach((buttonConfig) => {
    if (buttonConfig.url) {
      return;
    }
    bot.action(buttonConfig.id, async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.reply(
        buttonConfig.replyText || `Kamu pilih ${buttonConfig.text}`
      );
    });
  });

  bot.launch();
  logger.log("[TG] Bot Telegram berjalan.");

  return bot;
}

function sendTgMenu(ctx, buttons) {
  const rowsMap = new Map();

  buttons.forEach((buttonConfig) => {
    const rowIndex =
      typeof buttonConfig.row === "number" ? buttonConfig.row : 0;

    const button = buttonConfig.url
      ? Markup.button.url(buttonConfig.text, buttonConfig.url)
      : Markup.button.callback(buttonConfig.text, buttonConfig.id);

    if (!rowsMap.has(rowIndex)) {
      rowsMap.set(rowIndex, []);
    }
    rowsMap.get(rowIndex).push(button);
  });

  const rows = Array.from(rowsMap.keys())
    .sort((a, b) => a - b)
    .map((key) => rowsMap.get(key));

  const keyboard = Markup.inlineKeyboard(rows);

  ctx.reply("Pilih warna favorite kamu:", keyboard);
}

module.exports = {
  startTelegram
};
