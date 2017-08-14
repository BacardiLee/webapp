
//第一屏
function fnLoad(){
	var welcome = document.querySelector('#welcome');
	var main = document.querySelector('#main');
	var num = 0;
	var arr = ['img/tree.jpg','img/title.png','img/title2.png','img/logo.png','img/shake.png','img/cloud.png'];
	var onoff = false;
	var timer = null;
	var startTime = new Date().getTime();
	var onTime = false;	
	for(var i=0;i<arr.length;i++){
		//实例化图片对象，判断图片加载完成和失败后执行的事件
		var img = new Image();
		img.src = arr[i];
		img.onload = function(){
			num++;
			if(num == arr.length){
				onoff = true;
			}
		}
	}
	//通过判断时间差，设置第二屏的跳转
	timer = setInterval(function(){
		if((new Date().getTime() - startTime) >6000){
			onTime = true;
		}		
		if(onTime&&onoff){
			clearInterval(timer);
			welcome.style.opacity = 0;
			addClass(main,'showPage');
		}		
	},1000)
	//等第一屏的运动效果执行完，就让第一屏隐藏
	bind(welcome,'transitionend',end);
	bind(welcome,'webkitTransitionend',end);
	
	function end(){
		removeClass(welcome,'showPage');
		fnMain();
	}
	
}


//轮播
function fnMain(){
	var list = id('list');
	var main = id('main');
	var oA = main.querySelectorAll('a');
	
	var lis = list.children;
	var iw = view().w;
	var num = 0;
	var timer = null;
	var startX = null;
	var endX = null;
	//记录当前位置
	var now = 0;
	var transX =0;
	autoPlay();
	fnStar();
	function autoPlay(){
		timer = setInterval(function(){
			num++;
			num = num%lis.length;
			now = -num*iw;
			list.style.transform = list.style.webkitTransform = 'translateX('+now+'px)';
			setColor();
		},1500)
	}
	bind(list,'touchstart',start);
	bind(list,'touchmove',move);
	bind(list,'touchend',end);
	function start(ev){
		ev = ev.changedTouches[0];
		clearInterval(timer);
		startX = ev.pageX;
		list.style.transition = 'none';		
	}
	
	function move(ev){
		ev = ev.changedTouches[0];
		var dis = ev.pageX - startX;
		transX = dis;
		list.style.transform = list.style.webkitTransform = 'translateX('+(now+dis)+'px)';
	}
	
	function end(){
		now = now + transX;
		num = -Math.round(now/iw);		
		if(num>=lis.length-1){
			num = lis.length-1;
		}		
		if(num <=0){
			num = 0;
		}
		
		list.style.transition = '.5s';
		list.style.transform = list.style.webkitTransform = 'translateX(-'+(num*iw)+'px)';
		now = -num*iw;
		setColor();
		autoPlay();
	}
	
	function setColor(){
		for(var i=0;i<oA.length;i++){
			removeClass(oA[i],'active');
		}
		addClass(oA[num],'active');
	}
}


//评分

function fnStar(){
	var score = id('score');
	var mask = id('mask');
	var main = id('main');
	var lis = score.querySelectorAll('li');
	var btn = main.querySelector('.btn');
	var info = main.querySelector('.info');
	var Infoinput = score.querySelector('.info_input');
	var score1 = main.querySelector('.score1');
	var tag = score1.querySelector('.tag');
	
	
	for(var i=0;i<lis.length;i++){
		(function(index){
			var sA = lis[index].querySelectorAll('a');
			var oInput = lis[index].querySelector('input');			
			for(var j=0;j<sA.length;j++){
				sA[j].index = j;
				bind(sA[j],'touchstart',function(){
					for(var k=0;k<sA.length;k++){
						if(this.index>=sA[k].index){
							sA[k].style.backgroundPosition = '0 0';							
						}else{
							sA[k].style.backgroundPosition = '-38px 0';
						}
					}
					oInput.value = this.index+1;
					addClass(btn,'submit');
				})
			}
		})(i)
	}
	
	//提交按钮
	bind(btn,'touchstart',function(){
		var t = getScore();
		if(t){
			//分数全部打完
			if(getTag()){
				//标签已经添加
				addClass(mask,'showPage');
				fnMask();
				
			}else{
				//没有添加标签
				setInfo(info,'给景区添加标签');
			}			
		}else{
			setInfo(info,'还有未评分')
		}
	})
	
	//判断是否有全部评分
	function getScore(){
		for(var i=0;i<lis.length;i++){
			var Input = lis[i].getElementsByTagName('input')[0];
			if(!Input.value){
				return false;
			}				
		}
		return true;
	}
	
	
	//判断标签是否选中
	
	function getTag(){
		var aInput = tag.getElementsByTagName('input');
		for(var i=0;i<aInput.length;i++){
			if(aInput[i].checked){
				return true;
			}
		}
		return false;
	}
	
	//评分弹出框
	function setInfo(obj,value){
		obj.innerHTML = value;
		obj.style.transform = obj.style.webkitTransform = 'scale(1)';
		obj.style.opacity = 1;
		
		setTimeout(function(){
			obj.style.transform = obj.style.webkitTransform = 'scale(0)';
			obj.style.opacity = 0;
		},2000)
	}
	
}


function fnMask(){
	var main = id('main');
	var mask = id('mask');
	var news = id('news');
	
	addClass(news,'showPage');
	
	main.style.opacity = '.6';
	
	setTimeout(function(){
		mask.style.opacity = 1;
		mask.zIndex = 12;
		main.style.filter = main.style.webkitFilter = 'blur(3px)';
	},20)
	
	setTimeout(function(){
		main.style.opacity = '1';
		main.style.filter = main.style.webkitFilter = 'blur(0px)';
		mask.zIndex = 8;
		mask.style.opacity = 0;
		removeClass(mask,'showPage');
		removeClass(main,'showPage');
		fnNews();
	},3000)
	
	
}


//上传

function fnNews(){
	var news = id('news');
	var form = id('form');
	var upload = news.getElementsByTagName('upload')[0]	
	var Input = news.getElementsByTagName('input');
	var btn = news.getElementsByClassName('btn')[0];
	var onoff = false;
	
	addClass(form,'showPage');
	
	bind(Input[0],'change',function(){
		var f = this.files[0];		
		if(f){			
			var type = f.type.split('/')[0];
			if(type == 'video'){
				addClass(btn,'submit');
				onoff = true;
			}else{
				alert('请上传正确格式文件');
			}
		}		
	})
	bind(Input[1],'change',function(){
		var f = this.files[0];		
		if(f){
			var type = f.type.split('/')[0];
			if(type == 'image'){
				addClass(btn,'submit');
				onoff = true;
			}else{
				alert('请上传正确格式文件');
			}
		}		
	})
	
	bind(btn,'touchstart',function(){
		if(onoff){
			//通过ajax上传数据
			fnForm();
			removeClass(news,'showPage');
		}
	})
	
}


//提交评论

function fnForm(){
	var form = id('form');
	var Reset = id('reset');
	var labels = form.getElementsByTagName('label');
	var btn = form.getElementsByClassName('btn')[0];
	var onoff = false;
	for(var i=0;i<labels.length;i++){
		bind(labels[i],'touchstart',function(){
			onoff = true;
			addClass(btn,'submit');
		})
	}
	
	bind(btn,'touchstart',function(){
		if(onoff){	
			//传数据
			fnReset();
			removeClass(form,'showPage');
			addClass(Reset,'showPage');	
		}
	})
}

//重新评价

function fnReset(){
	var Reset = id('reset');
	var main = id('main');
	var btn = Reset.getElementsByClassName('btn')[0];
	
	bind(btn,'touchstart',function(){
		removeClass(Reset,'showPage');
		addClass(main,'showPage');	
		fnStar();
	})
}
