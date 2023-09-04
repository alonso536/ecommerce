import { Schema, model } from "mongoose";

const UserSchema = Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },

}, 
{
    timestamps: true
}
);

UserSchema.methods.toJSON = function() {
    const {__v, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

const User = model("User", UserSchema);

export default User;