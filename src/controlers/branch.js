import Branch from "../models/branch";
import BranchKind from "../models/branch-kind";
import { response } from "../utils";

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
    const data = await Branch.find(query);
    for (let i = 0; i < data.length; i++) {
      const bk = await BranchKind.find({ isDel: 0, branch: data[i]._id });
      const { createdAt, isDel, namecn, nameen, updatedAt, _id } = data[i];
      resData.push({
        createdAt,
        isDel,
        namecn,
        nameen,
        updatedAt,
        _id,
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
    const { _id, values, goods } = ctx.request.body;
    let data = await Branch.findByIdAndUpdate(
      { _id },
      { values, goods },
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
