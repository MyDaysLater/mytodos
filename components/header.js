(function(Vue){
    // 闭包的作用
    // 形成私有作用域，不会污染全局变量
    // 延长变量的生命周期，变量不会被销毁
    Vue.component("app-header",{
        template:`
        <header class="todos-nav">
        <h1>todos清单</h1>
         </header>
        `
    })
})(Vue)