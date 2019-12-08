import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

/**
 * type: 0-素色，1-花色
 * code规则, S-素色，H-花色，版式-B
 */
const colorSchema = new mongoose.Schema(
	{
		type: {
			type: Number,
			required: true,
			enum: [0, 1]
		},
		code: String,
		value: String
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

colorSchema.plugin(uniqueValidator)

const colorModel = mongoose.model("color", colorSchema)

export default colorModel
