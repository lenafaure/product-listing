
window.onload = function() {

    var shoppingCart = document.getElementById("cart");
    var addToCart = document.querySelectorAll(".add-to-cart");
    var hideShoppingCart = document.getElementById("hide-shopping-cart");
    var headerCartButton = document.getElementById("cart-header-button");
    var cartItemsWrapper = document.querySelector(".cart-items-wrapper");
    var emptyCartMsg = document.getElementById("empty-cart");

    var plusButton = document.querySelectorAll(".plusButton");


    // Add item on click on "Add to Cart" button
    for (var i = 0; i < addToCart.length; i++){
        addToCart[i].addEventListener("click", function(e){
            e.preventDefault();
            addItem(this);
            shoppingCart.style.display = "block";
            this.setAttribute("disabled", true);
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
    });

    // Toggle shopping cart
    headerCartButton.addEventListener("click", function(){
        if(shoppingCart.style.display == "block") {
            shoppingCart.style.display = "none";
        } else {
            shoppingCart.style.display = "block";
        }
    });



    // Function for adding items
    function addItem(item) {
        var itemPrice = item.parentElement.children[0].children[1].innerHTML;
        var itemImage = item.parentElement.parentElement.children[0].children[0].attributes[0].textContent;
        var itemName = item.parentElement.parentElement.children[1].innerHTML;
        var itemDescription = item.parentElement.parentElement.children[2].innerHTML;

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

        emptyCartMsg.style.display = "none";
    }


}

function removeItem(item){
    var itemParent = item.parentElement.parentElement.parentElement;
    itemParent.removeChild(item.parentElement.parentElement);
}

// Increment input quantity
function decrement(item){
    var value = item.parentElement.children[1].value;

    if (value > 1){
        value--;
        item.parentElement.children[1].value = value;
    }
    else {
        removeItem(item);
    }
}

// Increment input quantity
function increment(item){
    var value = item.parentElement.children[1].value;

    value++;
    item.parentElement.children[1].value = value;

}
