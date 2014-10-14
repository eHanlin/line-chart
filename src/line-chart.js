(function(){	
var LineChart = {
	options : {
		viewBox : '0,0,1280,610',
		preserveAspectRatio : "none",
		chart : {width:'100%', height:'100%'},
		axisZoom : 0.8,								//縮放 （縱軸padding功用)
		maxValue : 100,								//軸的最大值
		minValue : 0,								//軸的最小值
		scale : 10,									//軸刻度數
		scaleNeedleH : 15,							//刻度軸刻度垂直線高度
		scaleNeedleHColor : "grey",					//刻度軸刻度垂直線顏色
		scaleTextGap : 0,
		scaleTextOffsetH : 5,
		axisHeight : 20,							//line bar height
		radius: {rx:0, ry:0},						//圓角
		arc : 2 * Math.PI,							//圓弧
		top : 50,									//
		left: 10,									//
		barTop : 35,
		gap : 90,									//lineBar , text 通用垂直gap
		hGap : 10,									//lineBar 與 text 之間水平 gap
		barHeight : 35,
		barBackOpacity : 0.4,						//lineBar 背景透明度
		barBackColor : 'grey',						//lineBar 背景色
		scoreOpacity : 0.9,							//lineBar 使用者成績透明
		scoreBackColor : '#ff9800',						//
		surmiseFontGap: 3,							//假設的font gap
		color : d3.scale.category10(),
		//標記
		tagRadius : 6,								//標記大小
		tagOpacity : 0.9,							//標記透明
		topTagColor : '#259b24',					//
		bottomTagColor : '#29b6f6',
		tagOffset : 15,
		//指針
		topNeedleColor : '#259b24',
		topNeedleOpacity : 0.8,
		bottomNeedleColor : '#29b6f6', 
		bottomNeedOpacity : 0.8,
		//標記標題
		topTitleGap :25,
		bottomTitleGap : 15,
		//user score
		scoreOffsetH : 5, //使用者分數位置左水平間隔用
		scoreOffsetV : 0, //使用者分數位置垂直校正用
		scoreColor : 'black',
		isDebug : false
	},
	mixOptions : function(options){
		var opt = Object.create(this.options);
		if(options!=null){
			for(var attr in options){
				opt[attr] = options[attr];
			}
		}
		return opt;
	},
	reset : function(id){
		d3.select(id).select('svg').remove();
		
	},
	//利用三角函式計算坐標點
	getPoint : function(radius, radians, offsetX, offsetY){
		return {
			x : radius * Math.sin(radians) + offsetX,
			y : radius * Math.cos(radians) + offsetY
		};
	},
	titleWidth : 0,
	//繪製軸上的標題
	drawAxisText : function(svg, title, group, p, width, opt, self){		
		var text = group.append('text').text(title).attr('x', p.x).attr('y', p.y);
		var fontSize = text.style("font-size").replace('pt','').replace('px','')  | 0;
		var gapTotal =  opt.surmiseFontGap * (title.length - 1);
		var offsetW  = (fontSize * title.length + gapTotal) ;  //
		if(offsetW > self.titleWidth)
			self.titleWidth = offsetW;
	},
	//繪製bar
	drawLineBar : function(svg, group, p, minLength, color, opacity, opt, self){
		group.append('rect')
			 .attr('x', p.x)
			 .attr('y', p.y)
			 .attr('width', minLength)
			 .attr('height', opt.barHeight)
			 .attr('fill', color)
			 .attr('fill-opacity', opacity);
	},
	drawTag : function(svg, group, cx, cy, r, color, opacity, opt, self){
		group.append('circle')
			 .attr('cx', cx)
			 .attr('cy', cy)
			 .attr('r', r)
			 .attr('fill', color)
			 .attr('fill-opacity', opacity);
	},
	drawNeedle: function(svg, group , p1, p2, color, opacity){
		group.append('line')
			 .attr('stroke', color)
			 .attr('stroke-opacity', opacity)
			 .attr('x1', p1.x)
			 .attr('y1', p1.y)
			 .attr('x2', p2.x)
			 .attr('y2', p2.y);
	},
	drawTagTitle:function(svg, group, p, color, title, value, neddOffset, opt){
		var textTitle = title + " : " + value;
		var text = group.append('text');
		text.attr('y', p.y)
			.attr('fill', color)
			.text(textTitle);
		if(neddOffset){	 
			var fontSize = text.style("font-size").replace('pt','').replace('px','')  | 0;
			var gapTotal =  opt.surmiseFontGap * (textTitle.length - 1);
			var offsetW  = (fontSize * textTitle.length + gapTotal) /2;
			p.x -= offsetW;
		}
		text.attr('x', p.x);
	},
	drawUserScoreTitle : function(svg, group, p, color, value, opt){
		var textTitle = value + '';
		var text = group.append('text');
	
		text.attr('fill', color)
			.text(textTitle);
		
		var fontSize = text.style("font-size").replace('pt','').replace('px','')  | 0;
		var gapTotal =  opt.surmiseFontGap * (textTitle.length - 1);
		var offsetW  = (fontSize * textTitle.length + gapTotal) / 2;
		var offsetH = (opt.axisHeight ) / 2 + fontSize;
		p.x -= (offsetW + opt.scoreOffsetH);
		p.y += offsetH + opt.scoreOffsetV;
		text.attr('x', p.x);
		text.attr('y', p.y);
	},
	drawScalaText : function(svg, group, p, color, value, opt){
		var textTitle = value + '';
		var text = group.append('text');
		text.attr('fill', color)
			.text(textTitle);
		var fontSize = text.style("font-size").replace('pt','').replace('px','')  | 0;
		var gapTotal =  opt.surmiseFontGap * (textTitle.length - 1);
		var offsetW  = (fontSize * textTitle.length + gapTotal) / 2;
		var offsetH = (opt.axisHeight ) / 2 + fontSize;

		p.x -= offsetW;
		p.y += offsetH;
		text.attr('x', p.x);
		text.attr('y', p.y);
	},
	drawAxis : function(svg, minLength, p1_radians, p2_radians, opt, self){
		var scaleGroup = svg.append('g').attr('class', 'scaleGroup');  
		var d = svg.datum();
		var groupList = [];
		for(var i=0, count=d.length ; i < count ; i++){
			var p = self.getPoint(opt.gap * i, p1_radians, 0, opt.top);
			p.x += opt.left;
			var g = svg.append('g');
			groupList.push(g);
			svg.call(self.drawAxisText, d[i].title, groupList[i], p, opt.titleWidth, opt, self);
		}
		for(var j=0, count=d.length ; j < count ; j++){
			var p = self.getPoint(opt.gap * j, p1_radians, opt.hGap, opt.barTop);
			p.x += opt.left + self.titleWidth;
			//bar background
			svg.call(self.drawLineBar, groupList[j], p, minLength, opt.barBackColor, opt.barBackOpacity, opt, self);
			//bar user score
			var userScoreW = minLength * d[j].rightRate;
			svg.call(self.drawLineBar, groupList[j], p, userScoreW, opt.scoreBackColor , opt.scoreOpacity , opt, self);
			//basicRate tag
			var basicOffset = minLength * d[j].basicRate;
			var basicX = p.x + basicOffset;
			var basicY = p.y + opt.barHeight + opt.tagOffset;
			svg.call(self.drawTag, groupList[j], basicX, basicY , opt.tagRadius, opt.bottomTagColor, opt.tagOpacity, opt, self);
			//skilledRate tag
			var skilledOffset = minLength * d[j].skilledRate;
			var skilledX = p.x + skilledOffset;
			var skilledY = p.y - opt.tagOffset;
			svg.call(self.drawTag, groupList[j], skilledX, skilledY , opt.tagRadius, opt.topTagColor, opt.tagOpacity, opt, self);
			
			//basic 指針
			var bNP1 = {x : basicX , y: basicY};
			var bNP2 = {x : basicX , y: p.y};
			svg.call(self.drawNeedle, groupList[j], bNP1, bNP2, opt.bottomNeedleColor, opt.bottomNeedOpacity);
			
			//skill 指針
			var SNP1 = {x : skilledX , y: skilledY};
			var SNP2 = {x : skilledX , y: skilledY + opt.barHeight + opt.tagOffset};
			svg.call(self.drawNeedle, groupList[j], SNP1, SNP2, opt.topNeedleColor, opt.topNeedleOpacity);
			
			//basic title
			var BTP = {x: basicX + opt.bottomTitleGap, y: basicY + opt.tagRadius};
			var bval = d[j].basicRate * 100;
			svg.call(self.drawTagTitle, groupList[j], BTP ,opt.bottomTagColor, d[j].bTitle, bval, false, opt);

			//skill title
			var TTP = {x: skilledX - opt.topTitleGap, y: skilledY + opt.tagRadius};
			var tval = d[j].skilledRate * 100;
			svg.call(self.drawTagTitle, groupList[j], TTP ,opt.topTagColor, d[j].tTitle, tval, true, opt);
			
			//學生分數 title
			var STP = {x :  p.x + userScoreW , y : p.y };
			var sval = d[j].rightRate * 100;
			svg.call(self.drawUserScoreTitle, groupList[j], STP ,opt.scoreColor, sval, opt);
		}
		//刻度
		//start
		var sp1 = self.getPoint(opt.gap * j+1, p1_radians, opt.hGap, opt.barTop);
		sp1.x += opt.left + self.titleWidth;
		//var ep2 = {x: sp1.x + minLength , y : sp1.y};
		var sectionVal = minLength / opt.scale;
		var sectionV = (opt.maxValue - opt.minValue) / opt.scale;
		for(var i=0 , count=opt.scale ; i <= count ; i++){
			var scaleP1 = {x : sp1.x +  i * sectionVal, y: sp1.y};
			var scaleP2 = {x : scaleP1.x , y: sp1.y + opt.scaleNeedleH};
			//刻度直線
			svg.call(self.drawNeedle, scaleGroup, scaleP1, scaleP2, opt.scaleNeedleHColor, opt.topNeedleOpacity);
			//刻度 text
			var valP = {x : scaleP1.x + opt.scaleTextOffsetH , y : scaleP2.y + opt.scaleTextGap};
			svg.call(self.drawScalaText, scaleGroup, valP, 'black', sectionV * i, opt );
		}
		//刻度橫線
		var sph1 = {x: sp1.x , y : sp1.y + opt.scaleNeedleH/2 };
		var sph2 = {x: sp1.x + minLength , y : sph1.y};
		svg.call(self.drawNeedle, scaleGroup, sph1, sph2, opt.scaleNeedleHColor, opt.topNeedleOpacity);
		//
	},
	
	renderRadar : function(svg, opt, self){
		var p1_radians = 0;
		var p2_radians = opt.arc / 8 * 2;
		var viewBoxList = opt.viewBox.split(',');
		var w = viewBoxList[2];
		var h = viewBoxList[3];
		var minLength =  w  * opt.axisZoom;
		if(opt.isDebug){
			console.log('w = ' + w);
			console.log('h = ' + h);
			console.log('p1_radians = ' + p1_radians);
			console.log('p2_radians = ' + p2_radians);
			console.log('minLength = ' + minLength);
			console.log(svg.datum());
		}
		//render 
		svg.call(self.drawAxis, minLength, p1_radians, p2_radians, opt, self);
	},
	draw : function(id, data, options){
		this.reset(id);
		var opt = (options) ? this.mixOptions(options) : this.mixOptions(null) ;
		var svg = d3.select(id).append("svg");
			svg.attr('class', 'lineChart');
      		svg.attr("width", opt.chart.width);
      		svg.attr("height", opt.chart.height);
      		svg.attr("viewBox",opt.viewBox);
      		svg.attr("preserveAspectRatio", opt.preserveAspectRatio);
      		svg.datum(data);			//塞入數據
      		svg.call(this.renderRadar, opt, this);	//要呼叫的函數 (會先執行)
	}
};

if(!window.Radar){
	window.LineChart = LineChart;
}

if(typeof(module)!= "undefined"){
	module.exports = LineChart;
}

}).call(this);
