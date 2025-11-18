export function formatMoney(amount: number) {
  return "₦" + amount.toLocaleString();
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB");
}
