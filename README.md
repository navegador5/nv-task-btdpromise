nv-task-btdpromise
==================
- nv-task-btdpromise  is for promise-tree 
- original-promise or async/await is boring to do tree-relation-dependancy coding


install
=======
- npm install nv-task-btdpromise 

usage
=====
     
     const {BtdPromise} = require("nv-task-btdpromise");

     //for-exzample ,we have 7 tasks as following dependancy relations
         tsk0
             <then>tsk1 
                <then>tsk3 
                <catch>tsk4
             <catch>tsk2
                <then>tsk5 
                <catch>tsk6     
 
     //each task is :   (resolve,reject,[self]) => {/*...your code...*/}
     //self is optional for passing result , its the internal-node-of-the-task

     //what your need do is schedule-tasks based on their tree-relation

         var p = new BtdPromise(tsk0);
         p.then = tsk1;
         p.then.then = tsk3;
         p.then.catch = tsk4;
         p.catch = tsk2;
         p.catch.then = tsk5;
         p.catch.catch = tsk6
     
         p.launch();

    
example
-------


###get your tasks ready

    var tsk0 = function(rs,rj) {
        setTimeout(
            ()=>{console.log("root task statrted after 8s ");rs("succ0")},
            8000
        )
    }

    var tsk1 = function(rs,rj) {
        setTimeout(
            ()=>{console.log("tsk1 succ after 5s");rs("succ1")},
            5000
        )
    }

    var tsk2 = function(rs,rj) {
        setTimeout(
            ()=>{console.log("tsk2 fail after 3s");rj("fail2")},
            3000
        )
    }


    var tsk3 = function(rs,rj) {
        setTimeout(
            ()=>{console.log("tsk3 succ after 3s");rs("succ3")},
            3000
        )
    }

    var tsk4 = function(rs,rj) {
        setTimeout(
            ()=>{console.log("tsk4 fail after 5s");rj("fail4")},
            5000
        )
    }

    var tsk5 = function(rs,rj) {
        setTimeout(
            ()=>{console.log("tsk5 succ after 5s");rs("succ5")},
            5000
        )
    }

    var tsk6 = function(rs,rj) {
        setTimeout(
            ()=>{console.log("tsk6 fail after 5s");rj("fail6")},
            5000
        )
    }


### add them to promise-tree

    var p = new BtdPromise(tsk0);
    p.then = tsk1;
    p.catch = tsk2;
    
    p.then.then = tsk3
    p.then.catch = tsk4
    
    p.catch.then = tsk5
    p.catch.catch = tsk6

### launch it

    p.launch();
    >
    root task statrted after 8s
    tsk1 succ after 5s
    tsk3 succ after 3s

### check the exec\_routes

    > p.exec_routes
    [
      [
        { promise: [Promise], task: 'tsk0' },
        { promise: [Promise], task: 'tsk1' },
        { promise: [Promise], task: 'tsk3' }
      ]
    ]
    >

### check the state and tree-relaion at any time

    > p.check_state()
    tsk0[root] Promise { <resolved> }
        tsk1[then] Promise { <resolved> }
            tsk3[then] Promise { <resolved> }
            tsk4[catch] Promise { <impossible> }
        tsk2[catch] Promise { <impossible> }
            tsk5[then] Promise { <impossible> }
            tsk6[catch] Promise { <impossible> }
    >

### iterator of all tasks (based on dfs-sequence)

    > Array.from(p)
    [
      { promise: Promise { 'succ0' }, task: 'tsk0' },
      { promise: Promise { 'succ1' }, task: 'tsk1' },
      { promise: Promise { 'succ3' }, task: 'tsk3' },
      {
        promise: Promise { <pending>, [Symbol(impossible)]: true },
        task: 'tsk4'
      },
      {
        promise: Promise { <pending>, [Symbol(impossible)]: true },
        task: 'tsk2'
      },
      {
        promise: Promise { <pending>, [Symbol(impossible)]: true },
        task: 'tsk5'
      },
      {
        promise: Promise { <pending>, [Symbol(impossible)]: true },
        task: 'tsk6'
      }
    ]
    >


### reset

    var force = true
    p.reset(force) //force will ignore all non-started-task
    p.launch();
    >
    root task statrted after 8s
    tsk1 succ after 5s
    tsk3 succ after 3s


### pass rslt to children

    var tsk0 = function(rs,rj) {
        setTimeout(
            ()=>{console.log("root task statrted after 8s ");rs(100)},
            8000
        )
    }


    var tsk1 = function(rs,rj,self) {
        setTimeout(
            ()=>{
                console.log("tsk1 succ after 5s");
                let parent = self.$parent()   //  parent corresponding to internal-node-of-tsk0
                rs(parent.rslt+200)
            },
            5000
        )
    }

    var tsk2 = function(rs,rj,self) {
        setTimeout(
            ()=>{
                console.log("tsk2 succ after 5s");
                let parent = self.$parent()   //  parent corresponding to internal-node-of-tsk1
                rs(parent.rslt+300)
            },
            5000
        )
    }

    var tsk3 = function(rs,rj,self) {
        setTimeout(
            ()=>{
                console.log("tsk3 succ after 5s");
                let include_self = false
                let ances = self.$ances(include_self)   //  ances corresponding to internal-node-of-ancestors
                rs(ances.map(r=>r.rslt))
            },
            5000
        )
    }


     var p = new BtdPromise(tsk0);
     p.then = tsk1                     
     p.then.then = tsk2             
     p.then.then.then = tsk3
     p.launch()

    > Array.from(p)
    [
      { promise: Promise { 100 }, task: 'tsk0' },
      { promise: Promise { 300 }, task: 'tsk1' },
      { promise: Promise { 600 }, task: 'tsk2' },
      { promise: Promise { [Array] }, task: 'tsk3' },
    ]
    >

    > Array.from(p)[3]
    { promise: Promise { [ 600, 300, 100 ] }, task: 'tsk3' }
    >


METHODS
=======
    
    p.launch               p.reset   
    p.check_state          p.exec_routes
    p[Symbol.iterator]

    p.is_in_executing

NODE METHODS
============

    p.rslt                  p.exception             p.final
    
    p.state
    p.is_pending            p.is_rejected           p.is_resolved
    p.is_settled            
    
     

APIS
====
- btdprom.BtdPromise
- btdprom.ERROR\_DICT
- btdprom.STATE\_DICT 


LICENSE
=======
- ISC 
