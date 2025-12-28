import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  return new Intl.NumberFormat('fr-CG', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(price);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-CG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}