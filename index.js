let { PageMod } = require("sdk/page-mod");

new PageMod({
  include: "*",
  attachTo: ["existing", "top", "frame"],
  onAttach: function(worker) {
    let id = worker.tab.id;
    console.log("Attaching to tab " + id);
  }
});
