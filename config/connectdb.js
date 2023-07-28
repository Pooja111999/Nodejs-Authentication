const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = "mongodb://127.0.0.1/my_Authentication"; 
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log('connected');
}
module.exports = mongoDB;