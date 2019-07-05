const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const opn = require('opn');

//opening front end on browser
opn('http://localhost:5000', {app: 'chrome'});


const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl:true
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.get('/countbook', (req, res)=> { 
db('books').count().then(data=>res.send(data) );
	
});
app.get('/countavlbook', (req, res)=> { 
db('books').count().where('availablecopies','>',0).then(data=>res.send(data) );
	
});

app.get('/countstudent', (req, res)=> { 
db('students').count().then(data=>res.send(data) );
	
});
app.get('/',(req,res)=>{res.send('it is working!!')})

//Fetch all the books
app.get('/book', (req, res)=> { 
db.select('*').orderBy('id').from('books').then(data=>res.send(data) );
	
});


//Fetch Book By ID from books table
app.get('/bookinfo/:id',(req,res)=>{ 
	let {id}=req.params; 
	
	db.select('*').from('books').where('id','=',id).then(data=>res.send(data)).catch(err=>res.status(400));
	
});
	
//Fetch All Entries from Issue-return Table:Issued books and Issue History	
app.get('/getissuereturn',(req,res)=>{ 
	
	
	db.select('*').from('issuereturn').then(data=>res.send(data)).catch(err=>res.status(400));
	
});

//Fetch Book Issue-Return History from issuereturn Table
app.get('/issuereturn/:id',(req,res)=>{ 
	let {id}=req.params; 
	
	db.select('*').from('issuereturn').where('bookid','=',id).then(data=>res.send(data)).catch(err=>res.status(400));
	
});
//Fetch Student Issue-Return History from issuereturn Table
app.get('/issuereturnstd/:id',(req,res)=>{ 
	let {id}=req.params;
	
	db.select('*').from('issuereturn').where('studentid','=',id).then(data=>res.send(data)).catch(err=>res.status(400));
	
});

app.get('/searchfromissued/:search',(req,res)=>{ 
	let {search}=req.params; 
	if(search)search=search.toUpperCase();
	search='%'+search+'%';
	
	
	db.select('*').from('issuereturn').where('bookname','like',search).orWhere('roll','like',search).orWhere('studentname','like',search).orWhere('isbn','like',search).orWhere('author','like',search).orWhere('publisher','like',search).then(data=>res.send(data));
});


//Search Books by Name,isbn,author or Publisher

app.get('/book/:search',(req,res)=>{ 
	let {search}=req.params; 
	search=search.toUpperCase();
	search='%'+search+'%';
	
	
	db.select('*').from('books').where('name','like',search).orWhere('isbn','like',search).orWhere('author','like',search).orWhere('publisher','like',search).then(data=>res.send(data));
});

//Add a BOOK
app.post('/book/add',(req,res)=>{

let {name,isbn,author,publisher,copyrightyear,edition,printyear,stackno,volume,accessionno,pages,totalcopies,availablecopies,type,price,additionals} = req.body;

if(!name) return res.status(400).json('Name cant be blank');

name=name.toUpperCase();
if(isbn)isbn=isbn.toUpperCase();
if(author)author=author.toUpperCase();
if(publisher)publisher=publisher.toUpperCase();



db.insert({'name': name,'isbn': isbn,'author': author,'publisher': publisher,'copyrightyear':copyrightyear,'edition':edition,'printyear':printyear,'stackno':stackno,'volume':volume,'accessionno':accessionno,'pages':pages,'totalcopies':totalcopies,'availablecopies':availablecopies,'type':type,'price':price,'additionals':additionals}).into('books').then(res.status(200).json('Book Added Successfully!!')).catch(err => res.status(400).json('Sorry!!Unable To Add'));


});

//Book Issue

/*app.post('/bookissue',(req,res)=>{

let {bookid,studentid,roll}=req.body;
roll=roll.toUpperCase();
let issue=new Date().toString();
db.insert({'bookid':bookid,'studentid':studentid,'roll':roll,'issue':issue}).into('issuereturn').then(res.status(200).json('successfully added')).catch(err => res.status(400).json('unable to add'));

});*/

//Book Return



//Fetch All Students From Students Table

app.get('/students', (req, res)=> { 
db.select('*').orderBy('name').from('students').then(data=>res.send(data) );
	
});

//Search Student by name,roll,year,branch
app.get('/students/:search',(req,res)=>{ 
	let {search}=req.params;
	search=search.toUpperCase(); 
	search='%'+search+'%';
	db.select('*').from('students').where('name','like',search).orWhere('roll','like',search).orWhere('year','like',search).orWhere('branch','like',search).then(data=>res.send(data)); 
});

//Fetch Student by id from Students Table

app.get('/studentinfo/:id',(req,res)=>{ 
	let {id}=req.params; 
	
	db.select('*').from('students').where('id','=',id).then(data=>res.send(data)).catch(err=>res.status(400));
	
});





//Add Student
app.post('/students/add',(req,res)=>{

let {roll,name,phone,year,branch} = req.body;

roll=roll.toUpperCase();
name=name.toUpperCase();
branch=branch.toUpperCase();

if(!roll) return res.status(400).json('Roll cant be blank');

db.insert({'name': name,'roll': roll,'phone': phone,'year': year,'branch': branch,'issued':0}).into('students').then(res.status(200).json('Student Addded Successfully!!')).catch(err => res.status(400).json('Sorry!!Unable To Add '));


});

app.post('/book/update',(req,res)=>{

let author='I am the new Author'
let st=['ECE17u011','ECE17o01'];
let nst={"name":"fahad","roll":"ece17u011"};
nst=JSON.stringify(nst);
let d=[];d.push(nst);
//st.map((item)=>{nst.push(item.toUpperCase())})
db('books').where('id',916).update({issuearr: d}).then(data=>{console.log(data);res.status(200).json('updated successfully')}).catch(err=>res.status(400).json('unable to update'));

}


	);

app.post('/student/update',(req,res)=>{

let author='I am the new Author'


db('students').where('id',7).update({issued: 1}).then(data=>{console.log(data);res.status(200).json('updated successfully')}).catch(err=>res.status(400).json('unable to update'));

}
);










app.post('/bookissue',(req,res)=>{

let {bookid,studentid,roll,bookname,studentname,author,publisher,edition,isbn}=req.body;

 


if(!studentid||!bookid) return res.status(400).json('Student ID/Book ID Cant be blank');
if(roll)roll=roll.toUpperCase();
if(bookname)bookname=bookname.toUpperCase();
if(studentname)studentname=studentname.toUpperCase();
if(author)author=author.toUpperCase();
if(publisher)publisher=publisher.toUpperCase();
if(isbn)isbn=isbn.toUpperCase();
let issue=new Date().toString();


db.insert({'bookid': bookid,'studentid':studentid,'roll':roll,'issue':issue,'bookname':bookname,'studentname':studentname,'author':author,'publisher':publisher,'isbn':isbn,'edition':edition}).into('issuereturn').catch(err=>{res.status(400).json('failure')});
db('books').where('id','=',bookid).decrement('availablecopies',1).catch(err=>res.status(400).json('failure'));
db('students').where('id','=',studentid).increment('issued',1).then(res.status(200).json('Book issued Successfully!!')).catch(err=>res.status(400).json('Failed to Issue'));

});

app.post('/bookreturn',(req,res)=>{

let {bookid,studentid,fine}=req.body;

 


if(!studentid||!bookid) return res.status(400).json('Student ID/Book ID Cant be blank');

let ret=new Date().toString();


db('issuereturn').update({'return': ret,'fine':fine}).where('bookid','=',bookid).andWhere('studentid','=',studentid).catch(err=>{res.status(400).json('failure')});
db('books').where('id','=',bookid).increment('availablecopies',1).catch(err=>res.status(400).json('failure'));
db('students').where('id','=',studentid).decrement('issued',1).then(res.status(200).json('Book Returned Successfully!!')).catch(err=>res.status(400).json('Couldnt Return'));

});





app.listen(process.env.PORT||3000, ()=> {
  console.log(`app is running on port ${process.env.PORT||3000}`);
});

console.log(process.env.PORT);