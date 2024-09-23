(function () {
  const scriptTag = document.currentScript;
  const botID = scriptTag.id.replace(/\s/g, "");
  const bubbleColor = scriptTag.getAttribute('data-color') || "royalblue"; // Default color if not specified

  const SIZE = 60;
  const BTN_RAD = SIZE / 2;

  const chatButtonLogo = `
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white" stroke-width="1" stroke="white">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
</svg>
`;

  const chevronDownLogo = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up">
    <path d="m18 15-6-6-6 6"/>
  </svg>
`;

  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 ${bubbleColor}B3; }
    70% { box-shadow: 0 0 0 10px ${bubbleColor}00; }
    100% { box-shadow: 0 0 0 0 ${bubbleColor}00; }
  }

  @keyframes pullUp {
    from { transform: translate(20%, 20%) scale(0.8); opacity: 0; }
    to { transform: translate(0, 0) scale(1); opacity: 1; }
  }

  @keyframes pushDown {
    from { transform: translate(0, 0) scale(1); opacity: 1; }
    to { transform: translate(20%, 20%) scale(0.8); opacity: 0; }
  }

  @keyframes rotateIcon {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(180deg); }
  }

  @keyframes rotateIconReverse {
    0% { transform: rotate(180deg); }
    100% { transform: rotate(0deg); }
  }

  .chat-button-animate {
    animation: pulse 2s infinite;
  }

  .chat-window-open {
    animation: pullUp 0.25s ease-out forwards;
  }

  .chat-window-close {
    animation: pushDown 0.25s ease-in forwards;
  }

  .icon-rotate {
    animation: rotateIcon 0.3s ease-in-out forwards;
  }

  .icon-rotate-reverse {
    animation: rotateIconReverse 0.3s ease-in-out forwards;
  }
`;
  document.head.appendChild(style);

  const chatButton = document.createElement("div");
  chatButton.setAttribute("id", "chat-bubble-button");
  chatButton.style.position = "fixed";
  chatButton.style.bottom = "20px";
  chatButton.style.right = "20px";
  chatButton.style.width = SIZE + "px";
  chatButton.style.height = SIZE + "px";
  chatButton.style.borderRadius = BTN_RAD + "px";
  chatButton.style.backgroundColor = bubbleColor;
  chatButton.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
  chatButton.style.cursor = "pointer";
  chatButton.style.zIndex = 999999999;
  chatButton.style.transition = "all 0.3s ease-in-out";
  chatButton.classList.add("chat-button-animate");

  const chatButtonIcon = document.createElement("div");
  chatButtonIcon.style.display = "flex";
  chatButtonIcon.style.alignItems = "center";
  chatButtonIcon.style.justifyContent = "center";
  chatButtonIcon.style.width = "100%";
  chatButtonIcon.style.height = "100%";
  chatButtonIcon.style.zIndex = 999999999;
  chatButtonIcon.innerHTML = chatButtonLogo;
  chatButton.appendChild(chatButtonIcon);

  const chat = document.createElement("div");
  chat.setAttribute("id", "chat-bubble-window");
  chat.style.position = "fixed";
  chat.style.bottom = "100px";
  chat.style.right = "20px";
  chat.style.width = "85vw";
  chat.style.maxWidth = "400px";
  chat.style.height = "70vh";
  chat.style.maxHeight = "600px";
  chat.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
  chat.style.borderRadius = "10px";
  chat.style.zIndex = 999999998;
  chat.style.overflow = "hidden";
  chat.style.transition = "all 0.3s ease-in-out";
  chat.style.opacity = "0";
  chat.style.visibility = "hidden";
  chat.style.display = "none";

  console.log(botID);
  const iframe = document.createElement("iframe");
  iframe.src = `http://localhost:3000/chat/${botID}`;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.overflow = "hidden";
  iframe.sandbox = "allow-same-origin allow-scripts allow-popups allow-forms";
  chat.appendChild(iframe);

  document.body.appendChild(chatButton);
  document.body.appendChild(chat);

  let isOpen = false;
  let isAnimating = false;

  chatButton.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    isOpen = !isOpen;

    if (isOpen) {
      chatButtonIcon.classList.remove("icon-rotate-reverse");
      chatButtonIcon.classList.add("icon-rotate");
      chat.style.display = "block";
      chat.style.opacity = "1";
      chat.style.visibility = "visible";
      chat.classList.remove("chat-window-close");
      chat.classList.add("chat-window-open");
      chatButton.style.bottom = "30px"; // Move button down when chat is open

      setTimeout(() => {
        chatButtonIcon.innerHTML = chevronDownLogo;
      }, 150);
    } else {
      chatButtonIcon.classList.remove("icon-rotate");
      chatButtonIcon.classList.add("icon-rotate-reverse");
      chat.classList.remove("chat-window-open");
      chat.classList.add("chat-window-close");
      chatButton.style.bottom = "20px"; // Return button to original position

      setTimeout(() => {
        chatButtonIcon.innerHTML = chatButtonLogo;
      }, 150);

      setTimeout(() => {
        chat.style.display = "none";
        chat.style.opacity = "0";
        chat.style.visibility = "hidden";
      }, 250);
    }

    setTimeout(() => {
      isAnimating = false;
    }, 300);
  });
})();