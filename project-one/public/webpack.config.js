const path = require('path');
module.exports = {
    entry: './src/main.ts', // Entry point of your TypeScript file
    module: {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
    ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js', // Output file
        path: path.resolve(__dirname, 'dist/js'), // Output directory
    },
};