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
		size: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "size"
		},

		goods: {
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
				color: {
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
				color: {
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
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
		// toJSON: {
		// 	transform: function(doc, ret) {
		// 		// console.log("doc:", doc)
		// 		// console.log("ret:", ret)
		// 	},
		// }
		// toObject: {
		// 	transform: function(doc, ret) {
		// 		delete ret._id
		// 		console.log("doc:", doc)
		// 		console.log("ret:", ret)
		// 	}
		// }
	}
)

// styleSchema.virtual("$goods").get(function() {
// 	console.log(this)
// 	return (this.goods.myname = this.goods.name)
// })
// styleSchema.virtual("plainColors.colorInfo", {
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
