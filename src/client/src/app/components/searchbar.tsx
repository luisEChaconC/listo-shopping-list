import { useState } from "react";
import type { Product } from '@/models/product';

interface SearchBarProps {
  items: Product[];
  onSelect: (item: Product, is_new: string) => void;
}

export default function SearchBar({ items, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");

  //Aqui se refilterea despues de escribir
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    //El input debe capturar el texto, y reacciona con el onChange
    <div className="w-full">
      <input
        type="text"
        placeholder="Agregar producto..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      {/* Rellenamos las sugerencias*/}
      {query !== "" && (
        <div className="border mt-2 rounded max-h-60 overflow-y-auto bg-white">
          {filtered.length === 0 && (
            <div className="p-2 text-gray-500">No encontrado</div>
          )}

          {filtered.map(item => (
            <div
              key={item.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(item, "No")}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
