$(function() {
    let layer = layui.layer
    let form = layui.form

    // 1.2 调用 获取文章分类的列表
    initArtCateList()

    // 1. 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            data: {},
            success(res) {
                console.log(res);
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }

        })
    }

    // 2.为添加类别按钮 绑定一个点击事件
    let indexAdd = null

    // 合并后-------------------
    // 用来控制当前是什么状态（添加，修改）；默认是添加状态
    let isEdit = false;

    function title() {
        return isEdit ? '修改' : '添加'
    }
    // 合并后-------------------

    $('#btnAddCate').on('click', function() {
        // console.log(1);
        // 这是弹出一个修改文章分类信息的层 (layui的方法)
        indexAdd = layer.open({
            type: 1, // 指定弹出层的类型
            area: ['500px', '300px'], // 指定弹出层的宽高
            title: '添加文章分类', // 弹出层的标题
            // 用content属性 来指定 html标签的内容
            content: $('#dialog-add').html() // 弹出层的内容
        });
    })

    // 3.通过代理的形式，为form-add 表单绑定 submit 事件
    // $('body').on('submit', '#form-add', function(e) {
    $('body').on('submit', '#form-cate', function(e) {
        e.preventDefault();
        // console.log(1);
        if (isEdit) {
            // 3.1发起 ajax 请求数据
            // 合并前---------
            // $.ajax({
            //     method: 'POST',
            //     url: '/my/cate/add',
            //     data: $(this).serialize(),
            //     success(res) {
            //         if (res.code !== 0) {
            //             return layer.msg('新增分类失败！')
            //         }
            //         // 新增文章分类成功之后，需重新获取下列表的数据 所以在调用 initArtCateList()
            //         initArtCateList()
            //         layer.msg('新增分类成功！')

            //         // 根据索引，关闭对应的弹出层 (layui的方法)
            //         layer.close(indexAdd)
            //     }
            // })
            // 合并前---------
            $.ajax({
                method: 'PUT',
                url: '/my/cate/info',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.code !== 0) {
                        // return layer.msg('更新分类数据失败！')
                        // 把具体报错的原因给用户看
                        return layer.msg(res.message)
                    }
                    layer.msg('更新分类数据成功！')
                    layer.close(indexEdit);
                    // 新增文章分类成功之后，需重新获取下列表的数据 所以在调用 initArtCateList()
                    initArtCateList();
                    // 把控制状态的标记置成默认值
                    isEdit = false
                }
            })
        } else {
            // 添加
            $.ajax({
                method: 'POST',
                url: '/my/cate/add',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.code) {
                        return layer.msg(res.msg)
                    }
                    initArtCateList()
                    layer.msg('新增分类成功！')
                        // 根据索引，关闭对应的弹出层
                    layer.close(indexAdd)
                }
            })
        }
    })

    // 合并后的----------------------------------------
    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    // '分类名称和分类别名不能重复'
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/cate/add',
            data: $(this).serialize(),
            success: function(res) {
                if (res.code) {
                    return layer.msg(res.msg)
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    });
    // 合并后的----------------------------------------








    // 4.给编辑按钮 添加一个类名 btn-edit 然后通过代理的形式(因为表单是动态创建)，给按钮绑定点击事件
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 合并后----
        // 弹出一个修改文章分类信息的层
        isEdit = true
            // 合并后----

        // console.log(1);
        // 这是弹出一个修改文章分类信息的层 (layui的方法)
        indexEdit = layer.open({
            type: 1, // 指定弹出层的类型
            area: ['500px', '300px'], // 指定弹出层的宽高

            // 合并前
            // title: '修改文章分类', // 弹出层的标题
            title: `${title()}文章分类1`,

            // 用content属性 来指定 html标签的内容
            // 合并前
            // content: $('#dialog-edit').html() // 弹出层的内容
            content: $('#dialog-cate').html() // 弹出层的内容
        })


        // 4.1当触发了点击事件 就获取 编辑按钮 中自定义属性对应的值 {{$value.id}}
        const id = $(this).attr('data-id');
        // console.log(id);
        // 4.2 拿到 id 后 发请求 获取id所对应的数据
        $.ajax({
            method: 'GET',
            url: '/my/cate/info',
            data: { id },
            success(res) {
                // console.log(res);

                // 合并前--
                // form.val('form-edit', res.data)

                form.val('form-cate', res.data)
            }
        })
    })

    // 5.为修改分类的表单绑定 submit 提交事件 通过代理的形式(因为表单是动态创建)
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            // 合并前---------------
            // method: 'PUT',
            // url: '/my/cate/info',
            // 合并前---------------
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！');
                // 成功之后第一步：关闭弹出层
                layer.close(indexEdit);
                // 第二步： 重新刷新表格的数据，所以重新调用 获取文章分类的列表 函数
                initArtCateList()
            }
        })
    })



    // 6.为删除按钮绑定点击事件 通过代理的形式(因为表单是动态创建)
    $('tbody').on('click', '.btn-delete', function() {
        // console.log(1);
        // 6.1 当触发了点击事件 就获取 删除按钮 中自定义属性对应的值 {{$value.id}}
        let id = $(this).attr('data-id')
            // console.log(id);

        // 6.2 提示用户是否要删除 (当用户确定要删除 弹出提示框 并发起ajax请求 吊接口)
        layer.confirm('确定吗靓仔？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'DELETE',
                url: '/my/cate/del?id=' + id,
                // data: { id },
                success(res) {
                    if (res.code !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！');
                    // 删除成功之后第一步：关闭弹出层
                    layer.close(index);
                    // 第二步: 重新刷新表格的数据，所以重新调用 获取文章分类的列表 函数
                    initArtCateList()
                }
            })
        })
    })
})