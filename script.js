// Nigerian Tax Calculator
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calculateBtn = document.getElementById('calculate-btn');
    const monthlyIncomeInput = document.getElementById('monthly-income');
    const allowancesInput = document.getElementById('allowances');
    const housingInput = document.getElementById('housing');
    const pensionInput = document.getElementById('pension');
    
    // Checkboxes
    const payeCheckbox = document.getElementById('paye');
    const vatCheckbox = document.getElementById('vat');
    const nsitfCheckbox = document.getElementById('nsitf');
    const nhfCheckbox = document.getElementById('nhf');
    
    // Results Elements
    const annualGrossEl = document.getElementById('annual-gross');
    const totalTaxEl = document.getElementById('total-tax');
    const annualNetEl = document.getElementById('annual-net');
    const monthlyNetEl = document.getElementById('monthly-net');
    const payeAmountEl = document.getElementById('paye-amount');
    const vatAmountEl = document.getElementById('vat-amount');
    const nsitfAmountEl = document.getElementById('nsitf-amount');
    const nhfAmountEl = document.getElementById('nhf-amount');
    const totalDeductionsEl = document.getElementById('total-deductions');
    
    // Share Buttons
    const shareFacebookBtn = document.getElementById('share-facebook');
    const shareWhatsappBtn = document.getElementById('share-whatsapp');
    const shareTwitterBtn = document.getElementById('share-twitter');
    
    // Nigerian Tax Rates (2024)
    const TAX_RATES = [
        { threshold: 300000, rate: 0.07 },
        { threshold: 300000, rate: 0.11 },
        { threshold: 500000, rate: 0.15 },
        { threshold: 500000, rate: 0.19 },
        { threshold: 1600000, rate: 0.21 },
        { threshold: 3200000, rate: 0.24 }
    ];
    
    const VAT_RATE = 0.075; // 7.5%
    const NSITF_RATE = 0.01; // 1%
    const NHF_RATE = 0.025; // 2.5%
    
    // Calculate PAYE Tax
    function calculatePAYE(annualTaxableIncome) {
        let remainingIncome = annualTaxableIncome;
        let totalTax = 0;
        
        for (const bracket of TAX_RATES) {
            if (remainingIncome <= 0) break;
            
            const taxableInBracket = Math.min(remainingIncome, bracket.threshold);
            totalTax += taxableInBracket * bracket.rate;
            remainingIncome -= taxableInBracket;
        }
        
        return Math.round(totalTax);
    }
    
    // Calculate Total Taxes
    function calculateTaxes() {
        // Get input values
        const monthlyIncome = parseFloat(monthlyIncomeInput.value) || 0;
        const allowances = parseFloat(allowancesInput.value) || 0;
        const housing = parseFloat(housingInput.value) || 0;
        const pensionRate = (parseFloat(pensionInput.value) || 8) / 100;
        
        // Calculate monthly and annual figures
        const monthlyGross = monthlyIncome + allowances;
        const annualGross = monthlyGross * 12;
        
        // Calculate pension deduction
        const monthlyPension = monthlyIncome * pensionRate;
        const annualPension = monthlyPension * 12;
        
        // Calculate taxable income (after pension and housing)
        const annualTaxableIncome = annualGross - annualPension - (housing * 12);
        
        // Initialize tax amounts
        let payeTax = 0;
        let vatTax = 0;
        let nsitfTax = 0;
        let nhfTax = 0;
        
        // Calculate selected taxes
        if (payeCheckbox.checked) {
            payeTax = calculatePAYE(Math.max(0, annualTaxableIncome));
        }
        
        if (vatCheckbox.checked) {
            vatTax = Math.round(annualGross * VAT_RATE);
        }
        
        if (nsitfCheckbox.checked) {
            nsitfTax = Math.round(monthlyIncome * NSITF_RATE * 12);
        }
        
        if (nhfCheckbox.checked) {
            nhfTax = Math.round(monthlyIncome * NHF_RATE * 12);
        }
        
        // Calculate totals
        const totalTax = payeTax + vatTax + nsitfTax + nhfTax;
        const annualNet = annualGross - totalTax - annualPension - (housing * 12);
        const monthlyNet = annualNet / 12;
        
        // Update UI
        updateResults({
            annualGross,
            totalTax,
            annualNet,
            monthlyNet,
            payeTax,
            vatTax,
            nsitfTax,
            nhfTax,
            totalDeductions: totalTax + annualPension + (housing * 12)
        });
    }
    
    // Update Results in UI
    function updateResults(results) {
        // Format numbers with commas
        const formatter = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        annualGrossEl.textContent = formatter.format(results.annualGross);
        totalTaxEl.textContent = formatter.format(results.totalTax);
        annualNetEl.textContent = formatter.format(results.annualNet);
        monthlyNetEl.textContent = formatter.format(results.monthlyNet);
        payeAmountEl.textContent = formatter.format(results.payeTax);
        vatAmountEl.textContent = formatter.format(results.vatTax);
        nsitfAmountEl.textContent = formatter.format(results.nsitfTax);
        nhfAmountEl.textContent = formatter.format(results.nhfTax);
        totalDeductionsEl.textContent = formatter.format(results.totalDeductions);
        
        // Show results section with animation
        const resultsSection = document.getElementById('results');
        resultsSection.style.display = 'block';
        resultsSection.style.animation = 'fadeIn 0.5s ease';
    }
    
    // Share Functions
    function shareOnFacebook() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent("Calculate your Nigerian taxes easily with NaijaTax Calculator! 🇳🇬");
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    }
    
    function shareOnWhatsApp() {
        const text = encodeURIComponent("Calculate your Nigerian taxes easily with NaijaTax Calculator! 🇳🇬 Check it out: " + window.location.href);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    }
    
    function shareOnTwitter() {
        const text = encodeURIComponent("Calculate your Nigerian taxes easily with NaijaTax Calculator! 🇳🇬");
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
    
    // Event Listeners
    calculateBtn.addEventListener('click', calculateTaxes);
    
    // Calculate when Enter is pressed in any input
    const inputs = [monthlyIncomeInput, allowancesInput, housingInput, pensionInput];
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateTaxes();
            }
        });
    });
    
    // Share button event listeners
    shareFacebookBtn.addEventListener('click', shareOnFacebook);
    shareWhatsappBtn.addEventListener('click', shareOnWhatsApp);
    shareTwitterBtn.addEventListener('click', shareOnTwitter);
    
    // Add CSS for fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .results-section {
            display: none;
        }
    `;
    document.head.appendChild(style);
    
    // Sample calculation on load (optional)
    // monthlyIncomeInput.value = 500000;
    // allowancesInput.value = 100000;
    // housingInput.value = 50000;
    // Uncomment above to pre-fill sample data for testing
});