const path = require("path")
const webpack = require("webpack")

module.exports = {
    mode:"development",
    entry: {
       app: './public/js/app.js',
    },  
    output: {
        filename: 'bundle.js',
        path:path.resolve('public/dist')
    },

}