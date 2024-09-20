<script>
	import { onMount } from 'svelte';
	onMount(() => {
	const hamburger = document.getElementById('hamburger');
	const dropdownMenu = document.getElementById('dropdownMenu');

	hamburger.addEventListener('click', function() {
		dropdownMenu.classList.toggle('hidden');
	});

	document.querySelectorAll('.toggle-content').forEach(button => {
		button.addEventListener('click', function(event) {
			event.stopPropagation(); 
			const content = button.closest('li').nextElementSibling;
			content.classList.toggle('hidden');
		});
	});
});
		</script>

   
    <style>
        .megamenu {
            display: none; 
        }
        .group:hover .megamenu {
            display: block; 
        }
    </style>
 <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
<body class="bg-gray-100">

    <div class="w-full px-5 py-5 border-b bg-white relative">
        
        <div class="md:hidden">
            <button id="hamburger" class="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none p-4 rounded-lg text-xl">
				&#9776;
			</button>
        </div>

       
        <ul class="hidden md:flex flex-col md:flex-row md:flex-wrap gap-4">
            <li class="relative group block">
                <a href="https://www.lgcstandards.com/US/en/Research-Tools/cat/323667" class="mode text-black hover:underline font-bold block pl-2">Research Tools</a>
                    <div class="megamenu hidden w-screen h-3/4 fixed top-30 left-0 z-20 bg-white overflow-y-auto group-hover:block">
                   <div class="flex p-4">
            <div class="w-1/3 pr-4">
            <p class="font-bold">Our Products</p>
                                    <ul class="mt-2 space-y-1">
                                        <li>Cancer research</li>
                                        <li>Neurology</li>
                                        <li>Covid-19 research</li>
                                        <li>Infectious disease research</li>
                                        <li>Pharmaceutical toxicology</li>
                                        <li>Stable isotope labelled</li>
                                        <li>Synthetic chemistry</li>
                                        <li>Building blocks</li>
                                        <li>Next-generation cancer models</li>
                                        <li>Immortalised primary cells</li>
                                        <li>Primary cells</li>
                                    </ul>
									<a href="https://www.lgcstandards.com/US/en/Research-Tools/cat/323667" class="font-bold text-blue-500 mt-2 inline-block hover:underline">View All</a>
                                </div>
                                <div class="w-full md:w-1/3 px-4">
                                    <p class="font-bold">Resources</p>
                                    <ul class="mt-2 space-y-1">
                                        <li>Cell lines</li>
                                        <li>Immune cells</li>
                                        <li>Culture reagents</li>
                                        <li>Microorganisms</li>
                                        <li>Virology strains</li>
                                        <li>Topic insights</li>
                                        <li>Custom quotation</li>
                                    </ul>
                                </div>
                                <div class="w-full md:w-1/3 pl-4 relative">
                                    <img src="https://www.lgcstandards.com/medias/sys_master/root/h59/h13/10583540957214/TRC-convergence-450x428.jpg" alt="TRC Convergence" class="mb-4">
                                    <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                                        <div class="bg-black bg-opacity-50 text-white p-4 flex flex-col items-center justify-center">
                                            <p class="font-bold text-lg">Everything on one site!</p>
                                            <p>TRC research chemicals are now fully available at lgcstandards.com</p>
                                        </div>
                                        <a href="https://www.lgcstandards.com/GB/en/TRC/cat/279854" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Explore now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
            </li>
          
            <li class="relative group block">
                <a href="https://www.lgcstandards.com/US/en/Pharmaceutical-Reference-Standards/cat/279492" class="mode text-black hover:underline font-bold block pl-2">Pharmaceuticals</a>
    <div class="megamenu hidden w-screen h-3/4 fixed top-30 left-0 z-20 bg-white overflow-y-auto group-hover:block">
          <div class="flex p-4">
            <div class="w-1/3 pr-4">
              <p class="font-bold">Our Products</p>
              <ul class="mt-2 space-y-1">
                <li>API standards</li>
                <li>Excipient standards</li>
                <li>Impurity standards</li>
                <li>Nitrosamines</li>
                <li>Pharmacopoeial standards</li>
                <li>European Pharmacopoeia (Ph. Eur.)</li>
                <li>British Pharmacopoeia</li>
                <li>Stable isotope labelled standards</li>
                <li>Pharmacopoeia listed materials</li>
                <li>Enzyme activators, inhibitors & substrates</li>
              </ul>
			  <a href="https://www.lgcstandards.com/US/en/Pharmaceutical-Reference-Standards/cat/279492" class="font-bold text-blue-500 mt-2 inline-block hover:underline">View All</a>
            </div>
            <div class="w-1/3 px-4">
              <p class="font-bold">Resources</p>
              <ul class="mt-2 space-y-1">
                <li>Neurochemicals</li>
                <li>Carbohydrates</li>
                <li>Extractables and leachables</li>
                <li>Pharmaceutical proficiency testing</li>
                <li>Pharmaceutical toxicology</li>
                <li>Elemental impurities</li>
                <li>Physical properties</li>
              </ul>
            </div>
            <div class="w-1/3 pl-4 relative">
              <img src="https://www.lgcstandards.com/medias/sys_master/root/h59/h13/10583540957214/TRC-convergence-450x428.jpg" alt="TRC Convergence" class="mb-4">
              <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                <div class="bg-black bg-opacity-50 text-white p-4 flex flex-col items-center justify-center">
				<p class="font-bold text-lg">Everything on one site!</p>
			    <p>TRC research chemicals are now fully available at lgcstandards.com</p>
				</div>
                <a href="https://www.lgcstandards.com/GB/en/TRC/cat/279854" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Explore now</a>
              </div>
            </div>
          </div>
        </div>
	</li>
					<li class="relative group block">
                <a href="https://www.lgcstandards.com/US/en/Food-and-Beverage-Reference-Materials/cat/279493" class="mode text-black hover:underline font-bold block pl-2">Food & Beverages</a>
    <div class="megamenu hidden w-screen h-3/4 fixed top-30 left-0 z-20 bg-white overflow-y-auto group-hover:block">
         <div class="flex p-4">
            <div class="w-1/3 pr-4">
              <p class="font-bold">Our Products</p>
              <ul class="mt-2 space-y-1">
                <li>Cannabis-related compounds</li>
                <li>Dyes & metabolites</li>
                <li>Allergens</li>
                <li>Nutritional composition compounds</li>
                <li>Food additives, flavours & adulterants</li>
                <li>Mycotoxins</li>
                <li>Stability studies</li>
                <li>Traceability</li>
              </ul>
              <a href="https://www.lgcstandards.com/US/en/Food-and-Beverage-Reference-Materials/cat/279493" class="font-bold text-blue-500 mt-2 inline-block hover:underline">View All</a>
            </div>
            <div class="w-1/3 px-4">
              <p class="font-bold">Resources</p>
              <ul class="mt-2 space-y-1">
                <li>Food safety testing</li>
                <li>Method validation</li>
                <li>Food contact materials</li>
                <li>Trace analysis</li>
              </ul>
            </div>
            <div class="w-1/3 pl-4 relative">
              <img src="https://www.lgcstandards.com/medias/sys_master/root/h59/h13/10583540957214/TRC-convergence-450x428.jpg" alt="TRC Convergence" class="mb-4">
              <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                <div class="bg-black bg-opacity-50 text-white p-4 flex flex-col items-center justify-center">
				<p class="font-bold text-lg">Everything on one site!</p>
				<p>TRC research chemicals are now fully available at lgcstandards.com</p>
				</div>
                <a href="https://www.lgcstandards.com/GB/en/TRC/cat/279854" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Explore now</a>
              </div>
            </div>
          </div>
        </div>
					</li>
					 <li class="relative group block">
                <a href="https://www.lgcstandards.com/US/en/Industrial-Reference-Materials/cat/279495" class="mode text-black hover:underline font-bold block pl-2">Industrial</a>
    <div class="megamenu hidden w-screen h-3/4 fixed top-30 left-0 z-20 bg-white overflow-y-auto group-hover:block">
          <div class="flex p-4">
                        <div class="w-1/3 pr-4"> 
                            <p class="font-bold">Our Products</p>
                            <ul class="mt-2 space-y-1">
                                <li>Petroleum reference materials</li>
                                <li>Physical property analysis standards</li>
                                <li>Sulfur, Nitrogen & Chlorine standards</li>
                                <li>Metallo-organic standards</li>
                                <li>Matrix oils & solvents</li>
                                <li>Biodiesel standards</li>
                                <li>Aqueous inorganic</li>
                                <li>Metal alloys</li>
                                <li>Aluminium base standards</li>
                                <li>Process materials, geological, cement and soils</li>
                                <li>XRF monitor glasses</li>
                                <li>Laboratory consumables</li>
                                <li>Equipment for sample preparation</li>
                            </ul>
                            <a href="https://www.lgcstandards.com/US/en/Industrial-Reference-Materials/cat/279495" class="font-bold text-blue-500 mt-2 inline-block hover:underline">View All</a>
                        </div>
                        <div class="w-1/3 px-4"> 
                            <p class="font-bold">Resources</p>
                            <ul class="mt-2 space-y-1">
                                <li>Industrial testing services</li>
                                <li>Consultation on material standards</li>
                            </ul>
                        </div>
                        <div class="w-1/3 pr-4 relative"> 
                            <img src="https://www.lgcstandards.com/medias/sys_master/root/hea/he1/9927889322014/Formenunew.jpg" alt="TRC Convergence" class="mb-4">
                             <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                                 <div class="bg-black bg-opacity-50 text-white p-4 flex flex-col items-center justify-center">
								<p class="font-bold text-lg">Everything on one site!</p>
								<p>TRC research chemicals are now fully available at lgcstandards.com</p>
								</div>
                                <a href="https://www.lgcstandards.com/GB/en/TRC/cat/279854" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Explore now</a>
                            </div>
                        </div>
                    </div>
                </div>
						 
						</li>
            <li class="relative group block">
                <a href="https://www.lgcstandards.com/US/en/Proficiency-Testing/cat/280731" class="mode text-black hover:underline font-bold block pl-2">Proficiency & Testing</a>
    
         <div class="megamenu hidden w-screen h-3/4 fixed top-30 left-0 z-20 bg-white overflow-y-auto group-hover:block">
                    <div class="flex p-4">
                        <div class="w-1/3 pr-4"> 
                            <p class="font-bold">Our Products</p>
                            <ul class="mt-2 space-y-1">
                                <li>Food & Feed standards</li>
                                <li>Beverage testing materials</li>
                                <li>Water & Environmental standards</li>
                                <li>Consumer Safety testing</li>
                                <li>Pharmaceutical standards</li>
                                <li>Clinical testing materials</li>
                                <li>Forensic standards</li>
                                <li>Quality Control Materials</li>
                            </ul>
							<a href="https://www.lgcstandards.com/US/en/Proficiency-Testing/cat/280731" class="font-bold text-blue-500 mt-2 inline-block hover:underline">View All</a>
                        </div>
                        <div class="w-1/3 px-4"> 
                            <p class="font-bold">Resources</p>
                            <ul class="mt-2 space-y-1">
                                <li>Testing protocols</li>
                                <li>Standard operating procedures</li>
                                <li>Regulatory compliance resources</li>
                            </ul>
                        </div>
            <div class="w-1/3 pl-4 relative"> 
            <img src="https://www.lgcstandards.com/medias/sys_master/root/hea/he1/9927889322014/Formenunew.jpg" alt="TRC Convergence" class="mb-4">
            <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 text-white p-4">
			<div class="bg-black bg-opacity-50 text-white p-4 flex flex-col items-center justify-center">
		 <p class="font-bold text-lg">Everything on one site!</p>
			<p>TRC research chemicals are now fully available at lgcstandards.com</p>
			</div>
        <a href="https://www.lgcstandards.com/GB/en/TRC/cat/279854" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Explore now</a>
         </div>
    </div>
    </div>
    </div>
						</li>
					<li class="relative group block">
                <a href="https://www.lgcstandards.com/US/en/Environmental-Reference-Materials/cat/279494" class="mode text-black hover:underline font-bold block pl-2">Environmental</a>
    <div class="megamenu hidden w-screen h-3/4 fixed top-30 left-0 z-20 bg-white overflow-y-auto group-hover:block">
         <div class="flex p-4">
        <div class="w-1/3 pr-4"> 
        <p class="font-bold">Our Products</p>
        <ul class="mt-2 space-y-1">
                                <li>Stable isotope labelled compounds</li>
                                <li>PCBs & related compounds</li>
                                <li>Flame retardants</li>
                                <li>Dyes & metabolites</li>
                                <li>Dioxins & furans</li>
                                <li>Pharma & vet compounds & metabolites</li>
                                <li>Mycotoxins</li>
                                <li>Additional organic reference materials</li>
                                <li>Polycyclic aromatic hydrocarbons (PAHs)</li>
                                <li>Volatile organic compounds (VOCs)</li>
                                <li>Hydrocarbons & petrochemicals</li>
                               
                            </ul>
							<a href="https://www.lgcstandards.com/US/en/Environmental-Reference-Materials/cat/279494" class="font-bold text-blue-500 mt-2 inline-block hover:underline">View All</a>
        </div>
        <div class="w-1/3 px-4"> 
        <p class="font-bold">Resources</p>
        <ul class="mt-2 space-y-1">
        <li>Environmental testing services</li>
    <li>Consultation on regulations</li>
	<li>Standards for environmental regulatory methods</li>
	<li>Aqueous inorganic</li>
	<li>Environmental proficiency testing</li>
	<li>Physical properties</li>
	<li>Pesticides & metabolites</li>
	<li>Perfluoroalkylated substances (PFAS)</li>
    </ul>
    </div>
    <div class="w-1/3 pl-4 relative"> 
    <img src="https://www.lgcstandards.com/medias/sys_master/root/h59/h13/10583540957214/TRC-convergence-450x428.jpg" alt="TRC Convergence" class="mb-4">
    <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 text-white p-4">
    <div class="bg-black bg-opacity-50 text-white p-4 flex flex-col items-center justify-center">
	<p class="font-bold text-lg">Everything on one site!</p>
	<p>TRC research chemicals are now fully available at lgcstandards.com</p>
	</div>
    <a href="https://www.lgcstandards.com/GB/en/TRC/cat/279854" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Explore now</a>
    </div>
    </div>
     </div>
    </div>
    </li>
					<li class="relative group block">
                <a href="https://www.lgcstandards.com/US/en/orderRequest" class="mode text-black hover:underline font-bold block pl-2">Custom solution</a>
					</li>
						<li class="relative group block">
                <a href="https://www.lgcstandards.com/US/en/structure-search" class="mode text-black hover:underline font-bold block pl-2">Structure Search</a>
					</li>
				 </ul>
					
        <div id="dropdownMenu" class="hidden md:hidden mt-2">
            <ul class="flex flex-col ">
                <li class="relative-group block flex justify-between items-center">
                    <a href="/US/en/Research-Tools/cat/323667" class="mode text-black hover:underline font-bold block p-4">Research Tools</a>
                 <button class="text-black bg-transparent hover:bg-gray-200 rounded p-2 font-bold focus:outline-none toggle-content">+</button>
                </li>
                <div class="hidden content pl-3">
									<a href="/US/en/Phermaceuticals/cat/323668" class="font-bold text-green-400 mt-2 inline-block hover:underline">View All</a>
                   <p class="font-bold  text-green-400 pl-1 ">Our Products</p>
                    <ul class="mt-2 space-y-1 pl-3">
                        <li>Cancer research</li>
                        <li>Neurology</li>
                        <li>Covid-19 research</li>
                        <li>Infectious disease research</li>
                        <li>Pharmaceutical toxicology</li>
                        <li>Stable isotope labelled</li>
                        <li>Synthetic chemistry</li>
                        <li>Building blocks</li>
                        <li>Next-generation cancer models</li>
                        <li>Immortalised primary cells</li>
                        <li>Primary cells</li>
                    </ul>
									  <p class="font-bold text-green-400   ">Resources</p>
											<ul class="pl-1">
												<li>Topic Insights</li>
												<li>Custom quotation </li>
											
												
											</ul>
                </div>
									
                
                <li class="relative-group block flex justify-between items-center  ">
                    <a href="/US/en/Pharmaceuticals/cat/123456" class="mode text-black hover:underline font-bold block p-4">Pharmaceuticals</a>
                    <button class="text-black bg-transparent hover:bg-gray-200 rounded p-2 font-bold focus:outline-none toggle-content">+</button>
                </li>
                <div class="hidden content  ">
				<a href="/US/en/Phermaceuticals/cat/323668" class="font-bold text-green-400 mt-2 inline-block hover:underline">View All</a>
                    <p class="font-bold  text-green-400 pl-1 ">Our Products</p>
                    <ul class="mt-2 space-y-1  pl-3">
                        <li>API standards</li>
                        <li>Excipient standards</li>
                        <li>Impurity standards</li>
                        <li>Nitrosamines</li>
                        <li>Pharmacopoeial standards</li>
                        <li>European Pharmacopoeia (Ph. Eur.)</li>
                        <li>British Pharmacopoeia</li>
                        <li>Stable isotope labelled standards</li>
                        <li>Pharmacopoeia listed materials</li>
                        <li>Enzyme activators, inhibitors & substrates</li>
											  <p class="font-bold text-green-400   ">Resources</p>
											<ul class="pl-1">
												<li>White Papers</li>
												<li>Acreditation</li>
												<li>Topic Insight</li>
												
											</ul>
											
                    </ul>
                </div>
                
							 
                <li class="relative-group block flex justify-between items-center  ">
                    <a href="/US/en/Pharmaceuticals/cat/123456" class="mode text-black hover:underline font-bold block p-4">Food & Beverages</a>
                    <button class="text-black bg-transparent hover:bg-gray-200 rounded p-2 font-bold focus:outline-none toggle-content">+</button>
                </li>
                <div class="hidden content  ">
                  	<a href="/US/en/Phermaceuticals/cat/323668" class="font-bold text-green-400 mt-2 inline-block hover:underline">View All</a>
                    <p class="font-bold  text-green-400 pl-1 ">Our Products</p>
                    <ul class="mt-2 space-y-1 pl-3 ">
                        <li>Cannabis-related compounds</li>
					                <li>Dyes & metabolites</li>
					                <li>Allergens</li>
				                <li>Nutritional composition compounds</li>
				                <li>Food additives, flavours & adulterants</li>
				                <li>Mycotoxins</li>
				                <li>Stability studies</li>
				                <li>Traceability</li>
              </ul>
									  <p class="font-bold text-green-400   ">Resources</p>
											<ul class="pl-1">
												<li>White Papers</li>
												<li>News</li>
												<li>Acreditation</li>
												<li>Topic Insight</li>
												</ul>
             
                    
                </div>
             <li class="relative-group block flex justify-between items-center  ">
                    <a href="/US/en/Pharmaceuticals/cat/123456" class="mode text-black hover:underline font-bold block p-4">Industrial</a>
                    <button class="text-black bg-transparent hover:bg-gray-200 rounded p-2 font-bold focus:outline-none toggle-content">+</button>
                </li>
                <div class="hidden content  ">
                  	<a href="/US/en/Phermaceuticals/cat/323668" class="font-bold text-green-400 mt-2 inline-block hover:underline">View All</a>
                    <p class="font-bold  text-green-400 pl-1 ">Our Products</p>
                    <ul class="mt-2 space-y-1 pl-3 ">
                        <li>Petroleum reference materials</li>
                                <li>Physical property analysis standards</li>
                                <li>Sulfur, Nitrogen & Chlorine standards</li>
                                <li>Metallo-organic standards</li>
                                <li>Matrix oils & solvents</li>
                                <li>Biodiesel standards</li>
                                <li>Aqueous inorganic</li>
                                <li>Metal alloys</li>
                                <li>Aluminium base standards</li>
                                <li>Process materials, geological, cement and soils</li>
                                <li>XRF monitor glasses</li>
                                <li>Laboratory consumables</li>
                                <li>Equipment for sample preparation</li>
              </ul>
									  <p class="font-bold text-green-400   ">Resources</p>
											<ul class="pl-1">
												<li>Publiactions</li>
												<li>News</li>
												<li>Acreditation</li>
												<li>Topic Insight</li>
												</ul>
             
                    
                </div>
							<li class="relative-group block flex justify-between items-center  ">
                    <a href="/US/en/Pharmaceuticals/cat/123456" class="mode text-black hover:underline font-bold block p-4">Proficiency & Testing</a>
                    <button class="text-black bg-transparent hover:bg-gray-200 rounded p-2 font-bold focus:outline-none toggle-content">+</button>
                </li>
                <div class="hidden content  ">
                  	<a href="/US/en/Phermaceuticals/cat/323668" class="font-bold text-green-400 mt-2 inline-block hover:underline">View All</a>
                    <p class="font-bold  text-green-400 pl-1 ">Our Products</p>
                    <ul class="mt-2 space-y-1 pl-3 ">
                        <li>Food & Feed standards</li>
                                <li>Beverage testing materials</li>
                                <li>Water & Environmental standards</li>
                                <li>Consumer Safety testing</li>
                                <li>Pharmaceutical standards</li>
                                <li>Clinical testing materials</li>
                                <li>Forensic standards</li>
                                <li>Quality Control Materials</li>
								<li>Testing protocols</li>
                                <li>Standard operating procedures</li>
                                <li>Regulatory compliance resources</li>
                    </ul>
									  <p class="font-bold text-green-400   ">Resources</p>
											<ul class="pl-1">
												<li>Custom Made-Schemes</li>
												<li>News</li>
												<li>Acreditation</li>
												<li>Topic Insight</li>
											</ul>
             
                    
                </div>
							<li class="relative-group block flex justify-between items-center  ">
                    <a href="/US/en/Pharmaceuticals/cat/123456" class="mode text-black hover:underline font-bold block p-4">Environmental</a>
                    <button class="text-black bg-transparent hover:bg-gray-200 rounded p-2 font-bold focus:outline-none toggle-content">+</button>
                </li>
                <div class="hidden content  ">
                  	<a href="/US/en/Phermaceuticals/cat/323668" class="font-bold text-green-400 mt-2 inline-block hover:underline">View All</a>
                    <p class="font-bold  text-green-400 pl-1 ">Our Products</p>
                    <ul class="mt-2 space-y-1 pl-3 ">
                        <li>Stable isotope labelled compounds</li>
                                <li>PCBs & related compounds</li>
                                <li>Flame retardants</li>
                                <li>Dyes & metabolites</li>
                                <li>Dioxins & furans</li>
                                <li>Pharma & vet compounds & metabolites</li>
                                <li>Mycotoxins</li>
                                <li>Additional organic reference materials</li>
                                <li>Polycyclic aromatic hydrocarbons (PAHs)</li>
                                <li>Volatile organic compounds (VOCs)</li>
                                <li>Hydrocarbons & petrochemicals</li>
                                <li>Standards for environmental regulatory methods</li>
                                <li>Aqueous inorganic</li>
                                <li>Environmental proficiency testing</li>
                                <li>Physical properties</li>
                                <li>Pesticides & metabolites</li>
                                <li>Perfluoroalkylated substances (PFAS)</li>
              </ul>
									  <p class="font-bold text-green-400   ">Resources</p>
											<ul class="pl-1">
												<li>White Papers</li>
												<li>News</li>
												<li>Acreditation</li>
												<li>Topic Insight</li>
												</ul>
             
                    
                </div>
								<li class="relative-group block flex justify-between items-center  ">
                    <a href="/US/en/Pharmaceuticals/cat/123456" class="mode text-black hover:underline font-bold block p-4">Custom Solution</a>
									<li class="relative-group block flex justify-between items-center  ">
                    <a href="https://www.lgcstandards.com/US/en/structure-search" class="mode text-black hover:underline font-bold block p-4">Structure Search</a>
							
            
        </div>
    

    
</body>

