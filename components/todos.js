(function(Vue){
  Vue.component("todos",{
        //观察模式
        watch: {
            todos: {
                handler(todos) {
                   window.storageFunc.save(todos);
                },
                deep: true
            }
        },
       computed: {
        //    下拉框
        tips: function () {
                let tips = [];// 存下拉框提示的
                this.todos.forEach((v, i) => {
                    if (v.content.indexOf(this.inputVal) != -1) {
                        tips.push(v.content);
                    }
                })
                return tips;
            },
            //过滤之后的 todos
        //    过滤之后的todos
        filtertTodos:function(){
            if (this.visibility == "all") {
                    return this.todos;
                } else if (this.visibility == "active") {
                    return this.todos.filter(function (v, i) {
                        return !v.completed;// 激活项
                    })
                } else {
                    return this.todos.filter(function (v, i) {
                        return v.completed;// 完成项目
                    })
                }
        },
        //    优化选项
        allChecked:function(){
            let allChecked = true;//默认全选
            this.todos.map(function(v,i){
                if(!v.completed){
                    allChecked = false;
                }
            })
            return allChecked;
        },
        remain:function(){
            let remain = this.todos.filter((v,i)=>{
                return !v.completed
            })
            return remain;
        }
       },
       data:function(){
          return{
            inputting:false,
           visibility:"all",//all代表active激活项
           allcheckb:false,
           inputVal:"",//输入框的值
           allCheckLabel: false,
           edit_index: -1,//表示没有编辑的项
           save_content:"",
           todos:window.storageFunc.fetch()
        }
       },
       directives:{
            "focus":{
                inserted:function(el,binding){
                    el.focus();
                }
            }
        },
       methods: {
        // 提示输入确定
        addTodoFromTip:function(tip){
                this.todos.push({
                    content:tip,
                    id:this.getUniqID(),
                    completed:false
                })
                this.inputting = false;
            },
            showTips: function () {
                // 表示 顶部输入框 正在输入
                this.inputting = true;
            },
        //    清除完成事件
        cleanTodos:function(index){
            let finish_todos = this.todos.filter(function (v, i) {
                    // 未完成的项目
                    return !v.completed
                })
                this.todos = finish_todos;
        },
        //    删除功能
        delTodos:function(index){
            this.todos.splice(index,1);
        },
        //    返回事件
        removTodos:function(index){
            this.todos[index].content = this.save_content;
            this.save_content= "";//清空编辑 内容的缓存
            this.edit_index = -1;//奇效编辑
            console.log(this.todos[index].content)
        },
        //    输入框编辑事件
        editTodos:function(index){
            if(!this.todos[index].content){
                this.todos.splice(index,1);
            }
            this.edit_index = -1;//取消编辑状态
        },
        //    编辑事件
        editTodo:function(index){
              this.edit_index = index;
            //   保留之前编辑的值
              this.save_content = this.todos[index].content
        },
        //    全选
        allCheck:function(){
           this.todos.forEach((v, i) => {
               v.completed = !this.allCheckLabel;
           })
           this.allCheckLabel = !this.allCheckLabel;
        },
        //    新建的todos
        addTodo:function(){
            console.log(this.inputVal)
            if(!this.inputVal.trim()){
                alert("不能为空")
                return
            }
            this.todos.push({
                id:this.getUniqID(),//当前的事件戳
                content: this.inputVal,
                completed: false // true 完成 　false　激活
            })
            // 输入完将内容清空
            this.inputVal = "";
        }
       },
    
      template:`
      <section>
      <!-- 内容部分开始 -->
      <section class="todos-content">
          <!-- 内容顶部开始 -->
          <section class="todos-top">
              <section :class="['left',{allcheck:allChecked}]" @click.stop="allCheck">
               >
              </section>
              <section class="right">
               <input
               v-focus
               type="text"
               class="new-todo"
               placeholder="What needs to be done?"
               v-model="inputVal"
               @keyup.enter="addTodo"
               @input="showTips"
             />
             <ul :class='["hidden",{show:inputting}]'>
               <li v-for="tip,index in tips"
               @click.stop="addTodoFromTip(tip)"
               >{{tip}}</li>
           </ul>
              </section>
          </section>
          <!-- 内容顶部结束 -->
          <!-- 内容底部开始 -->
          <section class="todos-bottom">
                <ul class="todos-list">
                   <li class="todos-list-item" v-for="item,index in filtertTodos">
                     <section class="left">
                     <input class="toggle" type="checkbox" v-model='item.completed'/>
                     </section>
                     <section :class="['middle',{completed:item.completed},
                       {hidden:edit_index==index}]"
                     @dblclick="editTodo(index)"
                     >
                     {{item.content}}
                   </section>
                   <section :class="['middle','hidden',{show:edit_index==index}]">
                       <input type="text" v-model="item.content" @keyup.enter="editTodos(index)"
                       @blur.enter="editTodos(index)" @keyup.esc="removTodos(index)">
                   </section>
                     <button class="right" @click="delTodos(index)">X</button>
                 </li>
                </ul>
          </section>
          <!-- 内容底部结束 -->
      </section>
      <!-- 内容部分结束 -->
      <!-- 底部的功能栏开始 -->
      <footer class="footer">
           <section class="left">
               <span>剩下{{remain.length}}项</span>
           </section>
               <ul class="conent-list">
                  <li :class="['conent-item-all',{
                   active:visibility=='all'}]">
                      <a href="#/all">All</a>
                   </li>
                  <li :class="['conent-item-active',{
                   active:visibility=='active'}]">
                      <a href="#/active">激活</a>
                  </li>
                  <li :class="['conent-item-finish',{
                   active:visibility=='finish'}]">
                      <a href="#/finish">完成</a>
                  </li>
               </ul>
           <section class="right" @click.stop="cleanTodos">
               清除已完成
           </section>
      </footer>
      <!-- 底部的功能栏结束 -->
      </section>
      `
  })
  function handleHashChange(){
    //清空hash
    window.location.hash = ""
    app.visibility = "all";
}
// git
// 检测 hash 的变化
let routes = [
    {
        path:"all"
    },{
        path:"active"
    },{
        path:"finish"
    }
]
window.addEventListener("hashchange", function () {
    console.log(window.location.hash);
    let visibility =  window.location.hash.replace("#/", "");
    let index = routes.findIndex((v,i)=>{
        if(v.path === visibility){
            return true;
        }
    })
    if(index === -1){
        window.location.hash = "";
        app.visibility = "all"
    }else{
        app.visibility = visibility
    }
    app.visibility = window.location.hash.replace("#/", "")
})
// app.visibility = "all";
handleHashChange()
})(Vue)