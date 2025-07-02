/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
  return {
    verbose: true,
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    // transformIgnorePatterns: [
    //   'node_modules/(?!(zod|@hookform)/)', // 👈 Allow zod and @hookform to be transformed
    // ],
    // jest.config.js
    transformIgnorePatterns: ['/node_modules/(?!(.*@tanstack/react-router).*)'],

    testEnvironment: 'jsdom',
  };
};
