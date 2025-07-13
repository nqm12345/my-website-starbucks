document.addEventListener("DOMContentLoaded", () => {
  const SERVICE_ID  = "service_oy87orh";
  const TEMPLATE_ID = "template_4ra5yki";
  const PUBLIC_KEY  = "y_h0qPRike5M0rfSy";

  window.emailjs.init(PUBLIC_KEY);

  const $ = (sel) => document.querySelector(sel);
  const orderButtons  = document.querySelectorAll(".products__btn");
  const overlay       = $("#modal-overlay");
  const orderModal    = $("#order-modal");
  const checkoutModal = $("#checkout-modal");
  const orderImg      = $("#order-img");
  const orderName     = $("#order-name");
  const basePriceEl   = $("#base-price");
  const totalPriceEl  = $("#total-price");
  const sizeSelect    = $("#size-select");
  const qtyInput      = $("#qty");
  const orderForm     = $("#order-form");
  const checkoutForm  = $("#checkout-form");
  const paymentInfo   = $("#payment-info");

  let basePrice = 0;

  orderButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".products__item");
      orderName.textContent = item.querySelector(".products__name").textContent;
      orderImg.src          = item.querySelector("img").src;
      basePrice             = parseFloat(btn.dataset.price || "12.4");

      basePriceEl.textContent = basePrice.toFixed(2);
      qtyInput.value          = 1;
      orderForm.reset();
      overlay.style.display   = "block";
      orderModal.style.display= "block";
      updateTotal();
    });
  });

  function updateTotal() {
    const sizeExtra    = parseFloat(sizeSelect.selectedOptions[0]?.dataset.plus || 0);
    const toppingExtra = [...orderForm.querySelectorAll("input[name='topping']:checked")].length * 0.5;
    const qty          = parseInt(qtyInput.value || "1", 10);
    const total        = (basePrice + sizeExtra + toppingExtra) * qty;
    totalPriceEl.textContent = total.toFixed(2);
  }

  [sizeSelect, qtyInput, ...orderForm.querySelectorAll("input[name='topping']")]
    .forEach((el) => el.addEventListener("change", updateTotal));

  $("#close-order").onclick    = closeAll;
  $("#close-checkout").onclick = closeAll;
  overlay.onclick               = closeAll;

  function closeAll() {
    overlay.style.display       = "none";
    orderModal.style.display    = "none";
    checkoutModal.style.display = "none";
  }

  orderForm.onsubmit = (e) => {
    e.preventDefault();
    orderModal.style.display    = "none";
    checkoutModal.style.display = "block";
  };

  checkoutForm.method.addEventListener("change", (e) => {
    const tpl = {
      Momo: `<label>Số Momo:</label><input type="tel" required>`,
      Bank: `<label>Số tài khoản:</label><input type="text" required>`,
      Card: `<label>Số thẻ Visa/Master:</label><input type="text" required>`
    };
    paymentInfo.innerHTML = tpl[e.target.value] || "";
  });

  checkoutForm.onsubmit = async (e) => {
  e.preventDefault();
  const data      = collectOrderData();
  const pdfBase64 = await generateInvoicePDF(data);

  window.emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    ...data,
    invoice_pdf: pdfBase64
  }).then(() => {
    Swal.fire({
      icon: "success",
      title: "Đã gửi hóa đơn!",
      text: "Hóa đơn đã được gửi về: " + data.customer_email,
      confirmButtonText: "OK"
    });
    closeAll();
    checkoutForm.reset();
    orderForm.reset();
  }).catch((err) => {
    console.error("❌ EmailJS lỗi:", err);
    Swal.fire({
      icon: "error",
      title: "Gửi thất bại!",
      text: err.text || err.message || "Không gửi được hóa đơn.",
      confirmButtonText: "Thử lại"
    });
  });
};

  function collectOrderData() {
    const toppings = [...orderForm.querySelectorAll("input[name='topping']:checked")]
      .map((c) => c.parentElement.textContent.trim())
      .join(", ") || "Không";
    return {
      customer_email : checkoutForm.email.value,
      customer_name  : checkoutForm.email.value.split("@")[0],
      product_name   : orderName.textContent,
      size           : sizeSelect.value,
      topping        : toppings,
      qty            : qtyInput.value,
      total          : totalPriceEl.textContent,
      order_id       : "STB" + Date.now().toString().slice(-6)
    };
  }

  async function generateInvoicePDF(d) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("HÓA ĐƠN ĐẶT HÀNG", 65, 18);
    doc.setFontSize(12);
    const rows = [
      ["Mã đơn", d.order_id],
      ["Khách", d.customer_name],
      ["Email", d.customer_email],
      ["Sản phẩm", d.product_name],
      ["Size", d.size],
      ["Topping", d.topping],
      ["Số lượng", d.qty],
      ["Tổng tiền", `$${d.total}`]
    ];
    let y = 30;
    rows.forEach(([label, value]) => {
      doc.text(`${label}:`, 20, y);
      doc.text(String(value), 70, y);
      y += 8;
    });
    return doc.output("datauristring");
  }
});