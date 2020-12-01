require('dotenv').config();
const NoteServices = require('../Services/NoteServices');

module.exports={
    showPing:(req, res, next)=>{
        res.json({pong:true});
    },

    showcategories:async(req, res, next)=>{

        const json = await NoteServices.showCategories();

        res.json(json);
    },

    showaccounts:async(req, res, next)=>{

        let json = {error:'', widht:'', result:[]};

        const accounts = await NoteServices.getAccounts();

        for(let count in accounts){
            json.result.push({
                Fullname:accounts[count].Fullname,
            })
        }
        json.widht=({
            registration_amount_ofthe_accounts:accounts.length
        })

        res.json(json);
    },

    showNews:async(req, res, next)=>{

        const sort = req.query.sort;
        const limit = parseInt(req.query.limit);
        
        const json = await NoteServices.showNews(sort, limit);
        
        res.json(json); 
    }
}