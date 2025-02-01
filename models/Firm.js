const mongoose = require("mongoose");
const Vendor = require("./Vendor");
const firmSchema = new mongoose.Schema({
    firmName: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true
    },
    category: {
        type: [{
            type: String,
            enum: ['veg', 'non-veg']
        }],
        required: true
    },
    region: {
        type: [{
            type: String,
            enum: ['south-indian', 'north-indian', 'chineese', 'bakery']
        }],
        required: true
    },
    offer: {
        type: String
    },
    image: {
        type: String
    },
    vendor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'vendor'
        }
    ],
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
});
const Firm = mongoose.model('Firm', firmSchema);
module.exports = Firm
