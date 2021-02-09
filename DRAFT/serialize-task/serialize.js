"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Task = void 0;
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
function _rtrn(obj) {
    return __awaiter(this, void 0, void 0, function () {
        var input, tasks, from, to, ignore_exception, i, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = obj.input;
                    tasks = obj.tasks;
                    from = obj.cfg.from;
                    to = obj.cfg.to;
                    ignore_exception = obj.cfg.ignore_exception;
                    i = from;
                    _a.label = 1;
                case 1:
                    if (!(i < to)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, tasks[i](input)];
                case 3:
                    input = _a.sent();
                    obj.rslts.push(input);
                    obj.exceptions.push(undefined);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    input = undefined;
                    obj.rslts.push(input);
                    obj.exceptions.push(err_1);
                    if (ignore_exception) {
                    }
                    else {
                        obj.final = obj.rslts[obj.rslts.length - 2];
                        return [2 /*return*/, (obj.final)];
                    }
                    return [3 /*break*/, 5];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    obj.final = input;
                    return [2 /*return*/, (obj.final)];
            }
        });
    });
}
var Task = /** @class */ (function () {
    function Task(input) {
        var tasks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            tasks[_i - 1] = arguments[_i];
        }
        this.input = input;
        this.rslts = [];
        this.final = undefined;
        this.exceptions = [];
        this.tasks = tasks;
        this.cfg = {
            ignore_exception: false,
            from: 0,
            to: tasks.length
        };
    }
    Task.prototype.$set_cfg = function (cfg) {
        this.cfg = Object.assign(this.cfg, cfg);
    };
    Task.prototype.$reset = function () {
        this.rslts = [];
        this.final = undefined;
        this.exceptions = [];
    };
    Task.prototype.$exec = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _rtrn(this)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    return Task;
}());
exports.Task = Task;
