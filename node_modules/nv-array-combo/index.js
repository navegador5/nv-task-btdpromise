const ary_bsc = require("nv-array-basic")
const dummy = Symbol('dummy')


function * comb (arr) {
    for(let i=0;i<2**arr.length;i++) {
        let b = ary_bsc.bin(i,arr.length).reverse()
        let rslt = arr.filter((r,i)=>b[i]===1)
        yield(rslt)
    }
}


function is_leaf(o) {return(o.cache.filter(r=>r===dummy).length===0)}

function is_root(o) {return(o.depth === 0)}

function creat_root(arr){
    let cache = Array.from({length:arr.length}).map(r=>dummy)
    let entries = Object.entries(arr).map(
        r=>([
            parseInt(r[0]),
            {
                origi:parseInt(r[0]),
                cachei:null,
                origv:r[1],
            }
        ])
    )
    let o = {
        desc:Object.fromEntries(entries),
        cache:cache,
        ctrl:null,    //层控制元素
        depth:0
    }
    return(o)
}

function get_fstch(o) {
    let index = o.cache.indexOf(dummy)
    if(index>=0) {
        o.ctrl = o.desc[o.depth]
        o.ctrl.cachei = index
        o.cache[index] = o.ctrl
        o.depth = o.depth+1
        return(o)
    } else {
        return(null)
    }
}

function get_parent(o) {
    if(!is_root(o)) {
        let porigi = o.ctrl.origi - 1
        let pctrl = (porigi>=0)?o.desc[porigi]:null
        //清除cache
        let cachei = o.ctrl.cachei
        o.cache[cachei] = dummy
        o.ctrl.cachei = null
        o.ctrl = pctrl
        o.depth = o.depth-1
        return(o)
    } else {
        return(null)
    }
}

function find_rsib_cachei(o) {
    if(o.ctrl === null) {return(null)}
    let cachei = o.ctrl.cachei
    let rsib_cachei = cachei +1
    let succ = false
    while(rsib_cachei < o.cache.length) {
        let cond = (o.cache[rsib_cachei] === dummy)
        if(cond){
            succ = true
            break
        } else {
            rsib_cachei = rsib_cachei + 1
        }
    }
    if(succ) {
        return(rsib_cachei)
    } else {
        return(null)
    }
}


function get_rsib(o) {
    let rsib_cachei = find_rsib_cachei(o)
    if(rsib_cachei !== null) {
        o.cache[o.ctrl.cachei] = dummy
        o.cache[rsib_cachei] = o.ctrl
        o.ctrl.cachei = rsib_cachei
        return(o)
    } else {
        return(null)
    }
}


function get_nearest_prsib(o) {
    let p = get_parent(o)
    while(p!==null) {
        let rsib = get_rsib(p)
        if(rsib!==null) {
            return(rsib)
        } else {
            p = get_parent(p)
        }
    }
    return(p)
}

function sdfs_next(o){
    let fstch = get_fstch(o)
    if(fstch!==null) {
        return(fstch)
    } else {
        let rsib = get_rsib(o)
        if(rsib !==null) {
            return(rsib)
        } else {
            return(get_nearest_prsib(o))
        }
    }
}


function *perm(arr) {
    let o = creat_root(arr)
    while(o!==null){
        if(is_leaf(o)) {
            yield(o.cache.map(r=>r.origv))
        }
        o = sdfs_next(o)
    }
}



module.exports = {
    comb,
    perm,
}
