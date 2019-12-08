import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

/**
 * 样式管理
 */
const styleSchema = new mongoose.Schema(
	{
		styleNo: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		imgUrl: {
			type: String,
			required: true
		},
		sizeId: {
			type: String,
			required: true
		},
		goodsId: {
			type: mongoose.Schema.Types.ObjectId
		},
		categoryId: String,
		plainColors: [
			{
				colorId: {
					type: mongoose.Schema.Types.ObjectId
				},
				left: String,
				front: String,
				backend: String
			}
		],
		flowerColors: [
			{
				colorId: {
					type: mongoose.Schema.Types.ObjectId
				},
				left: String,
				front: String,
				backend: String
			}
		]
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

styleSchema.virtual("goodsInfo", {
	ref: "goods",
	localField: "goodsId",
	foreignField: "_id",
	justOne: true
})
styleSchema.virtual("plainColors.colorInfo", {
	ref: "color",
	localField: "plainColors.colorId",
	foreignField: "_id",
	justOne: true
})
styleSchema.virtual("flowerColors.colorInfo", {
	ref: "color",
	localField: "flowerColors.colorId",
	foreignField: "_id",
	justOne: true
})

styleSchema.set("toObject", { virtuals: true })
styleSchema.set("toJSON", { virtuals: true })

styleSchema.plugin(uniqueValidator)

const StyleModel = mongoose.model("style", styleSchema)

export default StyleModel
