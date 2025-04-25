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
  publicKey: "public_rTQxXkUMXPzRWNyDUW79qhGUCTM=",
  privateKey: "private_l+FmU62dyXxyek/OUyLHWNTrN2M=",
  urlEndpoint: "https://ik.imagekit.io/weidesign",
});

export const handleUploadKit = async (ctx) => {
    try {
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
        return `weidesign/${res.name}`;

    }catch (err) {
        console.log(err)
            return null
    }
}

