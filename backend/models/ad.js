import mongoose from 'mongoose';

const adSchema = mongoose.Schema({
    category: { type: String, trim: true, required: true },
    subCategory: { type: String, trim: true, required: true },
    title: { type: String, trim: true, required: true, minLength: 15, maxLength: 40 },
    description: { type: String, trim: true, required: true, minLength: 50, maxLength: 250 },
    ad_image: String,
    type: { type: String, trim: true, required: true },
    brand: { type: String, trim: true, required: true },
    year_of_reg: { type: String, trim: true, required: true, minLength: 4, maxLength: 4 },
    transmission: { type: String, trim: true, required: true },
    features: [String],
    price: { type: String, trim: true, required: true, minLength: 3, maxLength: 6 },
    negotiate: Boolean,
    phone: { type: String, trim: true, required: true, minLength: 10, maxLength: 10 },
    city: { type: String, trim: true, required: true },
    location: { type: String, trim: true, required: true },
    tag: { type: [String], required: true },
    subscription: { type: String, trim: true, required: true },

    other: { type: String, trim: true, default: 'featured' },

    user_id: { type: String, trim: true, required: true }

}, { timestamps: true } );

export default mongoose.model('ad',adSchema);

