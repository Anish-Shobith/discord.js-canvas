const { distort } = require("../../index");
const { createCanvas, loadImage } = require("canvas");
const request = require("node-superfetch");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    let image = message.author.displayAvatarURL({format: 'png', size: 512});
    let level = args[0].toLowerCase();
    if(!level) return message.channel.send("Please provide me a level")
    try {
        const { body } = await request.get(image);
        const data = await loadImage(body);
        const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		distort(ctx, level, 0, 0, data.width, data.height);
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'distort.png');

        message.reply(attachment);
    } catch (err) {
        message.reply("Something went wrong please try again!!");
       console.log(err);
    }
}

module.exports.help = {
    name: "distort"
}