<script>
  export let imageSrc;    
  export let altText;      
  export let name;       
  export let description;  
  export let url;           

  const getTruncatedDescription = (description, maxWords = 10) => {
    const words = description.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';  // Add ellipsis if truncated
    }
    return description;
  };
</script>

<div class="group relative max-w-sm rounded-lg overflow-hidden shadow-md bg-white mx-auto transition-shadow duration-300 hover:shadow-xl">
  <a href={url} class="block relative z-10">
    <div class="relative">
      <img 
        src={imageSrc} 
        alt={altText} 
        class="w-full h-48 object-cover opacity-90 transition-transform duration-1000 ease-in-out group-hover:scale-105 group-hover:opacity-100"
      />
    </div>
    <div class="absolute inset-0 bg-opacity-20 transition-all duration-500 ease-in-out group-hover:bg-opacity-0 z-10 pointer-events-none"></div>
    <div class="p-4">
      <h3 class="text-xl font-semibold text-gray-800 group-hover:text-primary-600 transition-colors duration-500">
        {name}
      </h3>
      <p class="mt-2 text-gray-600 text-justify">
        {getTruncatedDescription(description) || "No description available"}
      </p>
    </div>
  </a>
</div>