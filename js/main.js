function openTab(evt, tabName) {
    if(evt) evt.preventDefault();

    let tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(content => {
        content.classList.remove("active");
        content.style.display = "none";
    });

    let tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.classList.remove("active");
    });

    const selectedTab = document.getElementById(tabName);
    if(selectedTab) {
        selectedTab.classList.add("active");
        selectedTab.style.display = "block";
    }

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }
}