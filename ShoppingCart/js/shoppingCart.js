﻿//----------------------------------------------------------------
// shopping cart
//
function shoppingCart(cartName) {
    this.cartName = cartName;
    this.clearCart = false;
    this.checkoutParameters = {};
    this.items = [];
    //this.lismail = 'linli781@gmail.com';
    this.lismail = 'linli781-facilitator@gmail.com'; // test account
    this.baseurl = 'http://php-alebo.rhcloud.com' //openshift test

    // load items from local storage when initializing
    this.loadItems();

    // save items to local storage when unloading
    var self = this;
    $(window).unload(function () {
        if (self.clearCart) {
            self.clearItems();
        }
        self.saveItems();
        self.clearCart = false;
    });
}

// load items from local storage
shoppingCart.prototype.loadItems = function () {
    var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;
    if (items != null && JSON != null) {
        try {
            var items = JSON.parse(items);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.sku != null && item.name != null && item.price != null && item.quantity != null) {
                    item = new cartItem(item.sku, item.name, item.price, item.quantity, item.size, item.color);
                    this.items.push(item);
                }
            }
        }
        catch (err) {
            // ignore errors while loading...
        }
    }
}

// save items to local storage
shoppingCart.prototype.saveItems = function () {
    if (localStorage != null && JSON != null) {
        localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
    }
}

// adds an item to the cart
shoppingCart.prototype.addItem = function (sku, name, price, quantity, size, color) {
    quantity = this.toNumber(quantity);
    if (quantity != 0) {

        // update quantity for existing item
        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
            var item = this.items[i];
            if (item.sku == sku && item.size == size && item.color == color) {
                found = true;
                item.quantity = this.toNumber(item.quantity + quantity);
                if (item.quantity <= 0) {
                    this.items.splice(i, 1);
                }
            }
        }

        // new item, add now
        if (!found) {
            var item = new cartItem(sku, name, price, quantity, size, color);
            this.items.push(item);
        }

        // save changes
        this.saveItems();
    }
}

// get the total price for all items currently in the cart
shoppingCart.prototype.getTotalPrice = function (sku) {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku == null || item.sku == sku) {
            total += this.toNumber(item.quantity * item.price);
        }
    }
    return total;
}

// get the total price for all items currently in the cart
shoppingCart.prototype.getTotalCount = function (sku) {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku == null || item.sku == sku) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
}

// clear the cart
shoppingCart.prototype.clearItems = function () {
    this.items = [];
    this.saveItems();
}

// define checkout parameters
shoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

    // check parameters
    if (serviceName != "PayPal" && serviceName != "Google" && serviceName != "Stripe" && serviceName != "Alipay") {
        throw "serviceName must be 'PayPal' or 'Google' or 'Stripe' or 'Alipay'.";
    }
    if (merchantID == null) {
        throw "A merchantID is required in order to checkout.";
    }

    // save parameters
    this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
}

// check out
shoppingCart.prototype.checkout = function (serviceName, clearCart) {

    // select serviceName if we have to
    if (serviceName == null) {
        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
        serviceName = p.serviceName;
    }

    // sanity
    if (serviceName == null) {
        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
    }

    // go to work
    var parms = this.checkoutParameters[serviceName];
    if (parms == null) {
        throw "Cannot get checkout parameters for '" + serviceName + "'.";
    }
    switch (parms.serviceName) {
        case "PayPal":
            this.checkoutPayPal(parms, clearCart);
            break;
        case "Google":
            this.checkoutGoogle(parms, clearCart);
            break;
        case "Stripe":
            this.checkoutStripe(parms, clearCart);
            break;
        case "Alipay":
            this.checkoutAlipay(parms, clearCart);
            break;
        default:
            throw "Unknown checkout service: " + parms.serviceName;
    }
}

// check out using PayPal
// for details see:
// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
shoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {

    // global data
    var data = {
        cmd: "_cart",
        business: parms.merchantID,
        upload: "1",
        rm: "2",
        charset: "utf-8"
    };
    var curra=allCurrencies[localStorage['chosenCurrency']];

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_number_" + ctr] = item.sku;
        data["item_name_" + ctr] = item.name;
        data["quantity_" + ctr] = item.quantity;
        data["amount_" + ctr] = (item.price * curra.rate).toFixed(2);
        data["on0_" + ctr] = "size";
        data["os0_" + ctr] = item.size;
        data["on1_" + ctr] = "color";
        data["os1_" + ctr] = item.color;
    }

    data["business"] = this.lismail;
    data["currency_code"] = curra.abb;

    // build form
    var form = $('<form/></form>');
    form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}

// check out using Google Wallet
// for details see:
// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
// developers.google.com/checkout/developer/interactive_demo
shoppingCart.prototype.checkoutGoogle = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.sku;
        data["item_description_" + ctr] = item.name;
        data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_quantity_" + ctr] = item.quantity;
        data["item_merchant_id_" + ctr] = parms.merchantID;
    }

    // build form
    var form = $('<form/></form>');
    // NOTE: in production projects, use the checkout.google url below;
    // for debugging/testing, use the sandbox.google url instead.
    //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
    form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}

// check out using Stripe
// for details see:
// https://stripe.com/docs/checkout
shoppingCart.prototype.checkoutStripe = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.sku;
        data["item_description_" + ctr] = item.name;
        data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_quantity_" + ctr] = item.quantity;
    }

    // build form
    var form = $('.form-stripe');
    form.empty();
    // NOTE: in production projects, you have to handle the post with a few simple calls to the Stripe API.
    // See https://stripe.com/docs/checkout
    // You'll get a POST to the address below w/ a stripeToken.
    // First, you have to initialize the Stripe API w/ your public/private keys.
    // You then call Customer.create() w/ the stripeToken and your email address.
    // Then you call Charge.create() w/ the customer ID from the previous call and your charge amount.
    form.attr("action", parms.options['chargeurl']);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // ajaxify form
    form.ajaxForm({
        success: function () {
            $.unblockUI();
            alert('Thanks for your order!');
        },
        error: function (result) {
            $.unblockUI();
            alert('Error submitting order: ' + result.statusText);
        }
    });

    var token = function (res) {
        var $input = $('<input type=hidden name=stripeToken />').val(res.id);

        // show processing message and block UI until form is submitted and returns
        $.blockUI({ message: 'Processing order...' });

        // submit form
        form.append($input).submit();
        this.clearCart = clearCart == null || clearCart;
        form.submit();
    };

    StripeCheckout.open({
        key: parms.merchantID,
        address: false,
        amount: this.getTotalPrice() *100, /** expects an integer **/
        currency: 'usd',
        name: 'Purchase',
        description: 'Description',
        panelLabel: 'Checkout',
        token: token
    });
}

/*
Prod Examples: https://mapi.alipay.com/cooperate/gateway.do?total_fee=13&currency=USD&notify_url=http%3A%2F%2Fwww.tabao.com&service=create_forex_trade&agent=2088002007018916&partner=2088002007018916&out_trade_no=16177126201&subject=42560013718&return_url=http%3A%2F%2Fwww.tabao.com&body=71819701647&sign=UzZ7bRelBtSVB63jsfI9vbu3d21442SJV88po0XvIptqWGM4rxP5EQ%3D%3D&sign_type=DSA

CREATE_ACTIVE_PAY_BY_USER (only RMB in china)
https://mapi.aliPay.com/gateway.do?_input_ charset=UTF-8&body=Science+Fiction&notify_url=https%3A%2F%2Falipay.cybersource.com&out_trade_no=12345678901234567890123456789012&partner=2088201564874474&payment_type=1&return_url=http%3A%2F%2Flocalhost%2Fpay%2Falipay_return.jsp&seller_email=alipay-test%40alipay.com&service=
create_direct_pay_by_user&subject=Book&total_fee=0.01&sign=989338fdb4babc91fdf43a53f718991b&sign_type=MD5

Test example: http://mapi.alipay.net/gateway.do?body=test&subject=test&sign_type=MD5&out_trade_no=4403648718928911&currency=USD&total_fee=0.1&partner=2088101122136241&notify_url=http%3A%2F%2Fapi.test.alipay.net%2Fatinterface%2Freceive_notify.htm&sendFormat=normal&return_url=https%3A%2F%2Fdevmobile.inicis.com%2Fsmart%2Ftestmall%2Freturn_url_test.php%3FOID%3D20131008414885731&sign=22a0b5d9fcfa4c4b2633c787aefcb2cc&_input_charset=UTF-8&service=create_forex_trade

https://mapi.alipay.net/gateway.do?body=test&subject=test&sign_type=MD5&out_trade_no=4403648718928911&currency=USD&total_fee=0.1&partner=2088101122136241&notify_url=http%3A%2F%2Fapi.test.alipay.net%2Fatinterface%2Freceive_notify.htm&sendFormat=normal&return_url=https%3A%2F%2Fdevmobile.inicis.com%2Fsmart%2Ftestmall%2Freturn_url_test.php%3FOID%3D20131008414885731&sign=22a0b5d9fcfa4c4b2633c787aefcb2cc&_input_charset=UTF-8&service=create_forex_trade
*/
shoppingCart.prototype.checkoutAlipay = function (parms, clearCart) {
    

    // global data
    var data = {
        body: "test",
        subject:"test",
        sign_type: "MD5",
        out_trade_no:"4403648718928911",
        partner:"2088101122136241",
        notify_url:this.baseurl+"/plainphp/receive_notify.html",
        sendFormat:"normal",
        return_url:this.baseurl+"/plainphp/return_test.php?OID=20131008414885731",
        //sign:"760bdzec6y9goq7ctyx96ezkz78287de",
        sign:"22a0b5d9fcfa4c4b2633c787aefcb2cc",
        _input_charset:"UTF-8",
        service:"create_forex_trade",
    };

//https://mapi.alipay.net/gateway.do?body=test&

    var curra=allCurrencies[localStorage['chosenCurrency']];

    //goods=sku,name,quantity,price,size,color;...
    var goods="";
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        
        //goods=sku,name,quantity,price,size,color;...
        goods += item.sku;
        goods += ","+item.name;
        goods += ","+item.quantity;
        goods += ","+(item.price * curra.rate).toFixed(2);
        goods += ","+item.size;
        goods += ","+item.color;
        goods += ";";
    }
        data["goods"] = goods;
        data["currency"] = curra.abb;
        data["total_fee"] = this.getTotalPrice();

    // build form
    var form = $('<form/></form>');
    form.attr("action", "http://localhost:8888/apsim/"); //own test
    //form.attr("action", "https://mapi.alipay.net/gateway.do"); //alipay test
    //form.attr("action", "https://mapi.alipay.com/gateway.do"); //alipay prod
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    //this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}

// utility methods
shoppingCart.prototype.addFormFields = function (form, data) {
    if (data != null) {
        $.each(data, function (name, value) {
            if (value != null) {
                var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                form.append(input);
            }
        });
    }
}
shoppingCart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
}

//----------------------------------------------------------------
// checkout parameters (one per supported payment service)
//
function checkoutParameters(serviceName, merchantID, options) {
    this.serviceName = serviceName;
    this.merchantID = merchantID;
    this.options = options;
}

//----------------------------------------------------------------
// items in the cart
//
function cartItem(sku, name, price, quantity, size, color) {
    this.sku = sku;
    this.name = name;
    this.price = price * 1;
    this.quantity = quantity * 1;
    this.size = size;
    this.color = color;
}

