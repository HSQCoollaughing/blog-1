

module.export = function (name) {
    return function (msg) {
        if(process.env.DEBUG== name){
            console.log(msg);
        }
    }
};
