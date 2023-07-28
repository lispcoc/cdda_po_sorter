var fs = require('fs')
var gettextParser = require("gettext-parser")
var transration = gettextParser.po.parse(fs.readFileSync('mods.po', encoding = 'utf-8'))
fs.writeFileSync("mods.json", JSON.stringify(transration, null, 2))
