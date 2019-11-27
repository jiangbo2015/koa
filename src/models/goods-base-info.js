import mongoose from "mongoose"

const goodsSchema = new mongoose.Schema(
	{
		name: String,
		format: String,
		currency: Number,
		imgSize: Number,
		size: Array
	},
	{
		versionKey: false
	}
)

const GoodsBaseModel = mongoose.model("goods-base", goodsSchema)

export default GoodsBaseModel
