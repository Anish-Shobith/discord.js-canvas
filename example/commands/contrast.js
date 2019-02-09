const { contrast } = require("../../index");
const { createCanvas, loadImage } = require("canvas");
const request = require("node-superfetch");
const Discord = require("discord.js");

module.exports.run = async (bot, message) => {

    let image = message.author.displayAvatarURL({format: 'png', size: 512});

    try {
        const { body } = await request.get(image);
        const data = await loadImage(body);
        const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		contrast(ctx, 0, 0, data.width, data.height);
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