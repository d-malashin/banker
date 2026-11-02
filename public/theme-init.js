(() => {
  const allowed = new Set(["system", "light", "dark"]);
  let preference = "system";
  try {
    const saved = JSON.parse(
      localStorage.getItem("banker.preferences.v1") || "{}",
    );
    if (allowed.has(saved.theme)) preference = saved.theme;
  } catch {
    /* Device appearance still works if site storage is unavailable. */
  }
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const apply = (value = preference) => {
    preference = allowed.has(value) ? value : "system";
    const theme =
      preference === "system"
        ? system.matches
          ? "dark"
          : "light"
        : preference;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#111114" : "#f3f3f6");
  };
  system.addEventListener("change", () => {
    if (preference === "system") apply();
  });
  window.BankerTheme = { apply, preference: () => preference };
  apply();
})();
