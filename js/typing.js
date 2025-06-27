export function setupTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    const words = ['Hi, I\'m Jaume Vidal', 'Welcome to my portfolio', 'I\'m a Data Engineer', 'I Build Solutions'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const textContent = document.createElement('span');
    textContent.style.position = 'relative';
    typingText.appendChild(textContent);

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textContent.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textContent.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}
