import xl from "excel4node";
import fs from "fs";
import fse from "fs-extra";
import json2xls from "json2xls";
import _ from "lodash";
import moment from "moment";
import mongoose from "mongoose";
import path from "path";
import Order from "../models/capsule-order";
import System from "../models/system";
import User from "../models/user";
import Mail from "../utils/mail";
// import dataURL2Blob from "../utils/dataURL2Blob"
import { getCurrentUser } from "./user";
import { response, downImg, pickInfos } from "../utils";
const baseImgUrl = "https://ik.imagekit.io/";

export const add = async (ctx, next) => {
  try {
    const currentUser = await getCurrentUser(ctx);
    const body = ctx.request.body;
    body.user = currentUser._id;
    if (body.isSend == 1) {
      let date = moment().format("YYYYMMDD");
      let total = (await Order.find({ date })).length + 1;
      body.orderNo = `C-${currentUser.name}-${date}-${total}`;
      body.date = date;
    }
    let order = new Order(body);
    const data = await order.save();

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const update = async (ctx, next) => {
  try {
    const { _id, ...others } = ctx.request.body;

    const data = await Order.findByIdAndUpdate({ _id }, others);

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const merge = async (ctx, next) => {
    try {
      const currentUser = await getCurrentUser(ctx);
      const body = ctx.request.body;
      body.user = currentUser._id;
      let date = moment().format("YYYYMMDD");
      let total = (await Order.find({ date })).length + 1;
      body.orderNo = `C-${currentUser.name}-${date}-${total}`;
      body.date = date;
      
      await Order.updateMany(
        {
          _id: {
            $in: body.children,
          },
        },
        {
            isMerge: 1,
        }
      );

      let order = new Order(body);
      const data = await order.save();
  
      ctx.body = response(true, data, "成功");
    } catch (err) {
      ctx.body = response(false, null, err.message);
    }
  };

export const clear = async (ctx, next) => {
  try {
    let data = await Order.deleteMany();

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getMyList = async (ctx, next) => {
  try {
    const currentUser = await getCurrentUser(ctx);
    const { isSend, capsuleId } = ctx.request.query;
    const q = {
      user: mongoose.Types.ObjectId(currentUser._id),
      isDel: 0,
    };
    if (typeof isSend !== "undefined") {
      q.isSend = isSend;
    }
    if (typeof capsuleId !== "undefined") {
      q.capsuleId = capsuleId;
    }
    const data = await Order.find(q)
      .sort({ createdAt: -1 })
      .populate({
        path: "orderData.items.capsuleStyle",
      })
      .populate("user")
      .lean();

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const addStyleToOrder = async (ctx, next) => {
    try {
      const currentUser = await getCurrentUser(ctx);
      const { capsuleId,style } = ctx.request.body;
      const q = {
        user: mongoose.Types.ObjectId(currentUser._id),
        isDel: 0,
        isSend: 0
      };

      if (typeof capsuleId !== "undefined") {
        q.capsuleId = capsuleId;
      }
      const orderList= await Order.find(q)
        .sort({ createdAt: -1 })
        .populate({
          path: "orderData.items.capsuleStyle",
        })
        .populate("user")
        .lean();
        let data = {}
      if(orderList.length > 0){
         const order = orderList[0]
         order.orderData.unshift(style)
         console.log('order.orderData', order.orderData)
         data = await Order.findByIdAndUpdate({ _id: order._id }, {orderData: order.orderData});
      }else {
         // style
         let order = new Order({
            user: currentUser._id,
            capsuleId,
            orderData: [style]
         });
        data = await order.save();
      }
  
      ctx.body = response(true, data, "成功");
    } catch (err) {
      ctx.body = response(false, null, err.message);
    }
  };

export const getList = async (ctx, next) => {
  try {
    const { userId } = ctx.request.query;
    let q = {
      isDel: 0,
    };
    if (userId) {
      q.user = userId;
    }
    const currentUser = await getCurrentUser(ctx);

    // 1是产品经理
    let data = await Order.find(q)
      .sort({ createdAt: -1 })
      .populate({
        path: "orderData.items.capsuleStyle",
      })
      .populate("user");
    await Order.findByIdAndUpdate({ _id }, {isReaded: 1});
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

// 管理系统获取订单列表
export const getAllList = async (ctx, next) => {
  try {
    const { orderNo, userName } = ctx.request.query;
    let q = {
      isSend: 1,
      isDel: 0,
    };
    let data = {};

    if (orderNo) {
      q._id = orderNo;
      await Order.find(q).sort({ createdAt: -1 }).populate("user");
    } else {
      if (userName) {
        const res = await User.findOne({
          name: userName,
        });
        q.user = res ? res._id : null;
      }
      data = await Order.find(q).sort({ createdAt: -1 }).populate("user");
    }

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const detail = async (ctx, next) => {
  try {
    const { _id } = ctx.request.query;
    console.log('_id', _id)
    const data = await Order.findById({ _id })
      .populate({
        path: "orderData.items.capsuleStyle",
      })
      .populate("user")
      .populate("children")
      .populate({
        path: "children.children",
       })
      .lean();
    ctx.body = response(true, data, "成功");
  } catch (err) {console.log('err', err)
    ctx.body = response(false, null, err.message);
  }
};

export const orderRank = async (ctx, next) => {
  try {
    const { startDate, endDate } = ctx.request.query;
    const match = {};
    const currentUser = await getCurrentUser(ctx);
    let ownerData = await User.find({
        owner: currentUser._id,
        // isDel: 0,
      });
    if(ownerData){
        match.user = {
            $in: ownerData.map(x => x._id)
        }
    }
    if (startDate) {
      match.createdAt = {
        $gt: new Date(startDate),
        $lt: new Date(endDate),
      };
    }
    const data = await Order.aggregate([
      {
        $match: match,
      },
      {
        $unwind: "$orderData",
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          number: { $sum: "$sumCount" },
          amount: {
            $sum: "$sumPrice",
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          number: 1,
          amount: 1,
        },
      },
      { $sort: { date : 1 } }
    ])
    let emptyItems = []
    if(data && data.length > 0) {
       
        let [year, month] = data[0].date.split('-')
        month = parseInt(month)
        year= parseInt(year)
        console.log('0--,',year, month)
        for(let i = 1; i < data.length; i++){
            console.log('0:',i)
            let [year2, month2] = data[i].date.split('-')
            console.log('1:',i)
            month2 = parseInt(month2)
            year2= parseInt(year2)
            let difference = (year2 - year) * 12 + (month2 - month) - 1
            let [startYear, startMonth] = [year, month] 
            console.log('2:',i)
            console.log('difference:',difference)
            while(difference > 0) {
                difference--
                let tempMonth = startMonth + 1
                let tempYear = startYear
                
                if(tempMonth > 12) {
                    tempYear = tempYear + 1
                    tempMonth = 1
                }
                console.log('tempYear-tempMonth',`${tempYear}-${tempMonth}`)
                emptyItems.push({
                    number: 0,
                    amount: 0,
                    date: `${tempYear}-${tempMonth > 10? tempMonth : `0${tempMonth}`}`
                })
    
                startYear = tempYear 
                startMonth = tempMonth
            }
            year = year2
            month = month2
            console.log(i,'--,',year, month)
        }
    }

    
    // [].concat
    ctx.body = response(true, _.sortBy(data.concat(emptyItems), 'date'), "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const styleRank = async (ctx, next) => {
  try {
    const { startDate, endDate } = ctx.request.query;
    const match = {};
    const currentUser = await getCurrentUser(ctx);
    let ownerData = await User.find({
        owner: currentUser._id,
        // isDel: 0,
      });
    if(ownerData){
        match.user = {
            $in: ownerData.map(x => x._id)
        }
    }
    if (startDate) {
      match.createdAt = {
        $gt: new Date(startDate),
        $lt: new Date(endDate),
      };
    }
    const data = await Order.aggregate([
      {
        $match: match,
      },
      {
        $unwind: "$orderData",
      },
      {
        $group: {
          _id: "$orderData.styleNos",
          number: { $sum: "$sumCount" },
          amount: {
            $sum: "$sumPrice",
          },
        },
      },
      {
        $project: {
          _id: 0,
          styleNos: "$_id",
          amount: 1,
          number: 1
        },
      },
      { $sort: { amount : 1 } }
    ]);
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const userRank = async (ctx, next) => {
  try {
    const { startDate, endDate } = ctx.request.query;
    const currentUser = await getCurrentUser(ctx);
    const match = {}
    let ownerData = await User.find({
        owner: currentUser._id,
        // isDel: 0,
      });
    if(ownerData){
        match.user = {
            $in: ownerData.map(x => x._id)
        }
    }
    if (startDate) {
      match.createdAt = {
        $gt: new Date(startDate),
        $lt: new Date(endDate),
      };
    }
    const data = await Order.aggregate([
      {
        $match: match,
      },
      {
        $unwind: "$orderData",
      },
      {
        $group: {
          _id: "$user",
          number: { $sum: "$sumCount" },
          amount: {
            $sum: "$sumPrice",
          },
        },
      },
      {
        $project: {
          _id: 0,
          user: "$_id",
          amount: 1,
          number: 1
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          user: "$userInfo.name",
          userInfo: 1,
          amount: 1,
          number: 1
        },
      },
      { $sort: { amount : 1 } }
    ]);
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const capsuleRank = async (ctx, next) => {
    try {
      const { startDate, endDate } = ctx.request.query;
      const currentUser = await getCurrentUser(ctx);
      const match = {}
      let ownerData = await User.find({
          owner: currentUser._id,
          // isDel: 0,
        });
      if(ownerData){
          match.user = {
              $in: ownerData.map(x => x._id)
          }
      }
      if (startDate) {
        match.createdAt = {
          $gt: new Date(startDate),
          $lt: new Date(endDate),
        };
      }
      const data = await Order.aggregate([
        {
          $match: match,
        },
        {
          $unwind: "$orderData",
        },
        {
          $group: {
            _id: "$capsuleId",
            number: { $sum: "$sumCount" },
            amount: {
              $sum: "$sumPrice",
            },
          },
        },
        {
          $project: {
            _id: 0,
            capsuleId: "$_id",
            amount: 1,
            number: 1
          },
        },
        {
          $lookup: {
            from: "capsules",
            localField: "capsuleId",
            foreignField: "_id",
            as: "capsuleInfo",
          },
        },
        {
          $unwind: "$capsuleInfo",
        },
        {
          $project: {
            capsuleNamecn: "$capsuleInfo.namecn",
            capsuleNameen: "$capsuleInfo.nameen",
            amount: 1,
            number: 1,
            capsuleId: 1,
          },
        },
      ]);
      ctx.body = response(true, data, "成功");
    } catch (err) {
      ctx.body = response(false, null, err.message);
    }
  };

export const del = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;
    const data = await Order.findById({ _id });
    if (data.isSend === 1) {
      await Order.findByIdAndUpdate({ _id }, { isDel: 1 });
    } else {
      await Order.findByIdAndDelete({ _id });
    }
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const send = async (ctx, next) => {
  try {
    const { list } = ctx.request.body;

    let date = moment().format("YYYYMMDD");

    // body.orderNo = orderNo
    // body.date = date
    if (list.length < 1) return;
    let now = await Order.findById({ _id: list[0] });
    let total = (await Order.find({ date })).length + 1;
    let length = (total + "").length;
    let zero = new Array(4 - length).fill(0).join("");
    let orderNo = `MM${date}${zero}${total}`;
    now.isSend = 1;
    now.date = date;
    now.orderNo = `${now.orderGoodNo}-${orderNo}`;
    for (let i = 1; i < list.length; i++) {
      let other = await Order.findById({ _id: list[i] });
      now.orderData.push(...other.orderData);
      await Order.findByIdAndDelete({ _id: list[i] });
    }
    await now.save();
    // const data = await Order.updateMany(
    // 	{
    // 		_id: {
    // 			$in: list
    // 		}
    // 	},
    // 	{
    // 		$set: {
    // 			isSend: 1
    // 		}
    // 	}
    // )
    const res = await System.find();
    console.log(res[0]);
    const { email } = res[0];
    if (!email) {
      ctx.body = response(false, {}, "邮箱不存在");
      return;
    }
    let hrefs = "";
    list.map(
      (x) =>
        (hrefs += `<h3><a href="https://we-idesign.com/download?id=${x}">订单链接</a></h3>`)
    );
    const html = `<div><h1>您有新的订单<h1/>${hrefs}</div>`;
    Mail(html, email);

    ctx.body = response(true, {}, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

const writeFile = (json) => {
  var xls = json2xls(json);
  let relativePath = "xlsx/data.xlsx";
  let absPath = path.join(__dirname, "../public/" + relativePath);
  fs.writeFileSync(absPath, xls, "binary");
  return relativePath;
};

export const download = async (ctx, next) => {
  console.log("download");
  const baseUrl = "https://we-idesign.com";
  try {
    const { _id, rateSign = "¥", rateVal = 1 } = ctx.request.query;
    const order = await Order.findById({ _id })
      .populate({
        path: "orderData.items.favorite",
        populate: "styleAndColor.styleId styleAndColor.colorIds",
      })
      .populate("user")
      .populate("orderData.size")
      .lean();
    let maxSize = 1;
    order.orderData.map((o) => {
      let itemMax = _.maxBy(o.items, (i) => i.sizeInfo.length);
      maxSize =
        maxSize > itemMax.sizeInfo.length ? maxSize : itemMax.sizeInfo.length;
    });
    console.log("maxSize", maxSize);
    // Create a new instance of a Workbook class
    let wb = new xl.Workbook();

    // Add Worksheets to the workbook
    let ws = wb.addWorksheet("Sheet 1");

    const headerStyle = wb.createStyle({
      fill: {
        type: "pattern",
        bgColor: "#fff0e5",
        fgColor: "#fff0e5",
        patternType: "solid",
      },
    });
    const deepStyle = wb.createStyle({
      fill: {
        type: "pattern",
        bgColor: "#cccccc",
        patternType: "solid",
        fgColor: "#cccccc",
      },
    });

    let orderUser = `下单人：${order.user.name}(账号：${order.user.account})`;
    ws.cell(1, 1, 1, 9 + maxSize, true).string(orderUser);
    // Head
    let row = 2;

    ws.cell(row, 1).string("").style(headerStyle);
    ws.cell(row, 2).string("样衣编号").style(headerStyle);
    ws.cell(row, 3).string("颜色").style(headerStyle);
    ws.cell(row, 4).string("款式图").style(headerStyle);
    ws.cell(row, 5, row, 4 + maxSize, true)
      .string("尺码/配比")
      .style(headerStyle);
    ws.cell(row, 5 + maxSize)
      .string("中包数")
      .style(headerStyle);
    ws.cell(row, 6 + maxSize)
      .string("箱数")
      .style(headerStyle);
    ws.cell(row, 7 + maxSize)
      .string("件数")
      .style(headerStyle);
    ws.cell(row, 8 + maxSize)
      .string(`单价/${rateSign}`)
      .style(headerStyle);
    ws.cell(row, 9 + maxSize)
      .string(`总价/${rateSign}`)
      .style(headerStyle);
    let styleCount = 1;
    order.orderData.map((groupData) => {
      // Insert Size
      row++;
      groupData.size.values.map((v, vIndex) => {
        ws.cell(row, 5 + vIndex).string(v.name);
        ws.cell(row, 1, row, 9 + maxSize).style(deepStyle);
      });
      const itemsLength = groupData.items.length;

      groupData.items.map((item, itemIndex) => {
        row++;
        let styleNos = item.favorite.styleAndColor
          .map((x) => x.styleId.styleNo)
          .toString();

        let colorCodes = item.favorite.styleAndColor
          .map((x) => x.colorIds.map((c) => c.code))
        colorCodes = _.difference(_.flattenDeep(colorCodes))
        console.log("colorCodes", colorCodes);
        ws.cell(row, 1).number(styleCount++);
        ws.cell(row, 2).string(styleNos);
        ws.cell(row, 3).string(colorCodes.join('/'));
        ws.cell(row, 4).link(
          `${baseUrl}/demo?id=${item.favorite._id}&rid=${order._id}`,
          "款式图"
        );
        let allSizeSum = 0;

        item.sizeInfo.map((v, index) => {
          ws.cell(row, 5 + index).number(v);
          allSizeSum += v;
        });
        let allSum = allSizeSum * groupData.cnts * groupData.packageCount;
        if (itemIndex < 1) {
          ws.cell(
            row,
            5 + maxSize,
            row + itemsLength - 1,
            5 + maxSize,
            true
          ).number(groupData.packageCount);
          ws.cell(
            row,
            6 + maxSize,
            row + itemsLength - 1,
            6 + maxSize,
            true
          ).number(groupData.cnts);
        }

        ws.cell(row, 7 + maxSize).number(allSum);

        let piecePrice = 0;
        let prices = item.favorite.styleAndColor.map((x) => {
          let signal = (x.styleId.price * rateVal).toFixed(2);
          piecePrice += x.styleId.price;
          return signal;
        });

        let pricesStr = prices.toString();
        let pricesAllOrice = (piecePrice * allSum * rateVal).toFixed(2);
        ws.cell(row, 8 + maxSize).string(pricesStr);
        ws.cell(row, 9 + maxSize).string(pricesAllOrice);
      });
    });
    // ws.cell(1, 1, 1, 9 + maxSize, true).string(
    // 	`下单人：${order.user.name}(账号：${order.user.account})`
    // )
    let date = new Date();
    let timeString = date.getTime();
    // const relativePath = writeFile(json)
    let buffer = await wb.writeToBuffer();
    let downloadPath = path.join(
      __dirname,
      "../public/xlsx" + `/${order.orderNo}-${timeString}.xlsx`
    );
    let orderFilePath = path.join(__dirname, "../public/xlsx");
    let isExist = fs.existsSync(orderFilePath);
    if (!isExist) {
      fs.mkdirSync(orderFilePath);
    }
    console.log("xlsx isExist", isExist);
    fs.writeFileSync(downloadPath, buffer, "binary");
    // koaSend(ctx, `xlsx/${order.orderNo}.xlsx`)

    ctx.body = response(true, {
      url: `xlsx/${order.orderNo}-${timeString}.xlsx`,
    });
  } catch (err) {
    console.error(err);
    ctx.body = response(false, null, err.message);
  }
};

export const postDownload = async (ctx, next) => {
  try {
    const { _id, orderItemImages } = ctx.request.body;
    const order = await Order.findById({ _id })
      .populate({
        path: "orderData.items.capsuleStyle",
      })
      .populate("user")
      .lean();

    // console.log("orderItemImages", orderItemImages)
    // Create a new instance of a Workbook class
    let wb = new xl.Workbook();

    // Add Worksheets to the workbook
    let ws = wb.addWorksheet("Sheet 1");

    const headerStyle = wb.createStyle({
      fill: {
        type: "pattern",
        bgColor: "#fff0e5",
        fgColor: "#fff0e5",
        patternType: "solid",
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    });
    const deepStyle = wb.createStyle({
      fill: {
        type: "pattern",
        bgColor: "#cccccc",
        patternType: "solid",
        fgColor: "#cccccc",
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    });

    const centerStyle = wb.createStyle({
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    });

    // Head
    let row = 1;

    let maxSize = 2;
    order.orderData.map((o) => {
      console.log(o.size, "size");
      let sizeArr = [];
      if (o.size) {
        sizeArr = o.size.split("/");
        let itemMax = sizeArr.length;
        console.log(itemMax, "itemMax");
        maxSize = maxSize > itemMax ? maxSize : itemMax;
      }
    });
    maxSize = maxSize - 1;
    console.log("maxSize", maxSize);
    let productCols = 3;

    ws.column(1).setWidth(16);
    ws.column(2).setWidth(16);
    ws.column(3).setWidth(16);
    ws.column(4).setWidth(16);
    ws.cell(row, 1, row, 4, true).string("产品图片").style(headerStyle);
    ws.cell(row, 2 + productCols)
      .string("订单编码")
      .style(headerStyle);
    ws.cell(row, 3 + productCols)
      .string("批注")
      .style(headerStyle);
    ws.cell(row, 4 + productCols)
      .string("款式编号")
      .style(headerStyle);
    ws.cell(row, 5 + productCols)
      .string("色号/花号")
      .style(headerStyle);
    ws.cell(row, 6 + productCols, row, 6 + productCols + maxSize, true)
      .string("尺码/数量 配比")
      .style(headerStyle);
    ws.cell(row, 7 + productCols + maxSize)
      .string("小计")
      .style(headerStyle);
    ws.cell(row, 8 + productCols + maxSize)
      .string("份数")
      .style(headerStyle);
    ws.cell(row, 9 + productCols + maxSize)
      .string("总数")
      .style(headerStyle);
    ws.cell(row, 10 + productCols + maxSize)
      .string("单价")
      .style(headerStyle);
    ws.cell(row, 11 + productCols + maxSize)
      .string("总数量")
      .style(headerStyle);
    ws.cell(row, 12 + productCols + maxSize)
      .string("总金额")
      .style(headerStyle);
    ws.cell(row, 13 + productCols + maxSize)
      .string("箱数(大约)")
      .style(headerStyle);

    for (let i = 0; i < order.orderData.length; i++) {
      let groupData = order.orderData[i];
      let imgUrls = orderItemImages[i];

      //尺码行
      row++;
      ws.cell(row, 1, row, 13 + productCols + maxSize).style(deepStyle);
      let sizeArr = groupData.size ? groupData.size.split("/") : [];
      for (let k = 0; k < sizeArr.length; k++) {
        ws.cell(row, 6 + productCols + k).string(sizeArr[k]);
      }
      //包装方式
      if (groupData.pickType) {
        ws.cell(
          row,
          7 + productCols + maxSize,
          row,
          9 + productCols + maxSize,
          true
        ).string(pickInfos[groupData.pickType.val].label);
      }
      //产品图
      let j = 0;
      let imgRow = 0;
      row++;
      for (j = 0; j < imgUrls.length; j++) {
        // let rowNum = 1;
        for (let k = 0; k < imgUrls[j].length; k++) {
          let productImgUrl = `${baseImgUrl}${imgUrls[j][k]}?tr=w-100,h-100,cm-pad_resize`;
          let opts = {
            url: productImgUrl,
            encoding: null,
          };
          let r1 = await downImg(opts);
          imgRow = row + Math.floor(j / 4) * 5 + k * 5;
          ws.addImage({
            image: r1,
            type: "picture",
            position: {
              type: "oneCellAnchor",
              from: {
                col: (j % 4) + 1,
                row: imgRow,
              },
            },
          });
        }
      }
      //批注
      ws.cell(row, 3 + productCols, imgRow + 4, 3 + productCols, true).string(
        groupData.rowRemarks
      );
      //款号
      ws.cell(row, 4 + productCols).string(groupData.styleNos);

      //花号、色号；尺码配比；小计；份数
      for (let k = 0; k < groupData.items.length; k++) {
        const item = groupData.items[k];
        let itemRow = row + k;
        const { sizeInfoObject, total, parte } = item;
        sizeArr.map((s, i) => {
          let sizeCol = 6 + productCols + i;
          ws.cell(itemRow, sizeCol).number(sizeInfoObject[s]);
        });
        console.log("groupData.pickType.val == 1", groupData.pickType.val);
        ws.cell(itemRow, 7 + productCols + maxSize).number(total);
        ws.cell(itemRow, 8 + productCols + maxSize).number(
          groupData.pickType.pieceCount
        );
        ws.cell(itemRow, 9 + productCols + maxSize).number(
          total * groupData.pickType.pieceCount
        );
        ws.cell(itemRow, 10 + productCols + maxSize).number(groupData.price);
      }

      ws.cell(imgRow + 4, 7 + productCols + maxSize).number(
        groupData.pickType.pieceCount
          ? groupData.rowTotal / groupData.pickType.pieceCount
          : 0
      );
      // ws.cell(imgRow + 4, 8 + productCols + maxSize).number(
      //   groupData.pickType.pieceCount
      // );
      // ws.cell(imgRow + 4, 9 + productCols + maxSize).number(
      //   groupData.rowTotal
      // );
      // ws.cell(imgRow + 4, 10 + productCols + maxSize,imgRow + 4,
      //     11 + productCols + maxSize,
      //     true).number(groupData.price);
      //   }

      ws.cell(
        row,
        11 + productCols + maxSize,
        imgRow + 4,
        11 + productCols + maxSize,
        true
      ).number(groupData.rowTotal);

      ws.cell(
        row,
        12 + productCols + maxSize,
        imgRow + 4,
        12 + productCols + maxSize,
        true
      ).number(groupData.rowTotalPrice);

      ws.cell(
        row,
        13 + productCols + maxSize,
        imgRow + 4,
        13 + productCols + maxSize,
        true
      ).number(groupData.aboutCases ? groupData.aboutCases : 0);
      //包装方式
      if (groupData.pickType) {
        ws.cell(
          row,
          14 + productCols + maxSize,
          imgRow + 4,
          14 + productCols + maxSize,
          true
        ).string(pickInfos[groupData.pickType.val].label);
      }
      row = imgRow + 4;
      //   ws.cell(itemRow, 13 + productCols + maxSize).number(groupData.price);
    }

    let date = new Date();
    let timeString = date.getTime();
    // const relativePath = writeFile(json)
    let buffer = await wb.writeToBuffer();
    let downloadPath = path.join(
      __dirname,
      "../public/xlsx" + `/${order.orderNo}-${timeString}.xlsx`
    );
    let orderFilePath = path.join(__dirname, "../public/xlsx");
    let isExist = fs.existsSync(orderFilePath);
    if (!isExist) {
      fs.mkdirSync(orderFilePath);
    }
    // console.log("xlsx isExist", isExist)
    fs.writeFileSync(downloadPath, buffer, "binary");
    // koaSend(ctx, `xlsx/${order.orderNo}.xlsx`)

    ctx.body = response(true, {
      url: `xlsx/${order.orderNo}-${timeString}.xlsx`,
    });

    // orderItemImages
  } catch (err) {
    console.error(err);
    ctx.body = response(false, null, err.message);
  }
};
