$(function() {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 美化------------------------------------------------------------
    // 定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss
    };
    // 定义一个补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 美化------------------------------------------------------------


    // 1.定义一个人查询的参数对象，将来请求数据的时候,需要将请求参数对象提交到服务器
    let q = { // xu
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据， 默认每页显示2条
        cate_id: '', // 文章分类的 id
        state: '' //文章的发表状态
    }

    // 一进入页面就发请求 （初始化表格）
    initTable();
    // 初始化分类
    initCate()

    // 2.定义一个 获取文章列表数据的方法
    function initTable() {
        // 2.1 发请求
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('获取文章列表失败！')
                }

                // 2.2 使用模板引擎渲染页面数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)



                // 5.1 调用渲染分页的函数 (total 就是总数据条数)
                renderPage(res.total)
            }
        })
    }

    // 3.定义一个 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('获取分类数据失败！')
                }

                // 3.1获取分类数据成功后调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)

                // 3.2 通知 layui 重新渲染表单区域的ui结构(完成可选项的刷新)
                form.render()
            }
        })
    }

    // 4.为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 4.1获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        // 4.2为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        // 4.3根据最新的筛选条件，重新渲染表格中的数据
        initTable()
    })

    // 5.定义渲染分页的函数 (total 就是总数据条数)
    function renderPage(total) {
        // console.log(total);

        // 5.2 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认别选中的分页


            // 5.3 分页发生切换的时候 触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1.点击页码的时候，会触发 jump 回调
            // 2.只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) { //obj（当前分页的所有选项值），first（是否首次，一般用于初始加载的判断）
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调 
                // 如果 first 的值为 true，证明是方式2触发 反之就是方法1触发
                // console.log(first); // 布尔值

                // 5.4 把最新的页面值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr

                // 5.7把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit

                // 5.5 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable() //在此调用 initTable() 会出现死循环
                if (!first) {
                    initTable()
                }
            },

            //5.6自定义排版 可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10]
        })
    }

    // 6.通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // console.log(11);

        // 6.3获取删除按钮的个数
        let len = $('.btn-delete').length
        console.log(len);



        let id = $(this).attr('data-id')
            // console.log(id);

        // 6.1询问用户是否要删除数据
        layer.confirm('靓仔确定吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'DELETE',
                url: '/my/article/info?id=' + id,
                success(res) {
                    if (res.code !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    // 6.4当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据，如果没有剩余的数据，则让页码值 减1 之后，再重新渲染表格数据
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕后，页面上就没有任何数据
                        // 页码值最小必须是 1 
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 6.2 重新渲染表格中的数据
                    initTable()
                }
            })
            layer.close(index);
        })
    })

    // 7.通过代理，为编辑按钮添加点击事件
    $('tbody').on('click', '.btn-edit', function() {
        // 可以进缓存
        const id = $(this).attr('data-id');
        // 先把你刚刚编辑的文章的 id 记录到缓存里面
        localStorage.setItem('id', id);
        // 跳转到发布文章的页面
        location.href = '/article/art_pub.html'
    })
})