/*
  Simple script to insert the current year into the footer.
  This ensures the copyright year stays up to date without
  requiring manual edits each year.
*/

document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear.toString();
  }
});