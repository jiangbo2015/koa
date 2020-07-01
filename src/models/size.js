import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

const sizeSchema = new mongoose.Schema(
	{
		values: [
			{
				name: {
					type: String,
					required: true,
				},
			},
		],
		goods: [String],
		isDel: {
			type: Number,
			default: 0,
		},
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
	}
)

sizeSchema.plugin(uniqueValidator)
const sizeModel = mongoose.model("size", sizeSchema)

export default sizeModel
