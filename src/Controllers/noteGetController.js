const { Showcategories } = require('./NotePostController');

require('dotenv').config();
const Categories = require('../Services/Categories');
const New = require('../Services/New');


module.exports={

    showPing:(req, res)=>{
        res.json({pong:true});
    },

    showcategories:async(req, res, next)=>{

        const json = await Categories.find();
        res.json(json);

    },
    showNews:async(req, res, next)=>{

        const sort = req.query.sort;
        const limit = parseInt(req.query.limit);
        
        const json = await New.find({}).limit(limit).sort({number:sort});
        
        res.json(json); 
    }
}