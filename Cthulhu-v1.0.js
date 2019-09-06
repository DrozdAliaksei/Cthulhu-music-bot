const {Client} = require('discord.js');
const {TOKEN, PREFIX} = require('./config');
const ytdl = require(`ytdl-core`);

const client = new Client({disableEveryone: true});

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Party hard ready)'));

client.on('disconnect', () => console.log('Disconnection...'));

client.on('reconnecting', () => console.log('Reconnecting'));

client.on('message', async msg =>{
    if(msg.author.bot) return undefined;
    if(!msg.content.startsWith(PREFIX)) return undefined;
    const args = msg.content.split(' ');

    if(msg.content.startsWith(`${PREFIX}play`)){
        const voiceChannel = msg.member.voiceChannel;

        if(!voiceChannel) return msg.channel.send('I\'m sorry, but u need to be in voice channel to play music!');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if(!permissions.has('CONNECT')) {
            return msg.channel.send('I cannot connect to your voiceChannel, make shure I have the proper permissions!');
        }
        if(!permissions.has('SPEAK')){
            return msg.channel.send('I cannot speak in this channel, make shure I have the proper permissions');
        }

        try{
            var connection = await voiceChannel.join();
        }catch(error){
            console.error(`I could not join the voice channel: ${error}`);
            return msg.channel.send(`I could not join the voice channel: ${error}`);
        }

        const dispatcher = connection.playStream(ytdl(args[1]))
            .on('end', () => {
                console.log('Song ended!');
                voiceChannel.leave();
            })
            .on('error', error =>{
                console.error(error);
            }); 
        dispatcher.setVolumeLogarithmic(5 / 5);
    }

    else if(msg.content.startsWith(`${PREFIX}leave`)){
        if(!msg.member.voiceChannel) return msg.channel.send('You are not in the voice channel!');
        msg.member.voiceChannel.leave(); 
        console.log('leave the channel');
        return undefined;
    }

    /*else if(msg.content.startsWith(`${PREFIX}join`)){
        const voiceChannel = msg.member.voiceChannel;

        if(!voiceChannel) return msg.channel.send('I\'m sorry, but u need to be in voice channel to play music!');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if(!permissions.has('CONNECT')) {
            return msg.channel.send('I cannot connect to your voiceChannel, make shure I have the proper permissions!');
        }
        if(!permissions.has('SPEAK')){
            return msg.channel.send('I cannot speak in this channel, make shure I have the proper permissions');
        }

        try{
            var connection = await voiceChannel.join();
        }catch(error){
            console.error(`I could not join the voice channel: ${error}`);
            return msg.channel.send(`I could not join the voice channel: ${error}`);
        }
    }*/ 
});

client.login(TOKEN);