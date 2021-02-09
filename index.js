const {Root} = require("ndtreejs").ndcls
const fac_bsc = require("nv-facutil-basic");


const STATE_DICT = {
    init:"init",
    pending:"pending",
    resolved:"resolved",
    rejected:"rejected",
    impossible:"impossible",
    paused:"paused",
    stopped:"stopped"
}

/*
class Init { [util.inspect.custom] () { return("<init>")}}
const INIT = new Init();
class Pending { [util.inspect.custom] () { return("<pending>")}}
const PENDING = new Pending();
*/

const ERROR_DICT = {
    resolved:new Error("use-rslt-or-final"),
    rejected:new Error("use-rejected-or-final"),
    in_executing:new Error("still-in-executing-use-force-reset"),
    need_reset:new Error("reset-before-relaunch")
}

const DFLT_EXEC = (rs,rj,that)=>{}
const SYM_EXEC = Symbol("exec")
const SYM_TASK_NAME = Symbol("task_name")
const SYM_TYPE = Symbol("type")
const SYM_PROMISE = Symbol("promise");

const TYPE_DICT = {
    root:"root",
    then:"then",
    "catch":"catch"
}


const SYM_RESET = Symbol("reset")
const SYM_RESET_EXEC = Symbol("reset_exec")
const SYM_READY = Symbol("ready")

const SYM_IMPOSSIBLE = Symbol("impossible")
const SYM_SET_IMPOSSIBLE = Symbol("set_impossible")
const SYM_UNSET_IMPOSSIBLE = Symbol("unset_impossible")


function _set_impossible(nd) {
    let sdfs = nd.$sdfs()
    sdfs.forEach(nd=>nd[SYM_SET_IMPOSSIBLE]())
}


function _run_children(that) {
    let then = that.then;
    let cth = that.catch;
    if(then!==null && that.is_resolved()) {
        if(cth!==null) {_set_impossible(cth);}
        then[SYM_EXEC]();
    }
    if(cth!==null && that.is_rejected()) {
        if(then !==null) {_set_impossible(then);}
        cth[SYM_EXEC]();
    }
}

function _is_in_executing(sdfs) {
    for(let nd of sdfs) {
        if(nd.state === 'pending') {return(true)}
    } 
    return(false)
}

function _check_one_state(nd) {
    let name = nd[SYM_TASK_NAME]
    let typ = nd[SYM_TYPE]
    let state = nd.state 
    let indent = "    ".repeat(nd.$depth())
    let tem = `${indent}${name}[${typ}] Promise \{ <${state}> \} `
    return(tem)
}


class _BtdPromise extends Root {
    #type = "root"
    #p
    #rs
    #rj
    #exec
    #state = "init"
    #rslt
    #exception
    constructor(f=DFLT_EXEC) {
        super();
        this.#exec = f
        this.#p = new Promise((rs,rj)=>{this.#rs = rs;this.#rj = rj});
    }
    get [SYM_PROMISE]() {return(this.#p)}
    [SYM_READY]() {this.#state = "pending"}
    [SYM_RESET_EXEC] (f) {this.#exec = f}
    [SYM_RESET]() {
        this.#p = new Promise((rs,rj)=>{this.#rs = rs;this.#rj = rj});
        this.#rslt = undefined;
        this.#exception = undefined;
        this.#state = "init"
        delete this.#p[SYM_IMPOSSIBLE]
    }
    set [SYM_TYPE](typ) { this.#type = typ}
    get [SYM_TYPE]()    {return(this.#type)}
    [SYM_SET_IMPOSSIBLE]() {
        this.#p[SYM_IMPOSSIBLE]=true;
        this.#state = "impossible"
    }
    [SYM_UNSET_IMPOSSIBLE]() {
        delete this.#p[SYM_IMPOSSIBLE]
        this.#state = "init"
    }
    set then(f) {
        let children = this.$children();
        let lngth = children.length;
        if(lngth === 0) {
            let then = new _BtdPromise(f);
            then[SYM_TYPE] = 'then'
            this.$prepend_child(then);
        } else if(lngth ===1) {
            let child = children[0];
            if(child[SYM_TYPE] === 'then') {
                child[SYM_RESET]();
                child[SYM_RESET_EXEC](f);
            } else {
                let then = new _BtdPromise(f);
                then[SYM_TYPE] = 'then';
                this.$prepend_child(then);
            }
        } else {
            let child = children[0];
            child[SYM_RESET]();
            child[SYM_RESET_EXEC](f);
        }
    }
    get then() {
        let child = this.$fstch();
        if(child!==null && child[SYM_TYPE]==='then') {
            return(child)
        } else {
            return(null)
        }
    }
    set catch(f) {
        let children = this.$children();
        let lngth = children.length;
        if(lngth === 0) {
            let cth = new _BtdPromise(f);
            cth[SYM_TYPE] = 'catch'
            this.$append_child(cth);
        } else if(lngth ===1) {
            let child = children[0];
            if(child[SYM_TYPE] === 'catch') {
                child[SYM_RESET]();
                child[SYM_RESET_EXEC](f);
            } else {
                let cth = new _BtdPromise(f);
                cth[SYM_TYPE] = 'catch'
                this.$append_child(cth);            
            }
        } else {
            let child = children[1];
            child[SYM_RESET]();
            child[SYM_RESET_EXEC](f);
        }
    }
    get catch() {
        let child = this.$lstch();
        if(child!==null && child[SYM_TYPE]==='catch') {
            return(child)
        } else {
            return(null)
        }        
    }
    set both(f) {this.then =f;this.catch = f;}
    get both() {return({then:this.then,"catch":this.catch})}
    finally(f) {this.#p.finally(f)}
    get [SYM_TASK_NAME] () {return(this.#exec.name)}
    [SYM_EXEC]() {
        if(this.#state === 'pending') {
            this.#exec(this.#rs,this.#rj,this);
            this.#p.then(
                r=>{
                    this.#state = "resolved";
                    this.#rslt = r;
                    _run_children(this);
                }
            ).catch(
                err=>{
                    this.#state="rejected"
                    this.#exception = err
                    _run_children(this);
                }
            )
        } else {
        }
    }
    get rslt() {
        if(this.#state === "resolved") {
            return(this.#rslt)
        } else if(this.#state === "rejected") {
            throw(ERROR_DICT.rejected)
        } else {

        }
    }
    get exception() {
        if(this.#state === "rejected") {
            return(this.#exception)
        } else if(this.#state === "resolved"){
            throw(ERROR_DICT.resolved)
        } else {
        }
    }
    get final() {
        if(this.#state === "resolved") {
            return(this.#rslt)
        } else if(this.#state === "rejected") {
            return(this.#exception)
        } else {
        }
    }
    get state() {return(this.#state)}
    is_settled() {return(this.#state !== "pending")}
    is_pending() {return(this.#state === "pending")}
    is_resolved() {return(this.#state === "resolved")}
    is_rejected() {return(this.#state === "rejected")}
}

function _repr(that) {
    return({promise:that[SYM_PROMISE],task:that[SYM_TASK_NAME]})
}

fac_bsc.add_repr(_BtdPromise,_repr)


class BtdPromise extends _BtdPromise {
    launch() {
        if(this.state==="init" || ! _is_in_executing(this.$sdfs())){
            let sdfs = this.$sdfs();
            sdfs.forEach(nd=>nd[SYM_READY]());
            this[SYM_EXEC]();
        } else {
            throw(ERROR_DICT.need_reset);
        }
    }
    reset(force=false) {
        let sdfs = this.$sdfs()
        if(force) {
            sdfs.forEach(nd=>nd[SYM_RESET]())
        } else {
            let cond = _is_in_executing(sdfs)
            if(cond) {
                throw(ERROR_DICT.in_executing)
            } else {
                sdfs.forEach(nd=>nd[SYM_RESET]())
            }
        }
    }
    is_in_executing() { return(_is_in_executing(this.$sdfs()))}
    check_state() {
        let sdfs = this.$sdfs()
        for(let i=0;i<sdfs.length;i++) {console.log(_check_one_state(sdfs[i]))}
    }
    get exec_routes() {
        let sdfs = this.$sdfs()
        sdfs = sdfs.filter(nd=>nd.state!=="impossible")
        sdfs = sdfs.filter(nd=>nd.$is_leaf())
        let routes =sdfs.map(
            nd=>{
                let route = nd.$ances(true);
                route.reverse();
                return(route)
            }
        );
        return(routes)
    }
    [Symbol.iterator]() { return(this.$sdfs()[Symbol.iterator]())}

}

module.exports = {
    BtdPromise,
    ERROR_DICT,
    STATE_DICT,
}
