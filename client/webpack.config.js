const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: {
        bundle: "./index.tsx",
        sw: "../serviceworker/sw.ts"
    },
    context: __dirname,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{ loader: "css-loader" }, { loader: "sass-loader" }],
                    fallback: "style-loader"
                })
            }
        ]
    },
    resolve: {
        modules: ["node_modules", path.resolve(__dirname, "../lib")],
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./index.html"),
            css: "style.css"
        }),
        extractSass
    ],
    devServer: {
        contentBase: path.join(__dirname, "../dist"),
        port: 3000
    }
};
