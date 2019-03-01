
Client File Example
```js
const { Client, Collection } = require("discord.js");
const { readdir } = require("fs");
const config = require("./config");

const bot = new Client({
    disableEveryone: true
});

bot.commands = new Collection();

let load = (dir) => {
    readdir(dir, (err, files) => {
        let jsfile = files.filter(f => f.split(".")[1] === "js");

        jsfile.forEach((f, i) => {
            delete require.cache[require.resolve(`${dir}${f}`)];

            let props = require(`${dir}${f}`);
            console.log(`${f} loaded!`);
            
            bot.commands.set(props.help.name, props);
            if (props.help.aliases) props.help.aliases.forEach(alias => bot.aliases.set(alias, props.help.name));
        });
    });
}

load("./commands/");

bot.on("ready", () => {
    console.log(`${bot.user.username} is now online!`);
    bot.user.setActivity("something", {
        type: "WATCHING"
    });
});

bot.on("message", async message => {
    const prefix = config.prefix;
    if (message.author.bot || message.channel.type != "text") return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if (!message.content.startsWith(prefix)) return;

    let commandfile = bot.commands.get(cmd);
    if (commandfile) commandfile.run(bot, message, args);
});

bot.login(config.token)
```

Config File
```js
module.exports = {
token: "",
prefix: ""
}
```

Contrast Example
```js
const { contrast } = require("discord.js-canvas");
const { createCanvas, loadImage } = require("canvas");
const request = require("node-superfetch");
const Discord = require("discord.js");

module.exports.run = async (bot, message) => {

// If the user is mentioned it will take the mentioned user pic or else the message author pic

    let image = message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL({format: 'png', size: 512}) :message.author.displayAvatarURL({format: 'png', size: 512});

    try {
        const { body } = await request.get(image);
        const data = await loadImage(body);
        const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		contrast(ctx, 0, 0, data.width, data.height);

//MessageAttachement - Discord.js-12.0.0
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'contrast.png');

        message.reply(attachment);
    } catch (err) {
        message.reply("Something went wrong please try again!!");
       console.log(err);
    }
}

module.exports.help = {
    name: "contrast"
}
```
