const fs = require('fs')
module.exports = class Database{
    constructor(redisurl){
        this.data = {}
        this.url = redisurl
        // this.load().then(status=>{
        //     if(status==1){
        //         console.log("Loaded Database!")
        //     }else{
        //         console.log("Failed Loading Database!")
        //     }
        // })
    }

    /**
     * Load database
     */
    load(){
        return new Promise((resolve,reject)=>{
            fs.readFile(this.url,'utf8',(err,str)=>{
                if(err){
                    console.log(err)
                    resolve(0)
                }else{
                    this.data = JSON.parse(str)
                    resolve(1)
                }
            })
        })
    }

    /**
     * Save database
     */
    save(){
        return new Promise((resolve,reject)=>{
            fs.writeFile(this.url,JSON.stringify(this.data,),'utf8',err=>{
                if(err){
                    resolve(0)
                }else{
                    resolve(1)
                }
            })
        })
    }

    /**
     * Get data from this key
     * @param {string} key 
     */
    get(key){
        return new Promise((resolve,reject)=>{
            if(key in this.data && this.data[key]!=null){
                resolve(this.data[key])
            }else{
                resolve([])
            }
        })
    }

    /**
     * 
     * Add new key to database
     * @param {string} key 
     * @param {string} value 
     */
    set(key,value){
        return new Promise((resolve,reject)=>{
            this.data[key] = JSON.parse(value)
            this.save().then(status=>resolve(status))
        })
    }

    /**
     * Delete key from database
     * @param {string} key 
     */
    del(key){
        return new Promise((resolve,reject)=>{
            this.data[key] = undefined
            this.save().then(status=>{
                resolve(status)
            })
        })
    }
    
}