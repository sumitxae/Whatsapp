const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './app.js', // path to your main JavaScript file
  output: {
    path: path.resolve(__dirname, 'dist'), // output directory
    filename: 'bundle.js', // output filename
  },
  module: {
    rules: [
      {
        test: /\.js$/, // match JavaScript files
        exclude: /node_modules/, // exclude node_modules directory
        use: {
          loader: 'babel-loader', // use Babel for transpiling
          options: {
            presets: ['@babel/preset-env'], // use preset for modern JavaScript
          },
        },
      },
      // add more rules for other file types (e.g., CSS, images) as needed
    ],
  },
  // add any additional configuration options here
};
