const Discord = require('discord.js')
module.exports = {
    info: {
        name: "snap",
        category: "image",
        description: "Collect infinity stones",
        nsfw: false,
        usage: "",
        fusage:"",
        ishide: false,
        cooldown: 0
    },
    run(message=new Discord.Message,args){
        // Can bot manage roles?
        if(!message.guild.member(message.client.user.id).permissions.has('ADMINISTRATOR')) return

        var dust= message.guild.roles.find("name","dust")
        // Create role if dont have one
        if(dust==undefined) message.guild.createRole({
            name: "dust",
            color:"BLACK"
        }).then(dust = message.guild.roles.find("name","dust"))

        var remove_role = (memlist)=>{
            return new Promise((resolve,reject)=>{
                var rolelist = []
                memlist.forEach(gm=>{
                    console.log(gm.displayName);
                    try {
                        rolelist.push({
                            id: gm.id,
                            roles: gm.roles
                        });
                        
                        message.guild.member(gm.user.id).setRoles([dust.id])
                    } catch (error) {
                        console.log(this.info.name+" remove roles error:\n"+error);
                    }
                })
                resolve(rolelist)
            })
        }
        
        var set_role = (rolelist = [])=>{
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    rolelist.forEach(memrole=>{
                        try {
                            message.guild.member(memrole.id).setRoles(memrole.roles)
                        } catch (error) {
                            console.log(this.info.name+" set roles error:\n"+error);
                        }
                    })
                    resolve(2)
                },parseInt(args)*1000)
            })
        }

        if(message.guild.channels.array().findIndex(c=>c.name=="soulstone")==-1){
            return message.channel.send("*You need **SoulStone** channel*")
        }
        message.channel.send(`*${message.member.nickname} snapped. Everyone is turning to dust.*`).then(()=>{
            const memlist = message.guild.members.filter(mb=>mb.user.bot==false && mb.permissions.has("ADMINISTRATOR")==false)
            const memdust = memlist.random(memlist.size*50/100)
            remove_role(memlist).then((rolelist)=>{
                message.guild.channels.find("name","soulstone")
                set_role(rolelist).then(stat=>{
                    // console.log(stat);
                })
            })
        })
    }
}