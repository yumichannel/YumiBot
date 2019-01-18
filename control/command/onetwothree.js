const Discord = require('discord.js')
module.exports = {
    info:{
        name: "onetwothree",
        category: "game",
        description: "you give a rock, bot will return rock,paper or scissors",
        nsfw: false
    },
    answer:{
        win:[
            "Arghhhhhh!!!! Are you cheating me??? >.<"
        ],
        lose:[
            "Yeahhhhh!!! I win, I win!!! ^o^"
        ],
        draw:[
            "Want to play again, dude? :3"
        ]
    },
    run(message,args){
        var uwin =()=>{
            var embed = new Discord.RichEmbed()
            embed.description(this.answer.win[0])
            message.channel.send(embed)
        }
        var ulose =()=>{
            var embed = new Discord.RichEmbed()
            embed.description(this.answer.lose[0])
            message.channel.send(embed);
        }
        const list = ["scissors","rock","paper"]
        const filter = m=>m.author.id==message.author.id;
        const collector = message.channel.createMessageCollector(filter);
        message.channel.send("Senpai. Let's play one,two,three.");
        collector.on('collect',m=>{
            if(m.content!="scissors" && m.content!="rock" && m.content!="paper"){
                message.channel.send("`"+m.content+"` is not answer, Senpai =.=");
            }else{
                collector.stop();
            }
        })
        collector.on('end',m=>{
            var last = m.last();
            var choice = Math.floor(Math.random()*3);
            message.channel.send(list[choice])
            
            if(last == list[choice]){
                var embed = new Discord.RichEmbed()
                embed.description(this.answer.draw[0])
                message.channel.send(this.answer.draw[0])
            }else{
                if(last=="scissors"){
                    if(list[choice]=="paper") uwin();
                    if(list[choice]=="rock") ulose();
                }
                if(last=="rock"){
                    if(list[choice]=="scissors") uwin();
                    if(list[choice]=="paper") ulose();
                }
                if(last=="paper"){
                    if(list[choice]=="rock") uwin();
                    if(list[choice]=="scissors") ulose();
                }
            }
        })
    }
}

