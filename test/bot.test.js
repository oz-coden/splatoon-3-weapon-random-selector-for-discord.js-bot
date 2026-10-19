const test = require("node:test");
const assert = require("node:assert/strict");
const { GatewayIntentBits } = require("discord.js");
const { createClient, commands } = require("../main.js");
const { getRandomWeaponResult } = require("../splatoon3weapon.js");

test("slash commands require no privileged or message intents", async (t) => {
  const client = createClient();
  t.after(() => client.destroy());
  assert.equal(client.options.intents.bitfield, GatewayIntentBits.Guilds);
  assert.deepEqual(commands.map((c) => c.name), ["ping", "wrs"]);
});

test("all advertised weapon modes select a weapon at both random boundaries", (t) => {
  const choices = commands.find((c) => c.name === "wrs").options[0].choices;
  assert.equal(choices.length, 12);
  for (const random of [0, 0.999999999]) {
    const mocked = t.mock.method(Math, "random", () => random);
    for (const mode of [null, undefined, "unknown", ...choices.map((c) => c.value)]) {
      const result = getRandomWeaponResult(mode);
      assert.match(result, /選ばれたのは、「.+」でした！/);
      assert.doesNotMatch(result, /undefined/);
      const choice = choices.find((c) => c.value === mode);
      if (choice && mode !== "normal_mode") assert.ok(result.includes(choice.name));
    }
    mocked.mock.restore();
  }
});

test("wrs handler loads the bundled module and replies", async (t) => {
  const client = createClient();
  t.after(() => client.destroy());
  let reply;
  await client.listeners("interactionCreate")[0]({
    isChatInputCommand: () => true, commandName: "wrs",
    options: { getString: () => "shooter_mode" }, reply: async (text) => { reply = text; },
  });
  assert.match(reply, /シューター限定/);
});
