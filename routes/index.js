var express = require('express');
var ObjectID = require('mongodb').ObjectID
var router = express.Router();
var fs = require('fs')

/* GET home page. */
router.get('/products', function(req, res, next) {
	const books = req.app.locals.books
	books.find({},{ sort: { timestamps: 1 }, limit: 20 } ).toArray().then(data => {
  		res.render('index', { title: 'Express', data});
	})
});

router.post('/products', (req, res, next) => {
	const books = req.app.locals.books
	const file = req.files
	if(file?.img){
		fs.writeFile(`${__dirname}/../public/images/${file.img.name}`, file.img.data, (err) => {
			if(err) console.log('Problem save file')
		})
	}
	const newDocument = req.body
	books.insert({...newDocument, img: file?.img?.name, timestamps: new Date()}).then(data => {
		res.redirect('/products')
	})
})

router.get('/login', (req, res, next) => {
	const message = req.query.message
	res.render('login', {message})
})

router.post('/login', (req, res, next) => {
	const users = req.app.locals.users
	const {username, password} = req.body
	users.findOne({username, password}).then(data => {
		if(data){
			res.end("dang nhap thanh cong")
		}else {
			res.redirect("/login?message=user is not exist")
		}
	})
})

router.post('/signup', (req, res, next) => {
	
})

router.put('/product/:id', (req, res, next) => {
	const books = req.app.locals.books
	const id = ObjectID(req.params.id)
	const updatedDocument = req.body
	books.updateOne({_id: id}, {$set: {...updatedDocument}}).then(data => {
		res.json(data)
	})
})

router.delete('/product/:id', (req, res, next) => {
	const books = req.app.locals.books
	const id = ObjectID(req.params.id)
	books.deleteOne({_id: id}).then(data => {
		res.json(data)
	})
})

module.exports = router;
