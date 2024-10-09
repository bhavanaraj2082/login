<div class="relative w-full h-auto mb-5 bg-white-100">
    <!-- Main Section with Responsive Layout -->
    <section class="py-8 px-4 flex flex-col sm:flex-row-reverse sm:items-center sm:justify-between">
        
        <!-- Images Section -->
        <div class="relative bg-orange-400 p-2 rounded-lg mb-10 ml-6 sm:ml-10 sm:mr-20">
            <img 
                src="src/lib/data/Herosection/image-2.jpeg" 
                class="w-80 h-auto mx-auto sm:w-80 sm:h-60 sm:ml-1 sm:mr-10 relative mb-6 sm:-translate-x-8 sm:translate-y-12"  
                alt="" />
        </div>

        <div class="flex flex-col items-center gap-3">
            <img 
                src="src/lib/data/Herosection/image-1.jpeg" 
                class="w-20 h-auto mx-auto sm:w-40 sm:h-30 sm:ml-10 sm:mr-10 relative mb-4" 
                alt="" />
            <img 
                src="src/lib/data/Herosection/image-3.jpeg" 
                class="w-20 h-auto mx-auto sm:w-40 sm:h-30 sm:ml-10 sm:mr-10 relative" 
                alt="" />
        </div>

        <div class="w-full"></div>
    </section>

    <!-- Content Section -->
    <section> 
        <div class="absolute top-16 left-2 z-10 p-2 md:w-1/2 content-section">
            <h1 class="m-2 text-3xl font-extrabold text-black-500 md:text-3xl">
                Empowering Science with Quality Chemicals.
            </h1>
            
            <p class="py-6 m-2 lg:text-xm text-gray-500 md:text-sm">
                Welcome to Chemikart, your premier destination for high-quality chemicals and laboratory supplies.
            </p>
            <a href="/shop" 
                class="inline-block border-2 border-orange-400 text-orange-400 bg-white m-1 lg:text-lg md:text-sm py-1 px-5 square-full font-bold hover:bg-orange-400 hover:text-white transition">
                Shop Now
            </a>
            <a href="/view" 
                class="inline-block border-2 border-orange-400 text-orange-400 bg-white m-1 lg:text-lg md:text-sm py-1 px-6 square-full font-bold hover:bg-orange-400 hover:text-white transition">
                View All
            </a>
        </div>
    </section>
</div>

<style>
    /* Responsive styling */
    @media (max-width: 540px) {
        .sm\:flex-row-reverse {
            flex-direction: row; /* Stack content vertically on small screens */
        }

        .content-section {
            position: relative; /* Ensure content stays within flow */
            order: 2; /* Ensure content comes after images on mobile */
        }

        .flex {
            flex-direction: row-reverse; /* Stack images vertically */
            align-items: center; /* Center align images */
        }

        img {
            width: 80%; /* Full width for images */
            height: auto; /* Maintain aspect ratio */
            margin-bottom: 20px; /* Space between images */
        }

        /* Specific styles for the first two images */
        .first-image, .second-image {
            direction: column;
            width: 100%;  /* Adjust width as needed */
            height: 150px; /* Set a fixed height */
            object-fit: cover; /* Ensure the aspect ratio is maintained */
        }
    }

    @media (min-width: 640px) {
        .relative img {
            max-width: 80%; /* Ensure images scale properly */
        }

        .content-section {
            position: absolute; /* Revert positioning on larger screens */
            top: 16px;
            left: 2px;
            order: 1; /* Ensure content comes before images on larger screens */
        }
    }
</style>
