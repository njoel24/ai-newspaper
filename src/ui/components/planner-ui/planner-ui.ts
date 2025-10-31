export class PlannerUI extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-family: sans-serif;
        }
        button {
          background: #0078ff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
        }
      </style>
      <h3>🧠 Planner Agent</h3>
      <p>Generate new article plans based on trends.</p>
      <button id="runBtn">Run Planner</button>
      <pre id="output"></pre>
    `;
  }

  connectedCallback() {
    this.shadowRoot!.querySelector('#runBtn')!.addEventListener('click', async () => {
      const output = this.shadowRoot!.querySelector('#output')!;
      output.textContent = 'Running...';
      try {
        const res = await fetch('/api/agents/planner');
        const data = await res.json();
        if (!res.ok) {
          output.textContent = data?.error || 'Unexpected error occurred.';
          return;
        }
        output.textContent = JSON.stringify(data, null, 2);
      } catch (err: any) {
        output.textContent = err?.message || 'Unexpected error occurred.';
      }
    });
  }
}

if (typeof customElements !== 'undefined') {
  customElements.define('planner-ui', PlannerUI as any);
}
