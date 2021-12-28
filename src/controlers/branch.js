import Branch from "../models/branch";
import BranchKind from "../models/branch-kind";
import { response } from "../utils";
import { getList as ssGetList } from "./shop-style";
import { getCurrentUser } from "./user";

export const add = async (ctx, next) => {
  console.log("add branch");
  try {
    const body = ctx.request.body;
    let branch = new Branch(body);
    let data = await branch.save();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getList = async (ctx, next) => {
  try {
    let { query } = ctx.request;
    query.isDel = 0;
    const resData = [];
    const data = await Branch.find(query).sort({ createdAt: -1 });
    for (let i = 0; i < data.length; i++) {
      const bk = await BranchKind.find({ isDel: 0, branch: data[i]._id });
      const { createdAt, isDel, namecn, nameen, updatedAt, _id ,description, status} = data[i];
      resData.push({
        createdAt,
        isDel,
        namecn,
        nameen,
        updatedAt,
        _id,
        description, status,
        children: bk,
      });
    }
    ctx.body = response(true, resData, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const update = async (ctx, next) => {
  try {
    const { _id, ...values } = ctx.request.body;
    let data = await Branch.findByIdAndUpdate(
      { _id },
      { ...values },
      { new: true }
    );
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const del = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;
    let data = await Branch.findByIdAndUpdate({ _id }, { isDel: 1 });
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const getVisibleList = async (ctx, next) => {
  try {
    const { name } = ctx.request.query;
    let q = { status: 1, isDel: 0};
    if (name) {
      q.name = name;
    }
    const user = await getCurrentUser(ctx);
    let data = await Branch.find(q).sort({ createdAt: -1 })
    
    if(user.role === 0) {
        ctx.body = response(true, data);
        return;
    }
    let result = [];
    let resData = [];
    result = data.filter((d) => user.branchs.indexOf(d._id) >= 0);
    // for (let i = 0; i < result.length; i++) {
    //   const bk = await BranchKind.find({ isDel: 0, branch: result[i]._id }).sort({ createdAt: -1 });
    //   const { createdAt, isDel, namecn, nameen, updatedAt, _id,description, status, } = result[i];
    //   resData.push({
    //     createdAt,
    //     isDel,
    //     namecn,
    //     nameen,
    //     updatedAt,
    //     description, status,
    //     _id,
    //     children: bk,
    //   });
    // }
    for (let i = 0; i < result.length; i++) {
        let shopStyles = await ssGetList({
          ...ctx,
          request: { ...ctx.request, query: { branch: result[i]._id } },
        });
        let group = lodash.groupBy(
          shopStyles.filter((x) => !!x.goodCategory),
          (cs) => cs.goodCategory.name
        );
        let children = Object.values(group).map((x) => ({
          _id: x[0].goodCategoryId,
          namecn: x[0].goodCategory.name,
          nameen: x[0].goodCategory.enname,
          branch: result[i]._id,
        }));
        result[i].children = children;
      }

    ctx.body = response(true, resData);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};
