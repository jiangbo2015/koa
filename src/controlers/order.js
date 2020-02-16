import Order from "../models/order"
import { response } from "../utils"
import { getCurrentUser } from "./user"
import mongoose from "mongoose"

export const add = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		const body = ctx.request.body
		console.log("order", body)
		body.user = currentUser._id
		let order = new Order(body)
		const data = await order.save()

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getMyList = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		const { isSend } = ctx.request.query
		const q = {
			user: mongoose.Types.ObjectId(currentUser._id)
		}
		if (typeof isSend !== "undefined") {
			q.isSend = isSend
		}
		const data = await Order.find(q)
			.populate({
				path: "orderData.favorite",
				populate: "styleAndColor.styleId"
			})
			.lean()

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		const data = await Order.find()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const send = async (ctx, next) => {
	try {
		const { list } = ctx.request.body
		console.log("list", list)
		const data = await Order.updateMany(
			{
				_id: {
					$in: list
				}
			},
			{
				$set: {
					isSend: true
				}
			}
		)
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}
