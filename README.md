# Magnet

[![Build Status](https://travis-ci.org/d-plaindoux/magnet.svg?branch=master)](https://travis-ci.org/d-plaindoux/magnet)
[![Coverage Status](https://coveralls.io/repos/github/d-plaindoux/magnet/badge.svg?branch=master)](https://coveralls.io/github/d-plaindoux/magnet?branch=master)
[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

## Introduction

Magnet is a simple library dedicated to aynchronous and distributed execution 
based on agent management thanks to a coordinator component.

### Hello World!

An agent has the capability to communicate with a model. Such model can
be a simple class or a function. Finally a model can interact with other
agent or can simply create or manage existing agents.

#### The Functional style

```javascript
function hello(request, response) {
    response.success("Hello " + request + "!");
}
```

Then such function can simply managed by an agent and hosted by a given 
coordinator.

```javascript
const aCoordinator = coordinator();

aCoordinator.agent("hello").bind(hello);
```

#### The Object-Oriented style

```javascript
class Hello {
    accept(request, response) {
        response.success("Hello " + request + "!");
    }
}
```

```javascript
const aCoordinator = coordinator();

aCoordinator.agent("hello").bind(new Hello());
```

#### Asking `World` job to the `hello` agent

```javascript
const aResponse = response(v => console.log(v));

aCoordinator.ask("hello", "World", aResponse);
```

## License

Copyright (C)2017 D. Plaindoux.

This program is  free software; you can redistribute  it and/or modify
it  under the  terms  of  the GNU  Lesser  General  Public License  as
published by  the Free Software  Foundation; either version 2,  or (at
your option) any later version.

This program  is distributed in the  hope that it will  be useful, but
WITHOUT   ANY  WARRANTY;   without  even   the  implied   warranty  of
MERCHANTABILITY  or FITNESS  FOR  A PARTICULAR  PURPOSE.  See the  GNU
Lesser General Public License for more details.

You  should have  received a  copy of  the GNU  Lesser General  Public
License along with  this program; see the file COPYING.  If not, write
to the  Free Software Foundation,  675 Mass Ave, Cambridge,  MA 02139,
USA.




