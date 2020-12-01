const tokenjwt = require('jsonwebtoken');
const NoteServices = require('../Services/NoteServices');
const SES = require('aws-sdk/clients/ses');

require('dotenv').config();

module.exports = {

    run:async(req, res, next)=>{
            
        let clients = new SES({
                region:'us-east-1'
            });

            clients
            .getSendQuota()
            .promise()
            .then(data => console.log(data))
            .catch(error => console.log(error));


           await clients.sendEmail({
                Source: 'Yago Paiva <paiivayago@gmail.com>',
                Destination: {
                    ToAddresses:['Yago Paiva <paiivasyago@paiivas.com>'],
                },
                Message:{
                    Subject:{   
                        Data:'Eu te amo',
                    },
                    Body:{
                        Text:{
                            Data:'Envio de email feito com sucesso'
                        },
                    },
                },
                ConfigurationSetName: 'resumeService',
            })
            .promise()
            .then(data=> console.log(data))
            .catch(error=> console.log(error));
            res.json({ok:true})
        },
    showPing:(req, res, next)=>{
        res.json({pong:true});
    },

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