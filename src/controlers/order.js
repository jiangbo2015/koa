import Order from "../models/order"
import { response } from "../utils"
import { getCurrentUser } from "./user"

export const add = async (ctx, next) => {
	try {
		const body = ctx.request.body

		// ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getMyList = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		const data = await Order.find({
			user: currentUser._id
		})
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
