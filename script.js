// Tab functionality
const tabs = document.querySelectorAll('[role="tab"]');
const tabPanels = document.querySelectorAll('[role="tabpanel"]');

tabs.forEach(tab => {
    tab.addEventListener('click', handleTabClick);
    tab.addEventListener('keydown', handleTabKeyDown);
});

function handleTabClick(event) {
    const clickedTab = event.target;
    switchTab(clickedTab);
}

function handleTabKeyDown(event) {
    const currentTab = event.target;
    const tabList = currentTab.parentNode;
    const tabsArray = Array.from(tabList.children);
    const currentIndex = tabsArray.indexOf(currentTab);
    let newIndex;

    switch (event.key) {
        case 'ArrowLeft':
            newIndex = currentIndex > 0 ? currentIndex - 1 : tabsArray.length - 1;
            break;
        case 'ArrowRight':
            newIndex = currentIndex < tabsArray.length - 1 ? currentIndex + 1 : 0;
            break;
        case 'Home':
            newIndex = 0;
            break;
        case 'End':
            newIndex = tabsArray.length - 1;
            break;
        case 'Enter':
        case 'Space':
            switchTab(currentTab);
            break;
        default:
            return;
    }

    if (newIndex !== undefined) {
        tabsArray[newIndex].focus();
    }
}

function switchTab(selectedTab) {
    tabs.forEach(tab => {
        tab.setAttribute('aria-selected', tab === selectedTab);
    });

    tabPanels.forEach(panel => {
        panel.setAttribute('hidden', !panel.getAttribute('aria-labelledby') === selectedTab.id);
    });

    const targetPanelId = selectedTab.getAttribute('aria-controls');
    const targetPanel = document.getElementById(targetPanelId);
    if (targetPanel) {
        targetPanel.removeAttribute('hidden');
    }
}

// Accordion functionality within tabs
const accordionButtons = document.querySelectorAll('.accordion-button');

accordionButtons.forEach(button => {
    button.addEventListener('click', toggleAccordion);
});

function toggleAccordion() {
    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
    const panelId = this.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    panel.hidden = expanded;
}

// Functionality to display articles based on accordion clicks
const accordionSubjectButtons = document.querySelectorAll('.accordion-panel button');
const articleContainers = {
    'html-panel': document.getElementById('html-article-content'),
    'css-panel': document.getElementById('css-article-content'),
    'js-panel': document.getElementById('js-article-content'),
    'aria-panel': document.getElementById('aria-article-content'),
};

accordionSubjectButtons.forEach(button => {
    button.addEventListener('click', displayArticle);
});

async function displayArticle(event) {
    const articleId = event.target.dataset.article;
    const tabPanel = event.target.closest('[role="tabpanel"]');
    const container = articleContainers[tabPanel.id];

    try {
        const response = await fetch('data/articles.json'); // Path to your JSON file
        const articles = await response.json();

        if (articles[articleId] && container) {
            container.innerHTML = `<h3>${articles[articleId].title}</h3>${articles[articleId].content}`;
        } else if (container) {
            container.innerHTML = '<p>Article not found.</p>';
        }
    } catch (error) {
        console.error("Error fetching articles:", error);
        if (container) {
            container.innerHTML = '<p>Failed to load article.</p>';
        }
    }
}

// Disclosure functionality
const disclosureButtons = document.querySelectorAll('.disclosure-button');

disclosureButtons.forEach(button => {
    button.addEventListener('click', toggleDisclosure);
});

function toggleDisclosure() {
    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
    const controlsId = this.getAttribute('aria-controls');
    const controlledElement = document.getElementById(controlsId);
    controlledElement.hidden = expanded;
}
