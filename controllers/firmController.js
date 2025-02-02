const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require('multer');
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
const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body
        const vendor = await Vendor.findById(req.vendorId)
        const image = req.file ? req.file.filename : undefined;
        // Set storage options
        if (!vendor) {
            res.status(404).json({ message: 'vedor not found' })
        }
        const firm = new Firm({
            firmName, area, category, region, offer, image, vendor: vendor._id
        })
        const savedFirm = await firm.save();
        vendor.firm.push(savedFirm)
        await vendor.save()
        return res.status(200).json({ message: "firm added successfully" });
    }
    catch (error) {
        console.error(error)
        res.status(500).json("internal server error")

    }
}
const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId
        const deletedFirm = await Firm.findByIdAndDelete(firmId)
        if (!deletedFirm) {
            return res.status(404).json({ error: "No product found" })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "internal server error" })
    }
}
module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById }
