const express = require('express')
const router = express.Router()

//输入show显示侧边栏
router.get('/sidebar',function(req,res,next){
    res.render('sidebar')
})

module.exports = router;
