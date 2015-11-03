Package.describe({
  name: 'gfk:gridstack',
  version: '0.0.1',
  summary: 'Gridstack.js wrapped for easy use with meteor',
  git: 'https://github.com/gfk-ba/meteor-gridstack.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.use([
    'ecmascript',
    'jquery',
    'underscore',
    'templating',
    'twbs:bootstrap@3.3.5'
  ]);

  api.addFiles([
    'client/lib/gridstack.css',
    'client/lib/gridstack.js',
    'client/gridstack.html',
    'client/gridstack.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use([
    'mdj:template-test-helpers@0.2.0',
    'jquery',
    'ecmascript',
    'mike:mocha-package@0.5.8',
    'practicalmeteor:sinon',
    'practicalmeteor:chai',
    'templating',
    'gfk:gridstack',
    'underscore'
  ]);

  api.addFiles([
    'test/client/gridstack.test.js'
  ], 'client');
});
