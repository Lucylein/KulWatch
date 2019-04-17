document.addEventListener('DOMContentLoaded', function(){ 
	
	var canvas = document.getElementById("watch");
	canvas.height = window.innerHeight * 0.9;
	canvas.width = window.innerWidth * 0.9;

	if (canvas.height < canvas.width) {
		canvas.width = canvas.height;
	} else {
		canvas.height = canvas.width;
	}
	// I calc that stuff - 4 cause otherwise that wierd scrollbar comes and f-s up the beauty (Kappa) of my program.

	var ctx = canvas.getContext("2d");

	var radius = canvas.height / 2;
	ctx.translate(radius, radius);
	ctx.lineCap = "round";
	radius = radius * 0.90;

	var hourAngle = 0;
	var minuteAngle = 0;

	drawClock(ctx);


	setInterval(function() {
		drawClock(ctx)	
	} , 1000/4);

	function drawClock(ctx) {
		drawFace(ctx, radius);
		drawNumbers(ctx, radius);
		updateAngle();
		
		// the "time reading help " for the watch
		// Uhrzeitleserhilfsanzeiger
		ctx.lineWidth = radius * 0.3;
		ctx.lineCap = "butt";
		ctx.strokeStyle = "rgba(255,0,0,0.7)";
		ctx.beginPath();
		ctx.moveTo(radius * 0.3, 0);
		ctx.lineTo(radius * 0.98, 0);
		ctx.stroke();
		ctx.lineCap = "round";
		ctx.lineWidth = radius * 0.2;
	}

	function drawFace(ctx, radius) {
		ctx.beginPath();
		/* 1st param: x of the first circle
		 * 2nd param: y of the first circle
		 * 3rd param: r of the first circle
		 * 4th-6th: the same as above just for the 2nd circle
		 */
		let grad = ctx.createRadialGradient(0, 0 ,radius, 0, 0, radius * 1.1);
		// radial gradiant from 0,0 to radius,radius * 1.1
		// so a gradiant that goes around the clock has a padding of 1.1% of its radius

		// 1st param percentage... I guess
		grad.addColorStop(0, '#3232FF');
		grad.addColorStop(0.5, '#32FF32');
		grad.addColorStop(1, '#FF3232');
		ctx.strokeStyle = grad;
		ctx.lineWidth = radius * 0.2;

		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI);
		ctx.stroke();

		// outer circle 
		ctx.fillStyle = '#323232';

		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI);
		ctx.fill();

		// inner circle 
		ctx.fillStyle = '#cecece';

		ctx.beginPath();
		ctx.arc(0, 0, radius * .65, 0, 2 * Math.PI);
		ctx.fill();
	}

	function drawNumbers(ctx, radius) {
		var num;
		ctx.font = radius * 0.20 + "px arial";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillStyle = '#323232';

		let iRads = calcRads(360 / 12); // 12 hours on 360°
		for(num = 1; num <= 12; num++) {
			hourAngle += iRads;
			ctx.rotate(hourAngle);
			ctx.fillText(num.toString(), radius * 0.5, 0);
			ctx.rotate(-hourAngle);

		}
		// seperator minutes/ hours
		ctx.beginPath();
		let grad = ctx.createRadialGradient(0, 0 ,radius * 0.65, 0, 0, radius * 0.7);
		grad.addColorStop(0, '#cecece');
		grad.addColorStop(1, '#323232');
		ctx.strokeStyle = grad;
		ctx.lineWidth = radius * 0.06;

		ctx.beginPath();
		ctx.arc(0, 0, radius * 0.65, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = '#fff';
		iRads = calcRads(360 / (60 / 5)); // 60 minutes (of witch I just want every 5th) on 360°
		for(num = 0; num < 60; num += 5) {
			ctx.rotate(minuteAngle);
			ctx.fillText(num.toString(), radius * 0.85, 0);
			ctx.rotate(-minuteAngle);
			minuteAngle += iRads;
		}
	}

	function calcRads(degree) {
		let rads = 0;
		rads = degree * (Math.PI / 180);
		return rads;
	}

	function updateAngle() {
		let date = new Date();
		let h = date.getHours();
		let m = date.getMinutes();
		let s = date.getSeconds();

		// 60 minutes == max && 12 H == max
		// * 360 to get the fraction in a circle 
		//minute = calcRads();
		h = h % 12;
		h = calcRads(h / 12 * 360
			+ m / (60 * 12) * 360);
		m = calcRads(m / 60 * 360
			+ s / (60 * 60) * 360);
		hourAngle = -h;
		minuteAngle = -m;

		/* Using next smalest unit to make transitions between
		 * hours or minutes not that "hard" in the sence that the hands
		 * dont snap to the next possition
		 */  
	}

}, false);
