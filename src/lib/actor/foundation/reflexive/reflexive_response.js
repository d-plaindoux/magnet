/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../../utils/objects";

class ReflexiveResponse {
    
    // :: (Any) -> ReflexiveResponse
    constructor(data) {
        this._data = data;
    }
    
    // :: unit -> string
    data() {
        return this._data;
    }
}

// :: (Any) -> ReflexiveResponse
function reflexiveResponse(data) {
    return new ReflexiveResponse(data);
}

export default reflexiveResponse;
