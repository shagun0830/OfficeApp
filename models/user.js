const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({

    name:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type:String,
        trim:true,
        required:true
    },
    contact:{
        type:Number,
        minlength:10,
        maxlength:10,
        required:true
    },
    currentStatus:{
        type:String,
        required:true,
        default:"Absent"
    },
    entryTime:{
        type:String
    },
    exitTime:{
        type:String
    }

})


const User=mongoose.model('User',userSchema);
module.exports=User;