import { fetchProds } from '../../lib/server/actions';
export async function load({}) {
    const records = await fetchProds(pb);
    return {
        records
    };
}