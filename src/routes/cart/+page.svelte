<script>
	// import { cartState,updateCartState } from '$lib/stores/cart.js';
    import ShoppingCart from '$lib/components/Cart/ShoppingCart.svelte'
    export let data
    import SEO from '$lib/components/SEO.svelte';
	import { PUBLIC_WEBSITE_URL, PUBLIC_WEBSITE_NAME } from '$env/static/public';

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

    let metadata = {
		title: `${PUBLIC_WEBSITE_NAME}: Cart` || 'Default Product Title',
		description:
			`Place an online order from ${PUBLIC_WEBSITE_NAME}. ${PUBLIC_WEBSITE_NAME} offers thousands of in-stock chemical products ready for same day shipping.` ||
			'Default product description',
            keywords: `${PUBLIC_WEBSITE_NAME}, cart, mycart, information, chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Chemical Products, chemicals, laboratory chemicals, industrial chemicals, specialty chemicals, chemical supply, buy chemicals, chemical solutions, chemical supplier, buy chemical products`,
		urlPath: `${PUBLIC_WEBSITE_URL}/cart` || 'Default URl',
		schema: {
			'@context': 'https://schema.org',
			'@type': 'Webpage',
			name: `${PUBLIC_WEBSITE_NAME}: Cart` || 'Default Product Title',
			description:
				`Place an online order from ${PUBLIC_WEBSITE_NAME}. ${PUBLIC_WEBSITE_NAME} offers thousands of in-stock chemical products ready for same day shipping.` ||
				'Default product description',
			url: `${PUBLIC_WEBSITE_URL}/cart`,
			brand: {
				'@type': 'Brand',
				name: `${PUBLIC_WEBSITE_NAME}`
			}
		}
	};
</script>

<SEO {metadata} />
<ShoppingCart {data}/>