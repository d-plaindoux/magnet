/*
 * Parsec
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

class Response {
    
    // :: ('a -> unit ) -> ('b -> unit  -> (unit -> unit) -> Response 'a 'b
    constructor(success, failure, timeout) {
        this._success = success;
        this._failure = failure;
        this._timeout = timeout
    }
    
    // :: 'a -> unit   
    success(value) {
        this._success(value);           
    }
    
    // :: 'b -> unit  
    failure(value) {
        this._failure(value);               
    }
        
    // :: unit -> unit   
    timeout() {
        this._timeout();               
    }    
}

// :: ('a -> unit ) -> ('b -> unit ) -> (unit  -> unit ) -> Response 'a 'b throws ReferenceError
function response(success, failure, timeout) {
    objects.requireNonNull(success, "success")
    objects.requireNonNull(failure, "failure")
    objects.requireNonNull(timeout, "timeout")
    
    return new Response(success, failure, timeout);        
}

export default response
