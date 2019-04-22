const redis = require('redis')
const fs = require('fs')
module.exports = class Database{
    constructor(redisurl){
        this.data = {}
        this.load().then(x=>{
            this.data = x;
            console.log("Loaded Database!")
        }).catch(e=>{
            console.log("Failed Loading Database!")
        })
    }
    load(){
        return new Promise((resolve,reject)=>{
            fs.readFile(this.url,'utf8',(err,str)=>{
                let data = {}
                if(err){
                    console.log(err)
                    reject(err)
                }else{
                    data = JSON.parse(str)
                    for(let index in data){
                        this.get(data[index]).then(m=>data[res[index]]=m)
                    }
                    resolve(data)
                }
            })
        })
    }
    get(key){
        return new Promise((resolve,reject)=>{
            if(key in this.data && this.data[key]!=null){
                resolve(this.data[key])
            }else{
                this.load().then(data=>{

                })
            }
        })
    }
    set(key,value){
        return new Promise((resolve,reject)=>{
            this.client.set(key,value,(err)=>{
                if(err){
                    console.log(err)
                    reject(err)
                }
                resolve(value)
            })
        })
    }
    del(key){
        return new Promise((resolve,reject)=>{
            this.client.del(key,(err)=>{
                if(err){
                    console.log(err)
                    reject(err)
                }
                this.data[key] = undefined
                resolve();
            })
        })
    }
    
}