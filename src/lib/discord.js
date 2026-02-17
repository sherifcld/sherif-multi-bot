const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

function startDiscord(options = {}) {
  const logger = options.logger || console;
  const token = options.token || process.env.DISCORD_BOT_TOKEN || "";
  const commandPrefix =
    options.commandPrefix || process.env.COMMAND_PREFIX || "!";

  if (!token) {
    logger.log(
      "[DC] Discord dimatikan: tidak ada konfigurasi token."
    );
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
  });

  client.once("ready", () => {
    logger.log(`[DC] Login sebagai ${client.user.tag}`);
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.content) return;

    if (message.content.toLowerCase().startsWith(`${commandPrefix}menu`)) {
      await sendDiscordMenu(message);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    let color;
    let name;

    if (interaction.customId === "btn_red") {
      color = 0xff0000;
      name = "Merah";
    } else if (interaction.customId === "btn_green") {
      color = 0x00ff00;
      name = "Hijau";
    } else if (interaction.customId === "btn_blue") {
      color = 0x0000ff;
      name = "Biru";
    } else {
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Pilihan Warna")
      .setDescription(`Kamu pilih ${name}`)
      .setColor(color);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  });

  client.login(token);

  return client;
}

async function sendDiscordMenu(message) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("btn_red")
      .setLabel("Merah")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("btn_green")
      .setLabel("Hijau")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("btn_blue")
      .setLabel("Biru")
      .setStyle(ButtonStyle.Primary)
  );

  await message.reply({
    content: "Pilih warna favorite kamu:",
    components: [row]
  });
}

module.exports = {
  startDiscord
};
