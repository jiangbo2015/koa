import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

const favoriteSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
		styleAndColor: [
			{
				styleId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "style"
				},
				colorId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "color"
				},
				front: String
			}
		]
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
		toJSON: {
			virtuals: true
			// transform: function(doc, ret) {
			// 	console.log(ret, "ret")
			// }
		},
		toObject: {
			virtuals: true
			// transform: function(doc, ret) {
			// 	console.log(ret, "ret")
			// }
		}
	}
)

favoriteSchema.virtual("styleAndColor.style", {
	ref: "style",
	localField: "styleAndColor.styleId",
	foreignField: "_id",
	justOne: true
})
favoriteSchema.virtual("styleAndColor.color", {
	ref: "color",
	localField: "styleAndColor.colorId",
	foreignField: "_id",
	justOne: true
})

favoriteSchema.plugin(uniqueValidator)

const favoriteModel = mongoose.model("favorite", favoriteSchema)

export default favoriteModel
