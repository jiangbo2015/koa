import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

const sizeSchema = new mongoose.Schema(
	{
		values: [
			{
				name: {
					type: String,
					required: true
				}
			}
		],
		category: String
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

sizeSchema.plugin(uniqueValidator)
const sizeModel = mongoose.model("size", sizeSchema)

export default sizeModel
