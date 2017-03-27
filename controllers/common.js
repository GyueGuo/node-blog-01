//公用方法
var commons = {
    regexp : {
        username : new RegExp("[^0-9a-z]","i");
        pwd : new RegExp("[\W]","i");
    },
};


exports.commons = commons;