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
  
  <div class="max-w-sm rounded-lg overflow-hidden shadow-md bg-white mx-auto">
    <a href={url} class="block">
      <img 
        src={imageSrc} 
        alt={altText} 
        class="w-full h-48 object-cover"
      />
      <div class="p-4">
        <h3 class="text-xl font-semibold text-gray-800">{name}</h3>
        <p class="mt-2 text-gray-600 ">{getTruncatedDescription(description)}</p>
      </div>
    </a>
  </div>
  