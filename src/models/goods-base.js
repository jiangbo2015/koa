import mongoose from "mongoose"

const goodsSchema = new mongoose.Schema(
	{
		name: String
		// format: String,
		// currency: [
		// 	{
		// 		name: String
		// 	}
		// ],
		// imgSize: Number,
		// size: Array
	},
	{
		versionKey: false,
		timestamps: true
	}
)

const GoodsBaseModel = mongoose.model("goods-base", goodsSchema)

export default GoodsBaseModel
