$(function() {
    let layer = layui.layer
    let form = layui.form

    // -----------------------------------------------------------------------------------------------
    // 需求：发布文章的页面，需要兼容添加和修改的功能
    // 1、需要区分从哪个地方进入到发布文章的页面的（添加状态，修改状态）
    // 先从缓存里面取 id，如果能取到的话，说明当前是修改状态（修改完之后记得清缓存）
    // 先从缓存里面取 id，如果没有取到的话，说明当前是添加状态

    // 2、发布文章这个页面，除了需要你请求文章详情ajax之外，还需要请求文章类别ajax
    // 我们要保证先把所有的类别请求完之后，再去请求文章详情( form.val('form-name', res.data) )
    // -----------------------------------------------------------------------------------------------

    // 1.2 调用加载文章分类的方法
    initCate()


    // 初始化富文本编辑器
    initEditor();
    // 初始化富文本编辑器


    // 1.定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }

                // 1.3调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 1.4一定要记得调用 form.render() 方法
                form.render()


                // ------------------------
                // 回显分类的时候，得确保分类数据已经做了渲染
                const id = localStorage.getItem('id')
                console.log(id);
                if (id) {
                    // 编辑
                    $.ajax({
                        url: '/my/article/info?id=' + id,
                        success(res) {
                            $('#image').attr('src', 'http://www.liulongbin.top:3008' + res.data.cover_img)

                            loadImage()

                            // 这里是编辑的时候，给文字表单进行赋值操作
                            form.val('form-pub', res.data)
                        }
                    });
                    // ------------------------
                } else {
                    // 添加
                    loadImage()
                }
            }
        })
    }
    var $image = null
    var options = null


    function loadImage() {
        // 2.图片封面裁剪(文章封面)----------------
        // 2.1 初始化图片裁剪器
        $image = $('#image')

        // 2.2 裁剪选项
        options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 2.3 初始化裁剪区域
        $image.cropper(options);
        // 图片封面裁剪(文章封面)----------------
    }



    // 3.为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
        // 如何判断用户已经选择了文件？
        // files
    })

    // 4.监听 coverFile 的 change 事件 ，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 4.1获取到文件的列表数组
        let files = e.target.files

        // 4.2判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 4.3根据文件，创建对应的 URL 地址
        let newImgURL = URL.createObjectURL(files[0])

        // 4.4为裁剪区域重新设置图片(复制粘贴的)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 5.自定义文章的发布状态
    let art_state = '已发布' // 如果用户点击已发布那么就是 默认值 已发布

    // 5.1为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿' // 如果用户点击存为草稿 ，那么将 art_state 值改为 草稿
    })

    // 6.为表单 form 绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        // 6.1阻止表单的默认提交行为
        e.preventDefault();
        // 6.2基于 form 表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0]);
        // 6.3将文章的发布状态，存到 fd 中
        fd.append('state', art_state)

        // fd.forEach(function(v, k) { (键，值)
        //     console.log(k, v);
        // })

        // 6.4将封面裁剪过后的图片，转化为文件对象(复制粘贴)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 6.5将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                // ------------------------------
                const id = localStorage.getItem('id')
                if (id) {
                    // 我需要走 确认编辑的接口（id: xxxx）
                    fd.append('id', id)
                    editArticle(fd)
                } else {
                    // 7.1发起 ajax 数据请求 (调用publishArticle())
                    publishArticle(fd)
                }
                // ------------------------------

                // 7.1发起 ajax 数据请求 (调用publishArticle())
                // publishArticle(fd) // publishArticle 发布文章的意思
            })
    })


    // 8.修改文章的方法
    function editArticle(fd) {
        $.ajax({
            method: 'PUT',
            url: '/my/article/info',
            data: fd,
            contentType: false,
            processData: false,
            success(res) {
                if (res.code === 0) {
                    layer.msg('编辑文章成功');
                    // 一定要删除本地存储的id值
                    localStorage.removeItem('id');
                    // 编辑文章成功后，跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            }

        })
    }

    // 7.发布文章的方法(函数)
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd, // 如果向服务器提交的是 FormData 格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')


                // 7.2发布成功之后，应重新跳转到 文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }
})