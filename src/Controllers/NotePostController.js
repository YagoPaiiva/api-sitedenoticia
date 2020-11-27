const Account = require('../Services/Account');

const tokenjwt = require('jsonwebtoken');
const New = require('../Services/New');
const NoteServices = require('../Services/NoteServices');
const noteGetController = require('./noteGetController');


require('dotenv').config();

module.exports = {

    createAccount:async(req, res)=>{
    
        let Fullname = req.body.Fullname;
        let Password = req.body.Password;
        let Email = req.body.Email;
        let FullnameMother = req.body.FullnameMother;

        if(Fullname && Email && FullnameMother){

            const newAccount =  await NoteServices.postAccounts(Fullname, Password, Email, FullnameMother);

            if(newAccount.code != 'ER_DUP_ENTRY'){
            
                const jwt = tokenjwt.sign({
                Fullname,
                Email,
            }, 
                process.env.SECRETKEY,
                {
                    expiresIn:'1h'
                });

            res.json({tokenjwten: jwt, Fullname:Fullname});
            
        }
            else{
                res.json({error:'Email já esta em uso.'});
            }
        }
    },


    login:async(req, res)=>{

        let Email = req.body.Username;
        let Pass = req.body.password;

        if(Email && Pass){

            const reqLogin = await NoteServices.login(Email, Pass);

            if(!reqLogin){
                res.json({error:'Usúario ou Senha Invalidos'});
            }
                const jwt = tokenjwt.sign({
                Email,
            }, 
                process.env.SECRETKEY,
                {
                    expiresIn:'1h'
                });

                res.json({tokenjwt:jwt, json:reqLogin});
            }
        

    },

    
    createCategories:async(req, res)=>{

        let Category = req.body.Category; 
       
        if(Category){

            const reqCategories = await NoteServices.postCategories(Category);

            reqCategories? res.json(reqCategories):res.json({error:'sem categorias'})
        }
        },


    createNews:async(req,res)=>{

        const json={error:'',result:{}};
        
        let url_imgs = [];
        let title = req.body.title;
        let categories = req.body.categories;
        let news = req.body.news;
        let WITHphotoArray = req.body.photo.length;
        
        for(let count = 0; count < WITHphotoArray; count++){
            url_imgs[count] = `http://localhost:3001/Media/ImageNews/${req.body.photo[count]}`;
        }

        if(title && categories && news && req.body.photo){

         const reqNews = await NoteServices.postNews(title, categories, news, url_imgs);        

         res.json(reqNews);
        }
        

    },

}