const  {UserModel} = require("../model/UserModel");
const  {ContactModel} = require("../model/ContactModel");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET || "12345@abcd12";
const jwt = require("jsonwebtoken");
const {OtpModel} = require("../model/OtpModel");
const userController = {};

userController.userRegistration = async (req, res) => {
    try {
        const { name, email, password, stream, year,role } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            name,
      email,
      password: hashedPassword,
      stream,
      year,
      role
        });
// console.log(user);
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

userController.login = async (req,res)=>{

    try {
        const {email,password} = req.body;
        console.log(req.body);
        // const email="abc@gmail.com";
        // const password="123";
        const user = await UserModel.findOne({ email });
        console.log(user);
        // console.log("print")
        // console.log(user);
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
          }
          const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          };
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
          res.json({ message: "Login successful", token, user: { name: user.name, email: user.email, role: user.role } });
        //   res.json({ message: "Login successful"});
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

userController.getUsers = async (req,res) => {
    try {
    const user = await UserModel.find({},"-password");
    const totalUser = user.length;
    res.status(200).json({error:false,message:"users fetched successfully",user,totalUser});        
    } catch (error) {
        res.status(500).json({error:false,message:"internal server error",error:error.message})
    }
}

userController.profile =async (req,res) => {
    try {
        const {id} = req.userInfo;
    const user = await UserModel.findById(id).select("-password");;
    if(!user){
        return res.status(404).json({error:true,message:"no such user"})
    }
    res.json({error:false,message:"user fetched successfully",user});
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({error:true,message:"Internal Server error"})
    }
    

}

userController.addContact = async(req,res) => {
    const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newContact = new ContactModel({ name, email, subject, message });
    await newContact.save();
    console.log('📩 Contact saved to DB:', newContact);

    res.status(200).json({ success: true, message: 'Your message has been sent! We will get back to you soon.' });
  } catch (error) {
    console.error('Error saving contact:', error.message);
    res.status(500).json({ error: 'Server error while saving message' });
  }

}

// Forgot password OTP
userController.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const cleanEmail = email.trim();
    const user = await UserModel.findOne({
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpModel.findOneAndUpdate(
      { email: user.email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(`OTP for ${user.email}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      devOtp: otp,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to process request" });
  }
};

// Verify OTP
userController.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const cleanEmail = email.trim();
    const cleanOtp = otp.toString().trim();

    const record = await OtpModel.findOne({
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
    });

    if (!record || record.otp !== cleanOtp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    const otpAge = (new Date() - new Date(record.createdAt)) / (1000 * 60);
    if (otpAge > 10) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// Reset password
userController.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    if (newPassword.length < 4) {
      return res.status(400).json({ message: "Password must be at least 4 characters" });
    }

    const cleanEmail = email.trim();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await UserModel.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${cleanEmail}$`, "i") } },
      { password: hashedPassword }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    await OtpModel.deleteMany({
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Error updating password" });
  }
};

module.exports = { userController };