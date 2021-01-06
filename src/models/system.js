import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const systemSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    meiyuan: Number,
    ouyuan: Number,
    img: String,
    img1: String,
    img2: String,
    img3: String,
    exhibition1: String,
    exhibition2: String,
    carousels: [String],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

systemSchema.plugin(uniqueValidator);

const systemModel = mongoose.model("system", systemSchema);

export default systemModel;
