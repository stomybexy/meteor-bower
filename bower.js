// Write your package code here!
var fs = Npm.require("fs");




function BowerCompiler() {
}

BowerCompiler.prototype.processFilesForTarget = function (files) {
    var globalCfg = {}; // Get .bowerrc
    try {
        globalCfg = JSON.parse(fs.readFileSync('public/.bowerrc', 'utf8'));
        console.log(globalCfg);
    } catch (e) {
        console.log(e)
        globalCfg = {}
    }

    var directory = globalCfg.directory || ('/public' + '/bower_components');
    files.forEach(function (file) {
        console.log("Installing bower dependencies ... ");
        try {
            var config = JSON.parse(file.getContentsAsString());
        } catch (e) {
            console.err("failed to parse bower.json ", e);
        }


        config.dependencies = config.dependencies || [];


        // install dependencies
        var dependencies = _.map(config.dependencies, function (definition, name) {
            if (!_.isString(definition))
                console.error('invalid bower dependency', definition);

            if (definition.indexOf('/') !== -1)
                return name + "=" + definition;
            else
                return name + "#" + definition;
        })


        if (dependencies.length) {
            
            // Try to install packages offline first.
            try {
                Bower.install(dependencies, { offline: true, save: true, forceLatest: true }, { directory: directory });

            } catch (e) {
                console.log(e);

                // In case of failure, try to fetch packages online
                try {
                    Bower.install(dependencies, { save: true, forceLatest: true }, { directory: directory });
                } catch (f) {
                    console.log(f);
                }
            }

        };


    });
};

Plugin.registerCompiler({
    filenames: ["bower.json"],
    archMatching: 'web'
}, function () {
    var compiler = new BowerCompiler();
    return compiler;
});