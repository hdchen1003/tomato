var express = require('express');
var router = express.Router();
var admin = require("../service/firedata");
/* GET home page. */
router.get('/start_timer', function (req, res, next) {
    res.render('start_timer', { title: '準備計時' });
});
router.post('/clock', function (req, res, next) {
    
    res.render('clock', { title: '計時' ,time:req.body.time});
});
router.get('/', function (req, res, next) {
    res.render('index', { title: '首頁' ,message:'安安'});
});
router.get('/signup', function (req, res, next) {
        res.render('signup', { title: '註冊', });
});
router.post('/do_signup', function (req, res, next) {
    admin.ref('user').once('value', function (snapshop) {
        udata = snapshop.val()
        var ifexist = 0;
        for (item in udata) {
            
            if (udata[item].uid == req.body.uid ) {  
                ifexist = 1
                res.render('index', { title: '首頁',message:'帳號已經被使用' });  
                break;
            }
            else if (udata[item].uname == req.body.uname ){
                ifexist = 1
                res.render('index', { title: '首頁',message:'暱稱已經被使用' });  
                break;
            }
        }
        if(ifexist == 0){
            var createuser = admin.ref('user').push();
            createuser.set(
                {
                    'uid':req.body.uid,
                    'upwd':req.body.upwd,
                    'uname':req.body.uname,
                    // 'todoList':{'0':null},
                    // 'doneList':{'0':null}
                }
            )
            res.render('index', { title: '首頁',message:'註冊成功，請重新登入' });  
        }
        
    })
   
});
router.get('/signin', function (req, res, next) {
    if (req.cookies.status) {
        res.render('index_signed', { title: '已經登入' ,message:'已經登入'});
    }
    else {
        res.render('signin', { title: '登入' });
    }
});
router.post('/do_signin', function (req, res, next) {
    admin.ref('user').once('value', function (snapshop) {
        udata = snapshop.val()
        for (item in udata) {
            if (udata[item].uid == req.body.uid && udata[item].upwd == req.body.upwd) {
                res.cookie('status', {
                    'uid': req.body.uid,
                    'uname': req.body.uname,
                    'unumber':item
                })
                res.render('index_signed', { title: '登入成功' ,message:'登入成功'});
                break;
            }
        }
        res.render('index', { title: '登入失敗',message:'登入失敗' });
       
        
        
    })
});
router.get('/logout', function (req, res, next) {
    res.cookie('status', "")
    res.render('index', { title: '登出成功',message:'登出成功' });
});

module.exports = router;