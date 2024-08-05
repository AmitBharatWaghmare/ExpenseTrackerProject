// const jwt = require("jsonwebtoken");
// const Signup = require("../models/user"); // Assuming your Mongoose model is defined in a file named 'Signup.js'

// const authenticate=(req,res,next)=>{
// if(req.headers && 
//   req.headers.authorization &&
//    req.headers.authorization.split(" ")[0]==="JWT"
// ){
// jwt.verify(
//   req.headers.authorization.split(" ")[1],
//   "secretKey",
//   function(err,verifiedToken){
//       if(err){
//           res.status(401).send("Invalid JWT Token");
//       }
//       Signup.findById(verifiedToken.userId).then((user)=>{
//         req.user=user;
//         next();
//     })
//     .catch((err)=>res.status(500).send("Server not Available"));
// }
// );
// }
// else{
// res.status(403).send("Token not present");
// }
// };

// module.exports={authenticate};
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, "secretkey");
    
    User.findById(user.userId).then((users) => {
      req.user = users;
      next();
    });
  } catch (err) {
    return res.status(401).json({ success: false });
  }
};
module.exports = { authenticate };

// const authenticate = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization");
//     if (!token) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }
//     const decoded = jwt.verify(token, "secretkey");
//     const user = await Signup.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     req.user = user; // Attach the user object to the request for further use
//     next(); // Proceed to the next middleware or route handler
//   } catch (err) {
//     console.error("Authentication error:", err);
//     return res.status(401).json({ success: false, message: "Authentication failed" });
//   }
// };

// module.exports = { authenticate };
