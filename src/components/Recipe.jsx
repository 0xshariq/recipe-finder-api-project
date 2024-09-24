import React, { useState } from "react";

function Recipe() {
  const [recipe, setRecipe] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const getNutrition = async () => {
    if (!recipe.trim()) {
      setError("Please enter a recipe name.");
      return;
    }

    setLoading(true);
    const apiUrl = `https://api.api-ninjas.com/v1/recipe?query=${recipe}`;
    const apiKey = "c4N0gXW1zyrSkuVUWCdRuQ==52IOjUi1WsDoQgNp";
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network Connection Error");
      }

      const data = await response.json();
      if (data.length === 0) {
        setError("No recipes found. Please try another query.");
        setData(null);
      } else {
        setData(data);
        setHistory((prevHistory) => [...prevHistory, { title: data[0].title, query: recipe }]);
        setError("");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    getNutrition();
  };

  const handleReset = () => {
    setRecipe("");
    setData(null);
    setError("");
  };

  const toggleFavorite = (recipeTitle) => {
    if (favorites.includes(recipeTitle)) {
      setFavorites(favorites.filter((title) => title !== recipeTitle));
    } else {
      setFavorites([...favorites, recipeTitle]);
    }
  };

  return (
    <div className="container">
      <h1>Recipe App</h1>
      <input
        type="text"
        value={recipe}
        onChange={(e) => setRecipe(e.target.value)}
        placeholder="Enter dish name"
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {data && data.length > 0 ? (
        <div>
          <h2>{data[0].title}</h2>

          <p><strong>Ingredients:</strong></p>
          <ul>
            {data[0].ingredients.split(", ").map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <p><strong>Instructions:</strong></p>
          <ol>
            {data[0].instructions.split(". ").map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>

          <p><strong>Servings:</strong> {data[0].servings}</p>
          <button onClick={() => toggleFavorite(data[0].title)}>
            {favorites.includes(data[0].title) ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      ) : (
        data && <p>No data available</p>
      )}

      <br />
      <button onClick={handleSubmit}>Get Recipe</button>
      <button onClick={handleReset}>Clear</button>

      <h2>Search History</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            {item.title} ({item.query})
          </li>
        ))}
      </ul>

      <h2>Favorites</h2>
      <ul>
        {favorites.map((fav, index) => (
          <li key={index}>{fav}</li>
        ))}
      </ul>
    </div>
  );
}

export default Recipe;
