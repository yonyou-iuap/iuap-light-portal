
const Event = require ("../../static/trd/eventBus/vertx-eventbus");
/**
 * 数据返回统一处理函数
 * @param {*} host
 * @param {*} port 成功提示
 * @param {*} json
 * @param {*} callback
 */
export const subscribe = (host="172.16.72.14",port="8081",json={},callback) => {
    let serverUri = json.identity || "yonyou.vertx.server1";
    let user= json.userkey||"vertx";
    let receiveUri = serverUri+"-"+user;

    if ((serverUri === null || serverUri === undefined || serverUri === '') || (receiveUri === null || receiveUri === undefined || receiveUri === '')) {
        let err="传入的参数不正确";
        console.error('描述：' + err);
        return;
    }
    if(typeof callback !== 'function') {
        return;
    }

    let url = "http://"+host+":"+port+"/eventbus";
    let eb = null;  //测试用
    if(!eb){
        eb = new Event(url);
    }

    eb.onopen = function () {
        //消息处理
        eb.send(serverUri, json, function(err, reply) {
            console.log("start send msg serverUri"+json.userkey);
            if (err) {
                console.error('Failed to retrieve albums: ' + err);
                return;
            }
            let msg = reply.body;
            console.log(msg);

            //注册处理
            eb.registerHandler(receiveUri, function (err, msg) {
                if (err) {
                    console.error('Failed to registerHandler: ' + err);
                    callback(err,msg);
                    return;
                }
                //回调函数调用
                callback(err,msg.body);
            });

        });
    }
}

/**
 * 数据返回统一处理函数
 * @param {*} host
 * @param {*} port 成功提示
 * @param {*} json
 * @param {*} callback
 */
export const unsubscribe = (host,port,json,callback) => {

}


