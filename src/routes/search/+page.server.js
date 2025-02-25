
import { getSearchData } from '$lib/server/mongoLoads.js'
import { saveMailId } from '$lib/server/mongoActions.js';

export const load = async ({url}) => {
  try {
    const search = url.searchParams.get('query')
    const result= await getSearchData(search);
    return {result}
  } catch (error) {
    console.log(error)
    return {message:error.response.message}
  } 
}

export const actions = {
	noresults:async({request})=>{
		const body = Object.fromEntries(await request.formData());
		// console.log(body,"***********************");

		const result = await saveMailId(body);
		return  result ;
	}
}
