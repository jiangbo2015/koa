define({ "api": [  {    "type": "post",    "url": "/channel/add",    "title": "添加通道",    "name": "add",    "group": "Channel",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "currency",            "description": "<p>0-素色，1-花色，不传则获取所有</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "code",            "description": "<p>通道编号</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>通道名称</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/channel.js",    "groupTitle": "Channel"  },  {    "type": "post",    "url": "/channel/delete",    "title": "删除通道",    "name": "delete",    "group": "Channel",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>通道id *</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/channel.js",    "groupTitle": "Channel"  },  {    "type": "get",    "url": "/channel/getList",    "title": "获取所有通道",    "name": "getList",    "group": "Channel",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/channel.js",    "groupTitle": "Channel"  },  {    "type": "post",    "url": "/color/add",    "title": "添加素色或花色",    "name": "add",    "group": "Color",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "type",            "description": "<p>0-素色，1-花色</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "value",            "description": "<p>url或者RGB颜色</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/color.js",    "groupTitle": "Color"  },  {    "type": "post",    "url": "/color/delete",    "title": "删除",    "name": "delete",    "group": "Color",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>花色或者素色的id</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/color.js",    "groupTitle": "Color"  },  {    "type": "get",    "url": "/color/getList",    "title": "获取颜色列表",    "name": "getList",    "group": "Color",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "type",            "description": "<p>0-素色，1-花色，不传则获取所有</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/color.js",    "groupTitle": "Color"  },  {    "type": "post",    "url": "/color/update",    "title": "更新",    "name": "update",    "group": "Color",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>花色或者素色的id</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "value",            "description": "<p>颜色或url</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/color.js",    "groupTitle": "Color"  },  {    "type": "post",    "url": "/common/upload",    "title": "文件上传",    "name": "upload",    "group": "Common",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "file",            "description": "<p>文件</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "   {\n    \"success\": true,\n    \"data\": {\n        \"url\": \"uploads/2019-11-27/1574848148287.png\"\n    },\n    \"message\": \"成功\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/common.js",    "groupTitle": "Common"  },  {    "type": "post",    "url": "/goods/add",    "title": "添加商品",    "name": "add",    "group": "Goods",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>商品名</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "aliasName",            "description": "<p>展示商品名</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "imgUrl",            "description": "<p>商品图</p>"          },          {            "group": "Parameter",            "type": "Array",            "size": "{name: String, sizeId: id}",            "optional": false,            "field": "category",            "description": "<p>商品分类</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/goods.js",    "groupTitle": "Goods"  },  {    "type": "post",    "url": "/size/add",    "title": "添加尺寸",    "name": "add",    "group": "Goodsbase",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>尺码名称</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/goodsbase.js",    "groupTitle": "Goodsbase"  },  {    "type": "post",    "url": "/size/delete",    "title": "删除尺寸",    "name": "delete",    "group": "Goodsbase",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>尺码id</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/goodsbase.js",    "groupTitle": "Goodsbase"  },  {    "type": "get",    "url": "/rule/getInfo",    "title": "获取规则信息",    "name": "getList",    "group": "Goodsbase",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {\n  plainColor: 'S-',\n  flowerColor: 'H-\n }}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/goodsbase.js",    "groupTitle": "Goodsbase"  },  {    "type": "get",    "url": "/size/getList",    "title": "获取尺寸列表",    "name": "getList",    "group": "Goodsbase",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/goodsbase.js",    "groupTitle": "Goodsbase"  },  {    "type": "post",    "url": "/goods/delete",    "title": "删除",    "name": "delete",    "group": "Goods",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/goods.js",    "groupTitle": "Goods"  },  {    "type": "get",    "url": "/goods/detail",    "title": "获取详情",    "name": "detail",    "group": "Goods",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>商品id</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/goods.js",    "groupTitle": "Goods"  },  {    "type": "get",    "url": "/goods/getList",    "title": "获取列表",    "name": "getList",    "group": "Goods",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/goods.js",    "groupTitle": "Goods"  },  {    "type": "post",    "url": "/goods/update",    "title": "更新",    "name": "update",    "group": "Goods",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>商品id</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/goods.js",    "groupTitle": "Goods"  },  {    "type": "post",    "url": "/size/add",    "title": "添加尺寸",    "name": "add",    "group": "Size",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>尺码名称</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/size.js",    "groupTitle": "Size"  },  {    "type": "post",    "url": "/style/add",    "title": "添加款式",    "name": "add",    "group": "Style",    "parameter": {      "examples": [        {          "title": "Request-Example:",          "content": "   {\n\t\"styleNo\": \"s001\",\n\t\"price\": 100,\n\t\"imgUrl\": \"http://www.baidu.com\",\n\t\"sizeId\": \"5dea211c86b0d20740b8f6ec\",\n\t\"goodsId\": \"5dea31af3579b40840224490\",\n\t\"category\": \"上衣\",\n\t\"plainColors\": [{\n\t\t\"colorId\": \"5dea2b53644fab07a224bd46\",\n\t\t\"left\": \"left\",\n\t\t\"front\": \"front\",\n\t\t\"backend\": \"backend\"\n\t}],\n\t\"flowerColors\": [{\n\t\t\"colorId\": \"5dea2c83644fab07a224bd47\",\n\t\t\"left\": \"left\",\n\t\t\"front\": \"front\",\n\t\t\"backend\": \"backend\"\n\t}]\n}",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/style.js",    "groupTitle": "Style"  },  {    "type": "post",    "url": "/style/delete",    "title": "删除款式",    "name": "delete",    "group": "Style",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>款式 *</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/style.js",    "groupTitle": "Style"  },  {    "type": "get",    "url": "/style/getList",    "title": "获取所有款式",    "name": "getList",    "group": "Style",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/style.js",    "groupTitle": "Style"  },  {    "type": "post",    "url": "/style/update",    "title": "更新款式",    "name": "update",    "group": "Style",    "parameter": {      "examples": [        {          "title": "Request-Example:",          "content": "   {\n\t\"_id\": \"5deb0a2ab7afdf0f689d4330\",\n\t\"plainColors\": [\n            {\n                \"_id\": \"5deb0f1519ec810f90ebbaa0\",\n                \"colorId\": \"5dea2b53644fab07a224bd46\",\n                \"left\": \"left5\",\n                \"front\": \"front5\",\n                \"backend\": \"backend4\"\n            },{\n            \t\"colorId\": \"5deb0e6119ec810f90ebba9c\",\n            \t\"left\": \"left2\",\n                \"front\": \"front2\",\n                \"backend\": \"backend2\"\n            }\n        ]\n    }",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/style.js",    "groupTitle": "Style"  },  {    "type": "post",    "url": "/user/add",    "title": "添加用户",    "name": "add",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "account",            "description": "<p>账号</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>密码</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "role",            "description": "<p>角色 0-超级管理员，1-产品经理，2-视觉设计，3-用户</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>姓名</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "email",            "description": "<p>邮箱</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "address",            "description": "<p>地址</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "contact",            "description": "<p>联系人</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "phone",            "description": "<p>联系电话</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "customerType",            "description": "<p>客户类型</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "remark",            "description": "<p>备注</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "channels",            "description": "<p>管理的通道id,用英文逗号隔开</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    success: true,\n    data: {\n         token: \"qwertyuiopasdfghihp\"\n    }\n}",          "type": "type"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/user.js",    "groupTitle": "User"  },  {    "type": "post",    "url": "/user/delete",    "title": "删除用户",    "name": "delete",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>用户id</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/user.js",    "groupTitle": "User"  },  {    "type": "get",    "url": "/user/getCurrentUser",    "title": "获取当前用户",    "name": "getCurrentUser",    "group": "User",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/user.js",    "groupTitle": "User"  },  {    "type": "get",    "url": "/user/getList",    "title": "获取用户列表",    "name": "getList",    "group": "User",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/user.js",    "groupTitle": "User"  },  {    "type": "post",    "url": "/user/login",    "title": "用户登录",    "name": "login",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "account",            "description": "<p>账号</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>密码</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n    \"success\": true,\n    \"data\": {},\n    \"message\": \"成功\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/user.js",    "groupTitle": "User"  },  {    "type": "post",    "url": "/user/update",    "title": "更新用户信息",    "name": "update",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>用户id</p>"          },          {            "group": "Parameter",            "type": "Object",            "optional": false,            "field": "object",            "description": "<p>添加用户时用的那些字段</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\"success\": true, \"data\": {}}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/routers/user.js",    "groupTitle": "User"  }] });
