import Router from "koa-router";

import * as Style from "../controlers/style";
import * as StyleTag from "../controlers/style-tag";
import * as StyleSize from "../controlers/style-size";

const router = new Router();

/**
 * @api {post} /style/add 添加款式
 * @apiName add
 * @apiGroup Style
 * @apiParamExample  {json} Request-Example:
 *    {
	"styleNo": "s001",
	"price": 100,
	"imgUrl": "http://www.baidu.com",
	"sizeId": "5dea211c86b0d20740b8f6ec",
	"goodsId": "5dea31af3579b40840224490",
	"category": "上衣",
	
}
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Style.add);

/**
 * @api {get} /style/getList 获取所有款式
 * @apiName getList
 * @apiGroup Style
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", Style.getList);

router.get("/getUserStyleList", Style.getUserStyleList);

/**
 * @api {post} /style/delete 删除款式
 * @apiName delete
 * @apiGroup Style
 *
 * @apiParam  {String} _id 款式
 * *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", Style.del);

/**
 * @api {post} /style/update 更新款式
 * @apiName update
 * @apiGroup Style
 *
 * @apiParamExample  {json} Request-Example:
 *    {
	"_id": "5deb0a2ab7afdf0f689d4330",
	"plainColors": [
            {
                "_id": "5deb0f1519ec810f90ebbaa0",
                "colorId": "5dea2b53644fab07a224bd46",
                "left": "left5",
                "front": "front5",
                "backend": "backend4"
            },{
            	"colorId": "5deb0e6119ec810f90ebba9c",
            	"left": "left2",
                "front": "front2",
                "backend": "backend2"
            }
        ]
    }
 * 
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", Style.update);

/**
 * @api {get} /style/detail 获取款式详情
 * @apiName detail
 * @apiGroup Style
 *
 * @apiParam  {String} _id 款式id
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/detail", Style.detail);

/**
 * @api {post} /style/assign 给通道分配尺寸，素色，花色
 * @apiName assign
 * @apiGroup Style
 *
 * @apiParam  {String} _id 当前款式id
 * @apiParam  {String} sizeIds size的id数组
 * @apiParam  {String} plainColorIds 素色的id数组
 * @apiParam  {String} flowerColorIds 花色的id数组
 * @apiParam  {String} channelId 通道id
 *
 * @apiParamExample  {json} Request-Example:
 *    {
 *      _id: "款式的id",
 *      sizeIds: ["尺寸M的id"],
 *      plainColorIds: ["素色的id"]
 *      flowerColorIds: ["花色的id"]
 *      channelId: 通道的ID
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/assign", Style.assign);

router.post("/updateMany", Style.updateMany);

router.post("/updateAttr", Style.updateAttr);

router.post("/addStyleTag", StyleTag.add);

router.get("/getStyleTagList", StyleTag.getList);

router.get("/getStyleSizeList", StyleSize.getList);
router.post("/addStyleSize", StyleSize.add);

export default router.routes();
