$(function() {
    let layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // aspectRatio: 16 / 9, // 这是一个16 比 9 的裁剪区域
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2.为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        // 2.1 模拟用户点击行为 点击了 input 文件选择框
        $('#file').click()
    })


    // 3. 为 input 文件选择框 绑定 change 事件
    $('#file').on('change', function(e) {
        // console.log(e);
        // 获取用户选择的文件
        let filelist = e.target.files
            // console.log(filelist);
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }

        // 3.1此处证明用户已经选择了文件
        // 3.1.拿到用户选择的文件
        let file = e.target.files[0];
        // 3.2根据选择的文件，创建一个对应的 URL 地址
        let imgURL = URL.createObjectURL(file);
        // 3.3先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 4.实现上传头像功能(为确定按钮，绑定点击事件)
    $('#btnUpload').on('click', function() {
        // 4.1拿到用户裁剪之后的头像
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 4.2 调用接口，把头像上传到服务器
        $.ajax({
            method: 'PATCH',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')

                // 4.3 更新头像成功后 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})