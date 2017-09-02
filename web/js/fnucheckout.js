(function(){
    var app=angular.module('customer', []);
    
    app.controller('CustomerController',['$log','$scope','$timeout',function($log, $scope, $timeout, cfpLoadingBar){
        this.details=customer_details;
        $log.log(this.details);
        $scope.addDetails = function(){
            setCookie('name',customer_details.name);
            setCookie('email',customer_details.email);
            setCookie('phone',customer_details.phone);
            //this.apply(function(){
              //  this.details.name=$scope.customer.c.name;
            //});
            //setCookie($scope.customer.details.name);
            $("#customer_details_unfilled").slideUp('fast');
            $("#customer_details_filled").slideDown('fast');
           customer_details.customer_form=false;
        //
            
        }
    }]);
    
    
   
    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + 31536000000); //1 year
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }


   
    
    var customer_details={
        name:getCookie('name'),
        email:getCookie('email'),
        phone:getCookie('phone'),
        order:null,
        customer_form:true/*getCookie('name')===null && getCookie('email')===null && getCookie('phone')===null && getCookie('order')===null*/
    }



    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

    
})();