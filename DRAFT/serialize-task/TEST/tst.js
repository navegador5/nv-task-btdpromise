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
// run 
var p = tsk.$exec()
p.then(r => {
    console.log(r)
})

/*

*/


//check it at any time 
tsk

//reset
tsk.$reset()
