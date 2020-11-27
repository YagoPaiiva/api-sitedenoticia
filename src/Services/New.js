const mongoose = require('mongoose');
const slug = require('slug');
const fs = require('fs');
const promisefy = require('util');

mongoose.Promise = global.Promise;

const newsSchema = mongoose.Schema({

    title:{
        type:String,
        trim:true,
        required:true,
    },
    categories:{
        type:String,
        trim:true,
        required:true,
    },
    news:{
        type:String,
        required:true,
    },  
    number:Number,
    slug:String,
    url:Array,
    name:String
});

newsSchema.pre('save', async function(next){
    
    if(this.isModified('title')){
        this.slug = slug(this.title, {lower:true})
    }
        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,}$)?)$`, 'i');
        const titleWITHSlug = await this.constructor.find({slug:slugRegex});
        
        const dball = await this.constructor.find();

        if(dball.length > 0){
            const widht = (dball.length - 1);
            this.number = (parseInt(dball[widht].number) + 1);
        }else{
            this.number = 1;
        }

        if(titleWITHSlug.length > 0){
        this.slug = `${this.slug}-${titleWITHSlug.length + 1}`;
    }
    next();
});

newsSchema.pre('remove', function(){
    return promisefy(fs.unlink)(this.path)
})


module.exports = mongoose.model('news', newsSchema);