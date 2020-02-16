import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

function transform(doc, ret) {
	console.log(ret)
	ret.plainColors.map(item => {
		if (typeof item.colorId === "object") {
			item.code = item.colorId.code
			item.value = item.colorId.value
			item.type = item.colorId.type
			item.colorId = item.colorId._id
		}
	})
	ret.flowerColors.map(item => {
		if (typeof item.colorId === "object") {
			item.code = item.colorId.code
			item.value = item.colorId.value
			item.type = item.colorId.type
			item.colorId = item.colorId._id
		}
	})
}

/**
 * 样式管理
 */
const styleSchema = new mongoose.Schema(
	{
		styleNo: {
			type: String,
			required: true
		},
		styleName: {
			type: String
		},
		price: {
			type: Number,
			required: true
		},
		imgUrl: {
			type: String,
			required: true
		},
		size: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "size"
		},
		currency: Number,
		goodsId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "goods"
		},
		categoryId: String,
		channels: [
			{
				channelId: String,
				sizeIds: Array,
				plainColorIds: Array,
				flowerColorIds: Array
			}
		],

		plainColors: [
			{
				colorId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "color"
				},
				left: String,
				front: String,
				backend: String
			}
		],
		flowerColors: [
			{
				colorId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "color"
				},
				left: String,
				front: String,
				backend: String
			}
		]
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
		toJSON: {
			virtuals: true,
			transform
		},
		toObject: {
			virtuals: true,
			transform
		}
	}
)

// styleSchema.virtual("$goods").get(function() {
// 	console.log(this)
// 	return (this.goods.myname = this.goods.name)
// })
// styleSchema.virtual("plainColors.color", {
// 	ref: "color",
// 	localField: "plainColors.colorId",
// 	foreignField: "_id",
// 	justOne: true
// })
// styleSchema.virtual("flowerColors.colorInfo", {
// 	ref: "color",
// 	localField: "flowerColors.colorId",
// 	foreignField: "_id",
// 	justOne: true
// })

styleSchema.plugin(uniqueValidator)

const StyleModel = mongoose.model("style", styleSchema)

export default StyleModel
