


if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, ''); 
    }
}


//remove item
function remove_item(res_id,id,mob){
    var opts = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 0, // Top position relative to parent in px
        left: 0 // Left position relative to parent in px
    };
    var target = document.getElementById('cart_spinner_center');
    var spinner = new Spinner(opts).spin(target);
    $.ajax({
        type: 'POST',
        url: '/Cart/remove_item/'+res_id+'/'+id,
        success: function(return_data){
//console.log(return_data);
            var data=JSON.parse(return_data);
// console.log(data);
            if(mob==0)
                show_cart(data);
                else
                    show_mobile_cart(data);
        }
    });

}



//decrease qnty
function decrease_quant(res_id,id,qnty,mob){
    if(qnty>1)
    {
        $.ajax({
            type: 'POST',
            url: '/Cart/decrease_quant/'+res_id+'/'+id,
            success: function(return_data){
//console.log(return_data);
                var data=JSON.parse(return_data);
//  console.log(data);
                if(mob==0)
                show_cart(data);
                else
                    show_mobile_cart(data);
            }
        });
    }else
    {
        bootbox.alert("Minimum Quantity should be 1 <br/> Press Delete for remove item from cart");
    }
}

//increase qnty
function increase_quant(res_id,id,qnty,mob){
  //  alert(document.getElementById('cartInfo').style.width);
    if(qnty<500)
    {
        var opts = {
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 0, // Top position relative to parent in px
            left: 0 // Left position relative to parent in px
        };
        var target = document.getElementById('cart_spinner_center');
        var spinner = new Spinner(opts).spin(target);

        $.ajax({
            type: 'POST',
            url: '/Cart/increase_quant/'+res_id+'/'+id,
            success: function(return_data){
//console.log(return_data);
                var data=JSON.parse(return_data);
// console.log(data);
                if(mob==0)
                show_cart(data);
                else
                    show_mobile_cart(data);
            }
        });
    }else{
        bootbox.alert("Quantity should be less than 500 <br/>For more then 500 quantity <br/> please contact on 1866-519-9155");
    }
}


//Cart Position
//var windw = this;
//
//$.fn.followTo = function ( pos ) {
//    var $this = this,
//        $window = $(windw);
//    $window.scroll(function(e){
//        var scrollBottom = $(document).height() - $this.height() - $(window).scrollTop() ;
////alert(scrollBottom);
//
//        if (scrollBottom < pos) {
//            $this.css({
//                position: 'absolute',
//                top: $(window).scrollTop()+scrollBottom-pos
//            });
//        } else {
//            $this.css({
//                position: 'fixed',
//                top:''
//
//            });
//            // $this.style.removeProperty('bottom');
//        }
//    });
//};

//Refresh cart data
var surcharge='';
 var restaurants_name='';
function show_cart(data){
  //  console.log("show cart");
  //  alert("show cart");
   
    if(data['isset'])
        restaurants_name= '('+data['restaurant_details'][0]['restaurant']['name']+')' ;
	  if(data['isset'])
        surcharge=Number(data['restaurant_details'][0]['restaurant']['Surcharge']).toFixed(2);
	 

    var cart_data='';
    if(data['isset']){

        var subtotal='<div class="totalPrice">Sub Total <span class="simpleCart_GrandTotal pull-right">$'+Number(data['subtotal']).toFixed(2)+'</span></div>';
		if(data['surcharge']!=0){
        var tax='<div class="totalPrice">Tax<span class="simpleCart_GrandTotal pull-right">$'+(Number(data['tax'])-Number(data['surcharge'])).toFixed(2)+'</span></div><div class="totalPrice">Surcharge<div class="popup" onclick="myFunction()"><a>&nbsp;<i class="icon-info-sign"></i></a><span class="popuptext" id="myPopup"></span></div><span class="simpleCart_GrandTotal pull-right">$'+Number(data['surcharge']).toFixed(2)+'</span></div>';
		}
		else{
			var tax='<div class="totalPrice">Tax<span class="simpleCart_GrandTotal pull-right">$'+Number(data['tax']).toFixed(2)+'</span></div>';
		}
        var total='<div class="totalPrice">Grand Total<span class="simpleCart_grandTotal">$'+Number(data['total']).toFixed(2)+'</span></div>';
        var discount='';
        if(data['discount']>0){
            var discount_amount='';
            if(data['restaurant_details'][0]['restaurant']['discount_type']=='Amount')
                discount_amount=discount_amount+'$ ';
            discount_amount=data['restaurant_details'][0]['restaurant']['discount']
            if(data['restaurant_details'][0]['restaurant']['discount_type']=='Percentage')
                discount_amount=discount_amount+' %';

            discount='<div class="totalPrice">Discount ( '+discount_amount+' )<span class="simpleCart_Discount  pull-right">$'+Number(data['discount']).toFixed(2)+'</span></div>';
        }
        var min_price=''
		if((data['restaurant_details'][0]['restaurant']['delivery']==1) || (data['restaurant_details'][0]['restaurant']['is_third_party']==1)){
			if(data['restaurant_details'][0]['restaurant']['delivery']==1){
				if(data['restaurant_details'][0]['restaurant']['min_order_price']>data['subtotal']){
					min_price='<div class="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Minimum Subtotal for Delivery should be $' + data['restaurant_details'][0]['restaurant']['min_order_price'] + '</div>';
				}
			} else {
				if(data['restaurant_details'][0]['third_party_deliveries']['minimum_delivery_charge']>data['subtotal']){
					min_price='<div class="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Minimum Subtotal for Delivery should be $' + data['restaurant_details'][0]['third_party_deliveries']['minimum_delivery_charge'] + '</div>';
				}
			}
		}
//console.log(data['restaurant_details'][0]['restaurant']['min_order_price']);
        var parser = document.createElement('a');
        parser.href = document.URL;
        var res = parser.pathname.split("/");
        var ur="";
        if(res[1].localeCompare('DirectOrders')==0)
            ur="/"+res[1];
// console.log(data[data['key']]);
        var cart_items='';
        if(data['isset'])
        for(var i=0;i<data[data['key']].length;i++){
            cart_items=cart_items+'<tr class="itemRow row-0 odd" id="cartItem_'+data[data['key']][i]['fid']+'"><td class="item-name">'+data[data['key']][i]['details']['food']['name']+'</td><td class="item-total">$'+(Number(data[data['key']][i]['quantity']*data[data['key']][i]['price']).toFixed(2))+'</td><td class="item-custom"><div class="pull-right"><div class="btn-group">+<span class="btn btn-mini">'+data[data['key']][i]['quantity']+'</span><a href="javascript:;" id="'+i+'" onclick="increase_quant('+data['restaurant_details'][0]['restaurant']['id']+','+i+','+data[data['key']][i]['quantity']+',0)"  class="simpleCart_increment btn btn-mini"';
            if(data[data['key']][i]['quantity']>=500)
                cart_items=cart_items+'disabled="disabled"';
            cart_items=cart_items+'> <i class="icon-plus"></i> </a><a href="javascript:;" onclick="decrease_quant('+data['restaurant_details'][0]['restaurant']['id']+','+i+','+data[data['key']][i]['quantity']+',0)" class="simpleCart_decrement btn btn-mini"';
            if(data[data['key']][i]['quantity']<=1)
                cart_items=cart_items+'disabled="disabled"';
            cart_items=cart_items+'> <i class="icon-minus"></i> </a><a href="javascript:;" class="simpleCart_remove btn btn-danger btn-mini" onclick="remove_item('+data['restaurant_details'][0]['restaurant']['id']+','+i+',0)"> <i class="icon-remove"></i></a></div></div></td></tr>';
        }
        var aka_type = getCookie('order');
        if(aka_type=='Pickup')
        {
            cart_data='<div id="cart" class="simpleCart_items"><table><tbody><tr class="headerRow"><th class="item-name">Name</th><th class="item-total">Price</th><th class="item-custom">Edit</th></tr>'+cart_items+'</tbody></table></div>'+subtotal+tax+discount+total+min_price+'<center><label class="rad_aka">&nbsp;<input type="radio" onchange="handleChange1()" value="Pickup" name="order_type" id="order_type" checked="checked"> <i class="icon-briefcase" alt="Pickup Avaliable"></i>&nbsp;Pickup &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" onchange="handleChange1()" value="Delivery" name="order_type" id="order_type"> <i class="icon-truck" alt="Delivery Avaliable"></i>&nbsp;Delivery &nbsp;</label></center><div id="checkOutBtn"><a class="btn btn-success btn-block btn-large" href="'+ur+'/checkout">CHECKOUT</a></div>';
        }
        else
        {
            cart_data='<div id="cart" class="simpleCart_items"><table><tbody><tr class="headerRow"><th class="item-name">Name</th><th class="item-total">Price</th><th class="item-custom">Edit</th></tr>'+cart_items+'</tbody></table></div>'+subtotal+tax+discount+total+min_price+'<center><label class="rad_aka">&nbsp;<input type="radio" onchange="handleChange1()" value="Pickup" name="order_type" id="order_type"> <i class="icon-briefcase" alt="Pickup Avaliable"></i>&nbsp;Pickup &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" onchange="handleChange1()" value="Delivery" name="order_type" id="order_type" checked="checked"> <i class="icon-truck" alt="Delivery Avaliable"></i>&nbsp;Delivery &nbsp;</label></center><div id="checkOutBtn"><a class="btn btn-success btn-block btn-large" href="'+ur+'/checkout">CHECKOUT</a></div>';
        }
        
        
    } else {
        cart_data='<img src="/img/empty_cart.png" alt="">';
    }
    
    var cart='<span id="cart_spinner_center" style="position: absolute;display: block;top: 50%;left: 50%;"></span><h4 class="notice-title yourCart" id="cart_ico" style="background:#c83a3a"><i></i>CART '+restaurants_name+' </h4><div class="notice">'+cart_data+'</div>';
    $( "#cartbox" ).html(cart);

    var no_of_item=0;

    if(data['isset'])
    {
       no_of_item=data[data['key']].length;
    }
    
        
    $("#cartInfo").html('<a href="#" role="button"  onclick="get_cart()" class="btn btn-success">[ '+no_of_item+' ] Items</a><a class="btn btn-warning" href='+ur+'/checkout" > Checkout $'+data['total']+'</a>');


}
//function delete_cookie(cname) {
//  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//}

function handleChange1()
    {
        var order_type = $("input[name='order_type']:checked").val();
//        $.ajax({
//        type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
//        url         : '/restaurants/addsession', // the url where we want to POST
//        data        :  {order_type:order_type}, // our data object
//        dataType    : 'json', // what type of data do we expect back from the server
//        encode          : true
//    })
//     
        //alert(getCookie('order'));
       // delete_cookie('order');
        setCookie('order',order_type);
        //console.log(" cookies name "+getCookie('order'))
        
        
    }
Object.keys = Object.keys || (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        DontEnumsLength = DontEnums.length;

    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");

        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }

        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }
        }

        return result;
    };
})();

// add food to cart

function addtocart(res_id,id){
    var opts = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 0, // Top position relative to parent in px
        left: 0 // Left position relative to parent in px
    };
    var target = document.getElementById('body_spinner_center');
    var spinner = new Spinner(opts).spin(target);

    $.ajax({
        url:'/restaurants/get_item/'+id,
        success:function(return_data){
            
            var data=jQuery.parseJSON(return_data);
            var keys=Object.keys(data.modifiers);
            var  modifiers='';
            for(var i=0;i<keys.length;i++){
                modifiers+='<div class="row"><div class="span1"><strong>'+data.modifiers[keys[i]]["modifiers"]["name"]+'</strong></div><div class="span4"><div class="row">';
                var choice_keys=(Object.keys(data.modifiers[keys[i]]['choices']));
                for(var j=0;j<choice_keys.length;j++){
                    
                    price='';
                    if(data['modifiers'][keys[i]]['choices'][choice_keys[j]]['price']>0)
                        price=' ($'+data['modifiers'][keys[i]]['choices'][choice_keys[j]]['price']+')';
                    
                    mod_name="";
                    if(data['modifiers'][keys[i]]['choices'][choice_keys[j]]['is_cat_level']==1)
                        mod_name=data['modifiers'][keys[i]]['modifiers']['id']+"_cat_lavel";
                    else
                        mod_name=data['modifiers'][keys[i]]['modifiers']['id'];
                    
                    modifiers+='<div class="span2"><p  class="capitalize"><input type="'+data['modifiers'][keys[i]]['modifiers']['mode']+'" name="'+mod_name+'[]" id="'+data['modifiers'][keys[i]]['choices'][choice_keys[j]]['id']+'" value="'+data['modifiers'][keys[i]]['choices'][choice_keys[j]]['id']+'"';
                    
                    if(data['modifiers'][keys[i]]['modifiers']['mode']=='radio' && j==0)
                        modifiers+='checked="checked"'
                        modifiers+=' >  '+data['modifiers'][keys[i]]['choices'][choice_keys[j]]['name']+price+'</p></div>'
                }
                modifiers+='</div><br/></div></div>';
            }
            
            if(data['food']['image']=='' || data['food']['image']==null)
                image='/img/default.png';
            else
              //  image='http://www.foodnearu.com/system/uploads/menu/'+data['food']['image'];
                image =data["food"]["img_path"]+data["food"]["category_id"]+"/"+data["food"]["image"];
            
            var description='';
            if(data['food']['description']!=null && data['food']['description'].length)
                description='<strong>Description:</strong>'+data['food']['description'];
            spinner.stop();
           var a = data['food']['price'];
            var b = data['category'];
           var c = parseFloat(a) + parseFloat(b)
            bootbox.dialog({
                message: '<form id="add_item" name="add_item" ><div class="well well-small"><div class="row"><div class="span2"><a class="displayImg item_add" href="javascript:;"><img id="btnSocial" alt="'+data['food']['name']+'" style="border:1px solid #CCC;margin-right:5%"  src="'+image+'" ></a>'+description+'</div><div class="span3"><strong>Price: $'+c+'<strong><br/>Quantity: <strong><input type="number"  name="quantity"  min="1" max="500"  pattern="[0-9]*" id="quantity" value=1 required/><br/>Special Instructions:</strong><textarea name="description" id="description" placeholder="Special Instructions"></textarea></div></div><br/>'+modifiers+'<center class="row-fluid"><button type="Submit"  style="margin:5%" class="btn btn-success">Add to Cart</button><button type="button" class="btn btn-danger" style="margin:5%"  data-dismiss="modal">Cancel</button></center></div></form>',
                title: data['food']['name']
            });

            $( "#add_item" ).validate({
                rules: {
                    quantity: {
                        required: true,
                        min:1,
                        max:500

                    }
                },
                messages: {
                    quantity: {

                        required:"    Numeric values allowed",
                        min:"      minimum quantity should be 1 ",
                        max:"     maximum quantity 500 <br/> for more call on 1866-519-9155"
                    }
                },
                submitHandler: function (form) { // for demo

                  var opts = {
                    lines: 13, // The number of lines to draw
                    length: 20, // The length of each line
                    width: 10, // The line thickness
                    radius: 30, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    direction: 1, // 1: clockwise, -1: counterclockwise
                    color: '#000', // #rgb or #rrggbb or array of colors
                    speed: 1, // Rounds per second
                    trail: 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: 0, // Top position relative to parent in px
                    left: 0 // Left position relative to parent in px
                };
                var target = document.getElementById('modal_spinner_center');
                var spinner = new Spinner(opts).spin(target);

                data_url='/restaurants/addtocart/'+res_id+'/'+id;
//  console.log(data_url);
                $.ajax({
                    type: "POST",
                    url: data_url,
                    data: $( "#add_item" ).serialize(),
                    success: function(return_data) {
					//console.log(return_data);
                        var data=JSON.parse(return_data);
//console.log(data);
                        show_cart(data);                        
                        bootbox.hideAll();
						//alert(location.hostname);
						if(document.URL=='http://'+location.hostname+'/#')
							document.location.href="/restaurants/categories/"+res_id;			
						
                    }
                });

            }
        });
        },
        error:function(w,t,f){
            //console.log(w);
            return;
        }
    });
}



//Mobile footer Cart
function get_cart(){
       $.ajax({
        url:'/Cart/get_cart_details',
        success:function(return_data){
//console.log(return_data);
            var data=JSON.parse(return_data);
           // console.log(data);
            var cart_data='';
            if(data['isset']){

                var subtotal='<span id="cart_spinner_center" style="position: absolute;display: block;top: 50%;left: 50%;"></span><div class="totalPrice">Sub Total <span class="simpleCart_GrandTotal pull-right">$'+data['subtotal']+'</span></div>';
                var tax='<div class="totalPrice">Tax + Surcharge<span class="simpleCart_GrandTotal pull-right">$'+data['tax']+'</span></div>';
                var total='<div class="totalPrice">Grand Total<span class="simpleCart_grandTotal">$'+data['total']+'</span></div>';
                var discount='';
                if(data['discount']>0){
                    var discount_amount='';
                    if(data['restaurant_details'][0]['restaurant']['discount_type']=='Amount')
                        discount_amount=discount_amount+'$ ';
                    discount_amount=data['restaurant_details'][0]['restaurant']['discount']
                    if(data['restaurant_details'][0]['restaurant']['discount_type']=='Percentage')
                        discount_amount=discount_amount+' %';

                    discount='<div class="totalPrice">Discount ( '+discount_amount+' )<span class="simpleCart_Discount  pull-right">$'+data['discount']+'</span></div>';
                }
                var min_price=''
                if(data['restaurant_details'][0]['restaurant']['min_order_price']>data['subtotal']){
                    min_price='<div class="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Minimum Subtotal for Delivery should be $' + data['restaurant_details'][0]['restaurant']['min_order_price'] + '</div>';
                }

                var cart_items='';
                for(var i=0;i<data[data['key']].length;i++){
                    cart_items=cart_items+'<tr class="itemRow row-0 odd" id="cartItem_'+data[data['key']][i]['fid']+'"><td class="item-name">'+data[data['key']][i]['details']['food']['name']+'</td><td class="item-total">$'+(data[data['key']][i]['quantity']*data[data['key']][i]['price'])+'</td><td class="item-custom"><div class="pull-right"><div class="btn-group">+<span class="btn btn-mini">'+data[data['key']][i]['quantity']+'</span><a href="javascript:;" onclick="increase_quant('+data['restaurant_details'][0]['restaurant']['id']+','+i+','+data[data['key']][i]['quantity']+',1)"  class="simpleCart_increment btn btn-mini"> <i class="icon-plus"></i> </a><a href="javascript:;" onclick="decrease_quant('+data['restaurant_details'][0]['restaurant']['id']+','+i+','+data[data['key']][i]['quantity']+',1)" class="simpleCart_decrement btn btn-mini"';
                    if(data[data['key']][i]['quantity']<=1)
                        cart_items=cart_items+'disabled="disabled"';
                    cart_items=cart_items+'> <i class="icon-minus"></i> </a><a href="javascript:;" class="simpleCart_remove btn btn-danger btn-mini" onclick="remove_item('+data['restaurant_details'][0]['restaurant']['id']+','+i+',1)"> <i class="icon-remove"></i></a></div></div></td></tr>';
                }

                var parser = document.createElement('a');
                parser.href = document.URL;
                var res = parser.pathname.split("/");
                var ur="";
                if(res[1].localeCompare('DirectOrders')==0)
                    ur="/"+res[1];
                
                cart_data='<div  class="simpleCart_items"><table><tbody><tr class="headerRow"><th class="item-name">Name</th><th class="item-total">Price</th><th class="item-custom">Edit</th></tr>'+cart_items+'</tbody></table></div>'+subtotal+tax+discount+total+min_price+'<center class="row-fluid"><a class="btn btn-success" href="'+ur+'/checkout" > Checkout</a></center>';
                
                title="Cart ("+data['restaurant_details'][0]['restaurant']['name']+")";
            } else {
                cart_data='<img src="/img/empty_cart.png" alt="">';
                title="Cart (Empty)";
            }
            var cart='<div id="cart" class="notice">'+cart_data+'</div>';
             bootbox.dialog({
                message: cart,
                title: title
            });
            return;
        },
        error:function(w,t,f){
         //   console.log(w);
            return;
        }
    });
}




function reload_cart(){
      
        setTimeout(function(){
        $.ajax({
            url:'/Cart/get_cart_details',
            cache: false,
            success:function(return_data){
                
//                console.log(return_data);
                var data=JSON.parse(return_data);
                if(data['isset']){
                    show_cart(data);
                }
                return;

            },
            error:function(w,t,f){
           //     console.log(w);
                return;
            }
        });
    }, 1);


}


//Refresh cart data
function show_mobile_cart(data){
   // console.log(data);
    alert("show mobile cart");
    var restaurants_name='';
    if(data['isset'])
        restaurants_name= '('+data['restaurant_details'][0]['restaurant']['name']+')' ;

    var cart_data='';
    if(data['isset']){
                var subtotal='<span id="cart_spinner_center" style="position: absolute;display: block;top: 50%;left: 50%;"></span><div class="totalPrice">Sub Total <span class="simpleCart_GrandTotal pull-right">$'+data['subtotal']+'</span></div>';
                var tax='<div class="totalPrice">Tax + Surcharge<span class="simpleCart_GrandTotal pull-right">$'+data['tax']+'</span></div>';
                var total='<div class="totalPrice">Grand Total<span class="simpleCart_grandTotal">$'+data['total']+'</span></div>';
                var discount='';
                if(data['discount']>0){
                    var discount_amount='';
                    if(data['restaurant_details'][0]['restaurant']['discount_type']=='Amount')
                        discount_amount=discount_amount+'$ ';
                    discount_amount=data['restaurant_details'][0]['restaurant']['discount']
                    if(data['restaurant_details'][0]['restaurant']['discount_type']=='Percentage')
                        discount_amount=discount_amount+' %';

                    discount='<div class="totalPrice">Discount ( '+discount_amount+' )<span class="simpleCart_Discount  pull-right">$'+data['discount']+'</span></div>';
                }
                var min_price=''
                if(data['restaurant_details'][0]['restaurant']['min_order_price']>data['subtotal']){
                    min_price='<div class="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Minimum Subtotal for Delivery should be $' + data['restaurant_details'][0]['restaurant']['min_order_price'] + '</div>';
                }

                var cart_items='';
                for(var i=0;i<data[data['key']].length;i++){
                    cart_items=cart_items+'<tr class="itemRow row-0 odd" id="cartItem_'+data[data['key']][i]['fid']+'"><td class="item-name">'+data[data['key']][i]['details']['food']['name']+'</td><td class="item-total">$'+(data[data['key']][i]['quantity']*data[data['key']][i]['price'])+'</td><td class="item-custom"><div class="pull-right"><div class="btn-group">+<span class="btn btn-mini">'+data[data['key']][i]['quantity']+'</span><a href="javascript:;" onclick="increase_quant('+data['restaurant_details'][0]['restaurant']['id']+','+i+','+data[data['key']][i]['quantity']+',1)"  class="simpleCart_increment btn btn-mini"> <i class="icon-plus"></i> </a><a href="javascript:;" onclick="decrease_quant('+data['restaurant_details'][0]['restaurant']['id']+','+i+','+data[data['key']][i]['quantity']+',1)" class="simpleCart_decrement btn btn-mini"';
                    if(data[data['key']][i]['quantity']<=1)
                        cart_items=cart_items+'disabled="disabled"';
                    cart_items=cart_items+'> <i class="icon-minus"></i> </a><a href="javascript:;" class="simpleCart_remove btn btn-danger btn-mini" onclick="remove_item('+data['restaurant_details'][0]['restaurant']['id']+','+i+',1)"> <i class="icon-remove"></i></a></div></div></td></tr>';
                }
            var parser = document.createElement('a');
            parser.href = document.URL;
            var res = parser.pathname.split("/");
            var ur="";
            if(res[1].localeCompare('DirectOrders')==0)
                ur="/"+res[1];
                cart_data='<div id="cart" class="simpleCart_items"><table><tbody><tr class="headerRow"><th class="item-name">Name</th><th class="item-total">Price</th><th class="item-custom">Edit</th></tr>'+cart_items+'</tbody></table></div>'+subtotal+tax+discount+total+min_price+'<center class="row-fluid"><a class="btn btn-success" href="'+ur+'/checkout" > Checkout</a></center>';
                title="Cart ("+data['restaurant_details'][0]['restaurant']['name']+")";
         } else {
        cart_data='<img src="/img/empty_cart.png" alt="">';
    }
    
    $( "#cart" ).html(cart_data);
}


(function(e){e.fn.unveil=function(){function i(){r=t.filter(function(){var t=e(this),n=e(window),r=n.scrollTop(),i=r+n.height(),s=t.offset().top,o=s+t.height();return o>=r&&s<=i});n=r.trigger("unveil");t=t.not(n)}var t=this,n,r;this.one("unveil",function(){this.setAttribute("src",this.getAttribute("data-src"));this.removeAttribute("data-src")});e(window).scroll(i);i();return this}})(jQuery)







function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires+"; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie(cname,deflt)
{
    var searchtext = getCookie(cname);
    if (searchtext == "")
    {
        setCookie("cname", deflt, 365);
    }
}

function getLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition,errorGettingPosition,{'enableHighAccuracy':true,'timeout':100000,'maximumAge':0});
    }
}

function errorGettingPosition(err)
{

    if(err.code==1)
    {
        var template = "<div data-role='popup' data-overlay-theme='b' data-theme='b'  data-position-to='origin'  data-dismissible='false' class='ui-content messagePopup' style='max-width:230px'><a href='#' data-role='button' data-theme='g' data-icon='delete' data-iconpos='notext'  class='ui-btn-right closePopup'>Close</a> <div data-role='header' data-theme='a'></div> <div role='main' class='ui-content'> <p>User denied geolocation. Please enable your location settings</p> </div> </div>";
        // popupafterclose = popupafterclose ? popupafterclose : function () {};


        //alert("User denied geolocation. Please enable your location settings");
    }
    else if(err.code==2)
    {

        //  alert("Position unavailable.");
    }
    else if(err.code==3)
    {
    }
    else
    {
        //  alert("ERROR:"+ err.message);
    }
}

function showPosition(position)
{
    codeLatLng(position.coords.latitude,position.coords.longitude);
    //  window.location.assign('Restaurant/restaurants/'+position.coords.latitude+'/'+position.coords.longitude);
    // window.location.assign('restaurant/restaurants/37.6578/-121.7300');
    //$.mobile.loading( "hide" );
}
function codeLatLng(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                //formatted address
                // alert(results[0].formatted_address)
                //find country name
                for (var i=0; i<results[0].address_components.length; i++) {
                    for (var b=0;b<results[0].address_components[i].types.length;b++) {
                        //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                        if (results[0].address_components[i].types[b] == "postal_code") {
                            //this is the object you are looking for
                        console.log(results[0].address_components[i].short_name)
                        city= results[0].address_components[i].short_name;
                            $("#res_city").val(results[0].address_components[i].short_name);
                            break;
                        }
                    }
                }
                //city data
                // alert(city.short_name)
//                var val = document.getElementById("res_city");
//                val.value = city.short_name;
                $("#home-address-location").css('background-image','url("/img/sprites.png")' );
                $("#home-address-location").css('background-position','0 -1428px');
                $("#home-address-location").css('width','22px'); 
                $("#home-address-location").css('height','22px');
                $("#home-address-location").css('opacity','1');
                
                setCookie('isLocation','true');
//                setCookie('res_city',city.short_name);

            } else {
                //  alert("No results found");
            }
        } else {
            //  alert("Geocoder failed due to: " + status);
        }
    });
}


$( document ).ready(function()
                    {

                        checkCookie('isLocation','false');
//                        checkCookie('res_city','');

                        var locationSearch=getCookie('res_city');
                        var islocationChanged;
//                        $("#res_city").val(getCookie('res_city'));
                        if(getCookie('isLocation')=="false")
                        {
                            islocationChanged=false;
                        }else{
                            islocationChanged=true;
                        }
                        if(islocationChanged)
                        {

                            //$("#home-address-location").css('background-image','url("/img/location-arrow-icon-red.png")');
                            $("#home-address-location").css('background-image','url("/img/sprites.png")' );
                            $("#home-address-location").css('background-position','0 -1428px');
                            $("#home-address-location").css('width','22px'); 
                            $("#home-address-location").css('height','22px');
                            $("#home-address-location").css('opacity','1');

                        }

//                        $("#home-address-location" ).mouseover(function() {
//                            if($("#res_city").val()!='Use Current Location')
//                                locationSearch=$("#res_city").val();
//                            $("#res_city").val("Use Current Location");
//
//
//                        });

//                        $("#home-address-location" ).mouseleave(function()
//                                                                {
//                                                                    if($("#res_city").val()=='Use Current Location')
//                                                                        $("#res_city").val(locationSearch);
//
//                                                                });
                        $("#home-address-location" ).click(function() {

                            geocoder = new google.maps.Geocoder();
                            if (navigator.geolocation){
                                navigator.geolocation.getCurrentPosition(showPosition,errorGettingPosition,{'enableHighAccuracy':true,'timeout':10000,'maximumAge':0});
                            } else {
                                alert('No Geolocation Support. Unable To retrive your Location');
                            }
                        });

                        $("#res_city" ).change(function()
                                               {
                                                   if($("#res_city").val()!=locationSearch && $("#res_city").val()!="Use Current Location")
                                                   {

                                                       $("#home-address-location").css('background-image','url("/img/sprites.png")'); 
                                                       $("#home-address-location").css('background-position','0 -1500px');
                                                       $("#home-address-location").css('width','22px'); 
                                                       $("#home-address-location").css('height','22px');
                                                       $("#home-address-location").css('opacity','.5');
                                                       setCookie('isLocation','false');
//                                                       setCookie('res_city',$("#res_city").val());
                                                   }
                                               });
                    });


function signOut(){

    $.get("/user/SignOut", function(data, status){
        result=JSON.parse(data)   
        if(result.success==true){
            $('#usrBtn').hide();
            $('#loginBtn').show();
            if(result.controller=='user' || result.controller=='User'){
                location.href='/';
            }
        }
    });

}

function DeleteAddress(id){
    bootbox.confirm("Are you sure you want to remove this address?", function(result) {
        $.get( "/user/deleteAddress/"+id, function( data ) {
            data=JSON.parse(data);
            console.log(data);
            if(data.success==true){
                location.reload();
            }
        });
    }); 
}

$('#addressForm').submit(function(event) {
    event.preventDefault();
    // get the form data
    // there are many ways to get this data uSign jQuery (you can use the class or id also)
    var formData = {
        'address_name'              : $('input[name=address_name]').val(),
        'room_flat_no'              : $('input[name=room_flat_no]').val(),
        'address'             : $('input[name=d_address]').val(),
        'city'             : $('input[id=city]').val(),
        'zip'             : $('input[name=zipcode]').val(),
        'state'             : $('input[name=state]').val(),
    };
    var opts = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 0, // Top position relative to parent in px
        left: 0 // Left position relative to parent in px
    };
    var target = document.getElementById('modal_spinner_center');
    var spinner = new Spinner(opts).spin(target);
    $.ajax({
        type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url         : '/user/saveAddress/'+$('input[name=id]').val(), // the url where we want to POST
        data        : formData, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode          : true
    }).done(function(data) {
        if(data.success==true){
            location.href='/user/addresses';
        } 
        spinner.stop();
    });

});

 function login_sign_up(){
     var template=' <div class="row-fluid"><div class="span8" style="border-right: 1px dotted #C2C2C2;padding-right: 30px;"><ul class="nav nav-tabs"><li class="active"><a href="#Login" data-toggle="tab">Login</a></li><li><a href="#Registration" data-toggle="tab">Registration</a></li></ul> <div class="tab-content"><div class="tab-pane active" id="Login"><form id="LoginForm" metod="POST" action="/user/login" role="form" class=""><div class="form-group row-fluid"><input type="email" class="form-control" name="email" required id="email1" placeholder="Email" /></div><div class="form-group row-fluid"><input type="password" class="form-control" required name="password" id="password" placeholder="Password" /></div><div class="row-fluid" id="error" style="color:#c12e2a"></div><div class="row-fluid"><div class="span4"><button type="submit" class="btn btn-primary btn-sm">Submit</button></div><div class="span8"><a href="#ForgetPass" data-toggle="tab">Forgot your password?</a></div></div></form></div><div class="tab-pane" id="ForgetPass"><form role="form" id="ForgetPassForm" method="POST" action="/user/forgetpass"><div class="form-group row-fluid"><input type="text" class="form-control" id="forgetemail" name="forgetemail" required placeholder="Register Email" /></div><div class="row-fluid" id="error2" style="color:#c12e2a"></div><div class="row-fluid"><div class="span4"><button type="submit" class="btn btn-primary btn-sm">Submit</button></div></form></div></div><div class="tab-pane" id="Registration"><form role="form" id="SignUpForm" metod="POST" action="/user/SignUp"><div class="form-group row-fluid"><input type="text" class="form-control" id="SignUpname" name="SignUpname" required  placeholder="Name" /></div><div class="form-group row-fluid"><input type="email" class="form-control" id="SignUpemail"  required name="SignUpemail" placeholder="Email" /></div><div class="form-group row-fluid"><input type="number" class="form-control"  required id="SignUpphone" name="SignUpphone" placeholder="Phone" /></div><div class="form-group row-fluid"><input type="password" required  class="form-control" id="SignUppassword" name="SignUppassword" placeholder="Password" /></div><div class="row-fluid">Gender  &nbsp&nbsp <label class="radio inline"><input type="radio" name="SignUpgender" value="Male" checked>Male</label><label class="radio inline"><input type="radio" name="SignUpgender" value="Female">Female</label></div><div class="row-fluid" id="errorSignUp" style="color:#c12e2a"></div><div class="row-fluid"><div class="span6"><button type="submit" class="btn btn-primary btn-sm">Save & Continue</button></div><div class="span6"><button type="button" class="btn btn-default btn-sm">Cancel</button></div></div></form></div></div><div id="OR" class="hidden-xs">OR</div></div><div class="span4"><div class="rowcenter sign-with"><div class="span12 "><h3>Sign in with</h3></div><div class="row-fluid"><a href="/user/auth_login/facebook" class="btn btn-primary span12">Facebook</a></div><br/><div class="row-fluid"> <a href="/user/auth_login/google" class="btn btn-danger span12">Google</a></div></div></div></div></div>';
    
var box=bootbox.dialog({
                message: template,
                title: 'Sign In/Sign up'
            });
     $('#LoginForm').submit(function(event) {

         // get the form data
         // there are many ways to get this data uSign jQuery (you can use the class or id also)
         var formData = {
             'email'              : $('input[name=email]').val(),
             'password'             : $('input[name=password]').val()
         };
         var opts = {
             lines: 13, // The number of lines to draw
             length: 20, // The length of each line
             width: 10, // The line thickness
             radius: 30, // The radius of the inner circle
             corners: 1, // Corner roundness (0..1)
             rotate: 0, // The rotation offset
             direction: 1, // 1: clockwise, -1: counterclockwise
             color: '#000', // #rgb or #rrggbb or array of colors
             speed: 1, // Rounds per second
             trail: 60, // Afterglow percentage
             shadow: false, // Whether to render a shadow
             hwaccel: false, // Whether to use hardware acceleration
             className: 'spinner', // The CSS class to assign to the spinner
             zIndex: 2e9, // The z-index (defaults to 2000000000)
             top: 0, // Top position relative to parent in px
             left: 0 // Left position relative to parent in px
         };
         var target = document.getElementById('modal_spinner_center');
         var spinner = new Spinner(opts).spin(target);
         
         $.ajax({
             type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
             url         : '/user/login', // the url where we want to POST
             data        : formData, // our data object
             dataType    : 'json', // what type of data do we expect back from the server
             encode          : true
         })
         // uSign the done promise callback
         .done(function(data) {

             // log data to the console so we can see
             if(data.is_user){
                 box.modal('hide');
                 $('#usrBtn').show();
                 $('#loginBtn').hide();
                 $('#usrName').html(data.user.name+'<span class="caret"></span>')
                 console.log(data);
             } else {
                 $('#error').html(data.error);
             }
             spinner.stop();
             // here we will handle errors and validation messages
         });
         event.preventDefault();
     });
     $('#SignUpForm').submit(function(event) {
         event.preventDefault();
         // get the form data
         // there are many ways to get this data uSign jQuery (you can use the class or id also)
         var formData = {
             'email'              : $('input[name=SignUpemail]').val(),
             'password'             : $('input[name=SignUppassword]').val(),
             'name'             : $('input[name=SignUpname]').val(),
             'phone'             : $('input[name=SignUpphone]').val(),
             'gender'             : $('input[name=SignUpgender]').val(),
         };
         var opts = {
             lines: 13, // The number of lines to draw
             length: 20, // The length of each line
             width: 10, // The line thickness
             radius: 30, // The radius of the inner circle
             corners: 1, // Corner roundness (0..1)
             rotate: 0, // The rotation offset
             direction: 1, // 1: clockwise, -1: counterclockwise
             color: '#000', // #rgb or #rrggbb or array of colors
             speed: 1, // Rounds per second
             trail: 60, // Afterglow percentage
             shadow: false, // Whether to render a shadow
             hwaccel: false, // Whether to use hardware acceleration
             className: 'spinner', // The CSS class to assign to the spinner
             zIndex: 2e9, // The z-index (defaults to 2000000000)
             top: 0, // Top position relative to parent in px
             left: 0 // Left position relative to parent in px
         };
         var target = document.getElementById('modal_spinner_center');
         var spinner = new Spinner(opts).spin(target);
         $.ajax({
             type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
             url         : '/user/SignUp', // the url where we want to POST
             data        : formData, // our data object
             dataType    : 'json', // what type of data do we expect back from the server
             encode          : true
         }).done(function(data) {
                      // log data to the console so we can see
             if(data.success==true){
                 box.modal('hide');
             } else {
                 $('#errorSignUp').html(data.error);
             }
             spinner.stop();
             // here we will handle errors and validation messages
         });
        
     });
     $('#ForgetPassForm').submit(function(event) {
         event.preventDefault();
         // get the form data
         // there are many ways to get this data uSign jQuery (you can use the class or id also)
         var formData = {
             'email'              : $('input[name=forgetemail]').val(),
             };
         var opts = {
             lines: 13, // The number of lines to draw
             length: 20, // The length of each line
             width: 10, // The line thickness
             radius: 30, // The radius of the inner circle
             corners: 1, // Corner roundness (0..1)
             rotate: 0, // The rotation offset
             direction: 1, // 1: clockwise, -1: counterclockwise
             color: '#000', // #rgb or #rrggbb or array of colors
             speed: 1, // Rounds per second
             trail: 60, // Afterglow percentage
             shadow: false, // Whether to render a shadow
             hwaccel: false, // Whether to use hardware acceleration
             className: 'spinner', // The CSS class to assign to the spinner
             zIndex: 2e9, // The z-index (defaults to 2000000000)
             top: 0, // Top position relative to parent in px
             left: 0 // Left position relative to parent in px
         };
         var target = document.getElementById('modal_spinner_center');
         var spinner = new Spinner(opts).spin(target);
         $.ajax({
             type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
             url         : '/user/forgetpass', // the url where we want to POST
             data        : formData, // our data object
             dataType    : 'json', // what type of data do we expect back from the server
             encode          : true
         }).done(function(data) {
                      // log data to the console so we can see
             if(data.success==true){
                 box.modal('hide');
                 var message = data.message;
                 var box2=bootbox.dialog({
                message: data.message,
                title: 'Password Change Successful'
            });
                 
             } else {
                 $('#error2').html(data.error);
             }
             spinner.stop();
             // here we will handle errors and validation messages
         });
        
     });
     
     
   }
   function myFunction() {
	  
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
	document.getElementById("myPopup").innerHTML="A surcharge of "+surcharge+" % help us to operate and provide you with the best service";
}

