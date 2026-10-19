const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { loadConfig } = require("./config.js");
const { startBot } = require("./runtime.js");

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

function createClient() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
    ],
  });

  const splatoon3WeaponSystem = require("./splatoon3weapon.js");

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
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
    } catch (error) {
      console.error("Failed to handle interaction:", error.message);
    }
  });

  return client;
}

async function main() {
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    console.error("Configuration error:", error.message);
    process.exitCode = 1;
    return;
  }
  if (process.argv.includes("--check")) {
    const client = createClient();
    await client.destroy();
    console.log("Configuration and bot modules are valid. No Discord connection was made.");
    return;
  }
  await startBot({ client: createClient(), commands, config });
}

if (require.main === module) {
  main().catch((error) => {
    // Do not print Discord request objects: they may contain credentials.
    console.error("Bot startup failed:", error.code || error.name);
    console.error("Check DISCORD_TOKEN, PORT, the .env file, network access, and the Discord Developer Portal settings.");
    process.exitCode = 1;
  });
}

module.exports = { createClient, commands };
