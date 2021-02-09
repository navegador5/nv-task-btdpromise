serialize-task
==============
- serialize many async functions ,excuted one-by-one,save-all-exceptions 
- similiar to rxjs concat-operator ,but more simple, and store all exceptions
- the-prev-task-returned-value will auto be used as the-next-task-input
- without any dependancy


install
=======
- npm install serialize-task 

usage
=====

    const {Task} = require("serialize-task")


    //simulate a async task
    function creat_task(input) {
        let p = new Promise(
            (rs,rj) => {
                let rand_delay = Math.random() *5*1000;
                let rand_exception = parseInt(Math.random()*5);
                setTimeout(
                    function(){
                        if(rand_exception!==0) {
                            console.log("after " +rand_delay/1000+" seconds,task["+ input + "] excuted and successed")
                            rs(input+1)
                        } else {
                            console.log("after " +rand_delay/1000+" seconds,task["+ input + "] excuted and failed")
                            rj(new Error("Exception " +input))
                        }
                    },
                    rand_delay
                )
            }
        )
        return(p)
    }



    // creat many tasks, sieres
    var task_funcs = Array.from({length:10}).map((r,i)=>creat_task)
    // the initial input
    var input = 0
    // serialize all tasks
    var tsk = new Task(input,...task_funcs)
    //interupted at exception,this is default
    tsk.$set_cfg({ignore_exception:false})
    // run
    var p = tsk.$exec()
    p.then(r => {
        console.log(r);
    })

    /*
    Promise { <pending> }
    > after 2.6454931214066035 seconds,task[0] excuted and successed
    after 4.388659120617205 seconds,task[1] excuted and successed
    after 2.525739116769694 seconds,task[2] excuted and successed
    after 3.483406619190239 seconds,task[3] excuted and successed
    after 4.949254980727995 seconds,task[4] excuted and successed
    after 0.9982289290802793 seconds,task[5] excuted and failed              ---------->failed and stoped
    5                                                                        ----------> last success returned value
    >
    */


    //check it at any time
    tsk
    /*
    Task {
      input: 0,
      rslts: [ 1, 2, 3, 4, 5, undefined ],
      final: 5,                                                ----------> last success returned value
      exceptions: [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        Error: Exception 5                                     ---------->
            at Timeout._onTimeout (repl:13:28)
            at listOnTimeout (internal/timers.js:549:17)
            at processTimers (internal/timers.js:492:7)
      ],
      tasks: [
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task]
      ],
      cfg: { ignore_exception: false, from: 0, to: 10 }
    }
    >

    > tsk.exceptions[tsk.exceptions.length-1]
    Error: Exception 5
        at Timeout._onTimeout (repl:13:28)
        at listOnTimeout (internal/timers.js:549:17)
        at processTimers (internal/timers.js:492:7)
    >


    */


    //reset for re-exec
    tsk.$reset();
    //ignore all errors ,and exec-all-tasks
    tsk.$set_cfg({ignore_exception:true})
    /*
    > tsk.cfg
    { ignore_exception: true, from: 0, to: 10 }
    >

    */
    var p = tsk.$exec()
    p.then(r => {
        console.log(r);
    })

    /*
    Promise { <pending> }
    > after 0.7352922850636101 seconds,task[0] excuted and successed
    after 4.8073015250687545 seconds,task[1] excuted and successed
    after 4.637522696259824 seconds,task[2] excuted and failed                 -----------failed
    after 2.2199157933439495 seconds,task[undefined] excuted and failed                 -----------failed
    after 4.015073697632454 seconds,task[undefined] excuted and successed
    after 1.1502170902288278 seconds,task[NaN] excuted and failed                 -----------failed
    after 0.005430027114552427 seconds,task[undefined] excuted and successed
    after 0.8880999183947491 seconds,task[NaN] excuted and successed
    after 1.7997423655009748 seconds,task[NaN] excuted and successed
    after 4.290704343913738 seconds,task[NaN] excuted and successed
    NaN                                                                     --------->returned

    >

    excecuted one-by-one totail 3 failed, and 7 success
    > tsk
    Task {
      input: 0,
      rslts: [
        1,         2,
        undefined, undefined,
        NaN,       undefined,
        NaN,       NaN,
        NaN,       NaN
      ],
      final: NaN,
      exceptions: [
        undefined,
        undefined,
        Error: Exception 2                                   ------------------>
            at Timeout._onTimeout (repl:13:28)
            at listOnTimeout (internal/timers.js:549:17)
            at processTimers (internal/timers.js:492:7),
        Error: Exception undefined                                   ------------------>
            at Timeout._onTimeout (repl:13:28)
            at listOnTimeout (internal/timers.js:549:17)
            at processTimers (internal/timers.js:492:7),
        undefined,
        Error: Exception NaN                                   ------------------>
            at Timeout._onTimeout (repl:13:28)
            at listOnTimeout (internal/timers.js:549:17)
            at processTimers (internal/timers.js:492:7),
        undefined,
        undefined,
        undefined,
        undefined
      ],
      tasks: [
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task],
        [Function: creat_task]
      ],
      cfg: { ignore_exception: true, from: 0, to: 10 }
    }
    >

    var errors = tsk.exceptions.filter(r=>r!==undefined)
    errors = errors.map(
        (err,i)=>{
            console.log("task["+i+"]"+"failed");
            return({
                seq:i,
                err:err
            })
        }
    )
    task[0]failed
    task[1]failed
    task[2]failed
    [
      {
        seq: 0,
        err: Error: Exception 2
            at Timeout._onTimeout (repl:13:28)
            at listOnTimeout (internal/timers.js:549:17)
            at processTimers (internal/timers.js:492:7)
      },
      {
        seq: 1,
        err: Error: Exception undefined
            at Timeout._onTimeout (repl:13:28)
            at listOnTimeout (internal/timers.js:549:17)
            at processTimers (internal/timers.js:492:7)
      },
      {
        seq: 2,
        err: Error: Exception NaN
            at Timeout._onTimeout (repl:13:28)
            at listOnTimeout (internal/timers.js:549:17)
            at processTimers (internal/timers.js:492:7)
      }
    ]

    */


property
========

    export interface Task {
        input:any;
        rslts:any[];
        final:any;
        exceptions:any[];
        cfg:Cfg;
        tasks:any[];
    }

methods
=======
- f.$set\_cfg() 

    export interface Cfg  {
        ignore_exception?:boolean;
        from?:number;
        to?:number;
    }

- f.$reset() clear-all-states-and-for-reexec
- f.$exec()  exec-all-tasks



LICENSE
=======
- ISC 
