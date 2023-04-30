"use-strict";

(() => {
  class TileHandler {
    constructor() {
      this.dragging = false;
    }

    setListeners() {
      let tiles = document.getElementsByClassName("tile");

      interact(".tile").draggable({
        onstart: (event) => {
          this.dragging = true;
          var target = event.target;
          target.classList.add("snapped");
        },
        onmove: (event) => {
          var target = event.target,
            x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
            y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          target.style.transform = "translate(" + x + "px, " + y + "px)";
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
        onend: (event) => {
          this.dragging = false;
          var target = event.target;
          target.classList.remove("snapped");
          target.removeAttribute("data-x");
          target.removeAttribute("data-y");
        },
      });

      interact(".tile").dropzone({
        overlap: "center",
        ondrop(event) {
          const target = event.target;
          target.classList.add("dropped");
          target.style.position = "absolute";
          target.style.top = event.rect.top + "px";
          target.style.left = event.rect.left + "px";
        },
      });

      for (let tile of tiles) {
        tile.addEventListener("mousedown", () => {
          setTimeout(() => {
            console.log(this.dragging);
            if (this.dragging) return;
            let curRot = tile.style.transform
              ? Number(tile.style.transform.split("(")[1].split("deg")[0])
              : 0;

            if (isNaN(curRot)) curRot = 0;

            console.log(curRot);
            curRot += 60; // Adjust the rotation value as needed

            tile.style.transform = `rotate(${curRot}deg)`;
          }, 100);
        });
      }
    }
  }

  let handeler = new TileHandler();

  handeler.setListeners();
})();
