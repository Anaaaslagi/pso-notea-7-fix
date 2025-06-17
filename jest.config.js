// export default {
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//   moduleNameMapper: {
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//     '^@/(.*)$': '<rootDir>/src/$1'
//   },
// };


// export default {
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//   moduleNameMapper: {
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//     '^@/(.*)$': '<rootDir>/src/$1'
//   },
//   testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
//   transform: {
//     '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
//   }
// };


export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/public/',
    '<rootDir>/coverage/',
    '<rootDir>/src/pages/_app.js',
    '<rootDir>/src/pages/_document.js',
    '<rootDir>/src/pages/api/',
    '<rootDir>/src/pages/about.js',
    '<rootDir>/src/pages/new.js',
    'sentry-example-page.js'
  ],
  collectCoverageFrom: [
    'src/pages/**/*.{js,jsx,ts,tsx}',
    'src/lib/**/*.{js,jsx,ts,tsx}',
    '!src/pages/_*.js',
    '!src/pages/api/**',
    '!src/pages/about.js',
    '!src/pages/new.js',
    '!**/*.config.js',
    '!**/*.setup.js',
    '!src/pages/sentry-example-page.js'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  }
};