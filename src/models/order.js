import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		}
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

orderSchema.plugin(uniqueValidator)

const orderModel = mongoose.model("order", orderSchema)

export default orderModel
