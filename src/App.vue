<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { onMounted } from 'vue';
import { debounce } from './utils/time';
function setupTheme() {
  const $theme = document.querySelector(".active[data-bs-theme-value]") as HTMLButtonElement;

  document.querySelector("html")?.setAttribute("data-bs-theme", $theme.dataset.bsThemeValue ?? "");
}
function setupFormat() {
  const $format = document.querySelector("#format");

  function isHidden(el: HTMLElement) {
    const style = window.getComputedStyle(el);
    return (style.display === 'none')
  }

  if ($format) {
    const $formatDetector = document.querySelectorAll(".format-detector") as NodeListOf<HTMLDivElement>;

    if ($formatDetector) {
      let format = "";
      for (const element of $formatDetector) {
        if (isHidden(element)) {
          format = element.id;
        }
      }

      $format.innerHTML = `(${format}, ${window.innerWidth}px)`;
    }
  }
}
onMounted(() => {
  setupTheme();
  setupFormat();
});
window.onresize = debounce(setupFormat)

const $templateRow = `<div class="row">
  <div class="col border cursor-pointer rounded p-2 p-2">
      <p>Column</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>
</div>`;
function addRow() {
  const $container = document.getElementById("rendering");

  if ($container) {
    if (!$container.children.item(0)?.classList.contains("row")) {
      $container.innerHTML = "";
    }
    $container.insertAdjacentHTML("beforeend", $templateRow);
  }
}
</script>

<template>
  <div id="xs" class="d-none d-sm-block format-detector"></div>
  <div id="sm" class="d-block d-sm-none format-detector"></div>
  <div id="md" class="d-block d-md-none format-detector"></div>
  <div id="lg" class="d-block d-lg-none format-detector"></div>
  <div id="xl" class="d-block d-xl-none format-detector"></div>
  <div class="d-flex flex-column h-100">
    <div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 mode-toggle">
      <button class="btn btn-secondary py-2 dropdown-toggle d-flex align-items-center" id="theme" type="button"
        aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (auto)">
        <i class="bi bi-circle-half me-2"></i>
        <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light"
            aria-pressed="false">
            <i class="bi bi-sun me-2"></i>
            Light
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark"
            aria-pressed="false">
            <i class="bi bi-moon-fill me-2"></i>
            Dark
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto"
            aria-pressed="true">
            <i class="bi bi-circle-half me-2"></i>
            Auto
          </button>
        </li>
      </ul>
    </div>
    <Navbar />
    <!-- Begin page content -->
    <main class="flex-shrink-0 mt-3 overflow-auto">
      <button v-on:click="addRow" id="add_row" class="btn btn-primary position-fixed top-3 end-0 mb-3 me-3">
        <i class="bi bi-plus-circle"></i>
        Add row
      </button>
      <div class="container" id="rendering">
        <ol class="list-group list-group-numbered">
          <li class="list-group-item">Select the number of rows, columns and container type.</li>
          <li class="list-group-item">
            Resize your browser window to the smallest possible width(mobile first). The current width and bootstrap
          </li>
          <li class="list-group-item">
            breakpoint are displayed in the top of the screen.
          </li>
          <li class="list-group-item">
            Select a column and adjust its width via the field: "Column dimensions: xs".
          </li>
          <li class="list-group-item">
            Repeat this step for the other columns.
          </li>
          <li class="list-group-item">
            The order of columns can be adjusted in the same way via the field: "Column order: xs".
          </li>
          <li class="list-group-item">
            Increase the width of your browser to the next breakpoint and repeat the proces for adjusting the width and/or
            order.
          </li>
          <li class="list-group-item">
            Copy and paste the resulting html in your website or application.
          </li>
        </ol>

      </div>
    </main>

    <Footer />
  </div>
</template>

<style>
main {
  padding: 60px 15px 0;
}
.mode-toggle {
  z-index: 9999999;
}

#add_row {
  z-index: 9999999;
}
</style>
