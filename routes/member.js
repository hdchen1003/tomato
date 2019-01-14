var express = require('express');
var router = express.Router();
var admin = require("../service/firedata");
var Today=new Date();
/* GET home page. */

router.get('/profile', function (req, res, next) {
    if (req.cookies.status) {
        var todo_count = 0
    var done_count = 0
    admin.ref('user/' + req.cookies.status.unumber + '/todoList').once('value', function (snapshop) {
        data = snapshop.val()
        for (item in data) {
            todo_count++
        }
    })
    admin.ref('user/' + req.cookies.status.unumber + '/doneList').once('value', function (snapshop) {
        data = snapshop.val()
        for (item in data) {
            done_count++
        }
    })
    admin.ref('user').once('value', function (snapshop) {
        udata = snapshop.val()
        for (item in udata) {
            if (req.cookies.status.uid == udata[item].uid) {
                res.render('profile', {
                    title: '會員資料',
                    data: udata[item],
                    todo: todo_count,
                    done: done_count,
                    target: req.cookies.status.target,
                    ccc: req.cookies.status.count
                });
                break;
            }
        }
    })
    }
    else {
        res.render('nonlog', { title: '尚未登入' });
    }
   
});
router.get('/todoList', function (req, res, next) {
    if (req.cookies.status) {
        admin.ref('user/' + req.cookies.status.unumber + '/todoList').once('value', function (snapshop) {
            data = snapshop.val()
            res.render('todoList', { title: '待辦事項', data: data ,unumber:req.cookies.status.unumber,  target: req.cookies.status.target,ccc: req.cookies.status.count});
        })
    }
    else {
        res.render('nonlog', { title: '尚未登入' });
    }
    
})
router.get('/addtodoList', function (req, res, next) {
    res.render('addtodoList', { title: '新增待辦事項' });
})
router.post('/do_addtodoList', function (req, res, next) {
    var create = admin.ref('user/' + req.cookies.status.unumber + '/todoList').push();
    create.set({ 'mission': req.body.todo, 'count': 0 })
    admin.ref('user/' + req.cookies.status.unumber + '/todoList').once('value', function (snapshop) {
        data = snapshop.val()
        res.render('todoList', { title: '待辦事項', data: data ,unumber:req.cookies.status.unumber,  target: req.cookies.status.target,ccc: req.cookies.status.count});
    })
})

router.get('/doneList', function (req, res, next) {
    if (req.cookies.status) {
        admin.ref('user/' + req.cookies.status.unumber + '/doneList').once('value', function (snapshop) {
            data = snapshop.val()
            console.log(req.cookies.status.count)
            res.render('doneList', { title: '完成事項', data: data,  target: req.cookies.status.target, ccc:req.cookies.status.count });
        })
    }
    else {
        res.render('nonlog', { title: '尚未登入' });
    }
   
})

router.post('/do_adddoneList', function (req, res, next) {
    admin.ref('user/' + req.cookies.status.unumber + '/todoList/'+req.body.item).once('value', function (snapshop) {
        _data = snapshop.val()
       
        var create = admin.ref('user/' + req.cookies.status.unumber + '/doneList').push();
        create.set({ mission: _data.mission, count: _data.count,date:(Today.getMonth()+1)+'/'+Today.getDate() })
        var remove = admin.ref('user/' + req.cookies.status.unumber + '/todoList/' + req.body.item)
        remove.remove()
        var count = req.cookies.status.count + _data.count
        res.cookie('status', {
            'uid': req.cookies.status.uid,
            'uname': req.cookies.status.uname,
            'unumber':req.cookies.status.unumber,
            'target':req.cookies.status.target,
            'count':count    
        })
        admin.ref('user/' + req.cookies.status.unumber + '/todoList').once('value', function (snapshop) {
            __data = snapshop.val()
            res.render('todoList', { title: '待辦事項', data: __data,unumber: req.cookies.status.unumber,target: req.cookies.status.target,ccc: req.cookies.status.count});
        })
    })
    
})
router.post('/delete_doneList', function (req, res, next) {
    var remove = admin.ref('user/' + req.cookies.status.unumber + '/doneList/' + req.body.item)
    remove.remove()
    admin.ref('user/' + req.cookies.status.unumber + '/doneList').once('value', function (snapshop) {
        data = snapshop.val()
        res.render('doneList', { title: '完成事項', data: data });
    })
})
router.post('/countadd', function (req, res, next) {
    var create = admin.ref('user/' + req.cookies.status.unumber + '/todoList/' + req.body.item);
    count = req.body.count
    count++
    create.update({ count: count })
    admin.ref('user/' + req.cookies.status.unumber + '/todoList').once('value', function (snapshop) {
        data = snapshop.val()
        res.render('todoList', { title: '待辦事項', data: data });
    })
})
router.post('/profile_edit', function (req, res, next) {
    res.render('profile_edit', { title: '待辦事項', data: data,uname:req.body.uname,target:req.body.target,ccc: req.cookies.status.count });
})
router.post('/do_edit', function (req, res, next) {

    var update =admin.ref('user/' + req.cookies.status.unumber )
    update.update({uname:req.body.uname,target:req.body.target}) 
    res.cookie('status', {     
                    'uname': req.body.uname,
                    'target':req.body.target,
                    'uid': req.cookies.status.uid,
                    'unumber':req.cookies.status.unumber,
                    'count':req.cookies.status.count    
                })
    var todo_count = 0
    var done_count = 0
    admin.ref('user/' + req.cookies.status.unumber + '/todoList').once('value', function (snapshop) {
        data = snapshop.val()
        for (item in data) {
            todo_count++
        }
    })
    admin.ref('user/' + req.cookies.status.unumber + '/doneList').once('value', function (snapshop) {
        data = snapshop.val()
        for (item in data) {
            done_count++
        }
    })
    admin.ref('user').once('value', function (snapshop) {
        udata = snapshop.val()
        for (item in udata) {
            if (req.cookies.status.uid == udata[item].uid) {
                res.render('profile', {
                    title: '會員資料',
                    data: udata[item],
                    todo: todo_count,
                    done: done_count,
                    target: req.cookies.status.target,
                    ccc: req.cookies.status.count
                });
                break;
            }
        }
    })
   
    // res.render('profile_edit', { title: '待辦事項', data: data,uname:req.body.uname,target:req.body.target });
})
module.exports = router;
