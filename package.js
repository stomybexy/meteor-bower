Package.describe({
    name: 'jonatan:bower',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Add bower dependencies in meteor packages.',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/stomybexy/meteor-bower.git',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use("isobuild:compiler-plugin@1.0.0");

});


Package.registerBuildPlugin({
    name: "bower-compiler",
    use: [
        "meteor",
        "underscore@1.0.4"
    ],
    npmDependencies: {
        "bower": "1.7.7"
    },
    sources: [
        "installer.js",
        "bower.js"
    ]
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('jonatan:bower');
    api.addFiles('bower-tests.js');
});
