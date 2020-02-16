import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
		packageCount: Number,
		isSend: {
			type: Number,
			default: 0
		},
		orderData: [
			{
				favoriteId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "favorite"
				},
				sizeInfo: [
					{
						name: String,
						num: Number
					}
				],
				totalPrice: Number,
				total: Number
			}
		]
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
		toJSON: {
			virtuals: true
		},
		toObject: {
			virtuals: true
		}
	}
)

orderSchema.virtual("orderData.favorite", {
	ref: "favorite",
	localField: "orderData.favoriteId",
	foreignField: "_id",
	justOne: true
})
// orderSchema.set("toObject", { virtuals: true })
// orderSchema.set("toJSON", { virtuals: true })
// orderSchema.virtual("favor").get(function() {
// 	return this.packageCount
// })

orderSchema.plugin(uniqueValidator)

const orderModel = mongoose.model("order", orderSchema)

export default orderModel
