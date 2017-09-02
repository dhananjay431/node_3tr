(function() {
    var app=angular.module('FoodCrave', ['angular-loading-bar','OtdDirectives']).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }])
    app.controller('FrequentProductController',['$scope','$http','$log',function($scope,$http,$log){
        var store=this;
        store.frequent_product=[];

        $http.get('/restaurants/frequently_ordered').success(function(data){
            store.frequent_product=data;
            ////////console.log(store);
        });


    }]);

    app.controller('driversController', function($scope) {
        $scope.driversList = [
            {
                Driver: {
                    givenName: 'Sebastian',
                    familyName: 'Vettel'
                },
                points: 322,
                nationality: "German",
                Constructors: [
                    {name: "Red Bull"}
                ]
            },
            {
                Driver: {
                    givenName: 'Fernando',
                    familyName: 'Alonso'
                },
                points: 207,
                nationality: "Spanish",
                Constructors: [
                    {name: "Ferrari"}
                ]
            }
        ];
    })

    app.controller('CheckoutController',['$log','$scope','$http','$timeout','$q','$rootScope','Distance','AmPmToHour','OfferService','ThirdPartyItems',function($log, $scope, $http,$timeout,$q,$rootScope,Distance,AmPmToHour,OfferService,ThirdPartyItems){
        this.details=customer_details;
        var check_details=this;
        check_details.details.options2 = {
            country: 'us'
        };
        $scope.is_checkout_progressing = false;
        var dates=[];
        var hotels_list=[];
        
        var holiday_list=[];
        
        check_details.cart=[];
        check_details.show_invoice=false;
        check_details.payment_option=false;
        check_details.invoice_completed=false;
        check_details.offers={};
        check_details.tax=0;
        check_details.discount=0;
        check_details.subtotal=0;
        check_details.delcharge=0;
        check_details.extra_del_charge=0;
        check_details.rest_offer_id=Array();
        check_details.tip=0;
        check_details.credit_imgs=["card_active visa","card_active mc","card_active amex","card_active discover"];
        check_details.details.card="unknown";
        check_details.details.card_no="";

        $scope.getCreditCardType=function(accountNumber)
        {
            //start without knowing the credit card type
            var result = "unknown";
            check_details.details.card_no=accountNumber;
            //first check for MasterCard
            if (/^5[1-5]/.test(accountNumber))
            {
                result = "mastercard";
            }

            //then check for Visa
            else if (/^4/.test(accountNumber))
            {
                result = "visa";
            }

            //then check for AmEx
            else if (/^3(4|7)/.test(accountNumber))
            {
                result = "amex";
            }

            //then check for discover
            else if (/^6011/.test(accountNumber))
            {
                result = "discover";
            }

            return result;
        }
        // $scope.errorMessage = "Please Enter Name";


        $scope.canSubmitFirstSection=function()
        {

            $scope.errorMessage = null;
            $scope.EMAIL_REGEXP = /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

            //if(!(($scope.customer.details.name!=undefined) && ($scope.customer.details.name!='') && ($scope.customer.details.name!=null)))
            //{
             //   $scope.errorMessage = "Please Enter Valid Name <br>"; 
            //}

            //if(!(($scope.customer.details.email!=undefined) && ($scope.customer.details.email!='') && ($scope.customer.details.email!=null) && $scope.EMAIL_REGEXP.test($scope.customer.details.email)))
            //{
              //  if(($scope.errorMessage !=undefined) && ($scope.errorMessage!='') && ($scope.errorMessage!=null))    
               // {
                //    $scope.errorMessage =$scope.errorMessage+ "Please Enter Valid Email Address <br>";
                //}else{
                //    $scope.errorMessage ="Please Enter Valid Email Address <br>";
                //}

            //}

            //if(!(($scope.customer.details.phone!=undefined) && ($scope.customer.details.phone!='') && ($scope.customer.details.phone!=null)))
            //{
              //  if(($scope.errorMessage !=undefined) && ($scope.errorMessage!='') && ($scope.errorMessage!=null))    
               // {
                //    $scope.errorMessage = $scope.errorMessage+"Please Enter Valid Phone Number<br>";  
                //}else{
                  //  $scope.errorMessage = "Please Enter Valid Phone Number<br>";
                //}
            //}
            if(!(($scope.customer.details.pre_order_date!=undefined) && ($scope.customer.details.pre_order_date!='') && ($scope.customer.details.pre_order_date!=null)))
            {
                if(($scope.errorMessage !=undefined) && ($scope.errorMessage!='') && ($scope.errorMessage!=null))    
                {
                    $scope.errorMessage = $scope.errorMessage+"Please Select Order Date<br>";  
                }else{
                    $scope.errorMessage = "Please Select Order Date<br>";
                }
            }

            if(($scope.customer.details.pre_order_date!= undefined &&  $scope.customer.details.pre_order_date.toUpperCase()!='ASAP') && !(($scope.customer.details.pre_order_time!=undefined) && ($scope.customer.details.pre_order_time!='') && ($scope.customer.details.pre_order_time!=null)))
            {

               // if(($scope.errorMessage !=undefined) && ($scope.errorMessage!='') && ($scope.errorMessage!=null))    
                //{
                 //   $scope.errorMessage = $scope.errorMessage+"Please Select Order Time<br>";  
                //}else{
                 //   $scope.errorMessage = "Please Select Order Time<br>";
                //}

            }
            if($scope.customer.details.order=='Delivery') {

                if($scope.customer.details.in_hotel==true){
                    if(!(($scope.customer.details.hotel!=undefined) && ($scope.customer.details.hotel!='') && ($scope.customer.details.hotel!=null))){
                        if(($scope.errorMessage !=undefined) && ($scope.errorMessage!='') && ($scope.errorMessage!=null))    
                        {
                            $scope.errorMessage = $scope.errorMessage+"Please Select Hotel<br>";  
                        }else{
                            $scope.errorMessage = "Please Select Hotel<br>";
                        }
                    }

                    if(!(($scope.customer.details.room_no!=undefined) && ($scope.customer.details.room_no!='') && ($scope.customer.details.room_no!=null))){
                        if(($scope.errorMessage !=undefined) && ($scope.errorMessage!='') && ($scope.errorMessage!=null))    
                        {
                            $scope.errorMessage = $scope.errorMessage+"Please Select Your Room Number<br>";  
                        }else{
                            $scope.errorMessage = "Please Select Your Room Number<br>";
                        }
                    }

              //  }else if($scope.customer.details.in_hotel==false){
                //    if(!(($scope.customer.details.d_address!=undefined) && ($scope.customer.details.d_address!='') && ($scope.customer.details.d_address!=null) && ($scope.customer.details.state!=undefined) && ($scope.customer.details.state!='') && ($scope.customer.details.state!=null) && ($scope.customer.details.city!=undefined) && ($scope.customer.details.city!='') && ($scope.customer.details.city!=null))){
                  //      if(($scope.errorMessage !=undefined) && ($scope.errorMessage!='') && ($scope.errorMessage!=null))    
                    //    {
                      //      $scope.errorMessage = $scope.errorMessage+"Please Enter Delivery Address,City,State<br>";  
                       // }else{
                         //   $scope.errorMessage = "Please Enter Delivery Address,City,State<br>";
                       // }
                   // }
                }

            }

            if(($scope.errorMessage !=undefined) && ($scope.errorMessage!='') && ($scope.errorMessage!=null))     
            {
                $scope.errorMessage = $scope.errorMessage+" And Click On Continue"; 

                return false; 
            }else{

                $scope.addDetails();
                $scope.addUserDetail();
                return true;
                
            } 

        }
        $scope.addUserDetail = function(){
           
           console.log("sending customer details") 
           $http({
                    method: 'POST',
                    headers: 'application/x-www-form-urlencoded',
                    url: '/order/updateUserInfo',
                    data: $scope.customer.details
                }).success(function (response) {
                    console.log("data sended successfull");
                    });
        }

        $scope.change_credit_img =function(){

            var part1=check_details.credit_number_part1 ? check_details.credit_number_part1 :'0000';
            var part2=check_details.credit_number_part2 ? check_details.credit_number_part2 :'0000';
            var part3=check_details.credit_number_part3 ? check_details.credit_number_part3 :'0000';
            var part4=check_details.credit_number_part4 ? check_details.credit_number_part4 :'0000';

            var part1=$('#card1').val();
            var part2=$('#card2').val();
            var part3=$('#card3').val();
            var part4=$('#card4').val();
            //            //console.log(part1)
            //            if(part1.length>4){
            //                part2=check_details.credit_number_part2=part1.slice(4);
            //                part1=check_details.credit_number_part1=part1.slice(0,4);
            //            }
            //            //console.log(part1)
            //            //console.log(part2)
            //            if(part2.length>4)
            //                {
            //                    part3=check_details.credit_number_part3=part2.slice(4);
            //                    part2=check_details.credit_number_part2=part2.slice(0,4);
            //                }
            //            //console.log(check_details.credit_number_part2)
            //            //console.log(part3)
            //            if(part3.length>4){
            //                part4=check_details.credit_number_part4=part3.slice(4);
            //                part3=check_details.credit_number_part3=part3.slice(0,4);
            //                document.getElementById('date').focus();
            //
            //            }
            //            //console.log(part3)
            //            //console.log(part4)
            //            
            //            if(part4.length>4){
            //                part4=check_details.credit_number_part4=part3.slice(0,4);
            //                
            //            }
            //            //console.log(part4)

            var type=(this.getCreditCardType(part1+part2+part3+part4));
            if(type=="mastercard")
                check_details.credit_imgs=[" visa","card_active mc"," amex"," discover"];
            else if(type=="visa")
                check_details.credit_imgs=["card_active visa"," mc"," amex"," discover"];
            else if(type=="amex")
                check_details.credit_imgs=[" visa"," mc","card_active amex"," discover"];
            else if(type=="discover")
                check_details.credit_imgs=[" visa"," mc"," amex","card_active discover"];
            else
                check_details.credit_imgs=["card_active visa","card_active mc","card_active amex","card_active discover"];
            check_details.details.card=type;
            // //console.log(check_details.details.card);

        }

        $scope.hotel_address="";
        $scope.hotel_id_selected="";
        $scope.current_address="";
        $scope.couponerror=false;

        $scope.dates =[];// dates;
        $scope.order_is_third_party=0;
        $scope.order_can_be_third_party=0;

        //Get Cart Data
        $http.get('/cart/get_cart_details').success(function(data){
            check_details.cart=data;
            check_details.subtotal=check_details.cart.subtotal;
            check_details.tax=check_details.cart.tax;
            check_details.discount=check_details.cart.discount;
            check_details.markupprice=check_details.cart.markupprice;
            $scope.loadPreorderDays();
             $scope.address_changed();
           $scope.hotels_list=hotels_list;
        });
      
        $scope.hotel_address="";
        $scope.hotel_id_selected=0;
        $scope.current_address="";
        $scope.pre_order_time_arr = [];

        $scope.expected_d_address='';
        $scope.expected_house_no='';
        $scope.expected_city='';
        $scope.expected_state='';
        $scope.expected_zipcode='';
        $scope.hotel_name='';
        this.hotel_name=$scope.hotel_name;

     

        $scope.address_changed = function() {
            if(check_details.details.order=='Delivery')
            {
                if(check_details.details.in_hotel==false)
                {
                    $('#d_address').removeAttr('disabled');                                   if(check_details.details.house_no||check_details.details.d_address||check_details.details.city||check_details.details.state||check_details.details.zipcode)
                        $scope.current_address='Delivery Address:: ';
                    if(check_details.details.house_no && check_details.details.house_no!="null")
                        $scope.current_address+=check_details.details.house_no+', ';
                    if(check_details.details.d_address && check_details.details.d_address!="null")    
                        $scope.current_address+=check_details.details.d_address;
                    if(check_details.details.city && check_details.details.city!="null" )   
                        $scope.current_address+=', '+check_details.details.city;
                    if(check_details.details.state && check_details.details.state!="null")    
                        $scope.current_address+=', '+check_details.details.state;
                    if(check_details.details.zipcode && check_details.details.zipcode!="null")    
                        $scope.current_address+=', '+check_details.details.zipcode;

                } else {
                    $('#room_no').removeAttr('disabled');
                    $('#hotel').removeAttr('disabled');
                    $scope.current_address='';
                    $scope.expected_house_no='';
                    if(check_details.details.room_no!=undefined || check_details.details.hotel!=undefined)
                        $scope.current_address='Delivery Address:: ';  
                    if(check_details.details.room_no!=undefined)
                    {
                        $scope.current_address+='Room No. '+check_details.details.room_no+', ';  
                        $scope.expected_house_no='Room No. '+check_details.details.room_no+', ';
                    }
                    if(check_details.details.hotel!=undefined){
                        if(check_details.details.hotel!=this.hotel_id_selected){
                            this.hotel_id_selected=check_details.details.hotel;
                            $scope.hotel_address='';
                            $scope.hotel_name='';
                            var deferred = $q.defer();

                            setTimeout(function() {$http.get('/checkout/get_delivery_details_hotel/'+check_details.details.hotel+'/'+check_details.cart.key).
                            success(function(data){
                                $scope.hotel_address=data.hotel_name+', ';
                                $scope.expected_d_address='';
                                if(data.cross_street!='' && data.cross_street!=undefined)
                                {
                                    $scope.hotel_address+=data.cross_street+', ';
                                    $scope.expected_d_address=data.cross_street+', ';
                                }
                                $scope.expected_d_address+=data.address;
                                $scope.expected_city=data.city;
                                $scope.expected_state=data.statecode;
                                $scope.expected_zipcode=data.postalCode;
                                // ////console.log(data);
                                if(data.address)
                                    $scope.hotel_address+=(data.address).replace(/,/g, " ");
                                if(data.city)
                                    $scope.hotel_address+=', '+data.city;
                                if(data.statecode)   
                                    $scope.hotel_address+=', '+data.statecode;
                                if(data.postalCode)
                                    $scope.hotel_address+=', '+data.postalCode;
                                $scope.current_address+=$scope.hotel_address;
                                $scope.hotel_name=data.hotel_name.trim();
                                this.hotel_name=data.hotel_name.trim();
                                $scope.expected_house_no+=$scope.hotel_name;

                            })}, 0);
                            deferred.resolve();
                        }
                        $scope.expected_house_no+=$scope.hotel_name;

                        $scope.current_address+=$scope.hotel_address;
                    }
                }
            } else if(check_details.details.order=='Pickup') {

                $scope.current_address='';
                if(check_details.details.in_hotel==false)
                {
                    $('#d_address').attr('disabled',true);
                }else{
                    $('#room_no').attr('disabled',true);
                    $('#hotel').attr('disabled',true);
                }
            }

        }

        $scope.loadPreorderDays = function(){
            
                            var deferred = $q.defer();
                            setTimeout(function() {$http.get('/api/get_pre_order_days/'+check_details.cart.restaurant_details[0].restaurant.id+'/'+check_details.details.order).
                            success(function(data){
                               if(data.success)
                               {
                                   $scope.dates = data.options;
                               }
                                console.log("Options");
                                console.log($scope.dates);
                                
                                if(data.options[0].value !=undefined && data.options[0].days!='Asap' && data.options[0].disabled==0){
                                $scope.customer.details.pre_order_date = data.options[0].value;
                                $scope.loadPreorderTime();
                                }else{
                                   $scope.customer.details.pre_order_date = undefined;
                                    var myselect=$("select#pre_order_time");
                                    myselect.find('option').remove();
                                    $('<option>').val("").text("-- Select PreOrder Time --").appendTo(myselect);
                                    myselect.attr("disabled", "disabled");
                                     if(data.options[0].disabled==0)
                                    $scope.customer.details.pre_order_date = data.options[0].value;
                                }
                            })}, 0);
                            deferred.resolve();
        }
        
        $scope.loadPreorderTime = function(){
            var myselect=$("select#pre_order_time");
                myselect.find('option').remove();
                $('<option>').val("").text("-- Select PreOrder Time --").appendTo(myselect);
                myselect.attr("disabled", "disabled");
            
         if(($scope.customer.details.pre_order_date!=undefined) && ($scope.customer.details.pre_order_date!='Asap') ){
                               var is_delivery= 1;
                            if(check_details.details.order == 'pickup' || check_details.details.order == 'Pickup')
                            {
                                is_delivery = 0;
                            }
                            var deferred = $q.defer();
                            setTimeout(function() {$http.get('/api/get_pre_order_time/'+ $scope.customer.details.pre_order_date+ '/'+ check_details.cart.restaurant_details[0].restaurant.id+'/'+is_delivery).
                            success(function(data){
                                
                                    $scope.pre_order_time_arr = data
                                    var myselect=$("select#pre_order_time");
                                    myselect.find('option').remove();
                                    var selected_time=check_details.details.pre_order_time;
                                    $('<option>').val("").text("-- Select PreOrder Time --").appendTo(myselect);
                                    for(var i=0;i<data.length;i++){                        
                                       // console.log(data[i]);
                                        if(data[i].is_break)
                                            $('<option>').val(data[i].timing).text(data[i].timing+'---Break time--').attr("disabled", "disabled").appendTo(myselect);
                                        else{
                                            $('<option>').val(data[i].timing).text(data[i].timing).appendTo(myselect);
                                            if(selected_time!='undefined' && selected_time===data[i].timing){
                                            myselect.eq(1).prop('selected', true);
                                        }
                                    }
                                }
                                if(selected_time!='Undefined')
                                    myselect.removeAttr('disabled');

                            })}, 0);
                            deferred.resolve();
            }else{
                var myselect=$("select#pre_order_time");
                myselect.find('option').remove();
                $('<option>').val("").text("-- Select PreOrder Time --").appendTo(myselect);
                myselect.attr("disabled", "disabled");
            }
        }
        
        $scope.Load_hotels = function($scope) {
            
           // console.log(check_details.details.in_hotel);
            if(check_details.details.in_hotel==false)
                check_details.details.in_hotel=true;
            else
                check_details.details.in_hotel=false;
            if(check_details.details.in_hotel==true && hotels_list.length==0){
                // //////console.log('empty');
                $http.get('/checkout/get_nearby_hotels/'+check_details.cart.key).success(function(data){
                    for(var i=0;i<data.length;i++){

                        var hotel={name:'',id:''};
                        hotel.name=(data[i].hotels.Name);
                        hotel.id=(data[i].hotels.id);
                        hotels_list.push(hotel);
                    }
                });
            }
            this.address_changed();

        }

        $scope.order_type_change=function()
        {
            $scope.loadPreorderDays();
            this.address_changed();
            $scope.hotels_list=hotels_list;
        }
        $scope.is_show_orderDay = function(){
            
            if($scope.customer.details.pre_order_date=='Asap')
           {
               return true;
           }else{
               return false;
           }
        }

        $scope.changeCustomerDetail=function(){
            check_details.invoice_completed=false;
            check_details.details.customer_form=true;
            check_details.show_invoice=false;
            check_details.payment_option=false;
        };
        $scope.goToPay=function(){
            if($scope.checked==true){
                if(check_details.cart.is_coupon==undefined){
                    if($scope.coupon_error_msg==undefined){
                        $scope.couponerror=true;
                        $scope.coupon_error_msg='Please enter a Valid Coupon Code';
                    }
                    return;
                }
            }
            check_details.show_invoice=false;
            check_details.invoice_completed=true;
            check_details.payment_option=true;
        };
        $scope.err_arr=Array();
        $scope.alert_msg_err='';
        $scope.is_rest_delivery =function(){

            //////console.log('checking if restaurant provide delivery');

            if(check_details.cart.restaurant_details[0].restaurant.delivery==1)
                return true;

            $scope.alert_msg_err='ERR_REST_DEL';
            $scope.err_arr.push($scope.alert_msg_err);
            return false;

        }
        

        $scope.is_rest_min =function(){
            //////console.log('checking if restaurant min order price condition satisfies');
            if((parseFloat(check_details.cart.subtotal)>parseFloat(check_details.cart.restaurant_details[0].restaurant.min_order_price)))
                return true;

            $scope.alert_msg_err='ERR_REST_DEL_MIN';
            $scope.err_arr.push($scope.alert_msg_err);
            return false;

        }

        $scope.is_in_rest_dist =function() {

            //////console.log('checking if delivery address is in restaurants delivery range');
            if(parseFloat(Math.round(check_details.cart.restaurant_details[0].restaurant.delivery_range))>=(parseFloat(Math.round($scope.distance))))
                return true;

            $scope.alert_msg_err='ERR_REST_DEL_RANGE';
            $scope.err_arr.push($scope.alert_msg_err);

            return false;
        }

        $scope.is_in_del_time_range=function(){
            //            console.log('checking if delivery time is in restaurants delivery time range');

            if(check_details.details.pre_order_date=='Asap'){
                var curr_time=new Date(check_details.cart.datetime);
                var del_start_time=((curr_time.getFullYear()+'-'+minTwoDigits(curr_time.getMonth()+1)+'-'+minTwoDigits(curr_time.getDate())+' '+check_details.cart.restaurant_details[0].restaurant_timings.delivery_start_time));
                var del_stop_time=((curr_time.getFullYear()+'-'+minTwoDigits(curr_time.getMonth()+1)+'-'+minTwoDigits(curr_time.getDate())+' '+check_details.cart.restaurant_details[0].restaurant_timings.delivery_stop_time));
                del_start_time=new Date(del_start_time);
                del_stop_time=new Date(del_stop_time);

                if(!(curr_time.getTime()>=del_start_time.getTime() && curr_time.getTime()<=del_stop_time.getTime())){
                    $scope.alert_msg_err='ERR_REST_DEL_TIME';
                    $scope.err_arr.push($scope.alert_msg_err);
                    return false;
                }
            } else {
                for(var i=0;i<$scope.pre_order_time_arr.length;i++)
                    if(($scope.pre_order_time_arr[i].timing==check_details.details.pre_order_time) && ($scope.pre_order_time_arr[i].is_third_party==1))
                    {
                        $scope.alert_msg_err='ERR_REST_DEL_TIME';
                        $scope.err_arr.push($scope.alert_msg_err);
                        return false;
                    }
            }
            return true;

        }

        function minTwoDigits(n) {
            return (n < 10 ? '0' : '') + n;
        }

        $scope.is_third_delivery =function(){
            //////console.log('checking if restaurant allow third party delivery');

            if(check_details.cart.restaurant_details[0].restaurant.is_third_party==1)
                return true;

            $scope.alert_msg_err='ERR_THIRD_DEL';
            $scope.err_arr.push($scope.alert_msg_err);
            return false;
        }

        $scope.is_third_min =function(){
            //////console.log('Checking if third party min order condition satisfies');

            if((parseFloat(check_details.cart.subtotal)>=parseFloat(check_details.cart.restaurant_details[0].third_party_deliveries.minimum_delivery_charge)))
                return true;
            $scope.alert_msg_err='ERR_THIRD_DEL_MIN';
            $scope.err_arr.push($scope.alert_msg_err);
            return false;            
        }

        $scope.is_in_third_dist =function() {

            //console.log('checking if delivery address is in restaurants delivery range');
            //console.log(check_details.cart.restaurant_details[0].third_party_deliveries.range);
            //console.log($scope.distance);
            if(parseFloat(Math.round(check_details.cart.restaurant_details[0].third_party_deliveries.range)+20)>(parseFloat(Math.round($scope.distance))))
                return true;

            $scope.alert_msg_err='ERR_THIRD_DEL_RANGE';
            $scope.err_arr.push($scope.alert_msg_err);

            return false;
        }


        $scope.is_in_third_time_range=function(){
            //////console.log('checking if delivery time is in restaurants delivery time range');
            for(var i=0;i<$scope.pre_order_time_arr.length;i++){
                if(($scope.pre_order_time_arr[i].timing==check_details.details.pre_order_time) && ($scope.pre_order_time_arr[i].is_third_party==0))
                {
                    $scope.alert_msg_err='ERR_THIRD_DEL_TIME';
                    $scope.err_arr.push($scope.alert_msg_err);
                    return false;
                }
            }
            return true;

        }
        $scope.revieworder =function(){
            check_details.show_invoice=true;
            check_details.details.customer_form=false;
            check_details.payment_option=false;
        }


        $scope.applycoupon = function(){
            //////console.log('apply');
            //////console.log($scope.couponcode);
            //////console.log($scope.customer.details);
            if($scope.customer.cart.is_coupon==undefined){
                var deferred = $q.defer();
                $http.get('/checkout/validate_coupon/'+$scope.couponcode+'/'+$scope.customer.details.email+'/'+$scope.customer.details.phone).
                success(function(data){

                    // ////console.log(data);
                    //////console.log($scope.customer.cart.is_coupon);
                    if(data.is_valid){
                        $scope.couponerror=false;
                        $scope.coupon_error_msg=data.error;
                        $scope.customer.cart.is_coupon=data.order_coupon.value;
                        check_details.coupon_val=data.order_coupon.value;
                        check_details.couponcode=$scope.couponcode;
                        check_details.couponcode=$scope.couponcode;
                        //$scope.customer.cart.total-=data.order_coupon.value;
                    } else {
                        $scope.couponerror=true;
                        $scope.coupon_error_msg=data.error;
                    }

                });
                deferred.resolve();
            } else {
                $scope.couponapplied=true;
                $scope.coupon_error_msg="coupon already applied";
            }
        }

        $scope.applygiftcard=function(){
            if($scope.customer.cart.is_giftcard==undefined){
                var deferred = $q.defer();
                $http.get('/GiftCards/validate_card/'+$scope.giftcardno).
                success(function(data){

                    //console.log(data);
                    //////console.log($scope.customer.cart.is_coupon);
                    if(data.is_valid){
                        $scope.gift_card_error=false;
                        $scope.gift_card_applied=true;
                        $scope.gift_card_error_msg=data.error;
                        $scope.customer.cart.is_giftcard=data.giftcard.value;
                        check_details.gift_card_val=data.giftcard.value;
                        check_details.gift_card_id=data.giftcard.id;
                    } else {
                        $scope.gift_card_applied=false;
                        $scope.gift_card_error=true;
                        $scope.gift_card_error_msg=data.error;
                    }

                });
                deferred.resolve();
            } else {
                $scope.gift_card_applied=true;
                $scope.gift_card_error_msg="Gift Card already applied";
            }
        }

        $scope.get_gift_card_val=function(){

            if($scope.customer.cart.is_giftcard){
                var gift_val=(isNumber(parseFloat(check_details.gift_card_val)));
                var total=(isNumber(parseFloat(check_details.subtotal)) +isNumber(parseFloat(check_details.tip))+isNumber(parseFloat(check_details.tax))-isNumber(parseFloat(check_details.discount))+isNumber(parseFloat(check_details.delcharge))-isNumber(parseFloat(check_details.coupon_val)));
                if(gift_val<total)
                    return gift_val;
                else
                    return total;
                return 2;
            }
            return 0;
        }
        $scope.markup_discount=function(){
            if($scope.customer.details.order=='Pickup' || $scope.customer.details.discount > 0 ) {
                var markup=(isNumber(parseFloat(check_details.discount))+isNumber(parseFloat(check_details.markupprice)));

                return markup;
            }
            else
            {
                var markup=(isNumber(parseFloat(check_details.discount)));            
                return markup;
            }
        }

        $scope.get_amount_payable=function(){
            if($scope.customer.details.order=='Pickup') {
                var total=(isNumber(parseFloat(check_details.subtotal)) +isNumber(parseFloat(check_details.tip))+isNumber(parseFloat(check_details.tax))-isNumber(parseFloat(check_details.discount))+isNumber(parseFloat(check_details.delcharge))-isNumber(parseFloat(check_details.coupon_val))-isNumber(parseFloat(check_details.markupprice)));
                var gift_val=this.get_gift_card_val();
                return total-gift_val;
            }
            else
            {
                var total=(isNumber(parseFloat(check_details.subtotal)) +isNumber(parseFloat(check_details.tip))+isNumber(parseFloat(check_details.tax))-isNumber(parseFloat(check_details.discount))+isNumber(parseFloat(check_details.delcharge))-isNumber(parseFloat(check_details.coupon_val)));
                var gift_val=this.get_gift_card_val();
                return total-gift_val;
            }
        }

        $scope.show_err_msg =function(){

            //////console.log($scope.err_arr);

            if(($.inArray('ERR_THIRD_DEL', $scope.err_arr)!=-1 || $.inArray('ERR_THIRD_DEL_TIME', $scope.err_arr)!=-1) && $.inArray('ERR_REST_DEL_MIN', $scope.err_arr)!=-1) { 
                //////console.log("//Err if rest min order price condition not satisfied & third party not allowed or not in third party del time range");
                $scope.alert_msg_err="Your Subtotal($"+check_details.cart.subtotal+") is less than minimum order  price ($"+check_details.cart.restaurant_details[0].restaurant.min_order_price+")<br/>Please Go back to cart and add more food in it";


            } else if($.inArray('ERR_REST_DEL', $scope.err_arr)!=-1 && $.inArray('ERR_THIRD_DEL_MIN', $scope.err_arr)!=-1) { 
                //////console.log("//Err if third min order price condition not satisfied & rest doesnt provide delivery");
                $scope.alert_msg_err="Your Subtotal($"+check_details.cart.subtotal+") is less than minimum order  price ($"+check_details.cart.restaurant_details[0].third_party_deliveries.minimum_delivery_charge+")<br/>Please Go back to cart and add more items in it";


            } else if($.inArray('ERR_REST_DEL_TIME', $scope.err_arr)!=-1 && ($.inArray('ERR_THIRD_DEL_MIN', $scope.err_arr)!=-1  || $.inArray('ERR_THIRD_DEL', $scope.err_arr)!=-1  )){ 
                //////console.log("//Err if third min order price condition not satisfied & not in rest delivery time range");
                $scope.alert_msg_err="Restaurant doesn't provide delivery at this time.<br/>Still! If you want this order then minimum order  price ($"+check_details.cart.restaurant_details[0].third_party_deliveries.minimum_delivery_charge+")<br/>Please Go back to cart and add more items in it";


            } else if($.inArray('ERR_REST_DEL_RANGE', $scope.err_arr)!=-1 && $.inArray('ERR_THIRD_DEL_MIN', $scope.err_arr)!=-1) { 
                //////console.log("//Err if third min order price condition not satisfied & not in rest delivery distance range");
                $scope.alert_msg_err="Restaurant doesn't provide delivery in this area.<br/>Still! If you want this order then minimum order  price ($"+check_details.cart.restaurant_details[0].third_party_deliveries.minimum_delivery_charge+")<br/>Please Go back to cart and add more items in it";

            } else if($.inArray('ERR_REST_DEL_RANGE', $scope.err_arr)!=-1 && $.inArray('ERR_THIRD_DEL_TIME', $scope.err_arr)!=-1) { 
                //////console.log("//Err if third min order price condition not satisfied & not in rest delivery distance range");
                $scope.alert_msg_err="Soory the Restaurant doesn't provide delivery in this area at this time";

            } else if($.inArray('ERR_REST_DEL_MIN', $scope.err_arr)!=-1 && $.inArray('ERR_THIRD_DEL_MIN', $scope.err_arr)!=-1) { 
                //////console.log("//Err if third min order price condition not satisfied & rest min order price condition not satisfied");
                $scope.alert_msg_err="Your Subtotal($"+check_details.cart.subtotal+") is less than minimum order  price ($"+((check_details.cart.restaurant_details[0].restaurant.min_order_price <=   check_details.cart.restaurant_details[0].third_party_deliveries.minimum_delivery_charge) ? check_details.cart.restaurant_details[0].restaurant.min_order_price : check_details.cart.restaurant_details[0].third_party_deliveries.minimum_delivery_charge)+")<br/>Please Go back to cart and add more items in it";



            } else if($.inArray('ERR_THIRD_DEL_RANGE', $scope.err_arr)!=-1 || ($.inArray('ERR_THIRD_DEL', $scope.err_arr)!=-1 && $.inArray('ERR_REST_DEL_RANGE', $scope.err_arr)!=-1)){ 
                //////console.log("//Err if out of third party delivery range or if out of restaurant delivery range & third party not allowed"); 
                $scope.alert_msg_err="Address is too away from the restaurant to serve the food the warm and fresh call the customer service for further assistance";

            } else {

                $scope.alert_msg_err="We couldnt provide delivery at this time may be there is some error in network.try again or else call us on the above given no. ";
            }
            //console.log($scope.err_arr);
            bootbox.dialog({
                message: $scope.alert_msg_err,
                title: "<?php echo Configure::read('BrandName') ?> Says",
                buttons: {
                    success: {
                        label: "Back to Menu",
                        className: "btn-success",
                        callback: function() {
                            document.location.href=document.referrer;//"/restaurant/"+check_details.cart.restaurant_details[0].restaurant.name;
                        }
                    },
                    danger: {
                        label: "Continue",
                        className: "btn-danger",
                        callback: function() {
                            return;
                        }
                    }
                }
            });
        }

        $scope.valid_offer=function(index){
            if(parseFloat(check_details.cart.subtotal)>=parseFloat(check_details.offers.offers[index].restaurant_offers.min_offer_price))
                return true;
            return false;
        }
        $scope.addDetails = function(){

            ////console.log("in add detail");
            $scope.alert_msg_err='';
            $scope.err_arr=Array();
            setCookie('name',customer_details.name);
            setCookie('email',customer_details.email);
            setCookie('phone',customer_details.phone);
            setCookie('order',customer_details.order);
            check_details.delcharge=0;
            if(customer_details.order=='Delivery'){

                var show_alert=false;
                var is_third_party=false;
                if(check_details.delcharge>0)
                    check_details.cart.total=parseFloat(check_details.cart.total)-parseFloat(check_details.delcharge);

                if(customer_details.in_hotel==false){

                    setCookie('d_address',customer_details.d_address);
                    setCookie('city',customer_details.city);
                    setCookie('state',customer_details.state);
                    setCookie('zipcode',customer_details.zipcode);
                    setCookie('house_no',customer_details.house_no);
                } else {

                    setCookie('d_address',$scope.expected_d_address);
                    setCookie('city',$scope.expected_city);
                    setCookie('state',$scope.expected_state);
                    setCookie('zipcode',$scope.expected_zipcode);
                    setCookie('house_no',$scope.expected_house_no);
                }
                if(customer_details.in_hotel!="")
                    setCookie('in_hotel',customer_details.in_hotel);
                //check if rest provide del and min_Price cond is satisfied
                Distance.GetDistance(check_details.cart.restaurant_details[0].restaurant.latitude,check_details.cart.restaurant_details[0].restaurant.longitude,$scope.current_address.replace("Delivery Address::", "")).then(function(dist) {
                    $scope.distance=dist;
                    check_details.distance=dist;

                    if($scope.is_rest_delivery() && $scope.is_rest_min() && $scope.is_in_rest_dist() && $scope.is_in_del_time_range()){
                        $scope.alert_msg_err='';
                        check_details.delcharge=parseFloat(check_details.cart.restaurant_details[0].restaurant.delivery_charge);
                        //  check_details.cart.total=parseFloat(check_details.cart.total)+parseFloat(check_details.delcharge);

                        check_details.details.customer_form=false;
                        check_details.show_invoice=true;
                        OfferService.get_offers(check_details.cart.key).then(function(d) {
                            check_details.offers=d;
                            check_details.rest_offer_id=check_details.offers.rest_offer_id;                                                                                                                                     

                        });

                        //////console.log(check_details);


                        //////console.log(check_details.delcharge);
                        //////console.log(check_details.delcharge);

                    } else if($scope.is_third_delivery() &&  $scope.is_third_min() && $scope.is_in_third_dist() && $scope.is_in_third_time_range()){
                        $scope.alert_msg_err='';
                        if(parseFloat(Math.round($scope.distance))>parseFloat(Math.round(check_details.cart.restaurant_details[0].third_party_deliveries.range)))
                        { check_details.delcharge=parseFloat(check_details.cart.restaurant_details[0].third_party_deliveries.delivery_fee)+parseFloat(Math.round($scope.distance))-parseFloat(Math.round(check_details.cart.restaurant_details[0].third_party_deliveries.range));
                         check_details.extra_del_charge=parseFloat(Math.round($scope.distance))-parseFloat(Math.round(check_details.cart.restaurant_details[0].third_party_deliveries.range));
                        }else
                        {
                            check_details.delcharge=parseFloat(check_details.cart.restaurant_details[0].third_party_deliveries.delivery_fee);
                            check_details.extra_del_charge=0;
                        }
                        // check_details.cart.total=parseFloat(check_details.cart.total)+parseFloat(check_details.delcharge);
                        //                       
                        check_details.details.customer_form=false;
                        if(check_details.invoice_completed!=true)
                            check_details.show_invoice=true;
                        else
                            check_details.payment_option=true;

                        ////console.log(check_details.delcharge);
                        OfferService.get_offers(check_details.cart.key).then(function(d) {
                            check_details.offers=d;
                            check_details.rest_offer_id=check_details.offers.rest_offer_id;                                                                                                                                     


                        });

                    } else {

                        //////console.log($scope.err_arr);
                        $scope.show_err_msg();
                    }
                    ////console.log($scope.err_arr);

                    return;


                })
            } else {

                third_party_cat_items=[];
                var items=(check_details.cart[check_details.cart.key]);
                for(var i=0;i<items.length;i++){
                    if(items[i].details.food.category_id==1)
                        third_party_cat_items.push(items[i]);
                }
                if(third_party_cat_items.length){
                    var items='The following items are available for delivery only if you still wanna continue as pickup these items will be deleted from you cart.press "Delete Items" to delete the following item or "cancel" to change order mode to delivery';
                    var item_ids=[];
                    for(var i=0;i<third_party_cat_items.length;i++){

                        item_ids.push(third_party_cat_items[i].details.food.id);
                        items+='<br/><h3 class="capitalize">'+third_party_cat_items[i].details.food.name+'</h3>';
                    }
                    bootbox.dialog({
                        message: items,
                        title: "Items For Delivery Only",
                        buttons: {
                            success: {
                                label: "Delete Items!",
                                className: "btn-success",
                                callback: function() {
                                    $http.get('/checkout/removeThirdPartyitemsFromCart')
                                    .success(function(data){
                                        check_details.cart=data;
                                        check_details.subtotal=check_details.cart.subtotal;
                                        check_details.tax=check_details.cart.tax;
                                        check_details.discount=check_details.cart.discount;

                                        customer_details.customer_form=false;
                                        check_details.show_invoice=true;
                                    });
                                }
                            },
                            danger: {
                                label: "Cancel!",
                                className: "btn-danger",
                                callback: function() {
                                }
                            }
                        }
                    });
                } else {
                    customer_details.customer_form=false;
                    check_details.show_invoice=true;
                }

                OfferService.get_offers(check_details.cart.key).then(function(d) {
                    check_details.offers=d;
                    check_details.rest_offer_id=check_details.offers.rest_offer_id;                                                                                                                                     
                });
            }

            //

        }


        $scope.checkout =function(){
            var checkout_details={};

            checkout_details.name=check_details.details.name;
            checkout_details.email=check_details.details.email;
            checkout_details.phone=check_details.details.phone;
            checkout_details.order=check_details.details.order;

            checkout_details.payment=check_details.details.payment;


            checkout_details.pre_order_date=check_details.details.pre_order_date;
            checkout_details.pre_order_time=check_details.details.pre_order_time;

            checkout_details.delivery_instructions=check_details.details.delivery_instructions;

            checkout_details.in_hotel=check_details.details.in_hotel;
            checkout_details.hotel=check_details.details.hotel;
            checkout_details.room_no=check_details.details.room_no;

            checkout_details.d_address=check_details.details.d_address;
            checkout_details.city=check_details.details.city;
            checkout_details.state=check_details.details.state;
            checkout_details.zipcode=check_details.details.zipcode;
            checkout_details.house_no=check_details.details.house_no;
            checkout_details.tip_val=check_details.tip;

            if($scope.customer.details.order=='Pickup') {  checkout_details.total=isNumber(parseFloat(check_details.subtotal))+isNumber(parseFloat(check_details.tip))+isNumber(parseFloat(check_details.tax))-isNumber(parseFloat(check_details.discount))+isNumber(parseFloat(check_details.delcharge))-isNumber(parseFloat(check_details.markupprice))-isNumber(parseFloat(check_details.coupon_val))-isNumber(parseFloat(this.get_gift_card_val())); }
            else
            {
                checkout_details.total=isNumber(parseFloat(check_details.subtotal))+isNumber(parseFloat(check_details.tip))+isNumber(parseFloat(check_details.tax))-isNumber(parseFloat(check_details.discount))+isNumber(parseFloat(check_details.delcharge))-isNumber(parseFloat(check_details.coupon_val))-isNumber(parseFloat(this.get_gift_card_val()));
            }
            if(check_details.gift_card_id!=undefined){
                checkout_details.have_gift_card=1;
                checkout_details.gift_card_val=this.get_gift_card_val();
                checkout_details.gift_card_value=check_details.gift_card_val;
                checkout_details.gift_card_id=check_details.gift_card_id;
            } else {
                checkout_details.have_gift_card=0;
            }


            //checkout_details.order_track="<?php echo Configure::read('order_track_web') ?>"
            if(checkout_details.total==0){
                checkout_details.payment="Cash"
            }
            if(checkout_details.payment=="Credit"){
                checkout_details.card=check_details.details.card;
                //checkout_details.cardno=check_details.details.card_no;
                checkout_details.cardno=check_details.details.card_no.replace(/undefined/g,'').replace(/\s/g,'');
                checkout_details.cvv=check_details.details.cvv;
                if(check_details.details.billingzip && check_details.details.billingzip.length>0)
                    checkout_details.billingzip=check_details.details.billingzip;
                var exp=check_details.details.exp.split("/");
                checkout_details.month=exp[0];
                checkout_details.year=exp[1];
            }

            var check_name='';
            var check_name_val=false;
            var check_val='';
            var check_val_Val=0;

            if(check_details.couponcode)
                checkout_details.coupon_code=check_details.couponcode;

            jQuery.each(check_details.rest_offer_id , function(index, value){
                if(value!=null && value!=undefined)
                    checkout_details[index]=value;
            });


            //            console.log(check_details);
            //            console.log(checkout_details);
            checkout_details.delcharge=isNumber(parseFloat(check_details.delcharge))
            if(checkout_details.delcharge>0)
                checkout_details.distance=check_details.distance;
            
             $scope.is_checkout_progressing = true;
           
            var defer = $q.defer();
            defer.promise
            .then(function () {
                $http({
                    method: 'POST',
                    headers: 'application/x-www-form-urlencoded',
                    url: '/checkout/checkout',
                    data: checkout_details
                }).success(function (response) {
                    
                    $scope.is_checkout_progressing = false;
           
                    if(response.success=="true" || response.success==true){

                        //var parser = document.createElement('a');
                        //parser.href = document.URL;
                        //var res = parser.pathname.split("/");
                        //var ur="";
                        //if(res[1].localeCompare('DirectOrders')==0)
                        //    ur=res[1];
                        //else
                        //    ur="checkout"

                        if(response.order_date=='Asap'){


                            if(response.order_type=='Delivery')
                                var template = '<div class="well">Order Completed Successfully. Should be there in '+response.duration+' mins.<br/><a  href="/checkout/invoice/'+response.orderid+'" class="btn  btn-danger"  >OK</a></p></div>';
                            else
                                var template = '<div class="well">Order Completed Successfully. Please Pickup in '+response.duration+' mins.<br/><a  href="/checkout/invoice/'+response.orderid+'" class="btn  btn-danger"  >OK</a></p> </div> </div>';
                        } else {
                            if(response.order_type=='Delivery')
                                var template = '<div class="well">Order Completed Successfully. Should be there on '+response.order_date+' at '+response.order_time+'.<br/><a  href="/checkout/invoice/'+response.orderid+'" class="btn  btn-danger"  >OK</a></p></div>';
                            else
                                var template = '<div class="well">Order Completed Successfully. Please Pickup on '+response.order_date+' at '+response.order_time+'.<br/><a href="/checkout/invoice/'+response.orderid+'" class="btn  btn-danger"  >OK</a></p> </div> </div>';
                        }

                        bootbox.dialog({
                            message: template,
                            title: "Order Completed Successfully",
                            closeButton: false
                        });


                    } else {
                        
                         $scope.is_checkout_progressing = false;
           
                        var template='<div class="well">'+decodeURI(response.error)+'<br/> </div>';
                        bootbox.dialog({
                            message: template,
                            title: "Order Failed due to:"
                        });
                    }
                }).error(function(response){
                    //console.log(response);
                     $scope.is_checkout_progressing = false;
           
                });
            })    
            defer.resolve();
        }

    }]);


    function isNumber(num){
        if(isNaN(num))
            return 0;
        return num;
    }
    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + 31536000000); //1 year
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }




    var customer_details={
        name:getCookie('name')!=null?getCookie('name'):'',
        email:getCookie('email')!=null?getCookie('email'):'',
        phone:getCookie('phone')!=null?getCookie('phone'):'',
        order:getCookie('order')!=null?getCookie('order'):'',
        d_address:getCookie('d_address')!=null?getCookie('d_address'):'',
        city:getCookie('city')!=null?getCookie('city'):'',
        state:getCookie('state')!=null?getCookie('state'):'',
        zipcode:getCookie('zipcode')!=null?getCookie('zipcode'):'',
        house_no:getCookie('house_no')!=null?getCookie('house_no'):'',
        in_hotel:getCookie('in_hotel')!=null?getCookie('in_hotel'):'',
        customer_form:true

        /*getCookie('name')===null && getCookie('email')===null && getCookie('phone')===null && getCookie('order')===null*/
    }



    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }


    angular.module('ng').filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

    app.directive('ngHtml', ['$compile', function($compile) {
        return function(scope, elem, attrs) {
            if(attrs.ngHtml){
                elem.html(scope.$eval(attrs.ngHtml));
                $compile(elem.contents())(scope);
            }
            scope.$watch(attrs.ngHtml, function(newValue, oldValue) {
                if (newValue && newValue !== oldValue) {
                    elem.html(newValue);
                    $compile(elem.contents())(scope);
                }
            });
        };
    }]);
    app.directive('googleplace', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, model) {
                var options = {
                    types: [],
                    componentRestrictions: {}
                };
                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(customer.details.d_address, 'place_changed', function() {
                    scope.$apply(function() {
                        model.$setViewValue(element.val());                
                    });
                });
            }
        };
    });



    angular.module('OtdDirectives', []).
    directive('googlePlaces', function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            scope: true,
            template: '<input id="d_address" name="d_address" type="text" placeholder="Street suggestions" ng-model="customer.details.d_address" required ng-disabled="customer.details.in_hotel" ng-change="address_changed()"/>',
            link: function($scope, elm, attrs){
                var autocomplete = new google.maps.places.Autocomplete($("#d_address")[0], {
                    componentRestrictions:{'country': 'us'}
                });
                google.maps.event.addListener(autocomplete, 'place_changed', function(e) {
                    fillInAddress();
                    var place = autocomplete.getPlace();

                    //$("#d_address").val(place['name'])
                    ////////console.log($("#d_address").val());
                    //check_details.details.d_address=place['name'];
                    ////////console.log(check_details.details);
                    ////////console.log(check_details.details);
                    return;

                });

                function fillInAddress()
                {
                    // Get the place details from the autocomplete object.
                    var componentForm = {
                        street_number: 'short_name',
                        route: 'long_name',
                        locality: 'long_name',
                        administrative_area_level_1: 'short_name',
                        country: 'short_name',
                        postal_code: 'short_name'
                    };

                    var fnuForm = [
                        "d_address",
                        "city",
                        "state",
                        "zipcode"
                    ];
                    var place = autocomplete.getPlace();
                   // console.log(place);
                    // Get each component of the address from the place details
                    // and fill the corresponding field on the form.
                    var value='';
                    document.getElementById("d_address").value = value;
                    document.getElementById("city").value = value;
                    document.getElementById("state").value = value;
                    document.getElementById("zipcode").value = value;
                    for (var i = 0,j=0; i < place.address_components.length; i++)
                    {
                        var addressType = place.address_components[i].types[0];
		//	if (addressType
			console.log(addressType);
                        if (componentForm[addressType])
                        {

                            var val = place.address_components[i][componentForm[addressType]];
                            console.log(val);
                            if(addressType == "street_number")
                            {
                                //                                //////console.log('i=0 '+val);
                                if(val!='')
                                    value=val+" ";
                            }
                            else
                            {
                                ////////console.log('i=5 '+val);
                               // if(i==5)
                               // {

                               // }else{
                                    //  //////console.log('i=else '+val);


                                    value=value+val;
                                    ////////console.log(i);
                                    var inputname=fnuForm[j++];
                                                                            if(addressType=='postal_code')
                                                                                inputname='zipcode';
                                                                            if(addressType=='locality')
                                                                                inputname='city';
                                                                            if(addressType=='administrative_area_level_1')
                                                                                inputname='state';
                                    //                                        //////console.log("val= "+inputname);
                                    //                                        //////console.log("asd= "+addressType);
                                    //                                        //////console.log(value);
				    console.log("val= "+inputname);
                                    document.getElementById(inputname).value = value;
                                    document.getElementById(inputname).disabled = false;
                                    $('#'+inputname+'').trigger('input');
                                    value="";
                                //}
                            }

                        }
                    }
                }
            }
        }
    });



    app.factory('Distance', function($q, $timeout) {
        var GetDistance = function(lat,long,dest) {
            //console.log(dest);
            var service = new google.maps.DistanceMatrixService();
            var origin = new google.maps.LatLng(lat,long);
            var dfd = $.Deferred();
            service.getDistanceMatrix({
                origins: [origin],
                destinations: [dest],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                avoidHighways: false,
                avoidTolls: false
            }, function(response, status) {

             //   console.log(response);
                if (response.rows[0].elements[0].status=='OK')
                    dfd.resolve((response.rows[0].elements[0].distance.value*0.000621371).toFixed(2));
                else
                    bootbox.alert('Sorry we couldnt validate your address');
            });
            return dfd.promise();
        };
        return {
            GetDistance: GetDistance
        };

    });



    app.factory('AmPmToHour', function() {
        return function($time) {
            //////console.log($time);
            var hrs = Number($time.match(/^(\d+)/)[1]);
            var mnts = Number($time.match(/:(\d+)/)[1]);
            var format = $time.match(/\s(.*)$/)[1];
            if (format == "PM" && hrs < 12) hrs = hrs + 12;
            if (format == "AM" && hrs == 12) hrs = hrs - 12;
            var hours = hrs.toString();
            var minutes = mnts.toString();
            if (hrs < 10) hours = "0" + hours;
            if (mnts < 10) minutes = "0" + minutes;
            return(hours + ":" + minutes + ":00");
        };
    });


    app.factory('OfferService', function($http) {
        var promise;
        var OfferService = {
            get_offers: function(id) {
                if ( !promise ) {
                    // $http returns a promise, which has a then function, which also returns a promise
                    promise = $http.get('/restaurants/get_offers/'+id).then(function (response) {
                        // The then function here is an opportunity to modify the response
                        // The return value gets picked up by the then in the controller.
                        var rest_offer_id=Array();
                        for(var i=0;i<response.data.offers.length;i++){
                        
                            for(var j=0;j<response.data.offers[i].items.length;j++){
                                if(response.data.offers[i].items[j].restaurant_offer_items.type=='radio'){
                                    response.data.offers[i].items[j].restaurant_offer_items.checked=false;
                                    ////console.log(response.data.offers[i].items[j].restaurant_offer_items);
                                }
                            }
                            rest_offer_id[response.data.offers[i].restaurant_offers.id]=null;
                        }
                        // //console.log(rest_offer_id);
                        response.data['rest_offer_id']=rest_offer_id;
                        return response.data;
                    });
                }
                // Return the promise to the controller
                return promise;
            }
        };
        return OfferService;
    });

    app.factory('ThirdPartyItems', function($http) {
        var promise;
        var ThirdPartyItems = {
            get_paid_items: function() {
                if ( !promise ) {
                    // $http returns a promise, which has a then function, which also returns a promise
                    promise = $http.get('/restaurants/get_third_paid_items/').then(function (response) {
                        // The then function here is an opportunity to modify the response
                        // The return value gets picked up by the then in the controller.
                        return response.data;
                    });
                }
                // Return the promise to the controller
                return promise;
            }
        };
        return ThirdPartyItems;
    });

    app.config(['$httpProvider', function($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};    
        }
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }]);

    app.config(['$httpProvider', function($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};    
        }
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }]);
})();


