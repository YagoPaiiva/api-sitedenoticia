const db = require('../../db');
const Slug = require('slug');

module.exports = {
    
    
    getAccounts:()=>{
        
        return new Promise((resolve, reject)=>{
            db.query('SELECT * FROM accounts',(error, result)=>{
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    },

    postAccounts: (Fullname, Email,Pass, Fullnamemother)=>{

        return new Promise((resolve, reject)=>{
        
            let slug = Slug(Fullname, {lower:true});
        
            db.query(`
            
            SELECT MAX(slug) as SlugMax
                FROM accounts 
            WHERE slug REGEXP '^${slug}((-[0-9]{1,}$)?)$'
             
            `,(error, result)=>{if(error){reject(error);return;}

            const valueSlug = result[0].SlugMax;
            
            if(valueSlug){
                if(valueSlug.length > slug.length){
                    slug = `${slug}-${(parseInt(result[0].SlugMax.replace(`${slug}-`,''))+1)}`;
                }else if (valueSlug.length === slug.length){
                    slug = `${slug}-2`;
                }
            };
            
            db.query( `
                
                INSERT INTO accounts
                     (id_account, Fullname, Email, Pass, Fullnamemother, slug)
                VALUES
                    (
                        DEFAULT,
                        '${Fullname}',
                        '${Email}',
                        MD5('${Pass}'),
                        '${Fullnamemother}',
                        '${slug}'
                    )`,
                
            (error, result)=>{
                if(error){
                    resolve(error);   
                    return;
                }
                resolve(result);
            });
        })
    });
                
    },

    postNews:(title, categories, news, url_imgs)=>{

        return new Promise ((resolve, reject)=>{

            db.query(`
            INSERT INTO news
                (id_news,title, categories, news,url_imgs)
            VALUES (
                    default,
                    '${title}',
                    '${categories}',
                    '${news}',
                    '${url_imgs}'
            )`,(error,result)=>{
                if(error){
                    reject(error);
                    return;
                }
                
                resolve(result);
            })

        })

    },

    login:(Email, Pass)=>{

        return new Promise ((resolve, reject)=>{

                db.query(`SELECT * FROM accounts WHERE Email = '${Email}' AND Pass = md5('${Pass}')`,(error, result)=>{
              
                if(error){
                    reject(error);
                    return;
                }

                result.length === 1 ? resolve(result) : resolve(false);

            })
        })
    },

    postCategories:async(category)=>{
        return new Promise ((resolve, reject)=>{
            
        db.query(`
            INSERT INTO categories 
                (category)
            values
                '${category}'  
                 `,(error, result)=>{
            if(error){
                reject(error);
                return;
            }
            console.log(result);
            resolve(result);
            
            })
        
        })    
    },

    showCategories:async()=>{
        return new Promise((resolve, reject)=>{
            db.query('SELECT * FROM categories ORDER BY category',(error, result)=>{
                if(error){
                    reject(error);
                    return;
                }
                resolve(result);

            })

        })
    },

    showNews:async(sort, limit)=>{
        return new Promise ((resolve, reject)=>{
            db.query(`SELECT * FROM news ORDER BY id_news ${sort} LIMIT ${limit}`,(error, result)=>{
                if(error){reject(error); return;}

                resolve(result);
            })
        })

    }

}