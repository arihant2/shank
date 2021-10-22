import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = mongoose.Schema({
    username: { type: String, trim: true, required: true, maxLength: 20 },
    email: { type: String, trim: true, required: true, unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, trim: true, required: true, minLength: 8 },
    phone: { type: String, trim: true, minLength: 10, maxLength: 10 },

    profile_image: String,
    aboutme: { type: String, trim: true, maxLength: 250 },
    website: { type: String, trim: true, maxLength: 25 },
    address: { type: String, trim: true, maxLength: 70 },
    facebook: { type: String, trim: true, maxLength: 15},
    instagram: { type: String, trim: true, maxLength: 15 },

    ownership: { type: String, trim: true, default: 'user' }

}, { timestamps: true } );

userSchema.plugin(uniqueValidator);

export default mongoose.model('user',userSchema);

