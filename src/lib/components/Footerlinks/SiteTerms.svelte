<script>
    import termsOfUseData from '$lib/data/FooterLinks/Terms.json'; 
  </script>
  
  <div>
    <h1 class="text-2xl font-bold mb-4 mt-5 text-center">Terms of Use</h1>
    <p class=" leading-relaxed text-sm lg:ml-5">
        {termsOfUseData.TermsOfUse.Content}
    </p>
    <h1 class="text-xl font-bold lg:ml-5 mt-4 mb-4">Consent</h1>
    <div class="lg:ml-5  leading-relaxed">
        <p>
            <span class="font-bold text-sm">
                By using the Website or by clicking to accept or agree to the Terms of Use when this option is made available to you, you accept and agree to be bound and abide by these Terms of Use.
            </span>
            <span class="text-sm">{termsOfUseData.TermsOfUse.Consent}</span>
            <span class="font-bold  text-sm">
                If you are an existing user with an Account and do not agree to these Terms of Use and wish to remove your Account from the website, please submit a request to us for the removal of your Account.
            </span>
        </p>
    </div>
    <p class="lg:ml-5  text-sm mt-5">{termsOfUseData.TermsOfUse.Consent2}</p>
    <h1 class="text-xl font-bold mt-5 mb-5 lg:ml-5">Exclusion of Warranty</h1>
    <p class=" leading-relaxed text-sm lg:ml-5">{termsOfUseData.TermsOfUse.waranty}</p>
    <p class=" leading-relaxed  text-sm lg:ml-5 mt-5">{termsOfUseData.TermsOfUse.waranty2}</p>
    <h1 class="text-xl font-bold  mt-5 mb-5 lg:ml-5">Account Management</h1>
    <p class=" leading-relaxed text-sm lg:ml-5">{termsOfUseData.TermsOfUse.account}</p>
    <h1 class="text-xl font-bold mt-5 mb-5 lg:ml-5">Prohibited Users</h1>
    <p class="text-sm mb-2 lg:ml-5">You may use the Website and its contents only for lawful purposes and in accordance with these Terms of Use. You agree not to use the Website and its contents:</p>
    <ul class="list-disc  lg:ml-5 text-sm">
        <li >In any way that violates any applicable federal, state, local, or international law or regulation.</li>
        <li>To transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter”, “spam”, or any other similar solicitation.</li>
        <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
        <li>To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of the Website.</li>
    </ul>
    <h1 class="text-xl font-bold mt-5 mb-5 lg:ml-5">Intellectual Property Rights</h1>
    <p class="text-sm lg:ml-5">{termsOfUseData.TermsOfUse.Property_Right1}</p>
    <p class="mt-2 text-sm lg:ml-5">{termsOfUseData.TermsOfUse.Property_Right2}</p>
    <p class="mt-2 text-sm lg:ml-5">{termsOfUseData.TermsOfUse.Property_Right3}</p>
  </div>
  