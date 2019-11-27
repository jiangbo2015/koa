import mongoose from "mongoose"
/**
 * 样式管理
 */
const productBaseSchema = new mongoose.Schema(
	{
		sytleNo: {
			type: String
		},
		price: Number,
		styleUrl: String,
		size: String,
		goose: String,
		category: String,
		plainColors: Array,
		flowerColors: Array
	},
	{
		versionKey: false
	}
)

const ProductBaseModel = mongoose.model("product-base", productBaseSchema)

export default ProductBaseModel
