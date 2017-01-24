/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

class ResponseHandler {
    
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
function responseHandler(success, failure, timeout) {
    return new ResponseHandler(success || (_ => null), failure || (_ => null), timeout || (_ => null));        
}

export default responseHandler;