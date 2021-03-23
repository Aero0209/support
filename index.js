// Load up the discord.js library
const {
    Client,
    Attachment,
    RichEmbed
  } = require('discord.js');
  const client = new Client();
  const config = require("./config.json");
  
  client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`Une question ? MP MOI`);
  });
  
  client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Une question ? MP MOI`);
  });
  
  client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  });
  
  function SendMessageTicket(message) {
    console.log(config.serverID)
    var server = client.guilds.get(config.serverID);
    c = server.channels.find("name", "ticket-" + message.author.id)
    var Attachment = (message.attachments).array();
    if (Attachment[0] !== undefined) {
        var pp = Attachment[0].url;
    } else {
        var pp = "";
    }
  
    const embed = new RichEmbed()
        .setColor('ORANGE')
        .addField(`Nouveau message de ${message.author.username}`, message.content + " " + pp)
        .setTimestamp();
    c.send({
        embed: embed
    });
  }
  client.on("message", async message => {
    var server = client.guilds.get(config.serverID);
    if (message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (message.channel.type !== "dm") {
        if (message.channel.name.indexOf('ticket') > -1 && command != "close") {
            var ret = message.channel.name.replace('ticket-', '');
  
            var pq = client.users.get(ret)
            const embed = new RichEmbed()
                .setColor('ORANGE')
                .addField(`Nouveau message de ${message.author.username}`, message.content)
                .setTimestamp();
            pq.send({
                embed: embed
            });
  
        } else {
            if (command == "close" && message.channel.name.indexOf('ticket') > -1) {
                var ret = message.channel.name.replace('ticket-', '');
                var pq = client.users.get(ret)
                const embed = new RichEmbed()
        			.setColor('ORANGE')
        			.setTitle(`🎫 Fermeture de votre ticket`)
                    .setDescription("Votre ticket a été fermé par " + message.author + " inutile de répondre à ce message")
                    .setTimestamp();
                pq.send({
                    embed: embed
                });
  
                message.channel.delete()
            }
        }
    }
    if (message.channel.type === "dm") {
        if (server.channels.exists("name", "ticket-" + message.author.id)) return SendMessageTicket(message);
        server.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        	            c.setParent('823977127455883274')
            for (i = 0; i < config.ModeratorRoles.length; i++) {
                var role1 = client.guilds.get(config.serverID).roles.find("name", config.ModeratorRoles[i]);
                c.overwritePermissions(role1, {
                    SEND_MESSAGES: true,
                    READ_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true,
                });
            }
            let role2 = client.guilds.get(config.serverID).roles.find("name", "@everyone");
            c.overwritePermissions(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false
            });

            message.channel.send(`:white_check_mark: Succesfull \n\n:flag_fr:  | Votre message a été transmit au staff.\n\n:flag_us:  | Your message has been send to the support team.`);
            const embed = new RichEmbed()
                .setColor('GREEN')
 				.setTitle(`🎫 Nouveau ticket`)
 				.setFooter(`Vice Blue | Crée par Vato`, 'https://cdn.discordapp.com/attachments/719965641003499630/785159414503571486/viceblueguetteur.png')
			 	.setDescription(`<a:776086479340306453:779635224786894868> <@${message.author.id}> vient de crée un nouveau ticket.\n<a:776086479340306453:779635224786894868>Pour le répondre écrivez le juste dans ce channel ca l'envoiera directement en mp.\n<a:776086479340306453:779635224786894868> Faire \`.close\` pour fermer votre ticket\n\n <a:soon:759502536318648380> problèmes: ` +  message.content );
          	c.send(`<@${message.author.id}>`)
          	c.send(`<@&768890998905503744>`)
            c.send({
                embed: embed
            });

        }).catch(console.error); // Send errors to console
    }
  });
  
client.login(process.env.token);