var fs = require('fs')
var gettextParser = require("gettext-parser")
var out = gettextParser.po.compile(JSON.parse(fs.readFileSync("out.json")))
fs.writeFileSync("out.po", out)
