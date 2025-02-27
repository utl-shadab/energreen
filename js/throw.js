var stage = document.getElementById('stage');
    	
			var browserX = window.screenX;
			var browserY = window.screenY;
			var balls = [];
			var total = 5;
			var currentDrag = null;
			var mouseX = 0;
			var mouseY = 0;
			var stageWidth = $(document).width();
			var stageHeight = $(document).height();
			stage.width = stageWidth;
			stage.height = stageHeight;
			
			var IE = document.all ? true : false;
			if(!IE) document.addEventListener(Event.MOUSEMOVE, getMouseXY, false);
			document.onmousemove = getMouseXY;
			
			window.onresize = function(event)
			{
				stage.width = 10;
				stage.height = 10;
				stageWidth = $(document).width();
				stageHeight = $(document).height();
				stage.width = stageWidth;
				stage.height = stageHeight;
			}
			
			generate();
			
			var drawingCanvas = document.getElementById('stage');
			if(drawingCanvas.getContext)
			{
				var context = drawingCanvas.getContext('2d');
				setInterval(render, 20);
			}
			
			
			
			jQuery(document).ready(function()
			{
				$(document).mousedown(function(e)
				{
					onMouseDown();
				});
				
				$(document).mouseup(function(e)
				{
					onMouseUp();
				}); 
			})

			
			
			function onMouseDown()
			{
				var j = balls.length;
				while(--j > -1)
				{
					var dx = mouseX - balls[j].x;
					var dy = mouseY - balls[j].y;
					var dist = Math.sqrt(dx * dx + dy * dy);
					if(dist < balls[j].size/2)
					{
						currentDrag = balls[j];
						currentDrag.dragging = true;
						return;
					}
				}
			}
			
			function onMouseUp()
			{
				if(currentDrag != null) currentDrag.dragging = false;
			}
			
			
			
			
			function generate()
			{
				for(var i = 0; i < total; i++)
				{
					var ball = {};
					ball.color = "#" + genHex();
					ball.bounce = .5 + (Math.random() * .5);
					ball.vx = Math.random() * 50 - 25;
					ball.vy = Math.random() * 50 - 25;
					ball.size = 75 - (ball.bounce * 25);
					ball.x = Math.random() * stageWidth;
					ball.y = Math.random() * stageHeight;
					balls[balls.length] = ball;
				}
			}
			
			function genHex()
			{
				colors = new Array(14)
				colors[0]="0"
				colors[1]="1"
				colors[2]="2"
				colors[3]="3"
				colors[4]="4"
				colors[5]="5"
				colors[5]="6"
				colors[6]="7"
				colors[7]="8"
				colors[8]="9"
				colors[9]="a"
				colors[10]="b"
				colors[11]="c"
				colors[12]="d"
				colors[13]="e"
				colors[14]="f"
				
				digit = new Array(5)
				color=""
				for (i=0;i<6;i++)
				{
					digit[i]=colors[Math.round(Math.random()*14)]
					color = color+digit[i]
				}
				
				return color;
			}
			
			function render()
			{
				var isChange = (browserX != window.screenX || browserY != window.screenY);
				if(isChange)
				{
					var diffX = browserX - window.screenX;
					browserX = window.screenX;
					
					var diffY = browserY - window.screenY;
					browserY = window.screenY;
				}
				
				var j = balls.length;
				while(--j > -1)
				{
					update(balls[j]);
					
					if(isChange)
					{
						balls[j].vx += (diffX * .05);
						balls[j].vy += (diffY * .1);
					}
				}
				
				draw();
			}
			
			function draw()
			{
				context.clearRect(0, 0, stageWidth, stageHeight);
				var i = balls.length;
				while(--i > -1)
				{
					context.fillStyle = balls[i].color;
					context.beginPath();
					context.arc(balls[i].x,balls[i].y,balls[i].size,0,Math.PI*2,true);
					context.closePath();
					context.fill();
				}
			}
			
			function update(ball)
			{
				collisionCheck();
				
				var gravity = 2;
				var drag = .98;
				
				if(ball.dragging)
				{
					ball.vx = ball.x - ball.ox;
					ball.vy = ball.y - ball.oy;
					ball.ox = ball.x;
					ball.oy = ball.y;
					
					ball.x = mouseX;
					ball.y = mouseY;
					
					if ((ball.x + ball.size) > stageWidth)
					{
						ball.x = stageWidth - ball.size;
					}
					else if((ball.x - ball.size) < 0)
					{
						ball.x = 0 + ball.size;
					}
					
					if ((ball.y + ball.size) > stageHeight)
					{
						ball.y = stageHeight - ball.size;
					}
					else if((ball.y - ball.size) < 0)
					{
						ball.y = 0 + ball.size;
					}
				}
				else
				{
					ball.x += ball.vx;
					ball.y += ball.vy;
					
					if ((ball.x + ball.size) > stageWidth)
					{
						ball.x = stageWidth - ball.size;
						ball.vx = -ball.vx * ball.bounce;
					}
					else if((ball.x - ball.size) < 0)
					{
						ball.x = 0 + ball.size;
						ball.vx = -ball.vx * ball.bounce;
					}
					
					if ((ball.y + ball.size) > stageHeight)
					{
						ball.y = stageHeight - ball.size;
						ball.vy = -ball.vy * ball.bounce;
					}
					else if((ball.y - ball.size) < 0)
					{
						ball.y = 0 + ball.size;
						ball.vy = -ball.vy * ball.bounce;
					}
					
					ball.vx = ball.vx * drag;
					ball.vy = ball.vy * drag + gravity;
				}
			}
			
			
			
			
			function collisionCheck()
			{
				var spring = .5;
				
				for(var i = 0; i < (total-1); ++i)
				{
					var ball0 = balls[i];
					
					for(var j = i + 1; j < total; ++j)
					{
						var ball1 = balls[j];
						var dx = ball1.x - ball0.x;
						var dy = ball1.y - ball0.y;
						var dist = Math.sqrt(dx * dx + dy * dy);
						var minDist = ball0.size + ball1.size;
						
						if(dist < minDist)
						{
							var angle = Math.atan2(dy, dx);
							var tx = ball0.x + dx / dist * minDist;
							var ty = ball0.y + dy / dist * minDist;
							var ax = (tx - ball1.x);
							var ay = (ty - ball1.y);
							
							
							ball0.x -= ax;
							ball0.y -= ay;
							
							ball1.x += ax;
							ball1.y += ay;
							
							
							ball0.vx -= (ax * spring);
							ball0.vy -= (ay * spring);
							ball1.vx += (ax * spring);
							ball1.vy += (ay * spring);
						}
					}
				}
			}
			
			
			
			
			function getMouseXY(e)
			{
  				if(IE)
  				{
  					mouseX = event.clientX + document.body.scrollLeft
  					mouseY = event.clientY + document.body.scrollTop
  				}
  				else
  				{
  					mouseX = e.pageX
  					mouseY = e.pageY
  				}  
  				
  				if(mouseX < 0) {mouseX = 0;}
  				if(mouseY < 0) {mouseY = 0;}  
  				
  				return true;
			}