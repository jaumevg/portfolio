export function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
    initFormValidation(form);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const button = form.querySelector('button');
    const originalText = button.textContent;
    const inputs = form.querySelectorAll('input, textarea');
    
    setFormState(form, true, 'Sending...');
    
    try {
        // Add your form submission logic here
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        button.textContent = 'Message Sent!';
        button.style.backgroundColor = '#4CAF50';
        form.reset();
        
        setTimeout(() => {
            setFormState(form, false, originalText);
            button.style.backgroundColor = '';
        }, 3000);
        
    } catch (error) {
        button.textContent = 'Error! Try Again';
        button.style.backgroundColor = '#f44336';
        
        setTimeout(() => {
            setFormState(form, false, originalText);
            button.style.backgroundColor = '';
        }, 3000);
    }
}

function setFormState(form, disabled, buttonText) {
    const button = form.querySelector('button');
    const inputs = form.querySelectorAll('input, textarea');
    
    button.textContent = buttonText;
    button.disabled = disabled;
    inputs.forEach(input => input.disabled = disabled);
}

function initFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.checkValidity()) {
                input.classList.remove('invalid');
                input.classList.add('valid');
            } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
            }
        });
    });
}
