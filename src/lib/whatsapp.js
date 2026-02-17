const path = require("path");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

async function startWhatsApp(options = {}) {
  const logger = options.logger || console;
  const commandPrefix =
    options.commandPrefix || process.env.COMMAND_PREFIX || "!";
  const phoneNumberInput =
    options.phoneNumber || process.env.WA_PHONE_NUMBER || "";
  const phoneNumber = phoneNumberInput.replace(/[^0-9]/g, "");

  if (!phoneNumber) {
    logger.log(
      "[WA] WhatsApp dimatikan: tidak ada konfigurasi nomor (phoneNumber)."
    );
    return;
  }

  const authFolder =
    options.authFolder ||
    path.join(__dirname, "..", "..", "auth", "whatsapp");
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    browser: Browsers.appropriate("Sherif Multi Bot"),
    printQRInTerminal:
      typeof options.printQRInTerminal === "boolean"
        ? options.printQRInTerminal
        : true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (connection === "open") {
      logger.log("[WA] Terhubung.");
    } else if (connection === "close") {
      logger.log(
        "[WA] Koneksi tertutup.",
        lastDisconnect?.error?.message || ""
      );
    }
    if (qr) {
      logger.log("[WA] QR diterima. Scan QR atau gunakan pairing code.");
    }
  });

  if (!state.creds.registered) {
    try {
      const code = await sock.requestPairingCode(phoneNumber);
      const message = `[WA] Pairing code untuk ${phoneNumber}: ${code}`;
      logger.log(message);
      if (typeof options.pairingLog === "function") {
        options.pairingLog({ phoneNumber, code, socket: sock });
      }
    } catch (error) {
      logger.error("[WA] Gagal mendapatkan pairing code:", error.message);
    }
  }

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (!text) return;

    if (text.toLowerCase().startsWith(`${commandPrefix}menu`)) {
      await sendWaMenu(sock, from);
    }
  });

  return sock;
}

async function sendWaMenu(sock, jid) {
  const buttons = [
    { buttonId: "btn_red", buttonText: { displayText: "🔴 Merah" }, type: 1 },
    { buttonId: "btn_green", buttonText: { displayText: "🟢 Hijau" }, type: 1 },
    { buttonId: "btn_blue", buttonText: { displayText: "🔵 Biru" }, type: 1 }
  ];

  const buttonMessage = {
    text: "Pilih warna favorite kamu:",
    footer: "Sherif Multi Bot",
    buttons,
    headerType: 1
  };

  await sock.sendMessage(jid, buttonMessage);
}

module.exports = {
  startWhatsApp
};
