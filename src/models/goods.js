import mongoose from "mongoose"
import paginate from "mongoose-paginate"
import uniqueValidator from "mongoose-unique-validator"

const goodsSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
		aliasName: {
			type: String
		},
		category: [
			{
				name: String,
				size: String
			}
		]
		// users: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: "users"
		// 	}
		// ]
	},
	{
		versionKey: false,
		timestamps: {
			createdAt: true,
			updatedAt: true
		}
	}
)

goodsSchema.plugin(paginate)
goodsSchema.plugin(uniqueValidator)

const goodsModel = mongoose.model("goods", goodsSchema)

export default goodsModel
