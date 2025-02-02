const Firm = require("../models/Firm");
const Product = require("../models/Product");
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});
const upload = multer({ storage: storage });
const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body
        const image = req.file ? req.file.filename : undefined
        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "no firm found" })
        }
        const product = new Product({
            productName, price, category, bestSeller, description, image, firm: firm._id
        })
        const savedProduct = await product.save()
        firm.product.push(savedProduct)
        await firm.save()
        console.log("product added")
        return res.status(201).json({ message: "product added successfully" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }

}
const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId)
        if (!firm) {
            return res.status(404).json({ error: "firm not found" })
        }
        const restaurantName = firm.firmName
        const products = await Product.find({ firm: firmId })
        console.log(restaurantName, products)
        res.status(200).json({ restaurantName, products })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "internal server error" })
    }
}
const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId
        const deletedProduct = await Product.findByIdAndDelete(productId)
        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "internal server error" })
    }
}

module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm, deleteProductById }