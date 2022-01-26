const Discord = require('discord.js');
const voiceDiscord = require('@discordjs/voice');
const prefix = '&';
const fs = require('fs');
const client = new Discord.Client({ intents: 32767});
const { token } = require('./config.json');
const path = require('path');
const { join } = require('path');

client.on('ready', () => {
	console.log('Megubot is alive')
})

client.on('messageCreate', async message => {
	function isCommand(command) {
		return !!message.content.toLowerCase().startsWith(prefix + command);
	};

	if (isCommand('list')) {
		const sounds = fs.readdirSync("./sounds");
		message.channel.send('Here is the list of sound files available right now');
		for (file of sounds) {
			message.channel.send(path.basename(file));
		}
		message.channel.send('To use the bot, join a voice channel, and send ' + prefix + 'play [File name without ".mp3"]');
	}

	if (isCommand('play')) {
		const channel = message.member.voice.channel;
		if (!channel) return message.channel.send('Join a channel first to actually hear me');

		var holder = message.content;
		//message.channel.send('/sounds/' + holder.substring(6) + '.mp3');
		
		const player = voiceDiscord.createAudioPlayer();
		const resource = voiceDiscord.createAudioResource(join(__dirname, '/sounds/' + holder.substring(6) + '.mp3')); 
		/*	holder.substring(6) makes it easier to just add
			more sound files, without extra coding needed 
			in the future, as the command is "&play titleOfFile"
		*/
		const connection = voiceDiscord.joinVoiceChannel({
			channelId: channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});

		player.play(resource);
		connection.subscribe(player);

		player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
			connection.destroy();
		});
	}
})
client.login(token)