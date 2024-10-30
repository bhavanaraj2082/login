<script>
    import dataPrivacyNotice from '$lib/data/FooterLinks/privacynotice.json';
    </script>
    <div>
        <h1 class="text-3xl font-bold mb-4 mt-10 text-center  ">Data Privacy Notice</h1>
        <p class="font-bold mb-2">Last modified August 6, 2024</p>
        <p>We take your data privacy and the protection of your personal data seriously and our data privacy principles provide fundamental guidance to all our businesses worldwide. We comply with applicable national regulations and our understanding of data privacy is based on the European General Data Protection Regulation (GDPR), amended by local regulations in case they are stricter.</p>
        <hr class="border-t-1 mt-4 border border-gray-400">
        <ol class="list-decimal pl-5 mt-5 space-y-2 text-primary-400">
            <li><a href="#preamble" class="hover:underline">Preamble</a></li>
            <li><a href="#general-info" class="hover:underline">General Information</a></li>
            <li><a href="#processing-activities" class="hover:underline">The Processing Activities in Detail</a></li>
            <li><a href="#data-retention" class="hover:underline">Data Retention</a></li>
            <li><a href="#recipients" class="hover:underline">Recipients of Personal Data</a></li>
        </ol>
        <hr class="border-t-1 mt-4 border border-gray-400 mb-10">
    
        <h3 id="preamble" class="text-primary-400 mt-5 text-lg">1. Preamble</h3>
        <p>{dataPrivacyNotice.dataPrivacyNotice.preamble}</p>
        <p class="mt-2">{dataPrivacyNotice.dataPrivacyNotice.preamble2} <a href="mailto:privacy@chemikart.com" class="text-primary-400 font-bold">privacy@chemikart.com</a> or the other contact details provided below.</p>
    
        <h3 id="general-info" class="text-primary-400 mt-5 text-lg">2. General Information</h3>
        <p>{dataPrivacyNotice.dataPrivacyNotice.general_information}</p>
        <h4 class="font-bold text-black mt-2 mb-2">2.1 Controller</h4>
        <p>{dataPrivacyNotice.dataPrivacyNotice.controller}</p>
        <h4>2.2 Data Privacy Officer</h4>
        <p>We have appointed a Data Privacy Officer. You can contact this person and the team at any time:</p>
        <p class="mt-2">Data Privacy Officer</p>
        <a href="mailto:privacy@chemikart.com" class="text-primary-400 font-bold mt-2">privacy@chemikart.com</a>
        <p>You are also welcome to exercise your data protection rights by submitting your request directly in our Data Privacy Portal.</p>
    
        <h3 id="processing-activities" class="text-primary-400 mt-5 text-lg">3. The Processing Activities in Detail</h3>
        <p>This section explains the different data processing activities in which we process your personal data.</p>
        <h4 class="mt-2 text-black">3.1 Processing of Your Personal Data in Various Contexts</h4>
        <p class="mt-2">{dataPrivacyNotice.dataPrivacyNotice.processing_activities}</p>
        <p class="mt-2">{dataPrivacyNotice.dataPrivacyNotice.processing_activities2}</p>
        <p class="mt-2">{dataPrivacyNotice.dataPrivacyNotice.processing_activities3}</p>
        <p class="mt-2">{dataPrivacyNotice.dataPrivacyNotice.processing_activities4}</p>
        <p class="mt-2">{dataPrivacyNotice.dataPrivacyNotice.processing_activities5}</p>
        
        <h3 id="data-retention" class="text-primary-400 mt-5 text-lg">4. Data Retention</h3>
        <p class="mt-2">{dataPrivacyNotice.dataPrivacyNotice.data_retention}</p>
        <p class="mt-2">For more information about how long we store cookies for, please see above.</p>
        <p class="mt-2">{dataPrivacyNotice.dataPrivacyNotice.data_retention2}</p>
        <p class="mt-2">{dataPrivacyNotice.dataPrivacyNotice.data_retention3}</p>
    
        <h3 id="recipients" class="text-primary-400 mt-5 text-lg">5. Recipients of Personal Data</h3>
        <p class="mt-2">{dataPrivacyNotice.dataPrivacyNotice.personal_data}</p>
    </div>
    