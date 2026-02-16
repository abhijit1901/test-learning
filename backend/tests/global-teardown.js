// tests/global-teardown.js
module.exports = async () => {
  // We don't need a global teardown for this setup 
  // because Testcontainers cleans itself up in afterAll().
  // But Jest requires this file to exist and export a function.
  console.log('Global teardown complete.');
};