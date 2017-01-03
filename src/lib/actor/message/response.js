/*
 * Parsec
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

class Response {
    
    // :: ('a -> ()) -> ('b -> ()) -> (() -> ()) -> Response 'a 'b
    constructor(success, failure, timeout) {
        this._success = success;
        this._failure = failure;
        this._timeout = timeout
    }
    
    // :: 'a -> ()    
    success(value) {
        this._success(value);           
    }
    
    // :: 'b -> ()    
    failure(value) {
        this._failure(value);               
    }
        
    // :: () -> ()    
    timeout() {
        this._timeout();               
    }    
}

// :: ('a -> ()) -> ('b -> ()) -> (() -> ()) -> Response 'a 'b throws ReferenceError
function response(success, failure, timeout) {
    objects.requireNonNull(success, "success")
    objects.requireNonNull(failure, "failure")
    objects.requireNonNull(timeout, "timeout")
    
    return new Response(success, failure, timeout);        
}

export default response
