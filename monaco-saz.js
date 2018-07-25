function sazTokensProvider() {

// Difficulty: "Easy"
// Language definition for Java
return {
  // Set defaultToken to invalid to see what you do not tokenize yet
  // defaultToken: 'invalid',

  keywords: [
    'ali', 'başqa', 'doğru', 'heç', 'işləv', 'nəqədərki', 'qaytar', 'sinif', 'və', 'vəya',
    'yanlış', 'yerli', 'üçün', 'əgər'
  ],

  typeKeywords: [
    'boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float'
  ],

  operators: [
    '=', '>', '<', '!', '~', '?', ':',
    '==', '<=', '>=', '!=', '&&', '||', '++', '--',
    '+', '-', '*', '/', '&', '|', '^', '%', '<<',
    '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=',
    '^=', '%=', '<<=', '>>=', '>>>='
  ],

  // we include these common regular expressions
  symbols:  /[=><!~?:&|+\-*\/\^%]+/,
  escapes:  /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/([a-z_$]|[^\x00-\x7F])([\w$]|[^\x00-\x7F])*/, { cases: { '@typeKeywords': 'keyword',
                                   '@keywords': 'keyword',
                                   '@default': 'identifier' } }],
      [/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely

      // whitespace
      { include: '@whitespace' },

      // delimiters and operators
      [/[{}()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/@symbols/, { cases: { '@operators': 'operator',
                              '@default'  : '' } } ],

      // @ annotations.
      // As an example, we emit a debugging log message on these tokens.
      // Note: message are supressed during the first load -- change some lines to see them.
      [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],

      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
      [/0[xX][0-9a-fA-F_]*[0-9a-fA-F][Ll]?/, 'number.hex'],
      [/0[0-7_]*[0-7][Ll]?/, 'number.octal'],
      [/0[bB][0-1_]*[0-1][Ll]?/, 'number.binary'],
      [/\d+[lL]?/, 'number'],

      // delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
      [/"/,  'string', '@string' ],

      // characters
      [/'[^\\']'/, 'string'],
      [/(')(@escapes)(')/, ['string','string.escape','string']],
      [/'/, 'string.invalid']
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/,       'comment', '@comment' ],
      [/\/\/.*$/,    'comment'],
    ],

    comment: [
      [/[^\/*]+/, 'comment' ],
      // [/\/\*/, 'comment', '@push' ],    // nested comment not allowed :-(
      [/\/\*/,    'comment.invalid' ],
      ["\\*/",    'comment', '@pop'  ],
      [/[\/*]/,   'comment' ]
    ],

    string: [
      [/[^\\"]+/,  'string'],
      [/@escapes/, 'string.escape'],
      [/\\./,      'string.escape.invalid'],
      [/"/,        'string', '@pop' ]
    ],
  },
};
}


function sazCompletionProvider()
{
return {
  provideCompletionItems: () => {
    return [
      {
        label: 'əgərbaşqa',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            'əgər (${1:şərt}) {',
            '\t$0',
            '} başqa {',
            '\t',
            '}'
          ].join('\n')
        }
      },
      {
        label: 'əgər',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            'əgər (${1:doğru}) {',
            '\t${0:// gövdə...}',
            '}'
          ].join('\n')
        }
      },
      {
        label: 'işləv',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            'işləv ${1:ad}(${2:arqument}) {',
            '\t${0:// gövdə...}',
            '}'
          ].join('\n')
        }
      },
      {
        label: 'nəqədərki',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            'nəqədərki (${1:doğru}) {',
            '\t${0:// gövdə...}',
            '}'
          ].join('\n')
        }
      },
      {
        label: 'üçün',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            'üçün (yerli ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {',
            '\t${0:// gövdə...}',
            '}'
          ].join('\n')
        }
      },
      {
        label: 'sinif',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            'sinif ${1:A}${2: < ${3:B}} {',
            '\tqurucu(${4:arg}) {',
            '\t\t${0}',
            '\t}',
            '}'
          ].join('\n')
        }
      }
    ]
  }
}
}