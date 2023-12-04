import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import _ from 'lodash';

const StatisticsPage = () => {
  const [activityData, setActivityData] = useState([]);

  // Uusi koukku datan hakemiselle
  useEffect(() => {
    fetch('https://traineeapp.azurewebsites.net/gettrainings')
      .then(response => response.json())
      .then(data => {
        // lodash-kirjasto datan käsittelyyn
        const activityStats = _.groupBy(data, 'activity');

        // activityStats-taulukko Recharts BarChartin käyttämään muotoon
        const formattedData = Object.keys(activityStats).map(activity => ({
          activity,
          minutes: _.sumBy(activityStats[activity], 'duration'),
        }));

        setActivityData(formattedData);
      })
      .catch(err => console.error(err));
  }, []); // [] tarkoittaa, että useEffect suoritetaan vain kerran komponentin ensimmäisellä renderöinnillä

  return (
    <div style={{ height: '700px', width: '90%', margin: 'auto' }}>
      <BarChart
        width={1000}
        height={500}
        data={activityData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barCategoryGap={20}
      >
        <CartesianGrid 
          horizontal={true} 
          vertical={false} 
          stroke="#ebf3f0" 
        />
        <XAxis 
          dataKey="activity" 
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar 
          dataKey="minutes" 
          fill="#8884d8" 
          name="Duration (minutes)" 
        />
      </BarChart>
    </div>
  );
};

export default StatisticsPage;
