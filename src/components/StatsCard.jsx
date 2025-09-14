import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin } from 'lucide-react';
import "./StatsCard.css";
const StatsCards = ({ stats, loading }) => {
  const statsConfig = [
    {
      icon: Calendar,
      number: stats.upcoming,
      label: 'Upcoming Events',
      iconColor: 'icon-blue',
      bgColor: 'bg-blue'
    },
    {
      icon: Users,
      number: stats.registered,
      label: 'Your Registrations',
      iconColor: 'icon-green',
      bgColor: 'bg-green'
    },
    {
      icon: MapPin,
      number: stats.cities,
      label: 'Cities with Events',
      iconColor: 'icon-purple',
      bgColor: 'bg-purple'
    }
  ];

  if (loading) {
    return (
      <div className="stats-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="stat-card loading">
            <div className="loading-content">
              <div className="loading-circle"></div>
              <div className="loading-box small"></div>
              <div className="loading-box medium"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <div className="stat-content">
              <motion.div
                className={`stat-icon ${stat.bgColor}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Icon className={`icon ${stat.iconColor}`} />
              </motion.div>
              <motion.div
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 500, damping: 25 }}
              >
                {stat.number}
              </motion.div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;
