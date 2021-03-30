module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'impliedStrict': true,
      'experimentalObjectRestSpread': true,
      'jsx': true
    }
  },
  'plugins': [
    'react',
    'babel'
  ],
  'settings': {
    'react': {
      'pragma': 'React'
    }
  },
  'parser': 'babel-eslint',
  'rules': {
    'strict': 1,
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1
      }
    ],
    'quotes': [
      2,
      'single'
    ],
    'semi': [
      2,
      'never'
    ],
    'brace-style': [
      2,
      '1tbs',
      {
        'allowSingleLine': true
      }
    ],
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'curly': [
      'error',
      'multi-line'
    ],
    'react-in-jsx-scope': 0,
    'react/prop-types': 0,
    'jsx-uses-react': 0,
    'jsx-uses-vars': 0,
    'default-case': 2,
    'no-warning-comments': [
      'warn',
      {
        'terms': [
          'todo',
          'fixme'
        ],
        'location': 'anywhere'
      }
    ]
  }
}