<script>
	// import { cartState,updateCartState } from '$lib/stores/cart.js';
    import ShoppingCart from '$lib/components/Cart/ShoppingCart.svelte'
    export let data
    
    // const handleEvent = async(e)=>{
    //     let {isExpired} = e.detail
    //     console.log("form event",isExpired);
    //     if(isExpired){
    //         console.log("before",$cartState);
    //         let productNumber = $cartState.map(cart=>cart.partNumber)
    //         productNumber = [...new Set(productNumber)]
    //         const formdata = new FormData()
    //         formdata.append("product",productNumber)
    //         const response = await fetch('/cart?/updatedCart',{
    //             method:"POST",
    //             body:formdata
    //         })
    //         const data = await response.json()
    //         let decodedString = data.data.slice(2, -2).replace(/\\"/g, '"');
    //         let result = JSON.parse(decodedString);
    //         console.log("==============",result);
    //          await result.map(cart=>{
    //             cart.priceSize.map(sz=>{
    //                  let search = $cartState.find(crt=>(crt.priceSize.size === sz.size && crt.partNumber === cart.productNumber ))
    //                  if(search !== undefined){
    //                     search.priceSize = sz
    //                  }
    //             })
               
    //         })
    //         console.log("after",$cartState);
    //         updateCartState($cartState)
	// 	    localStorage.setItem("cartTimeStamp",Date.now())
    //     }
    // }
</script>


<ShoppingCart {data}/>