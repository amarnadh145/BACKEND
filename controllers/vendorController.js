const Vendor = require("../models/Vendor")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotEnv = require("dotenv")
dotEnv.config();
const secretKey = process.env.whatisyourname
const vendorRegistor = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json("email already exists");
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedpassword
        })
        await newVendor.save()
        res.status(201).json({ message: "vendor registered successfully" });
        console.log("registered")
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Eroor" })
    }
}
const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" })
        res.status(200).json({ success: "Login successfully", token })
        console.log(email);
    }
    catch (error) {
    }
}
const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({ vendors })
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
}
const getVendorById = async (req, res) => {
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm')
        if (!vendor) {
            return res.status(404).json({ error: "Not found" });
        }
        res.status(200).json({ vendor })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" });
    }
}
module.exports = { vendorRegistor, vendorLogin, getAllVendors, getVendorById }