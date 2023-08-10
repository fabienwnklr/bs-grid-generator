<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { onMounted } from "vue";
import { debounce } from "./utils/time";
import Popover from "bootstrap/js/dist/popover";

function changeFormat(event: Event) {
  const $target = event.target as HTMLAnchorElement;
  const format = $target.dataset.format;
  const $container = document.querySelector("#rendering") as HTMLElement;
  if (format === "sm") {
    $container.style.width = "576px";
  } else if (format === "md") {
    $container.style.width = "768px";
  } else if (format === "lg") {
    $container.style.width = "992px";
  }

  const $active = $target.parentElement?.parentElement?.querySelector('.active');
  if ($active) {
    $active.classList.remove("active");
    $active.querySelector(".bi")?.remove();
  }
  $target.classList.add("active");
  $target.appendChild(stringToHTMLNode(`<i class="bi bi-check-lg float-end"></i>`))
}
function changeTheme(this: any, _event: Event) {
  if (this.classList.contains("active")) {
    return;
  }

  const $themes = document.querySelectorAll(
    "[data-bs-theme-value]"
  ) as NodeListOf<HTMLAnchorElement>;

  $themes.forEach((el) => {
    el.classList.remove("active");

    if (el.dataset.bsThemeValue === this.dataset.bsThemeValue) {
      el.classList.add("active");

      if (this.dataset.bsThemeValue === "auto") {
        setupTheme();
      } else {
        document
          .querySelector("html")
          ?.setAttribute("data-bs-theme", this.dataset.bsThemeValue);
      }
    }
  });
}
function setupTheme() {
  const $theme = document.querySelector(
    ".active[data-bs-theme-value]"
  ) as HTMLButtonElement;

  if ($theme) {
    if ($theme.dataset.bsThemeValue === "auto") {
      const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const $themes = document.querySelectorAll(
        "[data-bs-theme-value]"
      ) as NodeListOf<HTMLAnchorElement>;

      $themes.forEach((el) => {
        el.classList.remove("active");

        if (el.dataset.bsThemeValue === "auto") {
          el.classList.add("active");
        }
      });

      if (darkMode) {
        document.querySelector("html")?.setAttribute("data-bs-theme", "dark");
      } else {
        document.querySelector("html")?.setAttribute("data-bs-theme", "light");
      }
    } else {
      document
        .querySelector("html")
        ?.setAttribute("data-bs-theme", $theme.dataset.bsThemeValue ?? "dark");
    }
  }
}
function setupFormat() {
  const $format = document.querySelector("#format");

  function isHidden(el: HTMLElement) {
    const style = window.getComputedStyle(el);
    return style.display === "none";
  }

  if ($format) {
    const $formatDetector = document.querySelectorAll(
      ".format-detector"
    ) as NodeListOf<HTMLDivElement>;

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

const $colTemplate = `
<div tabindex="0" class="col">
      <p>Column</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>`;
const $rowTemplate = `
    <div class="border row  cursor-pointer bs-container">
      ${$colTemplate}
    </div>`;

function stringToHTMLNode(string: string) {
  const parser = new DOMParser();
  const html = parser.parseFromString(string, "text/html");
  const row = html.body.firstChild as HTMLElement;

  return row;
}
function createRow() {
  const row = stringToHTMLNode($rowTemplate);
  return row;
}
onMounted(() => {
  setupTheme();
  setupFormat();

  document.querySelector(".btn-group")?.addEventListener("change", (event) => {
    const $container = document.getElementById("rendering");

    if ($container) {
      const $radio = event?.target as HTMLInputElement;
      $container.classList.remove(...["container", "container-fluid"]);
      $container.classList.add($radio.dataset.class || "");
    }
  });
});
window.onresize = debounce(setupFormat);
window.onclick = function (event) {
  const $target = event.target as Element;
  if (!$target?.closest(".popover")) {
    const $rows = document.querySelectorAll(
      ".bs-container .col"
    ) as NodeListOf<HTMLDivElement>;

    $rows.forEach(($row) => {
      Popover.getOrCreateInstance($row)?.hide();
    });
  }
};

function addRow() {
  const $container = document.getElementById("rendering");

  if ($container) {
    if (!$container.firstElementChild?.classList.contains("row")) {
      $container.innerHTML = "";
    }

    const $row = createRow();
    $container.insertAdjacentElement("beforeend", $row);
    const $col = $row.querySelector(".col") as HTMLDivElement;
    const $params = `
    <a class="btn btn-primary btn-sm m-1 remove-row" type="button"><i class="bi bi-trash me-2"></i>Remove row</a>
    <a class="btn btn-primary btn-sm m-1 add-column" type="button"><i class="bi bi-plus me-2"></i>Add column</a>
    <a class="btn btn-primary btn-sm m-1 remove-column" type="button"><i class="bi bi-trash me-2"></i>Remove column</a>
    `;
    const popover = Popover.getOrCreateInstance($col, {
      title:
        'Manage it <a href="#" class="btn btn-sm float-end btn-close" data-bs-dismiss="popover"></a>',
      trigger: "click",
      placement: "auto",
      content: $params,
      html: true,
    });

    $col.addEventListener("shown.bs.popover", () => {
      popover.tip.querySelector(".btn-close")?.addEventListener("click", () => {
        popover.hide();
      });
      popover.tip.querySelector(".remove-row")?.addEventListener("click", () => {
        $row.remove();
        popover.hide();
      });
      popover.tip.querySelector(".remove-column")?.addEventListener("click", () => {
        if ($row.querySelectorAll("[class^=col]").length > 1) {
          $col.remove();
        } else {
          $row.remove();
        }
        popover.hide();
      });
      popover.tip.querySelector(".add-column")?.addEventListener("click", () => {
        const $col = stringToHTMLNode($colTemplate);
        $row.insertAdjacentElement("beforeend", $col);
        $col.addEventListener("focus", function (_event) {
          document
            .getElementById("rendering")
            ?.querySelectorAll(".col")
            .forEach((el) => {
              el.classList.remove("selected");
            });
          $col.classList.add("selected");
        });
        $col.addEventListener("focusout", function (_event) {
          $col.classList.remove("selected");
        });
      });
    });
    $col.addEventListener("focus", function (_event) {
      document
        .getElementById("rendering")
        ?.querySelectorAll(".col")
        .forEach((el) => {
          el.classList.remove("selected");
        });
      $col.classList.add("selected");
    });
    $col.addEventListener("focusout", function (_event) {
      $col.classList.remove("selected");
    });
  }
}
</script>

<template>
  <div id="xs" class="d-none d-sm-block format-detector"></div>
  <div id="sm" class="d-block d-sm-none format-detector"></div>
  <div id="md" class="d-block d-md-none format-detector"></div>
  <div id="lg" class="d-block d-lg-none format-detector"></div>
  <div id="xl" class="d-block d-xl-none format-detector"></div>
  <div class="d-flex flex-column align-items-center">
    <div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 mode-toggle">
      <button
        class="btn btn-secondary py-2 dropdown-toggle d-flex align-items-center"
        id="theme"
        type="button"
        aria-expanded="false"
        data-bs-toggle="dropdown"
        aria-label="Toggle theme (auto)"
      >
        <i class="bi bi-circle-half me-2"></i>
        <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
        <li>
          <button
            type="button"
            class="dropdown-item d-flex align-items-center"
            data-bs-theme-value="light"
            aria-pressed="false"
            :onclick="changeTheme"
          >
            <i class="bi bi-sun me-2"></i>
            Light
          </button>
        </li>
        <li>
          <button
            type="button"
            class="dropdown-item d-flex align-items-center"
            data-bs-theme-value="dark"
            aria-pressed="false"
            :onclick="changeTheme"
          >
            <i class="bi bi-moon-fill me-2"></i>
            Dark
          </button>
        </li>
        <li>
          <button
            type="button"
            class="dropdown-item d-flex align-items-center active"
            data-bs-theme-value="auto"
            aria-pressed="true"
            :onclick="changeTheme"
          >
            <i class="bi bi-circle-half me-2"></i>
            Auto
          </button>
        </li>
      </ul>
    </div>
    <Navbar />
    <!-- Begin page content -->
    <main class="container-fluid overflow-auto">
      <div class="d-flex mb-3 justify-content-between">
        <!-- <div
          class="btn-group btn-group-sm"
          role="group"
          aria-label="Basic outlined example"
        >
          <button type="button" class="btn btn-outline-primary d-flex">
              <i class="bi bi-plus"></i>
            <div class="row">
              <div class="bg-secondary col-6" style="height: 10px"></div>
              <div class="bg-secondary col-6" style="height: 10px"></div>
            </div>
          </button>
          <button type="button" class="btn btn-outline-primary">Middle</button>
          <button type="button" class="btn btn-outline-primary">Right</button>
        </div> -->
        <div
          class="btn-group btn-group-sm"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio1"
            autocomplete="off"
            checked
            data-class="container"
          />
          <label class="btn btn-outline-primary" for="btnradio1">Container normal</label>

          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio2"
            autocomplete="off"
            data-class="container-fluid"
          />
          <label class="btn btn-outline-primary" for="btnradio2">Container fluid</label>
        </div>
        <div
          class="btn-group btn-group-sm"
          role="group"
          aria-label="Basic checkbox toggle button group"
        >
          <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off" />
          <label class="btn btn-outline-primary" for="btncheck1">Code</label>
        </div>
        <div class="dropdown">
          <button
            class="btn btn-secondary btn-sm dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Device
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                class="dropdown-item active"
                href="#"
                data-format="lg"
                :onclick="changeFormat"
                >Desktop <i class="bi bi-check-lg float-end"></i></a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" data-format="md" :onclick="changeFormat"
                >Tablet</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" data-format="sm" :onclick="changeFormat"
                >Phone</a
              >
            </li>
          </ul>
        </div>
        <button v-on:click="addRow" id="add_row" class="btn btn-primary btn-sm">
          <i class="bi bi-plus-circle"></i>
          Add row
        </button>
      </div>
      <div class="container" id="rendering">
        <ol class="list-group list-group-numbered">
          <li class="list-group-item">
            Select the number of rows, columns and container type.
          </li>
          <li class="list-group-item">
            Resize your browser window to the smallest possible width(mobile first). The
            current width and bootstrap
          </li>
          <li class="list-group-item">
            breakpoint are displayed in the top of the screen.
          </li>
          <li class="list-group-item">
            Select a column and adjust its width via the field: "Column dimensions: xs".
          </li>
          <li class="list-group-item">Repeat this step for the other columns.</li>
          <li class="list-group-item">
            The order of columns can be adjusted in the same way via the field: "Column
            order: xs".
          </li>
          <li class="list-group-item">
            Increase the width of your browser to the next breakpoint and repeat the
            proces for adjusting the width and/or order.
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
.popover {
  --bs-popover-max-width: 500px;
}
main {
  padding: 80px 15px 100px;
}
.mode-toggle {
  z-index: 9999999;
}

#add_row {
  z-index: 9999999;
}

.col.selected {
  background-color: var(--bs-primary-bg-subtle);
}

.bs-container:first-child {
  border-top-left-radius: var(--bs-border-radius);
  border-top-right-radius: var(--bs-border-radius);
}

.bs-container:last-child {
  border-bottom-left-radius: var(--bs-border-radius);
  border-bottom-right-radius: var(--bs-border-radius);
}
.bs-container .col:not(:first-of-type) {
  border-left: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.bs-container .col:not(:last-of-type) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.bs-container .col:first-of-type {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.bs-container .col {
  border-radius: inherit;
}
</style>
