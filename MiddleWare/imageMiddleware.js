const Multer = require('multer');
const Jimp = require('jimp');
const uuid = require('uuid');


const multerOptions = {
	storage:Multer.memoryStorage(),
	fileFilter:(req, file, next)=>{
		const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
		if(allowed.includes(file.mimetype)){
			next(null, true);
		}
		else{
			next({message:'Arquivo não suportado!'}, false)
		}
	}
}

exports.upload = Multer(multerOptions).array('photo');


exports.resize = async(req, res, next) =>{
	
	if(!req.files){
		next();
		return
	}

	let photoArray = []; 

	widthFiles = req.files.length;
	
	if(widthFiles > 0){
		for(let count =0; count < widthFiles;count++){
			
			const ext = req.files[count].mimetype.split('/')[1];
			let filename= `${uuid.v4()}.${ext}`;
			photoArray[count] = filename;
			let Photo = await Jimp.read(req.files[count].buffer);
			await Photo.resize(280, 200);
			await Photo.write(`./Public/Media/ImageNews/${filename}`);
		
		}
		req.body.photo = photoArray;
	}
	
	next();
};