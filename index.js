const fs = require('fs')
const Fuse = require('fuse.js')
const readline = require('readline')
var base = JSON.parse(fs.readFileSync('cataclysm-dda_mod.json', encoding = 'utf-8'))
var mod = JSON.parse(fs.readFileSync('mods.json', encoding = 'utf-8'))

var list = []
var options = {
    threshold: 0.5,
    keys: [
        "msgid"
    ]
};

for(const msgctxt in base.translations) {
    for(const key in base.translations[msgctxt]) {
        list.push(base.translations[msgctxt][key])
    }
}

if(1){
    for(const msgctxt in mod.translations) {
        var i = 0
        for(const key in mod.translations[msgctxt]) {
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`time: ${++i} / ${Object.keys(mod.translations[msgctxt]).length}`);
            if(!mod.translations[msgctxt][key].msgstr.find(e => e != "")) {
                var found = null
                // 完全一致
                if(base.translations[msgctxt]) {
                    var obj = base.translations[msgctxt][key]
                    if(obj) {
                        found = obj.msgstr
                        mod.translations[msgctxt][key].msgstr = found
                    }
                }
                // あいまい検索
                if(!found) {
                    var fuse = new Fuse(list, {
                        threshold: 0.1,
                        keys: ["msgid"],
                        shouldSort: true
                    })
                    var result = fuse.search(key)
                    if(result.length) {

                        mod.translations[msgctxt][key].comments.translator =
                        mod.translations[msgctxt][key].comments.translator =
                        ([
                            mod.translations[msgctxt][key].comments.translator,
                            "__suggest__",
                            result[0].item.msgid,
                            result[0].item.msgstr[0]
                        ]).join('\n')
                        //console.log(result[0].item.msgid)
                        console.log(result[0].item.msgstr[0])
                    }
                }
            }
        }
    }
}
fs.writeFileSync("out.json", JSON.stringify(mod, null, 2))
