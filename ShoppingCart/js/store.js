//----------------------------------------------------------------
// store (contains the products)
//
// NOTE: nutritional info from http://www.cspinet.org/images/fruitcha.jpg
// score legend:
// 0: below 5% of daily value (DV)
// 1: 5-10% DV
// 2: 10-20% DV
// 3: 20-40% DV
// 4: above 40% DV
//
function store($http) {


    $http({method: 'GET', url: '/cakephp/shoes/getAllForSale.json'}).
    success(function(data, status, headers, config) {
        this.shoes = data;
        for( s in data['shoes']){
                $name=data['shoes'][s]['shoes']['name'];
                $color=data['shoes'][s]['shoes']['color'];
                $size=data['shoes'][s]['shoes']['size'];
            }
      // this callback will be called asynchronously
      // when the response is available
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
    


    this.products = [
        new product("99841", "Madicken", 'madicken', 649,  [20,21,25,26,27],["green","cerise","yellow","blue","red"]),
        new product("93541", "Mimer", 'mimer', 699, [19,26,27,33,36],["brown","blue","red"])
    ];
}
store.prototype.getProduct = function (sku) {
    for (var i = 0; i < this.products.length; i++) {
        if (this.products[i].sku == sku)
            return this.products[i];
    }
    return null;
}
