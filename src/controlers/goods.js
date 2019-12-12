import Goods from "../models/goods"
import Style from "../models/style"
import { response } from "../utils"
import mongoose from "mongoose"

export const add = async (ctx, next) => {
	try {
		const body = ctx.request.body
		let goods = new Goods(body)

		let data = await goods.save()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		let data = await Goods.find()

		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, ...others } = ctx.request.body
		let data = await Goods.findByIdAndUpdate(
			{ _id },
			{
				...others
			},
			{
				new: true
			}
		)
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const deleteById = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		let data = await Goods.remove({ _id })
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const detail = async (ctx, next) => {
	try {
		const { _id } = ctx.request.query

		let data = await Goods.findById({ _id }).lean()
		let styles = await Style.aggregate([
			{
				$match: {
					goods: mongoose.Types.ObjectId(_id)
				}
			},

			{
				$unwind: "$categoryId"
			},
			{
				$group: {
					_id: "$categoryId",
					styles: {
						$push: "$$ROOT"
					}
				}
			}
		])

		// 将分组好的款式添加到对应的分类上
		data.category.map(item => {
			let index = styles.findIndex(s => s._id == item._id)
			if (index > -1) {
				item.styles = styles[index]["styles"]
			} else {
				item.styles = []
			}
		})
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

// // 清空表
// export const deleteMany = async (ctx, next) => {
// 	try {
// 		let data = await Product.deleteMany()
// 		ctx.body = response(true, data)
// 	} catch (err) {
// 		ctx.body = response(false, null, err.message)
// 	}
// }

// export const get = async (ctx, next) => {
// 	try {
// 		let data = await Product.find()
// 			.limit(8)
// 			// .gt("price", 100)
// 			// .skip(2)
// 			.sort({ createdAt: -1 })
// 			// .regex("name", /风扇/)
// 			// .slice("array", [0, 10])
// 			.select("name price")
// 		ctx.body = response(true, data)
// 	} catch (err) {
// 		ctx.body = response(false, null, err.message)
// 	}
// }

// export const paginate = async (ctx, next) => {
// 	try {
// 		const { page, limit } = ctx.request.query
// 		let data = await Product.paginate(null, { page, limit: parseInt(limit) })

// 		ctx.body = response(true, data)
// 	} catch (err) {
// 		ctx.body = response(false, null, err.message)
// 	}
// }
