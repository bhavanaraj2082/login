import {singleNews} from '$lib/server/mongoLoads.js'

export const load = async ({ params}) => {
    const { news } = params;
    try {
      const singleNewsData = await singleNews(news);
      return {singleNewsData};

  } catch (error) {
      console.error("Failed to load data:", error);
  }

}

