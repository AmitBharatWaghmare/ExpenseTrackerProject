const express = require('express');
const bodyParser= require("body-parser");
var cors = require("cors");
require("dotenv").config();
const fs = require('fs');
const path = require('path');
// Connect to MongoDB
const connectDB = require('./utils/database');
connectDB();

const user=require("../backend/models/user");
const DownloadFile=require("../backend/models/DownloadFile");
const expense=require("../backend/models/expense");
const forgetPassword=require("../backend/models/forgetPassword");
const order=require("../backend/models/order");

const userRoutes = require("./routers/user");
const expenseRoutes=require("./routers/expense");
const premiumFeatureRoutes=require("./routers/premiumFeature");
const purchaseRoutes=require("./routers/purchase");
const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'});
// Middleware
app.use(express.json());
app.use(bodyParser.json({ extended: false }));
app.use(cors());
// Define Routes
app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use("/purchase", purchaseRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
