import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, User } from "lucide-react"; // simple icons
import "./AlumniMapPage.css";
import { supabase } from "../store/supaBaseClient";

export default function AlumniMapPage() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [loading, setLoading] = useState(true);

  // Fetch alumni from Supabase
  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles") // or "alumni"
        .select("id, name, city, country");

      if (error) {
        console.error("❌ Error fetching alumni:", error.message);
      } else {
        setAlumni(data || []);
      }
      setLoading(false);
    };

    fetchAlumni();
  }, []);

  // --- Stats ---
  const countries = [...new Set(alumni.map((a) => a.country))].length;
  const cities = [...new Set(alumni.map((a) => a.city))].length;
  const alumniCount = alumni.length;

  // --- Filtered list ---
  const filtered = alumni.filter(
    (a) =>
      (selectedCity === "All Cities" || a.city === selectedCity) &&
      (a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.city?.toLowerCase().includes(search.toLowerCase()) ||
        a.country?.toLowerCase().includes(search.toLowerCase()))
  );

  const cityCounts = alumni.reduce((acc, a) => {
    acc[a.city] = (acc[a.city] || 0) + 1;
    return acc;
  }, {});
  const topCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);

  return (
    <motion.div
      className="alumni-map-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="title">Our Alumni</h2>
      <p className="subtitle">
        Discover where our alumni are making their mark around the world
      </p>

      {/* Stats Cards */}
      <div className="stats-cards">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <span>🌎</span>
          <h3>{countries}</h3>
          <p>Countries</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <span>🏙️</span>
          <h3>{cities}</h3>
          <p>Cities</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <span>👥</span>
          <h3>{alumniCount}</h3>
          <p>Alumni</p>
        </motion.div>
      </div>

      <div className="map-section">
        {/* Left side: Alumni list */}
        <div className="map-panel">
          <div className="map-header">
            <input
              type="text"
              placeholder="Search by name, city, or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option>All Cities</option>
              {[...new Set(alumni.map((a) => a.city))].map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p>Loading alumni...</p>
          ) : (
            <div className="alumni-list">
              {filtered.map((alum) => (
                <motion.div
                  key={alum.id}
                  className="alumni-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="alumni-icon">
                    <User size={32} />
                  </div>
                  <div className="alumni-info">
                    <strong>{alum.name}</strong>
                    <p>
                      <MapPin size={14} /> {alum.city}, {alum.country}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right side: Top Cities */}
        <div className="city-panel">
          <h3>Top Cities</h3>
          <ul>
            {topCities.map(([city, count], idx) => {
              const country = alumni.find((a) => a.city === city)?.country;
              return (
                <li key={city}>
                  <span className="rank">{idx + 1}</span>
                  <div>
                    <strong>{city}</strong>
                    <p>{country}</p>
                  </div>
                  <span className="badge">{count} alumni</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
