$(document).ready(function() {
	console.log("ready");

	/*ajaxObj = {  
			type: "POST",
			url: "http://localhost:8080/estore/api/user/confirmLogin", 
			data: JSON.stringify(), 
			contentType:"application/json",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("Error " + jqXHR.getAllResponseHeaders() + " " + errorThrown);
				$('#loginstatus').html( "You're not Logged In <a href=''> Login </a>'" );
			},
			success: function(data) { 
				//console.log(data);
				if(data[0].HTTP_CODE == 200) {
					$('#loginstatus').text( "You're Loggen in" );
				}
			},
			//complete: function(XMLHttpRequest) {
				//console.log( XMLHttpRequest.getAllResponseHeaders() );
			//}, 
			dataType: "json" //request JSON
		},
		$.ajax(ajaxObj);

	*/
	var $login_form = $('#login');
		
	/**
	 * This is for the 2nd Submit button "Submit v2"
	 * It will do the same thing as Submit above but the api
	 * will process it in a different way.
	 */
	$('#login_submit_it').click(function(e) {
		console.log("submit button has been clicked");
		e.preventDefault(); //cancel form submit
		
		var jsObj = $login_form.serializeObject()
			, ajaxObj = {};
		
		//console.log(jsObj);
		
		ajaxObj = {  
			type: "POST",
			url: "http://localhost:8080/estore/api/user/login", 
			data: JSON.stringify(jsObj), 
			contentType:"application/json",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("Error " + jqXHR.getAllResponseHeaders() + " " + errorThrown);
				$('#login_div_ajaxResponse').text( "Error" );
			},
			success: function(data) { 
				console.log(data);
				if(data[0].HTTP_CODE == 200) {
					$('#login_div_ajaxResponse').text( data[0].MSG );
				}
			},
			complete: function(XMLHttpRequest) {
				//console.log( XMLHttpRequest.getAllResponseHeaders() );
			}, 
			dataType: "json" //request JSON
		};
		
		$.ajax(ajaxObj);
	});
	
	
	var $newuser_form = $('#add_user');
	
	/**
	 * This is for the 2nd Submit button "Submit v2"
	 * It will do the same thing as Submit above but the api
	 * will process it in a different way.
	 */
	$('#signup_submit_it').click(function(e) {
		//console.log("submit button has been clicked");
		e.preventDefault(); //cancel form submit
		
		var jsObj = $newuser_form.serializeObject()
			, ajaxObj = {};
		
		//console.log(jsObj);
		
		ajaxObj = {  
			type: "POST",
			url: "http://localhost:8080/estore/api/user/new", 
			data: JSON.stringify(jsObj), 
			contentType:"application/json",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("Error " + jqXHR.getAllResponseHeaders() + " " + errorThrown);
			},
			success: function(data) { 
				//console.log(data);
				if(data[0].HTTP_CODE == 200) {
					$('#signup_div_ajaxResponse').text( data[0].MSG );
				}
			},
			complete: function(XMLHttpRequest) {
				//console.log( XMLHttpRequest.getAllResponseHeaders() );
			}, 
			dataType: "json" //request JSON
		};
		
		$.ajax(ajaxObj);
	});

	
	var $newitem_form = $('#add_item');
	
	/**
	 * This is for the 2nd Submit button "Submit v2"
	 * It will do the same thing as Submit above but the api
	 * will process it in a different way.
	 */
	$('#item_submit_it').click(function(e) {
		//console.log("submit button has been clicked");
		e.preventDefault(); //cancel form submit
		
		var jsObj = $newitem_form.serializeObject()
			, ajaxObj = {};
		
		//console.log(jsObj);
		
		ajaxObj = {  
			type: "POST",
			url: "http://localhost:8080/estore/api/item/new", 
			data: JSON.stringify(jsObj), 
			contentType:"application/json",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("Error " + jqXHR.getAllResponseHeaders() + " " + errorThrown);
				$('item_#div_ajaxResponse').text( "Error" );
			},
			success: function(data) { 
				//console.log(data);
				if(data[0].HTTP_CODE == 200) {
					$('#item_div_ajaxResponse').text( data[0].MSG );
				}
			},
			complete: function(XMLHttpRequest) {
				//console.log( XMLHttpRequest.getAllResponseHeaders() );
			}, 
			dataType: "json" //request JSON
		};
		
		$.ajax(ajaxObj);
	});
	
	
	var $inventory = $('#buy_item');
	
	getInventory();
	
	$(document.body).on('click', ':button, .viewItem', function(e) {
		//console.log(this);
		var $this = $(this)
			, itemid = $this.val()
			, $tr = $this.closest('tr')
			, itemname = $tr.find('.itemname').text()
			, itemdesc = $tr.find('.itemdesc').text()
			, itemprice = $tr.find('.itemprice').text();
		
		$('#item_name').text(itemname);
		$('#item_desc').text(itemdesc);
		$('#item_price').text("Rs. " + itemprice + "/-");
		
		$('#update_response').text("");
		$('#buy_item').html("<input type='hidden' id='item_id' value='"+ itemid +"' /><input type='submit' value='Buy Now' class='btn btn-primary' id='submit_it' />");
	});
	
	$inventory.submit(function(e) {
		if(confirm("Confirm Purchase!! ")) {
			e.preventDefault(); //cancel form submit
			
			var obj = $inventory.serializeObject(),
				itemid = $('#item_id').val();
			
			buyItem(obj,itemid);
		}
	});	
});

function buyItem(obj,itemid) {
	
	ajaxObj = {  
			type: "POST",
			url: "http://localhost:8080/estore/api/purchase/" + itemid,
			data: JSON.stringify(obj), 
			contentType:"application/json",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR.responseText);
				$('#update_response').text( "Error" );
			},
			success: function(data) {
				//console.log(data);
				$('#update_response').text( data[0].MSG );
			},
			complete: function(XMLHttpRequest) {
				//console.log( XMLHttpRequest.getAllResponseHeaders() );
				getInventory();
			}, 
			dataType: "json" //request JSON
		};
		
	return $.ajax(ajaxObj);
}

function getInventory() {
	
	var d = new Date()
		, n = d.getTime();
	
	ajaxObj = {  
			type: "GET",
			url: "http://localhost:8080/estore/api/inventory", 
			data: "ts="+n, 
			contentType:"application/json",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR.responseText);
			},
			success: function(data) { 
				//console.log(data);
				var html_string = "";
				
				$.each(data, function(index1, val1) {
					//console.log(val1);
					html_string = html_string + templateGetInventory(val1);
				});
				
				$('#get_inventory').html("<table class='table table-striped table-bordered'>" +
										"<tbody><tr><th>Item</th><th>Price</th><th></th></tr>"+ html_string + "</tbody></table>");
			},
			complete: function(XMLHttpRequest) {
				//console.log( XMLHttpRequest.getAllResponseHeaders() );
			}, 
			dataType: "json" //request JSON
		};
		
	return $.ajax(ajaxObj);
}

function templateGetInventory(param) {
	return '<tr>' +
				'<td class="itemname">' + param.itemname + '</td>' +
				'<td class="itemdesc" style="display:none">' + param.itemdesc + '</td>' +
				'<td class="itemprice">' + param.itemprice + '</td>' +
				'<td><button class="viewItem btn btn-default" value="' + param.itemid + '" type="button">View</button></td>'+
			'</tr>';
}
