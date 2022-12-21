const mix = require('laravel-mix');

mix
  .sourceMaps(true, 'source-map')
  .js('src/js/app.js', 'assets')
  .postCss('src/styles/main.css', 'assets', [
    require('tailwindcss')
  ])

if(!mix.inProduction()){
  mix.webpackConfig({
    devtool: 'inline-source-map'
  })
}  

