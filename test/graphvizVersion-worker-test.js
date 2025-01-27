var tape = require("tape");
var jsdom = require("./jsdom");
var d3_graphviz = require("../");
var Worker = require("tiny-worker");

tape("graphviz().graphvizVersion() returns the Graphviz version.", function (test) {

    var window = global.window = jsdom(
        `
            <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
            <div id="graph"></div>
            `,
    );
    var document = global.document = window.document;
    var Blob = global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    var createObjectURL = window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz.graphviz("#graph", { useWorker: true })
        .on("initEnd", startTest);

    function startTest() {
        const version = graphviz.graphvizVersion();
        if (version == undefined) {
            test.fail("version is not defined")
        }
        else {
            const [major, minor, patch] = version.split('.');
            test.ok(!isNaN(major), 'Major version number is a number');
            test.ok(!isNaN(minor), 'Minor version number is a number');
            test.ok(!isNaN(patch), 'Patch version number is a number');
        }

        graphviz._worker.terminate();
        global.Worker = undefined;
        test.end();
    }
});
