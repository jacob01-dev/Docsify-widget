(function () {
  const scriptTag = document.currentScript;
  const botID = scriptTag.id.replace(/\s/g, "");
  const SCOPE_PREFIX = "chat-widget-";
  const buttonColor = scriptTag.getAttribute('data-color') || 'rgb(91, 76, 254)'; // Default color if not specified
  
  const style = document.createElement("style");
  style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
      .${SCOPE_PREFIX}chat-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        height: 5rem;
        width: 5.1rem;
        padding: 0px;
        background-color: ${buttonColor};
        box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 10px;
        z-index: 199;
        border: none;
        cursor: pointer;
        border-radius: 10px;
        font-family: 'Inter', sans-serif;
        transition: transform 0.2s ease-in-out;
      }
      .${SCOPE_PREFIX}chat-button:active {
        transform: scale(0.95);
      }
      .${SCOPE_PREFIX}button-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
      .${SCOPE_PREFIX}logo-wrapper {
        width: 2rem;
        height: 2rem;
        margin-bottom: 4px;
      }
      .${SCOPE_PREFIX}logo {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .${SCOPE_PREFIX}button-text {
        color: white;
        font-size: 13.5px;
        font-weight: 500;
        text-shadow: rgba(0, 0, 0, 0.2) 1px 1px 2px;
      }
      .${SCOPE_PREFIX}chat-window {
        position: fixed;
        bottom: 110px;
        right: 20px;
        width: 85vw;
        max-width: 400px;
        height: 70vh;
        max-height: calc(100vh - 120px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        z-index: 999999998;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.95);
      }
      .${SCOPE_PREFIX}chat-window.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }
    `;
  document.head.appendChild(style);
  const chatButton = document.createElement("button");
  chatButton.setAttribute("id", `${SCOPE_PREFIX}chat-bubble-button`);
  chatButton.className = `${SCOPE_PREFIX}chat-button`;
  chatButton.innerHTML = `
      <div class="${SCOPE_PREFIX}button-inner">
        <div class="${SCOPE_PREFIX}logo-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="color: white;">
            <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
          </svg>
        </div>
        <div class="${SCOPE_PREFIX}button-text">Need Help</div>
      </div>
    `;
  const chat = document.createElement("div");
  chat.setAttribute("id", `${SCOPE_PREFIX}chat-bubble-window`);
  chat.className = `${SCOPE_PREFIX}chat-window`;
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.docsify.tech/chat/${botID}`;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.overflow = "hidden";
  iframe.sandbox = "allow-same-origin allow-scripts allow-popups allow-forms";
  chat.appendChild(iframe);
  document.body.appendChild(chatButton);
  document.body.appendChild(chat);
  let isOpen = false;

  function openChat() {
    isOpen = true;
    chat.classList.add('open');
  }

  function closeChat() {
    isOpen = false;
    chat.classList.remove('open');
  }

  chatButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  });

  document.addEventListener("click", (e) => {
    if (isOpen && !chat.contains(e.target) && e.target !== chatButton) {
      closeChat();
    }
  });

  // Prevent clicks inside the iframe from closing the chat
  chat.addEventListener("click", (e) => {
    e.stopPropagation();
  });
})();