import Style from "../models/style";
import Channel from "../models/channel";
import Goods from "../models/goods";
// import User from "../models/user";
import { response } from "../utils";
import { getCurrentUser } from "./user";
import _ from "lodash";
export const add = async (ctx, next) => {
  try {
    const { body } = ctx.request;
    let style = new Style(body);
    let data = await style.save();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getList = async (ctx, next) => {
  try {
    // let { tag, styleNo } = ctx.request.query
    let {
      tag,
      styleNo,
      page = 1,
      limit = 20,
      styleIds = "",
    } = ctx.request.query;
    const currentUser = await getCurrentUser(ctx);
    let data = [];
    let q = { isDel: 0 };
    if (tag) {
      q = {
        tags: {
          $in: [tag],
        },
      };
    }
    if (styleNo) {
      q.styleNo = {
        $regex: new RegExp(styleNo, "i"),
      };
    }

    if (currentUser.role === 3) {
      // let channel = await Channel.findById({ _id: currentUser.channels[0] })
      // channel.styles.map((x) => styleIds.push(x.styleId))
      data = await Style.find({
        _id: {
          $in: styleIds.split(","),
        },

        ...q,
      });
    } else {
      data = await Style.paginate(q, {
        page,
        // 如果没有limit字段，不分页
        // limit: limit ? limit : 10000,
        limit: parseInt(limit),
        sort: {
          createdAt: -1,
        },
      });
    }

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getUserStyleList = async (ctx, next) => {
  try {
    console.log("-----cids-----", _id);
    let { tag, styleNo = "", _id } = ctx.request.query;
    let goodData = await Goods.findById({ _id }).lean();
    const currentUser = await getCurrentUser(ctx);
    let channel = currentUser.channels.find((x) => x.assignedId === _id);

    let q = {};
    if (tag) {
      q.tags = {
        $in: [tag],
      };
    }

    if (styleNo) {
      q.styleNo = {
        $regex: new RegExp(styleNo, "i"),
      };
    }
    let myC = { step: "start" };
    let myChannelStyles = [];
    let categoryData = [];
    if ((channel && channel.codename === "A") || currentUser.role === 1) {
      for (let i = 0; i < goodData.category.length; i++) {
        let c = goodData.category[i];
        let styles = await Style.find({
          isDel: 0,
          ...q,
          categoryId: { $in: [c._id.toString()] },
        }).sort({ createdAt: -1 });
        categoryData.push({
          name: c.name,
          _id: c._id,
          styles: styles,
        });
      }
    } else if (channel) {
      myC = { step: "else if" };
      const myChannel = await Channel.findOne({
        assignedId: channel.assignedId,
        codename: channel.codename,
        owner: currentUser.owner,
      })
        .populate({
          path: "styles.style",
        })
        .lean();
      myChannelStyles = myChannel.styles;
      const styles = myChannel.styles
        .map((x) => ({
          ...x.style,
          price: x.price,
        }))
        .filter((s) => s.styleNo && s.styleNo.includes(styleNo));
      myC.myChannel = myChannel;
      for (let i = 0; i < goodData.category.length; i++) {
        let c = goodData.category[i];
        const filterData = [];
        styles.map((x) => {
          let f = null;
          if (x.categoryId && x.categoryId.find) {
            f = x.categoryId.find((t) => t == c._id.toString());
          }
          console.log(f);
          if (f) {
            filterData.push(x);
          }
        });

        categoryData.push({
          name: c.name,
          _id: c._id,
          styles: filterData,
        });
      }
    }

    ctx.body = response(
      true,
      { category: categoryData, channel, myC, myStyles: myChannelStyles },
      "成功"
    );
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const update = async (ctx, next) => {
  try {
    const { _id, ...others } = ctx.request.body;
    const originalDoc = Style.findById(_id);
    let data = await Style.findByIdAndUpdate(
      { _id },
      { ...others },
      { new: true }
    );
    logChange(originalDoc.toObject(), data.toObject(), 'style', _id, currentUserId);  
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

/**
 *
 * @param {object} res 直接文档对象
 * @param {string} field 要操作的字段
 * @param {string} key 要操作的该字段的对象属性
 * @param {object} target 要替换或添加的对象
 */
const updateInnerArray = (res, field, key, target) => {
  let index = res[field].findIndex((x) => x[key] === target[key]);
  if (index > -1) {
    res[field].splice(index, 1, target);
  } else {
    res[field].push(target);
  }
};

export const updateAttr = async (ctx, next) => {
  try {
    const { _id, ...attr } = ctx.request.body;
    let res = await Style.findById({
      _id,
    });

    updateInnerArray(res, "attrs", "colorId", attr);
    let data = await res.save();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

/**
 * 给当前款式下，对通道分配尺寸，素色，花色
 * 先查找channels数组里面是否有该通道，若没有，则添加
 * 若有，则更新
 */
export const assign = async (ctx, next) => {
  try {
    const { _id, ...channel } = ctx.request.body;

    let res = await Style.findOneAndUpdate({
      _id,
      "channels.channelId": channel.channelId,
    });
    updateInnerArray(res, "channels", "channelId", channel);

    let data = await res.save();

    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const updateMany = async (ctx, next) => {
    // updateMany
  try {
    const { _id, ids, ...others } = ctx.request.body;
    let data = {};
    if (ids) {
      data = await Style.updateMany(
        {
          _id: {
            $in: ids,
          },
        },
        {
          ...others,
        }
      );
    } 
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const del = async (ctx, next) => {
  try {
    const { _id, ids } = ctx.request.body;
    
    let data = {};
    if (_id) {
        data = await Style.findByIdAndUpdate({ _id }, { isDel: 1 });
    }
    if (ids) {
        data = await Style.updateMany(
            {
              _id: {
                $in: ids,
              },
            },
            {
              isDel: 1,
            }
          );
    }
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const detail = async (ctx, next) => {
  try {
    const { _id, channelId } = ctx.request.query;
    // const { role } = await getCurrentUser(ctx, next)

    let data = await await Style.findById(_id)
      // .populate("goodsId")
      .populate({
        path: "plainColors.colorId",
      })
      .populate({
        path: "flowerColors.colorId",
      })
      .select("-plainColors._id -flowerColors._id")
      .exec();

    ctx.body = response(true, data, "成功");

    // data = JSON.parse(JSON.stringify(data))
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};
