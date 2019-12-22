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
				}
			}
		]
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

favoriteSchema.plugin(uniqueValidator)

const favoriteModel = mongoose.model("favorite", favoriteSchema)

export default favoriteModel
