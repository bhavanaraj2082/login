import { db } from '$lib/pocketbase';

// GET: Fetch's the user's favorites list
export async function GET({ url }) {
  const user_id = url.searchParams.get('user_id');

  if (!user_id) {
    return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 });
  }

  try {
    const favorites = await db.collection('favorites').getFullList({
      filter: `user_id="${user_id}"`,
    });
    return new Response(JSON.stringify(favorites), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST: Adds an item to the user's favorites list
export async function POST({ request }) {
  const { user_id, item_id } = await request.json();

  try {
    const record = await db.collection('favorites').create({
      user_id,
      item_id
    });

    return new Response(JSON.stringify(record), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// DELETE: Removes an item from the user's favorites list
export async function DELETE({ url }) {
  const item_id = url.searchParams.get('item_id');
  const user_id = url.searchParams.get('user_id');

  if (!item_id || !user_id) {
    return new Response(JSON.stringify({ error: 'Missing item_id or user_id' }), { status: 400 });
  }

  try {
    const favorites = await db.collection('favorites').getFullList({
      filter: `user_id="${user_id}" AND item_id="${item_id}"`,
    });

    if (favorites.length > 0) {
      await db.collection('favorites').delete(favorites[0].id);
      return new Response(null, { status: 204 });
    } else {
      return new Response(JSON.stringify({ error: 'Favorite not found' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
