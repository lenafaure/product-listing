/* Thought I would have the time to refactor, comment and rework on everything, 
I am definitely not proud of this...
If you had some guidelines on how to architect a project like this one from the 
beginning it would be great.
*/

(function() {
    var shoppingCart = document.getElementById("cart");
    var addToCart = document.querySelectorAll(".add-to-cart");
    var hideShoppingCart = document.getElementById("hide-shopping-cart");
    var headerCartButton = document.getElementById("cart-header-button");
    var cartItemsWrapper = document.querySelector(".cart-items-wrapper");
    var emptyCartMsg = document.getElementById("empty-cart");
    var overlay = document.querySelector(".overlay");

    // Object containing selected items
    var cartItems = {
        "selectedItems": [],
        "totalPrice": null
    }

    var promoCodes = {
        applied: false,
        TOPSSALE: {
            code: "TOPSSALE",
            value: 15,
            description: "15% off for Skirts",
            appliesTo: {
                items: ["Lancaster", "Liverpool"],
                allProducts: false
            },
            applied: false
        },
        WEDDINGSALE: {
            code: "WEDDINGSALE",
            value: 10,
            description: "10% off for a specific product",
            appliesTo: {
                items: ["Strasbourg"],
                allProducts: false
            },
           applied: false
        },
        BIGSALE: {
            code: "BIGSALE",
            value: 5,
            description: "5% off on total value",
            appliesTo: {
                items: [],
                allProducts: true
            },
            applied: false
        }
    }


    // Add item on click on "Add to Cart" button
    for (var i = 0; i < addToCart.length; i++){
        addToCart[i].addEventListener("click", function(e){
            e.preventDefault();
            addItem(this);
        });
    }

    // Remove item on click on "Remove" button
    document.addEventListener("click", function() {
        // Is this a good practice ? I have a feeling that the answer is no..;
        var deleteItems = document.querySelectorAll(".delete-item");
        var minusButton = document.querySelectorAll(".minusButton");

        if(deleteItems.length == 0) {
            emptyCartMsg.style.display = "block";
        }
        for (var i = 0; i < deleteItems.length; i++){
            deleteItems[i].addEventListener("click", function(e){
                e.preventDefault();
                removeItem(this);
            });
        }
    });

    // Hide shopping cart
    hideShoppingCart.addEventListener("click", function(){
        shoppingCart.style.display = "none";
        overlay.style.display = "none";
    });

    // Toggle shopping cart
    headerCartButton.addEventListener("click", function(){
        if(shoppingCart.style.display == "block") {
            shoppingCart.style.display = "none";
            overlay.style.display = "none";
        } else {
            shoppingCart.style.display = "block";
            window.scrollTo(0, 0);
            overlay.style.display = "block";
        }
    });


    // Function for adding items
    function addItem(item) {
        var itemName = item.parentElement.parentElement.children[1].innerHTML;
        var itemPrice = item.parentElement.children[0].children[1].innerHTML;
        var itemImage = item.parentElement.parentElement.children[0].children[0].attributes[0].textContent;
        var itemDescription = item.parentElement.parentElement.children[2].innerHTML;

        if(!isInCart(itemName)) {

            var div_node_cart_item = document.createElement("div");
            div_node_cart_item.className = "cart-item";

            var div_node_img_wrapper = document.createElement("div");
            div_node_img_wrapper.className = "img-wrapper";

            var img_node_cart_item = document.createElement("img");
            img_node_cart_item.setAttribute("src", itemImage);

            var div_node_desc_wrapper = document.createElement("div");
            div_node_desc_wrapper.className = "desc-wrapper";

            var span_node_product_name = document.createElement("span");
            span_node_product_name.className = "product-name uppercase";
            span_node_product_name.innerHTML = itemName;

            var p_node_product_description = document.createElement("p");
            p_node_product_description.className = "product-description";
            p_node_product_description.innerHTML = itemDescription;

            var p_node_size_description = document.createElement("p");
            p_node_size_description.className = "size-description";
            p_node_size_description.innerHTML = "Size: M";

            var div_node_qty_wrapper = document.createElement("div");
            div_node_qty_wrapper.className = "quantity-wrapper";

            var span_node_qty = document.createElement("span");
            span_node_qty.innerHTML = "Qty. ";

            var p_input_node_qty = document.createElement("input");
            p_input_node_qty.setAttribute("size", "2");
            p_input_node_qty.setAttribute("type", "text");
            p_input_node_qty.setAttribute("value", "1");

            var a_node_plus_sign = document.createElement("a");
            a_node_plus_sign.setAttribute("onclick", "increment(this);");
            a_node_plus_sign.className = "plus-minus-signs plusButton";

            var i_node_plus_icon = document.createElement("i");
            i_node_plus_icon.className = "fa fa-plus-circle fa-lg";

            var a_node_minus_sign = document.createElement("a");
            a_node_minus_sign.setAttribute("onclick", "decrement(this);");
            a_node_minus_sign.className = "plus-minus-signs minusButton";

            var i_node_minus_icon = document.createElement("i");
            i_node_minus_icon.className = "fa fa-minus-circle fa-lg";

            var a_node_delete_item = document.createElement("a");
            a_node_delete_item.className = "delete-item";
            a_node_delete_item.setAttribute("href", "#");
            a_node_delete_item.innerHTML = "Remove";

            var div_node_price_wrapper = document.createElement("div");
            div_node_price_wrapper.className = "price-wrapper";

            var span_node_price = document.createElement("span");
            span_node_price.innerHTML = itemPrice + " €";

            div_node_img_wrapper.append(img_node_cart_item);
            div_node_desc_wrapper.append(span_node_product_name);
            div_node_desc_wrapper.append(p_node_product_description);
            div_node_desc_wrapper.append(p_node_size_description);
            div_node_qty_wrapper.append(span_node_qty);
            div_node_qty_wrapper.append(p_input_node_qty);
            a_node_plus_sign.append(i_node_plus_icon);
            a_node_minus_sign.append(i_node_minus_icon);
            div_node_qty_wrapper.append(a_node_minus_sign);
            div_node_qty_wrapper.append(a_node_plus_sign);
            div_node_qty_wrapper.append(a_node_delete_item);
            div_node_price_wrapper.append(span_node_price);

            div_node_cart_item.append(div_node_img_wrapper);
            div_node_cart_item.append(div_node_desc_wrapper);
            div_node_cart_item.append(div_node_qty_wrapper);
            div_node_cart_item.append(div_node_price_wrapper);

            cartItemsWrapper.append(div_node_cart_item);
            // Push Items in cartItems object
            cartItems.selectedItems.push({
                "itemName": itemName,
                "itemPrice": parseInt(itemPrice),
                "itemPricePromo": null,
                "itemImage": itemImage,
                "itemDescription": itemDescription,
                "itemQty": 1,
                "itemTotalPrice": parseInt(itemPrice),
                "promoCodesApplied": []
            })
        } else {
            var itemInCart = find(itemName);
            for(var i = 0; i < cartItems.selectedItems.length; i++){
                if(cartItems.selectedItems[i].itemName == itemName){
                    cartItems.selectedItems[i].itemQty += 1;


                    itemInCart.children[2].children[1].value++;
                }
            }
        }

        updateTotalPrice(cartItems);

        // Hide message "Your shopping cart is empty"
        emptyCartMsg.style.display = "none";
    }

    function calculateTotalPrice() {
        var totalPrice = 0;

        for(var i = 0; i < cartItems.selectedItems.length; i++){
            if(cartItems.selectedItems[i].itemPricePromo != null) {
                console.log("ok");
                cartItems.selectedItems[i].itemTotalPrice = cartItems.selectedItems[i].itemPricePromo * cartItems.selectedItems[i].itemQty;
            }
            else {
                cartItems.selectedItems[i].itemTotalPrice = cartItems.selectedItems[i].itemPrice * cartItems.selectedItems[i].itemQty;
            }

            totalPrice = totalPrice + cartItems.selectedItems[i].itemTotalPrice;
            cartItems.totalPrice = Math.round(totalPrice);
        }
    }

    function removeItem(item){
        var itemParent = item.parentElement.parentElement.parentElement;

        if(itemParent) {
            itemParent.removeChild(item.parentElement.parentElement);
        }
        var itemName =  item.parentElement.parentElement.children[1].children[0].innerHTML;

        for(var i = 0; i < cartItems.selectedItems.length; i++){
            if(cartItems.selectedItems[i].itemName == itemName){
                cartItems.selectedItems.splice(i, 1);
            }
        }

        updateTotalPrice(cartItems);
    }

    // Decrement input quantity
    function decrement(item){
        var value = item.parentElement.children[1].value;
        var itemName =  item.parentElement.parentElement.children[1].children[0].innerHTML;

        if (value > 1){
            value--;
            item.parentElement.children[1].value = value;

            for(var i = 0; i < cartItems.selectedItems.length; i++){
                if(cartItems.selectedItems[i].itemName == itemName){
                    cartItems.selectedItems[i].itemQty -= 1;
                    cartItems.selectedItems[i].itemTotalPrice = cartItems.selectedItems[i].itemPrice * cartItems.selectedItems[i].itemQty;
                }
            }
        }
        else {
            removeItem(item);
        }

        updateTotalPrice(cartItems);
    }

    // Increment input quantity
    function increment(item){
        var value = item.parentElement.children[1].value;
        var itemName =  item.parentElement.parentElement.children[1].children[0].innerHTML;

        value++;
        item.parentElement.children[1].value = value;

        for(var i = 0; i < cartItems.selectedItems.length; i++){
            if(cartItems.selectedItems[i].itemName == itemName){
                cartItems.selectedItems[i].itemQty += 1;
                cartItems.selectedItems[i].itemTotalPrice = cartItems.selectedItems[i].itemPrice * cartItems.selectedItems[i].itemQty;
            }
        }

        updateTotalPrice(cartItems);
    }

    // Check if item is already in cart
    function isInCart(item){
        var inCart = false;

        for(var i = 0; i < cartItems.selectedItems.length; i++){
            if(cartItems.selectedItems[i].itemName == item){
                inCart = true;
            }
        }

        return inCart;
    }

    function find(itemName){
        var found = false;
        var itemsInCart = document.querySelector(".cart-items-wrapper");

        for(var i = 0; i < itemsInCart.children.length; i++){
            if(itemsInCart.children[i].children[1].children[0].innerHTML == itemName) {
                found = itemsInCart.children[i];
            }
        }
        return found;
    }

    function updateTotalPrice(cartItems){

        calculateTotalPrice();
        displayTotalPrice();
        console.log(cartItems.totalPrice);
        console.log(cartItems);
    }

    function displayTotalPrice() {
        var totalPriceDisplay = document.getElementById("total-price");
        var grandTotalDisplay = document.getElementById("grand-total");
        var shippingFeeDisplay = document.getElementById("shipping-fee");
        var totalPrice = cartItems.totalPrice;
        var shippingFee = 12;

        totalPriceDisplay.innerHTML = totalPrice;

        if(totalPrice > 100) {
            shippingFeeDisplay.className = "line-through";
            grandTotalDisplay.innerHTML = totalPrice;
        } else {
            grandTotalDisplay.innerHTML = totalPrice + shippingFee;
            shippingFeeDisplay.className = "";
        }

        updateQuantity(cartItems);
    }


    function updateQuantity(cartItems){
        var cartQtyDisplay = document.getElementById("cart-qty-items");
        var totalQty = 0;

        for(var i = 0; i < cartItems.selectedItems.length; i++){
            totalQty = totalQty + cartItems.selectedItems[i].itemQty;
        }

        cartQtyDisplay.innerHTML = totalQty;
    }

    function applyPromoCode(){
        var promoCode = document.getElementById("promo-code").value;
        var itemsInPromo = promoCodes[promoCode].appliesTo.items;

        if(promoCodes.applied == false) {
            for(var i = 0; i < cartItems.selectedItems.length; i++){
                if(itemsInPromo.indexOf(cartItems.selectedItems[i].itemName) !== -1) {
                    cartItems.selectedItems[i].promoCodesApplied.push(promoCode);
                }
            }
        }
        updatePromoPrice(promoCode);
    }

    function updatePromoPrice(promoCode){

        if(promoCodes[promoCode].applied == false){
            for( var i = 0; i < cartItems.selectedItems.length; i++ ){
                if(promoCodes[promoCode].appliesTo.allProducts === true) {

                    if( cartItems.selectedItems[i].itemPricePromo != null) {
                        cartItems.selectedItems[i].itemPricePromo = cartItems.selectedItems[i].itemPricePromo - (cartItems.selectedItems[i].itemPricePromo * (promoCodes[promoCode].value / 100));
                    }
                    else {
                        cartItems.selectedItems[i].itemPricePromo = cartItems.selectedItems[i].itemPrice - (cartItems.selectedItems[i].itemPrice * (promoCodes[promoCode].value / 100));
                    }

                    cartItems.selectedItems[i].itemTotalPrice = cartItems.selectedItems[i].itemPricePromo * cartItems.selectedItems[i].itemQty;
                    promoCodes[promoCode].applied = true;
                }
                else if((cartItems.selectedItems[i].promoCodesApplied.indexOf(promoCode) !== -1)
                    && promoCodes[promoCode].appliesTo.allProducts == false) {

                    if( cartItems.selectedItems[i].itemPricePromo != null) {
                        cartItems.selectedItems[i].itemPricePromo = cartItems.selectedItems[i].itemPricePromo - (cartItems.selectedItems[i].itemPricePromo * (promoCodes[promoCode].value / 100));
                    }
                    else {
                        cartItems.selectedItems[i].itemPricePromo = cartItems.selectedItems[i].itemPrice - (cartItems.selectedItems[i].itemPrice * (promoCodes[promoCode].value / 100));
                    }

                    cartItems.selectedItems[i].itemTotalPrice = cartItems.selectedItems[i].itemPricePromo * cartItems.selectedItems[i].itemQty;
                    promoCodes[promoCode].applied = true;
                }
            }
        }
        updateTotalPrice(cartItems);
    }
})();
