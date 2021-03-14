import request from "request";
// import cv from "opencv4nodejs";
export const response = (success, data, message) => {
  if (success) {
    return {
      success: true,
      data,
      message: message || "操作成功",
    };
  } else {
    return {
      success: false,
      data,
      message: message || "操作失败",
    };
  }
};

export const downImg = async (opts = {}) => {
  return new Promise((resolve, reject) => {
    request.get(opts, (x, y, body) => {
      console.log("error", x);
      console.log("error", body);
      resolve(body);
    });
  });
};

export const pickInfos = [
  { label: "单色单码", value: 0 },
  { label: "混色混码", value: 1 },
  { label: "单色混码混箱", value: 2 },
  { label: "单色混码单箱", value: 3 },
];
