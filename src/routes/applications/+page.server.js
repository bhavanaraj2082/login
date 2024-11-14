import data from '$lib/data/applications.json';

export async function load() {
  if (!Array.isArray(data) || data.length === 0) {
    return { status: 404, error: 'Data not found' };
  }

  return {
    categoryData: data,
  };
}
