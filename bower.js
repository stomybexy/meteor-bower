// Write your package code here!
var fs = Npm.require("fs");




function BowerCompiler() {
}

BowerCompiler.prototype.processFilesForTarget = function (files) {
    if(process.env.NO_BOWER_INSTALL){
        console.log('Skipping bower dependencies install...');
        return;
    }
    var globalCfg = {}; // Get .bowerrc
    try {
        globalCfg = JSON.parse(fs.readFileSync('public/.bowerrc', 'utf8'));
        // console.log(globalCfg);
    } catch (e) {
        // console.log(e)
        globalCfg = {}
    }

    var directory = globalCfg.directory || ('/public' + '/bower_components');
    console.log("Installing bower dependencies into", directory ,"... ");
    files.forEach(function (file) {
        
        try {
            var config = JSON.parse(file.getContentsAsString());
        } catch (e) {
            // console.log("failed to parse bower.json ", e);
            file.error({
                message: 'failed to parse bower.json : ' + e
            });
            return;
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
            var errors = []
            // Try to install packages offline first.
            try {
                Bower.install(dependencies, { offline: true, save: true, forceLatest: true }, { directory: directory });

            } catch (e) {
                errors.push(e);
                // console.log(e);

                // In case of failure, try to fetch packages online
                try {
                    Bower.install(dependencies, { save: true, forceLatest: true }, { directory: directory });
                } catch (f) {
                    errors.push(f);
                    // console.log(errors); 
                    file.error({
                        message: 'error installing bower dependencies : ' + errors
                    });
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