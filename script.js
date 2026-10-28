// script.js - 博客主页交互脚本
// 包含：昼夜换肤、文章动态加载与搜索、留言保存与显示、注册表单校验

/* ========== 1. 昼夜换肤：点击按钮切换 body 的 dark 类 ========== */
var skinBtn = document.getElementById('skin-btn');
skinBtn.addEventListener('click', function () {
    document.body.classList.toggle('dark');
});

/* ========== 2. 文章模拟数据 ========== */
var posts = [
    {
        title: '初识HTML与CSS',
        date: '2026-09-28',
        summary: 'HTML和CSS是构建网页的基础。HTML负责页面的结构和内容，CSS负责页面的样式和布局……',
        link: 'article.html'
    },
    {
        title: '前端学习之路',
        date: '2026-10-02',
        summary: '学习前端开发需要循序渐进。从HTML标签开始，到CSS盒模型，再到Flex布局……',
        link: 'article.html'
    },
    {
        title: '语义化HTML的重要性',
        date: '2026-10-06',
        summary: '使用语义化标签能让代码更具可读性，header、nav、main、article等标签让页面结构清晰……',
        link: 'article.html'
    }
];

var postList = document.getElementById('post-list');
var postCount = document.getElementById('post-count');

// 渲染文章列表，并统计数量；为空时显示提示信息
function renderPosts(list) {
    postCount.textContent = '共 ' + list.length + ' 篇文章';
    postList.innerHTML = '';
    if (list.length === 0) {
        postList.innerHTML = '<p class="empty-tip">没有找到符合条件的文章</p>';
        return;
    }
    list.forEach(function (post) {
        var article = document.createElement('article');
        article.className = 'post-card';
        article.innerHTML = '<h3>' + post.title + '</h3>' +
            '<span class="post-date">' + post.date + '</span>' +
            '<p>' + post.summary + '</p>' +
            '<a href="' + post.link + '">阅读全文</a>';
        postList.appendChild(article);
    });
}

renderPosts(posts);

/* ========== 3. 文章搜索与重置 ========== */
var searchInput = document.getElementById('search-input');

document.getElementById('search-btn').addEventListener('click', function () {
    var keyword = searchInput.value.trim();
    var result = posts.filter(function (post) {
        return post.title.indexOf(keyword) !== -1 || post.summary.indexOf(keyword) !== -1;
    });
    renderPosts(result);
});

document.getElementById('reset-btn').addEventListener('click', function () {
    searchInput.value = '';
    renderPosts(posts);
});

/* ========== 4. 留言板：用 localStorage 保存到本地并显示全部留言 ========== */
var MSG_KEY = 'blog_messages'; // 本地缓存中存放留言的键名
var msgForm = document.getElementById('msg-form');
var msgList = document.getElementById('msg-list');
var msgCount = document.getElementById('msg-count');

// 写本地缓存：localStorage 只能存字符串，先把对象/数组转成 JSON 字符串
function saveToLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// 读本地缓存：取出 JSON 字符串，还原成对象/数组
function getFromLocal(key) {
    return JSON.parse(localStorage.getItem(key));
}

// 渲染全部留言，并显示留言数量
function renderMessages(list) {
    msgCount.textContent = '共有 ' + list.length + ' 条留言';
    msgList.innerHTML = '';
    list.forEach(function (msg) {
        var li = document.createElement('li');
        li.className = 'msg-item';
        li.innerHTML = '<strong>' + msg.name + '</strong>' +
            '<span class="msg-time">' + msg.time + '</span>' +
            '<p>' + msg.text + '</p>';
        msgList.appendChild(li);
    });
}

// 页面加载时从本地缓存读取留言，没有则视为空数组
function loadMessages() {
    renderMessages(getFromLocal(MSG_KEY) || []);
}

msgForm.addEventListener('submit', function (e) {
    e.preventDefault(); // 阻止页面默认刷新
    var name = document.getElementById('msg-name').value.trim();
    var text = document.getElementById('msg-text').value.trim();
    if (name === '' || text === '') {
        alert('昵称和留言内容不能为空');
        return;
    }
    var list = getFromLocal(MSG_KEY) || [];   // 先读取已有的全部留言
    list.push({ name: name, text: text, time: new Date().toLocaleString() });
    saveToLocal(MSG_KEY, list);               // 再整体写回本地缓存
    renderMessages(list);
    msgForm.reset();
});

loadMessages();

/* ========== 5. 注册表单校验（使用正则表达式） ========== */
var regForm = document.getElementById('reg-form');
var regMsg = document.getElementById('reg-msg');

// 用户名：2~12 位，只能包含中文、字母、数字、下划线
var nameReg = /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,12}$/;
// 邮箱：形如 abc@mail.com
var emailReg = /^\w+([.-]\w+)*@\w+([.-]\w+)*\.\w+$/;
// 密码：6~16 位，必须同时包含字母和数字
var pwdReg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/;

regForm.addEventListener('submit', function (e) {
    e.preventDefault(); // 阻止页面默认刷新
    var name = document.getElementById('reg-name').value.trim();
    var email = document.getElementById('reg-email').value.trim();
    var pwd = document.getElementById('reg-pwd').value;
    var pwd2 = document.getElementById('reg-pwd2').value;

    // 用户名校验：非空 + 正则格式
    if (name === '') {
        regMsg.textContent = '用户名不能为空';
        return;
    }
    if (!nameReg.test(name)) {
        regMsg.textContent = '用户名需为2~12位的中文、字母、数字或下划线';
        return;
    }
    // 邮箱校验：非空 + 正则格式
    if (email === '') {
        regMsg.textContent = '邮箱不能为空';
        return;
    }
    if (!emailReg.test(email)) {
        regMsg.textContent = '邮箱格式不正确';
        return;
    }
    // 密码校验：非空 + 正则格式
    if (pwd === '') {
        regMsg.textContent = '密码不能为空';
        return;
    }
    if (!pwdReg.test(pwd)) {
        regMsg.textContent = '密码需为6~16位，且同时包含字母和数字';
        return;
    }
    // 两次密码一致性校验
    if (pwd !== pwd2) {
        regMsg.textContent = '两次输入的密码不一致';
        return;
    }

    regMsg.textContent = '注册成功！';
    console.log('注册表单数据：', { name: name, email: email, password: pwd });
    regForm.reset();
});
