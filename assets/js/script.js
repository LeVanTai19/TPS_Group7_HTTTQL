/* Xử lý thanh tìm kiếm xe theo từ khóa */

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const cards = document.querySelectorAll("#vehicleList .col");

  searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    cards.forEach(card => {
      const title = card.querySelector(".card-title").innerText.toLowerCase();
      card.style.display = title.includes(keyword) ? "block" : "none";
    });
  });
});

/* Xử lý đăng ký lưu vào localstore kết hợp 2 tk có sẵn */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("registerMessage");

  if (form) {
    // Tạo sẵn tài khoản mẫu nếu chưa có
    if (!localStorage.getItem("users")) {
      const demoUsers = [
        { username: "admin", email: "admin@example.com", password: "123456" },
        { username: "user1", email: "user1@example.com", password: "abc123" }
      ];
      localStorage.setItem("users", JSON.stringify(demoUsers));
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        message.textContent = "Mật khẩu xác nhận không khớp.";
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];

      const isDuplicate = users.some(u => u.username === username);
      if (isDuplicate) {
        message.textContent = "Tên đăng nhập đã tồn tại.";
        return;
      }

      users.push({ username, email, password });
      localStorage.setItem("users", JSON.stringify(users));

      message.style.color = "green";
      message.textContent = "Đăng ký thành công! Đang chuyển hướng...";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    });
  }
});

/* Xử lý đăng nhập */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value;
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const matchedUser = users.find(
        user => user.username === username && user.password === password
      );

      if (matchedUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        loginMessage.style.color = "green";
        loginMessage.textContent = "Đăng nhập thành công! Đang chuyển hướng...";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        loginMessage.style.color = "red";
        loginMessage.textContent = "Sai tên đăng nhập hoặc mật khẩu.";
      }
    });
  }
});

/* Xử lý hiện tên người dùng sau khi đăng nhập */
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const userGreeting = document.getElementById("userGreeting");

  if (user && userGreeting) {
    userGreeting.textContent = `Chào, ${user.username}`;
    userGreeting.classList.remove("d-none");
  }
});

/* Xử lý đăng xuất */
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      alert("Bạn đã đăng xuất.");
      window.location.href = "login.html";
    });
  }
});

/* Xử lý click vào card để chuyển sang trang detail.html */
document.addEventListener("DOMContentLoaded", () => {
  const vehicleCards = document.querySelectorAll(".vehicle-card");

  vehicleCards.forEach(card => {
    const rentBtn = card.querySelector(".btn-rent");
    const cartBtn = card.querySelector(".btn-cart");

    card.addEventListener("click", (e) => {
      // Nếu click là button thì không xử lý chuyển trang
      if (e.target === rentBtn || e.target === cartBtn) return;

      const vehicleData = card.getAttribute("data-vehicle");
      if (vehicleData) {
        localStorage.setItem("selectedVehicle", vehicleData);
        window.location.href = "detail.html";
      }
    });
  });
});

// Xử lý sự kiện cho 2 button đặt xe và thêm giỏ hàng ở trang Index.html

document.addEventListener("DOMContentLoaded", () => {
  // Sự kiện click vào nút "Thêm vào giỏ"
  document.querySelectorAll(".btn-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Ngăn click lan lên thẻ card
      const card = btn.closest(".vehicle-card");
      const vehicleData = JSON.parse(card.dataset.vehicle);
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(vehicleData);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Xe đã được thêm vào giỏ hàng!");
      updateCartCount(); // Gọi lại hàm cập nhật giỏ hàng
    });
  });

  // Sự kiện click vào nút "Đặt xe"
  document.querySelectorAll(".btn-rent").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Ngăn click lan lên card
      const card = btn.closest(".vehicle-card");
      const vehicleData = JSON.parse(card.dataset.vehicle);
      localStorage.setItem("selectedVehicle", JSON.stringify(vehicleData));
      window.location.href = "rent.html";
    });
  });
});

/* Xử lý hiển thị số lượng trong button giỏ hàng ở mỗi trang index, cart, detail.html */

 document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) cartCountEl.textContent = cart.length;
  });
  function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) cartCountEl.textContent = cart.length;
}
// Tự động gọi khi trang vừa load
document.addEventListener("DOMContentLoaded", updateCartCount);


// ---------------------------------------------- Xử lý trang detail.html ---------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("selectedVehicle"));
    const detailImage = document.getElementById("detailImage");
    let originalImage = "";

    if (data) {
      // Gán ảnh chính
      document.getElementById("detailName").textContent = data.name;
      document.getElementById("detailPrice").textContent = `Giá: ${Number(data.price).toLocaleString()}đ/ngày`;
      detailImage.src = data.img;
      detailImage.alt = data.name;
      originalImage = data.img; 

      // Gán mô tả
      const desc = data.desc || "Xe đời mới, tiết kiệm xăng, phù hợp di chuyển trong thành phố.";
      document.getElementById("detailDesc").textContent = `Mô tả: ${desc}`;


      // Gán ảnh phụ
      const gallery = data.gallery || [];

      if (gallery[0]) {
        document.getElementById("thumb1").src = gallery[0];
        document.getElementById("thumb1").alt = `${data.name} - ảnh phụ 1`;
      }
      if (gallery[1]) {
        document.getElementById("thumb2").src = gallery[1];
        document.getElementById("thumb2").alt = `${data.name} - ảnh phụ 2`;
      }
      if (gallery[2]) {
        document.getElementById("thumb3").src = gallery[2];
        document.getElementById("thumb3").alt = `${data.name} - ảnh phụ 3`;
      }

       // Sự kiện click vào ảnh phụ
      ["thumb1", "thumb2", "thumb3"].forEach((id, index) => {
        const thumb = document.getElementById(id);
        if (gallery[index]) {
          thumb.addEventListener("click", () => {
            detailImage.src = gallery[index];
          });
        }
      });

      // Sự kiện click ảnh chính để quay lại ảnh gốc
      detailImage.addEventListener("click", () => {
        detailImage.src = originalImage;
      });
    }

    // Thêm vào giỏ hàng
   const btnAdd = document.getElementById("btnAddToCart");
    btnAdd?.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(data);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Xe đã được thêm vào giỏ hàng!");
      updateCartCount(); // Gọi lại hàm để cập nhật giỏ hàng ngay
    });
  });

// ---------------------------------------------- Xử lý trang cart.html ---------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cartContainer");
    const totalPriceEl = document.getElementById("totalPrice");
    const cartCountEl = document.getElementById("cartCount");

    // Cập nhật số lượng hiển thị ở nút giỏ hàng
    cartCountEl.textContent = cart.length;

    // Nếu trống thì thông báo
    if (cart.length === 0) {
      container.innerHTML = '<p class="text-muted">Giỏ hàng đang trống.</p>';
      document.getElementById("totalPrice").textContent = "0đ";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      const price = Number(item.price);
      total += price;

      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${item.img}" class="card-img-top" alt="${item.name}">
          <div class="card-body">
            <h5 class="card-title text-danger">${item.name}</h5>
            <p class="card-text">Giá: ${price.toLocaleString()}đ/ngày</p>
            <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${index})">Xoá</button>
          </div>
        </div>
      `;
      container.appendChild(col);
    });

    totalPriceEl.textContent = `${total.toLocaleString()}đ`;
  });

  // Xoá 1 xe
  function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  }

  // Xoá toàn bộ
  document.getElementById("clearCartBtn").addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn xoá tất cả xe trong giỏ hàng không?")) {
      localStorage.removeItem("cart");
      location.reload();
    }
  });

  // Xử lý khi bấm “Tiếp tục đặt xe”
  document.getElementById("proceedToRent").addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Bạn chưa đặt chiếc xe nào. Vui lòng chọn chiếc xe bạn yêu thích.");
    } else {
      // Xoá selectedVehicle nếu có — để tránh xung đột với rent
      localStorage.removeItem("selectedVehicle");
      window.location.href = "rent.html";
    }
  });


// ---------------------------------------------- Xử lý trang rent.html ---------------------------------------------

 