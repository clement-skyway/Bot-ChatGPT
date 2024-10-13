// Import des modules nécessaires
require('dotenv').config(); // Charger les variables d'environnement depuis .env
const { Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const fs = require("fs");
const colors = require("colors"); // Import pour les logs colorés

// Création du client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction
    ],
    presence: {
        activities: [{
            name: process.env.status,
            type: ActivityType.Custom
        }],
        status: "online"
    },
    allowedMentions: {
        parse: ["users"],
        repliedUser: true
    }
});

// Connexion au bot en utilisant le token du fichier .env
client.login(process.env.TOKEN)
    .then(() => console.log(`[INFO] Bot connecté avec succès`.green))
    .catch((error) => console.error(`[ERREUR] Échec de la connexion: ${error.message}`.red));

// Chargement des événements depuis le dossier "events"
const loadEvents = () => {
    const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    }
    console.log(`[INFO] ${eventFiles.length} événements chargés`.green);
};

loadEvents();

// Gestion des erreurs
process.on("unhandledRejection", (error) => {
    if (error.code === 10062) return; // Ignorer les erreurs d'interaction inconnues
    console.error(`[ERREUR NON GÉRÉE] ${error.message}`.red);
});

process.on("uncaughtException", (error) => {
    console.error(`[EXCEPTION] ${error.message}`.red);
});