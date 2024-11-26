import {authenticate} from '$lib/server/pocketbase.js'
import { getSearchData } from '$lib/server/loads.js'
const pb = await authenticate()

export const load = async ({url}) => {
  try {
    const search = url.searchParams.get('query')
    const result= await getSearchData(pb,search);
    return {result}
  } catch (error) {
    console.log(error)
    return {message:error.response.message}
  } 
}
