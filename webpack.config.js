const path = require('path');

module.exports = {
  entry: {
    tabs: './src/assets/js/components/tabs.ts',
    main: './src/assets/js/main.ts',
    background: './src/assets/js/background.ts',
    options: './src/assets/js/options.ts',
    focus: './src/assets/js/focus.ts',
  },
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
    path: path.resolve(__dirname, 'dist/js'),
    clean: true,
  },
};
