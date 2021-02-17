const {BtdPromise} = require("./index")
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

var p = new BtdPromise(tsk0);
p.then = tsk1;
p.catch = tsk2;

p.then.then = tsk3
p.then.catch = tsk4

p.catch.then = tsk5
p.catch.catch = tsk6

p.launch();
p.exec_routes
p.check_state()
Array.from(p)
p.reset(true) 
p.launch();


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
Array.from(p)
Array.from(p)[3]


