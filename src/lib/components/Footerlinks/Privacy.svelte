<script>
	import dataPrivacyNotice from '$lib/data/FooterLinks/privacynotice.json';

	import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    let showButton = false;
	
const handleScroll = () => {
    showButton = window.scrollY > 20;
};


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });


let showTooltip = false;
  function handleMouseEnter(){
    showTooltip = true;
  }
  function handleMouseLeave(){
    showTooltip = false;
  }


</script>

<div class="md:ml-5 ml-0">
	<div class="pt-5 max-w-7xl md:w-11/12 mx-auto sm:block hidden">
		<div class="fixed z-30 md:bottom-[75px] bottom-40 right-0 lg:right-10 py-6 lg:p-4">
			<button
			class="flex items-center justify-center rounded py-0.3 bg-primary-50 text-white md:mr-14 lg:mr-0 shadow-md" on:click={scrollToTop}
			  class:hidden={!showButton}
			  on:mouseenter={handleMouseEnter}
				on:mouseleave={handleMouseLeave}
			>
			<div class="flex flex-col items-center">
				<Icon icon="tdesign:chevron-up" width="20" height="20" class="text-primary-500"  />
				<span class="px-1.5 text-xs pb-0.5 text-primary-500 font-medium">TOP</span>
			</div>			
		  </button>
			{#if showTooltip}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap bg-transparent text-black font-medium py-1 rounded-md shadow-lg sm:text-sm text-[10px] px-4"
			on:click={scrollToTop}
			class:hidden={!showButton}>
			<div
			  class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-transparent"></div>
			</div>
			{/if}
		  </div>
	</div>
	<h1 class="sm:text-2xl text-xl font-bold sm:mb-10 mb-4 mt-5 sm:mt-0 text-center ">Data Privacy Notice</h1>
	<p class="font-semibold mb-2">Last modified August 6, 2024</p>
	<p class="text-justify sm:text-sm text-xs">
		We take your data privacy and the protection of your personal data seriously and our data
		privacy principles provide fundamental guidance to all our businesses worldwide. We comply with
		applicable national regulations and our understanding of data privacy is based on the European
		General Data Protection Regulation (GDPR), amended by local regulations in case they are
		stricter.
	</p>
	<hr class="border-t-1 mt-4 border border-gray-400" />
	<ol class="list-decimal pl-5 mt-5 space-y-2 text-primary-400 sm:text-md text-sm font-semibold">
		<li><a href="#preamble" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Preamble</a></li>
		<li><a href="#general-info" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">General Information</a></li>
		<li>
			<a href="#processing-activities" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">The Processing Activities in Detail</a>
		</li>
		<li><a href="#data-retention" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Data Retention</a></li>
		<li><a href="#recipients" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Recipients of Personal Data</a></li>
	</ol>
	<hr class="border-t-1 mt-4 border border-gray-400 mb-10" />

	<h3 id="preamble" class="mt-5 text-lg font-semibold">1. Preamble</h3>
	<p class="sm:text-sm text-xs text-justify ">{dataPrivacyNotice.dataPrivacyNotice.preamble}</p>
	<p class="mt-3 sm:text-sm text-xs text-justify">
		{dataPrivacyNotice.dataPrivacyNotice.preamble2}
		<a href="mailto:privacy@chemikart.com" class="text-primary-500 hover:underline underline-offset-2">privacy@chemikart.com</a> or the other contact details provided below.
	</p>
	<h3 id="general-info" class="mt-5 text-lg font-semibold">2. General Information</h3>
	<p class="sm:text-sm text-xs text-justify">{dataPrivacyNotice.dataPrivacyNotice.general_information}</p>
	<h4 class="font-medium text-gray-700 mt-2 mb-2">2.1 Controller</h4>
	<p class="text-justify text-sm">{dataPrivacyNotice.dataPrivacyNotice.controller}</p>
	<h4 class="font-bold text-gray-700 mt-2 mb-2">2.2 Data Privacy Officer</h4>
	<p class="text-justify sm:text-sm text-xs">
		We have appointed a Data Privacy Officer. You can contact this person and the team at any time:
	</p>
	<p class="text-justify sm:text-sm text-xs">
		Data Privacy Officer
		<a href="mailto:privacy@chemikart.com" class="text-primary-500 hover:underline underline-offset-2 mt-2">privacy@chemikart.com</a>
	</p>
	<p class="text-justify sm:text-sm text-xs">
		You are also welcome to exercise your data protection rights by submitting your request directly
		in our Data Privacy Portal.
	</p>

	<h3 id="processing-activities" class="font-semibold mt-5 text-lg">
		3. The Processing Activities in Detail
	</h3>
	<p class="sm:text-sm text-xs">
		This section explains the different data processing activities in which we process your personal
		data.
	</p>
	<h4 class="font-medium text-gray-700 mt-2 mb-2">
		3.1 Processing of Your Personal Data in Various Contexts
	</h4>
	<p class="mt-3 sm:text-sm text-xs text-justify">
		{dataPrivacyNotice.dataPrivacyNotice.processing_activities}
	</p>
	<p class="mt-2 sm:text-sm text-xs text-justify">
		{dataPrivacyNotice.dataPrivacyNotice.processing_activities2}
	</p>
	<p class="mt-2 sm:text-sm text-xs text-justify">
		{dataPrivacyNotice.dataPrivacyNotice.processing_activities3}
	</p>
	<p class="mt-2 sm:text-sm text-xs text-justify">
		{dataPrivacyNotice.dataPrivacyNotice.processing_activities4}
	</p>
	<p class="mt-2 sm:text-sm text-xs text-justify">
		{dataPrivacyNotice.dataPrivacyNotice.processing_activities5}
	</p>
	<h4 class="font-medium text-gray-700 mt-2 text-justify  mb-2">
		3.1.1 Contract Initiation and Fulfilment
	</h4>
	<p class="sm:text-sm text-xs text-justify ">chemikart processes your personal data for the initiation and the fulfilment or performance of contracts, 
		including the administrative management of related order 
		inquiries and assignments, both on and offline.</p>
		<p class="mt-2 sm:text-sm text-xs">This processing activity may include the following data categories:</p>

			<li class="sm:text-sm text-xs mt-2 text-justify ">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address, place of work, etc.);</li>
			<li class="sm:text-sm text-xs mt-2 text-justify ">Your payment details (e.g., bank account number, bank code, credit institute, tax identification number).</li>
	<p class="sm:text-sm text-xs mt-2 text-justify ">
		The processing of these personal data is necessary for the performance of a contract with you as an individual or is necessary to safeguard our legitimate interests 
		of conducting business with your employer. Without your provision of your data, we cannot establish and maintain contact with you in the context of the specific contract.
	</p>
	
	<h4 class="font-medium text-gray-700 mt-2 mb-2">
		3.1.2 Purchase and Use of Goods and Services
	</h4>
	<p class="sm:text-sm text-xs mt-2">
		If and to the extent that we provide services or goods to you, or receive them from you, we may process your personal data, e.g., to receive your services and/or provide our goods and prepare invoicing.
	</p>
<p class="sm:text-sm text-xs mt-2 text-justify ">This processing activity may include the following data categories:</p>
<li class="sm:text-sm text-xs mt-2 text-justify ">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address);</li>
<li class="sm:text-sm text-xs mt-2 text-justify " >Accounting data (e.g., purchased goods and services, bank details, customer number, tax identification number, tax category);</li>
<li class="sm:text-sm text-xs mt-2 text-justify ">Accounting data (e.g., purchased goods and services, bank details, customer number, tax identification number, tax category);</li>
<p class="sm:text-sm text-xs mt-2 text-justify ">The processing of these personal data is based on the necessity for the performance of a contract with you as an individual or is necessary 
	to safeguard our legitimate interests of conducting business with your employer. Without your provision of these personal data, we usually 
	cannot establish and maintain contact with you, issue and receive invoices as well as receive or deliver services and/or goods in the context 
	of the specific contract.

</p>
	
<h4 class="font-medium text-gray-700 mt-2 mb-2">
	3.1.3 Account Creation
</h4>
<p class="sm:text-sm text-xs mt-2 text-justify ">You can register on some of our Websites and create an account. When logging in as a registered user, we collect personal data resulting
	 from the registration form marked as mandatory.</p>
	 <p class="sm:text-sm text-xs mt-2 text-justify ">This processing activity may include, among others, the following data categories:</p>
	<li class="sm:text-sm text-xs mt-2 text-justify ">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address);</li>
	<li class="sm:text-sm text-xs mt-2 text-justify ">Accounting data (e.g., purchased goods and services, bank details, customer number, tax identification number, tax category);</li>
	<li class="sm:text-sm text-xs mt-2 text-justify ">Details on your profession (e.g., job title, position, personnel number, place of work, branch office, department).</li>
	<p class="sm:text-sm text-xs mt-2 text-justify ">The data will be processed and used by us for the entire time your account exists, for our service and technical administration 
		and – to the legally permissible extent – for our own marketing purposes. The processing of these personal data is based on the 
		necessity for the performance of a contract with you or is necessary to safeguard our legitimate interests of conducting business with you.</p>

		<h4 class="font-medium text-gray-700 mt-2 mb-2">
			3.1.4 Marketing Communications
		</h4>
	<p class="sm:text-sm text-xs text-justify  mt-2">We process your personal data within the scope of our public relations and marketing processes. This includes in particular the issuance of newsletters,
	 press kits, and registrations for press distribution lists, press contacts and press representatives.</p>
	 <h4 class="font-medium text-gray-700 mt-2 mb-2">
		3.1.4.1 Newsletters
	</h4>
<p class="sm:text-sm text-xs mt-2 text-justify ">This processing activity may include the following data categories:</p>
<li class="sm:text-sm text-xs mt-2 text-justify ">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address);</li>
<li class="sm:text-sm text-xs mt-2 text-justify ">Details on your profession (e.g., job title, position, personnel number, place of work, branch office, department).</li>
<p class="sm:text-sm text-xs mt-2 text-justify ">If you would like to subscribe to any of our available newsletters, you may enter your email address in our registration form and click the 
	"Send" button. You will then receive an email from us to your email address. 
	You may complete the registration by verifying your email address by using the answer function in your email program.</p>
	<p class="sm:text-sm text-xs mt-2 text-justify ">This processing activity includes the following data categories: The information you provided to subscribe, such as your title, name, email address and personal/professional interests.</p>
	<p class="sm:text-sm text-xs mt-2 text-justify ">The processing is based on your consent you provided to us in the course of the subscription process. Your personal data will be deleted when you withdraw your consent, e.g., by filling the form on our website to unsubscribe.</p>
	<h4 class="font-medium text-gray-700 mt-2 mb-2 text-justify ">
		3.1.4.2 Other Processing for Marketing; Profiling
	</h4>
	<p class="sm:text-sm text-xs mt-2 text-justify ">Other processing in this regard is based on our legitimate business interests. We have a legitimate interest in informing our clients of news, events, etc. to gain new leads and establish and maintain a long-term business relationship.</p>
	<p class="sm:text-sm text-xs mt-2 text-justify ">We aim to present you information that could be of interest to you and to communicate seamlessly over various channels (phone, email, SMS, mail, social media messages) without sending redundant information. Our communication with you 
		is based on the information we collect about you and are permitted to use. For example, we use the combination of your email address and your browsing data so we can provide you with information about a product
		 you look up on one of our websites. Based on the information we collect, we may internally indicate that you are interested in certain categories of information.</p>
		 <p class="sm:text-sm text-xs mt-2 text-justify ">
		 <span >We also use profiling procedures to optimize and personalize our customer relationship management and our advertising measures. To optimize and personalize our advertising measures, 
			we create customer profiles and assign customers to specific customer segments on the basis of these customer profiles. On the basis of this segmentation, we can manage the type, content 
			and frequency of specific advertising measures for specific target groups. </span>
			<span >
				For profiling purposes and based on our legitimate interest, we use data that we receive from you as part of our business relationship. This includes personal data, like your purchasing behavior 
				and browsing behavior. Profiling may also be related to usage data that we create by measuring and evaluating the customer's interaction with electronic advertising, and in particular by measuring 
				and evaluating the opening and click rate in email newsletters.</span>
		</p>


		<h4 class="font-medium text-gray-700 mt-2 mb-2">
			3.1.5 Business Contacts
		</h4>
		<p class="sm:text-sm text-xs mt-2 text-justify ">If Chemikart has received your contact details from business events, for example as part of a business appointment (e.g., by exchanging business cards) or as part of an assignment, we use your contact and business details to maintain our business contacts. 
			For this purpose, we usually transfer your contact details to our CRM (Customer Relationship Management).</p>
			<p class="sm:text-sm text-xs mt-2">This processing activity may include the following data categories:</p>
			<li class =" sm:text-sm text-xs text-justify ">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address);</li>
			<li class =" sm:text-sm text-xs text-justify ">Details on your profession (e.g., job title, position, personnel number, place of work, branch office, department, qualifications).</li>
			<p class =" sm:text-sm text-xs text-justify ">This data processing is based for our legitimate business interests. Chemikart has a legitimate economic interest in maintaining contacts beyond the initial contact and in using them to establish and develop a business relationship and to remain in contact with the parties concerned. </p>
			
		<h4 class="font-medium text-gray-700 mt-2 mb-2">
			3.1.6 Contact Forms and Service Requests
		</h4>
		<p class="sm:text-sm text-xs mt-2 text-justify">We process your personal data, if you enter and submit your data via one of our contact forms or contact us otherwise, e.g., in the context of a service request or via the contact 
			form we provide on our Websites.Your data will also be processed to handle your specific request, e.g., by answering or forwarding your request to a competent department.</p>
			<p class="sm:text-sm text-xs mt-2 text-justify">This processing activity may include the following data categories:</p>
			<li class="sm:text-sm text-xs mt-2 text-justify">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address);</li>
			<li class="sm:text-sm text-xs mt-2 text-justify">Details on your profession (e.g., job title, position, personnel number, place of work, branch office, department, qualifications);</li>
			<li class="sm:text-sm text-xs mt-2 text-justify">Any further information you provide to us, e.g., in the process of your request or which is otherwise required to answer your request.</li>
			<p class="sm:text-sm text-xs mt-2 text-justify">The processing and use of your data are necessary for answering your inquiry in a quick and competent manner and is based for the rest on our legitimate interest to communicate with our contacts and customers and in particular provide customer service. The processing of your personal data is necessary to process your inquiry and establish or maintain contact.</p>
			<h4 class="font-medium text-gray-700 mt-2 mb-2">
				3.1.7 Accounting
			</h4>
			<p class="sm:text-sm text-xs mt-2 text-justify">Chemikart may process your personal data for the purpose of an orderly and lawful accounting. This is necessary e.g., to process and record invoices, issue monetary compensation or refunds and to verify claims. In addition, Chemikart is subject to legal documentation and retention obligations based on tax and accounting laws which also involve the processing of your personal data.</p>
			<p class="sm:text-sm text-xs mt-2 text-justify">This processing activity may include the following data categories:</p>
			<li class="sm:text-sm text-xs mt-2 text-justify" >Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address, etc.);</li>
			<li class="sm:text-sm text-xs mt-2 text-justify">Accounting data (e.g., purchased goods and services, bank details, customer number, tax identification number, tax category, etc.);</li>
			<li class="sm:text-sm text-xs mt-2 text-justify">Details on your profession (e.g., job title, position, personnel number, place of work, branch office, department, etc.).</li>
			<p class="sm:text-sm text-xs mt-2 text-justify">The data processing is necessary for Chemikart to manage, document, maintain and archive files and documents to fulfill our legal obligations under tax, commercial and corporate laws. If and to the extent such laws do not apply for the processing of your personal data in this context, this processing activity relies on our legitimate business interest to establish and maintain an adequate accounting process, in particular to issue or settle invoices</p>

<h4 class="font-medium text-gray-700 mt-2 mb-2">
	3.1.8 Healthcare
			</h4>
			<p class="sm:text-sm text-xs mt-2">We may process your personal data for the purpose of maintenance and improvement of health-related topics by developing and applying measures to prevent, diagnose, treat, recover, or cure diseases, illness, injuries, and other physical and mental impairments. </p>
			<p class="sm:text-sm text-xs mt-2">
				This processing activity may include the following data categories:
			</p>
			<li class="sm:text-sm text-xs mt-2">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address, date and place of birth, country of birth, nationality, etc.);</li>
			<li class="sm:text-sm text-xs mt-2">Health information (e.g., diagnosis, existence of an illness or disability, details about accidents, treatment history, relevant health parameters, etc.).</li>
			<p class="sm:text-sm text-xs mt-2">In these cases, the legal basis of the data processing depends on the specific context. The processing can be necessary to safeguard our legitimate interests for the purposes of maintaining and improving health-related matters. We are also required to process your personal data where we have a respective legal obligation.</p>
			<h4 class="font-medium text-gray-700 mt-2 mb-2">
				3.1.9 Life Science
						</h4>	
						<p class="sm:text-sm text-xs mt-2 text-justify">We may process your personal data within the context of scientific research and our Life Science business. This includes for example processing of Data Subjects that work in the fields of drug research, biopharmaceutical production, biotechnology, industrial microbiology, clinic and diagnostics, food analysis, quality control for pharmaceuticals, governmental and academic research, and environmental analyses.</p>
<p class="sm:text-sm text-xs mt-2 text-justify">This processing activity may include the following data categories:</p>
<li class="sm:text-sm text-xs mt-2 text-justify">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address, date and place of birth, country of birth, nationality, etc.);</li>
<li class="sm:text-sm text-xs mt-2 text-justify">Health information (e.g., diagnosis, existence of an illness or disability, details about accidents, treatment history, relevant health parameters, etc.).</li>
<p class="sm:text-sm text-xs mt-2 text-justify">In these cases, the legal basis of the data processing depends on the specific context. This processing can be necessary to safeguard our legitimate interests for 
the purposes of maintaining and improving health-related matters as well as scientific research and to sell our Life Science products. </p>
<h4 class="font-medium text-gray-700 mt-2 mb-2">
	3.1.10 Electronics
			</h4>	
			<p class="sm:text-sm text-xs mt-2 text-justify">We process your personal data in the context of our Electronics business offerings related to architecture, 
				such as energy-efficient windows, smart glass and façades, innovations in mobility, display applications, plastics and specialty coatings, 
				innovative semiconductor materials, cosmetics and high-tech chemicals for advanced industries such as photonics, solar, and lighting.</p>
			<p class="sm:text-sm text-xs mt-2 text-justify">This processing activity may include the following data categories:</p>
			<li class="sm:text-sm text-xs mt-2 text-justify">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address);</li>
			<li class="sm:text-sm text-xs mt-2 text-justify">Details on your profession (e.g., job title, position, personnel number, place of work, branch office, department, education).</li>
			<p class="sm:text-sm text-xs mt-2 text-justify">The data processing is based on the necessity for the performance of a contract with you as an individual or is necessary 
			to safeguard our legitimate interests of manufacturing, distributing, selling, and improving our Electronics products as well as scientific research.</p>

			<h4 class="font-medium text-gray-700 mt-2 mb-2">
				3.1.11 Event Management
						</h4>
						<p class="sm:text-sm text-xs mt-2 text-justify">We process your data for events we either provide on our own or for which we act as a sponsor and receive certain information about you. These events could vary from a singular meeting to a conference over several days, publicly accessible or addressed only to a specific audience, in our own facilities or other locations.</p>
						<p class="sm:text-sm text-xs mt-2 text-justify">Depending on the event, the data we collect varies and could contain:</p>
						<li class="sm:text-sm text-xs mt-2 text-justify">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address),</li>
						<li class="sm:text-sm text-xs mt-2 text-justify">Details on your profession (e.g., job title, position, personnel number, place of work, branch office, department, education),</li>
						<li class="sm:text-sm text-xs mt-2 text-justify">Information about your travel to the event (e.g., hotel accommodation, flights, transportation),</li>
						<li class="sm:text-sm text-xs mt-2 text-justify">Your bank account data in case of payments to you as a speaker or reimbursements of your costs for participation.</li>
						<p class="sm:text-sm text-xs mt-2 text-justify">Such data is typically used for the participation in the event. In case of payments, we might be required to report them to authorities (e.g., tax authorities).</p>
						<h4 class="font-medium text-gray-700 mt-2 mb-2">
							3.1.12 Research and Development</h4>
							<p class="sm:text-sm text-xs mt-2 text-justify">We perform different surveys, market analyses, and scientific research. This includes customer satisfaction, the development of new products or services or even predictive analyses of future behavior of customers or market developments.</p>
							<p class="sm:text-sm text-xs mt-2 text-justify">The data we collect for such processing activities varies broadly depending on the specific purpose. If possible, we pseudonymize or even anonymize personal data before or in the course of our analyses. In most cases, in particular, when the processing requires and identifier that might lead to you as an individual, we ask for your consent prior to such processing.</p>
							<p class="sm:text-sm text-xs mt-2 text-justify">We also collaborate with other companies or institutes in case of scientific research. In such cases, we enter into specific agreements with these third parties to value the confidentiality of your data.</p>
							<h4 class="font-medium text-gray-700 mt-2 mb-2">
								3.1.13 Site Management
										</h4>
										<p class="sm:text-sm text-xs mt-2 text-justify">When visiting our facilities, we might process your personal data as part of our visitor management. We might offer parking space for your car or provide you with internet connectivity via our Wi-Fi network.</p>
										<p class="sm:text-sm text-xs mt-2 text-justify">This includes mainly:</p>
<li class="sm:text-sm text-xs mt-2 text-justify">Your contact information (e.g., name, title, form of address, private address, gender, telephone numbers, email address),</li>
<li class="sm:text-sm text-xs mt-2 text-justify">Details on your profession (e.g., job title, position, personnel number, place of work, branch office, department, education),</li>
<li class="sm:text-sm text-xs mt-2 text-justify">Details on the visit on in our facilities (e.g., data of visit, purpose of visit, contact person at Chemikart).</li>
<p class="sm:text-sm text-xs mt-2 text-justify">As a part of our security concept, we also maintain a series of technical and organizational measures to protect our facilities, including CCTV. 
	We process only such data which is necessary to maintain this level of security based on our legitimate interests or legal obligations we are subject to.</p>


	<h4 class="font-medium text-gray-700 mt-2 mb-2">
		3.2 Privacy Notice for this Website
				</h4>
				<p class="sm:text-sm text-xs mt-2 text-justify">This section explains the different data processing activities in which Chemikart processes your personal data for the operation of the services provided on this website ("Websites").</p>
				
	<h4 class="font-medium text-gray-700 mt-2 mb-2">
		3.2.1 Operation of our Websites
				</h4>

				<p class="sm:text-sm text-xs mt-2 text-justify">We process your personal data for the purpose of the operation of our Websites. You can access our Websites without directly providing personal information. However, whenever you access our Websites, you automatically transfer personal data to our servers for technical reasons.

				</p> 
				<p class="sm:text-sm text-xs mt-2 text-justify">This processing activity may include the following data categories:

				</p>
				<li class="sm:text-sm text-xs mt-2 text-justify">IP address of the requesting device;</li>
				<li class="sm:text-sm text-xs mt-2 text-justify">Date and time of your visit;</li>
				<li class="sm:text-sm text-xs mt-2 text-justify">Name and URL of the retrieved file;</li>
				<li class="sm:text-sm text-xs mt-2 text-justify">Transferred data volume;</li>
				<li class="sm:text-sm text-xs mt-2 text-justify">Access status (file transferred, file not found, etc.);</li>
				<li class="sm:text-sm text-xs mt-2 text-justify">Identification data of the browser and operating system used;
				</li>
				<li class="sm:text-sm text-xs mt-2 text-justify">Name of the provider of user's internet access; and</li>
				<li class="sm:text-sm text-xs mt-2 text-justify">Website from which access is made and the Websites you are accessing.</li>
				<p class="sm:text-sm text-xs mt-2 text-justify">This data processing is based on our legitimate business interests. We process these data for the purpose of presenting our Websites and to ensure its technical stability and security (e.g., to prevent hacker attacks).</p>



				<h4 class="font-medium text-gray-700 mt-2 mb-2">
					3.2.2 Cookies
							</h4>
							<p class="sm:text-sm text-xs mt-2 text-justify">Cookies improve the user experience on our Websites because they allow, e.g., the system to recognize returning visitors. The term "cookies" in this Privacy Notice refers to cookies and similar technologies. Cookies are small, usually randomly coded text files that are sent to your device and stored there. These cookies allow your browser to track certain information that may be retrieved and used by internet servers at a later stage.Chemikart uses cookies and similar technologies on its Websites for several reasons, for example:</p>
							<li class="sm:text-sm text-xs mt-2 text-justify">Websites load faster;</li>
							<li class="sm:text-sm text-xs mt-2 text-justify">Websites may be browsed faster;</li>
							<li class="sm:text-sm text-xs mt-2 text-justify">Your settings, such as language and time zone, may be saved;</li>
							<li class="sm:text-sm text-xs mt-2 text-justify">Security on websites is improved since your identity may be verified; and</li>
							<li class="sm:text-sm text-xs mt-2 text-justify">Your log-in to secured websites is facilitated.</li>
							<p class="sm:text-sm text-xs mt-2 text-justify">We include the following three categories of cookies on our Websites:</p>


							<h4 class="font-medium text-gray-700 mt-2 mb-2">
								3.2.2.1 Necessary Cookies
										</h4>

										<p class="sm:text-sm text-xs mt-2 text-justify">These cookies are necessary to safeguard the functionalities of our Websites, the services provided thereon and for the website to operate. Cookies are set in response to your actions and depend on your specific service requests (e.g., setting your privacy preferences, filling out forms, or logging in). More specifically, we set the following cookies:</p>
										<li class="sm:text-sm text-xs mt-2 text-justify">___utmvc: This cookie is set by a third-party service to filter out malicious requests. It is deleted within 29 seconds.</li>
										<li class="sm:text-sm text-xs mt-2 text-justify">_abck: This cookie is used as part of the behavior anomaly detection method of Bot Manager Premier, it is also known as the long-term cookie. It is used to track a user's past behavior (human / bot) on a protected site. It is deleted within 1 year.</li>
										<li class="sm:text-sm text-xs mt-2 text-justify">ak_bmsc: This cookie is used to track the progress of the session going through the standard detection workflow. When present, it is also used as the identifier instead of the IP address for the bot rate control rules. It is deleted within 2 hours.</li>
										<li class="sm:text-sm text-xs mt-2 text-justify">ak_wfSession: This cookie is used as part of the Bot Manager Standard and Bot Manager Premier workflow validation feature. It is deleted within 2 hours.</li>
										<li class="sm:text-sm text-xs mt-2 text-justify">ASP.NET_SessionId: This cookie is automatically generated by asp.net. It is created the first time the application is accessed over the browser and deleted when you close your browser.</li>
										<li class="sm:text-sm text-xs mt-2 text-justify">AWSALBCORS: This cookie is managed by Amazon Web Services (AWS) and is used for load balancing. It is deleted within seven days.</li>
										<li class="sm:text-sm text-xs mt-2 text-justify">AWSELBCORS: With CORS (cross-origin resource sharing) requests, some browsers require SameSite=None; Secure to enable stickiness. In this case, Elastic Load Balancing creates a second stickiness cookie, AWSELBCORS, which includes the same information as the original stickiness cookie (AWSELB) plus this SameSite attribute. It is deleted when you close your browser.
										</li>
										<li class="sm:text-sm text-xs mt-2 text-justify">bm_mi: This cookie is used to track the progress of the session through the browser validation detection method. It is deleted within 2 hours.
										</li>
										<li class="sm:text-sm text-xs mt-2 text-justify">bm_sv: This cookie is used as part of the session validation detection method and keeps track of the number of HTML pages and Ajax requests the client makes. It is deleted within 2 hours.</li>
										<li class="sm:text-sm text-xs mt-2 text-justify">bm_sz: This cookie is used as part of the behavior anomaly detection method of Bot Manager Premier, it is also known as the short-term cookie. It references the telemetry collected during the session. It is deleted within 4 hours.</li>
<li clss="sm:text-sm text-xs mt-2 text-justify">mediaCart: This cookie is used to store files the user adds to their media and files shopping cart. The user's session will be stored within a cookie. This cookie expires after 30 days.</li>
<li class="sm:text-sm text-xs mt-2 text-justify">sec_cpt: This cookie is used as part of the challenge action (Captcha, PoW, behavioral) available in the behavior anomaly detection method of Bot Manager Premier. This cookie tracks the state of the challenge process. It is deleted within 5 to 120 minutes.</li>
<p class="sm:text-sm text-xs mt-2 text-justify">The processing is based on our legitimate business interest to be able to provide our basic web services in a secure and useful manner. Our website cannot function without these cookies, and they can only be disabled by changing your browser preferences. Please note, if you object to the use of these necessary cookies, our Services might not be available to you.</p>
<h4 class="font-medium text-gray-700 mt-2 mb-2">3.2.2.2 Functional Cookies</h4>
<div class="text-justify">
	<p class="sm:text-sm text-xs mt-2">These cookies enable the provision of advanced functionalities and are used for personalization. The cookies are set in response to your actions and depend on your specific service requests (e.g., pop-up notification choices). More specifically, we set the following cookies:</p>
	<li class="sm:text-sm text-xs mt-2">AKA_A2: This cookie provides an Advanced Acceleration feature, which enables DNS Prefetch and HTTP2 push. It expires after 1 hour or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">AkamaiAnalytics_BrowserSessionId: This cookie assigns an anonymous identifier to each visitor who plays a video. Used to analyze the video media player. It expires when you close your browser or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">FORMASSEMBLY: This cookie is used to provide our users with online forms. The user's session will be stored within a cookie. It expires when you close your browser or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">has_js: This cookie is used to indicate whether or not the visitor´s browser has JavaScript enabled. It expires when you close your browser or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">HTML_BitRateBucketCsv: This cookie measures the playback time of videos in the video media player per visitor depending on the bit rate. Used to analyze the video media player. It expires when you close your browser or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">HTML_isPlayingCount: This cookie counts the number of times a specific video was played in the video media player. Used to analyze the video media player. It expires when you close your browser or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">HTML_VisitCountCookie: This cookie counts the number of views of a video in the video media player. Used to analyze the video media player. It expires when you close your browser or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">HTML_VisitIntervalStartTime: This cookie measures the start time of an interval between visits to a website in the video media player. Used to analyze the video media player. It expires when you close your browser or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">HTML_VisitValueCookie: This cookie calculates the value of the visit to the website from the playback time of a video in the video media player when it is accessed and the number of rebuffer processes during playback. Used to analyze the video media player. It expires when you close your browser or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">incap_ses_...: This cookie is used for visitor recognition. It expires when you close your browser or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">m_survey47_2_1: This cookie is used for ensuring the technical process of the survey. It expires after 365 days or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">Chemikart: This cookie is used to offer surveys to randomly selected users on the website. It expires after one minute or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">Chemikart_survey…: This cookie is used to offer surveys to randomly selected users on the website. It expires after one year or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">Chemikart_survey32_1_1: This cookie is used for ensuring the technical process of the survey. It expires after 365 days or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">Chemikart_survey32_2_1: This cookie is used for ensuring the technical process of the survey. It expires after 365 days or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">RT: This cookie is used to interface with LinkedIn. It expires after seven days or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">water-webgl-open-ids: This cookie is used for animated pages. The cookie is deleted when you close your browser or upon the withdrawal of your consent.</li>
	<p class="sm:text-sm text-xs mt-2">The processing is based on your consent you provided to us. You either grant your consent by accepting all cookies in our cookie banner or by activating the cookie type(s) you have selected. Your consent is voluntary, and you may withdraw it at any time with effect for the future. </p>
	</div>
	<h4 class="font-medium text-gray-700 mt-2 mb-2">3.2.2.3 Targeting Cookies</h4>
	<div class="text-justify">
	<p class="sm:text-sm text-xs mt-2">These cookies may be set to analyze your interests and show you relevant ads on other websites. These cookies work by uniquely identifying your browser and device. By integrating these cookies, we aim to learn more about your interests and your behavior on our Websites in order to place our advertising in a targeted manner. More specifically, we set the following cookies:</p>
	<li class="sm:text-sm text-xs mt-2">_fbp: This cookie is used by Facebook to deliver a series of advertisement products on Facebook. It expires after three months or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">_ga: This cookie is associated with Google Universal Analytics (Google LLC) – an update to Google LLC's more commonly used analytics service. This cookie is used to distinguish unique users by assigning a randomly generated number as a customer identifier. It is included in every page request on a website and is used to calculate visitor, session and campaign data for website analytics reports. By default, it is set to expire after 2 years or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">_gat…: This cookie is linked to Google Universal Analytics (Google LLC). It is used to throttle the request rate and limit data collection on high-volume websites. This cookie expires after 10 minutes or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">_gat_UA-43815746-1: This cookie is used by Google Analytics to limit the request rate. It expires after one minute or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">_gat_gtag_UA_43815746_1: This cookie is used to deliver adverts more relevant to you and your interests. It is also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign. It expires after one minute or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">_gid: This cookie contains a randomly generated user ID. This ID allows Google Analytics (Google LLC) to recognize returning users to this website and merges data from previous visits. It expires after one day or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">_guid: Used to identify a LinkedIn Member for advertising through Google Ads. It expires after 90 days or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">BiographicsOptOut: Determine opt-out status for 3rd party tracking. It expires after 10 years or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">IDE: This cookie contains a randomly generated user ID. This ID allows Google LLC to recognize you on multiple websites and provide personalized ads. It expires after one year or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">did: Remarketing of users of the Chemikart website for commercial purposes. It expires after one year or upon the withdrawal of your consent. 	</li>
	<li class="sm:text-sm text-xs mt-2">igodigitalst: This cookie is used to capture customer behavior to improve the quality of the experience of our online customers, including enhanced browsing experiences. It expires after one hour or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">igodigitalstdomain: This cookie is used to capture customer behavior to improve the quality of the experience of our online customers, including enhanced browsing experiences. It expires after one hour or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">igodigitaltc2: This cookie is used to capture customer behavior to improve the quality of the experience of our online customers, including enhanced browsing experiences. It expires after 10 years or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">U: Browser Identifier for users outside the Designated Countries. It expires after 3 months or upon the withdrawal of your consent.</li>
	<li class="sm:text-sm text-xs mt-2">visid_incap_...: This cookie is used for visitor recognition for linking certain sessions to a specific visitor. It expires after one year or upon the withdrawal of your consent.</li>
	<p class="sm:text-sm text-xs mt-2">The processing is based on your consent you provided. You either grant your consent by accepting all cookies in our cookie banner or by activating the cookie type(s) you have selected. Your consent is voluntary, and you may withdraw it at any time with effect for the future. You can withdraw your consent by reopening our cookie banner and deactivating the cookie type.</p>
	<p class="sm:text-sm text-xs mt-2">Please note that the use of Google Analytics has been extended by the plug-in "AnonymizeIP", to ensure an anonymized collection of your IP address, so that we cannot relate your data to your person. </p>
</div>
		<h4 class="font-medium text-gray-700 mt-2 mb-2">3.2.2.4 Management and Deletion of Cookies</h4>
		<p  class="mt-2 sm:text-sm text-xs text-justify">{dataPrivacyNotice.dataPrivacyNotice.management}</p>
						
		<h4 class="font-medium text-gray-700 mt-2 mb-2">3.2.3 Google Maps</h4>
		<div class="text-justify">
		<p  class="sm:text-sm text-xs mt-2">We process your personal data to display maps, a service provided by Google LLC.</p>
		<p  class="sm:text-sm text-xs mt-2">This processing activity may include the following data categories which will be transmitted to Google LLC in the United States of America:</p>
		<li  class="sm:text-sm text-xs mt-2">The technical data as described in Section 4.1;</li>
		<li  class="sm:text-sm text-xs mt-2">Your location;</li>
		<li  class="sm:text-sm text-xs mt-2">The content you access (e.g., places); and</li>
		<li  class="sm:text-sm text-xs mt-2">The frequency of these accesses.</li>
		<p  class="sm:text-sm text-xs mt-2">The processing is based on our (and your) legitimate business interest to guide you to our premises and facilitate your route planning.</p>
		<p  class="sm:text-sm text-xs mt-2">The use of the service is not possible without your data, and these are automatically provided when 
								you open a sub-page on which Google Maps is integrated. We process no further personal data than those specified in Section 4.1. Information on
								 data processing by Google can be found in Google's privacy policy under the following link:
								<a  href="https://policies.google.com/privacy?hl=en." class=" text-primary-500 hover:underline underline-offset-2"> https://policies.google.com/privacy/</a></p>
								 <p  class="text-sm mt-2">We do not conduct automated decision-making or profiling in this context.</p>


</div>
<h3 id="data-retention" class="mt-5 text-lg font-semibold">4. Data Retention</h3>
	<p class="mt-2 sm:text-sm text-xs text-justify">{dataPrivacyNotice.dataPrivacyNotice.data_retention}</p>
	<p class="mt-3 sm:text-sm text-xs text-justify"> For more information about how long we store cookies for, please see above.</p>
	<p class="mt-3 sm:text-sm text-xs text-justify">{dataPrivacyNotice.dataPrivacyNotice.data_retention2}</p>
	<p class="mt-3 sm:text-sm text-xs text-justify">{dataPrivacyNotice.dataPrivacyNotice.data_retention3}</p>

	<h3 id="recipients" class="mt-5 text-lg font-semibold">5. Recipients of Personal Data</h3>
	<p class="mt-2 sm:text-sm text-xs text-justify mb-4">{dataPrivacyNotice.dataPrivacyNotice.personal_data}</p>
</div>
