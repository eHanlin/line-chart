;(function(){	
var LineChart = {
	options : {
		viewBox : '0,0,1100,135',
		preserveAspectRatio : "none",
		chart : {width:'100%', height:'100%'},
		axisZoom : 1,								//縮放
		maxValue : 100,								//軸最大值
		minValue : 0,								//軸的最小值
		zoomW : 0.85,								//水平縮放係數
		zoomH : 1,									//垂直縮放係數
		//刻度
		scale : {
			count : 10,
			Height : 15,							//刻度軸刻度垂直線高度
			color : "grey",							//刻度顏色
			verticalColor : "grey",					//垂直線色
			isShow : true,							//是否顯示刻度表
			width: 1,
			gap : 15,
			opacity : 0.6,
			title : "答對率",
			fontSize : 16,
			titleColor : '#000000',
			titleGap : 5,							//刻度Title文字的gap
			valueGap : 16							//每一刻度數值文字gap
		},
		bar :{
			//繪製起點
			top:-20,
			left:20 ,
			height : 35,				//條的高度
			rx : 15 ,					//圓角x
			ry : 15 ,					//圓角y
		},
		background : {
			color : '#eeeeee',
			opacity : 0.7,				//透明
			textColor : '#ff9800'
		},
		//bar 主要資訊
		mainInfo : {
			color : '#ffeb3b',
			opacity : 0.9,
			textColor : '#212121',
			fontSize : 16,
			textGapX : 5,
			textGapY : 5
		},
		gradien : [
			{ offset : '0%' , color : "#ffeb3b" , opacity : "1"},
			{ offset : '50%' , color : "#fdd835" , opacity : "1"},
			{ offset : '100%' , color : "#fbc02d" , opacity : "1"},
		],
		//上標記
		tMark : {
			radius : 8,
			opacity : 0.9,
			color : '#673ab7',
			gap : 15,			//與bar的gap
			lineColor : '#673ab7',
			lineOpacity : 0.5,
			isDash : true,
			offsetY : -15,
			textGapX : 15,
			fontSize : 16,
			text : '精熟平均'
		},
		//下標記
		bMark : {
			radius : 8,
			opacity : 0.9,
			color : '#5677fc',
			gap : 15,
			lineColor : '#29b6f6',
			lineOpacity : 0.7,
			isDash : true,
			offsetY : 15,
			textGapX : 15,
			fontSize : 16,
			text : '基礎平均'
		}
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
		d3.select(id).selectAll('svg').remove();
		
	},
	para : null,
	isFloat : function(n){
		return n % 1 !== 0;	
	},
	formatStr : function(val){
		return (val * 100 | 0) / 100;
	},
	randerScale : function(svg, parameter, opt, self){
		var mainY =  (parameter.chartHeight - opt.bar.height) / 2 + opt.bar.top + opt.bar.height + + opt.bMark.offsetY + opt.scale.gap + (opt.scale.Height/2);
		var mainX2 = opt.bar.left + parameter.chartWidth;
		//水平
		var g = svg.append('g');
			g.append('line')
		     .attr('x1', opt.bar.left)
			 .attr('y1', mainY)
			 .attr('x2', mainX2)
			 .attr('y2', mainY)
			 .attr('stroke-width', opt.scale.width)
			 .attr('stroke', opt.scale.verticalColor)
			 .attr('stroke-opacity', opt.scale.opacity);
			
			g.append('text')
			 .attr('x', mainX2 + opt.scale.titleGap)
			 .attr('y', mainY + opt.scale.fontSize/2)
			 .attr('fill', opt.scale.titleColor)
			 .attr('font-size', opt.scale.fontSize+'px')
			 .text(opt.scale.title);
		
		var basicValue = (mainX2 - opt.bar.left) / opt.scale.count;
		var hy1 = mainY - (opt.scale.Height / 2);
		var hy2 = mainY + (opt.scale.Height / 2);
		
		var oneScale = (opt.maxValue - opt.minValue) / opt.scale.count;
		for(var i=0, end=opt.scale.count+1 ; i < end ; i++){
			var hx = basicValue * i + opt.bar.left; 
			//垂直刻度
			g.append('line')
			 .attr('x1', hx)
			 .attr('y1', hy1)
			 .attr('x2', hx)
			 .attr('y2', hy2)
			 .attr('stroke-width', opt.scale.width)
			 .attr('stroke', opt.scale.verticalColor)
			 .attr('stroke-opacity', opt.scale.opacity);
			//文字
			g.append('text')
			 .attr('x', hx)
			 .attr('y', hy2 + opt.scale.valueGap)
			 .text(oneScale * i);
		}
		return g;
	},
	randerMarkText : function(svg, g, x, y, text, fontSize, color){
		g.append('text')
				 .attr('x', x)
				 .attr('y', y)
				 .attr('fill', color)
				 .attr('font-size', fontSize+'px')
				 .text(text);
	},
	randerMarkLine : function(svg, g, p1, p2, color, isDash, opacity){
		var line = g.append('line');
			line.attr('stroke',color)
			 	.attr('stroke-opacity', opacity)
			 	.attr('x1', p1.x)
			 	.attr('y1', p1.y)
			 	.attr('x2', p2.x)
			 	.attr('y2', p2.y);
		if(isDash){
				line.attr('stroke-dasharray', '5 5');
		}
	},
	randerTopMark : function(svg, g, parameter, opt, self){
		var cy =  (parameter.chartHeight - opt.bar.height) / 2 + opt.bar.top + opt.tMark.offsetY;
		var basic = parameter.chartWidth / (opt.maxValue - opt.minValue);
		var val = Number(svg.datum().skilledRate ) * 100;
		var w = basic * val;
		var cx = w + opt.bar.left;
		//指針
		var p1 = { x : cx, y : cy};
		var p2 = { x : cx, y : (parameter.chartHeight - opt.bar.height) / 2 + opt.bar.top + opt.bar.height};
		svg.call(self.randerMarkLine,g, p1, p2, opt.tMark.lineColor, opt.tMark.isDash, opt.tMark.lineOpacity);
		//文字
		var ty = p1.y + (opt.bMark.fontSize  - opt.bMark.radius) /2;
		var tx = p1.x + opt.tMark.textGapX;
		var text = opt.tMark.text + ' : ';
		if(val > 0){
			if( self.isFloat(val) ){
				text += self.formatStr(val);
			}
			else{
				text += val;
			}
		}else{
			text += val;
		}
		svg.call(self.randerMarkText,g, tx , ty, text , opt.tMark.fontSize , opt.tMark.color);
		//標記
		g.append('circle')
			 .attr('cx', cx)
			 .attr('cy', cy)
			 .attr('r', opt.tMark.radius * opt.zoomW)
			 .attr('fill', opt.tMark.color)
			 .attr('fill-opacity', opt.tMark.opacity);
	},
	randerBottomMark : function(svg, g, parameter, opt, self){
		var cy =  (parameter.chartHeight - opt.bar.height) / 2 + opt.bar.top + opt.bar.height + + opt.bMark.offsetY;
		var basic = parameter.chartWidth / (opt.maxValue - opt.minValue);
		var val = Number(svg.datum().basicRate ) * 100;
		var w = basic * val;
		var cx = w + opt.bar.left;
		//指針
		var p1 = { x : cx, y : cy};
		var p2 = { x : cx, y : (parameter.chartHeight - opt.bar.height) / 2 + opt.bar.top};
		svg.call(self.randerMarkLine,g, p1, p2, opt.bMark.lineColor, opt.bMark.isDash, opt.bMark.lineOpacity);
		//文字
		var ty = p1.y + (opt.bMark.fontSize  - opt.bMark.radius) /2;
		var tx = p1.x + opt.bMark.textGapX;
		var text = opt.bMark.text + ' : ';
		if(val > 0){
			if( self.isFloat(val) ){
				text += self.formatStr(val);
			}
			else{
				text += val;
			}
		}else{
			text += val;
		}
		svg.call(self.randerMarkText,g, tx , ty, text , opt.bMark.fontSize , opt.bMark.color);
		//標記
		g.append('circle')
			 .attr('cx', cx)
			 .attr('cy', cy)
			 .attr('r', opt.bMark.radius * opt.zoomW)
			 .attr('fill', opt.bMark.color)
			 .attr('fill-opacity', opt.bMark.opacity);
	},
	
	randerMainSourceText:function(svg, g, parameter, opt, self){
		var val = self.formatStr( Number(svg.datum().rightRate) * 100 );
		var y =  (parameter.chartHeight / 2) + opt.bar.top + (opt.mainInfo.fontSize / 2);
		var basic = parameter.chartWidth / (opt.maxValue - opt.minValue);
		var x = basic * val +  opt.bar.left;	
		var text = '0';
		var offsetX = 0;
		
		if(val > 0){
			if( self.isFloat(val) ){
				text = val + '';
				if(val > 1)
					offsetX = (text.length-1) * opt.mainInfo.fontSize;
			}
			else{
				text = val+'';
				if(val > 1){
					offsetX = (text.length) * opt.mainInfo.fontSize;
				}else{
					x =  opt.bar.left;
				}
			}
		}
		g.append('text')
		 .attr('font-size', opt.mainInfo.fontSize + 'px')
		 .text(text)
		 .attr('x', x - offsetX )
		 .attr('y', y)
		 .attr('fill', opt.mainInfo.textColor);
		 
	},
	randerMainSourceBar : function(svg, g, parameter, opt, self){
		var d = svg.datum();
		var y =  (parameter.chartHeight - opt.bar.height) / 2 + opt.bar.top;
		var basic = parameter.chartWidth / (opt.maxValue - opt.minValue);
		var w = basic * Number(d.rightRate) * 100;
		g.append('rect')
		     .attr('x', opt.bar.left)
			 .attr('y', y)
			 .attr('rx', opt.bar.rx)
			 .attr('ry', opt.bar.ry)
			 .attr('width' , w)
			 .attr('height', opt.bar.height)
			 .attr('fill', opt.mainInfo.color)
			 .attr('fill-opacity', opt.mainInfo.opacity)
			 .attr('style', 'fill:url(#barGradient)');
	},
	randerBackgroune : function(svg, parameter, opt, self){
		var y = (parameter.chartHeight - opt.bar.height) / 2 + opt.bar.top;
		var g = svg.append('g');
			g.append('rect')
		     .attr('x', opt.bar.left)
			 .attr('y', y)
			 .attr('rx', opt.bar.rx)
			 .attr('ry', opt.bar.ry)
			 .attr('width' , parameter.chartWidth)
			 .attr('height', opt.bar.height)
			 .attr('fill', opt.background.color)
			 .attr('fill-opacity', opt.background.opacity);
		return g;
	},
	randerGradien : function(svg, d, opt ,self){
		var defs = svg.append('g').append('defs');
		var gradient = defs.append('linearGradient');
		    gradient.attr('id', 'barGradient')
		   			.attr('x1','0%')
		   			.attr('y1','0%')
				    .attr('x2','0%')
				    .attr('y2','100%')
				    .attr('spreadMethod', 'pad');
				    
		for(var i=0, l=d.length ; i < l ; i++){
			gradient.append('stop')
					.attr('offset', d[i].offset)
					.attr('stop-color', d[i].color)
					.attr('stop-opacity', d[i].opacity);
		}
	},
	renderLineBar : function(svg, opt, self){
		var parameter = {};
		var viewBoxList = opt.viewBox.split(',');
		parameter.w = viewBoxList[2];
		parameter.h = viewBoxList[3];
		//圖長寬
		parameter.chartWidth  = parameter.w * opt.axisZoom * opt.zoomW;
		parameter.chartHeight = parameter.h * opt.axisZoom * opt.zoomH;
		//
		parameter.halfW = parameter.chartWidth  / 2;
		parameter.halfH = parameter.chartHeight / 2;
		
		self.para = parameter;
		
		svg.call(self.randerGradien, opt.gradien, opt, self);
		var g = svg.call(self.randerBackgroune, parameter, opt, self);
		svg.call(self.randerMainSourceBar, g, parameter, opt, self);
		svg.call(self.randerMainSourceText, g, parameter, opt, self);
		svg.call(self.randerTopMark, g, parameter, opt, self);
		svg.call(self.randerBottomMark, g, parameter, opt, self);
		svg.call(self.randerScale, parameter, opt, self);
	},
	draw : function(id, data, options){
		var opt = (options) ? this.mixOptions(options) : this.mixOptions(null) ;
		var svg = d3.select(id).append("svg");
			svg.attr('class', 'lineChart');
      		svg.attr("width", opt.chart.width);
      		svg.attr("height", opt.chart.height);
      		svg.attr("viewBox",opt.viewBox);
      		svg.attr("preserveAspectRatio", opt.preserveAspectRatio);
      		svg.datum(data);
      		svg.call(this.renderLineBar, opt, this);	//要呼叫的函數
	}
};

if(!window.LineChart){
	window.LineChart = LineChart;
}

if(typeof(module)!= "undefined"){
	module.exports = LineChart;
}

}).call(this);
