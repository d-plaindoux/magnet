/*
 * Parsec
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

class Request {
    
    // :: (string,[Any]) -> Request
    constructor(name, parameters) {
        this._name = name;
        this._parameters = parameters;
    }
    
    // :: unit -> string
    name() {
        return this._name;
    }
    
    // :: unit -> [Any]
    parameters() {
        return this._parameters;
    }
}

// :: (string,[Any]) -> Request throws ReferenceError 
function request(name, parameters) {
    objects.requireNonNull(name, "name")
    objects.requireNonNull(parameters, "parameters")

    return new Request(name, parameters);
}

export default request
