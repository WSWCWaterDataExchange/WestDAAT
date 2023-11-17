
interface SortableHeaderProps {
  label: string;
  dataType: "string" | "number" | "date" | "null" | "[]";
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (newSortBy: string, newSortOrder: "asc" | "desc") => void;
}

function SortableHeader({
  label,
  dataType,
  sortBy,
  sortOrder,
  onSortChange,
}: SortableHeaderProps) {
  const isSorting = sortBy === label;
  const icon = isSorting && sortOrder === "asc" ? "▲" : "▼";

  const handleClick = () => {
    onSortChange(label, isSorting && sortOrder === "asc" ? "desc" : "asc");
  };

  const compareValues = (valueA: any, valueB: any) => {
    if (valueA === null) return sortOrder === "asc" ? 1 : -1;
    if (valueB === null) return sortOrder === "asc" ? -1 : 1;

    if (dataType === "string" || dataType === "date") {
      return valueA.localeCompare(valueB);
    } else if (dataType === "number") {
      return valueA - valueB;
    } else {
      return 0; // For handling 'null' type
    }
  };

  return (
    <th onClick={handleClick} className="sortable-header">
      <div className="sort-header">
        <span className="header-label">{label}</span>
        {isSorting && <span className="sort-arrow">{icon}</span>}
      </div>
    </th>
  );
}

export default SortableHeader;
