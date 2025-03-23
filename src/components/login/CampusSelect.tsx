interface CampusSelectProps {
    value: string;
    onChange: (value: string) => void;
  }
  
  const CampusSelect = ({ value, onChange }: CampusSelectProps) => {
    return (
      <div className="mb-6">
        <label htmlFor="campus" className="block mb-2 text-lg font-medium">
          Select Campus
        </label>
        <select
          id="campus"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="p-3 border rounded w-full"
        >
          <option value="">-- Select Campus --</option>
          <option value="campus1">Campus 1</option>
          <option value="campus2">Campus 2</option>
          <option value="campus3">Campus 3</option>
        </select>
      </div>
    );
  };
  
  export default CampusSelect;
  