const Account = require('../Services/Account');
const Categories = require('../Services/Categories');
const News = require('../Services/New');
const fs = require('fs');

const tokenjwt = require('jsonwebtoken');
const New = require('../Services/New');

require('dotenv').config();

module.exports = {

    createAccount:async(req, res)=>{
    
        const json = {error:'',result:{}};

        let Fullname = req.body.Fullname;
        let Username = req.body.Username;
        let Password = req.body.Password;
        let Email = req.body.Email;
        let FullnameMother = req.body.FullnameMother;

        if(Fullname && Username && Email && FullnameMother){

            json.result={
                Fullname,
                Username,
                Email,  
                FullnameMother
            }

            const newAccount = new Account (json.result);

            const jwt = tokenjwt.sign({

                Fullname,
                Email,
            }, 
                process.env.SECRETKEY,
                {
                    expiresIn:'1h'
                });

            res.json({tokenjwten: jwt, Fullname:Fullname, id:newAccount.id});

                Account.register(newAccount, Password, (error)=>{
                console.log(`Error ao registrar: ${error}`) 
            });

        }

    },

    
    createCategories:async(req, res)=>{

        const json = {error:'',result:{}};

        let Category = req.body.Category; 
        let Author  = req.body.Author;
       
       
        if(Category && Author){
            json.result={
                Category,
                Author,
              }

        const newCategory = new Categories(json.result);


        Categories.create(newCategory,(error)=>{
            console.log(`Error ao inserir uma Categoria:${error}`)
        });

        res.json(newCategory);
        }

    },

    createNews:async(req,res)=>{
        const json={error:'',result:{}};
        
        let path = [];
        let title = req.body.title;
        let categories = req.body.categories;
        let news = req.body.news;
        let id = req.body.id;
        let WITHphotoArray = req.body.photo.length;
        
        for(let count = 0; count < WITHphotoArray; count++){
            path[count] = `http://localhost:3001/Media/ImageNews/${req.body.photo[count]}`;
        }

        if(title && categories && news && req.body.photo){
         json.result={
            title,
            categories,
            news,
            path,
            id,
         }
         const newNews = new New(json.result);
         
         New.create(newNews,(error)=>{
             console.log(`Error ao inserir uma nova Notícia: ${error}`)
         });
         res.json(newNews);
        }
        

    },

    editAccount:async(req, res)=>{
        
        const json ={error:'', result:{}};

        let Fullname = req.body.Fullname;
        let Username = req.body.Username;
        let Email = req.body.Username;
        let FullnameMother = req.body.FullnameMother;

        json.result={
            
            Fullname,
            Username,
            Email,
            FullnameMother
        }
        const account = await Account.findOneAndUpdate({
            slug:req.body.slug},
            json.result,
            {
                new:true,
                runValidators:true,
            }
            );
            
            res.json(json);
             
    },

    login:async(req, res)=>{

    const auth = Account.authenticate();

    auth(req.body.Username, req.body.password, (error, result)=>{

    if(result){
    req.login(result, ()=>{});

    const jwt = tokenjwt.sign({

            name:result.Fullname,
            Email:result.Email,

        },process.env.SECRETKEY,
        {
            expiresIn:'1h'
        });

        res.json({tokenjwten: jwt, Fullname:result.Fullname, id:result.id});
    }else{
    
    res.json({notallowed:true})
    return ;    
    }
           
    });

    }

}