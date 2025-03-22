<script>
  import SubCategory from "$lib/components/Application/SubCategory.svelte";
  export let data;
  // console.log("now",data); 
  import  SEO  from '$lib/components/SEO.svelte';
  import {
		PUBLIC_WEBSITE_URL,
		PUBLIC_WEBSITE_NAME
	} from '$env/static/public';
  
  let metadata = {
    title: `${data?.subcategoryData?.name} | ${PUBLIC_WEBSITE_NAME}`,
    description: data?.subcategoryData?.description || '',
    keywords: data?.subcategoryData?.keywords?.join(', ') || '', 
    urlPath: `${PUBLIC_WEBSITE_URL}/applications/${data?.categoryData?.url}/${data?.subcategoryData?.url}`, 
    image: `${PUBLIC_WEBSITE_URL}${data?.subcategoryData?.image || ''}`, 
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${data?.subcategoryData?.name} | ${PUBLIC_WEBSITE_NAME}`,
      description: data?.subcategoryData?.description || '',
      url: `${PUBLIC_WEBSITE_URL}/applications/${data?.categoryData?.url}/${data?.subcategoryData?.url}`,
      image: `${PUBLIC_WEBSITE_URL}${data?.subcategoryData?.image || ''}`,
      category: data?.subcategoryData?.category || '', 
      additionalType: 'https://schema.org/Service',
      provider: {
        '@type': 'Organization',
        name: `${PUBLIC_WEBSITE_NAME}`,
        url: `${PUBLIC_WEBSITE_URL}`
      }
    }
  };
  // console.log(metadata);
  
</script>
<SEO {metadata} />
<SubCategory {data} profile={data.profile} />
