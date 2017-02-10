/**
 *
 * @public
 * @namespace App
 * @description constructs and initializes all core modules
 *
 */

import * as core from "./source/core/index.js";
import $ from "jquery";

class App_Build {
    constructor() {
        core.controller.init();
    }
};

const App = new App_Build();


