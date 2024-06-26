import fse from "fs-extra";
import path from "path";
import ImageKit from "imagekit";

/**
 * @api {post} /common/upload 文件上传
 * @apiName upload
 * @apiGroup Common
 * 
 * @apiParam  {String} file 文件
 * 
 * @apiSuccessExample {json} Success-Response:
 *    {
    "success": true,
    "data": {
        "url": "uploads/2019-11-27/1574848148287.png"
    },
    "message": "成功"
}
 */

// SDK initialization

var imagekit = new ImageKit({
  publicKey: "public_47rFcYKV4YPd6O1qfepig7VVYbA=",
  privateKey: "private_AmkFWw4UFrfus91MT4UYM3WeJ+g=",
  urlEndpoint: "https://ik.imagekit.io/mrmiss",
});

export const handleUploadKit = async (ctx) => {
  const file = ctx.request.files.file;
  // 创建可读流
  // const reader = fse.createReadStream(file.path)

  let fileName = `${new Date().getTime()}${path.extname(file.name)}`;
  console.log("handleUploadKit");
  const res = await imagekit.upload({
    file: fse.readFileSync(file.path), //required
    fileName, //required
  });
//   console.log(res);
  return `mrmiss/${res.name}`;
};
