$('document').ready(function(){
/* menu animation according to screen */
if ( $(window).width() < 481 ) {
	$('.closeMenu').show();
    $(".closeMenu, #myTab a").click(function(){
	$('.menuTgl').show();
    $(".sidebar").animate({left:'-100%'});
  }); 
  $(".menuTgl").click(function(){
    $(".sidebar").animate({left:0});
	$('.menuTgl').hide();
  });
}
else {
// DO nothings
//$(".sidebar").animate({left:0});
}

$(window).resize(function() {
	if ( $(window).width() > 481 ) {
		$('.menuTgl, .closeMenu').hide();
		
		$(".sidebar").animate({left:0});
	}
	else
	{
	$('.closeMenu').show();
	}
});


    

/* main page and product page carousel animation---------------------------------------------*/
/* carousel---------------- */
	$('#myCarousel').carousel({
	  interval: 5000
	})
	
	$('#customerReview').carousel({
	  interval: 10000
	})


// postcode message for validation generate;

	var msgdiv = $('#form_userPostcode').closest('.control-group').after('<div class ="postcodemsg"/>');

//-- contact email sending using ajax--//

    $('#contact').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var username = $('input[name=displayname]').val();
        var email = $('input[name=email]').val();
        var msg = $('textarea[name=message]').val();


        $.ajax({
            type : 'POST',
            data : {'displayname': username, 'email' : email, 'message' : msg},
            url : base_url + 'site/contact',
            dataType: 'json',
            success: function (response)
            {
                if(response.success == true)
                    {
                        $('#error').html(response.item);
                        window.location = base_url;
                    }
                else
                    {
                        $('#error').html(response.item);
                    }
            }


        });

    });

    $( "#comments" ).click(function( e ) {
        e.preventDefault();
        e.stopPropagation();
        var username = $('input[name=dName]').val();
        var comment = $('textarea[name=comment]').val();

        $.ajax({
            type: 'POST',
            cache: false,
            data:{'dName':username , 'comment':comment},
            url: base_url + 'site/comments',
            dataType : "json",
            success: function(response)

            {
                if(response.success == true){

                    $('#interactivecomment').html(response.item);
                    
                }
                else
                {
                    $('#errorcomment').html(response.item);
            }
            }
        });
    });
    
   $('#profileupdate').live('click',function(e){
        e.preventDefault();
        e.stopPropagation();
	var name = $('input[name="editinputName"]').val();
        var userPhone = $('input[name="userPhone"]').val();
        var userAddress = $('textarea[name="userAddress"]').val();
        var postcode = $('input[name="postcode"]').val();
        var city = $('input[name="city"]').val();
        var password = $('input[name="password"]').val();
        var id = $(this).attr('data-id');

        
        $.ajax({
            type: 'POST',
            cache: false,
            data:{'name':name, 'userPhone':userPhone, 'userAddress':userAddress, 'postcode': postcode , 'city': city ,'password':password , 'id':id},
            url: base_url + 'users/editprofile',
            dataType : "json",
            success: function(response)

            {
                if(response.success == true){

                    $('#personaldetailsinfo').html(response.personaldetailsinfo);
                    $('#errorprofileupdate').html(response.item) .removeClass();
                    $('#infoalert').fadeIn("slow") .fadeOut(3000);
                   
                }
                else
                {
                    $('#errorprofileupdate').html(response.item)
                    .addClass('alert alert-danger');
            }
            }
        });
        
    });
/* Tab Controller of menu------------------------------------------------- */
$('#myTab a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

/* Button Blinker----------------------------- */
function moveClass() {
$('#blink').toggleClass('btn-warning');
}

setInterval(moveClass, 400);
$('.blink').each(function() {
    var elem = $(this);
    setInterval(function() {
        if (elem.css('visibility') == 'hidden') {
            elem.css('visibility', 'visible');
        } else {
            elem.css('visibility', 'hidden');
        }    
    }, 400);
});


/* Check postcode------------------------------------------------- */
    $('#checkpostcode').live('click',function(e){
        e.preventDefault();
        e.stopPropagation();
       
        postcode = $('#postcode').val();
        if (postcode != "")
            {
                $.ajax({
                    type: 'POST',
                    dataType :"json",
                    data :{'postcode':postcode},
                    url : base_url + 'site/postcodecheck',
                    success: function(response)
                    {
                        if(response.success == true)
                            {
                               //alert("Service Available");
							   window.location= base_url +"/site/menu";

                            }
                       else{
                            //alert("Service Not Available");
							$("#errorI").show();
							$("#errorI").append("<div id='myModalAlertI' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>×</button><h3 id='myModalLabel'><div class='cntr'><span style='color:#ff0000'>Service is not available at this postcode </span></div></h3> </div><div class='modal-body cntr'><img src='"+ base_url +"assets/img/bird.png' alt='#' style='max-height:80px'/><h4><span>Please try other POSTCODE </span><br></h4><p>Our delivery areas are: nw1,	nw2, nw3,	nw5,	 nw6, nw8,	nw10,	w11, w1, w2, w9, w10</p></div><div class='modal-footer cntr'><button class='btn btn-danger' data-dismiss='modal' aria-hidden='true'>Close</button></div></div>");
							$('#myModalAlertI').delay(1000).modal('show').delay(1000);
                       }
                    }
                });
            }
            
       else
           {
       //alert("Empty postcode");
		$("#errorE").show();
		$("#errorE").append("<div id='myModalAlertE' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>×</button><h3 id='myModalLabel'><div class='cntr'><span style='color:#ff0000'>No postcode has been detected </span> </div></h3> </div><div class='modal-body cntr'><img src='"+ base_url +"assets/img/bird.png' alt='#' style='max-height:80px'/><h4><span>Try Again !</span><br></h4><p>Our delivery areas are: nw1,	nw2, nw3,	nw5,	 nw6, nw8,	nw10,	w11, w1, w2, w9, w10</p></div><div class='modal-footer cntr'><button class='btn btn-danger' data-dismiss='modal' aria-hidden='true'>Close</button></div></div>");
		$('#myModalAlertE').delay(1000).modal('show').delay(1000);
           }
    });
    
    $('#selectorId').change(function(e){
        
    $('#deliveryAt').html($(this).val());
	data = $(this).val();

	$.ajax({
                    type: 'POST',
                    dataType :"json",
                    data :{'deliverytime':data},
                    url : base_url + 'cart/urlencode',
                    success: function(response)
                    {
                        if(response.success == true)
                            {
                             $('#deliveryTime').val(response.item);

//  alert("Password Changed"); 
                            }
                       else{
                            alert(response.item);
                       }
                    }
                });

    
    });
    
    $("#specialMessage").change(function(e){
      
      $('#msg').html($(this).val());
/*	$.ajax({
                    type: 'POST',
                    dataType :"json",
                    data :{'password':pwd , 'userid': userid},
                    url : base_url + 'users/passwordchange',
                    success: function(response)
                    {
                        if(response.success == true)
                            {
                               alert("Password Changed"); 
                            }
                       else{
                            alert(response.item);
                       }
                    }
                });
*/
                
    });

   $('.passwordchange').live('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	pwd = $('.changepwd').val();

	userid = $(this).attr('userid');
	if(pwd != "")
	{
		$.ajax({
                    type: 'POST',
                    dataType :"json",
                    data :{'password':pwd , 'userid': userid},
                    url : base_url + 'users/passwordchange',
                    success: function(response)
                    {
                        if(response.success == true)
                            {
                               $('#infoalert').fadeIn("slow") .fadeOut(3000);
                            }
                       else{
                            alert(response.item);
                       }
                    }
                });
	}
	else
	{
		alert("Password should not be empty");
	}
	
	});

    $('#form_userPostcode').live('change',function(e) {
        e.preventDefault();
        e.stopPropagation();
        postcode = $('#form_userPostcode').val();
        if (postcode != "")
        {
            $.ajax({
                type: 'POST',
                dataType: "json",
                data: {'postcode': postcode},
                url: base_url + 'site/postcodecheck',
                success: function(response)
                {
                    if (response.success == true)
                    {
                        $('.postcodemsg').html('Valid Postcode');
                        $('.postcodemsg').removeClass('alert-danger');
                        $('.postcodemsg').addClass('alert alert-success');
                        

                    }
                    else {
                        $('.postcodemsg').html('Invalid Postcode');
                        $('.postcodemsg').removeClass('alert-success');
                        $('.postcodemsg').addClass('alert alert-danger');;
                    }
                }
            });
        }

        else
        {
            alert("Empty postcode");
        }

    });


    $('.userPostcode').change(function(e) {
        e.preventDefault();
        e.stopPropagation();
        postcode = $(this).val();
        if (postcode != "")
        {
            $.ajax({
                type: 'POST',
                dataType: "json",
                data: {'postcode': postcode},
                url: base_url + 'site/postcodecheck',
                success: function(response)
                {
                    if (response.success == true)
                    {
			
                        $('.postcodemsg').html('Valid Postcode');

                    }
                    else {
			
                        $('.postcodemsg').html('Invalid Postcode');
                    }
                }
            });
        }

        else
        {
            alert("Empty postcode");
        }

    });

$("#commentspost").live('click',function(e){
 	e.preventDefault();
        e.stopPropagation();
        var data = $('form').serialize();
        {
            $.ajax({
                type: 'POST',
                dataType: "json",
                data: data,
                url: base_url + 'site/comments',
                success: function(response)
                {
                    if (response.success == true)
                    {
			
			$('.modal-body').html(response.item);
                    }
                    else {
			 $('.errorcomments').html(response.item);
                    }
                }
            });
        }


});



	$("#paybycard").live('click',function(e){
	 	e.preventDefault();
		e.stopPropagation();
		specialmsg   = $("#msg").html();
		deliverytime = $('#deliveryTime').val();

		window.location.href = base_url + "cart/payment/"+ deliverytime +"/"+ specialmsg;

	});


	$(".addtocart").live('click',function(e){

	e.preventDefault();
        e.stopPropagation();
        var data = $(this).attr('data-order-id');
        {
            $.ajax({
                type: 'POST',
                dataType: "json",
                data: {'order_id': data},
                url: base_url + 'cart/reorder',
                success: function(response)
                {
                    if (response.success == true)
                    {		

		     $.each(response.item,function(i,item){
			    simpleCart.add({
			    id : response.item[i]['item_id'],
			    name: response.item[i]['item_name'] ,
			    price: response.item[i]['item_price'] ,
			    quantity: response.item[i]['item_quantity']
	    			});
			});
		
		 window.location.href = base_url + "cart/checkout";
                  }
                    else {
			 $('.errorcomments').html(response.item);
                    }
                }
            });
        }
	

	});

});
