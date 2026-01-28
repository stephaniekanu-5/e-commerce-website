document.addEventListener("DOMContentLoaded", () => {
  /* ================= SIDEBAR NAV ================= */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mainNav = document.getElementById("mainNav");
  const closeNav = document.getElementById("closeNav");
  const navOverlay = document.getElementById("navOverlay");

  function openNav() {
    mainNav.classList.add("open");
    if (navOverlay) navOverlay.classList.add("show");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    mainNav.setAttribute("aria-hidden", "false");
  }

  function closeNavMenu() {
    mainNav.classList.remove("open");
    if (navOverlay) navOverlay.classList.remove("show");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    mainNav.setAttribute("aria-hidden", "true");
  }

  hamburgerBtn?.addEventListener("click", openNav);
  closeNav?.addEventListener("click", closeNavMenu);
  navOverlay?.addEventListener("click", closeNavMenu);

  /* Close sidebar when a link is clicked */
  mainNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavMenu);
  });

  const sidebarSignIn = document.getElementById("sidebarSignIn");
  const logoutBtn = document.getElementById("logoutBtn");
  const signInSection = document.getElementById("signInSection");
  // const mainNav = document.getElementById("mainNav");

  // 1. Handle Sidebar Log-In Click
  sidebarSignIn?.addEventListener("click", (e) => {
    e.preventDefault(); // Stop the page from jumping to #openSignIn
    
    // Close the sidebar first
    mainNav.classList.remove("open");
    mainNav.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restore scrolling

    // Open the Sign-In Modal
    signInSection.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Lock scrolling for modal
  });

  // 2. Handle Log Out Click
  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Clear user data
    localStorage.removeItem("user");
    
    // Refresh page to reset UI states
    alert("You have been logged out.");
    location.reload();
  });

  // 3. UI Sync (Check if user is logged in on page load)
  const checkLoginState = () => {
    const user = localStorage.getItem("user");
    if (user) {
      // If logged in: hide "Log-In", show "Log Out"
      sidebarSignIn?.classList.add("hidden");
      logoutBtn?.classList.remove("hidden");
    } else {
      // If logged out: show "Log-In", hide "Log Out"
      sidebarSignIn?.classList.remove("hidden");
      logoutBtn?.classList.add("hidden");
    }
  };

  checkLoginState();
});

  /* ================= CART FUNCTIONALITY ================= */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    if (!cartCount) return;
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    cartCount.textContent = totalQty;
  }

  document.querySelectorAll(".cta-btn").forEach((btn) => {
    // If the button is a 'Buy Now' button (contains price logic)
    if (btn.innerText.toLowerCase().includes("buy")) {
      btn.addEventListener("click", (e) => {
        // Only trigger if using data attributes, otherwise let it link to payment
        if (btn.dataset.name) {
          e.preventDefault();
          const name = btn.dataset.name;
          const price = Number(btn.dataset.price);
          const existingItem = cart.find((item) => item.name === name);

          if (existingItem) {
            existingItem.qty += 1;
          } else {
            cart.push({ name, price, qty: 1 });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
          alert("Added to cart 🛒");
        }
      });
    }
  });

  updateCartCount();

  /* ================= AUTHENTICATION (SIGN IN) ================= */
  const user = JSON.parse(localStorage.getItem("user"));
  const openSignIn = document.getElementById("openSignIn");
  const closeSignIn = document.getElementById("closeSignIn");
  const signInSection = document.getElementById("signInSection");
  const signInForm = document.getElementById("signInForm");
  const signInMsg = document.getElementById("signInMsg");

  // Update button if logged in
  if (user && openSignIn) {
    openSignIn.textContent = "👤 Account";
  }

  // Open modal
  openSignIn?.addEventListener("click", () => {
    if (JSON.parse(localStorage.getItem("user"))) {
      // If logged in, maybe redirect to a profile or dashboard
      // window.location.href = "productsDisplay.html"; 
      alert("You are already signed in!");
    } else {
      signInSection?.classList.remove("hidden");
    }
  });

  // Close modal
  closeSignIn?.addEventListener("click", () => {
    signInSection?.classList.add("hidden");
  });

  // Handle Sign In Submit
  signInForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    if (email && password) {
      localStorage.setItem("user", JSON.stringify({ email }));
      signInMsg.textContent = "Signed in successfully ✅";
      signInMsg.style.color = "green";

      setTimeout(() => {
        signInSection.classList.add("hidden");
        location.reload(); // Reload to show "Account" state
      }, 1000);
    }
  });

  /* ================= SIGN UP ================= */
  const signupForm = document.getElementById("signupForm");
  const errorMsg = document.getElementById("errorMsg");

  signupForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (errorMsg) errorMsg.textContent = "";

    if (password.length < 6) {
      if (errorMsg) errorMsg.textContent = "Password must be at least 6 characters";
      return;
    }

    localStorage.setItem("user", JSON.stringify({ name, email }));
    alert("Sign up successful ✅ Welcome " + name);
    signupForm.reset();

    window.location.href = "/productsDisplay.html";
  });

  /* ================= SCROLL REVEAL ================= */
  const reveals = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    reveals.forEach((section) => {
      const windowHeight = window.innerHeight;
      const elementTop = section.getBoundingClientRect().top;
      const elementVisible = 100;

      if (elementTop < windowHeight - elementVisible) {
        section.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Run once on load

  /* ================= FAQ ACCORDION ================= */
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });

  /* ================= COMMENTS ================= */
  const commentForm = document.getElementById("commentForm");
  const commentList = document.getElementById("commentList");
  const commentMsg = document.getElementById("commentMsg");

  function loadComments() {
    if (!commentList) return;
    commentList.innerHTML = "";
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.forEach((comment, index) => {
      const div = document.createElement("div");
      div.className = "comment-item";
      div.innerHTML = `
        <strong>${comment.name}</strong>
        <p>${comment.text}</p>
        <small>${comment.date}</small>
        <br>
        <button class="delete-comment" data-index="${index}" style="color:red; cursor:pointer; background:none; border:none; font-size:0.8rem;">Delete</button>
      `;
      commentList.appendChild(div);
    });
  }

  commentForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("commentName").value.trim();
    const text = document.getElementById("commentText").value.trim();

    if (!name || !text) return;

    const newComment = {
      name,
      text,
      date: new Date().toLocaleString()
    };

    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.unshift(newComment);
    localStorage.setItem("comments", JSON.stringify(comments));
    
    commentForm.reset();
    loadComments();
  });

  // Event Delegation for delete buttons
  commentList?.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-comment")) {
      const index = e.target.dataset.index;
      const comments = JSON.parse(localStorage.getItem("comments")) || [];
      comments.splice(index, 1);
      localStorage.setItem("comments", JSON.stringify(comments));
      loadComments();
    }
  });

  loadComments();

  const cartBtn = document.getElementById("cartBtn");
  const cartModal = document.getElementById("cartModal");
  const closeCart = document.getElementById("closeCart");
  const cartCount = document.getElementById("cartCount");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mainNav = document.getElementById("mainNav");
  const closeNav = document.getElementById("closeNav");

  /* ================= CART LOGIC ================= */
  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCartTable() {
    cartItemsEl.innerHTML = "";
    let grandTotal = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      grandTotal += itemTotal;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="padding:10px 0;">${item.name}</td>
        <td>₦${item.price.toLocaleString()}</td>
        <td>${item.qty}</td>
        <td>₦${itemTotal.toLocaleString()}</td>
        <td><button onclick="removeItem(${index})" style="cursor:pointer; background:none; border:none;">❌</button></td>
      `;
      cartItemsEl.appendChild(row);
    });
    cartTotalEl.textContent = grandTotal.toLocaleString();
  }

  window.removeItem = (index) => {
    cart.splice(index, 1);
    renderCartTable();
    updateCartUI();
  };

  // Add to Cart
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("addCart")) {
      const name = e.target.dataset.name;
      const price = Number(e.target.dataset.price);
      const existing = cart.find(item => item.name === name);
      if (existing) existing.qty += 1; else cart.push({ name, price, qty: 1 });
      updateCartUI();
      alert("Added to cart!");
    }
  });

  /* ================= EVENT LISTENERS ================= */
  cartBtn?.addEventListener("click", () => {
    renderCartTable();
    cartModal.classList.remove("hidden");
  });

  closeCart?.addEventListener("click", () => cartModal.classList.add("hidden"));

  hamburgerBtn?.addEventListener("click", () => {
    mainNav.classList.add("open");
    mainNav.setAttribute("aria-hidden", "false");
  });

  closeNav?.addEventListener("click", () => {
    mainNav.classList.remove("open");
    mainNav.setAttribute("aria-hidden", "true");
  });

  checkoutBtn?.addEventListener("click", () => {
    if(cart.length === 0) return alert("Cart is empty!");
    window.location.href = "payment.html";
  });

  // Initialize
  updateCartUI();


    const authOverlay = document.getElementById("authOverlay");
    const openAuthBtns = document.querySelectorAll("#sidebarSignIn, #openSignIn"); // Targets both buttons
    const closeAuth = document.getElementById("closeAuth");
  

    // FUNCTION: Open Overlay
    const openModal = () => {
        authOverlay.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Disable scroll
        // Close sidebar if it's open
        if (mainNav) mainNav.classList.remove("open");
    };

    // FUNCTION: Close Overlay
    const closeModal = () => {
        authOverlay.classList.add("hidden");
        document.body.style.overflow = ""; // Enable scroll
    };

    // Event Listeners
    openAuthBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeAuth?.addEventListener("click", closeModal);

    // Close on click outside the white box
    authOverlay?.addEventListener("click", (e) => {
        if (e.target === authOverlay) closeModal();
    });

document.addEventListener("DOMContentLoaded", () => {
  const authSplash = document.getElementById("authSplash");
  const landingPageMain = document.getElementById("landingPageMain");
  
  // Forms
  const loginForm = document.getElementById("splashLoginForm");
  const signupForm = document.getElementById("splashSignupForm");
  
  // Toggles
  const btnLogin = document.getElementById("toggleLogin");
  const btnSignup = document.getElementById("toggleSignup");

  // Check login state on load: if user exists, show main page immediately
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    authSplash.style.display = "none";
    landingPageMain.style.display = "block";
  }

  // Handle Tab Switching (Login/Signup)
  btnSignup.onclick = () => {
    btnLogin.classList.remove("active-tab");
    btnSignup.classList.add("active-tab");
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
  };

  btnLogin.onclick = () => {
    btnSignup.classList.remove("active-tab");
    btnLogin.classList.add("active-tab");
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  };

  // Function to 'Enter' the site after successful auth
  const enterSite = (email) => {
    localStorage.setItem("user", JSON.stringify({ email }));
    // Smooth transition
    authSplash.style.opacity = "0";
    authSplash.style.transition = "opacity 0.5s ease";
    
    setTimeout(() => {
      authSplash.style.display = "none";
      landingPageMain.style.display = "block";
    }, 500);
  };

  // Login Form Submit
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    enterSite(document.getElementById("splashEmail").value);
  };

  // Sign Up Form Submit (This is the required success action)
  signupForm.onsubmit = (e) => {
    e.preventDefault();
    // Simulate successful sign-up
    enterSite(document.getElementById("splashRegEmail").value);
  };
});

