import fs from "fs";
import json2xls from "json2xls";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";
// import Channel from "../models/channel"
import config from "../config";
import CapsuleOrder from "../models/capsule-order";
import Favorite from "../models/favorite";
import Order from "../models/order";
import ShopOrder from "../models/shop-order";
import System from "../models/system";
import User from "../models/user";
import { response } from "../utils";
import Mail from "../utils/mail";

/**
 * 获取token中的值
 * @param {*} token
 */
const verify = (token) => jwt.verify(token.split(" ")[1], config.secret);

export const login = async (ctx, next) => {
  
  const { account, password } = ctx.request.body;
  try {
    // let list = await User.find()
    // console.log(list)
    const data = await User.findOne({ account, password }).lean();
    if (!data) {
      ctx.body = response(false, null, "用户名或密码错误");
    } else {
      let token = jwt.sign(account, config.secret);

      ctx.body = response(true, { ...data, token });
    }
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

/**
 * 兼容其他需要获取当前用户信息的地方，使用promise处理
 */
export const getCurrentUser = (ctx, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      const account = ctx.headers ? verify(ctx.headers.authorization) : false;
      const data = account ? await User.findOne({ account }) : {};
      // .populate({
      // 	path: "channels",
      // 	select: "-styles"
      // })
      if (data && data.role === 3) {
        // let res = await Channel.findById({ _id: data.channels[0] })
        // if (res && res.currency) {
        // 	data.currency = res.currency
        // }
      }

      ctx.body = response(true, data);
      resolve(data);
    } catch (err) {
      ctx.body = response(false, null, err.message);
      reject(err);
    }
  });
};

export const getCurrentUserDetail = (ctx, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      const account = verify(ctx.headers.authorization);
      const data = await User.findOne({ account }).populate({
        path: "channels",
        // select: "-styles"
      });

      resolve(data);
    } catch (err) {
      ctx.body = response(false, null, err.message);
      reject(err);
    }
  });
};

export const getUserChannels = (ctx, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { account, channels, _id } = await getCurrentUser(ctx);
      const data = await User.findOne({ account })
        .populate({
          path: "channels",
          select: "-styles",
        })
        .lean();

      const users = await User.find({
        channels: {
          $in: channels,
        },
        role: 3,
        _id: {
          $ne: _id,
        },
      }).populate({
        path: "channels",
        select: "-styles",
      });
      data.users = users;

      ctx.body = response(true, data);
      resolve(data);
    } catch (err) {
      ctx.body = response(false, null, err.message);
      reject(err);
    }
  });
};

export const add = async (ctx, next) => {
  try {
    let { password = "123456", ...others } = ctx.request.body;
    const { role, _id } = await getCurrentUser(ctx);
    let userRole = 1;
    switch (role) {
      case 1:
        userRole = 3;
        break;
      case 3:
        userRole = 4;
        break;
      default: {
        userRole = 1;
        others = {
          ...others,
          businessUserd: true,
          channelEmpowerUserd: true,
          innerDataUserd: true,
        };
      }
    }
    let user = new User({
      role: userRole,
      owner: _id,
      password,
      ...others,
      // channels: {
      // 	cid: channels.split(","),
      // 	size: 10
      // }
    });
    let data = await user.save();
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const update = async (ctx, next) => {
  try {
    const { _id, ...others } = ctx.request.body;
    let data = await User.findByIdAndUpdate(
      { _id },
      others
      // {
      // 	$addToSet: {
      // 		products: productId
      // 	}
      // }
    );

    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const updateUsers = async (ctx, next) => {
  try {
    const { ids, ...others } = ctx.request.body;

    let data = await User.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      others
    );

    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

/**
 * 注意对数组形式的字段进行查询的处理
 */
export const getList = async (ctx, next) => {
  try {
    const { role, page = 1, limit = 20 } = ctx.request.query;
    let q = {};
    if (typeof role !== "undefined") {
      q.role = role;
    }
    let data = await User.paginate(q, {
      page,
      limit: parseInt(limit),
    });
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getOwnList = async (ctx, next) => {
  try {
    const { search = "" } = ctx.request.query;
    const currentUser = await getCurrentUser(ctx);
    let data = await User.find({
      owner: currentUser._id,
      isDel: 0,
      name: {
        $regex: new RegExp(search, "i"),
      },
    });
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getOwnUnReadedOrder = async (ctx, next) => {
  try {
    const { userId, timeRange, selectedUsers, queryKey } = ctx.request.query;
    const currentUser = await getCurrentUser(ctx);
    const q = {
      isDel: 0,
      isReaded: 0,
    };
    const users = await User.find({ owner: currentUser._id });
    console.log("users", users);
    q.user = {
      $in: users.map((x) => x._id),
    };

    let order = await Order.find({ ...q, isSend: 1 });
    let capsuleOrder = await CapsuleOrder.find({
      ...q,
      isSend: 1,
    });
    let shopOrder = await ShopOrder.find({ ...q });
    ctx.body = response(true, {
      order,
      capsuleOrder,
      shopOrder,
    });
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getOwnOrderList = async (ctx, next) => {
  try {
    const {
      userId,
      timeRange,
      selectedUsers,
      queryKey,
      isMerge,
      isReaded,
    } = ctx.request.query;
    const currentUser = await getCurrentUser(ctx);
    const q = {
      isDel: 0,
    };
    if (typeof isMerge !== "undefined") {
      q.isMerge = parseInt(isMerge);
    }

    if (typeof isReaded !== "undefined") {
      q.isReaded = parseInt(isReaded);
    }
    if (queryKey) {
      q.orderNo = {
        $regex: new RegExp(queryKey, "i"),
      };
    }
    if (timeRange) {
      q.createdAt = {
        $gt: new Date(timeRange[0]).toISOString(),
        $lt: new Date(timeRange[1]).toISOString(),
      };
    }
    // 查询特定用户的订单
    if (userId) {
      q.user = mongoose.Types.ObjectId(userId);
    } else {
      // 查询属于当前用户的用户订单
      if (selectedUsers) {
        // 特定用户
        q.user = {
          $in: selectedUsers,
        };
      } else {
        //所有用户
        const users = await User.find({ owner: currentUser._id });
        q.user = {
          $in: users.map((x) => x._id),
        };
      }
    }

    let order = await Order.find({ ...q, isSend: 1 })
      .populate({
        path: "orderData.items.favorite",
        populate: "styleAndColor.styleId styleAndColor.colorIds",
      })
      .populate("user")
      .populate();
    let capsuleOrder = await CapsuleOrder.find({ ...q, isSend: 1 }).populate();
    let shopOrder = await ShopOrder.find(q).populate();
    ctx.body = response(true, {
      order,
      capsuleOrder,
      shopOrder,
    });
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const delOwnOrder = async (ctx, next) => {
  try {
    const { _id, orderType, ids } = ctx.request.body;
    const OrderType = {
      order: Order,
      shop: ShopOrder,
      capsule: CapsuleOrder,
    };
    if (ids) {
      let data = await Order.updateMany(
        {
          _id: {
            $in: ids,
          },
        },
        {
          isDel: 1,
        }
      );
      data = await ShopOrder.updateMany(
        {
          _id: {
            $in: ids,
          },
        },
        {
          isDel: 1,
        }
      );
      data = await CapsuleOrder.updateMany(
        {
          _id: {
            $in: ids,
          },
        },
        {
          isDel: 1,
        }
      );
      ctx.body = response(true, data);
    } else {
      const data = await OrderType[orderType].findByIdAndUpdate(
        { _id },
        {
          isDel: 1,
        }
      );
      ctx.body = response(true, data);
    }
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const delOwnUser = async (ctx, next) => {
  try {
    const { ids } = ctx.request.body;
    let data = await User.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        isDel: 1,
      }
    );
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const addFavorite = async (ctx, next) => {
  try {
    const { styleAndColor, goodId, goodCategory } = ctx.request.body;
    const currentUser = await getCurrentUser(ctx);
    const favorite = new Favorite({
      user: currentUser._id,
      styleAndColor,
      goodId,
      goodCategory,
    });
    let data = await favorite.save();
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};
export const addFavorites = async (ctx, next) => {
  try {
    const { favorites } = ctx.request.body;
    const data = await Favorite.insertMany(favorites);
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const addSelectFavorite = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;
    const currentUser = await getCurrentUser(ctx);
    const favorite = await Favorite.findById({ _id });
    await User.findByIdAndUpdate(
      {
        _id: currentUser._id,
      },
      {
        selectFavorites: (currentUser.selectFavorites || []).concat(_id),
      }
    );
    const newFav = new Favorite({
      user: currentUser._id,
      styleAndColor: favorite.styleAndColor,
      extend: _id,
    });
    let data = await newFav.save();
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const deleteSelectFavorite = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;

    let data = await Favorite.findByIdAndDelete({ _id });
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getMySelectFavorite = async (ctx, next) => {
  try {
    const currentUser = await getCurrentUser(ctx);

    const data = await Favorite.find({
      _id: {
        $in: currentUser.selectFavorites,
      },
    }).select("_id");
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const updateFavorite = async (ctx, next) => {
  try {
    const { _id, ...props } = ctx.request.body;
    const currentUser = await getCurrentUser(ctx);
    await Favorite.findByIdAndUpdate(
      {
        _id,
      },
      {
        $set: {
          isDel: 1,
        },
      }
    );

    const favorite = new Favorite({
      user: currentUser._id,
      ...props,
    });
    let data = await favorite.save();

    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const deleteFavorite = async (ctx, next) => {
  try {
    const { _id,ids } = ctx.request.body;
    let data = null
    if (ids) {
        data = await Favorite.updateMany(
          {
            _id: {
              $in: ids,
            },
          },
          {
            $set: {
              isDel: 1,
            },
          }
        );
      } else {
        data = await Favorite.findByIdAndUpdate(
            {
              _id,
            },
            {
              $set: {
                isDel: 1,
              },
            }
          );
      }


    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getFavoriteList = async (ctx, next) => {
  try {
    const { goodsId } = ctx.request.query;
    const currentUser = await getCurrentUser(ctx);
    let data = await Favorite.find({
      user: currentUser._id,
      goodId: goodsId,
      isDel: 0,
    })
      .sort({ createTime: -1 })
      .populate({
        path: "styleAndColor.style",
        model: "style",
        populate: {
          path: "plainColors.colorId flowerColors.colorId",
        },
      })
      .populate("styleAndColor.colorIds")
      // .lean()
      .exec();
    // data = data.toJSON()
    data = JSON.parse(JSON.stringify(data));

    if (goodsId) {
      console.log("goodsId", goodsId);
      data = data.filter((x) =>
        x.styleAndColor.some((y) => y.style.goodsId.indexOf(goodsId) >= 0)
      );
    }

    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const selectFavoriteList = async (ctx, next) => {
  try {
    const currentUser = await getCurrentUser(ctx);
    const users = await User.find({
      channels: {
        $in: currentUser.channels,
      },
      _id: {
        $ne: currentUser._id,
      },
    });
    let uids = [];
    users.map((x) => uids.push(x._id));
    // let channels = []
    // console.log(currentUser.channels, "currentUser channels")
    // users.map(x => channels.push(x.channels))
    // console.log("uids--", uids, channels)
    let data = await Favorite.find({
      user: {
        $in: uids,
      },
      isDel: 0,
    })
      .populate({
        path: "styleAndColor.style",
        model: "style",
        populate: {
          path: "plainColors.colorId flowerColors.colorId size",
        },
      })
      .populate("styleAndColor.colorIds")
      // .lean()
      .exec();
    // data = data.toJSON()
    data = JSON.parse(JSON.stringify(data));

    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const updateMany = async (ctx, next) => {
  try {
    let data = await Favorite.updateMany(
      {},
      {
        isDel: 0,
      }
    );
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const deleteById = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;
    let data = await User.remove({ _id });
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const feedback = async (ctx, next) => {
  try {
    const { body } = ctx.request;
    const res = await System.find();
    const { email } = res[0];
    if (!email) {
      ctx.body = response(false, {}, "邮箱不存在");
      return;
    }
    let html = "";
    const keys = Object.keys(body);
    keys.map((x) => (html += `<div>${body[x]}</div>`));

    Mail(html, email);
    ctx.body = response(true, {});
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

const writeFile = (json) => {
  var xls = json2xls(json);
  let relativePath = "xlsx/客户数据.xlsx";
  let absPath = path.join(__dirname, "../public/" + relativePath);
  fs.writeFileSync(absPath, xls, "binary");
  return relativePath;
};
export const download = async (ctx, next) => {
  try {
    const data = await User.find({ role: 3 });
    // const channels = await Channel.find()
    const json = data.map((x) => ({
      账号: x.account,
      姓名: x.name,
      密码: x.password,
      邮箱: x.email,
      联系人: x.contact,
      电话: x.phone,
      税号: x.dutyparagraph,
      所属通道: "",
      地址: `${x.countries}-${x.address}(${x.postcode})`,
      托运地址: `${x.shippingcountries}-${x.shippingaddress}(${x.shippingpostcode})`,
      备注: x.remark,

      // channel: x.channels[0]
      // contact: x.contact,
    }));
    const relativePath = writeFile(json);

    ctx.body = response(true, {
      url: relativePath,
      channels: [],
    });
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

// 修改密码
export const changePwd = async (ctx, next) => {
  try {
    const { password, _id } = await getCurrentUser(ctx);
    const { body } = ctx.request;
    if (body.password === password) {
      await User.findByIdAndUpdate(
        {
          _id,
        },
        {
          password: body.newPwd,
        }
      );
      ctx.body = response(true, {});
    } else {
      ctx.body = response(false, null, "旧密码不正确");
    }
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};
