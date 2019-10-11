import mongoose from "mongoose"
import paginate from "mongoose-paginate"
import uniqueValidator from "mongoose-unique-validator"

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
		price: {
			type: Number,
			required: true
		},
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "users"
			}
		]
	},
	{
		versionKey: false,
		timestamps: {
			createdAt: true,
			updatedAt: true
		}
	}
)

productSchema.plugin(paginate)
productSchema.plugin(uniqueValidator)

const ProductModel = mongoose.model("products", productSchema)

export default ProductModel
