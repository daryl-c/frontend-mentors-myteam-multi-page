module.exports = config => {

  // Set directories to pass through to the dist folder
  config.addPassthroughCopy('./src/images/');

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};
