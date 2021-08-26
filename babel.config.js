module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
    "next"
  ],
  plugins: [["styled-components", { "ssr": true }]],
  env: {
    dev: {
      plugins: [
        [
          "babel-plugin-styled-components",
          {
            "ssr": false,
            "displayName": false
          }
        ],
        ["@babel/plugin-transform-react-jsx", 
          { 
            "pragma":"h" 
          }
        ],
        '@babel/plugin-syntax-dynamic-import',
      ]
    }
  }
};