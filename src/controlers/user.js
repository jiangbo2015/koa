import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import config from "../config"
import { response } from "../utils"
import User from "../models/user"

export const login = async (ctx, next) => {
	console.log(ctx.request)
	console.log(ctx.request.query)
	console.log(ctx.request.query.name)
	console.log(ctx.request.body)
	ctx.body = {
		success: true
	}
}

export const register = async (ctx, next) => {
	console.log(ctx.request)
	console.log(ctx.request.query)
	console.log(ctx.request.query.name)
	console.log(ctx.request.body)
	ctx.body = {
		success: true
	}
}

const verify = token => jwt.verify(token.split(" ")[1], config.secret)

export const getCurrentUser = async (ctx, next) => {
	console.log(verify(ctx.headers.authorization))
	ctx.body = {
		success: true
	}
}

export const add = async (ctx, next) => {
	try {
		const { phone, password, productId } = ctx.request.body
		let user = new User({ phone, password })
		user.products.push(productId)
		let data = user.save()
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { id, productId } = ctx.request.body
		console.log(productId)
		let data = await User.update(
			{ _id: id },
			{
				$addToSet: {
					products: productId
				}
			}
		)

		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		// 查询所有用户，并选择phone字段，不包括_id字段
		// let data = await User.find(null, "phone -_id")
		let data = await User.find()
			.populate({
				path: "products",
				match: {
					price: { $gt: 50 }
				},
				select: "name price -_id" //products表选择的field
			})
			.select("phone -_id") //users表选择的field

		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getUserByRef = async (ctx, next) => {
	try {
		let data = await User.find()
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const deleteMany = async (ctx, next) => {
	try {
		let data = await User.deleteMany()
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const deleteById = async (ctx, next) => {
	try {
		const { id } = ctx.request.body
		let data = await User.remove({ _id: id })
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getUserById = async (ctx, next) => {
	try {
		const { id } = ctx.request.query
		let data = await User.findById({ _id: id })
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const aggregate = async (ctx, next) => {
	try {
		const { uid, phone } = ctx.request.query
		let data = await User.aggregate([
			// {
			// 	$match: {
			// 		// _id: mongoose.Types.ObjectId(uid)
			// 		phone: {
			// 			$regex: /''/
			// 		}
			// 	}
			// },
			{
				$lookup: {
					from: "products",
					localField: "_id",
					foreignField: "uid",
					as: "products"
				}
			},
			{
				$project: {
					products: {
						name: 1
					},
					product: {
						// name: 1,
						// $slice: ["$products", 2]
						$slice: [[{ name: "good" }, { name: "bad" }, { name: "middle" }], 2]
					},
					phone: 1,
					num: {
						$size: "$products"
					},
					total: {
						$sum: "$products.price"
					}
				}
			}
		])
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}
