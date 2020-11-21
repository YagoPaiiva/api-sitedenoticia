const   mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const slug = require('slug');

mongoose.Promise = global.Promise;

const accountSchema = new mongoose.Schema({
    Fullname:{
        type:String,
        trim:true,
        required:true,
    },
    slug:String,

    Username:{
        type:String,
        trim:true,
        required:true,
    },
    Email:{
        type:String,
        trim:true,
        required:true,
    },
    FullnameMother:{
        type:String,
        trim:true,
        required:true,
    }
});

accountSchema.pre('save', async function(next){
    if (this.isModified('Fullname')){
        this.slug = slug(this.Fullname, {lower:true})
    }
        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,}$)?)$`, 'i');
         const accountWITHSlug = await this.constructor.find({slug:slugRegex});

    if(accountWITHSlug.length> 0 ){
        this.slug = `${this.slug}-${accountWITHSlug.length + 1}`;
    }
    next();
});


accountSchema.plugin(passportLocalMongoose,{usernameField:'Username'});

module.exports = mongoose.model('newAccounts', accountSchema);