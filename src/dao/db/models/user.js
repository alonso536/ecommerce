import { Schema, model } from "mongoose";

const UserSchema = Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
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
    role: {
        type: String,
        default: "ROLE_USER"
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "Cart"
    },
    github: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String
    },
    last_connection: {
        type: Date
    },
    documents: [{
        name: {
            type: String
        },
        reference: {
            type: String
        }
    }]
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