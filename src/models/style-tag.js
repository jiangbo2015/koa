import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

const styleTagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
)

styleTagSchema.plugin(uniqueValidator)
const styleTagSModel = mongoose.model("style-tag", styleTagSchema)

export default styleTagSModel
