/**
 *
 * @public
 * @namespace App
 * @description constructs and initializes all core modules
 *
 */

import * as core from "./src/core/index.js";
import $ from "jquery-slim";

class App_Build {
    constructor() {
        core.controller.init();
    }
};

const App = new App_Build();


