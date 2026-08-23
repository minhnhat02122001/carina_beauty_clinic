import type { MouseEvent } from "react";

export function scrollToRegistrationForm(e: MouseEvent) {
  const form = document.getElementById("registration-form");
  if (form) {
    e.preventDefault();
    form.scrollIntoView({ behavior: "smooth" });
  }
}
