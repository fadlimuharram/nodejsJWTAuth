const express = require('express');
const app = express();
const http = require('http');
const bodyParser= require('body-parser');
const jwt = require('jsonwebtoken');


const server = http.createServer(app);
const port = process.env.PORT || 3000;

const secretnya = 'ini rahasia';

app.use(express.json({limit:'5mb'}));
app.use(bodyParser.json());

app.use((request,response,next)=>{
    response.setHeader('Access-Control-Allow-Origin','*');
    response.setHeader('Access-Control-Allow-Methods','GET, POST, PUT');
    response.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');

    next();
});

app.get('/api',(req,res)=>{
    res.json({
        message:'Welcome to the API'
    });
});

app.post('/api/post',verifyToken,(req,res)=>{
    jwt.verify(req.token,secretnya,(err,authData)=>{
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            res.json({
                message:'post created',
                authData
            });
        }

    })
});

app.post('/api/login',(req,res)=>{
   const user = {
       id:1,
       username:'fadli',
       email:'fadli@tes.com'
   };

   jwt.sign({user},secretnya,{expiresIn:'30s'},(err,token)=>{
        res.json({
            token
        });
   })
});


function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];

    if(typeof(bearerHeader) !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }

}





server.listen(port,()=>console.log(`Start pada port : ${port}`));




