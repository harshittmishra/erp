export default class Search {
  constructor(options, source, renderer) {
    this.options = options;
    this.source = source;
    this.renderer = renderer;

    this.results = new Map();

    this.query = "";
    this.controller = null;
    this.timer = null;
    this.requestId = 0;

    this.handleInput = this.handleInput.bind(this);
  }

  init() {
    if (!this.renderer.searchInput) return;
    this.renderer.searchInput.addEventListener("input", this.handleInput);
  }

  handleInput(event) {
    const query = event.target.value.trim();

    this.search(query);
  }

  search(query) {
    this.query = query;

    clearTimeout(this.timer);

    // Cancel any previous remote request.
    this.abort();

    if (!query) {
      this.reset();
      return;
    }

    // Debounce remote requests.
    this.timer = setTimeout(() => {
      this.execute(query);
    }, this.options.searchDelay ?? 300);
  }

  async execute(query) {
    if (this.options.remoteSearch) {
      await this.remoteSearch(query);
    } else {
      this.localSearch(query);
    }
  }

  localSearch(query) {
    const keyword = query.toLowerCase();

    const results = new Map();

    for (const [value, option] of this.source.data) {
      if (String(option.label).toLowerCase().includes(keyword)) {
        results.set(value, option);
      }
    }

    this.options.onSearch?.(results, this);
    this.setResults(results);
  }

  async remoteSearch(query) {
    const requestId = ++this.requestId;

    try {
      let data;

      if (typeof this.options.onSearch === "function") {
        data = await this.options.onSearch(query, {
          options: this.options,
          source: this.source,
          signal: this.controller?.signal,
        });
      } else {
        data = await this.fetchResults(query);
      }

      // Ignore outdated responses.
      if (requestId !== this.requestId) return;

      const normalized = new Map();

      if (!Array.isArray(data)) {
        throw new TypeError("Search results must be an array.");
      }

      data.forEach((option) => {
        const value = String(option.value);

        if (normalized.has(value)) {
          throw new Error(`Duplicate option value: ${value}`);
        }

        normalized.set(value, option);
      });

      this.setResults(normalized);
    } catch (error) {
      if (error.name === "AbortError") return;

      if (requestId === this.requestId) {
        console.error("Search failed:", error);
      }
    }
  }

  async fetchResults(query) {
    const url = new URL(this.options.data, window.location.href);

    url.searchParams.set("s", query);

    this.controller = new AbortController();

    const response = await fetch(url, {
      ...this.options.fetchOptions,
      signal: this.controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Search request failed: ${response.status}`);
    }

    return await response.json();
  }

  setResults(results) {
    this.results = results;
    this.renderer.render(results);
  }

  reset() {
    this.renderer.render();
  }

  abort() {
    this.requestId++;
    this.controller?.abort();
    this.controller = null;
  }

  destroy() {
    clearTimeout(this.timer);
    this.abort();
    this.renderer.searchInput?.removeEventListener("input", this.handleInput);
  }
}
