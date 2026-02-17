# shegraf

Multi-platform bot for **WhatsApp (Baileys)**, **Telegram**, and **Discord** with colorful buttons and WhatsApp pairing code support.

This package is designed so anyone can quickly run a personal or small‑scale bot without touching the internal code.

---

## Features

- WhatsApp bot using **@whiskeysockets/baileys**
  - Device-link **pairing code** support
  - Simple command handler (e.g. `!menu`)
  - Reply with **emoji-colored buttons** (WhatsApp does not support true colored button backgrounds)
- Telegram bot using **Telegraf**
  - `/start` and `/menu` commands
  - Inline buttons: Red, Green, Blue
- Discord bot using **discord.js v14**
  - Text command (default: `!menu`)
  - **Colored buttons** (Danger/Success/Primary)
  - Colored embed response
- Single CLI entry point to start all enabled platforms.

---

## Installation

Install globally (recommended for running the bot from anywhere):

```bash
npm install -g shegraf
```

Or use it once without global install:

```bash
npx shegraf
```

---

## CLI Usage

Once installed globally, run:

```bash
shegraf
```

Behind the scenes this runs the CLI script at `src/index.js` which:

- Starts the WhatsApp bot (if `WA_PHONE_NUMBER` is set)
- Starts the Telegram bot (if `TELEGRAM_BOT_TOKEN` is set)
- Starts the Discord bot (if `DISCORD_BOT_TOKEN` is set)

If any of these environment variables is missing, that platform is simply skipped with an informational log message. The process does **not** crash.

---

## Environment Variables

Set the following variables to enable each platform.

### Common

- `COMMAND_PREFIX` (optional)
  - Default: `!`
  - Used for text commands on WhatsApp and Discord (e.g. `!menu`)

### WhatsApp (Baileys)

- `WA_PHONE_NUMBER` (required to enable WhatsApp)
  - Format: international, numbers only.  
    - Example (Indonesia): `62812xxxxxxxx`

When `WA_PHONE_NUMBER` is provided and the device is not yet registered, the bot will:

- Print a QR code to the terminal
- Print a **pairing code** for device link

WhatsApp data is stored in a local folder (multi-file auth) under:

```text
auth/whatsapp
```

### Telegram

- `TELEGRAM_BOT_TOKEN` (required to enable Telegram)
  - Example: `123456789:AA...` from BotFather

### Discord

- `DISCORD_BOT_TOKEN` (required to enable Discord)
  - Obtain from Discord Developer Portal
  - Make sure the **MESSAGE CONTENT INTENT** is enabled for the bot

---

## Platform Details

### 1. WhatsApp (Baileys)

Powered by [`@whiskeysockets/baileys`](https://github.com/WhiskeySockets/Baileys).

Main behavior:

- Connects using Baileys with multi-file auth
- If not registered:
  - Requests pairing code for `WA_PHONE_NUMBER`
  - Logs something like:

    ```text
    [WA] Pairing code for 62812xxxxxxxx: ABCD-EFGH
    ```

#### Pairing Steps

1. Set `WA_PHONE_NUMBER` (numbers only, e.g. `62812xxxxxxxx`)
2. Run:

   ```bash
   shegraf
   ```

3. In the terminal you will see:
   - QR code
   - Pairing code (e.g. `ABCD-EFGH`)
4. On your phone:
   - Open WhatsApp
   - Go to **Linked devices** / **Perangkat tertaut**
   - Tap **Link a device**
   - Either scan the QR code or choose the option to enter a device code and type the pairing code from the terminal.

After pairing, the bot is connected to your WhatsApp account.

#### WhatsApp Commands

- Default prefix: `!`

Send to the bot:

```text
!menu
```

The bot responds with a menu containing three buttons:

- 🔴 Merah
- 🟢 Hijau
- 🔵 Biru

Note: WhatsApp does not support true colored button backgrounds like Discord, so the color effect comes from the emojis and labels.

---

### 2. Telegram

Powered by [`telegraf`](https://github.com/telegraf/telegraf).

Once `TELEGRAM_BOT_TOKEN` is set and the CLI is running, the bot:

- Responds to `/start`
- Responds to `/menu`

Both commands send a message with inline buttons:

- 🔴 Merah
- 🟢 Hijau
- 🔵 Biru

On button press, the bot replies with which color you selected.

#### Setup Steps

1. Talk to **@BotFather** on Telegram and create a bot
2. Copy the bot token and set it as:

   ```bash
   export TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
   ```

   or on Windows (PowerShell):

   ```powershell
   setx TELEGRAM_BOT_TOKEN "your-telegram-bot-token"
   ```

3. Run:

   ```bash
   shegraf
   ```

4. Open your bot chat and send `/start` or `/menu`.

---

### 3. Discord

Powered by [`discord.js` v14](https://discord.js.org/).

Once `DISCORD_BOT_TOKEN` is set and the CLI is running, the bot:

- Listens to messages in guild channels
- Responds to text command (default): `!menu`

The bot replies with a message containing three buttons:

- **Merah** (Danger style, red)
- **Hijau** (Success style, green)
- **Biru** (Primary style, blurple/blue)

When you click a button, it responds with an **embed**:

- Title: `Pilihan Warna`
- Description: `Kamu pilih <color>`
- Embed color matching the button (red/green/blue)

#### Setup Steps

1. Create an application & bot at [Discord Developer Portal](https://discord.com/developers/applications)
2. Enable the **MESSAGE CONTENT INTENT** in the bot settings
3. Generate an invite URL with `bot` scope and necessary permissions (e.g. Send Messages, Read Message History)
4. Invite the bot to your server
5. Set the environment variable:

   ```bash
   export DISCORD_BOT_TOKEN="your-discord-bot-token"
   ```

   or on Windows (PowerShell):

   ```powershell
   setx DISCORD_BOT_TOKEN "your-discord-bot-token"
   ```

6. Run:

   ```bash
   shegraf
   ```

7. In a text channel, type:

   ```text
   !menu
   ```

---

## Programmatic Usage (Library)

You can also use this package as a **library** inside your own Node.js project, not only as a CLI.

### Install in your project

```bash
npm install shegraf
```

### Import and use

CommonJS example:

```js
const {
  startWhatsApp,
  startTelegram,
  startDiscord,
  startAll,
  createShegraf
} = require("shegraf");

// Option 1: Start everything (WhatsApp, Telegram, Discord) reading from env
startAll();

// Option 2: Start everything with explicit options (no .env required)
startAll({
  whatsapp: {
    phoneNumber: "62812xxxxxxxx",
    pairingLog: ({ phoneNumber, code }) => {
      console.log("PAIRING", phoneNumber, code);
    }
  },
  telegram: {
    token: "your-telegram-bot-token"
  },
  discord: {
    token: "your-discord-bot-token",
    commandPrefix: "!"
  }
});

// Option 3: Start only specific platforms using options
startWhatsApp({ phoneNumber: "62812xxxxxxxx" });
startTelegram({ token: "your-telegram-bot-token" });
startDiscord({ token: "your-discord-bot-token", commandPrefix: "!" });

// Option 4: Use high-level Shegraf wrapper
const bot = createShegraf({
  whatsapp: { phoneNumber: "62812xxxxxxxx" },
  telegram: { token: "your-telegram-bot-token" },
  discord: { token: "your-discord-bot-token", commandPrefix: "!" }
});

bot.start();
```

All environment variables described in the previous sections (`WA_PHONE_NUMBER`, `TELEGRAM_BOT_TOKEN`, `DISCORD_BOT_TOKEN`, `COMMAND_PREFIX`) are still supported, but any explicit options you pass to the functions take precedence.

You can combine this with your own configuration file (for example `config.js`) and other application logic.

### Custom Telegram inline buttons (colored style)

Telegram tidak mengizinkan ganti warna background tombol secara bebas, tapi kamu bisa
meniru efek "berwarna" dengan emoji dan posisi tombol. Shegraf menyediakan opsi
`menuButtons` di `TelegramOptions`.

Contoh 1: tombol join group seperti banner merah/hijau:

```js
const { createShegraf } = require("shegraf");

const bot = createShegraf({
  telegram: {
    token: "your-telegram-bot-token",
    menuButtons: [
      // Baris pertama
      {
        id: "join_group",
        text: "🟥 Join Group",
        url: "https://t.me/joinchat/xxxx",
        row: 0
      },
      {
        id: "group_ramadhan",
        text: "🟩 Grup Ramadhan",
        url: "https://t.me/joinchat/yyyy",
        row: 0
      },
      // Baris kedua
      {
        id: "join_community",
        text: "🟥 Join Community",
        url: "https://t.me/joinchat/zzzz",
        row: 1
      }
    ]
  }
});

bot.start();
```

Setiap item `menuButtons`:

- `text`: teks tombol (gunakan emoji warna seperti 🟥🟩🟦)
- `url`: jika diisi, tombol menjadi link (Join Group, Join Channel, dll.)
- `id`: callback data, dipakai jika tidak ada `url`
- `row`: nomor baris (0, 1, 2, ...) untuk mengatur layout per baris
- `replyText`: balasan custom saat tombol callback diklik (opsional)

Contoh 2: preset "VPS menu" siap pakai (tanpa tulis semua tombol)

```js
const { createShegraf } = require("shegraf");

const bot = createShegraf({
  telegram: {
    token: "your-telegram-bot-token",
    menuPreset: "vps"
  }
});

bot.start();
```

Preset `menuPreset: "vps"` otomatis membuat layout seperti:

- 🟥 L-1 STATUS VPS, 🟥 L-1 VPS MENU, 🟥 L-1 CPANEL MENU (baris pertama)
- 🟥 L-1 PROJECT MENU, 🟥 L-1 INSTALL MENU (baris kedua)
- 🟥 L-1 TOOLS MENU, 🟥 L-1 CVPS MENU (baris ketiga)
- 🟥 L-1 ENCRYPT MENU (baris keempat)

User shegraf cukup mengatur token dan memanggil preset ini untuk mendapatkan inline menu bergaya VPS merah tanpa perlu define tombol manual.

---

## Local Development

If you clone the repository instead of using the published package:

```bash
git clone https://github.com/sherifcld/sherif-multi-bot.git
cd sherif-multi-bot
npm install
```

You can try the library example:

```bash
cd example
cp config.example.js config.js   # or copy manually on Windows
```

Edit `config.js` and fill in your own WhatsApp number and tokens, then run:

```bash
node index.js
```

This starts all enabled platforms based on your config file.

---

## Security Notes

- Never share your `DISCORD_BOT_TOKEN`, `TELEGRAM_BOT_TOKEN`, or WhatsApp auth files
- If you suspect your tokens have leaked, revoke and regenerate them immediately
- For production use, consider running the bot on a separate machine or server

---

## License

MIT License. See the repository or npm page for full details.

