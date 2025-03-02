import mongoose from "mongoose";
import ChangeLog from "../models/change-log";
import { response } from "../utils";

// 获取所有 ChangeLog 或根据 modelId 查询 ChangeLog
export const getAllChangeLogs = async (ctx) => {
  try {
    const { modelId, page = 1, pageSize = 50 } = ctx.query;

    // 校验 modelId 格式
    if (modelId && !mongoose.Types.ObjectId.isValid(modelId)) {
      ctx.status = 400;
      ctx.body = response(false, null, "modelId 格式错误");
      return;
    }

    // 构建查询条件
    const query = {};
    if (modelId) {
      query.objectModelId = modelId;
    }

    // 计算分页
    const skip = (page - 1) * pageSize;

    // 查询 ChangeLog
    const changeLogs = await ChangeLog.find(query)
      .sort({ createdAt: -1 }) // 按创建时间降序排列
      .skip(skip)
      .limit(Number(pageSize))
      .populate({
        path: 'changedBy', // 填充 changedBy 字段
        select: 'name account', // 选择需要返回的 users 字段（根据你的 users 模型调整）
      });

    ctx.status = 200;
    ctx.body = response(true, changeLogs, "成功");
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};