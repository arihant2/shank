import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const categorySchema = mongoose.Schema({
    category: { type: String, trim: true, required: true, unique: true },
    subCategories: { type: [String], trim: true, required: true }

}, { timestamps: true } );

categorySchema.plugin(uniqueValidator);

export default mongoose.model('category',categorySchema);

