// app.js - Vue 3 应用实例（选项式 API）

const app = Vue.createApp({
    // 数据
    data() {
        return {
            articles: blogArticles,   // 来自 blogArticles.js 的模拟数据
            keyword: ''               // 搜索关键词
        };
    },
    // 计算属性：根据关键词过滤文章
    computed: {
        filteredArticles() {
            const kw = this.keyword.trim();
            if (!kw) {
                return this.articles;
            }
            return this.articles.filter(function (item) {
                return item.title.indexOf(kw) !== -1 || item.summary.indexOf(kw) !== -1;
            });
        }
    },
    // 方法
    methods: {
        search() {
            // 过滤已由 filteredArticles 实时完成，这里只是去掉首尾空格
            this.keyword = this.keyword.trim();
        },
        reset() {
            this.keyword = '';
        }
    }
});

// 挂载到页面中的 #app 容器
app.mount('#app');
