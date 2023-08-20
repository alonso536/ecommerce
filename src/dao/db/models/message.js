import { Schema, model } from "mongoose";

const MessageSchema = Schema({
    user: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, 
{
    timestamps: true
}
);

MessageSchema.methods.toJSON = function() {
    const {__v, _id, ...message} = this.toObject();
    message.uid = _id;
    return message;
}

const Message = model("Message", MessageSchema);

export default Message;