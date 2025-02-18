<script>
  import Category from "$lib/components/Application/Category.svelte";
  export let data;
  // console.log(data);
  import {
		PUBLIC_WEBSITE_URL,
		PUBLIC_WEBSITE_NAME
	} from '$env/static/public';

  let metadata = {
    title: `${data?.categoryData?.name} | ${PUBLIC_WEBSITE_NAME}`,
    description: data?.categoryData?.description || '',
    keywords: data?.categoryData?.keywords?.join(', ') || '',
    urlPath: `${PUBLIC_WEBSITE_URL}/applications/${data?.categoryData}`,
    image: `${PUBLIC_WEBSITE_URL}${data?.categoryData?.image} || ''}`, 
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${data?.categoryData?.name} | ${PUBLIC_WEBSITE_NAME}`,
      description: data?.categoryData?.description || '',
      url: `${PUBLIC_WEBSITE_URL}/applications/${data?.categoryData}`,
      image: `${PUBLIC_WEBSITE_URL}${data?.categoryData?.image || ''}`,
      category: data?.categoryData?.category || '', 
      additionalType: 'https://schema.org/Service',
      provider: {
        '@type': 'Organization',
        name: `${PUBLIC_WEBSITE_NAME}`,
        url: `${PUBLIC_WEBSITE_URL}`
      }
    }
  };
  console.log(metadata);
  
</script>

<Category {data} />
