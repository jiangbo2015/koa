import xl from "excel4node";
import fs from "fs";
import fse from "fs-extra";
import _ from "lodash";
import moment from "moment";
import path from "path";
import Order from "../models/shop-order";
import User from "../models/user";
import { response } from "../utils";
// import dataURL2Blob from "../utils/dataURL2Blob"
import { getCurrentUser } from "./user";

export const add = async (ctx, next) => {
  try {
    const currentUser = await getCurrentUser(ctx);
    const body = ctx.request.body;
    body.user = currentUser._id;
    let date = moment().format("YYYYMMDD");
    body.date = date;
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
    const q = {
      //   user: mongoose.Types.ObjectId(currentUser._id),
      user: currentUser._id,
      isDel: 0
    };
    const data = await Order.find(q)
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("shopStyle")
      .lean();

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getList = async (ctx, next) => {
  try {
    const { userId } = ctx.request.query;
    let q = {
      isDel: 0
    };
    if (userId) {
      q.user = userId;
    }

    let data = await Order.find(q)
      .sort({ createdAt: -1 })
      .populate("shopStyle")
      .populate("user");

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
      isDel: 0
    };
    let data = {};

    if (orderNo) {
      q._id = orderNo;
      await Order.find(q)
        .sort({ createdAt: -1 })
        .populate("user");
    } else {
      if (userName) {
        const res = await User.findOne({
          name: userName
        });
        q.user = res ? res._id : null;
      }
      data = await Order.find(q)
        .sort({ createdAt: -1 })
        .populate("user");
    }

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const detail = async (ctx, next) => {
  try {
    const { _id } = ctx.request.query;
    const data = await Order.findById({ _id })
      .populate("user")
      .populate("shopStyle")
      .lean();
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

export const download = async (ctx, next) => {
  console.log("download");
  const baseUrl = "https://we-idesign.com";
  try {
    const { _id, rateSign = "¥", rateVal = 1 } = ctx.request.query;
    const order = await Order.findById({ _id })
      .populate({
        path: "orderData.items.favorite",
        populate: "styleAndColor.styleId styleAndColor.colorIds"
      })
      .populate("user")
      .populate("orderData.size")
      .lean();
    let maxSize = 1;
    order.orderData.map(o => {
      let itemMax = _.maxBy(o.items, i => i.sizeInfo.length);
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
        patternType: "solid"
      }
    });
    const deepStyle = wb.createStyle({
      fill: {
        type: "pattern",
        bgColor: "#cccccc",
        patternType: "solid",
        fgColor: "#cccccc"
      }
    });

    let orderUser = `下单人：${order.user.name}(账号：${order.user.account})`;
    ws.cell(1, 1, 1, 9 + maxSize, true).string(orderUser);
    // Head
    let row = 2;

    ws.cell(row, 1)
      .string("")
      .style(headerStyle);
    ws.cell(row, 2)
      .string("样衣编号")
      .style(headerStyle);
    ws.cell(row, 3)
      .string("颜色")
      .style(headerStyle);
    ws.cell(row, 4)
      .string("款式图")
      .style(headerStyle);
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
    order.orderData.map(groupData => {
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
          .map(x => x.styleId.styleNo)
          .toString();

        let colorCodes = item.favorite.styleAndColor
          .map(x => x.colorIds.map(c => c.code).toString())
          .toString();
        console.log("colorCodes", colorCodes);
        ws.cell(row, 1).number(styleCount++);
        ws.cell(row, 2).string(styleNos);
        ws.cell(row, 3).string(colorCodes);
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
        let prices = item.favorite.styleAndColor.map(x => {
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
      url: `xlsx/${order.orderNo}-${timeString}.xlsx`
    });
  } catch (err) {
    console.error(err);
    ctx.body = response(false, null, err.message);
  }
};

export const postDownload = async (ctx, next) => {
  console.log("download");
  const baseUrl = "https://we-idesign.com";
  try {
    const {
      _id,
      rateSign = "¥",
      rateVal = 1,
      orderItemImages
    } = ctx.request.body;
    const order = await Order.findById({ _id })
      .populate({
        path: "orderData.items.favorite",
        populate: "styleAndColor.styleId styleAndColor.colorIds"
      })
      .populate("user")
      .populate("orderData.size")
      .lean();
    let maxSize = 1;
    order.orderData.map(o => {
      let itemMax = _.maxBy(o.items, i => i.sizeInfo.length);
      maxSize =
        maxSize > itemMax.sizeInfo.length ? maxSize : itemMax.sizeInfo.length;
    });
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
        patternType: "solid"
      },
      alignment: {
        horizontal: "center",
        vertical: "center"
      }
    });
    const deepStyle = wb.createStyle({
      fill: {
        type: "pattern",
        bgColor: "#cccccc",
        patternType: "solid",
        fgColor: "#cccccc"
      },
      alignment: {
        horizontal: "center",
        vertical: "center"
      }
    });

    const centerStyle = wb.createStyle({
      alignment: {
        horizontal: "center",
        vertical: "center"
      }
    });

    let orderUser = `下单人：${order.user.name}(账号：${order.user.account})`;
    ws.cell(1, 1, 1, 9 + maxSize, true)
      .string(orderUser)
      .style(centerStyle);
    // Head
    let row = 2;

    ws.cell(row, 1)
      .string("")
      .style(headerStyle);
    ws.cell(row, 2)
      .string("样衣编号")
      .style(headerStyle);
    ws.cell(row, 3)
      .string("颜色")
      .style(headerStyle);
    ws.cell(row, 4)
      .string("款式图")
      .style(headerStyle);
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
    order.orderData.map(groupData => {
      // Insert Size
      row++;
      groupData.size.values.map((v, vIndex) => {
        ws.cell(row, 5 + vIndex)
          .string(v.name)
          .style(centerStyle);
        ws.cell(row, 1, row, 9 + maxSize).style(deepStyle);
      });
      const itemsLength = groupData.items.length;

      groupData.items.map((item, itemIndex) => {
        row++;

        let styleNos = item.favorite.styleAndColor
          .map(x => x.styleId.styleNo)
          .toString();

        let colorCodes = item.favorite.styleAndColor
          .map(x => x.colorIds.map(c => c.code).join("\n "))
          .toString();
        // console.log("colorCodes", colorCodes)
        ws.cell(row, 1)
          .number(styleCount++)
          .style(centerStyle);
        ws.cell(row, 2)
          .string(styleNos)
          .style(centerStyle);
        ws.cell(row, 3)
          .string(colorCodes)
          .style(centerStyle);
        ws.cell(row, 4).style(centerStyle);
        ws.column(4).setWidth(18);

        let imageContextHeight = 10;
        for (let i = 0; i < item.favorite.styleAndColor.length; i++) {
          const fsitem = item.favorite.styleAndColor[i].styleId;
          let fsId = `${item.favorite._id}-${fsitem._id}`;
          let imagePath = path.join(
            __dirname,
            "../public" + `/${orderItemImages[fsId].frontImageUrl}`
          );
          ws.addImage({
            image: fse.readFileSync(imagePath),
            type: "picture",
            position: {
              type: "oneCellAnchor",
              from: {
                col: 4,
                colOff: "0.2in",
                row,
                rowOff: `${imageContextHeight * 0.012}in`
              }
            }
          });
          imageContextHeight += parseInt(orderItemImages[fsId].frontHeight, 10);
        }
        // px 转磅
        ws.row(row).setHeight(
          ((imageContextHeight + 20 * item.favorite.styleAndColor.length) * 5) /
            7
        );

        let allSizeSum = 0;
        item.sizeInfo.map((v, index) => {
          ws.cell(row, 5 + index)
            .number(v)
            .style(centerStyle);
          allSizeSum += v;
        });
        let allSum = allSizeSum * groupData.cnts * groupData.packageCount;
        if (itemIndex < 1) {
          ws.cell(row, 5 + maxSize, row + itemsLength - 1, 5 + maxSize, true)
            .number(groupData.packageCount)
            .style(centerStyle);
          ws.cell(row, 6 + maxSize, row + itemsLength - 1, 6 + maxSize, true)
            .number(groupData.cnts)
            .style(centerStyle);
        }

        ws.cell(row, 7 + maxSize)
          .number(allSum)
          .style(centerStyle);

        let piecePrice = 0;
        let prices = item.favorite.styleAndColor.map(x => {
          let signal = (x.styleId.price * rateVal).toFixed(2);
          piecePrice += x.styleId.price;
          return signal;
        });

        let pricesStr = prices.toString();
        let pricesAllOrice = (piecePrice * allSum * rateVal).toFixed(2);
        ws.cell(row, 8 + maxSize)
          .string(pricesStr)
          .style(centerStyle);
        ws.cell(row, 9 + maxSize)
          .string(pricesAllOrice)
          .style(centerStyle);
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
    // console.log("xlsx isExist", isExist)
    fs.writeFileSync(downloadPath, buffer, "binary");
    // koaSend(ctx, `xlsx/${order.orderNo}.xlsx`)

    ctx.body = response(true, {
      url: `xlsx/${order.orderNo}-${timeString}.xlsx`
    });

    // orderItemImages
  } catch (err) {
    console.error(err);
    ctx.body = response(false, null, err.message);
  }
};
