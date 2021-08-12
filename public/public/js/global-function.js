	function addCommas(nStr)
	{
	    nStr += '';
	    x = nStr.split('.');
	    x1 = x[0];
	    x2 = x.length > 1 ? '.' + x[1] : '';
	    var rgx = /(\d+)(\d{3})/;
	    while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + ',' + '$2');
	    }
	    return x1 + x2;
	}

	function checkunique(el){
		var xhr;
		xhr && xhr.abort();
		if($("input[name=MODIFY_STATUS]").val()=="INS"){
			var param1="0";
		}else{
			var param1=$("input[name=SYSTEM_ID]").val();
		}
		var param2=$(el).val();
		if (param2 == "") return;
		xhr = $.ajax({
			url: 'unique'+$(el).attr("data-id")+'_' + param1 +'_'+ param2,
			beforeSend: function() {
				onValidationProcess = true;
				$("#saveobject").hide();
				$("."+$(el).attr("id")).removeClass("has-error");
				$("."+$(el).attr("id")).show();
				$("."+$(el).attr("id")).html('<div>validating .... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span></div>');
			},
			success: function(results) {
				if(results == "0") {
					$("."+$(el).attr("id")).html("validation success");
					setTimeout($("."+$(el).attr("id")).hide(),500);
					$("#saveobject").show();
					$("#"+$(el).attr("next-el")).focus();
					//$("#saveobject").focus();
				}else if(results == "2") {
					$("."+$(el).attr("id")).addClass("has-error");
					$("."+$(el).attr("id")).html("Wrong "+$(el).attr("validation-string")+" '"+$(el).val()+"' detected, please update your entry!");
					$("#saveobject").hide();
					$(el).val("");
				}else{
					$("."+$(el).attr("id")).addClass("has-error");
					$("."+$(el).attr("id")).html("Duplicate "+$(el).attr("validation-string")+" '"+$(el).val()+"' detected, please update your entry!");
					$("#saveobject").hide();
					$(el).val("");
				}
				onValidationProcess = false;

			},
			error: function() {
				$("."+$(el).attr("id")).html("Error while validating '"+$(el).val()+"', please try again!");
				$("."+$(el).attr("id")).show();
				$(el).val("");
				$("#saveobject").hide();
				onValidationProcess = false;
			}
		})
	}

	
