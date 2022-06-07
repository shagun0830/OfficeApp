if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

const express = require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const sgMail = require('@sendgrid/mail')
const User=require('./models/user')
const seedDB=require('./seed');

//seedDB();

mongoose.connect(`mongodb+srv://Deep0552:${process.env.password}@cluster0.wbtd0.mongodb.net/assignment8?retryWrites=true&w=majority`)
.then(()=>{console.log("DB Connected")})
.catch((err)=>{console.log(err)})

sgMail.setApiKey(process.env.APIKEY)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));


app.get('/',(req,res)=>{

    res.render("Home");
})
app.post('/Home',async(req,res)=>{

    const {name,email,contact}=req.body;
    if(!name||!email||!contact){
       
        res.render(alert("Enter All Details"));
    }
    
    
    const foundUser=await User.find({name:name,email:email,contact:contact});
    //console.log(foundUser);
    if(!foundUser.length){
        console.log("in If");
        
    const data={
        name:name,
        email:email,
        contact:contact,
    }
    
    await User.insertMany(data);
    const datas=await User.find();
    //console.log(datas[datas.length-1]);
    res.render('Enter',{data:datas[datas.length-1]});
    }
    else{
        console.log(foundUser[0].currentStatus);
        if(foundUser[0].currentStatus=="Absent"){
            res.render('Enter',{data:foundUser[0]});
        }
        else{
            //console.log("hereeee");
            //console.log(foundUser);
            res.render('Exit',{data:foundUser[0]});
        }
        //console.log(foundUser);
    }
    //await User.save();
    

      
})
app.get('/Home/:id',async(req,res)=>{
    const {id}=req.params;
        let date=new Date();
        let time=`${date.getHours()}:${date.getMinutes()}`;
        const data=await User.findById(id);
        if(data.currentStatus=="Absent"){
        await User.findByIdAndUpdate({_id:id},{entryTime:time});
        await User.findByIdAndUpdate({_id:id},{currentStatus:"Present"});
        data.entryTime=time;
        data.currentStatus="Present";
        const msg = {
            to: data.email, // Change to your recipient
            from: 'deepkhurana2001@gmail.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: `You Entered our office at ${time}`,
            
          }
          sgMail
            .send(msg)
            .then(() => {
              console.log('Email sent')
            })
            .catch((error) => {
              console.error(error)
            })
        res.render('Exit',{data:data});
    }
    else{
        await User.findByIdAndUpdate({_id:id},{exitTime:time,currentStatus:"Absent"});
        await User.findByIdAndDelete({_id:id});
        const msg = {
            to: data.email, // Change to your recipient
            from: 'deepkhurana2001@gmail.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: `You Exited our office at ${time}`,
            
          }
          sgMail
            .send(msg)
            .then(() => {
              console.log('Email sent')
            })
            .catch((error) => {
              console.error(error)
            })
        res.render('Home');
    }
    
    

    
})








const Port=process.env.PORT || 3000;

app.listen(Port,()=>{


    console.log("Server Connected");
})
