export function addAppliedBadge() {
  if (document.querySelector("#job-tracker-applied-banner")) return;

  const banner = document.createElement("div");
  banner.id = "job-tracker-applied-banner";
  banner.textContent = "Tracked\nby JobTracker";
  banner.style.cssText = `
    white-space: pre-line;
    position: fixed;
    padding: 5px 100px;
    min-width: 300px;
    transform: rotate(45deg) translate(37%, 0);
    color: white;
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    top: -91px;
    box-sizing: border-box;
    z-index: 1999;
    right: -44px;
    height: 73px;
    display: flex;
    justify-content: flex-end;
    align-items: end;
    background-color: green;
    `;

  document.body.appendChild(banner);
}
