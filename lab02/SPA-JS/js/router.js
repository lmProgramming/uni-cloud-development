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
      <form
        id="contact-form"
      >
        <div class="alert alert-success" style="display: none">
          <p>
            <strong>Success!</strong> Your request has been sent! We will get
            back to you as soon as possible.
          </p>
        </div>

        <div class="alert alert-danger" style="display: none">
          <p>
            <strong>Failed!</strong> Your form has not been sent, please make
            sure all required fields are filled in.
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

    console.log('Contact form loaded!');

    grecaptcha.render('recaptcha', {
        'sitekey': '6LdcQg0rAAAAAEciRtr35TJA-q2CRoVBopEIDthL'
    });

    $(function () {
        $('#contact-form').off('submit').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);

            form.find('.alert-danger').hide();

            console.log('Form submitted!');

            function showError() {
                form.find('.alert-danger').fadeIn();
            }

            if (grecaptcha.getResponse() == "") {
                showError();
                return false;
            }

            alert('Form submitted!');
        });
    });
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