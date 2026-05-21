const CHARLA_PROJECT_ID = '9300e2a6-5ab5-433a-8384-ae55641f510e';
const CHARLA_SCRIPT_SRC = 'https://app.charla.com/widget/widget.js';

export function loadCharlaWidgetWhenIdle() {
  if (typeof window === 'undefined') return;

  const loadWidget = () => {
    if (document.querySelector('charla-widget')) return;

    const widgetElement = document.createElement('charla-widget');
    widgetElement.setAttribute('p', CHARLA_PROJECT_ID);
    document.body.appendChild(widgetElement);

    if (document.querySelector(`script[src="${CHARLA_SCRIPT_SRC}"]`)) return;
    const widgetCode = document.createElement('script');
    widgetCode.src = CHARLA_SCRIPT_SRC;
    widgetCode.async = true;
    document.body.appendChild(widgetCode);
  };

  if (document.readyState === 'complete') {
    loadWidget();
    return;
  }

  window.addEventListener('load', loadWidget, { once: true });
}
