<script>
  import Icon from "@iconify/svelte";
  import Quotes from "./Quotes.svelte";
  import Invoice from "./Invoice.svelte";
  import OrderStatus from "./Order-Status.svelte";
  import OrderConfiguration from "./Order-configuration.svelte";
  import ReturnExchangeItems from "./Return-exchange-items.svelte";
  import OtherIssues from "./Other-issues.svelte";
  import UpdateBilling from "./update-billing.svelte";
  import ShippingInfo from "./shipping-info.svelte";
  import PasswordReset from "./password-reset.svelte";
  import UpdateEmail from "./update-email.svelte";
  import OtherAccountIssues from "./other-account-issues.svelte";
  import PricingAvailability from "./pricing-availability.svelte";
  import ProductDocumentation from "./product-documentation.svelte";
  import ProductTechnicalIssues from "./product-technical-issues.svelte";

  import TechnicalProblems from "./technical-problems.svelte";
  import OtherWebsiteIssues from "./other-website-issues.svelte";
  import ReportProductIssues from "./Report-product-issues.svelte";
  // import ContactInfo1 from "./Contact-info1.svelte";
  
  let Mainimage = "/images/Help&Support.JPG";
  let clickedButton = "";

  function handleClick(buttonValue) {
    clickedButton = buttonValue;
    // alert(`${clickedButton} Clicked`);
  }
</script>

<div class="main-container mx-6 lg:mx-12 md:mx-8 sm:mx-8 my-10 bg-white">
  <div class="flex flex-col justify-evenly items-center lg:flex-row lg:mb-8 ">
    <img src={Mainimage} alt="MainImAGE" class="w-80" />
    <div class="lg:w-1/3 my-2 lg:my-0 p-4">
      <h1 class="text-primary-400 font-semibold text-xl pb-2">
        What do you need help with?
      </h1>
      <p class="text-sm">
        Please select an option below and complete the form to contact our
        support specialists. For a better experience and access to your account
        details and order information, please <span
          ><a href="./login">Sign In.</a></span
        >
      </p>
    </div>
  </div>

  <!-- card container -->
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 p-4 bg-white"
  >
    <!-- card1 -->
    <div class="  rounded-lg flex flex-col text-center">
      <h2
        class=" flex items-center justify-center text-base font-semibold mb-2 text-white bg-primary-400 px-4 py-2 rounded"
      >
        <span class="flex-1 text-center">ORDER</span>
        <span
          ><Icon
            icon="radix-icons:double-arrow-down"
            class="w-8 h-5 text-white"
          /></span
        >
      </h2>
      <div class="flex flex-col text-sm bg-primary-50 rounded-lg h-full">
        <button
          on:click={() => handleClick("invoice")}
          class=" px-4 py-2 rounded   m-2 hover:font-semibold"
        >
          Invoice
        </button>
        <button
          on:click={() => handleClick("quotes")}
          class=" px-4 py-2 rounded m-2"
        >
          Quotes
        </button>
        <button
          on:click={() => handleClick("order-status")}
          class=" px-4 py-2 rounded  m-2"
        >
          Order Status
        </button>
        <button
          on:click={() => handleClick("order-configuration")}
          class=" px-4 py-2 rounded  m-2"
        >
          Order Configuration
        </button>
        <button
          on:click={() => handleClick("return-exchange-items")}
          class=" px-4 py-2 rounded  m-2"
        >
          Return & Exchange Items
        </button>
        <button
          on:click={() => handleClick("other-issues")}
          class=" px-4 py-2 rounded  m-2"
        >
          Other Issues
        </button>
      </div>
    </div>
    <!-- card2 -->
    <div class="  rounded-lg  flex flex-col text-center">
      <h2
        class=" flex items-center justify-center text-base font-semibold mb-2  text-white bg-primary-400 px-4 py-2 rounded"
      >
        <span class="flex-1 text-center">ACCOUNT</span>
        <span
          ><Icon
            icon="radix-icons:double-arrow-down"
            class="w-8 h-5 text-white"
          /></span
        >
      </h2>
      <div class="flex flex-col text-sm bg-primary-50 rounded-lg h-full">
        <button
          on:click={() => handleClick("update-billing")}
          class=" px-4 py-2 rounded  m-2 hover:font-semibold"
        >
          Update Billing
        </button>
        <button
          on:click={() => handleClick("shipping-info")}
          class=" px-4 py-2 rounded  m-2"
        >
          Shipping info
        </button>
        <button
          on:click={() => handleClick("password-reset")}
          class=" px-4 py-2 rounded  m-2"
        >
          Password reset
        </button>
        <button
          on:click={() => handleClick("update-email")}
          class=" px-4 py-2 rounded  m-2"
        >
          Update Email
        </button>
        <button
          on:click={() => handleClick("Other-account-issues")}
          class=" px-4 py-2 rounded  m-2"
        >
          Other Account issues
        </button>
      </div>
    </div>
    <!-- card3 -->
    <div class="  rounded-lg  flex flex-col text-center">
      <h2
        class=" flex items-center justify-center text-base font-semibold mb-2 text-white bg-primary-400 px-4 py-2 rounded"
      >
        <span class="flex-1 text-center">PRODUCT</span>
        <span
          ><Icon
            icon="radix-icons:double-arrow-down"
            class="w-8 h-5 text-white "
          /></span
        >
      </h2>
      <div class="flex flex-col text-sm bg-primary-50 rounded-lg h-full">
        <button
          on:click={() => handleClick("pricing-availability")}
          class=" px-4 py-2 rounded  m-2 hover:font-semibold"
        >
          Pricing & Availability
        </button>
        <button
          on:click={() => handleClick("product-documentation")}
          class=" px-4 py-2 rounded  m-2"
        >
          Product Documentation
        </button>
        <button
          on:click={() => handleClick("product-technical-issues")}
          class=" px-4 py-2 rounded  m-2"
        >
          Product technical Issues
        </button>
        <button
          on:click={() => handleClick("report-product-issues")}
          class=" px-4 py-2 rounded  m-2"
        >
          Report Product Issues
        </button>
      </div>
    </div>
    <!-- card4 -->
    <div class="  rounded-lg  flex flex-col text-center">
      <h2
        class=" flex items-center justify-center text-base font-semibold mb-2 text-white bg-primary-400 px-4 py-2 rounded"
      >
        <span class="flex-1 text-center">WEBSITE</span>
        <span
          ><Icon
            icon="radix-icons:double-arrow-down"
            class="w-8 h-5 text-white"
          /></span
        >
      </h2>
      <div class="flex flex-col text-sm bg-primary-50 rounded-lg h-full">
        <button
          on:click={() => handleClick("technical-problem")}
          class=" px-4 py-2 rounded  m-2"
        >
          Technical Problem
        </button>
        <button
          on:click={() => handleClick("other-website-issues")}
          class=" px-4 py-2 rounded  m-2"
        >
          Other Website Issues
        </button>
      </div>
    </div>
  </div>
{#if clickedButton === 'invoice'}
<Invoice />
{:else if clickedButton === 'quotes'}
<Quotes />
{:else if clickedButton === 'order-status'}
<OrderStatus />
{:else if clickedButton === 'order-configuration'}
<OrderConfiguration />
{:else if clickedButton === 'return-exchange-items'}
<ReturnExchangeItems />
{:else if clickedButton === 'other-issues'}
<!-- Kindly provide data if required ,as of now No data provided -->
<OtherIssues />
{:else if clickedButton === 'update-billing'}
<UpdateBilling />
{:else if clickedButton === 'shipping-info'}
<ShippingInfo />
{:else if clickedButton === 'password-reset'}
<PasswordReset />
{:else if clickedButton === 'update-email'}
<UpdateEmail />
{:else if clickedButton === 'Other-account-issues'}
<OtherAccountIssues />
{:else if clickedButton === 'pricing-availability'}
<PricingAvailability />
{:else if clickedButton === 'product-documentation'}
<ProductDocumentation />
{:else if clickedButton === 'product-technical-issues'}
<!-- Kindly provide data if required,as of now No data provided -->
<ProductTechnicalIssues />
{:else if clickedButton === 'report-product-issues'}
<ReportProductIssues />
{:else if clickedButton === 'technical-problem'}
<!-- Kindly provide data if required,as of now No data provided -->
<TechnicalProblems />
{:else if clickedButton === 'other-website-issues'}
<!-- Kindly provide data if required,as of now No data provided -->
<OtherWebsiteIssues />
{/if}
<!-- If you require user to contact u directly send there contact details to email uncomment the below svelte file and use it -->
<!-- <ContactInfo1 /> -->
</div>

<style>


  button {
    color: rgb(254, 124, 98);
    background-color: #ffffff;
    transition: all 0.4s ease;
  }
  button:hover {
    background-color: rgb(247, 166, 149);
    color: #ffffff;
    font-size: medium;
  }

 
</style>
