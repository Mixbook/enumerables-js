export default {
  entry: './build/src/main.js',
  targets: [
    {dest: 'dist/main.cjs.js', format: 'cjs'},
    {dest: 'dist/main.es.js', format: 'es'}
  ]
};
