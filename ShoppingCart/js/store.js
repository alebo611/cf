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

/*
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
    */
    


    this.products = [
        new product("99841", "madicken", 'madicken', 649,  [20,21,25,26,27],["green","cerise","yellow","blue","red"]),
        new product("93541", "mimer", 'mimer', 10, [19,26,27,33,36],["brown","blue","red"]),
        new product("65041", "alvin", 'alvin', 699, [19,26,27,33,36],["blue","red"]),
        new product("99641", "maja", 'maja', 699, [19,26,27,33,36],["light-brown"]),
        new product("92341", "amanda", 'amanda', 699, [19,26,27,33,36],["light-brown","red"]),
        new product("10041", "anders", 'anders', 699, [19,26,27,33,36],["blue","red"]),
        new product("66841", "molly", 'molly', 699, [19,26,27,33,36],["white","red"])


/*
bengt-10241-19-brown.png		myra-92741-60-cerise.png
billy-63241-99-red.png			nanna-98441-99-red.png
blixten-64241-60-cerise.png		navran-83141-89-blue-(big).png
bo-99341-19-brown.png			no1-21041-93-multi.png
bosse-10441-19-brown.png		prick-71641-72-green.png
caroline-93741-89-blue.png		ralf-64141-19-brown.png
charlie-66741-11-black.png		regn-63841-85-turquoise.png
emma-60241-79-pink.png			robin-99441-89-blue.png
erik-42241-11-black.png			ronnerdal-blue.png
fjaril-97941-19-brown.png		rudolf-10541-89-blue.png
hasse-11141-39-light-brown.png		sam-98241-72-green.png
hjördis-92441-39-light-brown.png	sigge-60341-11-black.png
kotte-90441-85-turqoise.png		spruttan-cerise.png
lasse-10641-19-brown.png		stina-cerise.png
lina-96641-30-yellow.png		svea-22241-79-pink.png
linnea-67041-60-cerise.png		sydney-82341-60-cerise.png
lotta-93841-39-light-brown.png		tor-91141-39-light-brown.png
madicken-99841-72-green.png
*/
    ];
}
store.prototype.getProduct = function (sku) {
    for (var i = 0; i < this.products.length; i++) {
        if (this.products[i].sku == sku)
            return this.products[i];
    }
    return null;
}
