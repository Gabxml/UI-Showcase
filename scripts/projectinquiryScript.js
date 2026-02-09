document.addEventListener('DOMContentLoaded', () => {
    // Tab Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectInquiryTab = document.getElementById('project-inquiry-tab');
    const contactTab = document.getElementById('contact-form-tab');
    
    // Project Inquiry Form Elements
    const projectInquiryForm = document.getElementById('projectInquiryForm');
    const projectSubmitBtn = document.getElementById('submitInquiry');
    const projectResetBtn = document.getElementById('resetInquiry');
    const projectFormMessage = document.getElementById('projectFormMessage');
    
    // Contact Form Elements
    const contactForm = document.getElementById('contactForm');
    const contactSubmitBtn = document.getElementById('submitContact');
    const contactResetBtn = document.getElementById('resetContact');
    const contactFormMessage = document.getElementById('contactFormMessage');
    
    // Shared Modal Elements
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    // Project Inquiry Form Elements
    const minBudgetRange = document.getElementById('minBudgetRange');
    const maxBudgetRange = document.getElementById('maxBudgetRange');
    const minBudgetNumber = document.getElementById('minBudgetNumber');
    const maxBudgetNumber = document.getElementById('maxBudgetNumber');
    const budgetPreview = document.getElementById('budgetPreview');
    const desiredStart = document.getElementById('desiredStart');
    const desiredEnd = document.getElementById('desiredEnd');
    const briefDescription = document.getElementById('briefDescription');
    
    // Contact Form Elements
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const company = document.getElementById('company');
    const message = document.getElementById('message');
    
    // Error Elements
    const projectErrors = {
        projectType: document.getElementById('errorProjectType'),
        budget: document.getElementById('errorBudget'),
        start: document.getElementById('errorStart'),
        end: document.getElementById('errorEnd'),
        description: document.getElementById('errorDescription')
    };
    
    const contactErrors = {
        fullName: document.getElementById('errorFullName'),
        email: document.getElementById('errorEmail'),
        phone: document.getElementById('errorPhone'),
        message: document.getElementById('errorMessage')
    };
    
    // Budget config & defaults
    const budgetConfig = { min: 0, max: 1000000, step: 1000 };
    const defaultMin = 50000;
    const defaultMax = 200000;
    
    // Initialize
    function init() {
        initializeBudgetSlider();
        setupEventListeners();
        setTodayAsMinDate();
        
        // Set default tab (Project Inquiry is shown by default)
        switchTab('project-inquiry');
    }
    
    // Set today as min date for date inputs
    function setTodayAsMinDate() {
        const today = new Date().toISOString().split('T')[0];
        if (desiredStart) desiredStart.min = today;
        if (desiredEnd) desiredEnd.min = today;
    }
    
    // Initialize budget slider
    function initializeBudgetSlider() {
        [minBudgetRange, maxBudgetRange].forEach(r => {
            r.min = budgetConfig.min;
            r.max = budgetConfig.max;
            r.step = budgetConfig.step;
        });
        
        minBudgetRange.value = defaultMin;
        maxBudgetRange.value = defaultMax;
        minBudgetNumber.value = defaultMin;
        maxBudgetNumber.value = defaultMax;
        
        updateBudgetPreview();
    }
    
    // Format currency
    function formatCurrency(n) {
        const v = Number(n) || 0;
        return '₱' + v.toLocaleString('en-PH');
    }
    
    // Clamp value
    function clamp(v, a, b) {
        return Math.min(Math.max(Number(v), Number(a)), Number(b));
    }
    
    // Update budget preview
    function updateBudgetPreview() {
        const minVal = Number(minBudgetRange.value);
        const maxVal = Number(maxBudgetRange.value);
        budgetPreview.textContent = `${formatCurrency(minVal)} — ${formatCurrency(maxVal)}`;
    }
    
    // Budget slider sync functions
    function syncMinFromRange() {
        let minVal = Number(minBudgetRange.value);
        let maxVal = Number(maxBudgetRange.value);
        if (minVal > maxVal - budgetConfig.step) {
            minVal = Math.max(budgetConfig.min, maxVal - budgetConfig.step);
            minBudgetRange.value = minVal;
        }
        minBudgetNumber.value = minVal;
        updateBudgetPreview();
    }
    
    function syncMaxFromRange() {
        let minVal = Number(minBudgetRange.value);
        let maxVal = Number(maxBudgetRange.value);
        if (maxVal < minVal + budgetConfig.step) {
            maxVal = Math.min(budgetConfig.max, minVal + budgetConfig.step);
            maxBudgetRange.value = maxVal;
        }
        maxBudgetNumber.value = maxVal;
        updateBudgetPreview();
    }
    
    function syncMinFromNumber() {
        let v = clamp(minBudgetNumber.value, budgetConfig.min, budgetConfig.max);
        const maxVal = Number(maxBudgetNumber.value);
        if (v > maxVal - budgetConfig.step) v = Math.max(budgetConfig.min, maxVal - budgetConfig.step);
        minBudgetNumber.value = v;
        minBudgetRange.value = v;
        updateBudgetPreview();
    }
    
    function syncMaxFromNumber() {
        let v = clamp(maxBudgetNumber.value, budgetConfig.min, budgetConfig.max);
        const minVal = Number(minBudgetNumber.value);
        if (v < minVal + budgetConfig.step) v = Math.min(budgetConfig.max, minVal + budgetConfig.step);
        maxBudgetNumber.value = v;
        maxBudgetRange.value = v;
        updateBudgetPreview();
    }
    
    // Clear errors
    function clearErrors(formType) {
        if (formType === 'project') {
            Object.values(projectErrors).forEach(n => { if (n) n.textContent = ''; });
            projectFormMessage.innerHTML = '';
        } else if (formType === 'contact') {
            Object.values(contactErrors).forEach(n => { if (n) n.textContent = ''; });
            contactFormMessage.innerHTML = '';
        }
    }
    
    // Set error
    function setError(node, message) {
        if (node) node.textContent = message;
    }
    
    // Validation helpers
    function isValidEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
    
    function isValidPhone(v) {
        const digits = v.replace(/[^\d]/g, '');
        return digits.length >= 7;
    }
    
    // Show/hide modal
    function showSuccessModal(title, message) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        successModal.style.display = 'flex';
        closeModalBtn.focus();
    }
    
    function hideSuccessModal() {
        successModal.style.display = 'none';
    }
    
    // Switch tabs - Only shows one tab at a time
    function switchTab(tabName) {
        // Update tab buttons
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Show active tab, hide the other
        if (tabName === 'project-inquiry') {
            projectInquiryTab.classList.add('active-tab');
            contactTab.classList.remove('active-tab');
        } else if (tabName === 'contact-form') {
            projectInquiryTab.classList.remove('active-tab');
            contactTab.classList.add('active-tab');
        }
        
        // Clear messages
        clearErrors('project');
        clearErrors('contact');
    }
    
    // Validate Project Inquiry Form
    function validateProjectInquiryForm() {
        let valid = true;
        clearErrors('project');
        
        // Project type validation
        const projectNeedsCheckboxes = document.querySelectorAll('input[name="projectNeeds"]:checked');
        if (projectNeedsCheckboxes.length === 0) {
            setError(projectErrors.projectType, 'Please select at least one project type.');
            valid = false;
        }
        
        // Budget validation
        const minVal = Number(minBudgetNumber.value);
        const maxVal = Number(maxBudgetNumber.value);
        if (isNaN(minVal) || isNaN(maxVal) || minVal < budgetConfig.min || maxVal > budgetConfig.max || minVal >= maxVal) {
            setError(projectErrors.budget, 'Please select a valid budget range (min < max).');
            valid = false;
        }
        
        // Date validation
        const startVal = desiredStart.value;
        const endVal = desiredEnd.value;
        if (startVal && endVal) {
            const s = new Date(startVal);
            const e = new Date(endVal);
            if (s > e) {
                setError(projectErrors.start, 'Start date must be before or equal to end date.');
                setError(projectErrors.end, 'End date must be after or equal to start date.');
                valid = false;
            }
        }
        
        // Description validation
        const desc = briefDescription.value ? briefDescription.value.trim() : '';
        if (!desc || desc.length < 20) {
            setError(projectErrors.description, 'Please provide a short description (at least 20 characters).');
            valid = false;
        }
        
        return valid;
    }
    
    // Validate Contact Form
    function validateContactForm() {
        let valid = true;
        clearErrors('contact');
        
        // Name validation
        if (!fullName.value || fullName.value.trim().length < 2) {
            setError(contactErrors.fullName, 'Please enter your full name (2+ characters).');
            valid = false;
        }
        
        // Email validation
        if (!email.value || !isValidEmail(email.value.trim())) {
            setError(contactErrors.email, 'Please enter a valid email address.');
            valid = false;
        }
        
        // Phone validation
        if (!phone.value || !isValidPhone(phone.value.trim())) {
            setError(contactErrors.phone, 'Please enter a valid phone number (7+ digits).');
            valid = false;
        }
        
        // Message validation
        const msg = message.value ? message.value.trim() : '';
        if (!msg || msg.length < 10) {
            setError(contactErrors.message, 'Please enter a message (at least 10 characters).');
            valid = false;
        }
        
        return valid;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Tab switching
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.dataset.tab);
            });
        });
        
        // Budget slider events
        minBudgetRange.addEventListener('input', syncMinFromRange);
        maxBudgetRange.addEventListener('input', syncMaxFromRange);
        minBudgetNumber.addEventListener('change', syncMinFromNumber);
        maxBudgetNumber.addEventListener('change', syncMaxFromNumber);
        
        // Project Inquiry Form submission
        projectInquiryForm.addEventListener('submit', (ev) => {
            ev.preventDefault();
            
            if (validateProjectInquiryForm()) {
                // Collect form data
                const projectNeedsCheckboxes = document.querySelectorAll('input[name="projectNeeds"]:checked');
                const projectNeeds = Array.from(projectNeedsCheckboxes).map(cb => cb.value);
                const minVal = Number(minBudgetNumber.value);
                const maxVal = Number(maxBudgetNumber.value);
                const desc = briefDescription.value.trim();
                
                const payload = {
                    projectNeeds: projectNeeds,
                    minBudget: minVal,
                    maxBudget: maxVal,
                    desiredStart: desiredStart.value || null,
                    desiredEnd: desiredEnd.value || null,
                    briefDescription: desc,
                    submittedAt: new Date().toISOString()
                };
                
                console.log('Project Inquiry submitted:', payload);
                
                // Show success message
                projectFormMessage.innerHTML = '<div class="success">Project inquiry submitted successfully!</div>';
                
                // Show success modal
                showSuccessModal('Project Inquiry Submitted', 'Thank you for your project inquiry. We will review your request and contact you within 2–3 business days.');
                
                // Reset form
                resetProjectInquiryForm();
            } else {
                projectFormMessage.innerHTML = '<div class="error">Please fix the highlighted fields.</div>';
            }
        });
        
        // Contact Form submission
        contactForm.addEventListener('submit', (ev) => {
            ev.preventDefault();
            
            if (validateContactForm()) {
                // Collect form data
                const payload = {
                    fullName: fullName.value.trim(),
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    company: company.value.trim() || null,
                    message: message.value.trim(),
                    submittedAt: new Date().toISOString()
                };
                
                console.log('Contact form submitted:', payload);
                
                // Show success message
                contactFormMessage.innerHTML = '<div class="success">Contact message submitted successfully!</div>';
                
                // Show success modal
                showSuccessModal('Message Sent', 'Thank you for contacting us. We will get back to you as soon as possible.');
                
                // Reset form
                resetContactForm();
            } else {
                contactFormMessage.innerHTML = '<div class="error">Please fix the highlighted fields.</div>';
            }
        });
        
        // Reset buttons
        projectResetBtn.addEventListener('click', resetProjectInquiryForm);
        contactResetBtn.addEventListener('click', resetContactForm);
        
        // Modal events
        closeModalBtn.addEventListener('click', hideSuccessModal);
        
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) hideSuccessModal();
        });
    }
    
    // Reset Project Inquiry Form
    function resetProjectInquiryForm() {
        // Reset checkboxes
        document.querySelectorAll('input[name="projectNeeds"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset budget slider
        minBudgetRange.value = defaultMin;
        maxBudgetRange.value = defaultMax;
        minBudgetNumber.value = defaultMin;
        maxBudgetNumber.value = defaultMax;
        updateBudgetPreview();
        
        // Reset other fields
        desiredStart.value = '';
        desiredEnd.value = '';
        briefDescription.value = '';
        
        clearErrors('project');
    }
    
    // Reset Contact Form
    function resetContactForm() {
        fullName.value = '';
        email.value = '';
        phone.value = '';
        company.value = '';
        message.value = '';
        
        clearErrors('contact');
    }
    
    // Initialize the form
    init();
});