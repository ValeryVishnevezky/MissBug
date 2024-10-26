const { useState, useEffect } = React;

export function BugFilter({ onSetFilter, filterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  useEffect(() => {
    onSetFilter(filterByToEdit);
  }, [filterByToEdit]);

  function onFilter(ev) {
    ev.preventDefault();
    onSetFilter(filterByToEdit);
  }

  function handleChange({ target }) {
    let { value, name: field, type, checked } = target;
    if (field === "createdAt" && type === "date")
      value = new Date(value).getTime();
    if (type === "number") value = +value;
	if (field === "sortDir") value = checked ? "-1" : "1"
    setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }));
  }

  function togglePagination() {
    setFilterByToEdit((prevFilter) => {
      return {
        ...prevFilter,
        pageIdx: prevFilter.pageIdx === undefined ? 0 : undefined,
      };
    });
  }

  function onChangePage(diff) {
    if (filterBy.pageIdx === undefined) return;
    setFilterByToEdit((prevFilter) => {
      let nextPageIdx = prevFilter.pageIdx + diff;
      if (nextPageIdx < 0) nextPageIdx = 0;
      return { ...prevFilter, pageIdx: nextPageIdx };
    });
  }

  return (
    <section className="bugs-filter">
      <h2>Filter our bugs</h2>

      <form onSubmit={onFilter}>
		<div className="bugs-filter-inputs">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={filterByToEdit.title}
          onChange={handleChange}
          placeholder="By title"
        />
		</div>

		<div className="bugs-filter-inputs">
        <label htmlFor="minSeverity">Min severity</label>
        <input
          type="number"
          id="minSeverity"
          name="minSeverity"
          value={filterByToEdit.minSeverity || ""}
          onChange={handleChange}
          placeholder="By min severity"
        />
		</div>

		<div className="bugs-filter-inputs">
        <label htmlFor="createdAt">Created At</label>
        <input
          type="number"
          id="createdAt"
          name="createdAt"
          value={filterByToEdit.createdAt || ""}
          onChange={handleChange}
          placeholder="By created date"
        />
		</div>

		<div className="bugs-filter-inputs">
        <label htmlFor="labels">Labels</label>
        <input
          type="text"
          id="labels"
          name="labels"
          value={filterByToEdit.labels || ""}
          onChange={handleChange}
          placeholder="By labels"
        />
		</div>

		<div className="bugs-filter-inputs">
        <label htmlFor="sortBy">Sort By</label>
        <select
          name="sortBy"
          value={filterBy.sortBy || ""}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="title">Title</option>
          <option value="severity">Severity</option>
        </select>
		</div>

		<div className="bugs-filter-inputs">
        <label htmlFor="sortDir">Direction</label>
        <input
          type="checkbox"
          name="sortDir"
          checked={filterBy.sortDir === "-1"}
          onChange={handleChange}
        />
		</div>
      </form>

      <section>
        <button onClick={togglePagination}>Pagination</button>
        <button onClick={() => onChangePage(-1)}><i className="fa-solid fa-minus"></i></button>
        {filterBy.pageIdx + 1 || "No Pagination"}
        <button onClick={() => onChangePage(1)}><i className="fa-solid fa-plus"></i></button>
      </section>

    </section>
  );
}
