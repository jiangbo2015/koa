import Style from "../models/style"
import Channel from "../models/channel"
import { response } from "../utils"
import { getCurrentUser } from "./user"

export const add = async (ctx, next) => {
	try {
		const { body } = ctx.request
		let style = new Style(body)
		let data = await style.save()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		let { query } = ctx.request
		const currentUser = await getCurrentUser(ctx)
		let styleIds = []
		let data = []
		if (currentUser.role === 2) {
			let channel = await Channel.findById({ _id: currentUser.channels[0] })
			channel.styles.map(x => styleIds.push(x.styleId))
			console.log(styleIds, "styles")
			data = await Style.find({
				_id: {
					$in: styleIds
				}
			})
		} else {
			data = await Style.find()
		}

		// .populate("test.color")
		// .populate("goods")
		// .populate("plainColors.color")

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, ...others } = ctx.request.body
		let data = await Style.findByIdAndUpdate(
			{ _id },
			{ ...others },
			{ new: true }
		)
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

/**
 *
 * @param {object} res 直接文档对象
 * @param {string} field 要操作的字段
 * @param {string} key 要操作的该字段的对象属性
 * @param {object} target 要替换或添加的对象
 */
const updateInnerArray = (res, field, key, target) => {
	let index = res[key].findIndex(x => x[field] === target[field])
	if (index > -1) {
		res[key].splice(index, 1, target)
	} else {
		res[key].push(target)
	}
}

export const updateAttr = async (ctx, next) => {
	try {
		const { _id, ...attr } = ctx.request.body
		let res = await Style.findByIdAndUpdate({
			_id
		})
		updateInnerArray(res, "attrs", "colorId", attr)
		let data = await res.save()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

/**
 * 给当前款式下，对通道分配尺寸，素色，花色
 * 先查找channels数组里面是否有该通道，若没有，则添加
 * 若有，则更新
 */
export const assign = async (ctx, next) => {
	try {
		const { _id, ...channel } = ctx.request.body

		let res = await Style.findOneAndUpdate({
			_id,
			"channels.channelId": channel.channelId
		})
		updateInnerArray(res, "channels", "channelId", channel)

		let data = await res.save()

		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const updateMany = async (ctx, next) => {
	try {
		const body = ctx.request.body
		let data = await Style.updateMany(
			{},
			{
				...body
			}
		)
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const del = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		let data = await Style.findByIdAndRemove({ _id })
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const detail = async (ctx, next) => {
	try {
		const { _id, channelId } = ctx.request.query
		// const { role } = await getCurrentUser(ctx, next)

		let data = await await Style.findById(_id)
			// .populate("goodsId")
			.populate({
				path: "plainColors.colorId"
			})
			.populate({
				path: "flowerColors.colorId"
			})
			.populate("size")
			.select("-plainColors._id -flowerColors._id")
			.exec()

		ctx.body = response(true, data, "成功")

		// data = JSON.parse(JSON.stringify(data))
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}
