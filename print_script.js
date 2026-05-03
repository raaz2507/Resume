document.addEventListener("DOMContentLoaded", () => {
	new filterPanal();
});

class filterPanal {
	constructor() {
		this.#htmlContent();
		this.#filterSetup();
		this.#floutBtnSetup();
	}
	#floutBtnSetup() {
		const btn = document.querySelector(".float-btn");

		let isDragging = false;
		let offsetX, offsetY;

		/* 🖱️ Drag Start */
		btn.addEventListener("mousedown", (e) => {
			isDragging = true;
			offsetX = e.clientX - btn.offsetLeft;
			offsetY = e.clientY - btn.offsetTop;
		});

		/* 🖱️ Drag Move */
		document.addEventListener("mousemove", (e) => {
			if (!isDragging) return;

			btn.style.left = e.clientX - offsetX + "px";
			btn.style.top = e.clientY - offsetY + "px";
			btn.style.right = "auto";
			btn.style.bottom = "auto";
		});

		/* 🖱️ Drag End + Snap */
		document.addEventListener("mouseup", () => {
			if (!isDragging) return;
			isDragging = false;

			const mid = window.innerWidth / 2;
			const btnX = btn.offsetLeft;

			if (btnX < mid) {
				btn.style.left = "10px";
			} else {
				btn.style.left = window.innerWidth - btn.offsetWidth - 10 + "px";
			}
		});

		/* 📱 Touch Support */
		btn.addEventListener("touchstart", (e) => {
			const touch = e.touches[0];
			isDragging = true;
			offsetX = touch.clientX - btn.offsetLeft;
			offsetY = touch.clientY - btn.offsetTop;
		});

		document.addEventListener("touchmove", (e) => {
			if (!isDragging) return;

			const touch = e.touches[0];
			btn.style.left = touch.clientX - offsetX + "px";
			btn.style.top = touch.clientY - offsetY + "px";
			btn.style.right = "auto";
			btn.style.bottom = "auto";
		});

		document.addEventListener("touchend", () => {
			isDragging = false;
		});

		/* 🎯 Click → Panel Toggle */
		const panel = document.querySelector(".filter_panel");
		btn.addEventListener("click", () => {
			if (isDragging) return; // drag ke time click ignore
			panel.classList.toggle("open");
			console.log(panel);
		});
	}
	#filterSetup() {
		const page = document.querySelector(".page");

		// 🔹 state
		let filters = {
			grayscale: 0,
			contrast: 100,
			sepia: 0,
			saturate: 100,
			hue: 0,
		};

		// 🔹 inputs
		const inputs = {
			grayscale: document.getElementById("grayscale"),
			contrast: document.getElementById("contrast"),
			sepia: document.getElementById("sepia"),
			saturate: document.getElementById("saturate"),
			hue: document.getElementById("hue"),
		};

		// 🔹 outputs
		const outputs = {
			grayscale: document.getElementById("grayscaleValue"),
			contrast: document.getElementById("contrastValue"),
			sepia: document.getElementById("sepiaValue"),
			saturate: document.getElementById("saturateValue"),
			hue: document.getElementById("hueValue"),
		};

		// 🔹 apply filter
		function applyFilter() {
			page.style.filter = `
    grayscale(${filters.grayscale}%)
    contrast(${filters.contrast}%)
    sepia(${filters.sepia}%)
    saturate(${filters.saturate}%)
    hue-rotate(${filters.hue}deg)
  `;
		}

		// 🔹 update UI
		function updateUI() {
			for (let key in filters) {
				// console.log(inputs[key]);
				inputs[key].value = filters[key];
				outputs[key].textContent = filters[key];
			}
		}

		// 🔹 slider events
		for (let key in inputs) {
			inputs[key].addEventListener("input", (e) => {
				filters[key] = Number(e.target.value);
				updateUI();
				applyFilter();
			});
		}

		// 🔹 presets
		document.querySelectorAll(".preset").forEach((btn) => {
			btn.addEventListener(
				"click",
				() => {
					filters.grayscale = Number(btn.dataset.gray || filters.grayscale);
					filters.contrast = Number(btn.dataset.contrast || filters.contrast);
					filters.sepia = Number(btn.dataset.sepia || 0);
					filters.saturate = Number(btn.dataset.saturate || 100);
					filters.hue = Number(btn.dataset.hue || 0);

					updateUI();
					applyFilter();
				},
				true,
			);
		});

		// 🔹 default
		document.getElementById("defaultBtn").addEventListener("click", () => {
			filters = {
				grayscale: 0, // 0% (Original colors)
				contrast: 100, // 100% (Normal contrast)
				sepia: 0, // 0% (No sepia)
				saturate: 100, // 100% (Normal saturation)
				hue: 0, // 0 degrees (No color shift)
			};
			updateUI();
			applyFilter();
		});
	}
	#htmlContent() {
		const container = document.createElement("div");

		container.innerHTML = `<button class="float-btn">⚙️</button>
		<div class="filter_panel">
			
			<!-- 🔹 Sliders -->
			<div>
				<label>Grayscale <span class="help-icon" title="Black & White effect (0% = original, 100% = fully grayscale)">?</span></label>
				<input type="range" id="grayscale" min="0" max="100" value="0">
				<output id="grayscaleValue">0</output>
			</div>

			<div>
				
				<label>Contrast <span class="help-icon" title="Adjust contrast (100% = normal, higher = more sharp, lower = flat)">?</span></label>
				<input type="range" id="contrast" min="0" max="200" value="130">
				<output id="contrastValue">130</output>
			</div>

			<div>
				<label>Sepia <span class="help-icon" title="Sepia tone effect (0% = none, 100% = full warm vintage look)">?</span></label>
				<input type="range" id="sepia" min="0" max="100" value="0">
				<output id="sepiaValue">0</output>
			</div>

			<div>
				<label>Saturate <span class="help-icon" title="Color intensity (100% = normal, higher = more vibrant, 0% = no color)">?</span></label>
				<input type="range" id="saturate" min="0" max="1000" value="100">
				<output id="saturateValue">100</output>
			</div>

			<div>
				<label>Hue Rotate <span class="help-icon" title="Color shift (0° = original, 180° = opposite colors, 360° = reset)">?</span></label>
				<input type="range" id="hue" min="0" max="360" value="0">
				<output id="hueValue">0</output>
			</div>
		<div class="btnContainer">
			<!-- 🔥 Presets -->
			<div >
				<button class="btn preset" data-gray="100" data-contrast="120">⚫ B/W</button>
				<button class="btn preset" data-gray="0" data-contrast="180">🔍 High Contrast</button>
				<button class="btn preset" data-gray="100" data-contrast="200" data-saturate="80">📰 Newspaper</button>
				<!-- <input type="button" value="Default" class="btn" id="defalutBtn" /> -->
			</div>
			<div>
				<button class="btn" id="printBtn" onclick="window.print()">🖨️ Print</button>
				<button class="btn" id="defaultBtn">Default</button>
			</div>
		</div>
		</div>`;
		document.body.append(container);
	}
}
