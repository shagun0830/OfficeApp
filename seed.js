const User=require('./models/user');

const DemoUser={
    name:"Demo",
    email:"Demo@gmail.com",
    contact:9876543210,
    currentStatus: true,
    
}

const seedDB=async()=>{

    await User.deleteMany({});
    await User.insertMany(DemoUser);
    console.log("Seeded");

}

module.exports=seedDB;