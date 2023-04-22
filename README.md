# ijf小程序（二期）

## 介绍
| 技术       | 实现     | 文档                                |
| ---------- | -------- | ----------------------------------- |
| 小程序框架 | Uni-app  | https://uniapp.dcloud.io/vue-basics |
| UI框架     | ColourUi | https://github.com/weilanwl/ColorUI |



## 目录结构
```
├─colorui		--组件
│  └─components
├─common
│  └─css
├─config    	--api统一管理
├─node_modules
├─pages			--页面
│  ├─employee
│  ├─index
│  ├─knowledge
│  ├─more
│  ├─report
│  └─user
├─static	   --图片存放地址
└─utils        --封装常用工具，如request请求
```

## 全局变量

存放在App.vue中

```
user_id:"",
campus_id:"",
member_id:""，
isLogin: false,//登录状态
//用户系统显示状态
reportStatus:{
	0:"待确认",
	1:"待处理",
	2:"已处理",
	3:"已完成",
	4:"无法处理",
	5:"已撤销",
},
//后台系统显示状态
MemreportStatus:{
	 0:"待确认",
	 1:"待处理",
	 2:"已处理",
	 3:"已完成",
	 4:"已拒绝",
	 5:"用户已撤销",
},
```

## 常见问题

### 后台返回时间戳前端如何格式化显示

注册全局时间过滤器

在utils/filter.js 中

```js
export function formatDate(value) {
	var date = new Date(value * 1000);
	var month = date.getMonth() + 1;
	var hours = date.getHours();
	if (hours < 10)
		hours = "0" + hours;
	var minutes = date.getMinutes();
	if (minutes < 10)
		minutes = "0" + minutes;
	var time = date.getFullYear() + "-" + month + "-" + date.getDate() +
		" " + hours + ":" + minutes;
	return time;
}
```

只需要在页面中导入

```vue
<template>
	<view class="cu-item">
        <view class="content">
                <text class="text-grey info">提交时间</text>
            <!--  需要过滤的变量|全局过滤器的名称 -->
                {{ reportDetail.gmt_create | formatDate }}
        </view>
    </view>
</template>
<script>
const utils = require('../../utils/util.js');
</script>
```

### 小程序与vue的差异



| 作用                 | 小程序             | vue(Uniapp)                                     |
| -------------------- | ------------------ | ----------------------------------------------- |
| 事件绑定             | bindtap="function" | @tap="function" / @click=''function"            |
| 阻止事件冒泡         | catchtap           | @tap.stop="" 加上.stop即可                      |
| 图片绑定图片链接变量 |                    | ```<image v-bind:src="item.img_url"></image>``` |
| for循环（语法）      |                    | v-for="(item,index) in list"                    |



