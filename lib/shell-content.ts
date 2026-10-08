/**
 * Commercial lines transcribed from the Tata Neu reference screenshots.
 * This is not a live offer feed, not personalised, and not priced beyond those lines.
 */
export const REFERENCE_NOTE =
  "These lines are taken from reference screenshots of the Tata Neu app. They are not a live catalogue and they are not personalised.";

export const QUICK_ACTIONS = [
  { id: "send-money", label: "Send Money" },
  { id: "recharges", label: "Recharges" },
  { id: "pay-bills", label: "Pay Bills" },
  { id: "transactions", label: "Transactions" },
] as const;

export const CATEGORY_GROUPS = [
  {
    id: "top-picks",
    title: "Top picks",
    items: ["Credit Cards", "Personal Loan", "Investment Plans", "Hotels"],
  },
  {
    id: "daily",
    title: "Daily",
    items: ["Grocery", "Pharmacy", "Food Delivery", "Payments"],
  },
  {
    id: "electronics",
    title: "Electronics",
    items: [
      "Mobiles",
      "Gadgets",
      "TV & Appliances",
      "New Launches",
      "Laptops",
      "Appliance Care",
      "Extended Warranty",
    ],
  },
] as const;

export const NEUCARD_BENEFITS = [
  { value: "10%", label: "NeuCoins on Tata Neu*" },
  { value: "5%", label: "NeuCoins on Tata brands*" },
  { value: "1.5%", label: "NeuCoins on other spends*" },
] as const;
