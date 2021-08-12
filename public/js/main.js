var originalMarqueeText = "";

socket.on('updateConfig', function(data){
	updateConfig(data);
});

socket.on('refreshServiceList', function(data){
	generateServiceList(data);
});

socket.on('startService', function(vNo){
	$('#'+vNo.replace(/ /g, '')).slideDown();
	$('#'+vNo.replace(/ /g, '')+' td:last-child').html('Sedang diservice');
});

socket.on('endService', function(vNo){
	$('#'+vNo.replace(/ /g, '')+' td:last-child').html('Selesai');
});

socket.on('callCustomer', function(vNo, audioName){
	var customerId = vNo.replace(/ /g, '');
	console.log(customerId);
	console.log(audioName);

	originalMarqueeText = $('.js-marquee').html();

	$('#'+customerId+'-audio').attr("src","http://192.168.1.10/antrian/server/sound/"+audioName);

	$('#'+customerId+'-audio').bind('ended', function(){
		// done playing
		setTimeout(function(){
			document.getElementById('mainVideo').play();
			$('.js-marquee').html(originalMarqueeText);
		},2000)
	});
	
	setTimeout(function(){
		var newText = "Kendaraan dengan nomor polisi "+customerId+" telah selesai diservis, silahkan menuju kekasir";
		$('.js-marquee').html(newText);
		playSound(customerId+'-audio');
	}, 2000);
});

function updateConfig(data){
	$('.js-marquee').html(data.marqueeText);
}

function generateServiceList(data){
	
	$('#service-list').find('tbody>tr').remove();
	
	var counter = 1;
	data.forEach(item =>{
		
		var status = (item.STATUS == 'START' ? 'Sedang diservice' : (item.STATUS == 'FINISH' ? 'Selesai' : ''));
		var hideRow = (status == '' ? ' style="display: none;"' : '');
		var customerId = item.NOPOL.replace(/ /g, '');
		$('#service-list').append('<tr id="'+customerId+ 
			'"' + hideRow + '><td>'+counter+'<audio id="'+customerId+'-audio" /></td><td>'+item.NOPOL+
			'</td><td>'+ item.TIPE+'</td><td>'+ status +
			'</td></tr>');
		counter++;
	});
}

function generateSound(){
	$.get("getsound.php", { nopol : vehicleNumber, fullname : fullName }, function(data){
				
		console.log(data);	

		containerID = 'customername';
		$('#customername').attr('src','sound/'+data);

		document.getElementById(containerID).pause();
		document.getElementById(containerID).currentTime=0;
		document.getElementById(containerID).play();	
	
}, 'text');

}
var totalTime = 0;
	
function playSound(customerId){
	totalTime= 2000;
	document.getElementById('mainVideo').pause();
	callSoundByID('in',totalTime);

	var totalTime2 = document.getElementById(customerId).duration*1000;

	callSoundByID(customerId,totalTime2);
	
}

function callSoundByID(containerID,timeOut){

	/**
	 * Open chrome://flags/#autoplay-policy
	 * Setting No user gesture is required
	 */

	setTimeout(function(){
		document.getElementById(containerID).pause();
		document.getElementById(containerID).currentTime=0;
		var promise = document.getElementById(containerID).play();

		if (promise !== undefined) {
			promise.then(_ => {
				// Autoplay started!
				/*setTimeout(function(){
					document.getElementById('mainVideo').play();
				},17000)*/
				
			}).catch(error => {
				// Autoplay was prevented.
				// Show a "Play" button so that user can start playback.
				console.log(containerID+': '+error);
			});
		}
		
	}, totalTime);
	totalTime = totalTime + timeOut;	
}

$("h3").click(function(){
	var el = document.documentElement
	, rfs = // for newer Webkit and Firefox
		el.requestFullScreen
		|| el.webkitRequestFullScreen
		|| el.mozRequestFullScreen
		|| el.msRequestFullScreen
	;
	if(typeof rfs!="undefined" && rfs){
	rfs.call(el);
	} else if(typeof window.ActiveXObject!="undefined"){
	// for Internet Explorer
	var wscript = new ActiveXObject("WScript.Shell");
	if (wscript!=null) {
		wscript.SendKeys("{F11}");
	}
	}
})

$(document).ready(function(){
	generateServiceList(serviceList);
});