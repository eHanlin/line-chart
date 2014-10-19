## Line Chart

## 說明
1.依賴於 D3.js

### 安裝 Install
1. sudo npm install d3

### 資料結構 Data structure
```
var data = [
           	{title: "寫作能力",	tTitle: "精熟平均", bTitle: "基礎平均", rightRate: 0.2, basicRate:0.5, skilledRate: 0.7}, 
           	{title: "形音義",		tTitle: "精熟平均", bTitle: "基礎平均", rightRate: 0.8, basicRate:0.6, skilledRate: 0.9}, 
           	{title: "詞句成語",	tTitle: "精熟平均", bTitle: "基礎平均", rightRate: 0.7, basicRate:0.5, skilledRate: 0.8},
           	{title: "java",		tTitle: "精熟平均", bTitle: "基礎平均", rightRate: 0.01, basicRate:0.5, skilledRate: 0.8},
           	{title: "java",		tTitle: "精熟平均", bTitle: "基礎平均", rightRate: 0.02, basicRate:0.5, skilledRate: 0.5},
           	{title: "java", 	tTitle: "精熟平均", bTitle: "基礎平均", rightRate: 1, basicRate:0.5, skilledRate: 0.8}
           ];

```

### 範例 examp
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>radar chart</title>
	<meta name="author" content="ocean">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
	<link rel="stylesheet" href="./src/line-chart.css"/>
	<style>
		#box{
			width: 100%;
			height: 610px;
		}
	</style>
</head>
<body>
	<div id="lineBox"></div>
</body>

<script src="./node_modules/d3/d3.min.js"></script>
<script src="./src/line-chart.js"></script>

<script>
var data = [
           	{title: "寫作能力",  tTitle: "精熟平均", bTitle: "基礎平均", rightRate: 0.2, basicRate:0.5, skilledRate: 0.7}, 
           	{title: "形音義",	   tTitle: "精熟平均", bTitle: "基礎平均", rightRate: 0.8, basicRate:0.6, skilledRate: 0.9}, 
           	{title: "詞句成語",  tTitle: "精熟平均", bTitle: "基礎平均", rightRate: 0.7, basicRate:0.5, skilledRate: 0.8},
           	{title: "詞句成語2", tTitle: "精熟平均", bTitle: "基礎平均", rightRate: 1, basicRate:0.5, skilledRate: 0.8}
           ];
window.LineChart.draw("#lineBox", data);
window.LineChart.draw("#lineBox", data);

</script>
</html>

```



### 設定 Configure
```javascript
```


