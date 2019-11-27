import Product from "../models/goods"
import { response } from "../utils"
import mongoose from "mongoose"

export const add = async (ctx, next) => {
	try {
		const { name, price, userId } = ctx.request.body
		let product = new Product({ name, price })
		if (userId) {
			product.users.push(userId)
		}
		let data = await product.save()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const deleteById = async (ctx, next) => {
	try {
		const { id } = ctx.request.body
		let data = await Product.remove({ _id: id })
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

// 清空表
export const deleteMany = async (ctx, next) => {
	try {
		let data = await Product.deleteMany()
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, userId } = ctx.request.body
		let data = await Product.updateMany({ name: /风扇/ }, { name: "鼠标" })
		// let data = await Product.update(
		// 	{ _id },
		// 	{
		// 		$addToSet: {
		// 			users: userId
		// 		}
		// 	}
		// )
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const get = async (ctx, next) => {
	try {
		let data = await Product.find()
			.limit(8)
			// .gt("price", 100)
			// .skip(2)
			.sort({ createdAt: -1 })
			// .regex("name", /风扇/)
			// .slice("array", [0, 10])
			.select("name price")
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const paginate = async (ctx, next) => {
	try {
		const { page, limit } = ctx.request.query
		let data = await Product.paginate(null, { page, limit: parseInt(limit) })

		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		let data = await Product.find().populate("users")
		// .populate("users")

		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}
