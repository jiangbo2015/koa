import Capsule from "../models/capsule";
import CapsuleItem from "../models/capsule-itme";
import User from "../models/user";
import Favorite from "../models/favorite";
import { get, map } from "lodash";
import Channel from "../models/channel";
import { logChange } from '../utils/changeLogger';
import { response } from "../utils";
import { addMessage } from '../utils/message';
import { getCurrentUser } from "./user";

const codePrefix = {
  0: "S-",
  1: "H-",
};

export const add = async (ctx) => {
  try {
    const { ...others } = ctx.request.body;
    const currentUser = await getCurrentUser(ctx);
    const currentUserId = currentUser._id;
    let capsule = new Capsule({
      ...others,
      author: currentUserId
    });
    let data = await capsule.save();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getList = async (ctx) => {
  try {
    let { author, status, name, page = 1, limit = 20 } = ctx.request.query;

    let q = {};
    if (typeof name !== "undefined") {
        q.name = {
        $regex: new RegExp(name, "i"),
        };
    //   q.namecn = {
    //     $regex: new RegExp(name, "i"),
    //   };
    //   q.nameen = {
    //     $regex: new RegExp(name, "i"),
    //   };
    }
    if (typeof status !== "undefined") {
      q.status = status;
    }
    if (typeof author !== "undefined") {
        q.author = author;
      }
    let data = await Capsule.paginate(q, {
      page,
      // 如果没有limit字段，不分页
      // limit: limit ? limit : 10000,
      limit: parseInt(limit),
      sort: {
        createdAt: -1,
      },
    });
    
    ctx.body = response(
      true,
      {
        ...data,
        v: "1.6",
        q,
      },
      "成功v2"
    );
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const getPublicList = async (ctx) => {
    try {
      let { name, page = 1, limit = 20 } = ctx.request.query;
      const currentUser = await getCurrentUser(ctx);
      
      let q = {
        status: 'published'
      };
      if (typeof name !== "undefined") {
          q.name = {
          $regex: new RegExp(name, "i"),
          };
      //   q.namecn = {
      //     $regex: new RegExp(name, "i"),
      //   };
      //   q.nameen = {
      //     $regex: new RegExp(name, "i"),
      //   };
      }

      if (currentUser.role === 3) {
        const channel = await Channel.findById(currentUser.channel)
        const capsules = get(channel, 'capsules')
        q._id = {
            $in: capsules,
        };
      }
      
      
      let data = await Capsule.paginate(q, {
        page,
        // 如果没有limit字段，不分页
        // limit: limit ? limit : 10000,
        limit: parseInt(limit),
        sort: {
          createdAt: -1,
        },
      });
      
      ctx.body = response(
        true,
        {
          ...data,
          v: "1.6",
          q,
        },
        "成功v2"
      );
    } catch (err) {
      console.log(err);
      ctx.body = response(false, null, err.message);
    }
  };

export const getAdminList = async (ctx) => {
    try {
      let { author, status, name, page = 1, limit = 20 } = ctx.request.query;
  
      let q = {};
      if (typeof name !== "undefined") {
          q.name = {
            $regex: new RegExp(name, "i"),
          };
      //   q.namecn = {
      //     $regex: new RegExp(name, "i"),
      //   };
      //   q.nameen = {
      //     $regex: new RegExp(name, "i"),
      //   };
      }
      if (typeof status !== "undefined") {
        q.status = status;
      }
      if (typeof author !== "undefined") {
          q.author = author;
        }
      let data = await Capsule.paginate(q, {
        page,
        // 如果没有limit字段，不分页
        // limit: limit ? limit : 10000,
        limit: parseInt(limit),
        sort: {
          createdAt: -1
        },
        populate: "author"
      });
      
      ctx.body = response(
        true,
        {
          ...data,
          v: "1.6",
          q,
        },
        "成功v2"
      );
    } catch (err) {
      console.log(err);
      ctx.body = response(false, null, err.message);
    }
  };


export const update = async (ctx, next) => {
  try {
    const { _id, ...others } = ctx.request.body;
    const currentUser = await getCurrentUser(ctx);
    const currentUserId = currentUser._id;
    const originalDoc = await Capsule.findById(_id);
    let data = await Capsule.findByIdAndUpdate(
      { _id },
      { ...others },
      { new: true }
    );
    logChange(originalDoc.toObject(), data.toObject(), 'capsule', _id, currentUserId)
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const del = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;
    let data = await Capsule.findByIdAndRemove({ _id });
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const getVisibleList = async (ctx, next) => {
  try {
    const { name } = ctx.request.query;
    let q = { status: 1};
    if (name) {
      q.name = name;
    }
    let data = await Capsule.find(q).sort({ createdAt: -1 }).lean();
    const user = await getCurrentUser(ctx, next);
    let result = [];
    if (user.role === 0) {
      result = data;
    } else {
      result = data.filter((d) => user.capsules.indexOf(d._id) >= 0);
    }

    ctx.body = response(true, result);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const findById = async (ctx, next) => {
    try {
        const { _id } = ctx.request.query;
        const data = await Capsule
          .findById(_id)
          .populate("author") // 填充 author 字段
          .populate("plainColors") 
          .populate("flowerColors") 
          .populate({
            path: "capsuleItems.style", // 填充 capsuleItems 中的 style 字段
            model: "style", // 指定关联的模型
          })
          .populate({
            path: "capsuleItems.finishedStyleColorsList.colors", // 填充 colors 字段
            model: "color", // 指定关联的模型
          })
          .populate({
            path: "capsuleItems.finishedStyleColorsList.texture", // 填充 texture 字段
            model: "color", // 指定关联的模型
          })
          .exec();
    
        if (!data) {
          throw new Error("Capsule not found");
        }
    
      // 返回查询结果
      ctx.body = response(true, data);
    } catch (err) {
      console.log(err);
      ctx.body = response(false, null, err.message);
    }
}

export const applyForPublication = async (ctx, next) => {
    try {
      const { _id  } = ctx.request.body;
      const currentUser = await getCurrentUser(ctx);
      const currentUserId = currentUser._id;
      const originalDoc = await Capsule.findById(_id);
      let data = await Capsule.findByIdAndUpdate(
        { _id },
        { status: 'pending' },
        { new: true }
      );
      const admin = await User.findOne({ role: 0})
      if(admin) {
        const coverType = get(data, 'capsuleItems.0.type')
        const coverImage = get(data, 'capsuleItems.0.fileUrl') || 
        get(data, 'capsuleItems.0.finishedStyleColorsList.0.imgUrlFront')
        addMessage({
            userId: get(admin, '_id'), 
            content: '有新的发布申请', 
            type: 'capsule-publishing-application',
            objectModelId: _id,
            coverImage,
            coverType,
        }, true)
      }
      
      logChange({status: originalDoc.status}, {status: 'pending'}, 'capsule', _id, currentUserId)
      ctx.body = response(true, data, "成功");
    } catch (err) {
      console.log(err);
      ctx.body = response(false, null, err.message);
    }
  };

// export const getMyFavoriteList = async (ctx) => {
//     try {
//         let { status, name, page = 1, limit = 20 } = ctx.request.query;

//         let q = {};
//         if (typeof name !== "undefined") {
//         q.namecn = {
//             $regex: new RegExp(name, "i"),
//         };
//         q.nameen = {
//             $regex: new RegExp(name, "i"),
//         };
//         }
//         if (typeof status !== "undefined") {
//             q.status = status;
//         }

//         let data = await Capsule.paginate(q, {
//         page,
//         // 如果没有limit字段，不分页
//         // limit: limit ? limit : 10000,
//         limit: parseInt(limit),
//         sort: {
//             createdAt: -1,
//         },
//         });

//         const promises = [];
//         for (const doc of data.docs) {
//             promises.push(
//                 CapsuleItem.findOne({ isDel: 0, capsule: doc._id })
//                 .then(item => ({
//                     ...doc.toObject(),
//                     imgUrl: item ? item.fileUrl : null // 如果 item 为 null，则设置 imgUrl 为 null
//                 }))
//             );
//         }

//         data.docs = await Promise.all(promises);
        
//         ctx.body = response(
//             true,
//             {
//                 ...data,
//                 q,
//             },
//             "成功"
//         );
//     } catch (err) {
//         console.log(err);
//         ctx.body = response(false, null, err.message);
//     }
// };

export const getMyFavoriteList = async (ctx) => {
    try {
        const { name, status, page = 1, limit = 20 } = ctx.request.query;
        const currentUser = await getCurrentUser(ctx);
        const currentUserId = currentUser._id;
        const favorites = await Favorite.find({ owner: currentUserId, isDel: 0 });
        const favoritesCapsuleIds = map(favorites, f => f.capsule)
        let q = {
            _id: {
                $in: favoritesCapsuleIds,
            }
        };
        if (typeof name !== "undefined") {
            q.name = {
                $regex: new RegExp(name, "i"),
            };
        //   q.namecn = {
        //     $regex: new RegExp(name, "i"),
        //   };
        //   q.nameen = {
        //     $regex: new RegExp(name, "i"),
        //   };
        }
        if (typeof status !== "undefined") {
          q.status = status;
        }
        if (typeof author !== "undefined") {
            q.author = author;
          }
        let data = await Capsule.paginate(q, {
          page,
          // 如果没有limit字段，不分页
          // limit: limit ? limit : 10000,
          limit: parseInt(limit),
          sort: {
            createdAt: -1,
          },
        });
        ctx.body = response(
            true,
            data,
            "成功"
        );
    } catch (err) {
        console.log(err);
        ctx.body = response(false, null, err.message);
    }
};

// export const getMyFavoriteList = async (ctx) => {
//     try {
//         const { name, status, page = 1, limit = 20 } = ctx.request.query;
//         const currentUser = await getCurrentUser(ctx);
//         const currentUserId = currentUser._id;

//         // 构建查询条件
//         const q = { owner: currentUserId, isDel: 0 };
//         if (typeof name !== "undefined") {
//             q["capsule.name"] = { $regex: new RegExp(name, "i") };
//         }
//         if (typeof status !== "undefined") {
//             q["capsule.status"] = status;
//         }

//         // 查询用户收藏的capsule，并关联查询capsule的详细信息
//         const favorites = await Favorite.find(q)
//             .populate({
//                 path: "capsule",
//                 match: { isDel: 0 }, // 确保关联的capsule没有被删除
//             })
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit))
//             .sort({ createdAt: -1 });

//         // 过滤掉populate结果为null的capsule（可能被删除）
//         const data = favorites.filter((favorite) => favorite.capsule);

//         // 获取总条数（用于分页）
//         const total = await Favorite.countDocuments(q);

//         ctx.body = response(
//             true,
//             {
//                 docs: data,
//                 total,
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//             },
//             "成功"
//         );
//     } catch (err) {
//         console.log(err);
//         ctx.body = response(false, null, err.message);
//     }
// };