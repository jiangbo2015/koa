import Color from "../models/color"
import { response } from "../utils"
import moment from "moment"

const codePrefix = {
	0: "S-",
	1: "H-"
}

export const add = async (ctx, next) => {
	try {
		const { type, value } = ctx.request.body
		const code = codePrefix[type] + moment().format("YYMMDDHHMMss")
		let color = new Color({
			type,
			value,
			code
		})
		let data = await color.save()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		let { type, code } = ctx.request.query
		let q = {}
		if (code) {
			q.code = {
				$regex: new RegExp(code, "i")
			}
		}
		if (type) {
			q.type = type
		}
		let data = await Color.find(q)
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, value } = ctx.request.body
		let data = await Color.findByIdAndUpdate({ _id }, { value }, { new: true })
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const del = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		let data = await Color.findByIdAndRemove({ _id })
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}
