/*jshint node: true */
"use strict";
var fs = require("fs");

var fixDate = {
    "package-settings": true,
    preferences: true
};

var hanDate = {
    "Key Bindings – Default": "按键绑定 – 默认",
    "Key Bindings – User": "按键绑定 – 用户",
    "Settings – Default": "设置 – 默认",
    "Settings – User": "设置 – 用户"
}

function fixObj(obj) {
    if (Array.isArray(obj)) {
        obj.forEach(fixObj);
    } else if (typeof obj === "object") {
        if(obj.caption){
            if (obj.id && fixDate[obj.id]) {
                obj.caption = null;
                delete obj.caption;
            }
            obj.caption = hanDate[obj.caption] || obj.caption;
        }
        for (var i in obj) {
            fixObj(obj[i]);
        }
    }
    return obj;
}

fs.readdir(".", function(err, files) {
    if (err) {
        console.log("read dir error");
    } else {
        files.forEach(function(item) {
            if (item !== "Default" && item !== "Package Control") {
                item = item + "/Main.sublime-menu"
                fs.readFile(item, function(err, data) {
                    if (!err) {
                        data = JSON.parse(data);
                        var oldDataJson = JSON.stringify(data, 0, 4);

                        var newDataJson = JSON.stringify(fixObj(data), 0, 4);
                        if (oldDataJson !== newDataJson) {

                            fs.writeFile(item, newDataJson, function(err) {
                                if (!err) {
                                    console.log(item);
                                }
                            });
                        } else {
                            console.log("ok:\t" + item);
                        }

                    }
                });
            }
        });
    }
});