
import { getSearchData } from '$lib/server/mongoLoads.js'

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
