// set up global test settings here
// Fail tests on any warning
console.error = message => {
  throw new Error(message);
};
