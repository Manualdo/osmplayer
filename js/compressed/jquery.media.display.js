/**
 *  Copyright (c) 2010 Alethia Inc,
 *  http://www.alethia-inc.com
 *  Developed by Travis Tidwell | travist at alethia-inc.com 
 *
 *  License:  GPL version 3.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{volume:80,autostart:false,streamer:"",embedWidth:450,embedHeight:337,wmode:"transparent"});jQuery.fn.mediadisplay=function(b){if(this.length===0){return null;}return new (function(d,c){c=jQuery.media.utils.getSettings(c);this.display=d;var e=this;this.volume=0;this.player=null;this.reflowInterval=null;this.updateInterval=null;this.progressInterval=null;this.playQueue=[];this.playerReady=false;this.loaded=false;this.mediaFile=null;this.width=0;this.height=0;this.checkPlayType=function(g,f){if((typeof g.canPlayType)=="function"){return("no"!=g.canPlayType(f))&&(""!=g.canPlayType(f));}else{return false;}};this.getPlayTypes=function(){var f={};var g=document.createElement("video");f.ogg=this.checkPlayType(g,"video/ogg");f.h264=this.checkPlayType(g,"video/mp4");g=document.createElement("audio");f.audioOgg=this.checkPlayType(g,"audio/ogg");f.mp3=this.checkPlayType(g,"audio/mpeg");return f;};this.playTypes=this.getPlayTypes();this.setSize=function(g,f){this.width=g?g:this.width;this.height=f?f:this.height;this.display.css({height:this.height+"px",width:this.width+"px"});if(this.playerReady&&this.width&&this.height){this.player.player.width=this.width;this.player.player.height=this.height;this.player.setSize(g,this.height);}};this.reset=function(){this.loaded=false;clearInterval(this.progressInterval);clearInterval(this.updateInterval);clearTimeout(this.reflowInterval);this.playQueue.length=0;this.playQueue=[];this.playerReady=false;this.mediaFile=null;};this.resetContent=function(){this.display.empty();this.display.append(this.template);};this.addToQueue=function(f){if((typeof f)=="array"){f=this.getPlayableMedia(f);}if(f){this.playQueue.push(f);}};this.getPlayableMedia=function(j){var h=null;var f=j.length;while(f--){var g=this.getMediaFile(j[f]);if(!h||(g.weight<h.weight)){h=g;}}return h;};this.loadFiles=function(f){if(f){this.playQueue.length=0;this.playQueue=[];this.addToQueue(f.intro);this.addToQueue(f.commercial);this.addToQueue(f.prereel);this.addToQueue(f.media);this.addToQueue(f.postreel);}return(this.playQueue.length>0);};this.playNext=function(){if(this.playQueue.length>0){this.loadMedia(this.playQueue.shift());}};this.loadMedia=function(f){if(f){f=this.getMediaFile(f);this.stopMedia();if(!this.mediaFile||(this.mediaFile.player!=f.player)){this.player=null;this.playerReady=false;if(f.player){this.player=this.display["media"+f.player](c,function(g){e.onMediaUpdate(g);});}if(this.player){this.player.createMedia(f);this.startReflow();}}else{if(this.player){this.player.loadMedia(f);}}this.mediaFile=f;this.onMediaUpdate({type:"initialize"});}};this.getMediaFile=function(f){var g={};f=(typeof f==="string")?{path:f}:f;g.duration=f.duration?f.duration:0;g.bytesTotal=f.bytesTotal?f.bytesTotal:0;g.quality=f.quality?f.quality:0;g.stream=c.streamer?c.streamer:f.stream;g.path=f.path?jQuery.trim(f.path):(c.baseURL+jQuery.trim(f.filepath));g.extension=f.extension?f.extension:this.getFileExtension(g.path);g.weight=f.weight?f.weight:this.getWeight(g.extension);g.player=f.player?f.player:this.getPlayer(g.extension,g.path);g.type=f.type?f.type:this.getType(g.extension);return g;};this.getFileExtension=function(f){return f.substring(f.lastIndexOf(".")+1).toLowerCase();};this.getPlayer=function(g,f){switch(g){case"ogg":case"ogv":return this.playTypes.ogg?"html5":"flash";case"mp4":case"m4v":return this.playTypes.h264?"html5":"flash";case"oga":return this.playTypes.audioOgg?"html5":"flash";case"mp3":return this.playTypes.mp3?"html5":"flash";case"flv":case"f4v":case"mov":case"3g2":case"m4a":case"aac":case"wav":case"aif":case"wma":return"flash";default:if(g.substring(0,3).toLowerCase()=="com"){if(f.search(/^http(s)?\:\/\/(www\.)?vimeo\.com/i)==0){return"vimeo";}else{if(f.search(/^http(s)?\:\/\/(www\.)?youtube\.com/i)==0){return"youtube";}}}}return"";};this.getType=function(f){switch(f){case"ogg":case"ogv":case"mp4":case"m4v":case"flv":case"f4v":case"mov":case"3g2":return"video";case"oga":case"mp3":case"m4a":case"aac":case"wav":case"aif":case"wma":return"audio";}};this.getWeight=function(f){switch(f){case"mp4":case"m4v":case"m4a":return 5;case"ogg":case"ogv":return this.playTypes.ogg?5:10;case"oga":return this.playTypes.audioOgg?5:10;case"mp3":return 6;case"mov":case"flv":case"f4v":case"3g2":return 7;case"wav":case"aif":case"aac":return 8;case"wma":return 9;}};this.onMediaUpdate=function(g){switch(g.type){case"playerready":this.playerReady=true;clearTimeout(this.reflowInterval);this.player.setVolume(0);this.startProgress();break;case"buffering":this.startProgress();break;case"stopped":clearInterval(this.progressInterval);clearInterval(this.updateInterval);break;case"paused":clearInterval(this.updateInterval);break;case"playing":this.startUpdate();break;case"progress":var f=this.getPercentLoaded();jQuery.extend(g,{percentLoaded:f});if(f>=1){clearInterval(this.progressInterval);}break;case"update":case"meta":jQuery.extend(g,{currentTime:this.player.getCurrentTime(),totalTime:this.getDuration(),volume:this.player.getVolume(),quality:this.getQuality()});break;case"complete":this.playNext();break;}if(g.type=="playing"&&!this.loaded){this.loaded=true;this.player.setVolume((c.volume/100));if(!c.autostart){this.player.pauseMedia();c.autostart=true;}else{this.display.trigger("mediaupdate",g);}}else{this.display.trigger("mediaupdate",g);}};this.startReflow=function(){clearTimeout(this.reflowInterval);this.reflowInterval=setTimeout(function(){var f=parseInt(e.display.css("marginLeft"),10);e.display.css({marginLeft:(f+1)});setTimeout(function(){e.display.css({marginLeft:f});},1);},2000);};this.startProgress=function(){if(this.playerReady){clearInterval(this.progressInterval);this.progressInterval=setInterval(function(){e.onMediaUpdate({type:"progress"});},500);}};this.startUpdate=function(){if(this.playerReady){clearInterval(this.updateInterval);this.updateInterval=setInterval(function(){if(e.playerReady){e.onMediaUpdate({type:"update"});}},1000);}};this.stopMedia=function(){this.loaded=false;clearInterval(this.progressInterval);clearInterval(this.updateInterval);clearTimeout(this.reflowInterval);if(this.playerReady){this.player.stopMedia();}};this.mute=function(f){if(f){this.volume=this.player.getVolume();this.player.setVolume(0);}else{this.player.setVolume(this.volume);}};this.getPercentLoaded=function(){var g=this.player.getBytesLoaded();var f=this.mediaFile.bytesTotal?this.mediaFile.bytesTotal:this.player.getBytesTotal();return f?(g/f):0;};this.showControls=function(f){if(this.playerReady){this.player.showControls(f);}};this.hasControls=function(){if(this.player){return this.player.hasControls();}return false;};this.getDuration=function(){if(!this.mediaFile.duration){this.mediaFile.duration=this.player.getDuration();}return this.mediaFile.duration;};this.getQuality=function(){if(!this.mediaFile.quality){this.mediaFile.quality=this.player.getQuality();}return this.mediaFile.quality;};this.setSize(this.display.width(),this.display.height());})(this,b);};})(jQuery);