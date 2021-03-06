import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

const goodsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    aliasName: {
      type: String,
    },
    category: [
      {
        name: {
          type: String,
          required: true,
        },
        enname: {
          type: String,
          required: true,
        },
        sizeId: String, //使用字符串值作为value,不用关联
        // styles: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'style'
        // }]
        sort: Number,
      },
    ],
    imgUrl: String,
    sort: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

goodsSchema.plugin(paginate);

goodsSchema.plugin(uniqueValidator);

const goodsModel = mongoose.model("goods", goodsSchema);

export default goodsModel;
