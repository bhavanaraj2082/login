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
            console.log('++++',productNumber)
            const formdata = new FormData()
            formdata.append("product",productNumber)
            const response = await fetch('/cart?/updatedCart',{
                method:"POST",
                body:formdata
            })
            const data = await response.json()
            //console.log(data);
            let decodedString = data.data.slice(2, -2).replace(/\\"/g, '"');
            //console.log(decodedString);
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

<!-- <form class="hidden" method="POST" bind:this={form} use:enhance={()=>{
    return async({result})=>{
        console.log(result);
    }
}} action="/cart?/updatedCart">
<input type="hidden" value={JSON.stringify}></form> -->

<ShoppingCart on:onCart={handleEvent}/>