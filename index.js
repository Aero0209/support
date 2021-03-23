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
    client.user.setActivity(`Want to purshase ? | DM ME`);
  });
  
  client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Want to purshase ? | DM ME`);
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
        .addField(`New message from ${message.author.username}`, message.content + " " + pp)
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
                .addField(`New message from ${message.author.username}`, message.content)
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
        			.setTitle(`🎫 Ticket Closed`)
                    .setDescription("Your ticket is closed by " + message.author + " don't respond after this")
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
                var role1 = client.guilds.get(config.serverID).roles.find("id", "820684977707417651");
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
 				.setTitle(`🎫 New Ticket`)
 				.setFooter(`Vice Blue | Crée par Vato`, 'https://cdn.discordapp.com/attachments/719965641003499630/785159414503571486/viceblueguetteur.png')
			 	.setDescription(`<:821087553243316244:823981341778903051> <@${message.author.id}> just made a new ticket.\n<:821087553243316244:823981341778903051> To talk with him just send a message here.\n<:821087553243316244:823981341778903051> Do \`.close\` to close the ticket\n\n <:821087553243316244:823981341778903051> His message: ` +  message.content );
          	c.send(`<@${message.author.id}>`)
          	c.send(`<@&768890998905503744>`)
            c.send({
                embed: embed
            });

        }).catch(console.error); // Send errors to console
    }
  });
  
client.login(process.env.token);