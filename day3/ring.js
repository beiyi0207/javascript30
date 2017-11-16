const inputs = document.querySelectorAll('input');
function handleUpdate() {
  const suffix = this.dataset.unit || '';
  const variable = this.dataset.variable;
  document.documentElement.style.setProperty(`--${variable}`, this.value + suffix);
}
function resetInput() {
  document.getElementById('gem').value = '#ff0000';
  document.getElementById('ring').value = '#ffc107';
  document.getElementById('size').value = 9;
}
window.onbeforeunload = resetInput();
inputs.forEach(input => input.addEventListener('change', handleUpdate));
