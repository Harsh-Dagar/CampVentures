const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;
const opts = { toJSON: { virtuals: true } };


const ImageSchema=new Schema({
    url:String,
    filename:String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})
const campgroundSchema=new Schema({
    title:String,
    images:[ImageSchema],
    price:Number,
    description:String,
    location:String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts)
campgroundSchema.virtual('properties.popUpHTML').get(function(){

    return `<h6><a href="/campgrounds/${this._id}"><strong>${this.title}</strong></h6>`;
})
campgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

const Campground=mongoose.model('Campground',campgroundSchema);
module.exports=Campground;