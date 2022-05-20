// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 统一拼接请求的跟路径---------------------------------------------------
    // 写法1：
    // 在发起真正的 ajax 请求之前 统一拼接请求的跟路径
    // options.url = 'http://www.liulongbin.top:3008' + options.url;
    // console.log(options.url);

    // 写法2也可：
    const BASEURL = 'http://www.liulongbin.top:3008'
    options.url = BASEURL + options.url;
    // 统一拼接请求的跟路径---------------------------------------------------
})