/**
 * js file for post.html
 * Please use modern web browser as this file will not attempt to be
 * compatible with older browsers. Use Chrome and open javascript console
 * or Firefox with developer console.
 * 
 * jquery is required
 */
$(document).ready(function() {
	
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
		$('#item_price').text(itemprice);
		
		$('#update_response').text("");
		$('#buy_item').html("<input type='hidden' id='item_id' value='"+ itemid +"' /><input type='submit' id='submit_it' />");
	});
	
	$inventory.submit(function(e) {
		e.preventDefault(); //cancel form submit
		
		var obj = $inventory.serializeObject(),
			itemid = $('#item_id').val();
		
		buyItem(obj,itemid);
	});
/*	$('#submit_it').click(function(e) {
		//console.log("submit button has been clicked");
		e.preventDefault(); //cancel form submit
		
		var jsObj = $post_example.serializeObject()
			, ajaxObj = {};
		
		//console.log(jsObj);
		
		ajaxObj = {  
			type: "POST",
			url: "http://localhost:8080/estore/api/purchase", 
			data: JSON.stringify(jsObj), 
			contentType:"application/json",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("Error " + jqXHR.getAllResponseHeaders() + " " + errorThrown);
				$('#div_ajaxResponse').text( "Error" );
			},
			success: function(data) { 
				//console.log(data);
				if(data[0].HTTP_CODE == 200) {
					$('#div_ajaxResponse').text( data[0].MSG );
				}
			},
			complete: function(XMLHttpRequest) {
				//console.log( XMLHttpRequest.getAllResponseHeaders() );
			}, 
			dataType: "json" //request JSON
		};
		
		$.ajax(ajaxObj);
	}); */
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
										"<tbody><tr><th>Item</th><th>Desc</th><th>Price</th><th></th></tr>"+ html_string + "</tbody></table>");
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
				'<td class="itemdesc">' + param.itemdesc + '</td>' +
				'<td class="itemprice">' + param.itemprice + '</td>' +
				'<td><button class="viewItem" value="' + param.itemid + '" type="button">View</button></td>'+
			'</tr>';
}
