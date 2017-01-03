/*
 * Parsec
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from '../../utils/objects';

class Coordinator {
    
    // :: Logger -> Coordinator
    constructor(logger) {
        this._logger = logger;
    }
    
}

// :: Logger -> Coordinator throws ReferenceError
function coordinator(logger) {
    objects.requireNonNull(logger, "logger");
    
    return new Coordinator();
}

export default {
    coordinator
}