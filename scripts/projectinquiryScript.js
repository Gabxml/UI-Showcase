document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const form = document.getElementById('projectInquiryForm');
    const submitBtn = document.getElementById('submitInquiry');
    const resetBtn = document.getElementById('resetInquiry');
    const formMessage = document.getElementById('formMessage');

    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const projectType = document.getElementById('projectType');

    const minBudgetRange = document.getElementById('minBudgetRange');
    const maxBudgetRange = document.getElementById('maxBudgetRange');
    const minBudgetNumber = document.getElementById('minBudgetNumber');
    const maxBudgetNumber = document.getElementById('maxBudgetNumber');
    const budgetPreview = document.getElementById('budgetPreview');

    const desiredStart = document.getElementById('desiredStart');
    const desiredEnd = document.getElementById('desiredEnd');
    const briefDescription = document.getElementById('briefDescription');

    // Modal elements
    const inquiryModal = document.getElementById('inquirySentModal');
    const closeInquiryModal = document.getElementById('closeInquiryModal');

    // Error nodes
    const err = {
        fullName: document.getElementById('errorFullName'),
        email: document.getElementById('errorEmail'),
        phone: document.getElementById('errorPhone'),
        projectType: document.getElementById('errorProjectType'),
        budget: document.getElementById('errorBudget'),
        start: document.getElementById('errorStart'),
        end: document.getElementById('errorEnd'),
        description: document.getElementById('errorDescription')
    };

    // Budget config & defaults
    const budgetConfig = { min: 0, max: 1000000, step: 1000 };
    const defaultMin = 50000;
    const defaultMax = 200000;

    // Initialize ranges & numbers
    [minBudgetRange, maxBudgetRange].forEach(r => {
        r.min = budgetConfig.min;
        r.max = budgetConfig.max;
        r.step = budgetConfig.step;
    });

    minBudgetRange.value = defaultMin;
    maxBudgetRange.value = defaultMax;
    minBudgetNumber.value = defaultMin;
    maxBudgetNumber.value = defaultMax;

    function formatCurrency(n) {
        const v = Number(n) || 0;
        return '₱' + v.toLocaleString('en-PH');
    }

    function clamp(v, a, b) {
        return Math.min(Math.max(Number(v), Number(a)), Number(b));
    }

    function updateBudgetPreview() {
        const minVal = Number(minBudgetRange.value);
        const maxVal = Number(maxBudgetRange.value);
        budgetPreview.textContent = `${formatCurrency(minVal)} — ${formatCurrency(maxVal)}`;
    }

    // Sync functions (ensure min < max)
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

    minBudgetRange.addEventListener('input', syncMinFromRange);
    maxBudgetRange.addEventListener('input', syncMaxFromRange);
    minBudgetNumber.addEventListener('change', syncMinFromNumber);
    maxBudgetNumber.addEventListener('change', syncMaxFromNumber);
    updateBudgetPreview();

    // Validation helpers
    function clearErrors() {
        Object.values(err).forEach(n => { if (n) n.textContent = ''; });
        formMessage.innerHTML = '';
    }

    function setError(node, message) {
        if (node) node.textContent = message;
    }

    function isValidEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    function isValidPhone(v) {
        const digits = v.replace(/[^\d]/g, '');
        return digits.length >= 7;
    }

    // Show/Hide Inquiry modal (manipulate style directly for reliability)
    function showInquiryModal() {
        inquiryModal.style.display = 'flex';
        // move focus to OK button for accessibility
        closeInquiryModal.focus();
    }
    function hideInquiryModal() {
        inquiryModal.style.display = 'none';
        submitBtn.focus();
    }

    closeInquiryModal.addEventListener('click', () => {
        hideInquiryModal();
    });

    // close modal by clicking overlay (click outside content)
    inquiryModal.addEventListener('click', (e) => {
        if (e.target === inquiryModal) hideInquiryModal();
    });

    // Form submit
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        clearErrors();

        let valid = true;

        // name
        if (!fullName.value || fullName.value.trim().length < 2) {
            setError(err.fullName, 'Please enter your full name (2+ characters).');
            valid = false;
        }

        // email
        if (!email.value || !isValidEmail(email.value.trim())) {
            setError(err.email, 'Please enter a valid email address.');
            valid = false;
        }

        // phone
        if (!phone.value || !isValidPhone(phone.value.trim())) {
            setError(err.phone, 'Please enter a valid phone number (7+ digits).');
            valid = false;
        }

        // project type
        if (!projectType.value) {
            setError(err.projectType, 'Please select the project type.');
            valid = false;
        }

        // budget
        const minVal = Number(minBudgetNumber.value);
        const maxVal = Number(maxBudgetNumber.value);
        if (isNaN(minVal) || isNaN(maxVal) || minVal < budgetConfig.min || maxVal > budgetConfig.max || minVal >= maxVal) {
            setError(err.budget, 'Please select a valid budget range (min < max).');
            valid = false;
        }

        // dates
        const startVal = desiredStart.value;
        const endVal = desiredEnd.value;
        if (startVal && endVal) {
            const s = new Date(startVal);
            const e = new Date(endVal);
            if (s > e) {
                setError(err.start, 'Start date must be before or equal to end date.');
                setError(err.end, 'End date must be after or equal to start date.');
                valid = false;
            }
        }

        // description
        const desc = briefDescription.value ? briefDescription.value.trim() : '';
        if (!desc || desc.length < 20) {
            setError(err.description, 'Please provide a short description (at least 20 characters).');
            valid = false;
        }

        if (!valid) {
            formMessage.innerHTML = '<div class="error">Please fix the highlighted fields.</div>';
            return;
        }

        // build payload (replace with fetch to your server as needed)
        const payload = {
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            projectType: projectType.value,
            minBudget: minVal,
            maxBudget: maxVal,
            desiredStart: startVal || null,
            desiredEnd: endVal || null,
            briefDescription: desc,
            submittedAt: new Date().toISOString()
        };

        console.log('Project inquiry payload:', payload);

        // Show Inquiry Sent modal (formal popup with OK)
        showInquiryModal();

        // Reset form
        form.reset();
        minBudgetRange.value = defaultMin;
        maxBudgetRange.value = defaultMax;
        minBudgetNumber.value = defaultMin;
        maxBudgetNumber.value = defaultMax;
        updateBudgetPreview();
    });

    // Reset button behavior
    resetBtn.addEventListener('click', () => {
        form.reset();
        minBudgetRange.value = defaultMin;
        maxBudgetRange.value = defaultMax;
        minBudgetNumber.value = defaultMin;
        maxBudgetNumber.value = defaultMax;
        updateBudgetPreview();
        clearErrors();
    });
});
