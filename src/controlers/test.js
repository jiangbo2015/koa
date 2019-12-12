import Channel from "../models/test"
import { response } from "../utils"

/**导出excel */
// var json2xls = require("json2xls")
// import fs from "fs"
// var xls = json2xls(data)
// fs.writeFileSync("data.xlsx", xls, "binary")

export const add = async (ctx, next) => {
	try {
		const { ref, name, _id } = ctx.request.body
		// let channel = new Channel({ ref, name })
		// let data = await channel.save()
		let data = await Channel.findOneAndUpdate(
			{
				_id
				// "arrs.flagId": flag.flagId
			},
			{
				$addToSet: {
					styles: { ref, name }
				}
			},
			{
				new: true,
				upsert: true
			}
		)

		// if (!data) {
		// 	data = await Channel.findOneAndUpdate(
		// 		{
		// 			_id
		// 		},
		// 		{
		// 			$push: {
		// 				arrs: flag
		// 			}
		// 		},
		// 		{
		// 			new: true
		// 		}
		// 	)
		// }
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, err.message)
	}
}

export const adds = async (ctx, next) => {
	try {
		const { _id, channelId, flag } = ctx.request.body

		console.log(flag)
		// let channel = new Channel({ channelId })
		// let data = await channel.save()
		// let data = await Channel.findOne({
		// 	_id,
		// 	"arrs.flagId": flag.flagId
		// })
		let data = ""
		if (false) {
			console.log("!data")
			data = await Channel.findOneAndUpdate(
				{
					_id
				},
				{
					$push: {
						arrs: flag
					}
				}
			)
		} else {
			console.log("set")
			data = await Channel.findOneAndUpdate(
				{
					_id,
					"arrs.flagId": {
						$ne: flag.flagId
					}
					// "arrs.flagId": flag.flagId
				},
				{
					// $addToSet: {
					// 	arrs: flag
					// }
					// $addToSet: {
					// 	arrs: flag
					// }
					// $set: {
					// 	"arrs.$": flag
					// }
					/**
					 * 向数组中添加一项
					 */
					$push: {
						arrs: flag
					}
					/**
					 * 删除数组中的匹配项
					 */
					// $pull: {
					// 	arrs: {
					// 		flagId: flag.flagId
					// 	}
					// }
				},
				{
					new: true
					// upsert: true
				}
			)
		}
		var datas = await Channel.find()
		ctx.body = response(true, datas)
		// ctx.body = response(true, data)
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		let data = await Channel.find().populate("styles.ref")
		// await assign("5deda268d7571c131607f877", "sizeIds", ["A", "B"])
		ctx.body = response(true, data)
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const del = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		let data = await Channel.deleteOne({ _id })
		ctx.body = response(true, data)
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

/**
 * 给通道分配尺寸，花色，素色
 */
export const assign = async (ctx, next) => {
	const { _id, ...others } = ctx.request.body
	try {
		let data = await Channel.findByIdAndUpdate(_id, others)
		return response(true, data)
	} catch (err) {
		console.log(err)
		return response(false, null, err.message)
	}
}
