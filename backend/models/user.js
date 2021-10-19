import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = mongoose.Schema({
    username: { type: String, required: true, minLength: 4 },
    email: { type: String, required: true, unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true, minLength: 8 },

    phone: { type: String, minLength: 10, maxLength: 10 },
    ownership: { type: String, default: 'user' }

}, { timestamps: true } );

userSchema.plugin(uniqueValidator);

export default mongoose.model('user',userSchema);

