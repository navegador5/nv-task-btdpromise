nv-array-combo
============
- nv-array-combo 
- a very simple tool for combination and permutation

install
=======
- npm install nv-array-combo 

usage
=====
    
example
-------

    const ary_com = require("nv-array-combo")
    var arr = ['a','b','c']
    var g = ary_com.comb(arr)
    g.next().value
    //[]
    g.next().value
    //[ 'a' ]
    g.next().value
    //[ 'b' ]
    g.next().value
    //[ 'a', 'b' ]
    var g = ary_com.comb(arr)
    Array.from(g).sort()
    /*
    [
      [],
      [ 'a' ],
      [ 'a', 'b' ],
      [ 'a', 'b', 'c' ],
      [ 'a', 'c' ],
      [ 'b' ],
      [ 'b', 'c' ],
      [ 'c' ]
    ]
    */


    var arr =["a","b","c"]
    var g = ary_com.perm(arr)
    /*
    > g.next()
    { value: [ 'a', 'b', 'c' ], done: false }
    > g.next()
    { value: [ 'a', 'c', 'b' ], done: false }
    > g.next()
    { value: [ 'b', 'a', 'c' ], done: false }
    > g.next()
    { value: [ 'c', 'a', 'b' ], done: false }
    > g.next()
    { value: [ 'b', 'c', 'a' ], done: false }
    > g.next()
    { value: [ 'c', 'b', 'a' ], done: false }
    > g.next()
    { value: undefined, done: true }

    */
    var g = ary_com.perm(arr)
    Array.from(g)
    /*
    [
      [ 'a', 'b', 'c' ],
      [ 'a', 'c', 'b' ],
      [ 'b', 'a', 'c' ],
      [ 'c', 'a', 'b' ],
      [ 'b', 'c', 'a' ],
      [ 'c', 'b', 'a' ]
    ]
    */



API
====

- ary\_com.comb(arr) 
- ary\_com.perm(arr)


LICENSE
=======
- ISC 
