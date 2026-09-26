import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, getFirestore, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const INVITATION_ID = "caro-cuchillo-pala";
const RESPONSE_KEY = `wedding-response:${INVITATION_ID}`;

const acceptButton = document.querySelector("#accept-trigger");
const confirmButton = document.querySelector("#confirm-accept");
const retryButton = document.querySelector("#retry-connection");
const dialog = document.querySelector("#confirm-dialog");
const connectionStatus = document.querySelector("#connection-status");
const toast = document.querySelector("#toast");

let db;
let firebaseApp;
let currentUser;
let toastTimer;
let isSubmitting = false;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
}

function hasLocalResponse() {
  try {
    return window.localStorage.getItem(RESPONSE_KEY) === "accepted";
  } catch {
    return false;
  }
}

function persistLocalResponse() {
  try {
    window.localStorage.setItem(RESPONSE_KEY, "accepted");
  } catch {
    // El documento de Firestore sigue siendo la protección contra respuestas duplicadas.
  }
}

function setAcceptedState() {
  acceptButton.disabled = true;
  acceptButton.classList.add("is-accepted");
  acceptButton.textContent = "Respuesta guardada";
  retryButton.hidden = true;
  connectionStatus.textContent = "Gracias, Caro. Tu respuesta quedó confirmada.";
}

function setLoading(isLoading) {
  confirmButton.disabled = isLoading;
  acceptButton.classList.toggle("is-loading", isLoading);
  confirmButton.textContent = isLoading ? "Guardando respuesta…" : "Sí, acepto ser madrina";
}

async function connect() {
  retryButton.hidden = true;
  connectionStatus.textContent = "Preparando tu invitación…";
  if (hasLocalResponse()) {
    setAcceptedState();
    return;
  }

  try {
    firebaseApp ??= initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    const credential = await signInAnonymously(auth);
    currentUser = credential.user;
    acceptButton.disabled = false;
    connectionStatus.textContent = "Tu invitación está lista.";
  } catch {
    connectionStatus.textContent = "No pudimos conectar. Revisa tu internet e inténtalo de nuevo.";
    retryButton.hidden = false;
  }
}

acceptButton.addEventListener("click", () => {
  if (!currentUser || hasLocalResponse() || isSubmitting) return;
  dialog.showModal();
});

retryButton.addEventListener("click", connect);

confirmButton.addEventListener("click", async () => {
  if (!currentUser || !db || hasLocalResponse() || isSubmitting) return;

  isSubmitting = true;
  setLoading(true);
  try {
    await setDoc(doc(db, "responses", INVITATION_ID), {
      accepted: true,
      createdAt: serverTimestamp(),
      inviteId: INVITATION_ID,
      recipients: ["Caro"],
      responderUid: currentUser.uid
    });
    persistLocalResponse();
    dialog.close();
    setAcceptedState();
    showToast("¡Qué alegría! Tu respuesta quedó guardada.");
  } catch (error) {
    dialog.close();
    if (error?.code === "already-exists") {
      persistLocalResponse();
      setAcceptedState();
      showToast("Esta invitación ya tiene una respuesta registrada.");
    } else if (error?.code === "permission-denied") {
      connectionStatus.textContent = "No pudimos confirmar tu respuesta. Si ya la enviaste, gracias; si no, inténtalo de nuevo.";
      showToast("No fue posible confirmar la respuesta.");
    } else {
      showToast("No pudimos guardar tu respuesta. Inténtalo nuevamente.");
    }
  } finally {
    isSubmitting = false;
    setLoading(false);
  }
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroArt = document.querySelector("[data-svg-reveal]");
const heroAnimations = document.querySelectorAll(".hero__image animate, .hero__image animateTransform, .hero__image animateMotion");
if (!reducedMotion && "IntersectionObserver" in window && heroArt) {
  const heroObserver = new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    heroAnimations.forEach((animation) => animation.beginElement?.());
    observer.disconnect();
  }, { threshold: 0.15 });
  heroObserver.observe(heroArt);
}

if ("IntersectionObserver" in window && !reducedMotion) {
  document.documentElement.classList.add("has-motion");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -7%" });
  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
}

connect();
