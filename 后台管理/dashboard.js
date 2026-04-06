const menuItems = document.querySelectorAll(".sidebar-menu li");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const orderModal = document.getElementById("orderModal");
const orderForm = document.getElementById("orderForm");
const formTip = document.getElementById("formTip");
const orderTableBody = document.getElementById("orderTableBody");
const orderSearch = document.getElementById("orderSearch");
const pageBtns = document.querySelectorAll(".page-btn");
const modalTitle = document.getElementById("modalTitle");
const statusFilter = document.getElementById("statusFilter");
const detailModal = document.getElementById("detailModal");
const closeDetailBtn = document.getElementById("closeDetailBtn");

const detailOrderId = document.getElementById("detailOrderId");
const detailCustomer = document.getElementById("detailCustomer");
const detailProduct = document.getElementById("detailProduct");
const detailAmount = document.getElementById("detailAmount");
const detailStatus = document.getElementById("detailStatus");
const detailTime = document.getElementById("detailTime");
const detailRemark = document.getElementById("detailRemark");
let editingRow = null;

// 调试：确认元素是否拿到了
console.log("openModalBtn:", openModalBtn);
console.log("orderForm:", orderForm);
console.log("orderTableBody:", orderTableBody);

// 左侧菜单切换高亮
menuItems.forEach((item) => {
  item.addEventListener("click", function () {
    menuItems.forEach((li) => li.classList.remove("active"));
    this.classList.add("active");
  });
});

// 打开弹窗
openModalBtn.addEventListener("click", function () {
  editingRow = null;
  orderForm.reset();
  formTip.textContent = "";
  modalTitle.textContent = "新增订单";
  orderModal.classList.add("show");
});

// 关闭弹窗
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", function () {
    orderModal.classList.remove("show");
    formTip.textContent = "";
  });
}

// 点击遮罩关闭
if (orderModal) {
  orderModal.addEventListener("click", function (e) {
    if (e.target === orderModal) {
      orderModal.classList.remove("show");
      formTip.textContent = "";
    }
  });
}

// 新增订单
if (orderForm) {
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const customerName = document.getElementById("customerName").value.trim();
    const productName = document.getElementById("productName").value.trim();
    const orderAmount = document.getElementById("orderAmount").value.trim();
    const orderStatus = document.getElementById("orderStatus").value;

    if (!customerName || !productName || !orderAmount) {
      formTip.style.color = "red";
      formTip.textContent = "请完整填写订单信息";
      return;
    }

    let statusText = "";
    if (orderStatus === "pending") statusText = "待处理";
    if (orderStatus === "done") statusText = "已完成";
    if (orderStatus === "shipping") statusText = "配送中";

    if (editingRow) {
      // 编辑模式
      editingRow.children[1].textContent = customerName;
      editingRow.children[2].textContent = productName;
      editingRow.children[3].textContent = orderAmount;
      editingRow.children[4].innerHTML = `<span class="status ${orderStatus}">${statusText}</span>`;

      formTip.style.color = "green";
      formTip.textContent = "订单更新成功";
      filterTable();
    } else {
      // 新增模式
      const orderId = "#XH" + Math.floor(Math.random() * 9000 + 1000);

      const newRow = document.createElement("tr");
        newRow.innerHTML = `
        <td>${orderId}</td>
        <td>${customerName}</td>
        <td>${productName}</td>
        <td>${orderAmount}</td>
        <td><span class="status ${orderStatus}">${statusText}</span></td>
        <td>
            <div class="action-group">
            <button class="action-btn view-btn">查看</button>
            <button class="action-btn edit-btn">编辑</button>
            <button class="action-btn delete-btn">删除</button>
            </div>
        </td>
        `;

      bindRowActions(newRow);
      orderTableBody.prepend(newRow);

      formTip.style.color = "green";
      formTip.textContent = "订单新增成功";
      filterTable();
    }

    setTimeout(() => {
      orderModal.classList.remove("show");
      orderForm.reset();
      formTip.textContent = "";
      modalTitle.textContent = "新增订单";
      editingRow = null;
    }, 800);
  });
}
function bindRowActions(row) {
  const viewBtn = row.querySelector(".view-btn");
  const editBtn = row.querySelector(".edit-btn");
  const deleteBtn = row.querySelector(".delete-btn");
    if (viewBtn) {
    viewBtn.addEventListener("click", function () {
      const orderId = row.children[0].textContent;
      const customer = row.children[1].textContent;
      const product = row.children[2].textContent;
      const amount = row.children[3].textContent;
      const status = row.children[4].textContent;

      detailOrderId.textContent = orderId;
      detailCustomer.textContent = customer;
      detailProduct.textContent = product;
      detailAmount.textContent = amount;
      detailStatus.textContent = status;

      detailTime.textContent = "2026-04-06 14:30";
      detailRemark.textContent = `订单 ${orderId} 当前为“${status}”状态，请根据业务流程继续处理。`;

      detailModal.classList.add("show");
    });
  }
  if (editBtn) {
    editBtn.addEventListener("click", function () {
      editingRow = row;

      const customer = row.children[1].textContent;
      const product = row.children[2].textContent;
      const amount = row.children[3].textContent;
      const statusClass = row.children[4].querySelector(".status").classList[1];

      document.getElementById("customerName").value = customer;
      document.getElementById("productName").value = product;
      document.getElementById("orderAmount").value = amount;
      document.getElementById("orderStatus").value = statusClass;

      modalTitle.textContent = "编辑订单";
      formTip.textContent = "";
      orderModal.classList.add("show");
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      const ok = confirm("确定要删除这条订单吗？");
      if (ok) {
        row.remove();
      }
    });
  }
}
function filterTable() {
  const keyword = orderSearch.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const rows = orderTableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const rowText = row.textContent.toLowerCase();
    const statusEl = row.querySelector(".status");
    const rowStatus = statusEl ? statusEl.classList[1] : "";

    const matchKeyword = rowText.includes(keyword);
    const matchStatus = selectedStatus === "all" || rowStatus === selectedStatus;

    row.style.display = matchKeyword && matchStatus ? "" : "none";
  });
}
// 表格搜索
if (orderSearch) {
  orderSearch.addEventListener("input", filterTable);
}

if (statusFilter) {
  statusFilter.addEventListener("change", filterTable);
}

// 假分页高亮
pageBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    pageBtns.forEach((item) => item.classList.remove("active"));
    if (this.textContent !== "下一页") {
      this.classList.add("active");
    }
  });
});
const menuToggleBtn = document.getElementById("menuToggleBtn");
const dashboard = document.querySelector(".dashboard");
const statNumbers = document.querySelectorAll(".stat-number");

// 侧边栏折叠
if (menuToggleBtn) {
  menuToggleBtn.addEventListener("click", function () {
    dashboard.classList.toggle("sidebar-collapsed");
  });
}

// 卡片数字动画
function animateNumbers() {
  statNumbers.forEach((item) => {
    const target = Number(item.dataset.target);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));

    const timer = setInterval(() => {
      current += step;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      if (item.dataset.target === "23680") {
        item.textContent = "¥ " + current.toLocaleString();
      } else {
        item.textContent = current.toLocaleString();
      }
    }, 30);
  });
}

animateNumbers();
const existingRows = orderTableBody.querySelectorAll("tr");
existingRows.forEach((row) => bindRowActions(row));
if (closeDetailBtn) {
  closeDetailBtn.addEventListener("click", function () {
    detailModal.classList.remove("show");
  });
}

if (detailModal) {
  detailModal.addEventListener("click", function (e) {
    if (e.target === detailModal) {
      detailModal.classList.remove("show");
    }
  });
}