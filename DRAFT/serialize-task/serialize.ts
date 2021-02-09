
//
export interface Cfg  {
    ignore_exception?:boolean;
    from?:number;
    to?:number;    
}

export interface Task {
    input:any;
    rslts:any[];
    final:any;
    exceptions:any[];
    cfg:Cfg;
    tasks:any[];
}

/*
    var input = 0
    var task_funcs = Array.from({length:10}).map((r,i)=>creat_task)
    var tsk = new Task(input,...task_funcs)
    var g = creat_generator(tsk)
    (async () => {
        for await (let value of g) {
            console.log(value); 
        }
    })();
*/

/*
//not work for tsc TS2318: Cannot find global type 'AsyncIterableIterator' - async generator


export async function * creat_generator(obj:any) {
    let input = obj.input
    let tasks = obj.tasks
    let from = obj.cfg.from
    let to = obj.cfg.to
    let ignore_exception = obj.cfg.ignore_exception
    for(let i=from;i<to;i++) {
        try {
            input = await tasks[i](input)
            obj.rslts.push(input)
            obj.exceptions.push(undefined)
            obj.final = input
            yield(input)
        } catch(err) {
            input = undefined
            obj.rslts.push(input)
            obj.exceptions.push(err)
            obj.final = err
            yield(err)
        }
    }
}

creat_generator['comment'] = `
    Dont use this very suck!
    this is only for internal test using!
`
*/

async function _rtrn(obj:any) {
    let input = obj.input
    let tasks = obj.tasks
    let from = obj.cfg.from
    let to = obj.cfg.to
    let ignore_exception = obj.cfg.ignore_exception
    for(let i=from;i<to;i++) {
        try {
            input = await tasks[i](input)
            obj.rslts.push(input)
            obj.exceptions.push(undefined)
        } catch(err) {
            input = undefined
            obj.rslts.push(input)
            obj.exceptions.push(err)
            if(ignore_exception) {
            } else {
                obj.final = obj.rslts[obj.rslts.length-2]
                return(obj.final)
            }
        }
    }
    obj.final = input
    return(obj.final)
}

export class Task {
    constructor(input:any,...tasks:any[]) {
        this.input = input
        this.rslts = []
        this.final = undefined
        this.exceptions = []
        this.tasks = tasks
        this.cfg = {
            ignore_exception:false,
            from:0,
            to:tasks.length,
        }
    }
    $set_cfg(cfg:Cfg) {
        this.cfg = (<any>Object).assign(this.cfg,cfg)
    }
    $reset () {
        this.rslts = []
        this.final = undefined
        this.exceptions = []
    }
    async $exec() {
        return(await _rtrn(this))
    }
}


