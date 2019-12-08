import GoodsBase from "../models/goods-base"
import { response } from "../utils"

export const getRuleInfo = async (ctx, next) => {
	try {
		ctx.body = response(
			true,
			{
				plainColor: "S-",
				flowerColor: "H-"
			},
			"成功"
		)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}
