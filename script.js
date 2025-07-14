// DOM Elements
const loader = document.querySelector('.loader');
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.nav');
const authLink = document.getElementById('auth-link');
const tabButtons = document.querySelectorAll('.tab-btn');
const plansContainer = document.querySelector('.plans-container');
const header = document.querySelector('.header');

// Data Plans for different networks
const dataPlans = {
    mtn: [
        { name: "MTN SME", price: "₦290", validity: "30 Days", data: "1GB", id: "mtn-sme-1" },
        { name: "MTN Corporate", price: "₦500", validity: "30 Days", data: "2GB", id: "mtn-corp-2" },
        { name: "MTN Direct", price: "₦1,000", validity: "30 Days", data: "4.5GB", id: "mtn-direct-4.5" },
        { name: "MTN XtraValue", price: "₦1,500", validity: "30 Days", data: "6GB", id: "mtn-xtra-6" },
        { name: "MTN Mega", price: "₦2,500", validity: "30 Days", data: "10GB", id: "mtn-mega-10" },
        { name: "MTN Giga", price: "₦5,000", validity: "30 Days", data: "20GB", id: "mtn-giga-20" }
    ],
    glo: [
        { name: "GLO Lite", price: "₦250", validity: "30 Days", data: "1GB", id: "glo-lite-1" },
        { name: "GLO Value", price: "₦500", validity: "30 Days", data: "2.5GB", id: "glo-value-2.5" },
        { name: "GLO Plus", price: "₦1,000", validity: "30 Days", data: "5.8GB", id: "glo-plus-5.8" },
        { name: "GLO Max", price: "₦2,000", validity: "30 Days", data: "10GB", id: "glo-max-10" },
        { name: "GLO Ultra", price: "₦4,000", validity: "30 Days", data: "20GB", id: "glo-ultra-20" },
        { name: "GLO Infinite", price: "₦8,000", validity: "30 Days", data: "50GB", id: "glo-infinite-50" }
    ],
    airtel: [
        { name: "Airtel Smart", price: "₦300", validity: "30 Days", data: "1.5GB", id: "airtel-smart-1.5" },
        { name: "Airtel Value", price: "₦500", validity: "30 Days", data: "2GB", id: "airtel-value-2" },
        { name: "Airtel Plus", price: "₦1,000", validity: "30 Days", data: "4.5GB", id: "airtel-plus-4.5" },
        { name: "Airtel Max", price: "₦2,000", validity: "30 Days", data: "10GB", id: "airtel-max-10" },
        { name: "Airtel Premium", price: "₦5,000", validity: "30 Days", data: "20GB", id: "airtel-premium-20" },
        { name: "Airtel Unlimited", price: "₦10,000", validity: "30 Days", data: "40GB", id: "airtel-unlimited-40" }
    ],
    "9mobile": [
        { name: "9mobile Lite", price: "₦250", validity: "30 Days", data: "1GB", id: "9mobile-lite-1" },
        { name: "9mobile Value", price: "₦500", validity: "30 Days", data: "2GB", id: "9mobile-value-2" },
        { name: "9mobile Plus", price: "₦1,000", validity: "30 Days", data: "4.5GB", id: "9mobile-plus-4.5" },
        { name: "9mobile Max", price: "₦2,000", validity: "30 Days", data: "10GB", id: "9mobile-max-10" },
        { name: "9mobile Ultra", price: "₦4,000", validity: "30 Days", data: "20GB", id: "9mobile-ultra-20" },
        { name: "9mobile Infinite", price: "₦8,000", validity: "30 Days", data: "40GB", id: "9mobile-infinite-40" }
    ]
};

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        authLink.textContent = 'Dashboard';
        authLink.href = 'dashboard.html';
    } else {
        authLink.textContent = 'Login';
        authLink.href = 'auth.html';
    }
}

// Load plans for a specific network
function loadPlans(network) {
    plansContainer.innerHTML = '';
    const plans = dataPlans[network];
    
    plans.forEach(plan => {
        const planCard = document.createElement('div');
        planCard.className = 'plan-card fade-in';
        planCard.innerHTML = `
            <div class="plan-header">
                <h3 class="plan-name">${plan.name}</h3>
                <p class="plan-price">${plan.price}</p>
            </div>
            <div class="plan-body">
                <ul class="plan-details">
                    <li><span>Data Volume:</span> <span>${plan.data}</span></li>
                    <li><span>Validity:</span> <span>${plan.validity}</span></li>
                    <li><span>Network:</span> <span>${network.toUpperCase()}</span></li>
                </ul>
                <button class="plan-button" data-id="${plan.id}">Buy Now</button>
            </div>
        `;
        plansContainer.appendChild(planCard);
    });
    
    // Add event listeners to buy buttons
    document.querySelectorAll('.plan-button').forEach(button => {
        button.addEventListener('click', function() {
            const planId = this.getAttribute('data-id');
            buyPlan(planId);
        });
    });
}

// Handle plan purchase
function buyPlan(planId) {
    const user = localStorage.getItem('currentUser');
    
    if (!user) {
        // Store intended purchase in localStorage before redirecting to login
        localStorage.setItem('intendedPurchase', planId);
        window.location.href = 'auth.html';
        return;
    }
    
    // Get user data
    const userData = JSON.parse(localStorage.getItem(user));
    
    // Find the plan
    let plan;
    for (const network in dataPlans) {
        plan = dataPlans[network].find(p => p.id === planId);
        if (plan) break;
    }
    
    if (!plan) return;
    
    // Create transaction
    const transaction = {
        id: Date.now(),
        plan: plan.name,
        network: planId.split('-')[0].toUpperCase(),
        amount: plan.price,
        date: new Date().toLocaleString(),
        status: 'Pending'
    };
    
    // Add to user's transactions
    if (!userData.transactions) {
        userData.transactions = [];
    }
    userData.transactions.push(transaction);
    localStorage.setItem(user, JSON.stringify(userData));
    
    // Show confirmation
    alert(`You have successfully purchased ${plan.name} for ${plan.price}. Transaction ID: ${transaction.id}`);
}

// Initialize the page
function init() {
    // Simulate loading
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
    
    // Check authentication status
    checkAuth();
    
    // Load default plans (MTN)
    loadPlans('mtn');
    
    // Mobile menu toggle
    mobileMenu.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenu.querySelector('i').classList.toggle('fa-times');
    });
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadPlans(button.dataset.network);
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Check for intended purchase after login
    const intendedPurchase = localStorage.getItem('intendedPurchase');
    if (intendedPurchase && localStorage.getItem('currentUser')) {
        buyPlan(intendedPurchase);
        localStorage.removeItem('intendedPurchase');
    }
    
    // Track user activity
    trackActivity();
}

// Track user activity and store in cookies
function trackActivity() {
    let visits = parseInt(getCookie('visits')) || 0;
    visits++;
    setCookie('visits', visits, 30);
    
    const lastVisit = getCookie('lastVisit');
    const now = new Date();
    setCookie('lastVisit', now.toString(), 30);
    
    console.log(`User has visited ${visits} times. Last visit: ${lastVisit || 'First visit'}`);
    
    // Track page views
    let pageViews = JSON.parse(localStorage.getItem('pageViews')) || {};
    const currentPage = window.location.pathname.split('/').pop();
    pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
}

// Cookie helper functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
