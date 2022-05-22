$(function() {
    let layer = layui.layer

    // 1.1 调用 获取用户的基本信息 函数
    getUserInfo()

    // 3. 实现退出功能
    $('#btnLogout').on('click', function() {
        // console.log(1);
        // 3.1 提示用是否确定退出(使用 layui.confirm)
        layer.confirm('靓仔确定退出吗？', { icon: 3, title: '提示' }, function(index) {
            // console.log(2);
            // 3.2.当点击了确定后 清空本地存储removeItem()/clear 中的 token
            localStorage.removeItem('token');
            // 3.3.重新跳转到登录页面
            location.href = '/login.html'

            // 这是 关闭 confirm 询问框 layui 官方自带的
            layer.close(index);
        })
    })
})

// 1.定义 获取用户的基本信息 函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: { //统一写在 ajaxPrefilter 这个函数中
        // // localStorage.getItem() 存储数据
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success(res) {
            // console.log(res);
            if (res.code !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // layui.layer.msg('获取用户信息成功！')
            // 获取用户信息成功之后 (数据都是放在res.data中)
            // 2.1调用 renderAvatar 渲染用户头像 的函数
            renderAvatar(res.data)
        },

        //统一写在 ajaxPrefilter 这个函数中------------------------------------------------------
        // 4.不论成功还是失败，最终都会调用 complete 回调函数 (成功回调success  失败回调error)
        // complete: function(res) {
        //         console.log('执行了 complete 回调');
        //         console.log(res);
        //         //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //         if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
        //             // 1.强制清空 token
        //             localStorage.removeItem('token');
        //             // 2.强制跳转到登录页面
        //             location.href = '/login.html'
        //         }
        //     }
        //统一写在 ajaxPrefilter 这个函数中------------------------------------------------------
    })
}

// 2.定义 渲染用户的头像 函数
function renderAvatar(user) {
    // 2.2 获取用户的名称(因为有两昵称 使用 || )
    let name = user.nickname || user.username;
    // 2.3 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 2.3 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 2.3.1 如果用户有图片头像 先渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 2.3.2否则渲染文本头像
        $('.layui-nav-img').hide()
            // 转成大写toUpperCase()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}