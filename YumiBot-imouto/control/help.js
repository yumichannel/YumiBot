module.exports = async function(embed,channel,info){
    let color = Math.floor(Math.random()*255)
    await embed.setColor([color,color,color])
    .addField("Command",info.name)
    .addField('Description',info.description)
    .addField(`Usage`,info.usage)
    .addField(`Arguments`,info.fusage==""?"no arguments":info.fusage)
    channel.send(embed)
}