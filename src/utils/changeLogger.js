import mongoose from 'mongoose';
import {isEqual} from 'lodash';

import ChangeLog from '../models/change-log';
// import logger from '../utils/logger'; // 假设你有一个日志工具

/**
 * 记录变更日志
 * @param {Object} oldObj - 修改前的对象
 * @param {Object} newObj - 修改后的对象
 * @param {String} model - 模型名称（如 "Color"）
 * @param {mongoose.Types.ObjectId} modelId - 修改的文档 ID
 * @param {mongoose.Types.ObjectId} changedBy - 修改人 ID
 */
export const logChange = async (oldObj, newObj, model, modelId, changedBy) => {
  // 参数校验
  if (!oldObj || !newObj || typeof oldObj !== 'object' || typeof newObj !== 'object') {
    throw new Error('oldObj and newObj must be valid objects');
  }
  if (!mongoose.Types.ObjectId.isValid(modelId)) {
    throw new Error('modelId must be a valid ObjectId');
  }
  if (!mongoose.Types.ObjectId.isValid(changedBy)) {
    throw new Error('changedBy must be a valid ObjectId');
  }

  const changes = [];

  // 遍历新对象的字段，找出变化的字段
  for (const key in newObj) {
    if (key === 'updatedAt') {
        continue;
    }
    if (newObj.hasOwnProperty(key) && oldObj.hasOwnProperty(key)) {
      if (!isEqual(newObj[key], oldObj[key])) {
        changes.push({
          field: key,
          oldValue: oldObj[key],
          newValue: newObj[key],
        });
      }
    } else if (newObj.hasOwnProperty(key)) {
      // 新增字段
      changes.push({
        field: key,
        oldValue: undefined,
        newValue: newObj[key],
      });
    }
  }

  // 检查是否有字段被删除
  for (const key in oldObj) {
    if (oldObj.hasOwnProperty(key) && !newObj.hasOwnProperty(key)) {
      changes.push({
        field: key,
        oldValue: oldObj[key],
        newValue: undefined,
      });
    }
  }

  // 如果有变更，则记录日志
  if (changes.length > 0) {
    console.log("model:", model)
    console.log("modelId:", modelId)
    console.log("changedBy:", changedBy)
    console.log("changes:", changes)
    const changeLog = new ChangeLog({
      objectModelName: model,
      objectModelId: mongoose.Types.ObjectId(modelId),
      changes,
      changedBy: mongoose.Types.ObjectId(changedBy),
    });
    await changeLog.save();
    // logger.info('Change log saved:', changeLog);
  } else {
    // logger.info('No changes detected.');
  }
};