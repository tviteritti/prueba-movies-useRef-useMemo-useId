import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Movies } from "./components/Movies";
import { useMovies } from "./hooks/useMovies";
import debounce from "just-debounce-it";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }

    if (search === "") {
      setError("No se puede buscar una pelicula vacia.");
      return;
    }

    if (search.match(/^\d+$/)) {
      setError("No se puede buscar una pelicula con un numero.");
      return;
    }

    if (search.length < 3) {
      setError("La busqueda debe tener al menos 3 caracteres");
      return;
    }

    setError(null);
  }, [search]);

  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);

  const { search, updateSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovies({ search, sort });

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies({search});
  };

  const handleSort = () => {
    setSort(!sort);
  };

  const debounceGetMovies = useCallback(
    debounce(search => {
      console.log("search: ", search);
      getMovies({search});
    },300)
    ,[getMovies]
  )

  const handleChange = (event) => {
    const newSearch = event.target.value;
    /* if (newSearch.startsWith(" ")) return; */
    updateSearch(newSearch);
    debounceGetMovies(newSearch)
  };

  return (
    <div className="page">
      <header>
        <h1>Buscador de peliculas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            style={{
              border: "1px solid transparent",
              borderColor: error ? "error" : "transparent",
            }}
            onChange={handleChange}
            value={search}
            name="query"
            placeholder="Avenger, Star Wars, The Matrix..."
          />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type="submit">Buscar</button>
        </form>
        {error && <p style={{ error: "red" }}>{error}</p>}
      </header>

      <main>{loading ? <p>Cargando....</p> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
