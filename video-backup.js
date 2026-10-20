(() => {
  "use strict";

  const config = window.lilLaptopVideoBackup;
  if (config?.enabled !== true || typeof config.postUrl !== "string" || !config.postUrl.trim()) return;

  let post;
  try {
    post = new URL(config.postUrl);
  } catch {
    return;
  }
  const allowedHosts = ["x.com", "www.x.com", "twitter.com", "www.twitter.com"];
  const match = post.pathname.match(/^\/[A-Za-z0-9_]+\/status\/(\d+)(?:\/video\/\d+)?\/?$/);
  if (post.protocol !== "https:" || !allowedHosts.includes(post.hostname) || !match || post.username || post.password || post.port) return;

  const frame = document.querySelector("#trailer-frame");
  const nativeVideo = frame?.querySelector("video");
  const template = document.querySelector("#x-video-backup-template");
  if (!nativeVideo || !template) return;

  const player = template.content.firstElementChild.cloneNode(true);
  const iframe = player.querySelector("iframe");
  const embedUrl = new URL("https://platform.twitter.com/embed/Tweet.html");
  embedUrl.search = new URLSearchParams({
    id: match[1], dnt: "true", theme: "light", width: "550", frame: "false"
  });
  iframe.src = embedUrl.href;

  // Remove the local source before mounting X, so this mode never starts our MP4.
  nativeVideo.pause();
  nativeVideo.removeAttribute("src");
  nativeVideo.querySelectorAll("source").forEach(source => source.remove());
  nativeVideo.load();
  nativeVideo.replaceWith(player);
  const resize = () => player.style.setProperty("--x-video-scale", player.clientWidth / 518);
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(player);
  else window.addEventListener("resize", resize);

  frame.dataset.videoProvider = "x";
  frame.querySelector("[data-video-filename]").textContent = "lil-laptop / X";
  frame.querySelector("[data-video-duration]").textContent = "▶";
  const link = document.querySelector("#x-video-backup-link");
  link.href = `https://x.com${post.pathname}`;
  link.hidden = false;
})();
