const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token, guildId, clientId } = require("./config.json");
const { Client, Intents } = require("discord.js");
const { text } = require("stream/consumers");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands = [
  new SlashCommandBuilder()
    .setName("qrcode")
    .setDescription("create a qrc ode")
    .addStringOption((option) =>
      option.setName("text").setDescription("qrcode text").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("width").setDescription("width of the qrcode image")
    )
    .addNumberOption((option) =>
      option.setName("height").setDescription("set height of the qrcode image")
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "qrcode") {
    try {
      let width = interaction.options.getNumber("width") || 200;
      let height = interaction.options.getNumber("height") || 200;
      let text = interaction.options.getString("text");
      let url = encodeURI(
        `https://chart.googleapis.com/chart?cht=qr&chl=${text}&chs=${width}x${height}`
      );

      await interaction.reply({
        content: url,
        ephemeral: true,
      });
    } catch (err) {
      console.log(err);
    }
  }
});

client.login(token);
