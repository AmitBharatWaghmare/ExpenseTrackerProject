const User = require('../models/user'); // Ensure the correct path to your User model

const getUserLeaderBoard = async (req, res) => {
  try {
    const result = await User.find({})
      .select('Name totalExpense')
      .sort({ totalExpense: -1 });
console.log(result.totalExpense);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = {
  getUserLeaderBoard,
};
