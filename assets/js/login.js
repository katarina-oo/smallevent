$(function() {
    // 从 layui 中获取 form 对象
    let form = layui.form;
    // 从 layui 中获取 layer
    let layer = layui.layer;

    // 点击 去注册 的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击 去登录 的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })



    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 密码的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 校验注册时 两次密码是否相同
        repwd: function(value) {
            // 通过 形参 拿到的是 再次确认密码框中的值，再拿到 密码框中的值 做一次判断即可
            // 可以 取 id 获取 或是 通过name
            // let pwd = $('.reg-box [name=password]').val() //通过 name 获取
            let pwd = $('#p-wd').val() // 通过 id 获取
                // console.log(pwd);
            if (pwd !== value) {
                return '两次密码不相同'
            }
        }
    })


    // 1.监听 注册表单 的提交事件(给注册表单添加了一个id名 #form_reg)
    // $('#form_reg').on('submit', function(e) { 
    // 或者使用：$('').submit(function(){})
    $('#form_reg').on('submit', function(e) {
        // 2.先阻止表单默认提交行为
        e.preventDefault()

        // 3.再发起 ajax 的 POST 请求 // 注：类名和 属性之间一定一定需要叫空格
        const data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val(), repassword: $('#form_reg [name=repassword]').val() }
        $.ajax({
            method: 'POST',
            url: 'http://www.liulongbin.top:3008/api/reg',
            data,
            success(res) {
                if (res.code !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录');

                // 模拟人的点击行为(就是注册成功后，跳转到登录页面，直接提示用户登录)
                $('#link_login').click()
            }
        })
    })


    // 1.监听 登录表单 的提交事件
    $('#form_login').submit(function(e) {
        // 2.先阻止表单默认提交行为
        e.preventDefault();
        // 3.再发起 ajax 请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！');
                // console.log(res.token);
                // 将登录成功得到的 token 字符串 保存到 localStorage 中：
                localStorage.setItem('token', res.token)

                // 登录成功后，跳转到后台主页]]

                location.href = '/index.html'
            }

        })

    })
})

// 后面有权限的接口，都要带着这个
// token值：Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mzg2MSwidXNlcm5hbWUiOiJtbW16enoiLCJuaWNrbmFtZSI6IiIsImVtYWlsIjoiIiwiaWF0IjoxNjUzMDQ3OTA1LCJleHAiOjE2NTMwODM5MDV9.AMuxsEvIypUB8ceqvAHz9jcd1wjdjrc6CiXFMJG9p5k