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