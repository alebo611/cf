'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $routeParams, DataService) {

    // get store and cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;

    // use routing to pick the selected product
    if ($routeParams.productSku != null) {
        $scope.product = $scope.store.getProduct($routeParams.productSku);
        $scope.chosenSize = $scope.product.sizes[0];
        $scope.chosenColor = $scope.product.colors[0];
    }

    var chosenLang=localStorage['language']
    var chosenCurrency=localStorage['currency']

    

    if (chosenLang){
        if(chosenLang=='swedish'){
            $scope.lang=swedish;
        }
        if(chosenLang=='english'){
            $scope.lang=english;
        }
        if(chosenLang=='chinese'){
            $scope.lang=chinese;
        }
    }
    else {
        $scope.lang=swedish;
    }

    if (chosenCurrency){
        $scope.currency=chosenCurrency;
    }
    else {
        $scope.currency='SEK';
    }

    $scope.changeLanguage = function(language) {
        if(language=='swedish'){
            this.lang=swedish;
        }
        if(language=='english'){
            this.lang=english;
        }
        if(language=='chinese'){
            this.lang=chinese;
        }
        localStorage['language']=language;
    };

    $scope.changeCurrency = function(currency) {
        this.currency=currency;
        localStorage['currency']=currency;
    };
}
