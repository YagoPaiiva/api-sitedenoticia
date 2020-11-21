const mongoose = require('mongoose');
const slug = require('slug');

mongoose.Promise = global.Promise;

const categoriesSchema = new mongoose.Schema({

	Category:{
		type:String,
		trim:true,
		required:true,
	},
	Author:{
		type:String,
		true:true,
		required:true,
	},
	slug:String,

})

categoriesSchema.pre('save', async function(next){

    if (this.isModified('Category')){
        this.slug = slug(this.Category, {lower:true})
    }
        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,}$)?)$`, 'i');
         const CategoryWITHSlug = await this.constructor.find({slug:slugRegex});

    if(CategoryWITHSlug.length> 0 ){
        this.slug = `${this.slug}-${CategoryWITHSlug.length + 1}`;
    }	
    next();
});

module.exports = mongoose.model('newcategories', categoriesSchema);
