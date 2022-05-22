$(function() {
    let form = layui.form
    let layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return ('昵称长度必须在 1~6个字符之间')
            }
        }
    })

    // 1.2调用 初始化用户的基本信息 函数
    initUserInfo()

    // 1.定义 初始化用户的基本信息 函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res);

                // 1.3 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 2.重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 2.1阻止表单的默认重置行为
        e.preventDefault();
        // 2.2 再重新调用 初始化用户的基本信息 函数(把用户信息填充到表单中)
        initUserInfo()
    })

    // 3.监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 3.1阻止表单的默认提交行为
        e.preventDefault();
        // 3.2发起ajax请求
        $.ajax({
            method: 'PUT',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')

                // 3.3调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})