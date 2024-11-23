<script>
	import { viewedCart,updateCartState } from '$lib/stores/alsoViewedProducts_Store.js';
    import ShoppingCart from '$lib/components/Cart/ShoppingCart.svelte'
    
    const handleEvent = async(e)=>{
        let {isExpired} = e.detail
        console.log("form event",isExpired);
        if(isExpired){
            console.log("before",$viewedCart);
            let productNumber = $viewedCart.map(cart=>cart.partNumber)
            productNumber = [...new Set(productNumber)]
            const formdata = new FormData()
            formdata.append("product",productNumber)
            const response = await fetch('/cart?/updatedCart',{
                method:"POST",
                body:formdata
            })
            const data = await response.json()
            let decodedString = data.data.slice(2, -2).replace(/\\"/g, '"');
            let result = JSON.parse(decodedString);
            console.log("==============",result);
             await result.map(cart=>{
                cart.priceSize.map(sz=>{
                     let search = $viewedCart.find(crt=>crt.priceSize.size === sz.size)
                     if(search !== undefined){
                        search.priceSize = sz
                     }
                })
               
            })
            console.log("after",$viewedCart);
            updateCartState($viewedCart)
		    localStorage.setItem("cartTimeStamp",Date.now())
        }
    }
</script>


<ShoppingCart on:onCart={handleEvent}/>