const express = require("express");
const app = express();
const { Client, GatewayIntentBits } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const commands = [
  {
    name: "ping",
    description: "Pong!というメッセージと、現在の遅延状況を報告します。",
  },
  {
    name: "wrs",
    description: "Splatoon3のブキをランダムで出力します。",
    options: [
      {
        name: "mode",
        description: "候補の中から操作を選択します。",
        type: 3,
        required: false,
        choices: [
          { name: "通常モード", value: "normal_mode" },
          { name: "シューター限定", value: "shooter_mode" },
          { name: "ローラー限定", value: "roller_mode" },
          { name: "チャージャー限定", value: "charger_mode" },
          { name: "バケツ限定", value: "bucket_mode" },
          { name: "スピナー限定", value: "spiner_mode" },
          { name: "マニューバー限定", value: "dualies_mode" },
          { name: "シェルター限定", value: "shelter_mode" },
          { name: "ブラスター限定", value: "blaster_mode" },
          { name: "フデ限定", value: "brush_mode" },
          { name: "弓限定", value: "bow_mode" },
          { name: "ワイパー限定", value: "wiper_mode" },
        ],
      },
    ],
  },
];

const splatoon3WeaponSystem = require("./functions/splatoon3weapon.js");

app.listen(3000, () => {
  console.log("Program is running!");
});
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

client.once("clientReady", async () => {
  await client.application.commands.set(commands);
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName == "ping") {
    const embed = new EmbedBuilder()
      .setColor([0, 0, 255])
      .setTitle("Pong!")
      .addFields({ name: "検証結果", value: client.ws.ping + "ミリ秒" })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  } else if (interaction.commandName == "wrs") {
    const mode = interaction.options.getString("mode");
    const resultMessage = splatoon3WeaponSystem.getRandomWeaponResult(mode);
    await interaction.reply(resultMessage);
  }
});

client.login(process.env.token);
