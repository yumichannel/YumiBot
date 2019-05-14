const Discord = require('discord.js');
const ytdl = require('ytdl-core');
module.exports={
    info:{
        name:"music",
        category:"music",
        description:"play music from youtube",
        usage:"**I.`prefix+music`**\n"
        +"`!music join` : join a voice channel\n"
        +"`!music stop` : stop playing music\n"
        +"`!music play` : start the music stream\n"
        +"`!music add [someYtLink]` : add music to queue\n"
        +"`!music find [keyword]` : find music by keyword\n"
        +"`!music join` : join a voice channel\n"
        +"**II.`muse>>`**\n"
        +"`muse>>queue` : show the music queue\n "
        +"`muse>>pause` : Pause the stream\n"
        +"`muse>>resume` : Resume the stream\n"
        +"`muse>>loop>>none|one|all` : Set no loop/loop one song/loop all song in queue\n"
        +"`muse>>random` : Shuffle the queue \n"  
        ,
        fusage:"",
        nfsw:false,
        ishide: true,
        cooldown:0
    },
    commands:{
        
        'status':function(msg=Discord.Message){
            var embed = new Discord.RichEmbed()
            var status = msg.client.music.get(msg.guild.id).status
            embed.setTitle("Music player status")
            embed.setDescription("--------------------")
            embed.addField("ON/OFF",status.isplay==true?"ON":"OFF")
            embed.addField("Random",status.israndom==true?"ON":"OFF")
            embed.addField("LOOP",status.loop==0?"No loop":(status.loop==1?"Loop one":"Loop all"))
            msg.channel.send(embed)
        },
        'add':(msg=Discord.Message)=>{
            var args = msg.content.split(' ');
            var imusic = msg.client.music.get(msg.guild.id)
            if(imusic==undefined) return msg.channel.send('```Bot is not in voice```')
            if(args[2].startsWith('http')){
                ytdl.getInfo(args[2]).then(info=>{
                    imusic.queue.push({
                        name: info.player_response.videoDetails.title,
                        url: args[2]
                    })
                    msg.channel.send(`Added *${info.player_response.videoDetails.title}*`,{code:true})
                })
            }
        },
        'join': async (msg=Discord.Message)=>{
            if(msg.channel.type!='text') return
            var voiceChannel = msg.member.voiceChannel
            var imusic = msg.client.music.get(msg.guild.id)
            if(!voiceChannel) return msg.channel.send("join voice first")
            await voiceChannel.join()
            if(!imusic){
                msg.client.music.set(msg.guild.id,{
                    queue: [],
                    status: {
                        isplay: false,
                        israndom: false,
                        loop: 0
                    }
                })
                
            }
        },
        'stop': (msg=Discord.Message)=>{
            msg.member.voiceChannel.leave()
            var imusic = msg.client.music.get(msg.guild.id)
            imusic.status.isplay = false
            imusic.status.queue = []
        },
        'play': (msg=Discord.Message)=>{
            var voiceChannel = msg.member.voiceChannel
            var imusic = msg.client.music.get(msg.guild.id)
            if(!voiceChannel) return msg.channel.send("join voice first")
            if(imusic.status.isplay==true){
                return msg.channel.send('```Music player is on```')
            }else{
                imusic.status.isplay= true
                msg.client.music.set(msg.guild.id,imusic)
                var dispatcher;
                play(imusic.queue[0])
                function play(url){
                    console.log(url);
                    if(url==undefined) return msg.channel.send("Queue is empty.").then(m=>{
                        imusic = m.client.music.get(msg.guild.id)
                        imusic.status.isplay=false
                        m.client.music.set(msg.guild.id,imusic)
                        voiceChannel.leave()
                    })
                    try {
                        dispatcher = msg.guild.voiceConnection.playStream(ytdl(url.url,
                        {
                            audioonly:true,
                            highestaudio:true
                        }),
                        {passes:1})
                        msg.channel.send(`Playing: ${url.name}`,{code:true})
                    } catch (error) {
                        console.log(error)
                    }
                    var collector = msg.channel.createMessageCollector(m=>m.content.startsWith("muse>>"))
                    
                    collector.on('collect',m=>{
                        var option = m.content.split('>>')
                        switch(option[1]){
                            case 'queue':
                                var embed = new Discord.RichEmbed()
                                var list = ""
                                embed.setTitle("Music in queue")
                                for(let item in m.client.music.get(m.guild.id).queue){
                                    list+=m.client.music.get(m.guild.id).queue[item].name+"\n"
                                }
                                embed.setDescription(list)
                                m.channel.send(embed)
                                break
                            case 'pause':
                                m.channel.send("```Music player pause!```").then(()=>{
                                    dispatcher.pause()
                                })
                                break
                            case 'resume':
                                m.channel.send("```Music player resume!```").then(()=>{
                                    dispatcher.resume()
                                })
                                break
                            case 'skip':
                                dispatcher.end()
                                break;
                            case 'loop':
                                var selection=0
                                var text=""
                                if(option[2]=='none'){
                                    selection = 0
                                    text = "```No loop```"
                                }else{
                                    if(option[2]=='one'){
                                        selection = 1
                                        text = "```Loop current song```"
                                    }else{
                                        if(option[2]=='all'){
                                            selection = 2
                                            text = "```Loop all```"
                                        }
                                    }
                                }
                                imusic.status.loop = selection
                                msg.client.music.set(msg.guild.id,imusic)
                                break
                            case 'random':
                                for(let i = imusic.queue.length-1;i>=0;i++){
                                    var j,x;
                                    j = Math.floor(Math.random()*i+1);
                                    x = imusic.queue[i]
                                    imusic.queue[i] = imusic.queue[j]
                                    imusic.queue[j] = x
                                }
                                msg.client.music.set(msg.guild.id,imusic)
                                msg.channel.send('```Queue is random```')
                                break
                            default:
                                break
                        }
                    })
                    dispatcher.on('end',()=>{
                        collector.stop();
                        imusic = msg.client.music.get(msg.guild.id)
                        if(imusic.status.loop == 0){
                            imusic.queue.shift()
                            play(imusic.queue[0])
                        }else{
                            if(imusic.status.loop == 1){
                                play(url)
                            }else{
                                if(imusic.status.loop == 2){
                                    let xurl = imusic.queue.shift();
                                    imusic.queue.push(xurl)
                                    msg.client.music.set(msg.guild.id,imusic)
                                    play(xurl)
                                }
                            }
                        }
                    })
                    dispatcher.on('error',error=>{
                        return msg.channel.send("Error").then(()=>{
                            collector.stop();
                            imusic.queue.shift()
                            play(imusic.queue[0])
                        })
                    })
                }
            }
        }
    },
    async run(message,args){
        return message.channel.send("```This feature is not available```");
        var option = args.split(' ')
        if(!this.commands[option[0]]) return
        this.commands[option[0]](message)
    }
}