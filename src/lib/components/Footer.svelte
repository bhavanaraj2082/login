<script>
	import Icon from '@iconify/svelte';

    let isProductsAndServicesActive = true;
    let isLGCGroupActive = true;
    let isHelpAndSupportActive = true;
    let isResearchToolsActive = false;
    let isPharmaceuticalActive = false;
    let isFoodsAndBevaragesActive = false;
    let isEnvironmentalActive = false;
    let isForensicAndToxicologyActive = false;
    let isIndustrialActive = false; 
    let isProficiencyTestingActive = false;
  
  function toggleSection(section) {
    if(section === 'Products and Services'){
      isProductsAndServicesActive = !isProductsAndServicesActive;
    }else if(section === 'LGC Group'){
     isLGCGroupActive = !isLGCGroupActive;
    }else if(section === 'Help & Support'){
      isHelpAndSupportActive = !isHelpAndSupportActive;
    }else if (section === 'ResearchTools') {
      isResearchToolsActive = !isResearchToolsActive;
    }else if (section === 'Pharmaceutical') {
      isPharmaceuticalActive = !isPharmaceuticalActive;
    }else if (section === 'Food & Beverage'){
        isFoodsAndBevaragesActive = !isFoodsAndBevaragesActive;
    }else if (section === 'Environmental'){
        isEnvironmentalActive = !isEnvironmentalActive;
    }else if (section === 'Forensic & Toxicology'){
        isForensicAndToxicologyActive = !isForensicAndToxicologyActive;
    }else if (section === 'Industrial'){
        isIndustrialActive = !isIndustrialActive;
    }else if (section === 'Proficiency Testing'){
        isProficiencyTestingActive = !isProficiencyTestingActive;
    }
  }
</script>

<section class="bg-slate-200 md:bg-slate-50 border-t border-black mt-4">
    <p class='text-center text-lg mt-8 font-bold  md:text-sky-900 md:text-2xl'>Stay in the know with the latest updates</p>
    <div class="flex  justify-around mt-8 md:flex flex-wrap">
        <div>
            <p class="font-bold hidden sm:block">By following us on social media</p>
            <div class="flex justify-between w-60  mt-2 ">
                <Icon icon="skill-icons:linkedin" width="2.4em" height="2.4em"/>
                <Icon icon="skill-icons:twitter" width="2.4em" height="2.4em" />
                <Icon icon="logos:youtube-icon" width="2.4em" height="2.4em"/>
                <Icon icon="logos:facebook" width="2.4em" height="2.4em"/>
            </div>
        </div>
        <div class="mt-6 sm:mt-0">
            <p class="font-bold text-sm md:font-md">By registering for our email newsletter</p>
            <button class=" flex justify-center items-center  bg-teal-700 text-gray-50 font-bold rounded-2xl mt-2 p-2 w-full "><p class="pe-2 hover:pe-4 text-gray-100">Get updates </p> <Icon icon="mdi:arrow-right" width="1.2em" height="1.2em" /></button>
        </div>
    </div>
    <div class="bg-slate-100 md:bg-gray-300 w-full mt-8">
        <div class="md:flex justify-evenly mt-2 ">
            <div >
                <div class="flex justify-between">
                  <p class=" mt-4 font-bold md:text-sky-900 text-lg md:text-2xl">Products and Services</p>
                  <p on:click={() => toggleSection('Products and Services')} class='text-4xl cursor-pointer mt-4 me-4  md:hidden'  >
                    {#if !isProductsAndServicesActive}
                    <Icon icon="ic:baseline-plus" width="0.6em" height="0.6em" />
                    {:else}
                    <Icon icon="ic:baseline-minus" width="0.6em" height="0.6em" />
                  {/if}
                  </p>
              </div>
                {#if isProductsAndServicesActive}
                <div class="mt-4 ">
                    <div class="flex items-center ">
                        <p on:click={() => toggleSection('ResearchTools')} class='text-4xl cursor-pointer' >
                            {#if isResearchToolsActive}
                            <Icon icon="ic:baseline-minus" width="0.6em" height="0.6em" />
                          {:else}
                            <Icon icon="ic:baseline-plus" width="0.6em" height="0.6em" />
                          {/if}
                        </p>
                        <a href="/Research Tools" class="ms-1 text-sm"> Research Tools</a>
                    </div>
                    {#if isResearchToolsActive }
                      <div class=" flex ms-4 text-xs">
                        <div>
                            <p class="max-w-32"><a href="/Cancer research">Cancer research</a></p>
                            <p class="max-w-32"><a href="/Neurology">Neurology</a></p>
                            <p class="max-w-32"><a href="/Covid-19 research">Covid-19 research</a></p>
                            <p class="max-w-32"><a href="/Infectious disease">Infectious disease</a></p>
                            <p class="max-w-32"><a href="/research">research</a></p>
                            <p class="max-w-32"><a href="/Pharmaceutical">Pharmaceutical</a></p>
                            <p class="max-w-32"><a href="/toxicology">toxicology</a></p>
                            <p class="max-w-32"><a href="/Stable isotope labelled">Stable isotope labelled</a></p>
                            <p class="max-w-32"><a href="/Synthetic chemistry">Synthetic chemistry</a></p>
                            <p class="max-w-32"><a href="/Building blocks">Building blocks</a></p>
                        </div>
                        <div class="ms-4 max-w-xs">
                            <p class="max-w-32"><a href="/Cancer research">Cancer research</a></p>
                            <p class="max-w-32"><a href="/Neurology">Neurology</a></p>
                            <p class="max-w-32"><a href="/Covid-19 research">Covid-19 research</a></p>
                            <p class="max-w-32"><a href="/Infectious disease">Infectious disease</a></p>
                            <p class="max-w-32"><a href="/research">research</a></p>
                            <p class="max-w-32"><a href="/Pharmaceutical">Pharmaceutical</a></p>
                            <p class="max-w-32"><a href="/toxicology">toxicology</a></p>
                            <p class="max-w-32"><a href="/Stable isotope labelled">Stable isotope labelled</a></p>
                            <p class="max-w-32"><a href="/Synthetic chemistry">Synthetic chemistry</a></p>
                            <p class="max-w-32"><a href="/Building blocks">Building blocks</a></p>
                        </div>
                      </div>
                    {/if}
                    <div class="flex items-center ">
                            <p on:click={() => toggleSection('Pharmaceutical')}  class='text-4xl cursor-pointer' >
                            {#if isPharmaceuticalActive}
                            <Icon icon="ic:baseline-minus" width="0.6em" height="0.6em" />
                          {:else}
                            <Icon icon="ic:baseline-plus" width="0.6em" height="0.6em" />
                          {/if}
                            </p>
                            <a href="/Pharmaceutical" class="ms-1 text-sm"> Pharmaceutical</a>
                    </div>
                    {#if isPharmaceuticalActive}
                      <div class=" flex  ms-4 text-xs">
                        <div>
                            <p class="max-w-32"><a href="/API standards">API standards</a></p>
                            <p class="max-w-32"><a href="/Excipient standards">Excipient standards</a></p>
                            <p class="max-w-32"><a href="/Impurity standards">Impurity standards</a></p>
                            <p class="max-w-32"><a href="/Nitrosamines">Nitrosamines</a></p>
                            <p class="max-w-32"><a href="/Pharmacopoeial">Pharmacopoeial</a></p>
                            <p class="max-w-32"><a href="/standards">standards</a></p>
                            <p class="max-w-32"><a href="/European">European</a></p>
                            <p class="max-w-32"><a href="/Pharmacopoeia (Ph. Eur.)">Pharmacopoeia (Ph. Eur.)</a></p>
                            <p class="max-w-32"><a href="/British Pharmacopoeia">British Pharmacopoeia</a></p>
                            <p class="max-w-32"><a href="/Stable isotope labelled">Stable isotope labelled</a></p>
                            <p class="max-w-32"><a href="/Pharmacopoeia listed">Pharmacopoeia listed</a></p>
                            <p class="max-w-32"><a href="/materials">materials</a></p>
                        </div>
                        <div class="ms-4">
                            <p class="max-w-32"><a href="/Cancer research">Enzyme activators,</a></p>
                            <p class="max-w-32"><a href="/inhibitors & substrates">inhibitors & substrates</a></p>
                            <p class="max-w-32"><a href="/Neurochemicals">Neurochemicals</a></p>
                            <p class="max-w-32"><a href="/Infectious disease">Infectious disease</a></p>
                            <p class="max-w-32"><a href="/research">research</a></p>
                            <p class="max-w-32"><a href="/Pharmaceutical">Pharmaceutical</a></p>
                            <p class="max-w-32"><a href="/toxicology">toxicology</a></p>
                            <p class="max-w-32"><a href="/Stable isotope labelled">Stable isotope labelled</a></p>
                            <p class="max-w-32"><a href="/Synthetic chemistry">Synthetic chemistry</a></p>
                            <p class="max-w-32"><a href="/Physical properties">Physical properties</a></p>
                        </div>
                      </div>
                    {/if}
                    <div class="flex items-center">
                        <p on:click={() => toggleSection('Food & Beverage')} class='text-4xl cursor-pointer'>
                          {#if isFoodsAndBevaragesActive}
                          <Icon icon="ic:baseline-minus" width="0.6em" height="0.6em"/>
                          {:else}
                            <Icon icon="ic:baseline-plus" width="0.6em" height="0.6em" />
                          {/if}</p>
                      
                        <a href="/Food & Beverage" class="ms-1 text-sm">Food & Beverage</a>
                    </div>
                    {#if isFoodsAndBevaragesActive }
                        <div class="flex ms-4 text-xs">
                          <div>
                            <p class="max-w-32"><a href="/Cannabis-related compounds">Cannabis-related compounds</a></p>
                            <p class="max-w-32"><a href="/Dyes & metabolites">Dyes & metabolites</a></p>
                            <p class="max-w-32"><a href="/Allergens">Allergens</a></p>
                            <p class="max-w-32"><a href="/Nutritional composition compounds">Nutritional composition compounds</a></p>
                            <p class="max-w-32"><a href="/Food additives, flavours & adulterants">Food additives, flavours & adulterants</a></p>
                            <p class="max-w-32"><a href="/Mycotoxins">Mycotoxins</a></p>
                            <p class="max-w-32"><a href="/Environmental food contaminants">Environmental food contaminants</a></p>
                            <p class="max-w-32"><a href="/Pesticides & metabolites">Pesticides & metabolites</a></p>
                            <p class="max-w-32"><a href="/Pharma & vet compounds & metabolites">Pharma & vet compounds & metabolites</a></p>
                          </div>
                          <div class="ms-4">
                            <p class="max-w-32"><a href="/Cannabis Regulatory Methods">Cannabis Regulatory Methods</a></p>
                            <p class="max-w-32"><a href="/Phytochemicals">Phytochemicals</a></p>
                            <p class="max-w-32"><a href="/Food contact materials">Food contact materials</a></p>
                            <p class="max-w-32"><a href="/Perfluoroalkylated substances (PFAS)">Perfluoroalkylated substances (PFAS)</a></p>
                            <p class="max-w-32"><a href="/Beverage reference materials">Beverage reference materials</a></p>
                            <p class="max-w-32"><a href="/Food & beverage proficiency testing">Food & beverage proficiency testing</a></p>
                            <p class="max-w-32"><a href="/Standards for food regulatory methods">Standards for food regulatory methods</a></p>
                            <p class="max-w-32"><a href="/Stable isotope labelled compounds">Stable isotope labelled compounds</a></p>
                            <p class="max-w-32"><a href="/Microbiology">Microbiology</a></p>
                          </div>
                        </div>
                    {/if}
                    <div class="flex items-center ">
                        <p on:click={() => toggleSection('Environmental')}  class='text-4xl cursor-pointer' >
                        {#if isEnvironmentalActive}
                        <Icon icon="ic:baseline-minus" width="0.6em" height="0.6em"/>
                      {:else}
                        <Icon icon="ic:baseline-plus" width="0.6em" height="0.6em" />
                      {/if}
                        </p>
                        <a href="/Environmental" class="ms-1 text-sm"> Environmental</a>
                    </div>
                    {#if isEnvironmentalActive}
                      <div class=" flex justify-between  ms-4 text-xs">
                        <div>
                            <p class="max-w-32"><a href="/Stable isotope labelled compounds">Stable isotope labelled compounds</a></p>
                            <p class="max-w-32"><a href="/PCBs & related compounds">PCBs & related compounds</a></p>
                            <p class="max-w-32"><a href="/Flame retardants">Flame retardants</a></p>
                            <p class="max-w-32"><a href="/Dyes & metabolites">Dyes & metabolites</a></p>
                            <p class="max-w-32"><a href="/Dioxins & furans">Dioxins & furans</a></p>
                            <p class="max-w-32"><a href="/Pharma & vet compounds & metabolites">Pharma & vet compounds & metabolites</a></p>
                            <p class="max-w-32"><a href="/Mycotoxins">Mycotoxins</a></p>
                            <p class="max-w-32"><a href="/Additional organic reference materials">Additional organic reference materials</a></p>
                            <p class="max-w-32"><a href="/Polycyclic aromatic hydrocarbons (PAHs)">Polycyclic aromatic hydrocarbons (PAHs)</a></p>
                        </div>
                        <div class="ms-4">
                            <p class="max-w-32"><a href="/Volatile organic compounds (VOCs)">Volatile organic compounds (VOCs)</a></p>
                            <p class="max-w-32"><a href="/Hydrocarbons & petrochemicals">Hydrocarbons & petrochemicals</a></p>
                            <p class="max-w-32"><a href="/Standards for environmental regulatory methods">Standards for environmental regulatory methods</a></p>
                            <p class="max-w-32"><a href="/Aqueous inorganic">Aqueous inorganic</a></p>
                            <p class="max-w-32"><a href="/Environmental proficiency testing">Environmental proficiency testing</a></p>
                            <p class="max-w-32"><a href="/Physical properties">Physical properties</a></p>
                            <p class="max-w-32"><a href="/Pesticides & metabolites">Pesticides & metabolites</a></p>
                            <p class="max-w-32"><a href="/Perfluoroalkylated substances (PFAS)">Perfluoroalkylated substances (PFAS)</a></p>
                        </div>
                      </div>
                    {/if}
                    <div class="flex items-center ">
                        <p on:click={() => toggleSection('Forensic & Toxicology')}  class='text-4xl cursor-pointer' >
                        {#if isForensicAndToxicologyActive}
                        <Icon icon="ic:baseline-minus" width="0.6em" height="0.6em"/>
                        {:else}
                        <Icon icon="ic:baseline-plus" width="0.6em" height="0.6em" />
                        {/if}
                        </p>
                        <a href="/Forensic & Toxicology" class="ms-1 text-sm"> Forensic & Toxicology</a>
                    </div>
                    {#if isForensicAndToxicologyActive}
                      <div class=" flex   ms-4 text-xs">
                        <div>
                            <p class="max-w-32"><a href="/New psychoactive substances (NPS)">New psychoactive substances (NPS)</a></p>
                            <p class="max-w-32"><a href="/Sports drugs & steroids">Sports drugs & steroids</a></p>
                            <p class="max-w-32"><a href="/Ethanol & related materials">Ethanol & related materials</a></p>
                            <p class="max-w-32"><a href="/Cannabinoids">Cannabinoids</a></p>
                            <p class="max-w-32"><a href="/Smoking-related substances">Smoking-related substances</a></p>
                            <p class="max-w-32"><a href="/Opiates & opioids">Opiates & opioids</a></p>
                            <p class="max-w-32"><a href="/Benzodiazepines">Benzodiazepines</a></p>
                            <p class="max-w-32"><a href="/Cocaine & related materials">Cocaine & related materials</a></p>
                            <p class="max-w-32"><a href="/Hallucinogens">Hallucinogens</a></p>
                           
                        </div>
                        <div class="ms-4">
                            <p class="max-w-32"><a href="/GHB & related materials">GHB & related materials</a></p>
                            <p class="max-w-32"><a href="/Barbiturates">Barbiturates</a></p>
                            <p class="max-w-32"><a href="/Pharmaceutical toxicology">Pharmaceutical toxicology</a></p>
                            <p class="max-w-32"><a href="/Z-drugs">Z-drugs</a></p>
                            <p class="max-w-32"><a href="/Drug metabolism">Drug metabolism</a></p>
                            <p class="max-w-32"><a href="/Environmental toxicology">Environmental toxicology</a></p>
                            <p class="max-w-32"><a href="/Food mutagens">Food mutagens</a></p>
                            <p class="max-w-32"><a href="/Mycotoxins">Mycotoxins</a></p>
                           
                        </div>
                      </div>
                    {/if}
                    <div class="flex items-center ">
                        <p on:click={() => toggleSection('Industrial')}  class='text-4xl cursor-pointer' >
                        {#if isIndustrialActive}
                        <Icon icon="ic:baseline-minus" width="0.6em" height="0.6em"/>
                      {:else}
                        <Icon icon="ic:baseline-plus" width="0.6em" height="0.6em" />
                      {/if}
                        </p>
                        <a href="/Industrial" class="ms-1 text-sm"> Industrial</a>
                    </div>
                    {#if isIndustrialActive}
                      <div class=" flex   ms-4 text-xs">
                        <div>
                            <p class="max-w-32"><a href="/Petroleum reference materials">Petroleum reference materials</a></p>
                            <p class="max-w-32"><a href="/Physical property analysis standards">Physical property analysis standards</a></p>
                            <p class="max-w-32"><a href="/Sulfur, Nitrogen & Chlorine">Sulfur, Nitrogen & Chlorine</a></p>
                            <p class="max-w-32"><a href="/Metallo-organic standards">Metallo-organic standards</a></p>
                            <p class="max-w-32"><a href="/Matrix oils & solvents">NeuMatrix oils & solventsrology</a></p>
                            <p class="max-w-32"><a href="/Biodiesel standards">Biodiesel standards</a></p>
                            <p class="max-w-32"><a href="/Aqueous inorganic">Aqueous inorganic</a></p>
                            
                        </div>
                        <div class="ms-4">
                            <p class="max-w-32"><a href="/Metal alloys">Metal alloys</a></p>
                            <p class="max-w-32"><a href="/Aluminium base">Aluminium base</a></p>
                            <p class="max-w-32"><a href="/Process materials, geological, cement and soils">Process materials, geological, cement and soils</a></p>
                            <p class="max-w-32"><a href="/XRF monitor glasses">XRF monitor glasses</a></p>
                            <p class="max-w-32"><a href="/Laboratory consumables">Laboratory consumables</a></p>
                            <p class="max-w-32"><a href="/Equipment for sample preparation">Equipment for sample preparation</a></p>                           
                        </div>
                      </div>
                    {/if}
                    <div class="flex items-center ">
                        <p on:click={() => toggleSection('Proficiency Testing')}  class='text-4xl cursor-pointer' >
                        {#if isProficiencyTestingActive}
                        <Icon icon="ic:baseline-minus" width="0.6em" height="0.6em" />
                      {:else}
                        <Icon icon="ic:baseline-plus" width="0.6em" height="0.6em" />
                      {/if}
                        </p>
                        <a href="/Proficiency Testing" class="ms-1 text-sm"> Proficiency Testing</a>
                    </div>
                    {#if isProficiencyTestingActive}
                      <div class=" flex   ms-4 text-xs">
                        <div>
                            <p><a href="/Food & Feed">Food & Feed</a></p>
                            <p><a href="/Beverage">Beverage</a></p>
                            <p><a href="/Water & Environmental">Water & Environmental</a></p>
                            <p><a href="/Consumer Safety">Consumer Safety</a></p>
                            <p><a href="/FAQs">FAQs</a></p>
                        </div>
                        <div class="ms-4">
                            <p><a href="/Pharmaceutical">Pharmaceutical</a></p>
                            <p><a href="/Clinical">Clinical</a></p>
                            <p><a href="/Forensic">Forensic</a></p>
                            <p><a href="/Quality Control Materials">Quality Control Materials</a></p>
                        </div>
                      </div>
                    {/if}
                </div>
          {/if}
            </div>
            <div>
              <div class="flex justify-between border-t border-black md:mt-4 mt-2 md:border-none md:mt-0">
                <p class=" mt-2 font-bold md:text-sky-900 text-lg md:text-2xl ">LGC Group</p>
                <p on:click={() => toggleSection('LGC Group')} class='text-4xl mt-2 me-4 cursor-pointer  md:hidden' >
                  {#if !isLGCGroupActive}
                  <Icon icon="ic:baseline-plus" width="0.6em" height="0.6em" />
                  {:else}
                  <Icon icon="ic:baseline-minus" width="0.6em" height="0.6em" />
                {/if}
              </p>
            </div>
              {#if isLGCGroupActive}
                <div class="mt-4">
                  <p class="text-sm"><a href="/LGC Group">LGC Group</a></p>
                  <p class="text-sm"><a href="/LGC Group News">LGC Group News</a></p>
                  <p class="text-sm"><a href="/LGC Careers">LGC Careers</a></p>
                  <p class="text-sm"><a href="/Maine Standards">Maine Standards</a></p>
                  <p class="text-sm"><a href="/SeraCare">SeraCare</a></p>
                  <p class="text-sm"><a href="/ATCC">ATCC</a></p>
                  <p class="text-sm"><a href="/BRCGS">BRCGS</a></p>
                  <p class="text-sm"><a href="/Informed Choice">Informed Choice</a></p>
                  <p class="text-sm"><a href="/Informed Sport">Informed Sport</a></p>
                  <p class="text-sm"><a href="/TRC Canada">TRC Canada</a></p>
                </div>
              {/if}
            </div>
            <div class="border-y border-gray-700 md:mt-4 mt-2 md:border-none md:mt-0">
              <div class="flex justify-between ">
                <p class="my-2 font-bold md:text-sky-900 text-lg md:text-2xl">Help & Support</p>
                <p on:click={() => toggleSection('Help & Support')} class='text-4xl my-2 me-4  cursor-pointer  md:hidden' >
                  {#if !isHelpAndSupportActive}
                  <Icon icon="ic:baseline-plus" width="0.6em" height="0.6em" />
                  {:else}
                  <Icon icon="ic:baseline-minus" width="0.6em" height="0.6em" />
                {/if}
              </p>
            </div>
              {#if isHelpAndSupportActive}
                <div class="mt-4">
                   <p class="text-sm"><a href="/Customer Services">Customer Services</a></p>
                   <p class="text-sm"><a href="/Contact Us">Contact Us</a></p>
                   <p class="text-sm"><a href="/FAQs">FAQs</a></p>
                   <p class="text-sm"><a href="/Distributors">Distributors</a></p>
                   <p class="text-sm"><a href="/Delivery">Delivery</a></p>
                   <p class="text-sm"><a href="/Sitemap">Sitemap</a></p>
                   <p class="text-sm"><a href="/Request a custom quotation">Request a custom quotation</a></p>
                </div>
              {/if}

            </div>
        </div>
        <div class="md:grid md:grid-cols-7 p-8   md:border-t border-black  flex flex-col-reverse mx-0 md:ms-12 md:mt-16 md:me-16  ">
            <p class="w-12 h-12  rounded-full bg-slate-50 text-sky-900 font-bold pt-3 text-center hidden md:block md:col-span-*">LGC</p>      
            <div class="text-center  mt-4 md:mt-0 md:text-start md:col-span-2">
                <p class="text-sm">LGC Limited 2024. All rights reserved.</p>
                <p class="text-sm">All trademarks acknowledged.</p>
            </div>
        
            <div class="flex justify-center mt-4 md:mt-2 md:col-span-3  md:flex gap-2  md:gap-8">
                <p class="text-xs  font-bold mt-2 md:m-0 md:text-sm md:font-normal"><a href="/Terms and Conditions">Terms and Conditions</a></p>
                <p class=" text-xs font-bold mt-2 md:m-0 md:text-sm md:font-normal"><a href="/Privacy Notice">Privacy Notice</a></p>
                <p class=" text-xs font-bold mt-2 md:m-0 md:text-sm md:font-normal"><a href="/Cookie Policy">Cookie Policy</a></p>
            </div>
      
            <div class="flex justify-center  col-start-7 md:justify-between w-full md:w-40  md:mt-0 gap-4">
                <Icon icon="mdi:post-it-note" width="1.8em" height="1.8em" />
                <Icon icon="ri:visa-fill" width="1.8em" height="1.8em" />
                <Icon icon="logos:mastercard" width="1.8em" height="1.8em" />
                <Icon icon="icons8:amex" width="1.8em" height="1.8em" />
            </div>
      </div>
      
    </div>
</section>

