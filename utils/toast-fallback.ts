// Fallback toast implementation when sonner is not installed
// This allows the app to run without sonner until packages are installed

function createNotification(message: string, type: "success" | "error" | "info" = "info") {
    if (typeof window === "undefined") {
        console.log(`[${type.toUpperCase()}]`, message);
        return;
    }

    const colors = {
        success: { bg: "#10b981", text: "white" },
        error: { bg: "#ef4444", text: "white" },
        info: { bg: "#3b82f6", text: "white" },
    };

    const color = colors[type];
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.bg};
        color: ${color.text};
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    if (!document.head.querySelector("style[data-toast-animation]")) {
        style.setAttribute("data-toast-animation", "true");
        document.head.appendChild(style);
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = "slideIn 0.3s ease-out reverse";
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

export const toast = {
    success: (message: string, options?: any) => {
        createNotification(message, "success");
    },
    error: (message: string, options?: any) => {
        createNotification(message, "error");
    },
    info: (message: string, options?: any) => {
        createNotification(message, "info");
    },
};

