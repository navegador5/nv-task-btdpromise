function resolve(rs,rj,self) {rs(self.$parent().rslt)}
function reject(rs,rj,self) {rj(self.$parent().exception)}

function get_action_by_type(rs,rj,self) {
    let typ = self[SYM_TYPE]
    if(typ === 'then') {
        return(rs)
    } else {
        return(rj)
    }
}


function pass_through(rs,rj,self) {
    let p = self.$parent();
    let action = get_action_by_type(rs,rj,self);
    if(p.state === "rejected") {
        action(p.exception)
    } else if(p.state === "resolved") {
        action(p.rslt)
    }  else {
    }
}

parent-type : 决定取值 rslt/exception
self-type   : 决定使用 rs/rj

root<null:rs>
    then<prs>
        then<prs>
        catch<prj>
    catch<prj>


root(rs)->then(rs)->then   rs->rs
                               rslt->rslt
root(rs)->then(rj)->catch  rs->rj
                               rslt->exception
                         
root(rj)->catch(rs)->then
                           rj->rs
                               exception->rslt
root(rj)->catch(rj)->catch
                           rj->rj
                               exception->exception


rtsk =         (rs,rj)=>{rs()}
.then =        (rs,rj,self)=>{rs(self.rslt)}
.then.then =   (rs,rj,self)=>{rs(self.rslt)}
.then.catch =  (rs,rj,self)=>{rj(self.rslt)}

.catch =        (rs,rj,self)=>{rj(self.rslt)}
.catch.then =   (rs,rj,self)=>{rs(self.exception)}
.catch.catch =   (rs,rj,self)=>{rj(self.exception)}

               |
up:  then.then-|
               |
                 
                 |
down: then.catch-|
                 |

                 |
left: catch.then-|
                 |

                   |
right: catch.catch-|
                   |

1 << lngth.toString(2).length 
    gt @ -1
    eq @

10
     100 -1
101
     1000 -1

2**3

new Recursive()

ctx = {
    variables:{},
    terminator:(variables)=>{/*return(true or false)*/}
}

ctx.variables = {'a':undefined,'b':undefined,'c':undefined}

class Ctx {
    #vars
    #pc
    
    
}


A,
B,
Self
C,
D

if(nd.type === Self) {
    var next = nd.$append_child()
    next.vars = 
    yield(next)
}



['a','b',self,'c','d',self,'e']
  
['a','b',['a','b','c','d'],'c','d',['a','b','c','d'],'e']


['a',self(2),'b',self(3),'c']

['a','b',self(8)]

['a',self(2),'b',self(3),'c']

['a',self()]

p.setTimeout = 
p.setTimeout.setTimeout

p.up 
p.down
p.left
p.right 


p.up = 
p.up.up =
p.up.down = 

var action = [up,up,up,down,down]


function tst(up,down,left,right) {
    setTimeout(
       if(1){up(v)}
       else if() {down(v)}
       else if() {left()}
       1000
    )
}



p.then.then.then
p.then.then.catch
p.then.catch.then
p.then.catch.catch

then.then = up
then.catch = down 
catch.then = left 
catch.catch = right 

if(up)
p.then = identify
p.then.then = 


(rs,rj,self)=>{rs(self.$parent().rslt)}
(rs,rj,self)=>{rj(self.$parent().rslt)}


