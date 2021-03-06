/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

class ResponseHandler {

    // :: ('a -> unit ) -> (Error -> unit)  -> (unit -> unit) -> Response 'a
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

    // :: Promise -> Promise
    bind(promise) {
        return promise.then(this._success, this._failure);
    }
}

// :: ('a -> unit ) -> (Error -> unit ) -> (unit  -> unit ) -> Response 'a throws ReferenceError
function responseHandler(success=(_ => null), failure=(_ => null), timeout=(_ => null)) {
    return new ResponseHandler(success, failure, timeout);
}

export default responseHandler;
