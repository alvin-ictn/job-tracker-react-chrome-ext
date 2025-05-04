export function addAppliedBadge() {
    if (document.querySelector("#job-tracker-applied-banner")) return;

    const banner = document.createElement("div");
    banner.id = "job-tracker-applied-banner";
    banner.textContent = "✅ You have already applied for this job";
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: green;
        color: white;
        text-align: center;
        padding: 10px;
        font-size: 16px;
        z-index: 9999;
    `;

    document.body.appendChild(banner);
}
