<script>
  export let data;
  // console.log("data",data);
  import {
		PUBLIC_WEBSITE_URL,
		PUBLIC_WEBSITE_NAME
	} from '$env/static/public';
  import SubSubCategory from "$lib/components/Application/SubSubCategory.svelte";

  let metadata = {
    title: `${data?.subsubcategoryData?.name} | ${PUBLIC_WEBSITE_NAME}`,
    description: data?.subsubcategoryData?.description || '',
    keywords: data?.subsubcategoryData?.keywords?.join(', ') || '',
    urlPath: `${PUBLIC_WEBSITE_URL}/applications/${data?.category}/${data?.subcategory}/${data?.subsubcategoryData?.url}`,
    image: `${PUBLIC_WEBSITE_URL}${data?.subsubcategoryData?.image || ''}`, 
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${data?.subsubcategoryData?.name} | ${PUBLIC_WEBSITE_NAME}`,
      description: data?.subsubcategoryData?.description || '',
      url: `${PUBLIC_WEBSITE_URL}/applications/${data?.category}/${data?.subcategory}/${data?.subsubcategoryData?.url}`,
      image: `${PUBLIC_WEBSITE_URL}${data?.subsubcategoryData?.image || ''}`,
      category: data?.subsubcategoryData?.category || '', 
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

<SubSubCategory {data} />
