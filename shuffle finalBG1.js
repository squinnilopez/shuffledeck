(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"shuffle finalBG1_atlas_1", frames: [[0,0,1930,1088]]},
		{name:"shuffle finalBG1_atlas_2", frames: [[0,1034,451,957],[453,1034,451,957],[906,1034,678,601],[0,0,1673,1032]]},
		{name:"shuffle finalBG1_atlas_3", frames: [[1485,0,385,669],[1484,671,385,669],[656,386,826,384],[656,0,827,384],[0,1342,385,669],[387,1342,385,669],[774,1342,385,669],[1161,1342,385,669],[1548,1342,385,669],[0,516,385,669],[387,772,576,414],[0,0,654,514]]},
		{name:"shuffle finalBG1_atlas_4", frames: [[1111,212,29,514],[0,1278,354,638],[703,295,299,210],[688,1506,181,83],[1027,1849,340,75],[871,1506,48,78],[761,750,54,669],[692,1833,48,78],[817,750,54,669],[1056,851,32,83],[955,212,47,76],[985,1178,53,669],[1056,936,32,83],[842,1833,47,76],[1040,1178,53,669],[1056,1021,31,83],[622,750,62,76],[983,507,71,669],[738,1676,31,83],[891,212,62,76],[688,750,71,669],[771,1676,25,83],[742,1833,48,75],[873,750,54,669],[798,1676,25,83],[792,1833,48,75],[929,1178,54,669],[891,1833,36,83],[618,1119,48,90],[1004,212,50,240],[1056,212,53,637],[1111,728,36,83],[688,1676,48,90],[860,1591,50,240],[1095,851,53,637],[929,750,29,417],[891,0,230,210],[688,1421,231,83],[339,1921,345,76],[360,855,306,262],[1150,501,29,486],[0,0,358,637],[360,1119,256,83],[356,1840,334,79],[360,295,341,241],[0,639,358,637],[360,538,260,315],[1173,0,29,445],[688,1591,170,83],[686,1921,339,76],[1142,0,29,499],[622,538,359,210],[0,1918,337,78],[356,1278,330,560],[360,0,529,293]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_528 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_527 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_526 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_525 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_524 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_523 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_522 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_521 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_520 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_519 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_518 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_517 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_516 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_515 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_514 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_513 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_512 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_511 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_510 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_509 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_508 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_507 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_506 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_505 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_504 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_503 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_502 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_501 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_500 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_499 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_498 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_497 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_496 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_495 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_494 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_493 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_492 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_491 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_490 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_489 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_488 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_487 = function() {
	this.initialize(img.CachedBmp_487);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2583,1627);


(lib.CachedBmp_486 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_485 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_484 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_483 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_482 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_481 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_480 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_479 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_478 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_477 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_476 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_475 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_474 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_473 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_472 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_471 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_470 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_469 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_468 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_467 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(50);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_466 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(51);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_465 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_464 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(52);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_463 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.Image = function() {
	this.initialize(ss["shuffle finalBG1_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.Image_0 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.Image_1 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.Image_2 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(53);
}).prototype = p = new cjs.Sprite();



(lib.g2 = function() {
	this.initialize(ss["shuffle finalBG1_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.ringslight = function() {
	this.initialize(ss["shuffle finalBG1_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.rudra = function() {
	this.initialize(ss["shuffle finalBG1_atlas_4"]);
	this.gotoAndStop(54);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Tween17 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.ringslight();
	this.instance.setTransform(-338,-363.4,0.4025,0.7065,-0.2042);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-338,-365.7,676.1,731.4);


(lib.Tween10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_521();
	this.instance.setTransform(-11.15,114.3,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_520();
	this.instance_1.setTransform(-13.8,-167.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.8,-167.2,27,334.5);


(lib.Tween9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_519();
	this.instance.setTransform(-11.15,114.3,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_518();
	this.instance_1.setTransform(-13.8,-167.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.8,-167.2,27,334.5);


(lib.Tween8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_517();
	this.instance.setTransform(-7.9,110.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_516();
	this.instance_1.setTransform(-12.1,-154.3,0.5,0.5);

	this.instance_2 = new lib.rudra();
	this.instance_2.setTransform(-13.4,11.75,0.2425,0.2414,0,-7.8095,-82.2624);

	this.instance_3 = new lib.CachedBmp_515();
	this.instance_3.setTransform(-13.7,-167.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.7,-167.2,27.2,334.5);


(lib.Tween7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_514();
	this.instance.setTransform(-7.9,110.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_513();
	this.instance_1.setTransform(-12.1,-154.3,0.5,0.5);

	this.instance_2 = new lib.rudra();
	this.instance_2.setTransform(-13.4,11.75,0.2425,0.2414,0,-7.8095,-82.2624);

	this.instance_3 = new lib.CachedBmp_512();
	this.instance_3.setTransform(-13.7,-167.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.7,-167.2,27.2,334.5);


(lib.Tween6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_511();
	this.instance.setTransform(-7.9,112.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_510();
	this.instance_1.setTransform(-15.85,-153.5,0.5,0.5);

	this.instance_2 = new lib.Image_2();
	this.instance_2.setTransform(-9.25,-94.95,0.0547,0.2985);

	this.instance_3 = new lib.CachedBmp_509();
	this.instance_3.setTransform(-17.8,-167.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-17.8,-167.2,35.5,334.5);


(lib.Tween5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_508();
	this.instance.setTransform(-7.9,112.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_507();
	this.instance_1.setTransform(-15.85,-153.5,0.5,0.5);

	this.instance_2 = new lib.Image_2();
	this.instance_2.setTransform(-9.25,-94.95,0.0547,0.2985);

	this.instance_3 = new lib.CachedBmp_506();
	this.instance_3.setTransform(-17.8,-167.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-17.8,-167.2,35.5,334.5);


(lib.Tween4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_505();
	this.instance.setTransform(-6.3,112.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_504();
	this.instance_1.setTransform(-12.1,-154.3,0.5,0.5);

	this.instance_2 = new lib.Image_0();
	this.instance_2.setTransform(-11.05,-72.25,0.0384,0.3209);

	this.instance_3 = new lib.CachedBmp_503();
	this.instance_3.setTransform(-13.65,-167.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.6,-167.2,27,334.5);


(lib.Tween3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_502();
	this.instance.setTransform(-6.3,112.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_501();
	this.instance_1.setTransform(-12.1,-154.3,0.5,0.5);

	this.instance_2 = new lib.Image_0();
	this.instance_2.setTransform(-11.05,-72.25,0.0384,0.3209);

	this.instance_3 = new lib.CachedBmp_500();
	this.instance_3.setTransform(-13.65,-167.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.6,-167.2,27,334.5);


(lib.Group_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFE2E2").s().p("AlpBkIDsjAIkBCUIgLgZIFykXIl9D/QhxkDgnkXIFqh5IluBYQgZjJAOjQIEwCJIB9j3QC1CzCKDOIjDCtIDTiUIAMATIiTCoIC2hvQE0IGAbJ5QANE9gwDVQprmgkao4g");
	this.shape.setTransform(57.7372,137.725);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFE2E2").s().p("AjJBiQANiGAch5QAPg9ALgiQC1B9CbCTIh/DpQichZh4hCg");
	this.shape_1.setTransform(21.075,25.275);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_1, new cjs.Rectangle(0,0,115.5,246.1), null);


(lib.Group_1_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFE2E2").s().p("AjDGLIAekSIhIEDIgWgJIA+mfIhVGWQjthgjLieICfkzIi3EgQiQhyh6iPIEchoIhLjvQDoAADcAwIgSDsIAsjnIAVAFIAKDKIAwi7QIPCOGjGKQDSDFBnCpQkEAwjxAAQl6AAlJh1g");
	this.shape_2.setTransform(122.225,51.2026);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFE2E2").s().p("Ai4gnQgdgwgOgeQDFghDBgCIBBDnQieAph2AhQhOhgg6hgg");
	this.shape_3.setTransform(22.825,15.325);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_1_1, new cjs.Rectangle(0,0,223.6,102.4), null);


(lib.Group_1_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFE2E2").s().p("Ao9IqQAap5E0oGIC2BvIiTioIAMgTIDTCUIjDitQCKjOC1izIB9D3IEwiJQAODQgZDJIluhYIFqB5QgnEXhxEDIl9j/IFyEXIgLAZIkBiUIDsDAQkaI4prGgQgwjVAOk9g");
	this.shape_4.setTransform(57.6781,137.725);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFE2E2").s().p("AjJAUQCbiTC1h9QALAiAPA9QAcB5ANCGIkUCbg");
	this.shape_5.setTransform(94.325,25.275);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_1_2, new cjs.Rectangle(0,0,115.4,246.1), null);


(lib.Group_1_3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFE2E2").s().p("Av0HQQBoipDRjFQGimKIPiOIAxC7IAKjKIAUgFIAtDnIgSjtQDdgvDmAAIhLDuIEdBpQh5CNiRB0Ii3kgICfEzQjLCejtBgIhWmWIA/GfIgXAJIhIkDIAfESQlKB1l5AAQjxAAkEgwg");
	this.shape_6.setTransform(101.325,51.2026);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFE2E2").s().p("AjjBPIBBjnQC8ABDKAiQgOAegdAwQg7BghNBgg");
	this.shape_7.setTransform(200.7,15.325);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_1_3, new cjs.Rectangle(0,0,223.5,102.4), null);


(lib.stars = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_487();
	this.instance.setTransform(0,0,0.3455,0.3455);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.stars, new cjs.Rectangle(0,0,892.5,562.2), null);


(lib.moon = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Image();
	this.instance.setTransform(43.3,37.8,0.1219,0.1219,34.2392);

	this.instance_1 = new lib.Image_1();
	this.instance_1.setTransform(0,87.6,0.1033,0.1033,-72.4859);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFBB8").s().p("AkDIpQjqhjhUjzQhOjkBjjqQBijpDdh0QggBkAABlQAABpAiBiQBTDyDoBiQDpBjD3hoQAbgLAZgOQgtCPhlByQhpB1iOA8Qh+A1h6AAQh1AAhxgwg");
	this.shape.setTransform(89.8142,60.089);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,151.1,144.9);


(lib.gradient = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.g2();
	this.instance.setTransform(-802.45,-366.65,0.8316,0.6741);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.gradient, new cjs.Rectangle(-802.4,-366.6,1604.9,733.3), null);


(lib.back_0 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B8D7D0").s().p("AuQaIQgVAAgPgOQgPgPAAgVMAAAgyrQAAgVAPgPQAPgOAVAAIciAAQAUAAAPAOQAOAPAAAVMAAAAyrQAAAVgOAPQgPAOgUAAg");
	this.shape.setTransform(96.35,167.225);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.back_0, new cjs.Rectangle(0,0,192.7,334.5), null);


(lib.back = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B8D7D0").s().p("AuQaIQgWAAgOgOQgPgPAAgVMAAAgyrQAAgVAPgPQAOgOAWAAIciAAQAUAAAPAOQAOAPAAAVMAAAAyrQAAAVgOAPQgPAOgUAAg");
	this.shape.setTransform(96.35,167.225);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.back, new cjs.Rectangle(0,0,192.7,334.5), null);


(lib.Group_3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#0E5B93").s().p("AC9EtQhWhbh0iUQi9CwkFBdQCNjbDiinQhkh+g2hZQhDhvgRhRQCeBgCeDhQCuhuBhg0QCJhIBJgHQhIBrh4B0QhvBqhGAnQDYEKBODUQhXg0hshvg");
	this.shape.setTransform(61.05,60.65);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#0E5B93").ss(1.4).p("Ag5h1QgEigAKhoQALiBAkhMQBECsgIERQDOAOBuAQQCZAWBAAmQh7AsilAVQiYAVhRgKQAPFXhADYQgnhdgTiaQgQh7gFi8QkBAekKhMQD2hfEYgCg");
	this.shape_1.setTransform(60.6569,60.5289);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#4BABB0").s().p("AgqFTQgQh7gEi8QkCAekKhNQD3hfEYgBQgFihAKhnQAMiCAjhLQBFCrgIESQDOANBuARQCZAWBAAlQh8AsilAWQiYAUhRgKQAPFXhADYQgnhdgTiZg");
	this.shape_2.setTransform(60.925,60.375);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_3, new cjs.Rectangle(0.1,0,121.10000000000001,120.9), null);


(lib.Group_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#AA84AF").s().p("ACxFAQhThhhwihQjNCskSBTQBLhqBahYQBnhkCDhWQhgiJgzhfQg/h3gNhVQCeBuCWDxQC5hpBpgwQCQhDBNgEQhRBsiCBxQh4BnhLAlQDREeBFDhQhYg6hph6g");
	this.shape.setTransform(60.725,61.075);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#7B489A").s().p("AhAFcQgJh+AFjFQkJASkRheQEChWEjAPQAFinAPhrQATiFAohNQA+C2gXEbQDVAaBwAWQCcAgBBAqQiDAmirAOQifANhSgPQgCFihODeQgkhigMihg");
	this.shape_1.setTransform(60.65,60.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_2, new cjs.Rectangle(0,0,121.3,121.3), null);


(lib.Group_1_4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#C69C6D").s().p("AChFHQhPhkhoinQjUCikXBGQCnjUD6iVQhZiMguhiQg7h5gJhXQCaB2CKD4QC8hgBsgsQCUg7BNAAQhXBniHBqQh8BihNAiQDDEoA6DjQhVg+hih/g");
	this.shape_8.setTransform(60.5,60.75);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#754C24").s().p("AhSFZQgDh/AOjEQkMAEkJhqQB9gjB9gMQCQgNCeAPQAMioAUhpQAZiDArhLQA2C5gkEYQDUAlBuAbQCcAnA9AtQiDAgitAGQieAGhTgUQgTFkhYDYQgfhkgEigg");
	this.shape_9.setTransform(60.5,60.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_1_4, new cjs.Rectangle(0,0,121,121), null);


(lib.Group_0 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#A8394C").s().p("Ah8F0QgSiVAMilQiugJhvgTQiLgYhPgrQDAg8EnAfQAgjdAah0QAkijAuhCQAlCJALCzQAJCmgSBWQF1ANDkBWQhnAjipAIQiGAGjLgKQAKEXhoEYQgniCgQiDg");
	this.shape.setTransform(63.4,63.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#C7808D").s().p("ADjE+QhphTiUiNQirDakICRQA2h8BKhuQBTh9Bzh0Qh/h5hIhWQhahtgghVQC5BPDMDYQCniSBfhIQCGhjBNgUQg8CAhsCPQhkCEhFA1QESD7B2DYQhlgpiFhng");
	this.shape_1.setTransform(60.05,61.625);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_0, new cjs.Rectangle(0,0,126.8,126.6), null);


(lib.Group = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#6C6678").ss(2.5).p("AAKiKQBmiFBMhNQBehiBOgmQg4C4i7DZQCdCSBNBUQBsB2AbBIQiAgtiThZQiIhTg6g9QhmCLhfBjQhqBwhoBHQAdhlBWiKQBEhsB4icQjiiQijjtQB8AoBwA7QCABEB6Bjg");
	this.shape.setTransform(60.71,60.1981);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#6C6678").s().p("AkYD0QBEhtB4ibQjiiQiijtQB7AnBwA8QCABEB6BjQBmiFBMhNQBehiBPgnQg5C5i7DZQCdCSBNBUQBsB2AbBIQh/gtiUhZQiIhUg6g8QhmCKheBjQhrBwhnBIQAdhmBViJg");
	this.shape_1.setTransform(61.2,59.9);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#00A99D").s().p("Ag+FfQgKh/AEjHQkLATkQhdQEChXEkAMQADinAPhsQATiGAnhNQA/C4gVEbQDUAZBxAWQCeAfBAAqQiCAnisAPQifAOhSgPQgCFphMDcQgkhjgNihg");
	this.shape_2.setTransform(60.775,61.125);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group, new cjs.Rectangle(0,0,121.6,122.3), null);


(lib.yoni2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_528();
	this.instance.setTransform(8.85,49,0.5,0.5);

	this.instance_1 = new lib.Group_0();
	this.instance_1.setTransform(96.55,168.15,1,1,0,0,0,63.4,63.3);
	this.instance_1.alpha = 0.1484;

	this.instance_2 = new lib.CachedBmp_527();
	this.instance_2.setTransform(7.8,7.8,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_526();
	this.instance_3.setTransform(19.85,117.4,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_525();
	this.instance_4.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.yoni2, new cjs.Rectangle(0,0,192.5,334.5), null);


(lib.yoni1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// yfli
	this.instance = new lib.Tween3("synched",0);
	this.instance.setTransform(-6.35,974.45);
	this.instance._off = true;

	this.instance_1 = new lib.Tween4("synched",0);
	this.instance_1.setTransform(-6.35,162.45);

	this.instance_2 = new lib.CachedBmp_524();
	this.instance_2.setTransform(51.2,279.35,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_523();
	this.instance_3.setTransform(11,12.9,0.5,0.5);

	this.instance_4 = new lib.Image_0();
	this.instance_4.setTransform(17.7,94.95,0.2731,0.3209);

	this.instance_5 = new lib.CachedBmp_522();
	this.instance_5.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},14).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]},1).wait(575));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(14).to({_off:false},0).to({_off:true,y:162.45},5,cjs.Ease.get(1)).wait(576));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-20,-4.7,212.5,1146.5);


(lib.Tween2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_499();
	this.instance.setTransform(-9.05,114.75,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_498();
	this.instance_1.setTransform(-11.9,-158.05,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_497();
	this.instance_2.setTransform(-12.35,-82.3,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_496();
	this.instance_3.setTransform(-13.45,-159.3,0.5,0.5);

	this.instance_4 = new lib.back_0();
	this.instance_4.setTransform(-0.05,0,0.141,1,0,0,0,96.1,167.2);
	this.instance_4.alpha = 0.9805;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.6,-167.2,27.2,334.5);


(lib.Tween1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_495();
	this.instance.setTransform(-9.05,114.75,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_494();
	this.instance_1.setTransform(-11.9,-158.05,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_493();
	this.instance_2.setTransform(-12.35,-82.3,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_492();
	this.instance_3.setTransform(-13.45,-159.3,0.5,0.5);

	this.instance_4 = new lib.back_0();
	this.instance_4.setTransform(-0.05,0,0.141,1,0,0,0,96.1,167.2);
	this.instance_4.alpha = 0.9805;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.6,-167.2,27.2,334.5);


(lib.Tween7_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance_4 = new lib.CachedBmp_491();
	this.instance_4.setTransform(-56.95,-26.5,0.1377,0.1377);

	this.instance_5 = new lib.Group_1_3();
	this.instance_5.setTransform(0.4,-0.15,0.5054,0.5054,0,0,0,111.8,51.1);
	this.instance_5.alpha = 0.5;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_5},{t:this.instance_4}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-56.9,-26.5,113.8,52.9);


(lib.Tween5_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance_4 = new lib.CachedBmp_490();
	this.instance_4.setTransform(-29.7,-63.05,0.1317,0.1317);

	this.instance_5 = new lib.Group_1_2();
	this.instance_5.setTransform(0.3,-1,0.5054,0.5054,0,0,0,57.8,122.7);
	this.instance_5.alpha = 0.5;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_5},{t:this.instance_4}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-29.7,-63,59.4,126);


(lib.Tween3_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance_4 = new lib.CachedBmp_489();
	this.instance_4.setTransform(-56.8,-26.45,0.1375,0.1375);

	this.instance_5 = new lib.Group_1_1();
	this.instance_5.setTransform(-0.35,-0.15,0.5054,0.5054,0,0,0,111.6,51.1);
	this.instance_5.alpha = 0.5;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_5},{t:this.instance_4}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-56.8,-26.4,113.69999999999999,52.8);


(lib.Tween1_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance_5 = new lib.CachedBmp_488();
	this.instance_5.setTransform(-29.7,-63.05,0.1317,0.1317);

	this.instance_6 = new lib.Group_1();
	this.instance_6.setTransform(-0.25,-1,0.5054,0.5054,0,0,0,57.6,122.7);
	this.instance_6.alpha = 0.5;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_6},{t:this.instance_5}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-29.7,-63,59.4,126);


(lib.stars1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1_copy_copy
	this.twinkle1 = new lib.stars();
	this.twinkle1.name = "twinkle1";
	this.twinkle1.setTransform(446.35,281.05,0.3878,0.3878,0,0,0,446.4,281.1);
	this.twinkle1._off = true;

	
	var _tweenStr_0 = cjs.Tween.get(this.twinkle1).wait(99).to({_off:false},0).wait(1).to({regX:446.2,scaleX:0.4013,scaleY:0.4013,x:446.25},0).wait(1).to({scaleX:0.4146,scaleY:0.4146},0).wait(1).to({scaleX:0.4278,scaleY:0.4278,y:281},0).wait(1).to({scaleX:0.4409,scaleY:0.4409,x:446.2,y:281.05},0).wait(1).to({scaleX:0.4538,scaleY:0.4538,x:446.25,y:281},0).wait(1).to({scaleX:0.4666,scaleY:0.4666},0).wait(1).to({scaleX:0.4793,scaleY:0.4793},0).wait(1).to({scaleX:0.4918,scaleY:0.4918,x:446.2,y:281.05},0).wait(1).to({scaleX:0.5042,scaleY:0.5042,y:281},0).wait(1).to({scaleX:0.5164,scaleY:0.5164},0).wait(1).to({scaleX:0.5285,scaleY:0.5285},0).wait(1).to({scaleX:0.5405,scaleY:0.5405,y:281.05},0).wait(1).to({scaleX:0.5523,scaleY:0.5523,y:281},0).wait(1).to({scaleX:0.564,scaleY:0.564},0).wait(1).to({scaleX:0.5756,scaleY:0.5756,x:446.15},0).wait(1).to({scaleX:0.587,scaleY:0.587},0).wait(1).to({scaleX:0.5983,scaleY:0.5983},0).wait(1).to({scaleX:0.6094,scaleY:0.6094,x:446.2},0).wait(1).to({scaleX:0.6205,scaleY:0.6205},0).wait(1).to({scaleX:0.6313,scaleY:0.6313,x:446.15,y:280.95},0).wait(1).to({scaleX:0.6421,scaleY:0.6421,y:281},0).wait(1).to({scaleX:0.6527,scaleY:0.6527,y:280.95},0).wait(1).to({scaleX:0.6631,scaleY:0.6631},0).wait(1).to({scaleX:0.6735,scaleY:0.6735},0).wait(1).to({scaleX:0.6837,scaleY:0.6837,y:281},0).wait(1).to({scaleX:0.6937,scaleY:0.6937,y:280.95},0).wait(1).to({scaleX:0.7036,scaleY:0.7036,y:281},0).wait(1).to({scaleX:0.7134,scaleY:0.7134},0).wait(1).to({scaleX:0.7231,scaleY:0.7231,y:280.95},0).wait(1).to({scaleX:0.7326,scaleY:0.7326,x:446.1,y:281},0).wait(1).to({scaleX:0.742,scaleY:0.742,y:280.95},0).wait(1).to({scaleX:0.7512,scaleY:0.7512},0).wait(1).to({scaleX:0.7603,scaleY:0.7603,x:446.15},0).wait(1).to({scaleX:0.7692,scaleY:0.7692,y:281},0).wait(1).to({scaleX:0.7781,scaleY:0.7781,x:446.1,y:280.95},0).wait(1).to({scaleX:0.7868,scaleY:0.7868},0).wait(1).to({scaleX:0.7953,scaleY:0.7953},0).wait(1).to({scaleX:0.8037,scaleY:0.8037,y:281},0).wait(1).to({scaleX:0.812,scaleY:0.812,y:280.95},0).wait(1).to({scaleX:0.8201,scaleY:0.8201},0).wait(1).to({scaleX:0.8281,scaleY:0.8281},0).wait(1).to({scaleX:0.836,scaleY:0.836},0).wait(1).to({scaleX:0.8437,scaleY:0.8437,x:446.05},0).wait(1).to({scaleX:0.8513,scaleY:0.8513,x:446.1},0).wait(1).to({scaleX:0.8588,scaleY:0.8588},0).wait(1).to({scaleX:0.8661,scaleY:0.8661},0).wait(1).to({scaleX:0.8733,scaleY:0.8733,x:446.05},0).wait(1).to({scaleX:0.8803,scaleY:0.8803,x:446.1},0).wait(1).to({scaleX:0.8873,scaleY:0.8873},0).wait(1).to({scaleX:0.894,scaleY:0.894,x:446.05},0).wait(1).to({scaleX:0.9007,scaleY:0.9007,y:280.9},0).wait(1).to({scaleX:0.9072,scaleY:0.9072,y:280.95},0).wait(1).to({scaleX:0.9135,scaleY:0.9135},0).wait(1).to({scaleX:0.9197,scaleY:0.9197,x:446.1},0).wait(1).to({scaleX:0.9258,scaleY:0.9258,x:446.05},0).wait(1).to({scaleX:0.9318,scaleY:0.9318,y:280.9},0).wait(1).to({scaleX:0.9376,scaleY:0.9376,y:280.95},0).wait(1).to({scaleX:0.9433,scaleY:0.9433},0).wait(1).to({scaleX:0.9488,scaleY:0.9488,y:280.9},0).wait(1).to({scaleX:0.9542,scaleY:0.9542,y:280.95},0).wait(1).to({scaleX:0.9595,scaleY:0.9595,y:280.9},0).wait(1).to({scaleX:0.9646,scaleY:0.9646,y:280.95},0).wait(1).to({scaleX:0.9696,scaleY:0.9696,y:280.9},0).wait(1).to({scaleX:0.9745,scaleY:0.9745},0).wait(1).to({scaleX:0.9792,scaleY:0.9792,y:280.95},0).wait(1).to({scaleX:0.9838,scaleY:0.9838},0).wait(1).to({scaleX:0.9882,scaleY:0.9882},0).wait(1).to({scaleX:0.9925,scaleY:0.9925},0).wait(1).to({scaleX:0.9967,scaleY:0.9967,x:446,y:280.9},0).wait(1).to({scaleX:1.0007,scaleY:1.0007,x:446.1,y:280.95},0).wait(1).to({scaleX:1.0046,scaleY:1.0046},0).wait(1).to({scaleX:1.0084,scaleY:1.0084},0).wait(1).to({scaleX:1.012,scaleY:1.012,y:281},0).wait(1).to({scaleX:1.0155,scaleY:1.0155,x:446.05,y:280.95},0).wait(1).to({scaleX:1.0189,scaleY:1.0189},0).wait(1).to({scaleX:1.0221,scaleY:1.0221,x:446.1},0).wait(1).to({scaleX:1.0251,scaleY:1.0251,x:446.05},0).wait(1).to({scaleX:1.0281,scaleY:1.0281,x:446.1,y:281},0).wait(1).to({scaleX:1.0309,scaleY:1.0309},0).wait(1).to({scaleX:1.0336,scaleY:1.0336,x:446.05},0).wait(1).to({scaleX:1.0361,scaleY:1.0361,x:446.1},0).wait(1).to({scaleX:1.0385,scaleY:1.0385,x:446.05,y:280.95},0).wait(1).to({scaleX:1.0407,scaleY:1.0407},0).wait(1).to({scaleX:1.0429,scaleY:1.0429},0).wait(1).to({scaleX:1.0448,scaleY:1.0448},0).wait(1).to({scaleX:1.0467,scaleY:1.0467,x:446.1},0).wait(1).to({scaleX:1.0484,scaleY:1.0484},0).wait(1).to({scaleX:1.05,scaleY:1.05},0).wait(1).to({scaleX:1.0514,scaleY:1.0514},0).wait(1).to({scaleX:1.0527,scaleY:1.0527,x:446.05},0).wait(1).to({scaleX:1.0539,scaleY:1.0539,x:446.1,y:281},0).wait(1).to({scaleX:1.0549,scaleY:1.0549},0).wait(1).to({scaleX:1.0558,scaleY:1.0558},0).wait(1).to({scaleX:1.0565,scaleY:1.0565,x:446.05},0).wait(1).to({scaleX:1.0571,scaleY:1.0571,x:446.1,y:280.95},0).wait(1).to({scaleX:1.0576,scaleY:1.0576,x:446.05},0).wait(1).to({scaleX:1.058,scaleY:1.058},0).wait(1).to({regX:446.3,regY:280.9,scaleX:1.0582,scaleY:1.0582,x:446.25,y:280.9},0).wait(2).to({regX:446.2,regY:281.1,scaleX:1.0645,scaleY:1.0645,x:446.15,y:281.1,alpha:0.9215},0).wait(1).to({scaleX:1.0705,scaleY:1.0705,x:446.2,y:281.15,alpha:0.8462},0).wait(1).to({scaleX:1.0763,scaleY:1.0763,x:446.15,y:281.1,alpha:0.774},0).wait(1).to({scaleX:1.0819,scaleY:1.0819,x:446.2,alpha:0.7051},0).wait(1).to({scaleX:1.0872,scaleY:1.0872,alpha:0.6394},0).wait(1).to({scaleX:1.0922,scaleY:1.0922,alpha:0.5769},0).wait(1).to({scaleX:1.097,scaleY:1.097,x:446.15,alpha:0.5176},0).wait(1).to({scaleX:1.1015,scaleY:1.1015,x:446.2,alpha:0.4615},0).wait(1).to({scaleX:1.1057,scaleY:1.1057,alpha:0.4087},0).wait(1).to({scaleX:1.1097,scaleY:1.1097,x:446.15,y:281.15,alpha:0.359},0).wait(1).to({scaleX:1.1135,scaleY:1.1135,x:446.2,alpha:0.3125},0).wait(1).to({scaleX:1.117,scaleY:1.117,y:281.1,alpha:0.2692},0).wait(1).to({scaleX:1.1202,scaleY:1.1202,x:446.15,y:281.15,alpha:0.2292},0).wait(1).to({scaleX:1.1231,scaleY:1.1231,y:281.1,alpha:0.1923},0).wait(1).to({scaleX:1.1258,scaleY:1.1258,alpha:0.1587},0).wait(1).to({scaleX:1.1283,scaleY:1.1283,alpha:0.1282},0).wait(1).to({scaleX:1.1305,scaleY:1.1305,y:281.15,alpha:0.101},0).wait(1).to({scaleX:1.1324,scaleY:1.1324,x:446.2,y:281.1,alpha:0.0769},0).wait(1).to({scaleX:1.1341,scaleY:1.1341,y:281.15,alpha:0.0561},0).wait(1).to({scaleX:1.1355,scaleY:1.1355,x:446.15,alpha:0.0385},0).wait(1).to({scaleX:1.1367,scaleY:1.1367,x:446.2,y:281.1,alpha:0.024},0).wait(1).to({scaleX:1.1376,scaleY:1.1376,alpha:0.0128},0).wait(1).to({scaleX:1.1382,scaleY:1.1382,x:446.15,y:281.15,alpha:0.0048},0).wait(1).to({regY:280.9,scaleX:1.1386,scaleY:1.1386,x:446.2,y:280.95,alpha:0},0).to({regX:446.3,scaleX:0.3713,scaleY:0.3713,y:280.9,alpha:1},1).wait(1).to({regX:446.2,regY:281.1,scaleX:0.383,scaleY:0.383,x:446.15,y:280.95},0).wait(1).to({scaleX:0.3946,scaleY:0.3946},0).wait(1).to({scaleX:0.4061,scaleY:0.4061,x:446.1},0).wait(1).to({scaleX:0.4175,scaleY:0.4175,x:446.15},0).wait(1).to({scaleX:0.4288,scaleY:0.4288,x:446.1},0).wait(1).to({scaleX:0.4399,scaleY:0.4399,x:446.15},0).wait(1).to({scaleX:0.4509,scaleY:0.4509,y:281},0).wait(1).to({scaleX:0.4619,scaleY:0.4619},0).wait(1).to({scaleX:0.4726,scaleY:0.4726},0).wait(1).to({scaleX:0.4833,scaleY:0.4833},0).wait(1).to({scaleX:0.4939,scaleY:0.4939,x:446.1,y:281.05},0).wait(1).to({scaleX:0.5043,scaleY:0.5043,y:281},0).wait(1).to({scaleX:0.5146,scaleY:0.5146},0).wait(1).to({scaleX:0.5248,scaleY:0.5248,x:446.15,y:281.05},0).wait(1).to({scaleX:0.5349,scaleY:0.5349,y:281},0).wait(1).to({scaleX:0.5449,scaleY:0.5449,x:446.1},0).wait(1).to({scaleX:0.5547,scaleY:0.5547,y:281.05},0).wait(1).to({scaleX:0.5645,scaleY:0.5645},0).wait(1).to({scaleX:0.5741,scaleY:0.5741,x:446.15},0).wait(1).to({scaleX:0.5836,scaleY:0.5836},0).wait(1).to({scaleX:0.5929,scaleY:0.5929,x:446.1},0).wait(1).to({scaleX:0.6022,scaleY:0.6022,x:446.15,y:281.1},0).wait(1).to({scaleX:0.6113,scaleY:0.6113,x:446.1},0).wait(1).to({scaleX:0.6204,scaleY:0.6204,x:446.15},0).wait(1).to({scaleX:0.6293,scaleY:0.6293,x:446.1},0).wait(1).to({scaleX:0.6381,scaleY:0.6381,x:446.15},0).wait(1).to({scaleX:0.6467,scaleY:0.6467,x:446.1},0).wait(1).to({scaleX:0.6553,scaleY:0.6553,x:446.15},0).wait(1).to({scaleX:0.6637,scaleY:0.6637},0).wait(1).to({scaleX:0.672,scaleY:0.672},0).wait(1).to({scaleX:0.6802,scaleY:0.6802,x:446.1},0).wait(1).to({scaleX:0.6883,scaleY:0.6883,y:281.15},0).wait(1).to({scaleX:0.6963,scaleY:0.6963,y:281.1},0).wait(1).to({scaleX:0.7041,scaleY:0.7041},0).wait(1).to({scaleX:0.7118,scaleY:0.7118,y:281.15},0).wait(1).to({scaleX:0.7194,scaleY:0.7194},0).wait(1).to({scaleX:0.7269,scaleY:0.7269,x:446.15},0).wait(1).to({scaleX:0.7343,scaleY:0.7343},0).wait(1).to({scaleX:0.7415,scaleY:0.7415,x:446.1},0).wait(1).to({scaleX:0.7487,scaleY:0.7487},0).wait(1).to({scaleX:0.7557,scaleY:0.7557,x:446.15},0).wait(1).to({scaleX:0.7626,scaleY:0.7626,x:446.1},0).wait(1).to({scaleX:0.7694,scaleY:0.7694,x:446.15},0).wait(1).to({scaleX:0.776,scaleY:0.776,x:446.1,y:281.2},0).wait(1).to({scaleX:0.7826,scaleY:0.7826,x:446.15},0).wait(1).to({scaleX:0.789,scaleY:0.789,x:446.1},0).wait(1).to({scaleX:0.7953,scaleY:0.7953,y:281.15},0).wait(1).to({scaleX:0.8015,scaleY:0.8015,x:446.15,y:281.2},0).wait(1).to({scaleX:0.8076,scaleY:0.8076,y:281.15},0).wait(1).to({scaleX:0.8135,scaleY:0.8135,y:281.2},0).wait(1).to({scaleX:0.8194,scaleY:0.8194,x:446.1,y:281.15},0).wait(1).to({scaleX:0.8251,scaleY:0.8251,y:281.2},0).wait(1).to({scaleX:0.8307,scaleY:0.8307},0).wait(1).to({scaleX:0.8362,scaleY:0.8362},0).wait(1).to({scaleX:0.8416,scaleY:0.8416,x:446.15},0).wait(1).to({scaleX:0.8468,scaleY:0.8468},0).wait(1).to({scaleX:0.8519,scaleY:0.8519,y:281.25},0).wait(1).to({scaleX:0.8569,scaleY:0.8569,x:446.1},0).wait(1).to({scaleX:0.8618,scaleY:0.8618,x:446.15,y:281.2},0).wait(1).to({scaleX:0.8666,scaleY:0.8666},0).wait(1).to({scaleX:0.8713,scaleY:0.8713,x:446.1},0).wait(1).to({scaleX:0.8758,scaleY:0.8758,x:446.15,y:281.25},0).wait(1).to({scaleX:0.8802,scaleY:0.8802,x:446.1},0).wait(1).to({scaleX:0.8845,scaleY:0.8845,x:446.15},0).wait(1).to({scaleX:0.8887,scaleY:0.8887,y:281.2},0).wait(1).to({scaleX:0.8928,scaleY:0.8928,x:446.1},0).wait(1).to({scaleX:0.8967,scaleY:0.8967,x:446.15},0).wait(1).to({scaleX:0.9006,scaleY:0.9006,y:281.25},0).wait(1).to({scaleX:0.9043,scaleY:0.9043},0).wait(1).to({scaleX:0.9079,scaleY:0.9079},0).wait(1).to({scaleX:0.9114,scaleY:0.9114},0).wait(1).to({scaleX:0.9147,scaleY:0.9147},0).wait(1).to({scaleX:0.918,scaleY:0.918},0).wait(1).to({scaleX:0.9211,scaleY:0.9211},0).wait(1).to({scaleX:0.9241,scaleY:0.9241},0).wait(1).to({scaleX:0.927,scaleY:0.927,x:446.1,y:281.3},0).wait(1).to({scaleX:0.9298,scaleY:0.9298,y:281.25},0).wait(1).to({scaleX:0.9324,scaleY:0.9324,x:446.15},0).wait(1).to({scaleX:0.935,scaleY:0.935},0).wait(1).to({scaleX:0.9374,scaleY:0.9374,x:446.1},0).wait(1).to({scaleX:0.9397,scaleY:0.9397,x:446.15},0).wait(1).to({scaleX:0.9419,scaleY:0.9419,x:446.1},0).wait(1).to({scaleX:0.9439,scaleY:0.9439,y:281.3},0).wait(1).to({scaleX:0.9459,scaleY:0.9459,x:446.15},0).wait(1).to({scaleX:0.9477,scaleY:0.9477,x:446.1,y:281.25},0).wait(1).to({scaleX:0.9494,scaleY:0.9494,y:281.3},0).wait(1).to({scaleX:0.951,scaleY:0.951,x:446.15,y:281.25},0).wait(1).to({scaleX:0.9525,scaleY:0.9525,y:281.3},0).wait(1).to({scaleX:0.9538,scaleY:0.9538,y:281.25},0).wait(1).to({scaleX:0.9551,scaleY:0.9551},0).wait(1).to({scaleX:0.9562,scaleY:0.9562,y:281.3},0).wait(1).to({scaleX:0.9572,scaleY:0.9572,y:281.25},0).wait(1).to({scaleX:0.9581,scaleY:0.9581},0).wait(1).to({scaleX:0.9588,scaleY:0.9588,y:281.3},0).wait(1).to({scaleX:0.9595,scaleY:0.9595,x:446.1,y:281.25},0).wait(1).to({scaleX:0.96,scaleY:0.96},0).wait(1).to({scaleX:0.9604,scaleY:0.9604,x:446.15,y:281.3},0).wait(1).to({scaleX:0.9607,scaleY:0.9607,x:446.1,y:281.25},0).wait(1).to({regX:446.4,regY:281.2,scaleX:0.9609,scaleY:0.9609,x:446.3,y:281.1},0).wait(2).to({regX:446.2,regY:281.1,scaleX:0.9729,scaleY:0.9729,x:446.05,y:281,alpha:0.9215},0).wait(1).to({scaleX:0.9845,scaleY:0.9845,alpha:0.8462},0).wait(1).to({scaleX:0.9955,scaleY:0.9955,alpha:0.774},0).wait(1).to({scaleX:1.0061,scaleY:1.0061,x:446.1,alpha:0.7051},0).wait(1).to({scaleX:1.0161,scaleY:1.0161,y:281.05,alpha:0.6394},0).wait(1).to({scaleX:1.0257,scaleY:1.0257,y:281,alpha:0.5769},0).wait(1).to({scaleX:1.0348,scaleY:1.0348,y:281.05,alpha:0.5176},0).wait(1).to({scaleX:1.0434,scaleY:1.0434,y:281,alpha:0.4615},0).wait(1).to({scaleX:1.0515,scaleY:1.0515,x:446.05,alpha:0.4087},0).wait(1).to({scaleX:1.0591,scaleY:1.0591,x:446.1,alpha:0.359},0).wait(1).to({scaleX:1.0662,scaleY:1.0662,alpha:0.3125},0).wait(1).to({scaleX:1.0728,scaleY:1.0728,y:280.95,alpha:0.2692},0).wait(1).to({scaleX:1.079,scaleY:1.079,y:281,alpha:0.2292},0).wait(1).to({scaleX:1.0846,scaleY:1.0846,x:446.05,alpha:0.1923},0).wait(1).to({scaleX:1.0898,scaleY:1.0898,alpha:0.1587},0).wait(1).to({scaleX:1.0944,scaleY:1.0944,x:446.1,alpha:0.1282},0).wait(1).to({scaleX:1.0986,scaleY:1.0986,y:280.95,alpha:0.101},0).wait(1).to({scaleX:1.1023,scaleY:1.1023,y:281,alpha:0.0769},0).wait(1).to({scaleX:1.1055,scaleY:1.1055,x:446.05,alpha:0.0561},0).wait(1).to({scaleX:1.1082,scaleY:1.1082,y:280.95,alpha:0.0385},0).wait(1).to({scaleX:1.1104,scaleY:1.1104,y:281,alpha:0.024},0).wait(1).to({scaleX:1.1121,scaleY:1.1121,y:280.95,alpha:0.0128},0).wait(1).to({scaleX:1.1133,scaleY:1.1133,alpha:0.0048},0).wait(1).to({regX:446.3,scaleX:1.1141,scaleY:1.1141,x:446.2,y:281.05,alpha:0},0).to({regX:446.4,scaleX:0.4556,scaleY:0.4556,x:446.15,y:281,alpha:1},1).wait(1).to({regX:446.2,scaleX:0.4669,scaleY:0.4669,x:446.05},0).wait(1).to({scaleX:0.4782,scaleY:0.4782,y:280.95},0).wait(1).to({scaleX:0.4893,scaleY:0.4893,x:446,y:281},0).wait(1).to({scaleX:0.5003,scaleY:0.5003,x:446.05},0).wait(1).to({scaleX:0.5112,scaleY:0.5112,x:446},0).wait(1).to({scaleX:0.522,scaleY:0.522},0).wait(1).to({scaleX:0.5327,scaleY:0.5327,x:446.05},0).wait(1).to({scaleX:0.5432,scaleY:0.5432,x:446},0).wait(1).to({scaleX:0.5537,scaleY:0.5537},0).wait(1).to({scaleX:0.564,scaleY:0.564},0).wait(1).to({scaleX:0.5742,scaleY:0.5742,y:280.95},0).wait(1).to({scaleX:0.5843,scaleY:0.5843},0).wait(1).to({scaleX:0.5943,scaleY:0.5943},0).wait(1).to({scaleX:0.6042,scaleY:0.6042,y:281},0).wait(1).to({scaleX:0.614,scaleY:0.614},0).wait(1).to({scaleX:0.6236,scaleY:0.6236,x:445.95},0).wait(1).to({scaleX:0.6331,scaleY:0.6331,y:280.95},0).wait(1).to({scaleX:0.6426,scaleY:0.6426},0).wait(1).to({scaleX:0.6519,scaleY:0.6519,y:281},0).wait(1).to({scaleX:0.6611,scaleY:0.6611,y:280.95},0).wait(1).to({scaleX:0.6701,scaleY:0.6701},0).wait(1).to({scaleX:0.6791,scaleY:0.6791,y:281},0).wait(1).to({scaleX:0.6879,scaleY:0.6879},0).wait(1).to({scaleX:0.6967,scaleY:0.6967},0).wait(1).to({scaleX:0.7053,scaleY:0.7053,y:280.95},0).wait(1).to({scaleX:0.7138,scaleY:0.7138,y:281},0).wait(1).to({scaleX:0.7222,scaleY:0.7222,y:280.95},0).wait(1).to({scaleX:0.7305,scaleY:0.7305,y:281},0).wait(1).to({scaleX:0.7386,scaleY:0.7386,x:445.9},0).wait(1).to({scaleX:0.7467,scaleY:0.7467},0).wait(1).to({scaleX:0.7546,scaleY:0.7546,y:280.95},0).wait(1).to({scaleX:0.7624,scaleY:0.7624},0).wait(1).to({scaleX:0.7701,scaleY:0.7701,x:445.95,y:281},0).wait(1).to({scaleX:0.7777,scaleY:0.7777,x:445.9,y:280.95},0).wait(1).to({scaleX:0.7852,scaleY:0.7852},0).wait(1).to({scaleX:0.7926,scaleY:0.7926,y:281},0).wait(1).to({scaleX:0.7998,scaleY:0.7998},0).wait(1).to({scaleX:0.8069,scaleY:0.8069},0).wait(1).to({scaleX:0.814,scaleY:0.814,y:280.95},0).wait(1).to({scaleX:0.8209,scaleY:0.8209,x:445.85,y:281},0).wait(1).to({scaleX:0.8277,scaleY:0.8277,x:445.9,y:280.95},0).wait(1).to({scaleX:0.8343,scaleY:0.8343,y:281},0).wait(1).to({scaleX:0.8409,scaleY:0.8409,x:445.85},0).wait(1).to({scaleX:0.8474,scaleY:0.8474,x:445.9},0).wait(1).to({scaleX:0.8537,scaleY:0.8537,x:445.85,y:280.95},0).wait(1).to({scaleX:0.8599,scaleY:0.8599,x:445.9},0).wait(1).to({scaleX:0.866,scaleY:0.866,x:445.85,y:281},0).wait(1).to({scaleX:0.872,scaleY:0.872,x:445.9,y:280.95},0).wait(1).to({scaleX:0.8779,scaleY:0.8779,x:445.85},0).wait(1).to({scaleX:0.8837,scaleY:0.8837,x:445.9},0).wait(1).to({scaleX:0.8893,scaleY:0.8893,x:445.85,y:281},0).wait(1).to({scaleX:0.8949,scaleY:0.8949,x:445.9},0).wait(1).to({scaleX:0.9003,scaleY:0.9003,x:445.85,y:280.95},0).wait(1).to({scaleX:0.9056,scaleY:0.9056},0).wait(1).to({scaleX:0.9108,scaleY:0.9108},0).wait(1).to({scaleX:0.9159,scaleY:0.9159},0).wait(1).to({scaleX:0.9208,scaleY:0.9208,y:281},0).wait(1).to({scaleX:0.9257,scaleY:0.9257,y:280.95},0).wait(1).to({scaleX:0.9304,scaleY:0.9304,y:281},0).wait(1).to({scaleX:0.935,scaleY:0.935},0).wait(1).to({scaleX:0.9395,scaleY:0.9395,x:445.8,y:280.95},0).wait(1).to({scaleX:0.9439,scaleY:0.9439,x:445.85,y:281},0).wait(1).to({scaleX:0.9482,scaleY:0.9482},0).wait(1).to({scaleX:0.9524,scaleY:0.9524,y:280.95},0).wait(1).to({scaleX:0.9564,scaleY:0.9564,x:445.8},0).wait(1).to({scaleX:0.9604,scaleY:0.9604},0).wait(1).to({scaleX:0.9642,scaleY:0.9642,x:445.85,y:281},0).wait(1).to({scaleX:0.9679,scaleY:0.9679},0).wait(1).to({scaleX:0.9715,scaleY:0.9715},0).wait(1).to({scaleX:0.975,scaleY:0.975,y:280.95},0).wait(1).to({scaleX:0.9784,scaleY:0.9784},0).wait(1).to({scaleX:0.9816,scaleY:0.9816,y:281},0).wait(1).to({scaleX:0.9848,scaleY:0.9848,y:280.95},0).wait(1).to({scaleX:0.9878,scaleY:0.9878},0).wait(1).to({scaleX:0.9907,scaleY:0.9907,y:281},0).wait(1).to({scaleX:0.9935,scaleY:0.9935,y:280.95},0).wait(1).to({scaleX:0.9962,scaleY:0.9962},0).wait(1).to({scaleX:0.9987,scaleY:0.9987},0).wait(1).to({scaleX:1.0012,scaleY:1.0012,x:445.9,y:281.05},0).wait(1).to({scaleX:1.0035,scaleY:1.0035,x:445.85},0).wait(1).to({scaleX:1.0058,scaleY:1.0058,y:281},0).wait(1).to({scaleX:1.0079,scaleY:1.0079},0).wait(1).to({scaleX:1.0099,scaleY:1.0099},0).wait(1).to({scaleX:1.0118,scaleY:1.0118},0).wait(1).to({scaleX:1.0135,scaleY:1.0135,x:445.9},0).wait(1).to({scaleX:1.0152,scaleY:1.0152,x:445.85},0).wait(1).to({scaleX:1.0167,scaleY:1.0167},0).wait(1).to({scaleX:1.0181,scaleY:1.0181},0).wait(1).to({scaleX:1.0195,scaleY:1.0195,x:445.9},0).wait(1).to({scaleX:1.0207,scaleY:1.0207,x:445.85},0).wait(1).to({scaleX:1.0217,scaleY:1.0217},0).wait(1).to({scaleX:1.0227,scaleY:1.0227,x:445.9,y:281.05},0).wait(1).to({scaleX:1.0236,scaleY:1.0236,x:445.85,y:281},0).wait(1).to({scaleX:1.0243,scaleY:1.0243,y:281.05},0).wait(1).to({scaleX:1.0249,scaleY:1.0249,x:445.9,y:281},0).wait(1).to({scaleX:1.0254,scaleY:1.0254,x:445.85},0).wait(1).to({scaleX:1.0258,scaleY:1.0258},0).wait(1).to({scaleX:1.0261,scaleY:1.0261},0).wait(1).to({regY:281,scaleX:1.0263,scaleY:1.0263,x:446,y:280.95},0).wait(2).to({regY:281.1,scaleX:1.0383,scaleY:1.0383,y:281.05,alpha:0.9224},0).wait(1).to({scaleX:1.0499,scaleY:1.0499,alpha:0.848},0).wait(1).to({scaleX:1.0609,scaleY:1.0609,alpha:0.7767},0).wait(1).to({scaleX:1.0714,scaleY:1.0714,x:446.05,y:281.1,alpha:0.7086},0).wait(1).to({scaleX:1.0815,scaleY:1.0815,x:446,y:281.05,alpha:0.6436},0).wait(1).to({scaleX:1.0911,scaleY:1.0911,x:446.05,alpha:0.5819},0).wait(1).to({scaleX:1.1001,scaleY:1.1001,alpha:0.5233},0).wait(1).to({scaleX:1.1087,scaleY:1.1087,x:446,alpha:0.4678},0).wait(1).to({scaleX:1.1168,scaleY:1.1168,x:446.05,alpha:0.4156},0).wait(1).to({scaleX:1.1244,scaleY:1.1244,x:446,y:281,alpha:0.3665},0).wait(1).to({scaleX:1.1315,scaleY:1.1315,x:446.05,alpha:0.3206},0).wait(1).to({scaleX:1.1382,scaleY:1.1382,y:281.05,alpha:0.2778},0).wait(1).to({scaleX:1.1443,scaleY:1.1443,alpha:0.2382},0).wait(1).to({scaleX:1.1499,scaleY:1.1499,alpha:0.2018},0).wait(1).to({scaleX:1.1551,scaleY:1.1551,alpha:0.1685},0).wait(1).to({scaleX:1.1598,scaleY:1.1598,alpha:0.1384},0).wait(1).to({scaleX:1.1639,scaleY:1.1639,alpha:0.1115},0).wait(1).to({scaleX:1.1676,scaleY:1.1676,alpha:0.0877},0).wait(1).to({scaleX:1.1708,scaleY:1.1708,alpha:0.0672},0).wait(1).to({scaleX:1.1735,scaleY:1.1735,y:281,alpha:0.0497},0).wait(1).to({scaleX:1.1757,scaleY:1.1757,y:281.05,alpha:0.0355},0).wait(1).to({scaleX:1.1774,scaleY:1.1774,y:281,alpha:0.0244},0).wait(1).to({scaleX:1.1786,scaleY:1.1786,alpha:0.0165},0).wait(1).to({regY:280.9,scaleX:1.1794,scaleY:1.1794,y:280.85,alpha:0.0117},0).to({regX:446.3,regY:281,scaleX:0.3409,scaleY:0.3409,x:446.1,y:280.9,alpha:1},1).wait(1).to({regX:446.2,regY:281.1,scaleX:0.3552,scaleY:0.3552,x:446},0).wait(1).to({scaleX:0.3693,scaleY:0.3693},0).wait(1).to({scaleX:0.3832,scaleY:0.3832,x:446.05},0).wait(1).to({scaleX:0.397,scaleY:0.397,x:446},0).wait(1).to({scaleX:0.4107,scaleY:0.4107},0).wait(1).to({scaleX:0.4242,scaleY:0.4242},0).wait(1).to({scaleX:0.4376,scaleY:0.4376},0).wait(1).to({scaleX:0.4508,scaleY:0.4508,x:445.95},0).wait(1).to({scaleX:0.4639,scaleY:0.4639},0).wait(1).to({scaleX:0.4769,scaleY:0.4769,x:446},0).wait(1).to({scaleX:0.4897,scaleY:0.4897,x:445.95},0).wait(1).to({scaleX:0.5024,scaleY:0.5024,y:280.85},0).wait(1).to({scaleX:0.5149,scaleY:0.5149,y:280.9},0).wait(1).to({scaleX:0.5273,scaleY:0.5273,y:280.85},0).wait(1).to({scaleX:0.5395,scaleY:0.5395},0).wait(1).to({scaleX:0.5516,scaleY:0.5516},0).wait(1).to({scaleX:0.5636,scaleY:0.5636,x:445.9},0).wait(1).to({scaleX:0.5754,scaleY:0.5754,x:445.95,y:280.9},0).wait(1).to({scaleX:0.5871,scaleY:0.5871,y:280.85},0).wait(1).to({scaleX:0.5986,scaleY:0.5986},0).wait(1).to({scaleX:0.61,scaleY:0.61,x:445.9},0).wait(1).to({scaleX:0.6212,scaleY:0.6212},0).wait(1).to({scaleX:0.6323,scaleY:0.6323,y:280.9},0).wait(1).to({scaleX:0.6432,scaleY:0.6432,y:280.85},0).wait(1).to({scaleX:0.654,scaleY:0.654},0).wait(1).to({scaleX:0.6647,scaleY:0.6647},0).wait(1).to({scaleX:0.6752,scaleY:0.6752},0).wait(1).to({scaleX:0.6856,scaleY:0.6856,x:445.85},0).wait(1).to({scaleX:0.6958,scaleY:0.6958,x:445.9},0).wait(1);
	this.timeline.addTween(_tweenStr_0.to({scaleX:0.7059,scaleY:0.7059},0).wait(1).to({scaleX:0.7159,scaleY:0.7159,y:280.9},0).wait(1).to({scaleX:0.7257,scaleY:0.7257,x:445.85,y:280.85},0).wait(1).to({scaleX:0.7354,scaleY:0.7354},0).wait(1).to({scaleX:0.7449,scaleY:0.7449},0).wait(1).to({scaleX:0.7543,scaleY:0.7543},0).wait(1).to({scaleX:0.7635,scaleY:0.7635},0).wait(1).to({scaleX:0.7726,scaleY:0.7726,x:445.8},0).wait(1).to({scaleX:0.7815,scaleY:0.7815},0).wait(1).to({scaleX:0.7903,scaleY:0.7903,x:445.85},0).wait(1).to({scaleX:0.799,scaleY:0.799,x:445.8},0).wait(1).to({scaleX:0.8075,scaleY:0.8075},0).wait(1).to({scaleX:0.8159,scaleY:0.8159},0).wait(1).to({scaleX:0.8241,scaleY:0.8241},0).wait(1).to({scaleX:0.8322,scaleY:0.8322},0).wait(1).to({scaleX:0.8401,scaleY:0.8401},0).wait(1).to({scaleX:0.8479,scaleY:0.8479},0).wait(1).to({scaleX:0.8556,scaleY:0.8556},0).wait(1).to({scaleX:0.8631,scaleY:0.8631,x:445.75,y:280.8},0).wait(1).to({scaleX:0.8705,scaleY:0.8705,x:445.8,y:280.85},0).wait(1).to({scaleX:0.8777,scaleY:0.8777},0).wait(1).to({scaleX:0.8848,scaleY:0.8848,y:280.8},0).wait(1).to({scaleX:0.8917,scaleY:0.8917},0).wait(1).to({scaleX:0.8985,scaleY:0.8985,y:280.85},0).wait(1).to({scaleX:0.9052,scaleY:0.9052},0).wait(1).to({scaleX:0.9117,scaleY:0.9117,x:445.75},0).wait(1).to({scaleX:0.9181,scaleY:0.9181,y:280.8},0).wait(1).to({scaleX:0.9243,scaleY:0.9243},0).wait(1).to({scaleX:0.9304,scaleY:0.9304,y:280.85},0).wait(1).to({scaleX:0.9363,scaleY:0.9363},0).wait(1).to({scaleX:0.9421,scaleY:0.9421,x:445.8},0).wait(1).to({scaleX:0.9478,scaleY:0.9478,x:445.75,y:280.8},0).wait(1).to({scaleX:0.9533,scaleY:0.9533},0).wait(1).to({scaleX:0.9587,scaleY:0.9587,y:280.85},0).wait(1).to({scaleX:0.9639,scaleY:0.9639},0).wait(1).to({scaleX:0.969,scaleY:0.969},0).wait(1).to({scaleX:0.9739,scaleY:0.9739,y:280.8},0).wait(1).to({scaleX:0.9787,scaleY:0.9787},0).wait(1).to({scaleX:0.9834,scaleY:0.9834,x:445.7},0).wait(1).to({scaleX:0.9879,scaleY:0.9879,x:445.75,y:280.85},0).wait(1).to({scaleX:0.9922,scaleY:0.9922,y:280.8},0).wait(1).to({scaleX:0.9965,scaleY:0.9965,x:445.7},0).wait(1).to({scaleX:1.0005,scaleY:1.0005,x:445.8,y:280.9},0).wait(1).to({scaleX:1.0045,scaleY:1.0045,y:280.85},0).wait(1).to({scaleX:1.0083,scaleY:1.0083},0).wait(1).to({scaleX:1.0119,scaleY:1.0119,x:445.75,y:280.9},0).wait(1).to({scaleX:1.0154,scaleY:1.0154,x:445.8},0).wait(1).to({scaleX:1.0188,scaleY:1.0188},0).wait(1).to({scaleX:1.022,scaleY:1.022,x:445.75},0).wait(1).to({scaleX:1.0251,scaleY:1.0251,x:445.8,y:280.85},0).wait(1).to({scaleX:1.028,scaleY:1.028,x:445.75,y:280.9},0).wait(1).to({scaleX:1.0308,scaleY:1.0308,y:280.85},0).wait(1).to({scaleX:1.0335,scaleY:1.0335},0).wait(1).to({scaleX:1.036,scaleY:1.036},0).wait(1).to({scaleX:1.0383,scaleY:1.0383},0).wait(1).to({scaleX:1.0405,scaleY:1.0405,y:280.9},0).wait(1).to({scaleX:1.0426,scaleY:1.0426},0).wait(1).to({scaleX:1.0446,scaleY:1.0446,y:280.85},0).wait(1).to({scaleX:1.0463,scaleY:1.0463,x:445.8,y:280.9},0).wait(1).to({scaleX:1.048,scaleY:1.048,x:445.75},0).wait(1).to({scaleX:1.0495,scaleY:1.0495,x:445.8,y:280.85},0).wait(1).to({scaleX:1.0509,scaleY:1.0509,x:445.75,y:280.9},0).wait(1).to({scaleX:1.0521,scaleY:1.0521},0).wait(1).to({scaleX:1.0531,scaleY:1.0531},0).wait(1).to({scaleX:1.0541,scaleY:1.0541,y:280.85},0).wait(1).to({scaleX:1.0549,scaleY:1.0549,x:445.8},0).wait(1).to({scaleX:1.0555,scaleY:1.0555,x:445.75},0).wait(1).to({scaleX:1.056,scaleY:1.056,y:280.9},0).wait(1).to({scaleX:1.0564,scaleY:1.0564},0).wait(1).to({regX:446.1,regY:280.9,scaleX:1.0566,scaleY:1.0566,x:445.9,y:280.8},0).wait(2).to({regX:446.2,regY:281.1,scaleX:1.0686,scaleY:1.0686,x:446,y:281.05,alpha:0.9215},0).wait(1).to({scaleX:1.0801,scaleY:1.0801,y:281,alpha:0.8462},0).wait(1).to({scaleX:1.0912,scaleY:1.0912,x:446.05,y:281.05,alpha:0.774},0).wait(1).to({scaleX:1.1017,scaleY:1.1017,x:446,alpha:0.7051},0).wait(1).to({scaleX:1.1118,scaleY:1.1118,x:446.05,y:281,alpha:0.6394},0).wait(1).to({scaleX:1.1214,scaleY:1.1214,x:446,alpha:0.5769},0).wait(1).to({scaleX:1.1304,scaleY:1.1304,alpha:0.5176},0).wait(1).to({scaleX:1.139,scaleY:1.139,y:281.05,alpha:0.4615},0).wait(1).to({scaleX:1.1471,scaleY:1.1471,y:281,alpha:0.4087},0).wait(1).to({scaleX:1.1547,scaleY:1.1547,alpha:0.359},0).wait(1).to({scaleX:1.1619,scaleY:1.1619,alpha:0.3125},0).wait(1).to({scaleX:1.1685,scaleY:1.1685,alpha:0.2692},0).wait(1).to({scaleX:1.1746,scaleY:1.1746,y:281.05,alpha:0.2292},0).wait(1).to({scaleX:1.1803,scaleY:1.1803,y:281,alpha:0.1923},0).wait(1).to({scaleX:1.1854,scaleY:1.1854,alpha:0.1587},0).wait(1).to({scaleX:1.1901,scaleY:1.1901,y:281.05,alpha:0.1282},0).wait(1).to({scaleX:1.1943,scaleY:1.1943,x:445.95,y:281,alpha:0.101},0).wait(1).to({scaleX:1.1979,scaleY:1.1979,y:281.05,alpha:0.0769},0).wait(1).to({scaleX:1.2011,scaleY:1.2011,x:446,alpha:0.0561},0).wait(1).to({scaleX:1.2038,scaleY:1.2038,y:281,alpha:0.0385},0).wait(1).to({scaleX:1.206,scaleY:1.206,alpha:0.024},0).wait(1).to({scaleX:1.2078,scaleY:1.2078,alpha:0.0128},0).wait(1).to({scaleX:1.209,scaleY:1.209,alpha:0.0048},0).wait(1).to({regX:446,regY:280.8,scaleX:1.2097,scaleY:1.2097,x:445.8,y:280.7,alpha:0},0).to({regY:280.9,scaleX:0.3948,scaleY:0.3948,x:445.75},1).wait(1).to({regX:446.2,regY:281.1,scaleX:0.4077,scaleY:0.4077,x:445.8,y:280.75,alpha:0.0199},0).wait(1).to({scaleX:0.4205,scaleY:0.4205,y:280.8,alpha:0.0396},0).wait(1).to({scaleX:0.4331,scaleY:0.4331,alpha:0.0591},0).wait(1).to({scaleX:0.4455,scaleY:0.4455,alpha:0.0784},0).wait(1).to({scaleX:0.4579,scaleY:0.4579,y:280.75,alpha:0.0975},0).wait(1).to({scaleX:0.4701,scaleY:0.4701,alpha:0.1164},0).wait(1).to({scaleX:0.4822,scaleY:0.4822,alpha:0.1351},0).wait(1).to({scaleX:0.4942,scaleY:0.4942,alpha:0.1536},0).wait(1).to({scaleX:0.506,scaleY:0.506,y:280.8,alpha:0.1719},0).wait(1).to({scaleX:0.5177,scaleY:0.5177,alpha:0.19},0).wait(1).to({scaleX:0.5293,scaleY:0.5293,x:445.85,alpha:0.2079},0).wait(1).to({scaleX:0.5408,scaleY:0.5408,x:445.8,alpha:0.2256},0).wait(1).to({scaleX:0.5521,scaleY:0.5521,alpha:0.2431},0).wait(1).to({scaleX:0.5633,scaleY:0.5633,x:445.85,alpha:0.2604},0).wait(1).to({scaleX:0.5743,scaleY:0.5743,x:445.8,alpha:0.2775},0).wait(1).to({scaleX:0.5853,scaleY:0.5853,alpha:0.2944},0).wait(1).to({scaleX:0.5961,scaleY:0.5961,alpha:0.3111},0).wait(1).to({scaleX:0.6067,scaleY:0.6067,x:445.85,alpha:0.3276},0).wait(1).to({scaleX:0.6173,scaleY:0.6173,alpha:0.3439},0).wait(1).to({scaleX:0.6277,scaleY:0.6277,alpha:0.36},0).wait(1).to({scaleX:0.638,scaleY:0.638,x:445.8,alpha:0.3759},0).wait(1).to({scaleX:0.6481,scaleY:0.6481,alpha:0.3916},0).wait(1).to({scaleX:0.6582,scaleY:0.6582,alpha:0.4071},0).wait(1).to({scaleX:0.6681,scaleY:0.6681,x:445.85,alpha:0.4224},0).wait(1).to({scaleX:0.6778,scaleY:0.6778,x:445.8,alpha:0.4375},0).wait(1).to({scaleX:0.6875,scaleY:0.6875,alpha:0.4524},0).wait(1).to({scaleX:0.697,scaleY:0.697,x:445.85,alpha:0.4671},0).wait(1).to({scaleX:0.7064,scaleY:0.7064,alpha:0.4816},0).wait(1).to({scaleX:0.7156,scaleY:0.7156,x:445.8,alpha:0.4959},0).wait(1).to({scaleX:0.7247,scaleY:0.7247,x:445.85,alpha:0.5101},0).wait(1).to({scaleX:0.7337,scaleY:0.7337,alpha:0.524},0).wait(1).to({scaleX:0.7426,scaleY:0.7426,y:280.85,alpha:0.5377},0).wait(1).to({scaleX:0.7513,scaleY:0.7513,alpha:0.5512},0).wait(1).to({scaleX:0.7599,scaleY:0.7599,y:280.8,alpha:0.5645},0).wait(1).to({scaleX:0.7684,scaleY:0.7684,x:445.8,y:280.85,alpha:0.5776},0).wait(1).to({scaleX:0.7767,scaleY:0.7767,x:445.85,alpha:0.5905},0).wait(1).to({scaleX:0.785,scaleY:0.785,alpha:0.6032},0).wait(1).to({scaleX:0.793,scaleY:0.793,x:445.8,y:280.8,alpha:0.6157},0).wait(1).to({scaleX:0.801,scaleY:0.801,alpha:0.628},0).wait(1).to({scaleX:0.8088,scaleY:0.8088,x:445.85,alpha:0.6401},0).wait(1).to({scaleX:0.8165,scaleY:0.8165,alpha:0.652},0).wait(1).to({scaleX:0.8241,scaleY:0.8241,x:445.8,y:280.85,alpha:0.6637},0).wait(1).to({scaleX:0.8315,scaleY:0.8315,x:445.85,alpha:0.6752},0).wait(1).to({scaleX:0.8388,scaleY:0.8388,alpha:0.6865},0).wait(1).to({scaleX:0.846,scaleY:0.846,alpha:0.6976},0).wait(1).to({scaleX:0.8531,scaleY:0.8531,alpha:0.7085},0).wait(1).to({scaleX:0.86,scaleY:0.86,alpha:0.7192},0).wait(1).to({scaleX:0.8668,scaleY:0.8668,x:445.8,alpha:0.7297},0).wait(1).to({scaleX:0.8734,scaleY:0.8734,x:445.85,y:280.8,alpha:0.74},0).wait(1).to({scaleX:0.88,scaleY:0.88,y:280.85,alpha:0.7501},0).wait(1).to({scaleX:0.8864,scaleY:0.8864,alpha:0.76},0).wait(1).to({scaleX:0.8927,scaleY:0.8927,alpha:0.7697},0).wait(1).to({scaleX:0.8988,scaleY:0.8988,alpha:0.7792},0).wait(1).to({scaleX:0.9048,scaleY:0.9048,alpha:0.7885},0).wait(1).to({scaleX:0.9107,scaleY:0.9107,alpha:0.7976},0).wait(1).to({scaleX:0.9165,scaleY:0.9165,x:445.8,alpha:0.8065},0).wait(1).to({scaleX:0.9221,scaleY:0.9221,x:445.85,alpha:0.8152},0).wait(1).to({scaleX:0.9276,scaleY:0.9276,alpha:0.8237},0).wait(1).to({scaleX:0.933,scaleY:0.933,alpha:0.832},0).wait(1).to({scaleX:0.9382,scaleY:0.9382,x:445.8,alpha:0.8401},0).wait(1).to({scaleX:0.9433,scaleY:0.9433,x:445.85,alpha:0.848},0).wait(1).to({scaleX:0.9483,scaleY:0.9483,x:445.8,alpha:0.8557},0).wait(1).to({scaleX:0.9531,scaleY:0.9531,x:445.85,alpha:0.8632},0).wait(1).to({scaleX:0.9579,scaleY:0.9579,alpha:0.8705},0).wait(1).to({scaleX:0.9625,scaleY:0.9625,alpha:0.8776},0).wait(1).to({scaleX:0.9669,scaleY:0.9669,alpha:0.8845},0).wait(1).to({scaleX:0.9712,scaleY:0.9712,x:445.8,alpha:0.8912},0).wait(1).to({scaleX:0.9755,scaleY:0.9755,x:445.85,alpha:0.8977},0).wait(1).to({scaleX:0.9795,scaleY:0.9795,x:445.8,alpha:0.904},0).wait(1).to({scaleX:0.9835,scaleY:0.9835,alpha:0.9101},0).wait(1).to({scaleX:0.9873,scaleY:0.9873,x:445.85,y:280.9,alpha:0.916},0).wait(1).to({scaleX:0.991,scaleY:0.991,x:445.8,y:280.85,alpha:0.9217},0).wait(1).to({scaleX:0.9945,scaleY:0.9945,x:445.85,alpha:0.9272},0).wait(1).to({scaleX:0.998,scaleY:0.998,y:280.9,alpha:0.9325},0).wait(1).to({scaleX:1.0013,scaleY:1.0013,x:445.9,alpha:0.9376},0).wait(1).to({scaleX:1.0044,scaleY:1.0044,x:445.85,alpha:0.9425},0).wait(1).to({scaleX:1.0075,scaleY:1.0075,x:445.9,alpha:0.9472},0).wait(1).to({scaleX:1.0104,scaleY:1.0104,alpha:0.9517},0).wait(1).to({scaleX:1.0132,scaleY:1.0132,x:445.85,alpha:0.956},0).wait(1).to({scaleX:1.0158,scaleY:1.0158,x:445.9,alpha:0.9601},0).wait(1).to({scaleX:1.0183,scaleY:1.0183,alpha:0.964},0).wait(1).to({scaleX:1.0207,scaleY:1.0207,alpha:0.9677},0).wait(1).to({scaleX:1.023,scaleY:1.023,alpha:0.9712},0).wait(1).to({scaleX:1.0251,scaleY:1.0251,alpha:0.9745},0).wait(1).to({scaleX:1.0271,scaleY:1.0271,y:280.95,alpha:0.9776},0).wait(1).to({scaleX:1.029,scaleY:1.029,y:280.9,alpha:0.9805},0).wait(1).to({scaleX:1.0308,scaleY:1.0308,x:445.85,y:280.95,alpha:0.9832},0).wait(1).to({scaleX:1.0324,scaleY:1.0324,x:445.9,y:280.9,alpha:0.9857},0).wait(1).to({scaleX:1.0339,scaleY:1.0339,alpha:0.988},0).wait(1).to({scaleX:1.0352,scaleY:1.0352,alpha:0.9901},0).wait(1).to({scaleX:1.0365,scaleY:1.0365,y:280.95,alpha:0.992},0).wait(1).to({scaleX:1.0376,scaleY:1.0376,y:280.9,alpha:0.9937},0).wait(1).to({scaleX:1.0385,scaleY:1.0385,y:280.95,alpha:0.9952},0).wait(1).to({scaleX:1.0394,scaleY:1.0394,y:280.9,alpha:0.9965},0).wait(1).to({scaleX:1.0401,scaleY:1.0401,alpha:0.9976},0).wait(1).to({scaleX:1.0407,scaleY:1.0407,y:280.95,alpha:0.9985},0).wait(1).to({scaleX:1.0411,scaleY:1.0411,y:280.9,alpha:0.9992},0).wait(1).to({scaleX:1.0414,scaleY:1.0414,y:280.95,alpha:0.9997},0).wait(1).to({regX:445.9,regY:280.8,scaleX:1.0416,scaleY:1.0416,x:445.65,y:280.65,alpha:1},0).wait(2).to({regX:446.2,regY:281.1,scaleX:1.0569,scaleY:1.0569,x:446,y:280.95},0).wait(1).to({scaleX:1.0716,scaleY:1.0716,y:281},0).wait(1).to({scaleX:1.0857,scaleY:1.0857},0).wait(1).to({scaleX:1.0991,scaleY:1.0991},0).wait(1).to({scaleX:1.1119,scaleY:1.1119},0).wait(1).to({scaleX:1.1241,scaleY:1.1241},0).wait(1).to({scaleX:1.1357,scaleY:1.1357},0).wait(1).to({scaleX:1.1466,scaleY:1.1466,x:445.95},0).wait(1).to({scaleX:1.1569,scaleY:1.1569,x:446},0).wait(1).to({scaleX:1.1666,scaleY:1.1666},0).wait(1).to({scaleX:1.1757,scaleY:1.1757,y:281.05},0).wait(1).to({scaleX:1.1841,scaleY:1.1841,y:281},0).wait(1).to({scaleX:1.1919,scaleY:1.1919},0).wait(1).to({scaleX:1.1991,scaleY:1.1991},0).wait(1).to({scaleX:1.2057,scaleY:1.2057},0).wait(1).to({scaleX:1.2116,scaleY:1.2116,y:281.05},0).wait(1).to({scaleX:1.2169,scaleY:1.2169},0).wait(1).to({scaleX:1.2216,scaleY:1.2216},0).wait(1).to({scaleX:1.2257,scaleY:1.2257},0).wait(1).to({scaleX:1.2291,scaleY:1.2291,y:281},0).wait(1).to({scaleX:1.2319,scaleY:1.2319,y:281.05},0).wait(1).to({scaleX:1.2341,scaleY:1.2341,x:445.95,y:281},0).wait(1).to({scaleX:1.2357,scaleY:1.2357,y:281.05},0).wait(1).to({regX:445.8,regY:280.8,scaleX:1.2366,scaleY:1.2366,x:445.6,y:280.7},0).wait(1));

	// Layer_1_copy
	this.twinkle1_1 = new lib.stars();
	this.twinkle1_1.name = "twinkle1_1";
	this.twinkle1_1.setTransform(446.35,281.05,0.3878,0.3878,0,0,0,446.4,281.1);
	this.twinkle1_1._off = true;

	
	var _tweenStr_1 = cjs.Tween.get(this.twinkle1_1).wait(49).to({_off:false},0).wait(1).to({regX:446.2,scaleX:0.4013,scaleY:0.4013,x:446.25},0).wait(1).to({scaleX:0.4146,scaleY:0.4146},0).wait(1).to({scaleX:0.4278,scaleY:0.4278,y:281},0).wait(1).to({scaleX:0.4409,scaleY:0.4409,x:446.2,y:281.05},0).wait(1).to({scaleX:0.4538,scaleY:0.4538,x:446.25,y:281},0).wait(1).to({scaleX:0.4666,scaleY:0.4666},0).wait(1).to({scaleX:0.4793,scaleY:0.4793},0).wait(1).to({scaleX:0.4918,scaleY:0.4918,x:446.2,y:281.05},0).wait(1).to({scaleX:0.5042,scaleY:0.5042,y:281},0).wait(1).to({scaleX:0.5164,scaleY:0.5164},0).wait(1).to({scaleX:0.5285,scaleY:0.5285},0).wait(1).to({scaleX:0.5405,scaleY:0.5405,y:281.05},0).wait(1).to({scaleX:0.5523,scaleY:0.5523,y:281},0).wait(1).to({scaleX:0.564,scaleY:0.564},0).wait(1).to({scaleX:0.5756,scaleY:0.5756,x:446.15},0).wait(1).to({scaleX:0.587,scaleY:0.587},0).wait(1).to({scaleX:0.5983,scaleY:0.5983},0).wait(1).to({scaleX:0.6094,scaleY:0.6094,x:446.2},0).wait(1).to({scaleX:0.6205,scaleY:0.6205},0).wait(1).to({scaleX:0.6313,scaleY:0.6313,x:446.15,y:280.95},0).wait(1).to({scaleX:0.6421,scaleY:0.6421,y:281},0).wait(1).to({scaleX:0.6527,scaleY:0.6527,y:280.95},0).wait(1).to({scaleX:0.6631,scaleY:0.6631},0).wait(1).to({scaleX:0.6735,scaleY:0.6735},0).wait(1).to({scaleX:0.6837,scaleY:0.6837,y:281},0).wait(1).to({scaleX:0.6937,scaleY:0.6937,y:280.95},0).wait(1).to({scaleX:0.7036,scaleY:0.7036,y:281},0).wait(1).to({scaleX:0.7134,scaleY:0.7134},0).wait(1).to({scaleX:0.7231,scaleY:0.7231,y:280.95},0).wait(1).to({scaleX:0.7326,scaleY:0.7326,x:446.1,y:281},0).wait(1).to({scaleX:0.742,scaleY:0.742,y:280.95},0).wait(1).to({scaleX:0.7512,scaleY:0.7512},0).wait(1).to({scaleX:0.7603,scaleY:0.7603,x:446.15},0).wait(1).to({scaleX:0.7692,scaleY:0.7692,y:281},0).wait(1).to({scaleX:0.7781,scaleY:0.7781,x:446.1,y:280.95},0).wait(1).to({scaleX:0.7868,scaleY:0.7868},0).wait(1).to({scaleX:0.7953,scaleY:0.7953},0).wait(1).to({scaleX:0.8037,scaleY:0.8037,y:281},0).wait(1).to({scaleX:0.812,scaleY:0.812,y:280.95},0).wait(1).to({scaleX:0.8201,scaleY:0.8201},0).wait(1).to({scaleX:0.8281,scaleY:0.8281},0).wait(1).to({scaleX:0.836,scaleY:0.836},0).wait(1).to({scaleX:0.8437,scaleY:0.8437,x:446.05},0).wait(1).to({scaleX:0.8513,scaleY:0.8513,x:446.1},0).wait(1).to({scaleX:0.8588,scaleY:0.8588},0).wait(1).to({scaleX:0.8661,scaleY:0.8661},0).wait(1).to({scaleX:0.8733,scaleY:0.8733,x:446.05},0).wait(1).to({scaleX:0.8803,scaleY:0.8803,x:446.1},0).wait(1).to({scaleX:0.8873,scaleY:0.8873},0).wait(1).to({scaleX:0.894,scaleY:0.894,x:446.05},0).wait(1).to({scaleX:0.9007,scaleY:0.9007,y:280.9},0).wait(1).to({scaleX:0.9072,scaleY:0.9072,y:280.95},0).wait(1).to({scaleX:0.9135,scaleY:0.9135},0).wait(1).to({scaleX:0.9197,scaleY:0.9197,x:446.1},0).wait(1).to({scaleX:0.9258,scaleY:0.9258,x:446.05},0).wait(1).to({scaleX:0.9318,scaleY:0.9318,y:280.9},0).wait(1).to({scaleX:0.9376,scaleY:0.9376,y:280.95},0).wait(1).to({scaleX:0.9433,scaleY:0.9433},0).wait(1).to({scaleX:0.9488,scaleY:0.9488,y:280.9},0).wait(1).to({scaleX:0.9542,scaleY:0.9542,y:280.95},0).wait(1).to({scaleX:0.9595,scaleY:0.9595,y:280.9},0).wait(1).to({scaleX:0.9646,scaleY:0.9646,y:280.95},0).wait(1).to({scaleX:0.9696,scaleY:0.9696,y:280.9},0).wait(1).to({scaleX:0.9745,scaleY:0.9745},0).wait(1).to({scaleX:0.9792,scaleY:0.9792,y:280.95},0).wait(1).to({scaleX:0.9838,scaleY:0.9838},0).wait(1).to({scaleX:0.9882,scaleY:0.9882},0).wait(1).to({scaleX:0.9925,scaleY:0.9925},0).wait(1).to({scaleX:0.9967,scaleY:0.9967,x:446,y:280.9},0).wait(1).to({scaleX:1.0007,scaleY:1.0007,x:446.1,y:280.95},0).wait(1).to({scaleX:1.0046,scaleY:1.0046},0).wait(1).to({scaleX:1.0084,scaleY:1.0084},0).wait(1).to({scaleX:1.012,scaleY:1.012,y:281},0).wait(1).to({scaleX:1.0155,scaleY:1.0155,x:446.05,y:280.95},0).wait(1).to({scaleX:1.0189,scaleY:1.0189},0).wait(1).to({scaleX:1.0221,scaleY:1.0221,x:446.1},0).wait(1).to({scaleX:1.0251,scaleY:1.0251,x:446.05},0).wait(1).to({scaleX:1.0281,scaleY:1.0281,x:446.1,y:281},0).wait(1).to({scaleX:1.0309,scaleY:1.0309},0).wait(1).to({scaleX:1.0336,scaleY:1.0336,x:446.05},0).wait(1).to({scaleX:1.0361,scaleY:1.0361,x:446.1},0).wait(1).to({scaleX:1.0385,scaleY:1.0385,x:446.05,y:280.95},0).wait(1).to({scaleX:1.0407,scaleY:1.0407},0).wait(1).to({scaleX:1.0429,scaleY:1.0429},0).wait(1).to({scaleX:1.0448,scaleY:1.0448},0).wait(1).to({scaleX:1.0467,scaleY:1.0467,x:446.1},0).wait(1).to({scaleX:1.0484,scaleY:1.0484},0).wait(1).to({scaleX:1.05,scaleY:1.05},0).wait(1).to({scaleX:1.0514,scaleY:1.0514},0).wait(1).to({scaleX:1.0527,scaleY:1.0527,x:446.05},0).wait(1).to({scaleX:1.0539,scaleY:1.0539,x:446.1,y:281},0).wait(1).to({scaleX:1.0549,scaleY:1.0549},0).wait(1).to({scaleX:1.0558,scaleY:1.0558},0).wait(1).to({scaleX:1.0565,scaleY:1.0565,x:446.05},0).wait(1).to({scaleX:1.0571,scaleY:1.0571,x:446.1,y:280.95},0).wait(1).to({scaleX:1.0576,scaleY:1.0576,x:446.05},0).wait(1).to({scaleX:1.058,scaleY:1.058},0).wait(1).to({regX:446.3,regY:280.9,scaleX:1.0582,scaleY:1.0582,x:446.25,y:280.9},0).wait(2).to({regX:446.2,regY:281.1,scaleX:1.0645,scaleY:1.0645,x:446.15,y:281.1,alpha:0.9215},0).wait(1).to({scaleX:1.0705,scaleY:1.0705,x:446.2,y:281.15,alpha:0.8462},0).wait(1).to({scaleX:1.0763,scaleY:1.0763,x:446.15,y:281.1,alpha:0.774},0).wait(1).to({scaleX:1.0819,scaleY:1.0819,x:446.2,alpha:0.7051},0).wait(1).to({scaleX:1.0872,scaleY:1.0872,alpha:0.6394},0).wait(1).to({scaleX:1.0922,scaleY:1.0922,alpha:0.5769},0).wait(1).to({scaleX:1.097,scaleY:1.097,x:446.15,alpha:0.5176},0).wait(1).to({scaleX:1.1015,scaleY:1.1015,x:446.2,alpha:0.4615},0).wait(1).to({scaleX:1.1057,scaleY:1.1057,alpha:0.4087},0).wait(1).to({scaleX:1.1097,scaleY:1.1097,x:446.15,y:281.15,alpha:0.359},0).wait(1).to({scaleX:1.1135,scaleY:1.1135,x:446.2,alpha:0.3125},0).wait(1).to({scaleX:1.117,scaleY:1.117,y:281.1,alpha:0.2692},0).wait(1).to({scaleX:1.1202,scaleY:1.1202,x:446.15,y:281.15,alpha:0.2292},0).wait(1).to({scaleX:1.1231,scaleY:1.1231,y:281.1,alpha:0.1923},0).wait(1).to({scaleX:1.1258,scaleY:1.1258,alpha:0.1587},0).wait(1).to({scaleX:1.1283,scaleY:1.1283,alpha:0.1282},0).wait(1).to({scaleX:1.1305,scaleY:1.1305,y:281.15,alpha:0.101},0).wait(1).to({scaleX:1.1324,scaleY:1.1324,x:446.2,y:281.1,alpha:0.0769},0).wait(1).to({scaleX:1.1341,scaleY:1.1341,y:281.15,alpha:0.0561},0).wait(1).to({scaleX:1.1355,scaleY:1.1355,x:446.15,alpha:0.0385},0).wait(1).to({scaleX:1.1367,scaleY:1.1367,x:446.2,y:281.1,alpha:0.024},0).wait(1).to({scaleX:1.1376,scaleY:1.1376,alpha:0.0128},0).wait(1).to({scaleX:1.1382,scaleY:1.1382,x:446.15,y:281.15,alpha:0.0048},0).wait(1).to({regY:280.9,scaleX:1.1386,scaleY:1.1386,x:446.2,y:280.95,alpha:0},0).to({regX:446.3,scaleX:0.3713,scaleY:0.3713,y:280.9,alpha:1},1).wait(1).to({regX:446.2,regY:281.1,scaleX:0.383,scaleY:0.383,x:446.15,y:280.95},0).wait(1).to({scaleX:0.3946,scaleY:0.3946},0).wait(1).to({scaleX:0.4061,scaleY:0.4061,x:446.1},0).wait(1).to({scaleX:0.4175,scaleY:0.4175,x:446.15},0).wait(1).to({scaleX:0.4288,scaleY:0.4288,x:446.1},0).wait(1).to({scaleX:0.4399,scaleY:0.4399,x:446.15},0).wait(1).to({scaleX:0.4509,scaleY:0.4509,y:281},0).wait(1).to({scaleX:0.4619,scaleY:0.4619},0).wait(1).to({scaleX:0.4726,scaleY:0.4726},0).wait(1).to({scaleX:0.4833,scaleY:0.4833},0).wait(1).to({scaleX:0.4939,scaleY:0.4939,x:446.1,y:281.05},0).wait(1).to({scaleX:0.5043,scaleY:0.5043,y:281},0).wait(1).to({scaleX:0.5146,scaleY:0.5146},0).wait(1).to({scaleX:0.5248,scaleY:0.5248,x:446.15,y:281.05},0).wait(1).to({scaleX:0.5349,scaleY:0.5349,y:281},0).wait(1).to({scaleX:0.5449,scaleY:0.5449,x:446.1},0).wait(1).to({scaleX:0.5547,scaleY:0.5547,y:281.05},0).wait(1).to({scaleX:0.5645,scaleY:0.5645},0).wait(1).to({scaleX:0.5741,scaleY:0.5741,x:446.15},0).wait(1).to({scaleX:0.5836,scaleY:0.5836},0).wait(1).to({scaleX:0.5929,scaleY:0.5929,x:446.1},0).wait(1).to({scaleX:0.6022,scaleY:0.6022,x:446.15,y:281.1},0).wait(1).to({scaleX:0.6113,scaleY:0.6113,x:446.1},0).wait(1).to({scaleX:0.6204,scaleY:0.6204,x:446.15},0).wait(1).to({scaleX:0.6293,scaleY:0.6293,x:446.1},0).wait(1).to({scaleX:0.6381,scaleY:0.6381,x:446.15},0).wait(1).to({scaleX:0.6467,scaleY:0.6467,x:446.1},0).wait(1).to({scaleX:0.6553,scaleY:0.6553,x:446.15},0).wait(1).to({scaleX:0.6637,scaleY:0.6637},0).wait(1).to({scaleX:0.672,scaleY:0.672},0).wait(1).to({scaleX:0.6802,scaleY:0.6802,x:446.1},0).wait(1).to({scaleX:0.6883,scaleY:0.6883,y:281.15},0).wait(1).to({scaleX:0.6963,scaleY:0.6963,y:281.1},0).wait(1).to({scaleX:0.7041,scaleY:0.7041},0).wait(1).to({scaleX:0.7118,scaleY:0.7118,y:281.15},0).wait(1).to({scaleX:0.7194,scaleY:0.7194},0).wait(1).to({scaleX:0.7269,scaleY:0.7269,x:446.15},0).wait(1).to({scaleX:0.7343,scaleY:0.7343},0).wait(1).to({scaleX:0.7415,scaleY:0.7415,x:446.1},0).wait(1).to({scaleX:0.7487,scaleY:0.7487},0).wait(1).to({scaleX:0.7557,scaleY:0.7557,x:446.15},0).wait(1).to({scaleX:0.7626,scaleY:0.7626,x:446.1},0).wait(1).to({scaleX:0.7694,scaleY:0.7694,x:446.15},0).wait(1).to({scaleX:0.776,scaleY:0.776,x:446.1,y:281.2},0).wait(1).to({scaleX:0.7826,scaleY:0.7826,x:446.15},0).wait(1).to({scaleX:0.789,scaleY:0.789,x:446.1},0).wait(1).to({scaleX:0.7953,scaleY:0.7953,y:281.15},0).wait(1).to({scaleX:0.8015,scaleY:0.8015,x:446.15,y:281.2},0).wait(1).to({scaleX:0.8076,scaleY:0.8076,y:281.15},0).wait(1).to({scaleX:0.8135,scaleY:0.8135,y:281.2},0).wait(1).to({scaleX:0.8194,scaleY:0.8194,x:446.1,y:281.15},0).wait(1).to({scaleX:0.8251,scaleY:0.8251,y:281.2},0).wait(1).to({scaleX:0.8307,scaleY:0.8307},0).wait(1).to({scaleX:0.8362,scaleY:0.8362},0).wait(1).to({scaleX:0.8416,scaleY:0.8416,x:446.15},0).wait(1).to({scaleX:0.8468,scaleY:0.8468},0).wait(1).to({scaleX:0.8519,scaleY:0.8519,y:281.25},0).wait(1).to({scaleX:0.8569,scaleY:0.8569,x:446.1},0).wait(1).to({scaleX:0.8618,scaleY:0.8618,x:446.15,y:281.2},0).wait(1).to({scaleX:0.8666,scaleY:0.8666},0).wait(1).to({scaleX:0.8713,scaleY:0.8713,x:446.1},0).wait(1).to({scaleX:0.8758,scaleY:0.8758,x:446.15,y:281.25},0).wait(1).to({scaleX:0.8802,scaleY:0.8802,x:446.1},0).wait(1).to({scaleX:0.8845,scaleY:0.8845,x:446.15},0).wait(1).to({scaleX:0.8887,scaleY:0.8887,y:281.2},0).wait(1).to({scaleX:0.8928,scaleY:0.8928,x:446.1},0).wait(1).to({scaleX:0.8967,scaleY:0.8967,x:446.15},0).wait(1).to({scaleX:0.9006,scaleY:0.9006,y:281.25},0).wait(1).to({scaleX:0.9043,scaleY:0.9043},0).wait(1).to({scaleX:0.9079,scaleY:0.9079},0).wait(1).to({scaleX:0.9114,scaleY:0.9114},0).wait(1).to({scaleX:0.9147,scaleY:0.9147},0).wait(1).to({scaleX:0.918,scaleY:0.918},0).wait(1).to({scaleX:0.9211,scaleY:0.9211},0).wait(1).to({scaleX:0.9241,scaleY:0.9241},0).wait(1).to({scaleX:0.927,scaleY:0.927,x:446.1,y:281.3},0).wait(1).to({scaleX:0.9298,scaleY:0.9298,y:281.25},0).wait(1).to({scaleX:0.9324,scaleY:0.9324,x:446.15},0).wait(1).to({scaleX:0.935,scaleY:0.935},0).wait(1).to({scaleX:0.9374,scaleY:0.9374,x:446.1},0).wait(1).to({scaleX:0.9397,scaleY:0.9397,x:446.15},0).wait(1).to({scaleX:0.9419,scaleY:0.9419,x:446.1},0).wait(1).to({scaleX:0.9439,scaleY:0.9439,y:281.3},0).wait(1).to({scaleX:0.9459,scaleY:0.9459,x:446.15},0).wait(1).to({scaleX:0.9477,scaleY:0.9477,x:446.1,y:281.25},0).wait(1).to({scaleX:0.9494,scaleY:0.9494,y:281.3},0).wait(1).to({scaleX:0.951,scaleY:0.951,x:446.15,y:281.25},0).wait(1).to({scaleX:0.9525,scaleY:0.9525,y:281.3},0).wait(1).to({scaleX:0.9538,scaleY:0.9538,y:281.25},0).wait(1).to({scaleX:0.9551,scaleY:0.9551},0).wait(1).to({scaleX:0.9562,scaleY:0.9562,y:281.3},0).wait(1).to({scaleX:0.9572,scaleY:0.9572,y:281.25},0).wait(1).to({scaleX:0.9581,scaleY:0.9581},0).wait(1).to({scaleX:0.9588,scaleY:0.9588,y:281.3},0).wait(1).to({scaleX:0.9595,scaleY:0.9595,x:446.1,y:281.25},0).wait(1).to({scaleX:0.96,scaleY:0.96},0).wait(1).to({scaleX:0.9604,scaleY:0.9604,x:446.15,y:281.3},0).wait(1).to({scaleX:0.9607,scaleY:0.9607,x:446.1,y:281.25},0).wait(1).to({regX:446.4,regY:281.2,scaleX:0.9609,scaleY:0.9609,x:446.3,y:281.1},0).wait(2).to({regX:446.2,regY:281.1,scaleX:0.9729,scaleY:0.9729,x:446.05,y:281,alpha:0.9215},0).wait(1).to({scaleX:0.9845,scaleY:0.9845,alpha:0.8462},0).wait(1).to({scaleX:0.9955,scaleY:0.9955,alpha:0.774},0).wait(1).to({scaleX:1.0061,scaleY:1.0061,x:446.1,alpha:0.7051},0).wait(1).to({scaleX:1.0161,scaleY:1.0161,y:281.05,alpha:0.6394},0).wait(1).to({scaleX:1.0257,scaleY:1.0257,y:281,alpha:0.5769},0).wait(1).to({scaleX:1.0348,scaleY:1.0348,y:281.05,alpha:0.5176},0).wait(1).to({scaleX:1.0434,scaleY:1.0434,y:281,alpha:0.4615},0).wait(1).to({scaleX:1.0515,scaleY:1.0515,x:446.05,alpha:0.4087},0).wait(1).to({scaleX:1.0591,scaleY:1.0591,x:446.1,alpha:0.359},0).wait(1).to({scaleX:1.0662,scaleY:1.0662,alpha:0.3125},0).wait(1).to({scaleX:1.0728,scaleY:1.0728,y:280.95,alpha:0.2692},0).wait(1).to({scaleX:1.079,scaleY:1.079,y:281,alpha:0.2292},0).wait(1).to({scaleX:1.0846,scaleY:1.0846,x:446.05,alpha:0.1923},0).wait(1).to({scaleX:1.0898,scaleY:1.0898,alpha:0.1587},0).wait(1).to({scaleX:1.0944,scaleY:1.0944,x:446.1,alpha:0.1282},0).wait(1).to({scaleX:1.0986,scaleY:1.0986,y:280.95,alpha:0.101},0).wait(1).to({scaleX:1.1023,scaleY:1.1023,y:281,alpha:0.0769},0).wait(1).to({scaleX:1.1055,scaleY:1.1055,x:446.05,alpha:0.0561},0).wait(1).to({scaleX:1.1082,scaleY:1.1082,y:280.95,alpha:0.0385},0).wait(1).to({scaleX:1.1104,scaleY:1.1104,y:281,alpha:0.024},0).wait(1).to({scaleX:1.1121,scaleY:1.1121,y:280.95,alpha:0.0128},0).wait(1).to({scaleX:1.1133,scaleY:1.1133,alpha:0.0048},0).wait(1).to({regX:446.3,scaleX:1.1141,scaleY:1.1141,x:446.2,y:281.05,alpha:0},0).to({regX:446.4,scaleX:0.4556,scaleY:0.4556,x:446.15,y:281,alpha:1},1).wait(1).to({regX:446.2,scaleX:0.4669,scaleY:0.4669,x:446.05},0).wait(1).to({scaleX:0.4782,scaleY:0.4782,y:280.95},0).wait(1).to({scaleX:0.4893,scaleY:0.4893,x:446,y:281},0).wait(1).to({scaleX:0.5003,scaleY:0.5003,x:446.05},0).wait(1).to({scaleX:0.5112,scaleY:0.5112,x:446},0).wait(1).to({scaleX:0.522,scaleY:0.522},0).wait(1).to({scaleX:0.5327,scaleY:0.5327,x:446.05},0).wait(1).to({scaleX:0.5432,scaleY:0.5432,x:446},0).wait(1).to({scaleX:0.5537,scaleY:0.5537},0).wait(1).to({scaleX:0.564,scaleY:0.564},0).wait(1).to({scaleX:0.5742,scaleY:0.5742,y:280.95},0).wait(1).to({scaleX:0.5843,scaleY:0.5843},0).wait(1).to({scaleX:0.5943,scaleY:0.5943},0).wait(1).to({scaleX:0.6042,scaleY:0.6042,y:281},0).wait(1).to({scaleX:0.614,scaleY:0.614},0).wait(1).to({scaleX:0.6236,scaleY:0.6236,x:445.95},0).wait(1).to({scaleX:0.6331,scaleY:0.6331,y:280.95},0).wait(1).to({scaleX:0.6426,scaleY:0.6426},0).wait(1).to({scaleX:0.6519,scaleY:0.6519,y:281},0).wait(1).to({scaleX:0.6611,scaleY:0.6611,y:280.95},0).wait(1).to({scaleX:0.6701,scaleY:0.6701},0).wait(1).to({scaleX:0.6791,scaleY:0.6791,y:281},0).wait(1).to({scaleX:0.6879,scaleY:0.6879},0).wait(1).to({scaleX:0.6967,scaleY:0.6967},0).wait(1).to({scaleX:0.7053,scaleY:0.7053,y:280.95},0).wait(1).to({scaleX:0.7138,scaleY:0.7138,y:281},0).wait(1).to({scaleX:0.7222,scaleY:0.7222,y:280.95},0).wait(1).to({scaleX:0.7305,scaleY:0.7305,y:281},0).wait(1).to({scaleX:0.7386,scaleY:0.7386,x:445.9},0).wait(1).to({scaleX:0.7467,scaleY:0.7467},0).wait(1).to({scaleX:0.7546,scaleY:0.7546,y:280.95},0).wait(1).to({scaleX:0.7624,scaleY:0.7624},0).wait(1).to({scaleX:0.7701,scaleY:0.7701,x:445.95,y:281},0).wait(1).to({scaleX:0.7777,scaleY:0.7777,x:445.9,y:280.95},0).wait(1).to({scaleX:0.7852,scaleY:0.7852},0).wait(1).to({scaleX:0.7926,scaleY:0.7926,y:281},0).wait(1).to({scaleX:0.7998,scaleY:0.7998},0).wait(1).to({scaleX:0.8069,scaleY:0.8069},0).wait(1).to({scaleX:0.814,scaleY:0.814,y:280.95},0).wait(1).to({scaleX:0.8209,scaleY:0.8209,x:445.85,y:281},0).wait(1).to({scaleX:0.8277,scaleY:0.8277,x:445.9,y:280.95},0).wait(1).to({scaleX:0.8343,scaleY:0.8343,y:281},0).wait(1).to({scaleX:0.8409,scaleY:0.8409,x:445.85},0).wait(1).to({scaleX:0.8474,scaleY:0.8474,x:445.9},0).wait(1).to({scaleX:0.8537,scaleY:0.8537,x:445.85,y:280.95},0).wait(1).to({scaleX:0.8599,scaleY:0.8599,x:445.9},0).wait(1).to({scaleX:0.866,scaleY:0.866,x:445.85,y:281},0).wait(1).to({scaleX:0.872,scaleY:0.872,x:445.9,y:280.95},0).wait(1).to({scaleX:0.8779,scaleY:0.8779,x:445.85},0).wait(1).to({scaleX:0.8837,scaleY:0.8837,x:445.9},0).wait(1).to({scaleX:0.8893,scaleY:0.8893,x:445.85,y:281},0).wait(1).to({scaleX:0.8949,scaleY:0.8949,x:445.9},0).wait(1).to({scaleX:0.9003,scaleY:0.9003,x:445.85,y:280.95},0).wait(1).to({scaleX:0.9056,scaleY:0.9056},0).wait(1).to({scaleX:0.9108,scaleY:0.9108},0).wait(1).to({scaleX:0.9159,scaleY:0.9159},0).wait(1).to({scaleX:0.9208,scaleY:0.9208,y:281},0).wait(1).to({scaleX:0.9257,scaleY:0.9257,y:280.95},0).wait(1).to({scaleX:0.9304,scaleY:0.9304,y:281},0).wait(1).to({scaleX:0.935,scaleY:0.935},0).wait(1).to({scaleX:0.9395,scaleY:0.9395,x:445.8,y:280.95},0).wait(1).to({scaleX:0.9439,scaleY:0.9439,x:445.85,y:281},0).wait(1).to({scaleX:0.9482,scaleY:0.9482},0).wait(1).to({scaleX:0.9524,scaleY:0.9524,y:280.95},0).wait(1).to({scaleX:0.9564,scaleY:0.9564,x:445.8},0).wait(1).to({scaleX:0.9604,scaleY:0.9604},0).wait(1).to({scaleX:0.9642,scaleY:0.9642,x:445.85,y:281},0).wait(1).to({scaleX:0.9679,scaleY:0.9679},0).wait(1).to({scaleX:0.9715,scaleY:0.9715},0).wait(1).to({scaleX:0.975,scaleY:0.975,y:280.95},0).wait(1).to({scaleX:0.9784,scaleY:0.9784},0).wait(1).to({scaleX:0.9816,scaleY:0.9816,y:281},0).wait(1).to({scaleX:0.9848,scaleY:0.9848,y:280.95},0).wait(1).to({scaleX:0.9878,scaleY:0.9878},0).wait(1).to({scaleX:0.9907,scaleY:0.9907,y:281},0).wait(1).to({scaleX:0.9935,scaleY:0.9935,y:280.95},0).wait(1).to({scaleX:0.9962,scaleY:0.9962},0).wait(1).to({scaleX:0.9987,scaleY:0.9987},0).wait(1).to({scaleX:1.0012,scaleY:1.0012,x:445.9,y:281.05},0).wait(1).to({scaleX:1.0035,scaleY:1.0035,x:445.85},0).wait(1).to({scaleX:1.0058,scaleY:1.0058,y:281},0).wait(1).to({scaleX:1.0079,scaleY:1.0079},0).wait(1).to({scaleX:1.0099,scaleY:1.0099},0).wait(1).to({scaleX:1.0118,scaleY:1.0118},0).wait(1).to({scaleX:1.0135,scaleY:1.0135,x:445.9},0).wait(1).to({scaleX:1.0152,scaleY:1.0152,x:445.85},0).wait(1).to({scaleX:1.0167,scaleY:1.0167},0).wait(1).to({scaleX:1.0181,scaleY:1.0181},0).wait(1).to({scaleX:1.0195,scaleY:1.0195,x:445.9},0).wait(1).to({scaleX:1.0207,scaleY:1.0207,x:445.85},0).wait(1).to({scaleX:1.0217,scaleY:1.0217},0).wait(1).to({scaleX:1.0227,scaleY:1.0227,x:445.9,y:281.05},0).wait(1).to({scaleX:1.0236,scaleY:1.0236,x:445.85,y:281},0).wait(1).to({scaleX:1.0243,scaleY:1.0243,y:281.05},0).wait(1).to({scaleX:1.0249,scaleY:1.0249,x:445.9,y:281},0).wait(1).to({scaleX:1.0254,scaleY:1.0254,x:445.85},0).wait(1).to({scaleX:1.0258,scaleY:1.0258},0).wait(1).to({scaleX:1.0261,scaleY:1.0261},0).wait(1).to({regY:281,scaleX:1.0263,scaleY:1.0263,x:446,y:280.95},0).wait(2).to({regY:281.1,scaleX:1.0383,scaleY:1.0383,y:281.05,alpha:0.9224},0).wait(1).to({scaleX:1.0499,scaleY:1.0499,alpha:0.848},0).wait(1).to({scaleX:1.0609,scaleY:1.0609,alpha:0.7767},0).wait(1).to({scaleX:1.0714,scaleY:1.0714,x:446.05,y:281.1,alpha:0.7086},0).wait(1).to({scaleX:1.0815,scaleY:1.0815,x:446,y:281.05,alpha:0.6436},0).wait(1).to({scaleX:1.0911,scaleY:1.0911,x:446.05,alpha:0.5819},0).wait(1).to({scaleX:1.1001,scaleY:1.1001,alpha:0.5233},0).wait(1).to({scaleX:1.1087,scaleY:1.1087,x:446,alpha:0.4678},0).wait(1).to({scaleX:1.1168,scaleY:1.1168,x:446.05,alpha:0.4156},0).wait(1).to({scaleX:1.1244,scaleY:1.1244,x:446,y:281,alpha:0.3665},0).wait(1).to({scaleX:1.1315,scaleY:1.1315,x:446.05,alpha:0.3206},0).wait(1).to({scaleX:1.1382,scaleY:1.1382,y:281.05,alpha:0.2778},0).wait(1).to({scaleX:1.1443,scaleY:1.1443,alpha:0.2382},0).wait(1).to({scaleX:1.1499,scaleY:1.1499,alpha:0.2018},0).wait(1).to({scaleX:1.1551,scaleY:1.1551,alpha:0.1685},0).wait(1).to({scaleX:1.1598,scaleY:1.1598,alpha:0.1384},0).wait(1).to({scaleX:1.1639,scaleY:1.1639,alpha:0.1115},0).wait(1).to({scaleX:1.1676,scaleY:1.1676,alpha:0.0877},0).wait(1).to({scaleX:1.1708,scaleY:1.1708,alpha:0.0672},0).wait(1).to({scaleX:1.1735,scaleY:1.1735,y:281,alpha:0.0497},0).wait(1).to({scaleX:1.1757,scaleY:1.1757,y:281.05,alpha:0.0355},0).wait(1).to({scaleX:1.1774,scaleY:1.1774,y:281,alpha:0.0244},0).wait(1).to({scaleX:1.1786,scaleY:1.1786,alpha:0.0165},0).wait(1).to({regY:280.9,scaleX:1.1794,scaleY:1.1794,y:280.85,alpha:0.0117},0).to({regX:446.3,regY:281,scaleX:0.3409,scaleY:0.3409,x:446.1,y:280.9,alpha:1},1).wait(1).to({regX:446.2,regY:281.1,scaleX:0.3552,scaleY:0.3552,x:446},0).wait(1).to({scaleX:0.3693,scaleY:0.3693},0).wait(1).to({scaleX:0.3832,scaleY:0.3832,x:446.05},0).wait(1).to({scaleX:0.397,scaleY:0.397,x:446},0).wait(1).to({scaleX:0.4107,scaleY:0.4107},0).wait(1).to({scaleX:0.4242,scaleY:0.4242},0).wait(1).to({scaleX:0.4376,scaleY:0.4376},0).wait(1).to({scaleX:0.4508,scaleY:0.4508,x:445.95},0).wait(1).to({scaleX:0.4639,scaleY:0.4639},0).wait(1).to({scaleX:0.4769,scaleY:0.4769,x:446},0).wait(1).to({scaleX:0.4897,scaleY:0.4897,x:445.95},0).wait(1).to({scaleX:0.5024,scaleY:0.5024,y:280.85},0).wait(1).to({scaleX:0.5149,scaleY:0.5149,y:280.9},0).wait(1).to({scaleX:0.5273,scaleY:0.5273,y:280.85},0).wait(1).to({scaleX:0.5395,scaleY:0.5395},0).wait(1).to({scaleX:0.5516,scaleY:0.5516},0).wait(1).to({scaleX:0.5636,scaleY:0.5636,x:445.9},0).wait(1).to({scaleX:0.5754,scaleY:0.5754,x:445.95,y:280.9},0).wait(1).to({scaleX:0.5871,scaleY:0.5871,y:280.85},0).wait(1).to({scaleX:0.5986,scaleY:0.5986},0).wait(1).to({scaleX:0.61,scaleY:0.61,x:445.9},0).wait(1).to({scaleX:0.6212,scaleY:0.6212},0).wait(1).to({scaleX:0.6323,scaleY:0.6323,y:280.9},0).wait(1).to({scaleX:0.6432,scaleY:0.6432,y:280.85},0).wait(1).to({scaleX:0.654,scaleY:0.654},0).wait(1).to({scaleX:0.6647,scaleY:0.6647},0).wait(1).to({scaleX:0.6752,scaleY:0.6752},0).wait(1).to({scaleX:0.6856,scaleY:0.6856,x:445.85},0).wait(1).to({scaleX:0.6958,scaleY:0.6958,x:445.9},0).wait(1);
	this.timeline.addTween(_tweenStr_1.to({scaleX:0.7059,scaleY:0.7059},0).wait(1).to({scaleX:0.7159,scaleY:0.7159,y:280.9},0).wait(1).to({scaleX:0.7257,scaleY:0.7257,x:445.85,y:280.85},0).wait(1).to({scaleX:0.7354,scaleY:0.7354},0).wait(1).to({scaleX:0.7449,scaleY:0.7449},0).wait(1).to({scaleX:0.7543,scaleY:0.7543},0).wait(1).to({scaleX:0.7635,scaleY:0.7635},0).wait(1).to({scaleX:0.7726,scaleY:0.7726,x:445.8},0).wait(1).to({scaleX:0.7815,scaleY:0.7815},0).wait(1).to({scaleX:0.7903,scaleY:0.7903,x:445.85},0).wait(1).to({scaleX:0.799,scaleY:0.799,x:445.8},0).wait(1).to({scaleX:0.8075,scaleY:0.8075},0).wait(1).to({scaleX:0.8159,scaleY:0.8159},0).wait(1).to({scaleX:0.8241,scaleY:0.8241},0).wait(1).to({scaleX:0.8322,scaleY:0.8322},0).wait(1).to({scaleX:0.8401,scaleY:0.8401},0).wait(1).to({scaleX:0.8479,scaleY:0.8479},0).wait(1).to({scaleX:0.8556,scaleY:0.8556},0).wait(1).to({scaleX:0.8631,scaleY:0.8631,x:445.75,y:280.8},0).wait(1).to({scaleX:0.8705,scaleY:0.8705,x:445.8,y:280.85},0).wait(1).to({scaleX:0.8777,scaleY:0.8777},0).wait(1).to({scaleX:0.8848,scaleY:0.8848,y:280.8},0).wait(1).to({scaleX:0.8917,scaleY:0.8917},0).wait(1).to({scaleX:0.8985,scaleY:0.8985,y:280.85},0).wait(1).to({scaleX:0.9052,scaleY:0.9052},0).wait(1).to({scaleX:0.9117,scaleY:0.9117,x:445.75},0).wait(1).to({scaleX:0.9181,scaleY:0.9181,y:280.8},0).wait(1).to({scaleX:0.9243,scaleY:0.9243},0).wait(1).to({scaleX:0.9304,scaleY:0.9304,y:280.85},0).wait(1).to({scaleX:0.9363,scaleY:0.9363},0).wait(1).to({scaleX:0.9421,scaleY:0.9421,x:445.8},0).wait(1).to({scaleX:0.9478,scaleY:0.9478,x:445.75,y:280.8},0).wait(1).to({scaleX:0.9533,scaleY:0.9533},0).wait(1).to({scaleX:0.9587,scaleY:0.9587,y:280.85},0).wait(1).to({scaleX:0.9639,scaleY:0.9639},0).wait(1).to({scaleX:0.969,scaleY:0.969},0).wait(1).to({scaleX:0.9739,scaleY:0.9739,y:280.8},0).wait(1).to({scaleX:0.9787,scaleY:0.9787},0).wait(1).to({scaleX:0.9834,scaleY:0.9834,x:445.7},0).wait(1).to({scaleX:0.9879,scaleY:0.9879,x:445.75,y:280.85},0).wait(1).to({scaleX:0.9922,scaleY:0.9922,y:280.8},0).wait(1).to({scaleX:0.9965,scaleY:0.9965,x:445.7},0).wait(1).to({scaleX:1.0005,scaleY:1.0005,x:445.8,y:280.9},0).wait(1).to({scaleX:1.0045,scaleY:1.0045,y:280.85},0).wait(1).to({scaleX:1.0083,scaleY:1.0083},0).wait(1).to({scaleX:1.0119,scaleY:1.0119,x:445.75,y:280.9},0).wait(1).to({scaleX:1.0154,scaleY:1.0154,x:445.8},0).wait(1).to({scaleX:1.0188,scaleY:1.0188},0).wait(1).to({scaleX:1.022,scaleY:1.022,x:445.75},0).wait(1).to({scaleX:1.0251,scaleY:1.0251,x:445.8,y:280.85},0).wait(1).to({scaleX:1.028,scaleY:1.028,x:445.75,y:280.9},0).wait(1).to({scaleX:1.0308,scaleY:1.0308,y:280.85},0).wait(1).to({scaleX:1.0335,scaleY:1.0335},0).wait(1).to({scaleX:1.036,scaleY:1.036},0).wait(1).to({scaleX:1.0383,scaleY:1.0383},0).wait(1).to({scaleX:1.0405,scaleY:1.0405,y:280.9},0).wait(1).to({scaleX:1.0426,scaleY:1.0426},0).wait(1).to({scaleX:1.0446,scaleY:1.0446,y:280.85},0).wait(1).to({scaleX:1.0463,scaleY:1.0463,x:445.8,y:280.9},0).wait(1).to({scaleX:1.048,scaleY:1.048,x:445.75},0).wait(1).to({scaleX:1.0495,scaleY:1.0495,x:445.8,y:280.85},0).wait(1).to({scaleX:1.0509,scaleY:1.0509,x:445.75,y:280.9},0).wait(1).to({scaleX:1.0521,scaleY:1.0521},0).wait(1).to({scaleX:1.0531,scaleY:1.0531},0).wait(1).to({scaleX:1.0541,scaleY:1.0541,y:280.85},0).wait(1).to({scaleX:1.0549,scaleY:1.0549,x:445.8},0).wait(1).to({scaleX:1.0555,scaleY:1.0555,x:445.75},0).wait(1).to({scaleX:1.056,scaleY:1.056,y:280.9},0).wait(1).to({scaleX:1.0564,scaleY:1.0564},0).wait(1).to({regX:446.1,regY:280.9,scaleX:1.0566,scaleY:1.0566,x:445.9,y:280.8},0).wait(2).to({regX:446.2,regY:281.1,scaleX:1.0686,scaleY:1.0686,x:446,y:281.05,alpha:0.9215},0).wait(1).to({scaleX:1.0801,scaleY:1.0801,y:281,alpha:0.8462},0).wait(1).to({scaleX:1.0912,scaleY:1.0912,x:446.05,y:281.05,alpha:0.774},0).wait(1).to({scaleX:1.1017,scaleY:1.1017,x:446,alpha:0.7051},0).wait(1).to({scaleX:1.1118,scaleY:1.1118,x:446.05,y:281,alpha:0.6394},0).wait(1).to({scaleX:1.1214,scaleY:1.1214,x:446,alpha:0.5769},0).wait(1).to({scaleX:1.1304,scaleY:1.1304,alpha:0.5176},0).wait(1).to({scaleX:1.139,scaleY:1.139,y:281.05,alpha:0.4615},0).wait(1).to({scaleX:1.1471,scaleY:1.1471,y:281,alpha:0.4087},0).wait(1).to({scaleX:1.1547,scaleY:1.1547,alpha:0.359},0).wait(1).to({scaleX:1.1619,scaleY:1.1619,alpha:0.3125},0).wait(1).to({scaleX:1.1685,scaleY:1.1685,alpha:0.2692},0).wait(1).to({scaleX:1.1746,scaleY:1.1746,y:281.05,alpha:0.2292},0).wait(1).to({scaleX:1.1803,scaleY:1.1803,y:281,alpha:0.1923},0).wait(1).to({scaleX:1.1854,scaleY:1.1854,alpha:0.1587},0).wait(1).to({scaleX:1.1901,scaleY:1.1901,y:281.05,alpha:0.1282},0).wait(1).to({scaleX:1.1943,scaleY:1.1943,x:445.95,y:281,alpha:0.101},0).wait(1).to({scaleX:1.1979,scaleY:1.1979,y:281.05,alpha:0.0769},0).wait(1).to({scaleX:1.2011,scaleY:1.2011,x:446,alpha:0.0561},0).wait(1).to({scaleX:1.2038,scaleY:1.2038,y:281,alpha:0.0385},0).wait(1).to({scaleX:1.206,scaleY:1.206,alpha:0.024},0).wait(1).to({scaleX:1.2078,scaleY:1.2078,alpha:0.0128},0).wait(1).to({scaleX:1.209,scaleY:1.209,alpha:0.0048},0).wait(1).to({regX:446,regY:280.8,scaleX:1.2097,scaleY:1.2097,x:445.8,y:280.7,alpha:0},0).to({regY:280.9,scaleX:0.3948,scaleY:0.3948,x:445.75},1).wait(1).to({regX:446.2,regY:281.1,scaleX:0.4077,scaleY:0.4077,x:445.8,y:280.75,alpha:0.0199},0).wait(1).to({scaleX:0.4205,scaleY:0.4205,y:280.8,alpha:0.0396},0).wait(1).to({scaleX:0.4331,scaleY:0.4331,alpha:0.0591},0).wait(1).to({scaleX:0.4455,scaleY:0.4455,alpha:0.0784},0).wait(1).to({scaleX:0.4579,scaleY:0.4579,y:280.75,alpha:0.0975},0).wait(1).to({scaleX:0.4701,scaleY:0.4701,alpha:0.1164},0).wait(1).to({scaleX:0.4822,scaleY:0.4822,alpha:0.1351},0).wait(1).to({scaleX:0.4942,scaleY:0.4942,alpha:0.1536},0).wait(1).to({scaleX:0.506,scaleY:0.506,y:280.8,alpha:0.1719},0).wait(1).to({scaleX:0.5177,scaleY:0.5177,alpha:0.19},0).wait(1).to({scaleX:0.5293,scaleY:0.5293,x:445.85,alpha:0.2079},0).wait(1).to({scaleX:0.5408,scaleY:0.5408,x:445.8,alpha:0.2256},0).wait(1).to({scaleX:0.5521,scaleY:0.5521,alpha:0.2431},0).wait(1).to({scaleX:0.5633,scaleY:0.5633,x:445.85,alpha:0.2604},0).wait(1).to({scaleX:0.5743,scaleY:0.5743,x:445.8,alpha:0.2775},0).wait(1).to({scaleX:0.5853,scaleY:0.5853,alpha:0.2944},0).wait(1).to({scaleX:0.5961,scaleY:0.5961,alpha:0.3111},0).wait(1).to({scaleX:0.6067,scaleY:0.6067,x:445.85,alpha:0.3276},0).wait(1).to({scaleX:0.6173,scaleY:0.6173,alpha:0.3439},0).wait(1).to({scaleX:0.6277,scaleY:0.6277,alpha:0.36},0).wait(1).to({scaleX:0.638,scaleY:0.638,x:445.8,alpha:0.3759},0).wait(1).to({scaleX:0.6481,scaleY:0.6481,alpha:0.3916},0).wait(1).to({scaleX:0.6582,scaleY:0.6582,alpha:0.4071},0).wait(1).to({scaleX:0.6681,scaleY:0.6681,x:445.85,alpha:0.4224},0).wait(1).to({scaleX:0.6778,scaleY:0.6778,x:445.8,alpha:0.4375},0).wait(1).to({scaleX:0.6875,scaleY:0.6875,alpha:0.4524},0).wait(1).to({scaleX:0.697,scaleY:0.697,x:445.85,alpha:0.4671},0).wait(1).to({scaleX:0.7064,scaleY:0.7064,alpha:0.4816},0).wait(1).to({scaleX:0.7156,scaleY:0.7156,x:445.8,alpha:0.4959},0).wait(1).to({scaleX:0.7247,scaleY:0.7247,x:445.85,alpha:0.5101},0).wait(1).to({scaleX:0.7337,scaleY:0.7337,alpha:0.524},0).wait(1).to({scaleX:0.7426,scaleY:0.7426,y:280.85,alpha:0.5377},0).wait(1).to({scaleX:0.7513,scaleY:0.7513,alpha:0.5512},0).wait(1).to({scaleX:0.7599,scaleY:0.7599,y:280.8,alpha:0.5645},0).wait(1).to({scaleX:0.7684,scaleY:0.7684,x:445.8,y:280.85,alpha:0.5776},0).wait(1).to({scaleX:0.7767,scaleY:0.7767,x:445.85,alpha:0.5905},0).wait(1).to({scaleX:0.785,scaleY:0.785,alpha:0.6032},0).wait(1).to({scaleX:0.793,scaleY:0.793,x:445.8,y:280.8,alpha:0.6157},0).wait(1).to({scaleX:0.801,scaleY:0.801,alpha:0.628},0).wait(1).to({scaleX:0.8088,scaleY:0.8088,x:445.85,alpha:0.6401},0).wait(1).to({scaleX:0.8165,scaleY:0.8165,alpha:0.652},0).wait(1).to({scaleX:0.8241,scaleY:0.8241,x:445.8,y:280.85,alpha:0.6637},0).wait(1).to({scaleX:0.8315,scaleY:0.8315,x:445.85,alpha:0.6752},0).wait(1).to({scaleX:0.8388,scaleY:0.8388,alpha:0.6865},0).wait(1).to({scaleX:0.846,scaleY:0.846,alpha:0.6976},0).wait(1).to({scaleX:0.8531,scaleY:0.8531,alpha:0.7085},0).wait(1).to({scaleX:0.86,scaleY:0.86,alpha:0.7192},0).wait(1).to({scaleX:0.8668,scaleY:0.8668,x:445.8,alpha:0.7297},0).wait(1).to({scaleX:0.8734,scaleY:0.8734,x:445.85,y:280.8,alpha:0.74},0).wait(1).to({scaleX:0.88,scaleY:0.88,y:280.85,alpha:0.7501},0).wait(1).to({scaleX:0.8864,scaleY:0.8864,alpha:0.76},0).wait(1).to({scaleX:0.8927,scaleY:0.8927,alpha:0.7697},0).wait(1).to({scaleX:0.8988,scaleY:0.8988,alpha:0.7792},0).wait(1).to({scaleX:0.9048,scaleY:0.9048,alpha:0.7885},0).wait(1).to({scaleX:0.9107,scaleY:0.9107,alpha:0.7976},0).wait(1).to({scaleX:0.9165,scaleY:0.9165,x:445.8,alpha:0.8065},0).wait(1).to({scaleX:0.9221,scaleY:0.9221,x:445.85,alpha:0.8152},0).wait(1).to({scaleX:0.9276,scaleY:0.9276,alpha:0.8237},0).wait(1).to({scaleX:0.933,scaleY:0.933,alpha:0.832},0).wait(1).to({scaleX:0.9382,scaleY:0.9382,x:445.8,alpha:0.8401},0).wait(1).to({scaleX:0.9433,scaleY:0.9433,x:445.85,alpha:0.848},0).wait(1).to({scaleX:0.9483,scaleY:0.9483,x:445.8,alpha:0.8557},0).wait(1).to({scaleX:0.9531,scaleY:0.9531,x:445.85,alpha:0.8632},0).wait(1).to({scaleX:0.9579,scaleY:0.9579,alpha:0.8705},0).wait(1).to({scaleX:0.9625,scaleY:0.9625,alpha:0.8776},0).wait(1).to({scaleX:0.9669,scaleY:0.9669,alpha:0.8845},0).wait(1).to({scaleX:0.9712,scaleY:0.9712,x:445.8,alpha:0.8912},0).wait(1).to({scaleX:0.9755,scaleY:0.9755,x:445.85,alpha:0.8977},0).wait(1).to({scaleX:0.9795,scaleY:0.9795,x:445.8,alpha:0.904},0).wait(1).to({scaleX:0.9835,scaleY:0.9835,alpha:0.9101},0).wait(1).to({scaleX:0.9873,scaleY:0.9873,x:445.85,y:280.9,alpha:0.916},0).wait(1).to({scaleX:0.991,scaleY:0.991,x:445.8,y:280.85,alpha:0.9217},0).wait(1).to({scaleX:0.9945,scaleY:0.9945,x:445.85,alpha:0.9272},0).wait(1).to({scaleX:0.998,scaleY:0.998,y:280.9,alpha:0.9325},0).wait(1).to({scaleX:1.0013,scaleY:1.0013,x:445.9,alpha:0.9376},0).wait(1).to({scaleX:1.0044,scaleY:1.0044,x:445.85,alpha:0.9425},0).wait(1).to({scaleX:1.0075,scaleY:1.0075,x:445.9,alpha:0.9472},0).wait(1).to({scaleX:1.0104,scaleY:1.0104,alpha:0.9517},0).wait(1).to({scaleX:1.0132,scaleY:1.0132,x:445.85,alpha:0.956},0).wait(1).to({scaleX:1.0158,scaleY:1.0158,x:445.9,alpha:0.9601},0).wait(1).to({scaleX:1.0183,scaleY:1.0183,alpha:0.964},0).wait(1).to({scaleX:1.0207,scaleY:1.0207,alpha:0.9677},0).wait(1).to({scaleX:1.023,scaleY:1.023,alpha:0.9712},0).wait(1).to({scaleX:1.0251,scaleY:1.0251,alpha:0.9745},0).wait(1).to({scaleX:1.0271,scaleY:1.0271,y:280.95,alpha:0.9776},0).wait(1).to({scaleX:1.029,scaleY:1.029,y:280.9,alpha:0.9805},0).wait(1).to({scaleX:1.0308,scaleY:1.0308,x:445.85,y:280.95,alpha:0.9832},0).wait(1).to({scaleX:1.0324,scaleY:1.0324,x:445.9,y:280.9,alpha:0.9857},0).wait(1).to({scaleX:1.0339,scaleY:1.0339,alpha:0.988},0).wait(1).to({scaleX:1.0352,scaleY:1.0352,alpha:0.9901},0).wait(1).to({scaleX:1.0365,scaleY:1.0365,y:280.95,alpha:0.992},0).wait(1).to({scaleX:1.0376,scaleY:1.0376,y:280.9,alpha:0.9937},0).wait(1).to({scaleX:1.0385,scaleY:1.0385,y:280.95,alpha:0.9952},0).wait(1).to({scaleX:1.0394,scaleY:1.0394,y:280.9,alpha:0.9965},0).wait(1).to({scaleX:1.0401,scaleY:1.0401,alpha:0.9976},0).wait(1).to({scaleX:1.0407,scaleY:1.0407,y:280.95,alpha:0.9985},0).wait(1).to({scaleX:1.0411,scaleY:1.0411,y:280.9,alpha:0.9992},0).wait(1).to({scaleX:1.0414,scaleY:1.0414,y:280.95,alpha:0.9997},0).wait(1).to({regX:445.9,regY:280.8,scaleX:1.0416,scaleY:1.0416,x:445.65,y:280.65,alpha:1},0).wait(2).to({regX:446.2,regY:281.1,scaleX:1.0569,scaleY:1.0569,x:446,y:280.95},0).wait(1).to({scaleX:1.0716,scaleY:1.0716,y:281},0).wait(1).to({scaleX:1.0857,scaleY:1.0857},0).wait(1).to({scaleX:1.0991,scaleY:1.0991},0).wait(1).to({scaleX:1.1119,scaleY:1.1119},0).wait(1).to({scaleX:1.1241,scaleY:1.1241},0).wait(1).to({scaleX:1.1357,scaleY:1.1357},0).wait(1).to({scaleX:1.1466,scaleY:1.1466,x:445.95},0).wait(1).to({scaleX:1.1569,scaleY:1.1569,x:446},0).wait(1).to({scaleX:1.1666,scaleY:1.1666},0).wait(1).to({scaleX:1.1757,scaleY:1.1757,y:281.05},0).wait(1).to({scaleX:1.1841,scaleY:1.1841,y:281},0).wait(1).to({scaleX:1.1919,scaleY:1.1919},0).wait(1).to({scaleX:1.1991,scaleY:1.1991},0).wait(1).to({scaleX:1.2057,scaleY:1.2057},0).wait(1).to({scaleX:1.2116,scaleY:1.2116,y:281.05},0).wait(1).to({scaleX:1.2169,scaleY:1.2169},0).wait(1).to({scaleX:1.2216,scaleY:1.2216},0).wait(1).to({scaleX:1.2257,scaleY:1.2257},0).wait(1).to({scaleX:1.2291,scaleY:1.2291,y:281},0).wait(1).to({scaleX:1.2319,scaleY:1.2319,y:281.05},0).wait(1).to({scaleX:1.2341,scaleY:1.2341,x:445.95,y:281},0).wait(1).to({scaleX:1.2357,scaleY:1.2357,y:281.05},0).wait(1).to({regX:445.8,regY:280.8,scaleX:1.2366,scaleY:1.2366,x:445.6,y:280.7},0).to({_off:true},1).wait(50));

	// Layer_1
	this.twinkle1_2 = new lib.stars();
	this.twinkle1_2.name = "twinkle1_2";
	this.twinkle1_2.setTransform(446.35,281.05,0.3878,0.3878,0,0,0,446.4,281.1);

	
	var _tweenStr_2 = cjs.Tween.get(this.twinkle1_2).wait(1).to({regX:446.2,scaleX:0.4011,scaleY:0.4011,x:446.25,y:281},0).wait(1).to({scaleX:0.4143,scaleY:0.4143,x:446.2},0).wait(1).to({scaleX:0.4274,scaleY:0.4274,x:446.25,y:281.05},0).wait(1).to({scaleX:0.4403,scaleY:0.4403},0).wait(1).to({scaleX:0.4532,scaleY:0.4532},0).wait(1).to({scaleX:0.4658,scaleY:0.4658,y:281},0).wait(1).to({scaleX:0.4784,scaleY:0.4784},0).wait(1).to({scaleX:0.4908,scaleY:0.4908,x:446.2},0).wait(1).to({scaleX:0.503,scaleY:0.503},0).wait(1).to({scaleX:0.5152,scaleY:0.5152},0).wait(1).to({scaleX:0.5272,scaleY:0.5272},0).wait(1).to({scaleX:0.539,scaleY:0.539},0).wait(1).to({scaleX:0.5508,scaleY:0.5508},0).wait(1).to({scaleX:0.5624,scaleY:0.5624},0).wait(1).to({scaleX:0.5738,scaleY:0.5738},0).wait(1).to({scaleX:0.5852,scaleY:0.5852},0).wait(1).to({scaleX:0.5964,scaleY:0.5964},0).wait(1).to({scaleX:0.6074,scaleY:0.6074},0).wait(1).to({scaleX:0.6184,scaleY:0.6184,x:446.15,y:280.95},0).wait(1).to({scaleX:0.6291,scaleY:0.6291,y:281},0).wait(1).to({scaleX:0.6398,scaleY:0.6398,x:446.2},0).wait(1).to({scaleX:0.6503,scaleY:0.6503},0).wait(1).to({scaleX:0.6607,scaleY:0.6607,x:446.15},0).wait(1).to({scaleX:0.671,scaleY:0.671,y:280.95},0).wait(1).to({scaleX:0.6811,scaleY:0.6811},0).wait(1).to({scaleX:0.6911,scaleY:0.6911},0).wait(1).to({scaleX:0.701,scaleY:0.701,y:281},0).wait(1).to({scaleX:0.7107,scaleY:0.7107,y:280.95},0).wait(1).to({scaleX:0.7203,scaleY:0.7203},0).wait(1).to({scaleX:0.7297,scaleY:0.7297},0).wait(1).to({scaleX:0.739,scaleY:0.739,y:281},0).wait(1).to({scaleX:0.7482,scaleY:0.7482,y:280.95},0).wait(1).to({scaleX:0.7573,scaleY:0.7573},0).wait(1).to({scaleX:0.7662,scaleY:0.7662,x:446.1},0).wait(1).to({scaleX:0.775,scaleY:0.775,x:446.15},0).wait(1).to({scaleX:0.7836,scaleY:0.7836,x:446.1},0).wait(1).to({scaleX:0.7921,scaleY:0.7921},0).wait(1).to({scaleX:0.8005,scaleY:0.8005},0).wait(1).to({scaleX:0.8088,scaleY:0.8088},0).wait(1).to({scaleX:0.8169,scaleY:0.8169},0).wait(1).to({scaleX:0.8249,scaleY:0.8249},0).wait(1).to({scaleX:0.8327,scaleY:0.8327},0).wait(1).to({scaleX:0.8404,scaleY:0.8404},0).wait(1).to({scaleX:0.848,scaleY:0.848},0).wait(1).to({scaleX:0.8554,scaleY:0.8554},0).wait(1).to({scaleX:0.8627,scaleY:0.8627},0).wait(1).to({scaleX:0.8699,scaleY:0.8699},0).wait(1).to({scaleX:0.8769,scaleY:0.8769},0).wait(1).to({scaleX:0.8839,scaleY:0.8839,x:446.05},0).wait(1).to({scaleX:0.8906,scaleY:0.8906,x:446.1},0).wait(1).to({scaleX:0.8973,scaleY:0.8973,x:446.05,y:280.9},0).wait(1).to({scaleX:0.9038,scaleY:0.9038,y:280.95},0).wait(1).to({scaleX:0.9101,scaleY:0.9101},0).wait(1).to({scaleX:0.9164,scaleY:0.9164,x:446.1},0).wait(1).to({scaleX:0.9225,scaleY:0.9225,x:446.05},0).wait(1).to({scaleX:0.9284,scaleY:0.9284},0).wait(1).to({scaleX:0.9343,scaleY:0.9343,y:280.9},0).wait(1).to({scaleX:0.94,scaleY:0.94},0).wait(1).to({scaleX:0.9455,scaleY:0.9455,y:280.95},0).wait(1).to({scaleX:0.951,scaleY:0.951,y:280.9},0).wait(1).to({scaleX:0.9563,scaleY:0.9563,x:446.1,y:280.95},0).wait(1).to({scaleX:0.9614,scaleY:0.9614,x:446.05},0).wait(1).to({scaleX:0.9664,scaleY:0.9664,x:446.1,y:280.9},0).wait(1).to({scaleX:0.9713,scaleY:0.9713,x:446.05,y:280.95},0).wait(1).to({scaleX:0.9761,scaleY:0.9761},0).wait(1).to({scaleX:0.9807,scaleY:0.9807},0).wait(1).to({scaleX:0.9852,scaleY:0.9852},0).wait(1).to({scaleX:0.9896,scaleY:0.9896,y:280.9},0).wait(1).to({scaleX:0.9938,scaleY:0.9938},0).wait(1).to({scaleX:0.9979,scaleY:0.9979},0).wait(1).to({scaleX:1.0018,scaleY:1.0018,y:280.95},0).wait(1).to({scaleX:1.0057,scaleY:1.0057,x:446.1,y:281},0).wait(1).to({scaleX:1.0094,scaleY:1.0094,x:446.05},0).wait(1).to({scaleX:1.0129,scaleY:1.0129,x:446.1},0).wait(1).to({scaleX:1.0163,scaleY:1.0163},0).wait(1).to({scaleX:1.0196,scaleY:1.0196,y:280.95},0).wait(1).to({scaleX:1.0228,scaleY:1.0228},0).wait(1).to({scaleX:1.0258,scaleY:1.0258},0).wait(1).to({scaleX:1.0287,scaleY:1.0287},0).wait(1).to({scaleX:1.0314,scaleY:1.0314,x:446.05,y:281},0).wait(1).to({scaleX:1.034,scaleY:1.034,x:446.1,y:280.95},0).wait(1).to({scaleX:1.0365,scaleY:1.0365},0).wait(1).to({scaleX:1.0389,scaleY:1.0389},0).wait(1).to({scaleX:1.0411,scaleY:1.0411,x:446.05,y:281},0).wait(1).to({scaleX:1.0431,scaleY:1.0431,x:446.1},0).wait(1).to({scaleX:1.0451,scaleY:1.0451,x:446.05,y:280.95},0).wait(1).to({scaleX:1.0469,scaleY:1.0469,y:281},0).wait(1).to({scaleX:1.0486,scaleY:1.0486,y:280.95},0).wait(1).to({scaleX:1.0501,scaleY:1.0501,y:281},0).wait(1).to({scaleX:1.0515,scaleY:1.0515,x:446.1},0).wait(1).to({scaleX:1.0528,scaleY:1.0528,x:446.05,y:280.95},0).wait(1).to({scaleX:1.0539,scaleY:1.0539},0).wait(1).to({scaleX:1.0549,scaleY:1.0549},0).wait(1).to({scaleX:1.0558,scaleY:1.0558,y:281},0).wait(1).to({scaleX:1.0566,scaleY:1.0566,x:446.1,y:280.95},0).wait(1).to({scaleX:1.0572,scaleY:1.0572,x:446.05},0).wait(1).to({scaleX:1.0576,scaleY:1.0576},0).wait(1).to({scaleX:1.058,scaleY:1.058},0).wait(1).to({regX:446.3,regY:280.9,scaleX:1.0582,scaleY:1.0582,x:446.25,y:280.9},0).wait(2).to({regX:446.2,regY:281.1,scaleX:1.0645,scaleY:1.0645,x:446.15,y:281.1,alpha:0.9215},0).wait(1).to({scaleX:1.0705,scaleY:1.0705,x:446.2,y:281.15,alpha:0.8462},0).wait(1).to({scaleX:1.0763,scaleY:1.0763,x:446.15,y:281.1,alpha:0.774},0).wait(1).to({scaleX:1.0819,scaleY:1.0819,x:446.2,alpha:0.7051},0).wait(1).to({scaleX:1.0872,scaleY:1.0872,alpha:0.6394},0).wait(1).to({scaleX:1.0922,scaleY:1.0922,alpha:0.5769},0).wait(1).to({scaleX:1.097,scaleY:1.097,x:446.15,alpha:0.5176},0).wait(1).to({scaleX:1.1015,scaleY:1.1015,x:446.2,alpha:0.4615},0).wait(1).to({scaleX:1.1057,scaleY:1.1057,alpha:0.4087},0).wait(1).to({scaleX:1.1097,scaleY:1.1097,x:446.15,y:281.15,alpha:0.359},0).wait(1).to({scaleX:1.1135,scaleY:1.1135,x:446.2,alpha:0.3125},0).wait(1).to({scaleX:1.117,scaleY:1.117,y:281.1,alpha:0.2692},0).wait(1).to({scaleX:1.1202,scaleY:1.1202,x:446.15,y:281.15,alpha:0.2292},0).wait(1).to({scaleX:1.1231,scaleY:1.1231,y:281.1,alpha:0.1923},0).wait(1).to({scaleX:1.1258,scaleY:1.1258,alpha:0.1587},0).wait(1).to({scaleX:1.1283,scaleY:1.1283,alpha:0.1282},0).wait(1).to({scaleX:1.1305,scaleY:1.1305,y:281.15,alpha:0.101},0).wait(1).to({scaleX:1.1324,scaleY:1.1324,x:446.2,y:281.1,alpha:0.0769},0).wait(1).to({scaleX:1.1341,scaleY:1.1341,y:281.15,alpha:0.0561},0).wait(1).to({scaleX:1.1355,scaleY:1.1355,x:446.15,alpha:0.0385},0).wait(1).to({scaleX:1.1367,scaleY:1.1367,x:446.2,y:281.1,alpha:0.024},0).wait(1).to({scaleX:1.1376,scaleY:1.1376,alpha:0.0128},0).wait(1).to({scaleX:1.1382,scaleY:1.1382,x:446.15,y:281.15,alpha:0.0048},0).wait(1).to({regY:280.9,scaleX:1.1386,scaleY:1.1386,x:446.2,y:280.95,alpha:0},0).to({regX:446.3,scaleX:0.3713,scaleY:0.3713,y:280.9,alpha:1},1).wait(1).to({regX:446.2,regY:281.1,scaleX:0.383,scaleY:0.383,x:446.15,y:280.95},0).wait(1).to({scaleX:0.3946,scaleY:0.3946},0).wait(1).to({scaleX:0.4061,scaleY:0.4061,x:446.1},0).wait(1).to({scaleX:0.4175,scaleY:0.4175,x:446.15},0).wait(1).to({scaleX:0.4288,scaleY:0.4288,x:446.1},0).wait(1).to({scaleX:0.4399,scaleY:0.4399,x:446.15},0).wait(1).to({scaleX:0.4509,scaleY:0.4509,y:281},0).wait(1).to({scaleX:0.4619,scaleY:0.4619},0).wait(1).to({scaleX:0.4726,scaleY:0.4726},0).wait(1).to({scaleX:0.4833,scaleY:0.4833},0).wait(1).to({scaleX:0.4939,scaleY:0.4939,x:446.1,y:281.05},0).wait(1).to({scaleX:0.5043,scaleY:0.5043,y:281},0).wait(1).to({scaleX:0.5146,scaleY:0.5146},0).wait(1).to({scaleX:0.5248,scaleY:0.5248,x:446.15,y:281.05},0).wait(1).to({scaleX:0.5349,scaleY:0.5349,y:281},0).wait(1).to({scaleX:0.5449,scaleY:0.5449,x:446.1},0).wait(1).to({scaleX:0.5547,scaleY:0.5547,y:281.05},0).wait(1).to({scaleX:0.5645,scaleY:0.5645},0).wait(1).to({scaleX:0.5741,scaleY:0.5741,x:446.15},0).wait(1).to({scaleX:0.5836,scaleY:0.5836},0).wait(1).to({scaleX:0.5929,scaleY:0.5929,x:446.1},0).wait(1).to({scaleX:0.6022,scaleY:0.6022,x:446.15,y:281.1},0).wait(1).to({scaleX:0.6113,scaleY:0.6113,x:446.1},0).wait(1).to({scaleX:0.6204,scaleY:0.6204,x:446.15},0).wait(1).to({scaleX:0.6293,scaleY:0.6293,x:446.1},0).wait(1).to({scaleX:0.6381,scaleY:0.6381,x:446.15},0).wait(1).to({scaleX:0.6467,scaleY:0.6467,x:446.1},0).wait(1).to({scaleX:0.6553,scaleY:0.6553,x:446.15},0).wait(1).to({scaleX:0.6637,scaleY:0.6637},0).wait(1).to({scaleX:0.672,scaleY:0.672},0).wait(1).to({scaleX:0.6802,scaleY:0.6802,x:446.1},0).wait(1).to({scaleX:0.6883,scaleY:0.6883,y:281.15},0).wait(1).to({scaleX:0.6963,scaleY:0.6963,y:281.1},0).wait(1).to({scaleX:0.7041,scaleY:0.7041},0).wait(1).to({scaleX:0.7118,scaleY:0.7118,y:281.15},0).wait(1).to({scaleX:0.7194,scaleY:0.7194},0).wait(1).to({scaleX:0.7269,scaleY:0.7269,x:446.15},0).wait(1).to({scaleX:0.7343,scaleY:0.7343},0).wait(1).to({scaleX:0.7415,scaleY:0.7415,x:446.1},0).wait(1).to({scaleX:0.7487,scaleY:0.7487},0).wait(1).to({scaleX:0.7557,scaleY:0.7557,x:446.15},0).wait(1).to({scaleX:0.7626,scaleY:0.7626,x:446.1},0).wait(1).to({scaleX:0.7694,scaleY:0.7694,x:446.15},0).wait(1).to({scaleX:0.776,scaleY:0.776,x:446.1,y:281.2},0).wait(1).to({scaleX:0.7826,scaleY:0.7826,x:446.15},0).wait(1).to({scaleX:0.789,scaleY:0.789,x:446.1},0).wait(1).to({scaleX:0.7953,scaleY:0.7953,y:281.15},0).wait(1).to({scaleX:0.8015,scaleY:0.8015,x:446.15,y:281.2},0).wait(1).to({scaleX:0.8076,scaleY:0.8076,y:281.15},0).wait(1).to({scaleX:0.8135,scaleY:0.8135,y:281.2},0).wait(1).to({scaleX:0.8194,scaleY:0.8194,x:446.1,y:281.15},0).wait(1).to({scaleX:0.8251,scaleY:0.8251,y:281.2},0).wait(1).to({scaleX:0.8307,scaleY:0.8307},0).wait(1).to({scaleX:0.8362,scaleY:0.8362},0).wait(1).to({scaleX:0.8416,scaleY:0.8416,x:446.15},0).wait(1).to({scaleX:0.8468,scaleY:0.8468},0).wait(1).to({scaleX:0.8519,scaleY:0.8519,y:281.25},0).wait(1).to({scaleX:0.8569,scaleY:0.8569,x:446.1},0).wait(1).to({scaleX:0.8618,scaleY:0.8618,x:446.15,y:281.2},0).wait(1).to({scaleX:0.8666,scaleY:0.8666},0).wait(1).to({scaleX:0.8713,scaleY:0.8713,x:446.1},0).wait(1).to({scaleX:0.8758,scaleY:0.8758,x:446.15,y:281.25},0).wait(1).to({scaleX:0.8802,scaleY:0.8802,x:446.1},0).wait(1).to({scaleX:0.8845,scaleY:0.8845,x:446.15},0).wait(1).to({scaleX:0.8887,scaleY:0.8887,y:281.2},0).wait(1).to({scaleX:0.8928,scaleY:0.8928,x:446.1},0).wait(1).to({scaleX:0.8967,scaleY:0.8967,x:446.15},0).wait(1).to({scaleX:0.9006,scaleY:0.9006,y:281.25},0).wait(1).to({scaleX:0.9043,scaleY:0.9043},0).wait(1).to({scaleX:0.9079,scaleY:0.9079},0).wait(1).to({scaleX:0.9114,scaleY:0.9114},0).wait(1).to({scaleX:0.9147,scaleY:0.9147},0).wait(1).to({scaleX:0.918,scaleY:0.918},0).wait(1).to({scaleX:0.9211,scaleY:0.9211},0).wait(1).to({scaleX:0.9241,scaleY:0.9241},0).wait(1).to({scaleX:0.927,scaleY:0.927,x:446.1,y:281.3},0).wait(1).to({scaleX:0.9298,scaleY:0.9298,y:281.25},0).wait(1).to({scaleX:0.9324,scaleY:0.9324,x:446.15},0).wait(1).to({scaleX:0.935,scaleY:0.935},0).wait(1).to({scaleX:0.9374,scaleY:0.9374,x:446.1},0).wait(1).to({scaleX:0.9397,scaleY:0.9397,x:446.15},0).wait(1).to({scaleX:0.9419,scaleY:0.9419,x:446.1},0).wait(1).to({scaleX:0.9439,scaleY:0.9439,y:281.3},0).wait(1).to({scaleX:0.9459,scaleY:0.9459,x:446.15},0).wait(1).to({scaleX:0.9477,scaleY:0.9477,x:446.1,y:281.25},0).wait(1).to({scaleX:0.9494,scaleY:0.9494,y:281.3},0).wait(1).to({scaleX:0.951,scaleY:0.951,x:446.15,y:281.25},0).wait(1).to({scaleX:0.9525,scaleY:0.9525,y:281.3},0).wait(1).to({scaleX:0.9538,scaleY:0.9538,y:281.25},0).wait(1).to({scaleX:0.9551,scaleY:0.9551},0).wait(1).to({scaleX:0.9562,scaleY:0.9562,y:281.3},0).wait(1).to({scaleX:0.9572,scaleY:0.9572,y:281.25},0).wait(1).to({scaleX:0.9581,scaleY:0.9581},0).wait(1).to({scaleX:0.9588,scaleY:0.9588,y:281.3},0).wait(1).to({scaleX:0.9595,scaleY:0.9595,x:446.1,y:281.25},0).wait(1).to({scaleX:0.96,scaleY:0.96},0).wait(1).to({scaleX:0.9604,scaleY:0.9604,x:446.15,y:281.3},0).wait(1).to({scaleX:0.9607,scaleY:0.9607,x:446.1,y:281.25},0).wait(1).to({regX:446.4,regY:281.2,scaleX:0.9609,scaleY:0.9609,x:446.3,y:281.1},0).wait(2).to({regX:446.2,regY:281.1,scaleX:0.9729,scaleY:0.9729,x:446.05,y:281,alpha:0.9215},0).wait(1).to({scaleX:0.9845,scaleY:0.9845,alpha:0.8462},0).wait(1).to({scaleX:0.9955,scaleY:0.9955,alpha:0.774},0).wait(1).to({scaleX:1.0061,scaleY:1.0061,x:446.1,alpha:0.7051},0).wait(1).to({scaleX:1.0161,scaleY:1.0161,y:281.05,alpha:0.6394},0).wait(1).to({scaleX:1.0257,scaleY:1.0257,y:281,alpha:0.5769},0).wait(1).to({scaleX:1.0348,scaleY:1.0348,y:281.05,alpha:0.5176},0).wait(1).to({scaleX:1.0434,scaleY:1.0434,y:281,alpha:0.4615},0).wait(1).to({scaleX:1.0515,scaleY:1.0515,x:446.05,alpha:0.4087},0).wait(1).to({scaleX:1.0591,scaleY:1.0591,x:446.1,alpha:0.359},0).wait(1).to({scaleX:1.0662,scaleY:1.0662,alpha:0.3125},0).wait(1).to({scaleX:1.0728,scaleY:1.0728,y:280.95,alpha:0.2692},0).wait(1).to({scaleX:1.079,scaleY:1.079,y:281,alpha:0.2292},0).wait(1).to({scaleX:1.0846,scaleY:1.0846,x:446.05,alpha:0.1923},0).wait(1).to({scaleX:1.0898,scaleY:1.0898,alpha:0.1587},0).wait(1).to({scaleX:1.0944,scaleY:1.0944,x:446.1,alpha:0.1282},0).wait(1).to({scaleX:1.0986,scaleY:1.0986,y:280.95,alpha:0.101},0).wait(1).to({scaleX:1.1023,scaleY:1.1023,y:281,alpha:0.0769},0).wait(1).to({scaleX:1.1055,scaleY:1.1055,x:446.05,alpha:0.0561},0).wait(1).to({scaleX:1.1082,scaleY:1.1082,y:280.95,alpha:0.0385},0).wait(1).to({scaleX:1.1104,scaleY:1.1104,y:281,alpha:0.024},0).wait(1).to({scaleX:1.1121,scaleY:1.1121,y:280.95,alpha:0.0128},0).wait(1).to({scaleX:1.1133,scaleY:1.1133,alpha:0.0048},0).wait(1).to({regX:446.3,scaleX:1.1141,scaleY:1.1141,x:446.2,y:281.05,alpha:0},0).to({regX:446.4,scaleX:0.4556,scaleY:0.4556,x:446.15,y:281,alpha:1},1).wait(1).to({regX:446.2,scaleX:0.4669,scaleY:0.4669,x:446.05},0).wait(1).to({scaleX:0.4782,scaleY:0.4782,y:280.95},0).wait(1).to({scaleX:0.4893,scaleY:0.4893,x:446,y:281},0).wait(1).to({scaleX:0.5003,scaleY:0.5003,x:446.05},0).wait(1).to({scaleX:0.5112,scaleY:0.5112,x:446},0).wait(1).to({scaleX:0.522,scaleY:0.522},0).wait(1).to({scaleX:0.5327,scaleY:0.5327,x:446.05},0).wait(1).to({scaleX:0.5432,scaleY:0.5432,x:446},0).wait(1).to({scaleX:0.5537,scaleY:0.5537},0).wait(1).to({scaleX:0.564,scaleY:0.564},0).wait(1).to({scaleX:0.5742,scaleY:0.5742,y:280.95},0).wait(1).to({scaleX:0.5843,scaleY:0.5843},0).wait(1).to({scaleX:0.5943,scaleY:0.5943},0).wait(1).to({scaleX:0.6042,scaleY:0.6042,y:281},0).wait(1).to({scaleX:0.614,scaleY:0.614},0).wait(1).to({scaleX:0.6236,scaleY:0.6236,x:445.95},0).wait(1).to({scaleX:0.6331,scaleY:0.6331,y:280.95},0).wait(1).to({scaleX:0.6426,scaleY:0.6426},0).wait(1).to({scaleX:0.6519,scaleY:0.6519,y:281},0).wait(1).to({scaleX:0.6611,scaleY:0.6611,y:280.95},0).wait(1).to({scaleX:0.6701,scaleY:0.6701},0).wait(1).to({scaleX:0.6791,scaleY:0.6791,y:281},0).wait(1).to({scaleX:0.6879,scaleY:0.6879},0).wait(1).to({scaleX:0.6967,scaleY:0.6967},0).wait(1).to({scaleX:0.7053,scaleY:0.7053,y:280.95},0).wait(1).to({scaleX:0.7138,scaleY:0.7138,y:281},0).wait(1).to({scaleX:0.7222,scaleY:0.7222,y:280.95},0).wait(1).to({scaleX:0.7305,scaleY:0.7305,y:281},0).wait(1).to({scaleX:0.7386,scaleY:0.7386,x:445.9},0).wait(1).to({scaleX:0.7467,scaleY:0.7467},0).wait(1).to({scaleX:0.7546,scaleY:0.7546,y:280.95},0).wait(1).to({scaleX:0.7624,scaleY:0.7624},0).wait(1).to({scaleX:0.7701,scaleY:0.7701,x:445.95,y:281},0).wait(1).to({scaleX:0.7777,scaleY:0.7777,x:445.9,y:280.95},0).wait(1).to({scaleX:0.7852,scaleY:0.7852},0).wait(1).to({scaleX:0.7926,scaleY:0.7926,y:281},0).wait(1).to({scaleX:0.7998,scaleY:0.7998},0).wait(1).to({scaleX:0.8069,scaleY:0.8069},0).wait(1).to({scaleX:0.814,scaleY:0.814,y:280.95},0).wait(1).to({scaleX:0.8209,scaleY:0.8209,x:445.85,y:281},0).wait(1).to({scaleX:0.8277,scaleY:0.8277,x:445.9,y:280.95},0).wait(1).to({scaleX:0.8343,scaleY:0.8343,y:281},0).wait(1).to({scaleX:0.8409,scaleY:0.8409,x:445.85},0).wait(1).to({scaleX:0.8474,scaleY:0.8474,x:445.9},0).wait(1).to({scaleX:0.8537,scaleY:0.8537,x:445.85,y:280.95},0).wait(1).to({scaleX:0.8599,scaleY:0.8599,x:445.9},0).wait(1).to({scaleX:0.866,scaleY:0.866,x:445.85,y:281},0).wait(1).to({scaleX:0.872,scaleY:0.872,x:445.9,y:280.95},0).wait(1).to({scaleX:0.8779,scaleY:0.8779,x:445.85},0).wait(1).to({scaleX:0.8837,scaleY:0.8837,x:445.9},0).wait(1).to({scaleX:0.8893,scaleY:0.8893,x:445.85,y:281},0).wait(1).to({scaleX:0.8949,scaleY:0.8949,x:445.9},0).wait(1).to({scaleX:0.9003,scaleY:0.9003,x:445.85,y:280.95},0).wait(1).to({scaleX:0.9056,scaleY:0.9056},0).wait(1).to({scaleX:0.9108,scaleY:0.9108},0).wait(1).to({scaleX:0.9159,scaleY:0.9159},0).wait(1).to({scaleX:0.9208,scaleY:0.9208,y:281},0).wait(1).to({scaleX:0.9257,scaleY:0.9257,y:280.95},0).wait(1).to({scaleX:0.9304,scaleY:0.9304,y:281},0).wait(1).to({scaleX:0.935,scaleY:0.935},0).wait(1).to({scaleX:0.9395,scaleY:0.9395,x:445.8,y:280.95},0).wait(1).to({scaleX:0.9439,scaleY:0.9439,x:445.85,y:281},0).wait(1).to({scaleX:0.9482,scaleY:0.9482},0).wait(1).to({scaleX:0.9524,scaleY:0.9524,y:280.95},0).wait(1).to({scaleX:0.9564,scaleY:0.9564,x:445.8},0).wait(1).to({scaleX:0.9604,scaleY:0.9604},0).wait(1).to({scaleX:0.9642,scaleY:0.9642,x:445.85,y:281},0).wait(1).to({scaleX:0.9679,scaleY:0.9679},0).wait(1).to({scaleX:0.9715,scaleY:0.9715},0).wait(1).to({scaleX:0.975,scaleY:0.975,y:280.95},0).wait(1).to({scaleX:0.9784,scaleY:0.9784},0).wait(1).to({scaleX:0.9816,scaleY:0.9816,y:281},0).wait(1).to({scaleX:0.9848,scaleY:0.9848,y:280.95},0).wait(1).to({scaleX:0.9878,scaleY:0.9878},0).wait(1).to({scaleX:0.9907,scaleY:0.9907,y:281},0).wait(1).to({scaleX:0.9935,scaleY:0.9935,y:280.95},0).wait(1).to({scaleX:0.9962,scaleY:0.9962},0).wait(1).to({scaleX:0.9987,scaleY:0.9987},0).wait(1).to({scaleX:1.0012,scaleY:1.0012,x:445.9,y:281.05},0).wait(1).to({scaleX:1.0035,scaleY:1.0035,x:445.85},0).wait(1).to({scaleX:1.0058,scaleY:1.0058,y:281},0).wait(1).to({scaleX:1.0079,scaleY:1.0079},0).wait(1).to({scaleX:1.0099,scaleY:1.0099},0).wait(1).to({scaleX:1.0118,scaleY:1.0118},0).wait(1).to({scaleX:1.0135,scaleY:1.0135,x:445.9},0).wait(1).to({scaleX:1.0152,scaleY:1.0152,x:445.85},0).wait(1).to({scaleX:1.0167,scaleY:1.0167},0).wait(1).to({scaleX:1.0181,scaleY:1.0181},0).wait(1).to({scaleX:1.0195,scaleY:1.0195,x:445.9},0).wait(1).to({scaleX:1.0207,scaleY:1.0207,x:445.85},0).wait(1).to({scaleX:1.0217,scaleY:1.0217},0).wait(1).to({scaleX:1.0227,scaleY:1.0227,x:445.9,y:281.05},0).wait(1).to({scaleX:1.0236,scaleY:1.0236,x:445.85,y:281},0).wait(1).to({scaleX:1.0243,scaleY:1.0243,y:281.05},0).wait(1).to({scaleX:1.0249,scaleY:1.0249,x:445.9,y:281},0).wait(1).to({scaleX:1.0254,scaleY:1.0254,x:445.85},0).wait(1).to({scaleX:1.0258,scaleY:1.0258},0).wait(1).to({scaleX:1.0261,scaleY:1.0261},0).wait(1).to({regY:281,scaleX:1.0263,scaleY:1.0263,x:446,y:280.95},0).wait(2).to({regY:281.1,scaleX:1.0383,scaleY:1.0383,y:281.05,alpha:0.9224},0).wait(1).to({scaleX:1.0499,scaleY:1.0499,alpha:0.848},0).wait(1).to({scaleX:1.0609,scaleY:1.0609,alpha:0.7767},0).wait(1).to({scaleX:1.0714,scaleY:1.0714,x:446.05,y:281.1,alpha:0.7086},0).wait(1).to({scaleX:1.0815,scaleY:1.0815,x:446,y:281.05,alpha:0.6436},0).wait(1).to({scaleX:1.0911,scaleY:1.0911,x:446.05,alpha:0.5819},0).wait(1).to({scaleX:1.1001,scaleY:1.1001,alpha:0.5233},0).wait(1).to({scaleX:1.1087,scaleY:1.1087,x:446,alpha:0.4678},0).wait(1).to({scaleX:1.1168,scaleY:1.1168,x:446.05,alpha:0.4156},0).wait(1).to({scaleX:1.1244,scaleY:1.1244,x:446,y:281,alpha:0.3665},0).wait(1).to({scaleX:1.1315,scaleY:1.1315,x:446.05,alpha:0.3206},0).wait(1).to({scaleX:1.1382,scaleY:1.1382,y:281.05,alpha:0.2778},0).wait(1).to({scaleX:1.1443,scaleY:1.1443,alpha:0.2382},0).wait(1).to({scaleX:1.1499,scaleY:1.1499,alpha:0.2018},0).wait(1).to({scaleX:1.1551,scaleY:1.1551,alpha:0.1685},0).wait(1).to({scaleX:1.1598,scaleY:1.1598,alpha:0.1384},0).wait(1).to({scaleX:1.1639,scaleY:1.1639,alpha:0.1115},0).wait(1).to({scaleX:1.1676,scaleY:1.1676,alpha:0.0877},0).wait(1).to({scaleX:1.1708,scaleY:1.1708,alpha:0.0672},0).wait(1).to({scaleX:1.1735,scaleY:1.1735,y:281,alpha:0.0497},0).wait(1).to({scaleX:1.1757,scaleY:1.1757,y:281.05,alpha:0.0355},0).wait(1).to({scaleX:1.1774,scaleY:1.1774,y:281,alpha:0.0244},0).wait(1).to({scaleX:1.1786,scaleY:1.1786,alpha:0.0165},0).wait(1).to({regY:280.9,scaleX:1.1794,scaleY:1.1794,y:280.85,alpha:0.0117},0).to({regX:446.3,regY:281,scaleX:0.3409,scaleY:0.3409,x:446.1,y:280.9,alpha:1},1).wait(1).to({regX:446.2,regY:281.1,scaleX:0.3552,scaleY:0.3552,x:446},0).wait(1).to({scaleX:0.3693,scaleY:0.3693},0).wait(1).to({scaleX:0.3832,scaleY:0.3832,x:446.05},0).wait(1).to({scaleX:0.397,scaleY:0.397,x:446},0).wait(1).to({scaleX:0.4107,scaleY:0.4107},0).wait(1).to({scaleX:0.4242,scaleY:0.4242},0).wait(1).to({scaleX:0.4376,scaleY:0.4376},0).wait(1).to({scaleX:0.4508,scaleY:0.4508,x:445.95},0).wait(1).to({scaleX:0.4639,scaleY:0.4639},0).wait(1).to({scaleX:0.4769,scaleY:0.4769,x:446},0).wait(1).to({scaleX:0.4897,scaleY:0.4897,x:445.95},0).wait(1).to({scaleX:0.5024,scaleY:0.5024,y:280.85},0).wait(1).to({scaleX:0.5149,scaleY:0.5149,y:280.9},0).wait(1).to({scaleX:0.5273,scaleY:0.5273,y:280.85},0).wait(1).to({scaleX:0.5395,scaleY:0.5395},0).wait(1).to({scaleX:0.5516,scaleY:0.5516},0).wait(1).to({scaleX:0.5636,scaleY:0.5636,x:445.9},0).wait(1).to({scaleX:0.5754,scaleY:0.5754,x:445.95,y:280.9},0).wait(1).to({scaleX:0.5871,scaleY:0.5871,y:280.85},0).wait(1).to({scaleX:0.5986,scaleY:0.5986},0).wait(1).to({scaleX:0.61,scaleY:0.61,x:445.9},0).wait(1).to({scaleX:0.6212,scaleY:0.6212},0).wait(1).to({scaleX:0.6323,scaleY:0.6323,y:280.9},0).wait(1).to({scaleX:0.6432,scaleY:0.6432,y:280.85},0).wait(1).to({scaleX:0.654,scaleY:0.654},0).wait(1).to({scaleX:0.6647,scaleY:0.6647},0).wait(1).to({scaleX:0.6752,scaleY:0.6752},0).wait(1).to({scaleX:0.6856,scaleY:0.6856,x:445.85},0).wait(1).to({scaleX:0.6958,scaleY:0.6958,x:445.9},0).wait(1);
	this.timeline.addTween(_tweenStr_2.to({scaleX:0.7059,scaleY:0.7059},0).wait(1).to({scaleX:0.7159,scaleY:0.7159,y:280.9},0).wait(1).to({scaleX:0.7257,scaleY:0.7257,x:445.85,y:280.85},0).wait(1).to({scaleX:0.7354,scaleY:0.7354},0).wait(1).to({scaleX:0.7449,scaleY:0.7449},0).wait(1).to({scaleX:0.7543,scaleY:0.7543},0).wait(1).to({scaleX:0.7635,scaleY:0.7635},0).wait(1).to({scaleX:0.7726,scaleY:0.7726,x:445.8},0).wait(1).to({scaleX:0.7815,scaleY:0.7815},0).wait(1).to({scaleX:0.7903,scaleY:0.7903,x:445.85},0).wait(1).to({scaleX:0.799,scaleY:0.799,x:445.8},0).wait(1).to({scaleX:0.8075,scaleY:0.8075},0).wait(1).to({scaleX:0.8159,scaleY:0.8159},0).wait(1).to({scaleX:0.8241,scaleY:0.8241},0).wait(1).to({scaleX:0.8322,scaleY:0.8322},0).wait(1).to({scaleX:0.8401,scaleY:0.8401},0).wait(1).to({scaleX:0.8479,scaleY:0.8479},0).wait(1).to({scaleX:0.8556,scaleY:0.8556},0).wait(1).to({scaleX:0.8631,scaleY:0.8631,x:445.75,y:280.8},0).wait(1).to({scaleX:0.8705,scaleY:0.8705,x:445.8,y:280.85},0).wait(1).to({scaleX:0.8777,scaleY:0.8777},0).wait(1).to({scaleX:0.8848,scaleY:0.8848,y:280.8},0).wait(1).to({scaleX:0.8917,scaleY:0.8917},0).wait(1).to({scaleX:0.8985,scaleY:0.8985,y:280.85},0).wait(1).to({scaleX:0.9052,scaleY:0.9052},0).wait(1).to({scaleX:0.9117,scaleY:0.9117,x:445.75},0).wait(1).to({scaleX:0.9181,scaleY:0.9181,y:280.8},0).wait(1).to({scaleX:0.9243,scaleY:0.9243},0).wait(1).to({scaleX:0.9304,scaleY:0.9304,y:280.85},0).wait(1).to({scaleX:0.9363,scaleY:0.9363},0).wait(1).to({scaleX:0.9421,scaleY:0.9421,x:445.8},0).wait(1).to({scaleX:0.9478,scaleY:0.9478,x:445.75,y:280.8},0).wait(1).to({scaleX:0.9533,scaleY:0.9533},0).wait(1).to({scaleX:0.9587,scaleY:0.9587,y:280.85},0).wait(1).to({scaleX:0.9639,scaleY:0.9639},0).wait(1).to({scaleX:0.969,scaleY:0.969},0).wait(1).to({scaleX:0.9739,scaleY:0.9739,y:280.8},0).wait(1).to({scaleX:0.9787,scaleY:0.9787},0).wait(1).to({scaleX:0.9834,scaleY:0.9834,x:445.7},0).wait(1).to({scaleX:0.9879,scaleY:0.9879,x:445.75,y:280.85},0).wait(1).to({scaleX:0.9922,scaleY:0.9922,y:280.8},0).wait(1).to({scaleX:0.9965,scaleY:0.9965,x:445.7},0).wait(1).to({scaleX:1.0005,scaleY:1.0005,x:445.8,y:280.9},0).wait(1).to({scaleX:1.0045,scaleY:1.0045,y:280.85},0).wait(1).to({scaleX:1.0083,scaleY:1.0083},0).wait(1).to({scaleX:1.0119,scaleY:1.0119,x:445.75,y:280.9},0).wait(1).to({scaleX:1.0154,scaleY:1.0154,x:445.8},0).wait(1).to({scaleX:1.0188,scaleY:1.0188},0).wait(1).to({scaleX:1.022,scaleY:1.022,x:445.75},0).wait(1).to({scaleX:1.0251,scaleY:1.0251,x:445.8,y:280.85},0).wait(1).to({scaleX:1.028,scaleY:1.028,x:445.75,y:280.9},0).wait(1).to({scaleX:1.0308,scaleY:1.0308,y:280.85},0).wait(1).to({scaleX:1.0335,scaleY:1.0335},0).wait(1).to({scaleX:1.036,scaleY:1.036},0).wait(1).to({scaleX:1.0383,scaleY:1.0383},0).wait(1).to({scaleX:1.0405,scaleY:1.0405,y:280.9},0).wait(1).to({scaleX:1.0426,scaleY:1.0426},0).wait(1).to({scaleX:1.0446,scaleY:1.0446,y:280.85},0).wait(1).to({scaleX:1.0463,scaleY:1.0463,x:445.8,y:280.9},0).wait(1).to({scaleX:1.048,scaleY:1.048,x:445.75},0).wait(1).to({scaleX:1.0495,scaleY:1.0495,x:445.8,y:280.85},0).wait(1).to({scaleX:1.0509,scaleY:1.0509,x:445.75,y:280.9},0).wait(1).to({scaleX:1.0521,scaleY:1.0521},0).wait(1).to({scaleX:1.0531,scaleY:1.0531},0).wait(1).to({scaleX:1.0541,scaleY:1.0541,y:280.85},0).wait(1).to({scaleX:1.0549,scaleY:1.0549,x:445.8},0).wait(1).to({scaleX:1.0555,scaleY:1.0555,x:445.75},0).wait(1).to({scaleX:1.056,scaleY:1.056,y:280.9},0).wait(1).to({scaleX:1.0564,scaleY:1.0564},0).wait(1).to({regX:446.1,regY:280.9,scaleX:1.0566,scaleY:1.0566,x:445.9,y:280.8},0).wait(2).to({regX:446.2,regY:281.1,scaleX:1.0686,scaleY:1.0686,x:446,y:281.05,alpha:0.9215},0).wait(1).to({scaleX:1.0801,scaleY:1.0801,alpha:0.8462},0).wait(1).to({scaleX:1.0912,scaleY:1.0912,x:446.05,alpha:0.774},0).wait(1).to({scaleX:1.1017,scaleY:1.1017,x:446,alpha:0.7051},0).wait(1).to({scaleX:1.1118,scaleY:1.1118,x:446.05,alpha:0.6394},0).wait(1).to({scaleX:1.1214,scaleY:1.1214,x:446,y:281,alpha:0.5769},0).wait(1).to({scaleX:1.1305,scaleY:1.1305,alpha:0.5176},0).wait(1).to({scaleX:1.1391,scaleY:1.1391,y:281.05,alpha:0.4615},0).wait(1).to({scaleX:1.1472,scaleY:1.1472,y:281,alpha:0.4087},0).wait(1).to({scaleX:1.1548,scaleY:1.1548,alpha:0.359},0).wait(1).to({scaleX:1.1619,scaleY:1.1619,x:446.05,alpha:0.3125},0).wait(1).to({scaleX:1.1685,scaleY:1.1685,x:446,alpha:0.2692},0).wait(1).to({scaleX:1.1746,scaleY:1.1746,y:281.05,alpha:0.2292},0).wait(1).to({scaleX:1.1803,scaleY:1.1803,alpha:0.1923},0).wait(1).to({scaleX:1.1854,scaleY:1.1854,alpha:0.1587},0).wait(1).to({scaleX:1.1901,scaleY:1.1901,x:446.05,alpha:0.1282},0).wait(1).to({scaleX:1.1943,scaleY:1.1943,x:446,y:281,alpha:0.101},0).wait(1).to({scaleX:1.198,scaleY:1.198,y:281.05,alpha:0.0769},0).wait(1).to({scaleX:1.2012,scaleY:1.2012,alpha:0.0561},0).wait(1).to({scaleX:1.2039,scaleY:1.2039,y:281,alpha:0.0385},0).wait(1).to({scaleX:1.2061,scaleY:1.2061,alpha:0.024},0).wait(1).to({scaleX:1.2078,scaleY:1.2078,alpha:0.0128},0).wait(1).to({scaleX:1.209,scaleY:1.209,alpha:0.0048},0).wait(1).to({regX:446,regY:280.8,scaleX:1.2097,scaleY:1.2097,x:445.8,y:280.7,alpha:0},0).to({regY:280.9,scaleX:0.3948,scaleY:0.3948,x:445.75},1).wait(1).to({regX:446.2,regY:281.1,scaleX:0.4077,scaleY:0.4077,x:445.8,y:280.75,alpha:0.0199},0).wait(1).to({scaleX:0.4205,scaleY:0.4205,y:280.8,alpha:0.0396},0).wait(1).to({scaleX:0.4331,scaleY:0.4331,alpha:0.0591},0).wait(1).to({scaleX:0.4455,scaleY:0.4455,alpha:0.0784},0).wait(1).to({scaleX:0.4579,scaleY:0.4579,y:280.75,alpha:0.0975},0).wait(1).to({scaleX:0.4701,scaleY:0.4701,alpha:0.1164},0).wait(1).to({scaleX:0.4822,scaleY:0.4822,alpha:0.1351},0).wait(1).to({scaleX:0.4942,scaleY:0.4942,alpha:0.1536},0).wait(1).to({scaleX:0.506,scaleY:0.506,y:280.8,alpha:0.1719},0).wait(1).to({scaleX:0.5177,scaleY:0.5177,alpha:0.19},0).wait(1).to({scaleX:0.5293,scaleY:0.5293,x:445.85,alpha:0.2079},0).wait(1).to({scaleX:0.5408,scaleY:0.5408,x:445.8,alpha:0.2256},0).wait(1).to({scaleX:0.5521,scaleY:0.5521,alpha:0.2431},0).wait(1).to({scaleX:0.5633,scaleY:0.5633,x:445.85,alpha:0.2604},0).wait(1).to({scaleX:0.5743,scaleY:0.5743,x:445.8,alpha:0.2775},0).wait(1).to({scaleX:0.5853,scaleY:0.5853,alpha:0.2944},0).wait(1).to({scaleX:0.5961,scaleY:0.5961,alpha:0.3111},0).wait(1).to({scaleX:0.6067,scaleY:0.6067,x:445.85,alpha:0.3276},0).wait(1).to({scaleX:0.6173,scaleY:0.6173,alpha:0.3439},0).wait(1).to({scaleX:0.6277,scaleY:0.6277,alpha:0.36},0).wait(1).to({scaleX:0.638,scaleY:0.638,x:445.8,alpha:0.3759},0).wait(1).to({scaleX:0.6481,scaleY:0.6481,alpha:0.3916},0).wait(1).to({scaleX:0.6582,scaleY:0.6582,alpha:0.4071},0).wait(1).to({scaleX:0.6681,scaleY:0.6681,x:445.85,alpha:0.4224},0).wait(1).to({scaleX:0.6778,scaleY:0.6778,x:445.8,alpha:0.4375},0).wait(1).to({scaleX:0.6875,scaleY:0.6875,alpha:0.4524},0).wait(1).to({scaleX:0.697,scaleY:0.697,x:445.85,alpha:0.4671},0).wait(1).to({scaleX:0.7064,scaleY:0.7064,alpha:0.4816},0).wait(1).to({scaleX:0.7156,scaleY:0.7156,x:445.8,alpha:0.4959},0).wait(1).to({scaleX:0.7247,scaleY:0.7247,x:445.85,alpha:0.5101},0).wait(1).to({scaleX:0.7337,scaleY:0.7337,alpha:0.524},0).wait(1).to({scaleX:0.7426,scaleY:0.7426,y:280.85,alpha:0.5377},0).wait(1).to({scaleX:0.7513,scaleY:0.7513,alpha:0.5512},0).wait(1).to({scaleX:0.7599,scaleY:0.7599,y:280.8,alpha:0.5645},0).wait(1).to({scaleX:0.7684,scaleY:0.7684,x:445.8,y:280.85,alpha:0.5776},0).wait(1).to({scaleX:0.7767,scaleY:0.7767,x:445.85,alpha:0.5905},0).wait(1).to({scaleX:0.785,scaleY:0.785,alpha:0.6032},0).wait(1).to({scaleX:0.793,scaleY:0.793,x:445.8,y:280.8,alpha:0.6157},0).wait(1).to({scaleX:0.801,scaleY:0.801,alpha:0.628},0).wait(1).to({scaleX:0.8088,scaleY:0.8088,x:445.85,alpha:0.6401},0).wait(1).to({scaleX:0.8165,scaleY:0.8165,alpha:0.652},0).wait(1).to({scaleX:0.8241,scaleY:0.8241,x:445.8,y:280.85,alpha:0.6637},0).wait(1).to({scaleX:0.8315,scaleY:0.8315,x:445.85,alpha:0.6752},0).wait(1).to({scaleX:0.8388,scaleY:0.8388,alpha:0.6865},0).wait(1).to({scaleX:0.846,scaleY:0.846,alpha:0.6976},0).wait(1).to({scaleX:0.8531,scaleY:0.8531,alpha:0.7085},0).wait(1).to({scaleX:0.86,scaleY:0.86,alpha:0.7192},0).wait(1).to({scaleX:0.8668,scaleY:0.8668,x:445.8,alpha:0.7297},0).wait(1).to({scaleX:0.8734,scaleY:0.8734,x:445.85,y:280.8,alpha:0.74},0).wait(1).to({scaleX:0.88,scaleY:0.88,y:280.85,alpha:0.7501},0).wait(1).to({scaleX:0.8864,scaleY:0.8864,alpha:0.76},0).wait(1).to({scaleX:0.8927,scaleY:0.8927,alpha:0.7697},0).wait(1).to({scaleX:0.8988,scaleY:0.8988,alpha:0.7792},0).wait(1).to({scaleX:0.9048,scaleY:0.9048,alpha:0.7885},0).wait(1).to({scaleX:0.9107,scaleY:0.9107,alpha:0.7976},0).wait(1).to({scaleX:0.9165,scaleY:0.9165,x:445.8,alpha:0.8065},0).wait(1).to({scaleX:0.9221,scaleY:0.9221,x:445.85,alpha:0.8152},0).wait(1).to({scaleX:0.9276,scaleY:0.9276,alpha:0.8237},0).wait(1).to({scaleX:0.933,scaleY:0.933,alpha:0.832},0).wait(1).to({scaleX:0.9382,scaleY:0.9382,x:445.8,alpha:0.8401},0).wait(1).to({scaleX:0.9433,scaleY:0.9433,x:445.85,alpha:0.848},0).wait(1).to({scaleX:0.9483,scaleY:0.9483,x:445.8,alpha:0.8557},0).wait(1).to({scaleX:0.9531,scaleY:0.9531,x:445.85,alpha:0.8632},0).wait(1).to({scaleX:0.9579,scaleY:0.9579,alpha:0.8705},0).wait(1).to({scaleX:0.9625,scaleY:0.9625,alpha:0.8776},0).wait(1).to({scaleX:0.9669,scaleY:0.9669,alpha:0.8845},0).wait(1).to({scaleX:0.9712,scaleY:0.9712,x:445.8,alpha:0.8912},0).wait(1).to({scaleX:0.9755,scaleY:0.9755,x:445.85,alpha:0.8977},0).wait(1).to({scaleX:0.9795,scaleY:0.9795,x:445.8,alpha:0.904},0).wait(1).to({scaleX:0.9835,scaleY:0.9835,alpha:0.9101},0).wait(1).to({scaleX:0.9873,scaleY:0.9873,x:445.85,y:280.9,alpha:0.916},0).wait(1).to({scaleX:0.991,scaleY:0.991,x:445.8,y:280.85,alpha:0.9217},0).wait(1).to({scaleX:0.9945,scaleY:0.9945,x:445.85,alpha:0.9272},0).wait(1).to({scaleX:0.998,scaleY:0.998,y:280.9,alpha:0.9325},0).wait(1).to({scaleX:1.0013,scaleY:1.0013,x:445.9,alpha:0.9376},0).wait(1).to({scaleX:1.0044,scaleY:1.0044,x:445.85,alpha:0.9425},0).wait(1).to({scaleX:1.0075,scaleY:1.0075,x:445.9,alpha:0.9472},0).wait(1).to({scaleX:1.0104,scaleY:1.0104,alpha:0.9517},0).wait(1).to({scaleX:1.0132,scaleY:1.0132,x:445.85,alpha:0.956},0).wait(1).to({scaleX:1.0158,scaleY:1.0158,x:445.9,alpha:0.9601},0).wait(1).to({scaleX:1.0183,scaleY:1.0183,alpha:0.964},0).wait(1).to({scaleX:1.0207,scaleY:1.0207,alpha:0.9677},0).wait(1).to({scaleX:1.023,scaleY:1.023,alpha:0.9712},0).wait(1).to({scaleX:1.0251,scaleY:1.0251,alpha:0.9745},0).wait(1).to({scaleX:1.0271,scaleY:1.0271,y:280.95,alpha:0.9776},0).wait(1).to({scaleX:1.029,scaleY:1.029,y:280.9,alpha:0.9805},0).wait(1).to({scaleX:1.0308,scaleY:1.0308,x:445.85,y:280.95,alpha:0.9832},0).wait(1).to({scaleX:1.0324,scaleY:1.0324,x:445.9,y:280.9,alpha:0.9857},0).wait(1).to({scaleX:1.0339,scaleY:1.0339,alpha:0.988},0).wait(1).to({scaleX:1.0352,scaleY:1.0352,alpha:0.9901},0).wait(1).to({scaleX:1.0365,scaleY:1.0365,y:280.95,alpha:0.992},0).wait(1).to({scaleX:1.0376,scaleY:1.0376,y:280.9,alpha:0.9937},0).wait(1).to({scaleX:1.0385,scaleY:1.0385,y:280.95,alpha:0.9952},0).wait(1).to({scaleX:1.0394,scaleY:1.0394,y:280.9,alpha:0.9965},0).wait(1).to({scaleX:1.0401,scaleY:1.0401,alpha:0.9976},0).wait(1).to({scaleX:1.0407,scaleY:1.0407,y:280.95,alpha:0.9985},0).wait(1).to({scaleX:1.0411,scaleY:1.0411,y:280.9,alpha:0.9992},0).wait(1).to({scaleX:1.0414,scaleY:1.0414,y:280.95,alpha:0.9997},0).wait(1).to({regX:445.9,regY:280.8,scaleX:1.0416,scaleY:1.0416,x:445.65,y:280.65,alpha:1},0).wait(2).to({regX:446.2,regY:281.1,scaleX:1.0569,scaleY:1.0569,x:446,y:280.95},0).wait(1).to({scaleX:1.0716,scaleY:1.0716,y:281},0).wait(1).to({scaleX:1.0857,scaleY:1.0857},0).wait(1).to({scaleX:1.0991,scaleY:1.0991},0).wait(1).to({scaleX:1.1119,scaleY:1.1119},0).wait(1).to({scaleX:1.1241,scaleY:1.1241},0).wait(1).to({scaleX:1.1357,scaleY:1.1357},0).wait(1).to({scaleX:1.1466,scaleY:1.1466,x:445.95},0).wait(1).to({scaleX:1.1569,scaleY:1.1569,x:446},0).wait(1).to({scaleX:1.1666,scaleY:1.1666},0).wait(1).to({scaleX:1.1757,scaleY:1.1757,y:281.05},0).wait(1).to({scaleX:1.1841,scaleY:1.1841,y:281},0).wait(1).to({scaleX:1.1919,scaleY:1.1919},0).wait(1).to({scaleX:1.1991,scaleY:1.1991},0).wait(1).to({scaleX:1.2057,scaleY:1.2057},0).wait(1).to({scaleX:1.2116,scaleY:1.2116,y:281.05},0).wait(1).to({scaleX:1.2169,scaleY:1.2169},0).wait(1).to({scaleX:1.2216,scaleY:1.2216},0).wait(1).to({scaleX:1.2257,scaleY:1.2257},0).wait(1).to({scaleX:1.2291,scaleY:1.2291,y:281},0).wait(1).to({scaleX:1.2319,scaleY:1.2319,y:281.05},0).wait(1).to({scaleX:1.2341,scaleY:1.2341,x:445.95,y:281},0).wait(1).to({scaleX:1.2357,scaleY:1.2357,y:281.05},0).wait(1).to({regX:445.8,regY:280.8,scaleX:1.2366,scaleY:1.2366,x:445.6,y:280.7},0).to({_off:true},1).wait(98));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-105.7,-66.5,1103.7,695.1);


(lib.rudra2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_486();
	this.instance.setTransform(8.5,69.3,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_485();
	this.instance_1.setTransform(37.35,118.45,0.5,0.5);

	this.instance_2 = new lib.Group_2();
	this.instance_2.setTransform(96.3,167.15,1,1,0,0,0,60.6,60.6);
	this.instance_2.alpha = 0.1484;

	this.instance_3 = new lib.CachedBmp_484();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.rudra2, new cjs.Rectangle(0,0,192.5,334.5), null);


(lib.rudra1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween7("synched",0);
	this.instance.setTransform(0,984.7);
	this.instance._off = true;

	this.instance_1 = new lib.Tween8("synched",0);
	this.instance_1.setTransform(0,155.3);

	this.instance_2 = new lib.CachedBmp_483();
	this.instance_2.setTransform(41.35,277.6,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_482();
	this.instance_3.setTransform(11.75,12.9,0.5,0.5);

	this.instance_4 = new lib.rudra();
	this.instance_4.setTransform(1.45,178.95,0.3391,0.3391,-45.1349);

	this.instance_5 = new lib.CachedBmp_481();
	this.instance_5.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},24).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]},1).wait(575));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(24).to({_off:false},0).to({_off:true,y:155.3},5,cjs.Ease.get(1)).wait(576));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.7,-11.9,212.1,1163.9);


(lib.rings = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// rings
	this.eings2 = new lib.Tween17();
	this.eings2.name = "eings2";
	this.eings2.setTransform(1,-0.25,0.3326,0.3326);
	this.eings2.alpha = 0.9414;

	this.timeline.addTween(cjs.Tween.get(this.eings2).to({scaleX:1,scaleY:1,rotation:1440,alpha:1,mode:"synched",startPosition:0},213).to({rotation:2880},200).wait(1).to({startPosition:0},0).to({rotation:4320},200).wait(1).to({startPosition:0},0).to({rotation:5760},199).to({rotation:7200},185).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-495.3,-496.5,992.6,992.6);


(lib.infobox_y = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_21 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		setTimeout(function() {
		    _this.gotoAndPlay(23); // continue the flip after 5 seconds
		}, 5000); // 5000ms = 5 seconds
	}
	this.frame_23 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		_this.gotoAndStop(0);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(21).call(this.frame_21).wait(2).call(this.frame_23).wait(1));

	// popout_y
	this.popout_y = new lib.yoni2();
	this.popout_y.name = "popout_y";
	this.popout_y.setTransform(58.35,101.75,0.0399,0.0401,0,0,0,97.7,168.4);
	this.popout_y.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.popout_y).to({regX:96.4,regY:167.2,scaleX:0.0259,scaleY:0.6811,x:49.75,y:110.9,alpha:1},5).wait(1).to({scaleX:0.6811,x:65.65,y:105.9},0).wait(15).to({y:107.9},0).wait(1).to({regY:167.3,scaleX:0.0259,scaleY:0.59,x:51.45,y:92.65,alpha:0.7891},0).to({y:94.65,alpha:0.0195},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-8,131.1,232.9);


(lib.infobox_r = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_21 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		setTimeout(function() {
		    _this.gotoAndPlay(23); // continue the flip after 5 seconds
		}, 5000); // 5000ms = 5 seconds
	}
	this.frame_23 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		_this.gotoAndStop(0);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(21).call(this.frame_21).wait(2).call(this.frame_23).wait(1));

	// popout_r
	this.popout_r = new lib.rudra2();
	this.popout_r.name = "popout_r";
	this.popout_r.setTransform(64.6,112.2,0.04,0.0401,0,0,0,97.5,168.5);
	this.popout_r.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.popout_r).to({regX:96.6,regY:167.2,scaleX:0.03,scaleY:0.6811,x:65.65,y:113.9,alpha:1},5).wait(1).to({regX:96.4,scaleX:0.6811},0).wait(16).to({regX:98.3,scaleX:0.0259,x:64.85},0).wait(1).to({alpha:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,131.1,227.9);


(lib.hakini2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_480();
	this.instance.setTransform(19.2,105.85,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_479();
	this.instance_1.setTransform(9.75,45.75,0.5,0.5);

	this.instance_2 = new lib.Group();
	this.instance_2.setTransform(96.35,167.2,1,1,0,0,0,60.8,61.1);
	this.instance_2.alpha = 0.1484;

	this.instance_3 = new lib.CachedBmp_478();
	this.instance_3.setTransform(7.9,7.9,0.5,0.5);

	this.instance_4 = new lib.back();
	this.instance_4.setTransform(96.4,167.2,1,1,0,0,0,96.4,167.2);
	this.instance_4.alpha = 0.9805;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hakini2, new cjs.Rectangle(0,0,192.7,334.5), null);


(lib.hakini1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// hflip
	this.instance = new lib.Tween1("synched",0);
	this.instance.setTransform(7.5,977.85);
	this.instance._off = true;

	this.instance_1 = new lib.Tween2("synched",0);
	this.instance_1.setTransform(7.5,165.85);

	this.instance_2 = new lib.CachedBmp_477();
	this.instance_2.setTransform(32.3,281.95,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_476();
	this.instance_3.setTransform(13.55,11.9,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_475();
	this.instance_4.setTransform(12.4,83.5,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_474();
	this.instance_5.setTransform(5.95,7.9,0.5,0.5);

	this.instance_6 = new lib.back_0();
	this.instance_6.setTransform(96.4,167.2,1,1,0,0,0,96.4,167.2);
	this.instance_6.alpha = 0.9805;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},9).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]},1).wait(575));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(9).to({_off:false},0).to({_off:true,y:165.85},5,cjs.Ease.get(1)).wait(576));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-6.1,-1.3,198.79999999999998,1146.3999999999999);


(lib.figa2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_473();
	this.instance.setTransform(28.45,98.3,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_472();
	this.instance_1.setTransform(7.35,60.65,0.5,0.5);

	this.instance_2 = new lib.Group_1_4();
	this.instance_2.setTransform(96.35,167.2,1,1,0,0,0,60.5,60.5);
	this.instance_2.alpha = 0.1484;

	this.instance_3 = new lib.CachedBmp_471();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.figa2, new cjs.Rectangle(0,0,192.5,334.5), null);


(lib.figa1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// fflip
	this.instance = new lib.Tween5("synched",0);
	this.instance.setTransform(96.45,1001.8);
	this.instance._off = true;

	this.instance_1 = new lib.Tween6("synched",0);
	this.instance_1.setTransform(96.45,160.8);

	this.instance_2 = new lib.CachedBmp_470();
	this.instance_2.setTransform(53.9,279.35,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_469();
	this.instance_3.setTransform(10.65,13.7,0.5,0.5);

	this.instance_4 = new lib.Image_2();
	this.instance_4.setTransform(47.1,72.25,0.2985,0.2985);

	this.instance_5 = new lib.CachedBmp_468();
	this.instance_5.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},19).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]},1).wait(575));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(19).to({_off:false},0).to({_off:true,y:160.8},5,cjs.Ease.get(1)).wait(576));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-6.4,192.5,1175.5);


(lib.chinmaya2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_467();
	this.instance.setTransform(7.9,42.5,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_466();
	this.instance_1.setTransform(6.55,116.4,0.5,0.5);

	this.instance_2 = new lib.Group_3();
	this.instance_2.setTransform(96.3,167.2,1,1,0,0,0,60.6,60.5);
	this.instance_2.alpha = 0.1484;

	this.instance_3 = new lib.CachedBmp_465();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.chinmaya2, new cjs.Rectangle(0,0,192.5,334.5), null);


(lib.chinmay1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween9("synched",0);
	this.instance.setTransform(-2.85,984.7);
	this.instance._off = true;

	this.instance_1 = new lib.Tween10("synched",0);
	this.instance_1.setTransform(-2.85,161.1);

	this.instance_2 = new lib.CachedBmp_464();
	this.instance_2.setTransform(16.95,281.5,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_463();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},29).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).wait(575));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(29).to({_off:false},0).to({_off:true,y:161.1},5,cjs.Ease.get(1)).wait(576));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-16.6,-6.1,209.1,1158.1);


(lib.button_y = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// ybutton
	this.instance = new lib.yoni1();
	this.instance.setTransform(65.65,113.9,0.6811,0.6811,0,0,0,96.4,167.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,16,16);


(lib.button_r = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.rudra1();
	this.instance.setTransform(67.55,113.9,0.6811,0.6811,0,0,0,99.2,167.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,16,16);


(lib.button_h = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// hbutton
	this.instance = new lib.hakini1();
	this.instance.setTransform(65.65,113.9,0.6811,0.6811,0,0,0,96.4,167.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,16,16);


(lib.button_f = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.figa1();
	this.instance.setTransform(65.65,113.9,0.6811,0.6811,0,0,0,96.4,167.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,16,16);


(lib.button_c = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.chinmay1();
	this.instance.setTransform(65.65,113.9,0.6811,0.6811,0,0,0,96.4,167.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,16,16);


(lib.Tween49 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween3_1("synched",0);
	this.instance.setTransform(-80.15,-121.25,1.6619,1.6259,90,0,0,0.2,0.1);

	this.instance_1 = new lib.Tween1_1("synched",0);
	this.instance_1.setTransform(15.8,-57.25,1.7374,1.7029,90,0,0,0.1,0.1);

	this.instance_2 = new lib.Tween5_1("synched",0);
	this.instance_2.setTransform(15.8,67.45,1.7374,1.7029,90,0,0,0.1,0.1);

	this.instance_3 = new lib.Tween7_1("synched",0);
	this.instance_3.setTransform(-80.6,121.8,1.6619,1.6259,90,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-123.3,-215.9,246.6,432);


(lib.Tween48 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween3_1("synched",0);
	this.instance.setTransform(-80.15,-121.25,1.6619,1.6259,90,0,0,0.2,0.1);

	this.instance_1 = new lib.Tween1_1("synched",0);
	this.instance_1.setTransform(15.8,-57.25,1.7374,1.7029,90,0,0,0.1,0.1);

	this.instance_2 = new lib.Tween5_1("synched",0);
	this.instance_2.setTransform(15.8,67.45,1.7374,1.7029,90,0,0,0.1,0.1);

	this.instance_3 = new lib.Tween7_1("synched",0);
	this.instance_3.setTransform(-80.6,121.8,1.6619,1.6259,90,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-123.3,-215.9,246.6,432);


(lib.infobox_h = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_21 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		setTimeout(function() {
		    _this.gotoAndPlay(23); // continue the flip after 5 seconds
		}, 5000); // 5000ms = 5 seconds
	}
	this.frame_23 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		_this.gotoAndStop(0);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(21).call(this.frame_21).wait(2).call(this.frame_23).wait(1));

	// popout_h
	this.popout_h = new lib.hakini2();
	this.popout_h.name = "popout_h";
	this.popout_h.setTransform(63.5,113.9,0.0208,0.04,0,0,0,96.4,167.3);
	this.popout_h.alpha = 0.0508;

	this.timeline.addTween(cjs.Tween.get(this.popout_h).to({regY:167.2,scaleX:0.0259,scaleY:0.6811,x:56.55,alpha:1},5).wait(1).to({scaleX:0.6811,x:65.65},0).wait(16).to({scaleX:0.0259,x:58.75},0).wait(1).to({regX:96.2,regY:167.3,scaleX:0.04,scaleY:0.04,x:65.65,alpha:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,131.3,227.8);


(lib.infobox_f = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_21 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		setTimeout(function() {
		    _this.gotoAndPlay(23); // continue the flip after 5 seconds
		}, 5000); // 5000ms = 5 seconds
	}
	this.frame_23 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		_this.gotoAndStop(0);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(21).call(this.frame_21).wait(2).call(this.frame_23).wait(1));

	// poout_f
	this.popout_f = new lib.figa2();
	this.popout_f.name = "popout_f";
	this.popout_f.setTransform(64.15,111.3,0.04,0.04,0,0,0,97.5,167.3);
	this.popout_f.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.popout_f).to({regX:96.4,regY:167.2,scaleX:0.0259,scaleY:0.6811,x:58,y:113.9,alpha:1},5).to({regX:95.7,scaleX:0.6781,scaleY:0.6787,x:68.05,y:117,alpha:0.9492},1).wait(16).to({regX:98.2,scaleX:0.026,x:64.9,y:119},0).wait(1).to({alpha:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(3.2,0,130.5,232.6);


(lib.infobox_c = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_21 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		setTimeout(function() {
		    _this.gotoAndPlay(23); // continue the flip after 5 seconds
		}, 5000); // 5000ms = 5 seconds
	}
	this.frame_23 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		_this.gotoAndStop(0);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(21).call(this.frame_21).wait(2).call(this.frame_23).wait(1));

	// popout_c
	this.popout_c = new lib.chinmaya2();
	this.popout_c.name = "popout_c";
	this.popout_c.setTransform(64.5,110.95,0.0398,0.04,0,0,0,116.8,167.3);
	this.popout_c.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.popout_c).to({regX:98.3,regY:167.2,scaleX:0.0259,scaleY:0.6811,x:60.9,y:113.9,alpha:1},5).to({regX:96.4,scaleX:0.6807,scaleY:0.6807,x:65.65},1).wait(16).to({regX:96.5,scaleX:0.0259,scaleY:0.6277,x:63.3,y:113.65,alpha:0.9219},0).wait(1).to({alpha:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.1,0,131,227.9);


// stage content:
(lib.shufflefinalBG1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,214];
	this.streamSoundSymbolsList[0] = [{id:"ehved_orchestralloop",startFrame:0,endFrame:2259,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("ehved_orchestralloop",0);
		this.InsertIntoSoundStreamData(soundInstance,0,2259,1);
	}
	this.frame_214 = function() {
		var _this = this;
		
		var timers = {
		    c: null,
		    r: null,
		    f: null,
		    y: null,
		    h: null
		};
		
		
		// Function to show popout, hide trigger, and reshuffle after all cards finish
		function showPopout(trigger, popout, name) {
		    // Clear any previous timeout for this card
		    if (timers[name]) {
		        clearTimeout(timers[name]);
		    }
		
		    // Hide the trigger and show the popout
		    trigger.visible = false;
		    popout.visible = true;
		    popout.gotoAndPlay(0); // start the card flip timeline
		
		    // After 5 seconds, hide popout, show trigger, reset timer, and check reshuffle
		    timers[name] = setTimeout(function(){
		        popout.visible = false;   // hide the back card
		        trigger.visible = true;   // show the trigger button
		
		        timers[name] = null;      // reset this card’s timer **before** reshuffle
		        scheduleReshuffle();      // check if all cards are done, then reshuffle
		    }, 5000);
		}
		
		// Centralized reshuffle function
		function scheduleReshuffle() {
		    // Only reshuffle when no card timers are active
		    if (!Object.values(timers).some(t => t !== null)) {
		        reshuffleCards();
		    }
		}
		
		// Card click handlers
		_this.trigger_c.on('click', function(){
		    showPopout(_this.trigger_c, _this.popout_c, 'c');
		});
		
		_this.trigger_r.on('click', function(){
		    showPopout(_this.trigger_r, _this.popout_r, 'r');
		});
		
		_this.trigger_f.on('click', function(){
		    showPopout(_this.trigger_f, _this.popout_f, 'f');
		});
		
		_this.trigger_y.on('click', function(){
		    showPopout(_this.trigger_y, _this.popout_y, 'y');
		});
		
		_this.trigger_h.on('click', function(){
		    showPopout(_this.trigger_h, _this.popout_h, 'h');
		});
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(214).call(this.frame_214).wait(2045));

	// chinmaya2
	this.popout_c = new lib.infobox_c();
	this.popout_c.name = "popout_c";
	this.popout_c.setTransform(1230,338.9,1.1473,1.1473,0,0,0,65.7,113.9);
	this.popout_c._off = true;

	this.timeline.addTween(cjs.Tween.get(this.popout_c).wait(214).to({_off:false},0).to({_off:true},2044).wait(1));

	// chinmaya1
	this.trigger_c = new lib.button_c();
	this.trigger_c.name = "trigger_c";
	this.trigger_c.setTransform(1227,338.1,0.8587,0.8587,0,0,0,65.7,113.9);
	this.trigger_c._off = true;
	new cjs.ButtonHelper(this.trigger_c, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.trigger_c).wait(214).to({_off:false},0).to({_off:true},2044).wait(1));

	// rudra2
	this.popout_r = new lib.infobox_r();
	this.popout_r.name = "popout_r";
	this.popout_r.setTransform(1022.6,336.05,1.1473,1.1473,0,0,0,65.7,113.9);
	this.popout_r._off = true;

	this.timeline.addTween(cjs.Tween.get(this.popout_r).wait(214).to({_off:false},0).to({_off:true},2044).wait(1));

	// rudra
	this.trigger_r = new lib.button_r();
	this.trigger_r.name = "trigger_r";
	this.trigger_r.setTransform(1018.35,338.1,0.8587,0.8587,0,0,0,67.6,113.9);
	this.trigger_r._off = true;
	new cjs.ButtonHelper(this.trigger_r, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.trigger_r).wait(214).to({_off:false},0).to({_off:true},2044).wait(1));

	// figa2
	this.popout_f = new lib.infobox_f();
	this.popout_f.name = "popout_f";
	this.popout_f.setTransform(811.05,333.05,1.1473,1.1473,0,0,0,63.7,109.7);
	this.popout_f._off = true;

	this.timeline.addTween(cjs.Tween.get(this.popout_f).wait(214).to({_off:false},0).to({_off:true},2044).wait(1));

	// figa1
	this.trigger_f = new lib.button_f();
	this.trigger_f.name = "trigger_f";
	this.trigger_f.setTransform(809.75,338.1,0.8587,0.8587,0,0,0,65.7,113.9);
	this.trigger_f._off = true;
	new cjs.ButtonHelper(this.trigger_f, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.trigger_f).wait(214).to({_off:false},0).to({_off:true},2044).wait(1));

	// yoni2
	this.popout_y = new lib.infobox_y();
	this.popout_y.name = "popout_y";
	this.popout_y.setTransform(531.65,216.85,1.1473,1.1473);
	this.popout_y._off = true;

	this.timeline.addTween(cjs.Tween.get(this.popout_y).wait(214).to({_off:false},0).to({_off:true},2044).wait(1));

	// yoni1
	this.trigger_y = new lib.button_y();
	this.trigger_y.name = "trigger_y";
	this.trigger_y.setTransform(601.15,338.1,0.8587,0.8587,0,0,0,65.7,113.9);
	this.trigger_y._off = true;
	new cjs.ButtonHelper(this.trigger_y, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.trigger_y).wait(214).to({_off:false},0).to({_off:true},2044).wait(1));

	// hakini2
	this.popout_h = new lib.infobox_h();
	this.popout_h.name = "popout_h";
	this.popout_h.setTransform(392.6,333.55,1.1473,1.1473,0,0,0,65.7,113.9);
	this.popout_h._off = true;

	this.timeline.addTween(cjs.Tween.get(this.popout_h).wait(214).to({_off:false},0).wait(182).to({scaleX:1.1424,x:394.75},0).wait(65).to({x:366.75},0).wait(456).to({x:346.75,y:313.55},0).to({_off:true},1341).wait(1));

	// hakini1
	this.trigger_h = new lib.button_h();
	this.trigger_h.name = "trigger_h";
	this.trigger_h.setTransform(392.55,338.1,0.8587,0.8587,0,0,0,65.7,113.9);
	this.trigger_h._off = true;
	new cjs.ButtonHelper(this.trigger_h, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.trigger_h).wait(214).to({_off:false},0).wait(247).to({x:364.55},0).to({_off:true},1797).wait(1));

	// rightside
	this.instance = new lib.Tween48("synched",0);
	this.instance.setTransform(1652.1,375.8,1,1,0,0,180);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween49("synched",0);
	this.instance_1.setTransform(1371.45,365.8,1,1,0,0,180);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(107).to({_off:false},0).to({_off:true,x:1371.45,y:365.8,alpha:1},48).wait(179).to({_off:false,x:1652.1,y:375.8,alpha:0},1).to({_off:true,x:1397.45,y:365.8,alpha:1},48).wait(407).to({_off:false,x:1652.1,y:375.8,alpha:0},1).to({_off:true,x:1389.45,y:365.8,alpha:1},48).wait(408).to({_off:false,x:1652.1,y:375.8,alpha:0},1).to({_off:true,x:1391.45,y:365.8,alpha:1},48).wait(178).to({_off:false,x:1652.1,y:375.8,alpha:0},1).to({_off:true,x:1391.45,y:365.8,alpha:1},48).wait(180).to({_off:false,x:1652.1,y:375.8,alpha:0},1).to({_off:true,x:1391.45,y:365.8,alpha:1},48).wait(179).to({_off:false,x:1652.1,y:375.8,alpha:0},1).to({_off:true,x:1371.45,y:365.8,alpha:1},48).wait(179).to({_off:false,x:1652.1,y:375.8,alpha:0},1).to({_off:true,x:1397.45,y:365.8,alpha:1},48).wait(51));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(107).to({_off:false},48).to({regX:0.1,regY:0.2,scaleX:1.5627,scaleY:1.5627,x:1194.8,y:352.6},30).to({regX:0.2,regY:0,scaleX:1.2371,scaleY:1.2371,skewX:144.1957,skewY:324.1957,x:1179,y:185.8},49).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,skewX:106.0033,skewY:286.0033,x:962.05,y:201.3,alpha:0.0195},27).to({regX:0.1,scaleX:1.5579,scaleY:1.5579,skewX:83.3742,skewY:263.3742,x:807.35,y:178.65},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,skewX:39.5238,skewY:219.5238,x:344.75,y:240.45,alpha:0.5117},31).to({y:236.45,alpha:0.0703},26).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:180,x:1652.1,y:375.8,alpha:0},1).to({_off:false,x:1397.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.6458,scaleY:1.6458,x:1221.05,y:358.8},30).to({regX:0.2,regY:-0.1,scaleX:1.156,scaleY:1.156,skewX:144.195,skewY:324.195,x:1181,y:197.85},48).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,skewX:106.0033,skewY:286.0033,x:962.05,y:201.3,alpha:0.0195},27).to({regX:0.1,scaleX:1.5579,scaleY:1.5579,skewX:83.3742,skewY:263.3742,x:807.35,y:178.65},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,skewX:39.5238,skewY:219.5238,x:344.75,y:222.45,alpha:0.5117},30).to({y:256.45,alpha:0},27).to({regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:180,x:1411.45,y:365.8,alpha:1},49).to({regX:0.1,regY:0.2,scaleX:1.568,scaleY:1.568,x:1176.25,y:353.6},30).to({regX:0.2,regY:-0.1,scaleX:1.1814,scaleY:1.1814,skewX:144.1954,skewY:324.1954,x:1159.8,y:194.1},49).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,skewX:106.0033,skewY:286.0033,x:962.05,y:201.3,alpha:0.0195},27).to({regX:0.1,scaleX:1.5579,scaleY:1.5579,skewX:83.3742,skewY:263.3742,x:807.35,y:178.65},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,skewX:39.5238,skewY:219.5238,x:344.75,y:244.45,alpha:0.5117},31).to({alpha:0.0703},27).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:180,x:1652.1,y:375.8,alpha:0},1).to({_off:false,x:1389.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.6912,scaleY:1.6912,skewX:-3.2275,skewY:176.7725,x:1168.35,y:362.7},30).to({regX:0.2,regY:-0.1,scaleX:1.1054,scaleY:1.1054,skewX:144.1957,skewY:324.1957,x:1153.5,y:185.3},48).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,skewX:106.0033,skewY:286.0033,x:962.05,y:201.3,alpha:0.0195},27).to({regX:0.1,scaleX:1.5579,scaleY:1.5579,skewX:83.3742,skewY:263.3742,x:807.35,y:178.65},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,skewX:39.5238,skewY:219.5238,x:344.75,y:236.45,alpha:0.5117},31).to({y:256.45,alpha:0},27).to({regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:180,x:1391.45,y:365.8,alpha:1},49).to({regX:0.1,regY:0.1,scaleX:1.6335,scaleY:1.6335,x:1194.1,y:352.45},30).to({regX:0.2,regY:0,scaleX:1.2371,scaleY:1.2371,skewX:144.1957,skewY:324.1957,x:1179,y:185.8},49).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,skewX:106.0033,skewY:286.0033,x:962.05,y:201.3,alpha:0.0195},28).to({regX:0.1,scaleX:1.5579,scaleY:1.5579,skewX:83.3742,skewY:263.3742,x:807.35,y:178.65},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,skewX:39.5238,skewY:219.5238,x:344.75,y:230.45,alpha:0.5117},31).to({y:238.45,alpha:0.0703},26).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:180,x:1652.1,y:375.8,alpha:0},1).to({_off:false,x:1391.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.6365,scaleY:1.6365,skewX:-4.2228,skewY:175.7772,x:1174.8,y:374.85},30).to({regX:0.2,regY:-0.1,scaleX:1.1864,scaleY:1.1864,skewX:144.1954,skewY:324.1954,x:1161.5,y:193.35},48).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,skewX:106.0033,skewY:286.0033,x:962.05,y:201.3,alpha:0.0195},27).to({regX:0.1,scaleX:1.5579,scaleY:1.5579,skewX:83.3742,skewY:263.3742,x:807.35,y:178.65},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,skewX:39.5238,skewY:219.5238,x:344.75,y:236.45,alpha:0.5117},30).to({y:238.45,alpha:0},27).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:180,x:1652.1,y:375.8},1).to({_off:false,x:1391.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.5588,scaleY:1.5588,x:1173.7,y:353.65},30).to({regX:0.2,regY:0,scaleX:1.2371,scaleY:1.2371,skewX:144.1957,skewY:324.1957,x:1179,y:185.8},49).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,skewX:106.0033,skewY:286.0033,x:962.05,y:201.3,alpha:0.0195},27).to({regX:0.1,scaleX:1.5579,scaleY:1.5579,skewX:83.3742,skewY:263.3742,x:807.35,y:178.65},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,skewX:39.5238,skewY:219.5238,x:344.75,y:236.45,alpha:0.5117},31).to({alpha:0.0703},27).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:180,x:1652.1,y:375.8,alpha:0},1).to({_off:false,x:1391.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.664,scaleY:1.664,x:1181.6,y:374.75},30).to({regX:0.2,regY:-0.1,scaleX:1.1611,scaleY:1.1611,skewX:144.195,skewY:324.195,x:1172.8,y:197.1},48).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,skewX:106.0033,skewY:286.0033,x:962.05,y:201.3,alpha:0.0195},27).to({regX:0.1,scaleX:1.5579,scaleY:1.5579,skewX:83.3742,skewY:263.3742,x:807.35,y:178.65},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,skewX:39.5238,skewY:219.5238,x:324.75,y:222.45,alpha:0.5117},31).to({x:344.75,y:238.45,alpha:0},27).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:180,x:1652.1,y:375.8},1).to({_off:false,x:1371.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.2,scaleX:1.5627,scaleY:1.5627,x:1194.8,y:352.6},30).to({regX:0.2,regY:0,scaleX:1.2371,scaleY:1.2371,skewX:144.1957,skewY:324.1957,x:1179,y:185.8},49).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,skewX:106.0033,skewY:286.0033,x:962.05,y:201.3,alpha:0.0195},27).to({regX:0.1,scaleX:1.5579,scaleY:1.5579,skewX:83.3742,skewY:263.3742,x:807.35,y:178.65},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,skewX:39.5238,skewY:219.5238,x:344.75,y:240.45,alpha:0.5117},31).to({y:236.45,alpha:0.0703},26).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:180,x:1652.1,y:375.8,alpha:0},1).to({_off:false,x:1397.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.6458,scaleY:1.6458,x:1221.05,y:358.8,alpha:0.0195},30).to({_off:true},20).wait(1));

	// leftside
	this.instance_2 = new lib.Tween3_1("synched",0);
	this.instance_2.setTransform(-236.05,254.55,1.6619,1.6259,90,0,0,0.2,0.1);
	this.instance_2.alpha = 0.0117;

	this.instance_3 = new lib.Tween1_1("synched",0);
	this.instance_3.setTransform(-140.1,318.55,1.7374,1.7029,90,0,0,0.1,0.1);
	this.instance_3.alpha = 0.0117;

	this.instance_4 = new lib.Tween5_1("synched",0);
	this.instance_4.setTransform(-140.1,443.25,1.7374,1.7029,90,0,0,0.1,0.1);
	this.instance_4.alpha = 0.0117;

	this.instance_5 = new lib.Tween7_1("synched",0);
	this.instance_5.setTransform(-236.5,497.6,1.6619,1.6259,90,0,0,0.1,0.1);
	this.instance_5.alpha = 0.0117;

	this.instance_6 = new lib.Tween48("synched",0);
	this.instance_6.setTransform(-155.9,375.8);
	this.instance_6.alpha = 0;
	this.instance_6._off = true;

	this.instance_7 = new lib.Tween49("synched",0);
	this.instance_7.setTransform(123.45,365.8);
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]}).to({state:[{t:this.instance_6}]},107).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},49).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_7}]},16).to({state:[{t:this.instance_7}]},31).to({state:[{t:this.instance_7}]},26).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_7}]},16).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_7}]},49).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},49).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_7}]},16).to({state:[{t:this.instance_7}]},31).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_7}]},16).to({state:[{t:this.instance_7}]},31).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_7}]},49).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},49).to({state:[{t:this.instance_7}]},28).to({state:[{t:this.instance_7}]},16).to({state:[{t:this.instance_7}]},31).to({state:[{t:this.instance_7}]},26).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_7}]},16).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},49).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_7}]},16).to({state:[{t:this.instance_7}]},31).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_7}]},16).to({state:[{t:this.instance_7}]},31).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},30).to({state:[{t:this.instance_7}]},49).to({state:[{t:this.instance_7}]},27).to({state:[{t:this.instance_7}]},16).to({state:[{t:this.instance_7}]},31).to({state:[{t:this.instance_7}]},26).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_7}]},30).to({state:[]},20).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(107).to({_off:false},0).to({_off:true,x:123.45,y:365.8,alpha:1},48).wait(179).to({_off:false,x:-155.9,y:375.8,alpha:0},1).to({_off:true,x:149.45,y:365.8,alpha:1},48).wait(407).to({_off:false,x:-155.9,y:375.8,alpha:0},1).to({_off:true,x:141.45,y:365.8,alpha:1},48).wait(408).to({_off:false,x:-155.9,y:375.8,alpha:0},1).to({_off:true,x:143.45,y:365.8,alpha:1},48).wait(178).to({_off:false,x:-155.9,y:375.8,alpha:0},1).to({_off:true,x:143.45,y:365.8,alpha:1},48).wait(180).to({_off:false,x:-155.9,y:375.8,alpha:0},1).to({_off:true,x:143.45,y:365.8,alpha:1},48).wait(179).to({_off:false,x:-155.9,y:375.8,alpha:0},1).to({_off:true,x:123.45,y:365.8,alpha:1},48).wait(179).to({_off:false,x:-155.9,y:375.8,alpha:0},1).to({_off:true,x:149.45,y:365.8,alpha:1},48).wait(51));
	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(107).to({_off:false},48).to({regX:0.1,regY:0.2,scaleX:1.5627,scaleY:1.5627,x:303.45,y:352.6},30).to({regY:0.1,scaleX:1.2371,scaleY:1.2371,rotation:-144.1957,x:322.9,y:185.8},49).to({scaleX:1.2257,scaleY:1.2257,rotation:-106.0033,x:552.75,y:201.55,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:-83.3742,x:715.25,y:178.7},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,rotation:-39.5238,x:1192.75,y:240.45,alpha:0.5117},31).to({y:236.45,alpha:0.0703},26).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,rotation:0,x:-155.9,y:375.8,alpha:0},1).to({_off:false,x:149.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.6458,scaleY:1.6458,x:311.05,y:358.8},30).to({scaleX:1.156,scaleY:1.156,rotation:-144.195,x:322.9,y:197.75},48).to({scaleX:1.2257,scaleY:1.2257,rotation:-106.0033,x:552.75,y:201.55,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:-83.3742,x:715.25,y:178.7},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,rotation:-39.5238,x:1192.75,y:222.45,alpha:0.5117},30).to({y:256.45,alpha:0.0195},27).to({regX:0,regY:0,scaleX:1,scaleY:1,rotation:0,x:135.45,y:365.8,alpha:1},49).to({regX:0.1,regY:0.2,scaleX:1.568,scaleY:1.568,x:322,y:353.6},30).to({regY:0,scaleX:1.1814,scaleY:1.1814,rotation:-144.1954,x:342.15,y:194.1},49).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,rotation:-106.0033,x:552.75,y:201.55,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:-83.3742,x:715.25,y:178.7},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,rotation:-39.5238,x:1192.75,y:244.45,alpha:0.5117},31).to({alpha:0.0703},27).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,rotation:0,x:-155.9,y:375.8,alpha:0},1).to({_off:false,x:141.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.6912,scaleY:1.6912,rotation:3.7319,x:339.8,y:362.7},30).to({scaleX:1.1054,scaleY:1.1054,rotation:-144.1957,x:348.45,y:185.2},48).to({scaleX:1.2257,scaleY:1.2257,rotation:-106.0033,x:552.75,y:201.55,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:-83.3742,x:715.25,y:178.7},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,rotation:-39.5238,x:1192.75,y:236.45,alpha:0.5117},31).to({y:256.45,alpha:0.0195},27).to({regX:0,regY:0,scaleX:1,scaleY:1,rotation:0,x:143.45,y:365.8,alpha:1},49).to({regX:0.1,regY:0.1,scaleX:1.6335,scaleY:1.6335,x:304.2,y:352.45},30).to({scaleX:1.2371,scaleY:1.2371,rotation:-144.1957,x:322.9,y:185.8},49).to({scaleX:1.2257,scaleY:1.2257,rotation:-106.0033,x:552.75,y:201.55,alpha:0.0195},28).to({scaleX:1.5579,scaleY:1.5579,rotation:-83.3742,x:715.25,y:178.7},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,rotation:-39.5238,x:1192.75,y:230.45,alpha:0.5117},31).to({y:238.45,alpha:0.0703},26).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,rotation:0,x:-155.9,y:375.8,alpha:0},1).to({_off:false,x:143.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.6365,scaleY:1.6365,rotation:4.7061,x:323.45,y:374.85},30).to({scaleX:1.1864,scaleY:1.1864,rotation:-144.1954,x:340.4,y:193.25},48).to({scaleX:1.2257,scaleY:1.2257,rotation:-106.0033,x:552.75,y:201.55,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:-83.3742,x:715.25,y:178.7},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,rotation:-39.5238,x:1192.75,y:236.45,alpha:0.5117},30).to({y:238.45,alpha:0.0195},27).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,rotation:0,x:-155.9,y:375.8,alpha:0},1).to({_off:false,x:143.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.5588,scaleY:1.5588,x:324.5,y:353.65},30).to({scaleX:1.2371,scaleY:1.2371,rotation:-144.1957,x:322.9,y:185.8},49).to({scaleX:1.2257,scaleY:1.2257,rotation:-106.0033,x:552.75,y:201.55,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:-83.3742,x:715.25,y:178.7},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,rotation:-39.5238,x:1192.75,y:236.45,alpha:0.5117},31).to({alpha:0.0703},27).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,rotation:0,x:-155.9,y:375.8,alpha:0},1).to({_off:false,x:143.45,y:365.8,alpha:1},48).to({regX:0.2,regY:0.1,scaleX:1.664,scaleY:1.664,x:316.75,y:374.75},30).to({regX:0.1,regY:0,scaleX:1.1611,scaleY:1.1611,rotation:-144.195,x:329.15,y:197.1},48).to({regY:0.1,scaleX:1.2257,scaleY:1.2257,rotation:-106.0033,x:552.75,y:201.55,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:-83.3742,x:715.25,y:178.7},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,rotation:-39.5238,x:1212.75,y:222.45,alpha:0.5117},31).to({x:1192.75,y:238.45,alpha:0.0195},27).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,rotation:0,x:-155.9,y:375.8,alpha:0},1).to({_off:false,x:123.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.2,scaleX:1.5627,scaleY:1.5627,x:303.45,y:352.6},30).to({regY:0.1,scaleX:1.2371,scaleY:1.2371,rotation:-144.1957,x:322.9,y:185.8},49).to({scaleX:1.2257,scaleY:1.2257,rotation:-106.0033,x:552.75,y:201.55,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:-83.3742,x:715.25,y:178.7},16).to({regX:0.2,regY:0.2,scaleX:1.2268,scaleY:1.2268,rotation:-39.5238,x:1192.75,y:240.45,alpha:0.5117},31).to({y:236.45,alpha:0.0703},26).to({_off:true,regX:0,regY:0,scaleX:1,scaleY:1,rotation:0,x:-155.9,y:375.8,alpha:0},1).to({_off:false,x:149.45,y:365.8,alpha:1},48).to({regX:0.1,regY:0.1,scaleX:1.6458,scaleY:1.6458,x:311.05,y:358.8,alpha:0.0195},30).to({_off:true},20).wait(1));

	// rightbottom
	this.instance_8 = new lib.Tween49("synched",0);
	this.instance_8.setTransform(1191.3,352.6,1.5627,1.5627,0,0,180,0.1,0.2);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(185).to({_off:false},0).to({regX:0.2,regY:0.1,scaleX:1.2371,scaleY:1.2371,skewX:-130.9479,skewY:49.0521,x:1140.3,y:566.7},49).to({regY:0.2,scaleX:1.2257,scaleY:1.2257,skewX:-97.7443,skewY:82.2557,x:927.05,y:541.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,skewX:-78.0716,skewY:101.9284,x:765.9,y:573.55},16).to({regY:0.1,scaleX:1.2268,scaleY:1.2268,skewX:-39.9483,skewY:140.0517,x:348.85,y:478.55,alpha:0.5117},31).to({y:474.55,alpha:0.0703},26).to({regX:0.1,scaleX:1.8091,scaleY:1.8091,skewX:0,skewY:180,x:1195.8,y:374.5,alpha:0},1).wait(78).to({regY:0.2,scaleX:1.6351,scaleY:1.6351,skewX:-2.6701,skewY:177.3299,x:1224.45,y:362.5,alpha:1},0).to({regX:0.2,regY:0.1,scaleX:1.1561,scaleY:1.1561,skewX:-130.948,skewY:49.052,x:1144.8,y:541.65},48).to({regY:0.2,scaleX:1.2257,scaleY:1.2257,skewX:-97.7443,skewY:82.2557,x:927.05,y:541.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,skewX:-78.0716,skewY:101.9284,x:765.9,y:573.55},16).to({regY:0.1,scaleX:1.2268,scaleY:1.2268,skewX:-39.9483,skewY:140.0517,x:318.85,y:454.55,alpha:0.5117},30).to({y:488.55,alpha:0.0391},27).wait(78).to({startPosition:0},0).to({regX:0.1,scaleX:1.7253,scaleY:1.7253,skewX:-2.6703,skewY:177.3297,x:1176.9,y:378.3,alpha:1},1).to({regX:0.2,scaleX:1.1814,scaleY:1.1814,skewX:-130.948,skewY:49.052,x:1122.8,y:557.75},49).to({regY:0.2,scaleX:1.2257,scaleY:1.2257,skewX:-97.7443,skewY:82.2557,x:927.05,y:541.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,skewX:-78.0716,skewY:101.9284,x:765.9,y:573.55},16).to({regY:0.1,scaleX:1.2268,scaleY:1.2268,skewX:-39.9483,skewY:140.0517,x:364.85,y:482.55,alpha:0.5117},31).to({x:352.85,y:476.55,alpha:0.0391},27).wait(79).to({regX:0.1,regY:0.2,scaleX:1.6802,scaleY:1.6802,skewX:-2.6703,skewY:177.3297,x:1175.6,y:366.5,alpha:1},0).to({regX:0.3,regY:0.1,scaleX:1.1054,scaleY:1.1054,skewX:-130.9481,skewY:49.0519,x:1118.95,y:525.65},48).to({regX:0.2,regY:0.2,scaleX:1.2257,scaleY:1.2257,skewX:-97.7443,skewY:82.2557,x:927.05,y:541.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,skewX:-78.0716,skewY:101.9284,x:765.9,y:573.55},16).to({regY:0.1,scaleX:1.2268,scaleY:1.2268,skewX:-39.9483,skewY:140.0517,x:318.85,y:468.55,alpha:0.5117},31).to({y:488.55,alpha:0.0391},27).wait(79).to({regX:0.1,scaleX:1.6335,scaleY:1.6335,skewX:0,skewY:180,x:1190.45,y:352.45,alpha:1},0).to({regX:0.2,scaleX:1.2371,scaleY:1.2371,skewX:-130.9479,skewY:49.0521,x:1140.3,y:566.7},49).to({regY:0.2,scaleX:1.2257,scaleY:1.2257,skewX:-97.7443,skewY:82.2557,x:927.05,y:541.1,alpha:0.0195},28).to({scaleX:1.5579,scaleY:1.5579,skewX:-78.0716,skewY:101.9284,x:765.9,y:573.55},16).to({regY:0.1,scaleX:1.2268,scaleY:1.2268,skewX:-39.9483,skewY:140.0517,x:318.85,y:462.55,alpha:0.5117},31).to({y:470.55,alpha:0.0703},26).to({regX:0.1,scaleX:1.8091,scaleY:1.8091,skewX:0,skewY:180,x:1195.8,y:374.5,alpha:0},1).wait(78).to({regY:0.2,scaleX:1.6258,scaleY:1.6258,skewX:-2.6703,skewY:177.3297,x:1172.2,y:378.45,alpha:1},0).to({regX:0.2,regY:0.1,scaleX:1.1864,scaleY:1.1864,skewX:-130.9475,skewY:49.0525,x:1124.35,y:558.6},48).to({regY:0.2,scaleX:1.2257,scaleY:1.2257,skewX:-97.7443,skewY:82.2557,x:927.05,y:541.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,skewX:-78.0716,skewY:101.9284,x:765.9,y:573.55},16).to({regY:0.1,scaleX:1.2268,scaleY:1.2268,skewX:-39.9483,skewY:140.0517,x:318.85,y:468.55,alpha:0.5117},30).to({y:470.55,alpha:0.0391},27).wait(79).to({regX:0.1,regY:0.2,scaleX:1.652,scaleY:1.652,skewX:-2.6703,skewY:177.3297,x:1153.25,y:354.5,alpha:1},0).to({regX:0.2,regY:0.1,scaleX:1.2371,scaleY:1.2371,skewX:-130.9479,skewY:49.0521,x:1140.3,y:566.7},49).to({regY:0.2,scaleX:1.2257,scaleY:1.2257,skewX:-97.7443,skewY:82.2557,x:927.05,y:541.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,skewX:-78.0716,skewY:101.9284,x:765.9,y:573.55},16).to({regY:0.1,scaleX:1.2268,scaleY:1.2268,skewX:-39.9483,skewY:140.0517,x:364.85,y:468.55,alpha:0.5117},31).to({x:352.85,alpha:0.0391},27).wait(79).to({regX:0.1,regY:0.2,scaleX:1.6531,scaleY:1.6531,skewX:-2.6701,skewY:177.3299,x:1178.95,y:378.5,alpha:1},0).to({regX:0.2,regY:0.1,scaleX:1.1611,scaleY:1.1611,skewX:-130.9476,skewY:49.0524,x:1136.4,y:542.55},48).to({regY:0.2,scaleX:1.2257,scaleY:1.2257,skewX:-97.7443,skewY:82.2557,x:927.05,y:541.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,skewX:-78.0716,skewY:101.9284,x:765.9,y:573.55},16).to({regY:0.1,scaleX:1.2268,scaleY:1.2268,skewX:-39.9483,skewY:140.0517,x:298.85,y:454.55,alpha:0.5117},31).to({x:318.85,y:470.55,alpha:0.0391},27).to({_off:true},1).wait(78).to({_off:false,regX:0.1,regY:0.2,scaleX:1.5627,scaleY:1.5627,skewX:0,skewY:180,x:1191.3,y:352.6,alpha:1},0).to({regX:0.2,regY:0.1,scaleX:1.2371,scaleY:1.2371,skewX:-130.9479,skewY:49.0521,x:1140.3,y:566.7},49).to({regY:0.2,scaleX:1.2257,scaleY:1.2257,skewX:-97.7443,skewY:82.2557,x:927.05,y:541.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,skewX:-78.0716,skewY:101.9284,x:765.9,y:573.55},16).to({regY:0.1,scaleX:1.2268,scaleY:1.2268,skewX:-39.9483,skewY:140.0517,x:348.85,y:478.55,alpha:0.5117},31).to({y:474.55,alpha:0.0703},26).to({regX:0.1,scaleX:1.8091,scaleY:1.8091,skewX:0,skewY:180,x:1195.8,y:374.5,alpha:0},1).wait(78).to({regY:0.2,scaleX:1.6351,scaleY:1.6351,skewX:-2.6701,skewY:177.3299,x:1224.45,y:362.5,alpha:0.0195},0).to({_off:true},20).wait(1));

	// leftbottom
	this.instance_9 = new lib.Tween49("synched",0);
	this.instance_9.setTransform(305.5,352.6,1.5627,1.5627,0,0,0,0.2,0.2);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(185).to({_off:false},0).to({regY:0.1,scaleX:1.2371,scaleY:1.2371,rotation:130.9479,x:344.4,y:566.7},49).to({scaleX:1.2257,scaleY:1.2257,rotation:97.7443,x:565.5,y:539.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:78.0716,x:723.1,y:569.1},16).to({scaleX:1.2268,scaleY:1.2268,rotation:39.9483,x:1180.65,y:464.55,alpha:0.5117},31).to({x:1162.65,y:460.55,alpha:0.0703},26).to({regX:0.1,scaleX:1.8091,scaleY:1.8091,rotation:0,x:300.7,y:374.5,alpha:0},1).wait(78).to({regY:0.2,scaleX:1.6351,scaleY:1.6351,rotation:2.6701,x:305.85,y:362.5,alpha:1},0).to({regX:0.2,regY:0.1,scaleX:1.1561,scaleY:1.1561,rotation:130.948,x:343,y:541.65},48).to({scaleX:1.2257,scaleY:1.2257,rotation:97.7443,x:565.5,y:539.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:78.0716,x:723.1,y:569.1},16).to({scaleX:1.2268,scaleY:1.2268,rotation:39.9483,x:1180.65,y:446.55,alpha:0.5117},30).to({x:1165.85,y:480.55,alpha:0.0313},27).wait(78).to({startPosition:0},0).to({regX:0.1,scaleX:1.7253,scaleY:1.7253,rotation:2.6703,x:319.45,y:378.3,alpha:1},1).to({regX:0.2,scaleX:1.1814,scaleY:1.1814,rotation:130.948,x:362.7,y:557.75},49).to({scaleX:1.2257,scaleY:1.2257,rotation:97.7443,x:565.5,y:539.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:78.0716,x:723.1,y:569.1},16).to({scaleX:1.2268,scaleY:1.2268,rotation:39.9483,x:1180.65,y:468.55,alpha:0.5117},31).to({x:1165.85,alpha:0.0313},27).wait(79).to({regX:0.1,scaleX:1.6802,scaleY:1.6802,rotation:2.6703,x:330.65,y:366.3,alpha:1},0).to({regX:0.2,scaleX:1.1054,scaleY:1.1054,rotation:130.9481,x:367.65,y:525.55},48).to({scaleX:1.2257,scaleY:1.2257,rotation:97.7443,x:565.5,y:539.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:78.0716,x:723.1,y:569.1},16).to({scaleX:1.2268,scaleY:1.2268,rotation:39.9483,x:1180.65,y:460.55,alpha:0.5117},31).to({x:1165.85,y:480.55,alpha:0.0313},27).wait(79).to({regX:0.1,scaleX:1.6335,scaleY:1.6335,rotation:0,x:306.2,y:352.45,alpha:1},0).to({regX:0.2,scaleX:1.2371,scaleY:1.2371,rotation:130.9479,x:344.4,y:566.7},49).to({scaleX:1.2257,scaleY:1.2257,rotation:97.7443,x:565.5,y:539.1,alpha:0.0195},28).to({scaleX:1.5579,scaleY:1.5579,rotation:78.0716,x:723.1,y:569.1},16).to({scaleX:1.2268,scaleY:1.2268,rotation:39.9483,x:1180.65,y:454.55,alpha:0.5117},31).to({x:1162.65,y:462.55,alpha:0.0703},26).to({regX:0.1,scaleX:1.8091,scaleY:1.8091,rotation:0,x:300.7,y:374.5,alpha:0},1).wait(78).to({regY:0.2,scaleX:1.6258,scaleY:1.6258,rotation:2.6703,x:324.2,y:378.45,alpha:1},0).to({regY:0.1,scaleX:1.1864,scaleY:1.1864,rotation:130.9475,x:361.05,y:558.5},48).to({regX:0.2,scaleX:1.2257,scaleY:1.2257,rotation:97.7443,x:565.5,y:539.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:78.0716,x:723.1,y:569.1},16).to({scaleX:1.2268,scaleY:1.2268,rotation:39.9483,x:1180.65,y:460.55,alpha:0.5117},30).to({x:1165.85,y:462.55,alpha:0.0313},27).wait(79).to({regX:0.1,scaleX:1.652,scaleY:1.652,rotation:2.6703,x:337.1,y:354.3,alpha:1},0).to({regX:0.2,scaleX:1.2371,scaleY:1.2371,rotation:130.9479,x:344.4,y:566.7},49).to({scaleX:1.2257,scaleY:1.2257,rotation:97.7443,x:565.5,y:539.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:78.0716,x:723.1,y:569.1},16).to({scaleX:1.2268,scaleY:1.2268,rotation:39.9483,x:1180.65,y:460.55,alpha:0.5117},31).to({x:1165.85,alpha:0.0313},27).wait(79).to({regX:0.1,scaleX:1.6531,scaleY:1.6531,rotation:2.6701,x:317.4,y:378.3,alpha:1},0).to({scaleX:1.1611,scaleY:1.1611,rotation:130.9476,x:349.4,y:542.45},48).to({regX:0.2,scaleX:1.2257,scaleY:1.2257,rotation:97.7443,x:565.5,y:539.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:78.0716,x:723.1,y:569.1},16).to({scaleX:1.2268,scaleY:1.2268,rotation:39.9483,x:1200.65,y:446.55,alpha:0.5117},31).to({x:1165.85,y:462.55,alpha:0.0313},27).to({_off:true},1).wait(78).to({_off:false,regY:0.2,scaleX:1.5627,scaleY:1.5627,rotation:0,x:305.5,y:352.6,alpha:1},0).to({regY:0.1,scaleX:1.2371,scaleY:1.2371,rotation:130.9479,x:344.4,y:566.7},49).to({scaleX:1.2257,scaleY:1.2257,rotation:97.7443,x:565.5,y:539.1,alpha:0.0195},27).to({scaleX:1.5579,scaleY:1.5579,rotation:78.0716,x:723.1,y:569.1},16).to({scaleX:1.2268,scaleY:1.2268,rotation:39.9483,x:1180.65,y:464.55,alpha:0.5117},31).to({x:1162.65,y:460.55,alpha:0.0703},26).to({regX:0.1,scaleX:1.8091,scaleY:1.8091,rotation:0,x:300.7,y:374.5,alpha:0},1).wait(78).to({regY:0.2,scaleX:1.6351,scaleY:1.6351,rotation:2.6701,x:305.85,y:362.5,alpha:0.0195},0).to({_off:true},20).wait(1));

	// moonBR
	this.instance_10 = new lib.moon("synched",0);
	this.instance_10.setTransform(1476,635.05,1.1042,1.1042,0,0,180,75.4,72.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(461).to({y:623.05},0).to({_off:true},1797).wait(1));

	// moonTR
	this.instance_11 = new lib.moon("synched",0);
	this.instance_11.setTransform(1476.5,67.9,1.1042,1.1042,180,0,0,75.4,72.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).to({_off:true},2258).wait(1));

	// moonTL
	this.instance_12 = new lib.moon("synched",0);
	this.instance_12.setTransform(73,62.9,1.1042,1.1042,0,180,0,75.5,72.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_12).to({_off:true},2258).wait(1));

	// moonBL
	this.instance_13 = new lib.moon("synched",0);
	this.instance_13.setTransform(74,637.05,1.1042,1.1042,0,0,0,75.5,72.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(461).to({y:625.05},0).to({_off:true},1797).wait(1));

	// strs
	this.instance_14 = new lib.stars1();
	this.instance_14.setTransform(793.2,348.85,1.1702,1.1042,0,0,0,446.4,281.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_14).to({_off:true},2258).wait(1));

	// rings
	this.instance_15 = new lib.rings();
	this.instance_15.setTransform(766.15,354.85);
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(50).to({_off:false},0).to({_off:true},2208).wait(1));

	// gradient
	this.instance_16 = new lib.gradient();
	this.instance_16.setTransform(775,350);

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(461).to({x:777,y:338},0).to({_off:true},1797).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1775.4,799.4);
// library properties:
lib.properties = {
	id: 'A324A7020435714DAF4CECFAF4C6C73A',
	width: 1550,
	height: 700,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_487.png", id:"CachedBmp_487"},
		{src:"images/shuffle finalBG1_atlas_1.png", id:"shuffle finalBG1_atlas_1"},
		{src:"images/shuffle finalBG1_atlas_2.png", id:"shuffle finalBG1_atlas_2"},
		{src:"images/shuffle finalBG1_atlas_3.png", id:"shuffle finalBG1_atlas_3"},
		{src:"images/shuffle finalBG1_atlas_4.png", id:"shuffle finalBG1_atlas_4"},
		{src:"sounds/ehved_orchestralloop.mp3", id:"ehved_orchestralloop"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['A324A7020435714DAF4CECFAF4C6C73A'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;