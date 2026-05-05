const path = require('path');

module.exports = {
    entry: ['./src/index.jsx'],
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            ['@babel/preset-env', {
                                targets: {chrome: '66', firefox: '60', edge: '42', safari: '12'},
                                modules: false,
                            }],
                            ['@babel/preset-react'],
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-syntax-dynamic-import',
                        ],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    // React and Redux are provided by Mattermost — do NOT bundle them
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        redux: 'Redux',
        'react-redux': 'ReactRedux',
        'prop-types': 'PropTypes',
    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: 'main.js',
    },
};
