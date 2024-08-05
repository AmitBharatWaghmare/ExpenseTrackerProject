// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const downloadFileSchema = new Schema({
//   fileURL: {
//     type: String,
//     required: true
//   }
// });

// const DownloadFile = mongoose.model('DownloadFile', downloadFileSchema);

// module.exports = DownloadFile;
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    fileURL: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 
});

const File = mongoose.model('File', FileSchema);

module.exports = File;
