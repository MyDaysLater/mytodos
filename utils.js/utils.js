/**公用的工具类 */
(function(Vue){
   Vue.prototype.getUniqID = function(){
       return Date.now();
   }
   //定义一个本地存储工具
   let storageKey = "mytodos";
   window.storageFunc = {
    // 获取数据
    fetch: function () {
        return JSON.parse(localStorage.getItem(storageKey) || '[]');
    },
    save: function (todos) {
        localStorage.setItem(storageKey, JSON.stringify(todos));
    }
}

  
})(Vue)