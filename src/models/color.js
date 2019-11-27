import mongoose from "mongoose"

/**
 * type: 0-素色，1-花色
 */
const colorSchema = new mongoose.Schema(
	{
		type: Number,
		code: String,
		value: [
			{
				name: String
				// front: String,
				// backend: String,
				// left: String
			}
		]
	},
	{
		versionKey: false
	}
)

const colorModel = mongoose.model("color", colorSchema)

export default colorModel
