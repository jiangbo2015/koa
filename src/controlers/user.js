import fs from "fs";
import json2xls from "json2xls";
import jwt from "jsonwebtoken";
import path from "path";
import { get } from 'lodash'
// import Channel from "../models/channel"
import config from "../config";
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
      case 1: // 产品经理创建客户账号
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
    const { role, owner } = ctx.request.query;
    let q = {};
    if (typeof role !== "undefined") {
      q.role = role;
    }
    if (typeof owner !== "undefined") {
        q.owner = owner;
      }
    let data = await User.find(q).populate(['owner','channel']) // 填充 channel 字段
    .exec();
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


export const deleteById = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;
    let data = await User.remove({ _id });
    ctx.body = response(true, data);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

const FeedbackKeyToText = {
    email: "邮箱",
    mensaje: "内容",
    name: "姓名",
    subject: "主题",
}

export const feedback = async (ctx, next) => {
  try {
    const { body } = ctx.request;
    const adminUser = await User.findOne({role: 0});
    const { email } = adminUser;
    if (!email) {
      ctx.body = response(false, {}, "邮箱不存在");
      return;
    }
    let html = "";
    const keys = Object.keys(body);
    keys.map((x) => (html += `<div>${get(FeedbackKeyToText ,x, '')}：${body[x]}</div>`));

    Mail(html, email, "来自We-idesign的访客消息");
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
