import { useState, useEffect } from "react";
import "./App.css";

type Fundraiser = {
  year: string;
  title: string;
  description: string;
  amountRaised: number;
  _id: string;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amountRaised, setAmountRaised] = useState(0);
  const [currentFundraiserId, setCurrentFundraiserId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        setLoading(true);

        const response = await fetch("http://localhost:5001/api/fundraisers");
        const responseData = await response.json();
        setFundraisers(responseData);
        console.log("responseData", responseData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFundraisers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fundraiserData = {
      year,
      amountRaised,
      description,
      title,
    };

    try {
      let response: Response;

      if (currentFundraiserId) {
        // Update existing
        response = await fetch(
          `http://localhost:5001/api/fundraisers/${currentFundraiserId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fundraiserData),
          },
        );
      } else {
        // Create new
        response = await fetch("http://localhost:5001/api/fundraisers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fundraiserData),
        });
      }

      if (!response.ok) {
        throw new Error(
          `Failed to ${currentFundraiserId ? "update" : "create"} fundraiser`,
        );
      }

      const data = await response.json();

      if (currentFundraiserId) {
        setFundraisers((prev) =>
          prev.map((f) => (f._id === currentFundraiserId ? data : f)),
        );
        setCurrentFundraiserId(null); // clear edit mode
      } else {
        setFundraisers((prev) => [...prev, data]);
      }

      // Reset form
      setYear("");
      setTitle("");
      setDescription("");
      setAmountRaised(0);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleDelete = async (fundraiserId: string) => {
    console.log("well did we get here sister", fundraiserId);
    const fundRaiserToDelete = fundraisers.find((f) => f._id === fundraiserId);
    if (!fundRaiserToDelete) {
      return "nothing to delete, chill";
    }
    try {
      const response = await fetch(
        `http://localhost:5001/api/fundraisers/${fundraiserId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to create fundraiser");
      }
      const data = await response.json();
      setFundraisers((prev) => prev.filter((f) => f._id !== fundraiserId));
      console.log("Created", data);
      setYear("");
      setTitle("");
      setDescription("");
      setAmountRaised(0);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleUpdate = (fundraiserId: string) => {
    setCurrentFundraiserId(fundraiserId);
    const currentFundraiser = fundraisers.find((f) => f._id === fundraiserId);
    if (!currentFundraiser) return;
    setYear(currentFundraiser.year);
    setAmountRaised(currentFundraiser.amountRaised);
    setDescription(currentFundraiser.description);
    setTitle(currentFundraiser.title);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("fundraisers", fundraisers);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {fundraisers.map((f) => {
          return (
            <div
              key={f._id}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <div>{f.year}</div>
              <div style={{ fontWeight: "bold" }}>{f.title}</div>
              <div>{f.description}</div>
              <div>amount raised: {f.amountRaised}</div>
              <button onClick={() => handleUpdate(f._id)}>Update</button>
              <button onClick={() => handleDelete(f._id)}>Delete</button>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <div>Year</div>
          <input
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
          <div>Title</div>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <div>Description</div>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div>Amount Raised</div>
          <input
            type="number"
            value={amountRaised}
            onChange={(event) => setAmountRaised(event.target.valueAsNumber)}
          />
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}

export default App;
