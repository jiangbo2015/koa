import Color from "../models/color"
import { response } from "../utils"

export const add = async (ctx, next) => {
	try {
		const body = ctx.request.body
		let color = new Color(body)
		let data = await color.save()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		let data = await Color.find({
			// "value.name": "B",
			// type: 1
		})
			.where("value.name")
			.equals("B")
			.slice("value", 2)
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, value } = ctx.request.body
		// let data = await Color.findOne({ _id })
		// data.value["front"] = "change success"
		// data = await data.save()
		let data = await Color.findByIdAndUpdate({ _id }, { value }, { new: true })
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const del = async (ctx, next) => {
	try {
		const { _id, category_id } = ctx.request.body
		let p = await Color.findOne({ _id })
		console.log("p", p, p.value)
		let current = await p.value.id(category_id)
		current.name = "C"
		console.log("current", current)
		let data = await p.save()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}
