$(function() {
    let form = layui.form

    // 1.自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $('[name=old_pwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=new_pwd]').val()) {
                return '两次密码不相同，确认后重新输入'
            }
        }
    })

    // 2.监听表单的提交行为
    $('.layui-form').on('submit', function(e) {
        // 2.1阻止默认提交行为
        e.preventDefault();
        // 2.2发起 ajax 请求
        $.ajax({
            method: 'PATCH',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')

                // 2.3 更新密码成功后 把密码框清空(重置表单)
                // 获取表单 layui-form 的jQuery对象, 再用[0] 转为原生dom对象。 reset() 清空
                $('.layui-form')[0].reset()
            }
        })
    })
})


// 拓展需求：
// 移除token
// 重新登录