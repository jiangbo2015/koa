import mongoose from "mongoose";

console.log(process.env.NODE_ENV);

// 使用env作为数据库名字【production, test, development】
let dbname = process.env.NODE_ENV || "development";

mongoose.connect(`mongodb://localhost/${dbname}`, {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

db.on("error", (err) => {
  console.log(`数据库：${dbname}连接失败`, err);
});

db.once("open", function () {
  console.log(`数据库：${dbname}连接成功`);
});
