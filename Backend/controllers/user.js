const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt =require(`jsonwebtoken`);

function isstringnotvalid(string) {         //This function will return true if string not valid
  if (string == undefined || string.length === 0) {
      return true;
  }
  else {
      return false;
  }
}
const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId : id, name: name, ispremiumuser } ,'secretkey');
}

const Signup=async (req, res) => {
    const { Name, Email, Password } = req.body;
    try {
      // Validate input
      if (!Name || !Email || !Password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if user exists
      const existingUser = await User.findOne({ Email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Password, salt);
  
      // Create new user
      const newUser = new User({
        Name,
        Email,
        Password: hashedPassword
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'UEser created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const Login=async(req, res, next)=>
    {try {
      const { Email, Password } = req.body;

      if (isstringnotvalid(Email) || isstringnotvalid(Password)) {
          return res.status(400).json({ message: "Email id or password is missing", success: false })
      }
      const user = await User.findOne({ Email:Email })
      
      if (user) {
          bcrypt.compare(Password, user.Password, (err, result) => {
              if(err){
                console.log(err);
                  res.status(500).json({ success: false, message: "Something went wrong" })
              }
              if(result == true){
              res.status(200).json({ success: true, message: "User logged in sucessfully" ,token:generateAccessToken(user.id ,user.Name, user.ispremiumuser)})
              }
              else {
                  return res.status(400).json({ success: false, message: "Password is incorrect" })
              }
          })     
      }
      else {
          return res.status(404).json({ success: false, message: "User doesnot exist" })
      }
  }
  catch (err) {console.log(err);
      res.status(500).json({ message: err, success: false })
    }
  }
module.exports ={generateAccessToken,Signup,Login}