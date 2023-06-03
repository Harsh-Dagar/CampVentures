const Campground=require('../models/campground');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelper');
const mongoose=require('mongoose');
const { deleteMany } = require('../models/campground');
// mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/camp-venture', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Successfully connected to Database!!!");
}).catch((err)=>{
    console.log("Error in connecting to database!!!!");
    console.log(err);
})

const randGen=(arr)=>{
    return arr[Math.floor(Math.random()*arr.length)];
}
const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<10;i++){
        let randCity1000=Math.floor(Math.random()*1000);
        let price=Math.floor(Math.random()*2000)+1000;
        const cmp=new Campground({
            location:`${cities[randCity1000].city}, ${cities[randCity1000].state}`,
            title: `${randGen(descriptors)} ${randGen(places)}`,
            author:'647113c71e94525ce49a232c',
            // image:`https://source.unsplash.com/collection/190727/1600×900`,
            description:`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis ducimus, aliquam ad eaque quaerat enim odit laudantium a vel natus nulla dignissimos reiciendis unde voluptatibus tempora delectus temporibus, nisi ex.`,
            price:price,
            geometry: { 
                type: "Point",
                 coordinates: [ cities[randCity1000].longitude,cities[randCity1000].latitude ]
            },
            images: [
    
              ]
            
        })
        await cmp.save();
    }
}

seedDB();