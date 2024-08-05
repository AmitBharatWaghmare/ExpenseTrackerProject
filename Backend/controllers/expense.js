const Expense = require('../models/expense');
const user=require('../models/user');
const DownloadFile= require('../models/DownloadFile');
const S3services=require("../services/s3services");
const mongoose = require('mongoose');

const addExpense = async (req, res, next) => {
  
   try {
    const { name, expense, item, category } = req.body;
    // Create a new expense
    const newExpense = new Expense({
      name: name,
      expense: expense,
      item: item,
      category: category,
      userId: req.user._id
    });

    await newExpense.save();
    const updatedTotalExpense = req.user.totalExpense + parseFloat(expense);
    await user.findByIdAndUpdate(req.user._id, { totalExpense: updatedTotalExpense },);
   res.status(200).send({ status: true, msg: "Data successfully created" });
  } catch (err) {
     res.status(500).json({ status: false, Error: err.message });
    console.log(err);
  }
};
const getExpenses = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = Number(req.query.limit) || 5;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    let totalItem = await Expense.countDocuments({ userId: req.user.id });
    const offset = (page - 1) * limit;
    const expenses = await Expense.find({ userId: req.user.id })
      .skip(offset)
      .limit(limit);

    const hasMoreData = totalItem - (page - 1) * limit > limit;
    const nextPage = hasMoreData ? Number(page) + 1 : undefined;
    const previousPage = page > 1 ? Number(page) - 1 : undefined;
    const hasPreviousPage = previousPage ? true : false;

    res.json({
       expenses,
      currentpage: page,
      hasNextPage: hasMoreData,
      nextpage: nextPage,
      hasPreviousPage: hasPreviousPage,
      previousPage: previousPage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, err });
  }
};
const deletedata = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    const result = await Expense.findById(expenseId);
    if (!result) {
      return res.status(404).json({ status: false, msg: "Expense not found" });
    }

    const amount = result.expense;

    await Expense.findByIdAndDelete(expenseId);
    const remainingAmount = req.user.totalExpense - amount;
    await user.findByIdAndUpdate(req.user.id, { totalExpense: remainingAmount });

    res.status(200).json({ status: true, msg: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, Error: err.message });
  }
};

const editdata = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const editItem = await Expense.findById(userId);
    if (!editItem) {
      return res.status(404).json({ status: false, msg: "Expense not found" });
    }

    editItem.name = req.body.name;
    editItem.expense = req.body.expense;
    editItem.item = req.body.item;
    editItem.category = req.body.category;

    await editItem.save();
    res.status(200).json({ status: true, msg: "Expense updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, Error: err.message });
  }
};

const pageNotFound = (req, res, next) => {
  res.status(404).json('<h1>Page Not Found</h1>');
};

const downloadExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user._id;
    const filename = `expense_${userId}_${new Date().toISOString()}.txt`;
    const fileURL = await S3services.uploadS3(stringifiedExpenses, filename);

    const response = await user.findByIdAndUpdate(
      userId,
      { $push: { downloadFile: { fileURL } } },
      { new: true }
    );

    if (response) {
      return res.status(200).json({ fileURL, success: true });
    }

    throw new Error('Failed to create a record in the DownloadedFiles');
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURL: "", error: err, success: false, message: 'Something went wrong' });
  }
};

const getFileUrl = async (req, res) => {
  try { console.log(req.user._id);
    const user = await user.findById(req.user._id).select('downloadFile.fileURL');
    //console.log(req.user._id);
    if (user && user.downloadFile) {
      return res.status(200).json({ fileURL: user.downloadFile, success: true });
    }
    throw new Error('Error in fetching history');
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURL: '', success: false, error: err });
  }
};

module.exports ={ addExpense,getExpenses,deletedata,editdata,pageNotFound,downloadExpenses,getFileUrl}
