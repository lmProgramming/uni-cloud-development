let pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact',
    gallery: '/index.html?gallery'
};

function OnStartUp() {
    popStateHandler();
}

OnStartUp();

document.querySelector('#about-link').addEventListener('click', (event) => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

document.querySelector('#gallery-link').addEventListener('click', (event) => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

document.querySelector('#contact-link').addEventListener('click', (event) => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />       
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />        
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1 class="title">Gallery</h1>
        <div class="grid3x3" id="gallery-container"></div>
        <div id="modal" class="modal hidden">
            <span id="close-modal" class="close">&times;</span>
            <img id="modal-image" class="modal-content" />
        </div>
    `;

    const galleryContainer = document.getElementById('gallery-container');
    const images = Array.from({ length: 9 }, (_, i) => `images/${i + 1}.png`);

    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.dataset.src = src;
        img.alt = `Image ${index + 1}`;
        img.classList.add('thumbnail');
        galleryContainer.appendChild(img);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.onload = () => img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.thumbnail').forEach((img) => observer.observe(img));

    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');

    galleryContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            modalImage.src = event.target.src;
            modal.classList.remove('hidden');
        }
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">About Me</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">Contact with me</h1>
      <form id="contact-form">
        <div class="alert alert-success" style="display: none;">
          <p>
            <strong>Success!</strong> Your request has been sent! We will get
            back to you as soon as possible.
          </p>
        </div>
        <div class="alert alert-danger" style="display: none;">
          <p>
            <strong>Failed!</strong> Your form has not been sent, please make
            sure all required fields are filled in, including reCAPTCHA.
          </p>
        </div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required />
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        <div class="form-item">
            <div id="recaptcha"></div>
        </div>
        <button type="submit">Send</button>
      </form>
    `;

    console.log('Contact form loaded, rendering reCAPTCHA...');

    const recaptchaContainer = document.getElementById('recaptcha');
    if (recaptchaContainer) {
        try {
            grecaptcha.render('recaptcha', {
                'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
            });
            console.log('reCAPTCHA rendered.');
        } catch (error) {
            console.error("Error rendering reCAPTCHA:", error);
            recaptchaContainer.innerHTML = "reCAPTCHA failed to load.";
        }
    } else {
        console.error("reCAPTCHA container not found");
    }

    const formElement = document.getElementById('contact-form');
    const errorAlert = formElement.querySelector('.alert-danger');
    const successAlert = formElement.querySelector('.alert-success');

    if (formElement) {
        formElement.addEventListener('submit', function (event) {
            event.preventDefault();

            console.log('Form submit event triggered');
            errorAlert.style.display = 'none';
            successAlert.style.display = 'none';

            const nameInput = formElement.querySelector('#name');
            const emailInput = formElement.querySelector('#email');
            const messageInput = formElement.querySelector('#message');

            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                console.log('Standard field validation failed');
                errorAlert.querySelector('p').textContent = 'Failed! Please fill in all required fields (Name, Email, Message).';
                errorAlert.style.display = 'block';
                return;
            }

            let recaptchaResponse = '';
            try {
                recaptchaResponse = grecaptcha.getResponse();
                console.log('reCAPTCHA response:', recaptchaResponse);
            } catch (error) {
                console.error("Error getting reCAPTCHA response:", error);
                errorAlert.querySelector('p').textContent = 'Failed! Error checking reCAPTCHA.';
                errorAlert.style.display = 'block';
                return;
            }

            if (recaptchaResponse === "") {
                console.log('reCAPTCHA validation failed (empty response)');
                errorAlert.querySelector('p').textContent = 'Failed! Please complete the reCAPTCHA verification.';
                errorAlert.style.display = 'block';
                return;
            }

            console.log('Form and reCAPTCHA valid. Simulating submission...');
            alert('Form submitted successfully! (Simulated with VanillaJS)');
            successAlert.style.display = 'block';
            formElement.reset();
            try {
                grecaptcha.reset();
                console.log('reCAPTCHA reset.');
            } catch (error) {
                console.error("Error resetting reCAPTCHA:", error);
            }
        });
        console.log('Submit event listener added to form (VanillaJS).');
    } else {
        console.error('Contact form element not found after rendering.');
    }
}

function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];
    if (loc === pageUrls.contact) { RenderContactPage(); }
    if (loc === pageUrls.gallery) { RenderGalleryPage(); }
    if (loc === pageUrls.about) { RenderAboutPage(); }
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
})

window.onpopstate = popStateHandler;