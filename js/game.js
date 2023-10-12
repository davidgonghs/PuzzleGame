			var tileArray=new Array(); //存储切片的二维数组
			var img=new Image();//在画布中要绘制的图片
			var imgSize=600;
			var ctx;//画笔
			var emptyObj=new Object();//空白图片
			var tilelen;//切片大小
			//游戏准备
			function ready(){
				var puzzle=document.getElementById("puzzle");
				puzzle.innerHTML="";
				ctx=puzzle.getContext("2d");
				img.src=document.getElementById("cankao").src;

			}
			//改变图片
			function changePic(ele){
				document.getElementById("cankao").src=ele.src;
				img.src=ele.src;
			}
			//根据游戏级别初始化
			function initGame(num){
				//得到切片大小
				tilelen=imgSize/num;
				tileArray=new Array();
				//将原图片坐标存入二维数组
				for (var i = 0; i < num; i++) {
					tileArray[i]=new Array(); //行
					for(var j = 0; j < num; j++){
						var obj=new Object();
						obj.x=i;
						obj.y=j;
						tileArray[i][j]=obj; //列
					}
				}
				//对二维数组切片进行洗牌
				shuffle();
				//判断随机之后的拼图是否有解，如果有解就绘制，如果无解重新排列
				var solved=workabel();
				if(solved){
					//按照二维数组绘制图片到画布
					redraw();
				}else{
					initGame(num);
				}
				
			}
			
			//重新绘制图片
			function redraw(){
				ctx.clearRect(0,0,imgSize,imgSize);
				var num=tileArray.length; //二维数组的长度
				for (var i = 0; i < num; i++) {
					for(var j = 0; j < num; j++){
						//原图片的坐标
						var curimg=tileArray[i][j];//得到真实图片的坐标
						//设置当前图片如果为空白的话就不绘制
						if(i==emptyObj.i && j==emptyObj.j){
							
						}else{
							//绘制一个小切片
							ctx.drawImage(img,curimg.x*tilelen,curimg.y*tilelen,tilelen,tilelen,i*tilelen,j*tilelen,tilelen,tilelen);
						}
					}
				}
			}
			//随机排列二维数组
			function shuffle(){
				var num=tileArray.length; //二维数组的长度
				for (var i = 0; i < num; i++) {
					for(var j = 0; j < num; j++){
						//获取随机位置
						var ri=Math.floor(Math.random()*num);
						var rj=Math.floor(Math.random()*num);
						//当前ij元素交换位置
						var t=tileArray[i][j];
						tileArray[i][j]=tileArray[ri][rj];
						tileArray[ri][rj]=t;
					}
				}
			
			//找到左上角(0,0)的位置设为空白，而且保证在正确的位置上
			for (var i = 0; i < num; i++) {
					for(var j = 0; j < num; j++){
						if(tileArray[i][j].x==0 && tileArray[i][j].y==0){
							var t=tileArray[i][j];
							tileArray[i][j]=tileArray[0][0];
							tileArray[0][0]=t;
							break;
						}
					}
				}
			//标记00为空白图片，画布中ij坐标
			emptyObj.i=0; 
			emptyObj.j=0;
			}
			//点击移动
			function move(e){
				//获得点击的位置，获得下标
				var ci=Math.floor(e.offsetX/tilelen);
				var cj=Math.floor(e.offsetY/tilelen);
				//如果点击的切片与空白相邻，则与空白交换位置。要么横坐标一样要么纵坐标一样，两坐标分别相减等于1则相邻
				if(Math.abs(ci-emptyObj.i)+Math.abs(cj-emptyObj.j)==1){
					var t=tileArray[ci][cj];
					tileArray[ci][cj]=tileArray[emptyObj.i][emptyObj.j];
					tileArray[emptyObj.i][emptyObj.j]=t;
					//修改空白图片的坐标
					emptyObj.i=ci;
					emptyObj.j=cj;
					//重新绘图
					redraw();
				}
				//判断游戏是否完成
				var success=isSuccess();
				//如果success为true则重新绘制整张图
				if(success){
					ctx.drawImage(img,0,0,imgSize,imgSize,0,0,imgSize,imgSize);
					//加文字
					ctx.font='bold 50px Candara';
					ctx.fillStyle='gold';
					ctx.fillText("SUCCESS！",imgSize/2,imgSize/2);
				}
			}
			//判断游戏是否完成
			function isSuccess(){
				var num=tileArray.length;
				var success=true;
				for (var i = 0; i < num; i++) {
					for(var j = 0; j < num; j++){
						//当前ij与tileArray[i][j]存储元素完全相同，则完成；如果有一个不一样则返回false
						if(tileArray[i][j].x!=i||tileArray[i][j].y!=j){
							success=false;
							break;
						}
						
					}
				}
				return success;
			}
			
			//判断拼图是否有解
			function workabel(){
				var num=tileArray.length;
				var arr1=new Array();
				//将二维数组坐标转换为数字存入一维数组
				for (var i = 0; i < num; i++) {
					for(var j = 0; j < num; j++){
						var ri=tileArray[i][j].x;
						var rj=tileArray[i][j].y;
						arr1.push(ri*num+rj);
					}
				}
				//求arr1的逆序数
				var total=0;
				for (var i = 0; i < num*num; i++) {
					for(var j = i+1; j < num*num; j++){
						if(arr1[i]>arr1[j]){total++;}
					}
				}
				if(total%2==0){
					return true;
				}else{
					return false;
				}
			}