<script>
  export let data;

  const subcategories = data.records;
  const categoryName = subcategories[0].expand.category.name;
  const subCategoryName = subcategories[0].expand.subCategory.name;

  console.log("categoryName:", categoryName);
  console.log("subCategoryName:", subCategoryName);

  import subcategorydatas from "$lib/data/subcategorydatas.json";
  console.log("--->", subcategorydatas);

  const findContent = (categoryName, subCategoryName) => {
    const category = subcategorydatas.find(
      (category) => category.category.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (category) {
      const subCategory = category.category.subcategories.find(
        (subCategory) => subCategory.name.toLowerCase() === subCategoryName.toLowerCase()
      );
      if (subCategory) {
        return subCategory.content;
      } else {
        return "No content available"; 
      }
    } else {
      return "No content available"; 
    }
  };

  const content = findContent(categoryName, subCategoryName);
</script>

<div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 my-10 px-3">
  <img
    src={`/subcategory/${categoryName}/${subCategoryName || "img"}.webp`}
    alt="img"
    class="w-full h-52 md:w-80 md:h-72 object-cover rounded-lg"
  />

  <div class="flex flex-col">
    <h1 class="text-2xl font-semibold mb-2 text-primary-400">
      {subCategoryName}
    </h1>
    <p class="text-base text-content">{content}</p>
  </div>
</div>
