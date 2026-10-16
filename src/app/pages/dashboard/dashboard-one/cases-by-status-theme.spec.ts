describe('Cases by status chart label colors', () => {
  it('keeps donut percentages white in both themes, including live theme changes', () => {
    const previousTheme = document.body.getAttribute('data-layout-color');
    const chart = document.createElement('div');
    chart.className = 'cases-by-status-chart';
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.classList.add('apexcharts-datalabel');
    label.style.fill = '#f00';
    chart.appendChild(label);
    document.body.appendChild(chart);
    try {
      document.body.setAttribute('data-layout-color', 'light');
      expect(getComputedStyle(label).fill).toBe('rgb(255, 255, 255)');
      document.body.setAttribute('data-layout-color', 'dark');
      expect(getComputedStyle(label).fill).toBe('rgb(255, 255, 255)');
      document.body.setAttribute('data-layout-color', 'light');
      expect(getComputedStyle(label).fill).toBe('rgb(255, 255, 255)');
    } finally {
      chart.remove();
      if (previousTheme === null) document.body.removeAttribute('data-layout-color');
      else document.body.setAttribute('data-layout-color', previousTheme);
    }
  });
});
