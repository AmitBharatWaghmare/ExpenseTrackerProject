const Razorpay = require("razorpay");
const Order = require("../models/order");
const user=require("../models/user");
const userController = require("../controllers/user");

const purchasepremium = async (req, res) => {
  try {
    const KEY_ID = "rzp_test_kyedMBzFX6RiYR";
    const KEY_SECRET = "Xg3Ut09C938tDGlfoHQx1lBB";
    var rzp = new Razorpay({
      key_id:KEY_ID,
      key_secret:KEY_SECRET,
    });
    const amount = 2000;

    rzp.orders.create({amount, currency: "INR"}, async (err, order) => {
      if (err) {
          throw new Error(JSON.stringify(err));
      }
  
      try {
          const newOrder = new Order({
            orderid: order.id,
            status: 'PENDING',
            userId: req.user._id
            // Assuming req.user contains the logged-in user
          });
        
          await newOrder.save();
  
          return res.status(201).json({order, key_id: rzp.key_id});
      } catch (error) {
          throw new Error(error);
      }
    })
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;

    // Find the order by orderid
    const order = await Order.findOne({ orderid: order_id });

    // Update the order and user status concurrently
    const promise1 = order.updateOne({
        paymentid: payment_id,
        status: "SUCCESSFUL",
    });
    const promise2 = user.updateOne({ _id: req.user._id }, { ispremiumuser: true });

    Promise.all([promise1, promise2])
        .then(() => {
            return res.status(202).json({
                success: true,
                message: "Transaction Successful",
                token: userController.generateAccessToken(userId, undefined, true),
            });
        })
        .catch((error) => {
            throw new Error(error);
        });
} catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
}
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};

  