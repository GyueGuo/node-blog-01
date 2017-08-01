var qn = require('qn');

var client = qn.create({
  accessKey: '6aoudgRcpWcos76F6LTKONcepR953Zn1-A3_91RE',
  secretKey: 'qf8G_NlatoBJq8Zl2GQ6zO_6LD93eprfsC3Zpjew',
  bucket: 'portraits',
  origin: 'http://orw5r3t5k.bkt.clouddn.com/',
  // timeout: 3600000, // default rpc timeout: one hour, optional 
  // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/` 
  uploadURL: 'http://up-z1.qiniu.com/'
});

exports.client = client;