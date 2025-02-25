import {newsroom} from '$lib/server/mongoLoads.js'

export const load = async ({ parent }) => {
    try {
      const newsrooms = await newsroom();
      return {newsrooms};

  } catch (error) {
      console.error("Failed to load data:", error);
  }

}

