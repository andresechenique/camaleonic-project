import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
email:{
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    match:[
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is not valid"
    ]
}, 
password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
}, 
fullname: {
    type: String,
    required: false,
    minLength: [3, "Full name must be at least 3 characters"],
    maxLength:[50, "Full name must be at most 50 characters"]
}});

const User = models.User || model('User', userSchema)
export default User;