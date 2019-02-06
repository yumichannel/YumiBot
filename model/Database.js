const redis = require('redis')
module.exports = class Database{
    constructor(redisurl){
        this.data = {}
        this.client = redis.createClient(redisurl)
        this.load().then(x=>{
            this.data = x;
            console.log("Loaded Database!")
        })
    }
    load(){
        return new Promise((resolve,reject)=>{
            this.client.keys("*",(err,res)=>{
                let data = {}
                if(err){
                    console.log(err)
                    reject(err)
                }else{
                    for(let index in res){
                        this.get(res[index]).then(m=>data[res[index]]=m)
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
                this.client.get(key,(err,res)=>{
                    if(err){
                        console.log(err)
                        reject(err)
                    }else{
                        this.data[key] = JSON.parse(res)
                        resolve(JSON.parse(res))
                    }
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