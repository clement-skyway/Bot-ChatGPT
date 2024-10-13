const { ChannelType } = require('discord.js');
const axios = require('axios');
const colors = require('colors')

module.exports = {
    name: "messageCreate",

    async execute(client, message) {
        // Vérifications initiales
        if (!message.guild || message.author.bot) return;
        if (message.channel.id !== process.env.CHANNEL_ID || message.channel.type !== ChannelType.GuildText) return;
        // Si pas de contenu
        if (!message.content) {
            message.react('❌');
            return;
        }

        message.channel.sendTyping();

        // Requête vers l'API SkyWay
        try {
            const response = await axios.post('https://api.skyway-bot.fr/v1/gpt', {
                "content": message.content  // Utilisation du contenu du message pour envoyer à l'API 
            }, {
                headers: {
                    "Authorization": process.env.API_KEY
                }
            });
            await message.reply(response.data.content);
            console.log(`[INFO] Reponse envoyée à la question : ${message.content}`.green);
        } catch (error) {
            console.error('Erreur:', error.response ? error.response.data : error.message);
            await message.reply('Une erreur est survenue lors du traitement de votre demande.');
        }
    }
};
