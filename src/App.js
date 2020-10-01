import React, { useState, useEffect } from 'react';
import './css/app.css';
import axios from 'axios';

import { Bar } from 'react-chartjs-2';

function App() {

  const [latestCase, setLatestCase] = useState({
    confirmed: 0,
    date: '',
    positive: 0,
    death: 0,
    recovered: 0,
  });
  const [periodComfirmed, setPeriodConfirmed] = useState({});
  const [periodDeath, setPeriodDeath] = useState({});
  const [periodRecovered, setPeriodRecovered] = useState({});

  useEffect(() => {
    axios.get('https://api.covid19api.com/total/country/saint-vincent-and-the-grenadines')
      .then((response) => {
        getTotalCase(response.data);
        getPeriod(response.data);
        getDeath(response.data);
        getRecovered(response.data);
      });
  }, []);

  const getTotalCase = (data) => {
    let latestData = data.pop();
    var dateParse = new Date(latestData.Date);
    setLatestCase({
      confirmed: latestData.Confirmed,
      date: dateParse.toString(),
      positive: latestData.Active,
      death: latestData.Deaths,
      recovered: latestData.Recovered,
    });
  }

  const changeDateFormat = (date) => {
    var dateParse = new Date(date);
    return (dateParse.getDate()+"-"+dateParse.getMonth()+"-"+dateParse.getFullYear());
  }

  const getPeriod = (data) => {
    let labels = data.map((label) => changeDateFormat(label.Date));
    let confirms = data.map((confirm, index) => {
      if(index != 0){
        return (confirm.Confirmed - data[index-1].Confirmed);
      }else{
        return confirm.Confirmed;
      }
    });
    setPeriodConfirmed({
      labels: labels,
      datasets: [
        {
          label: 'Total of covid disease confirmed',
          backgroundColor: '#faf089',
          data: confirms
        }
      ]
    })
  }

  const getDeath = (data) => {
    let labels = data.map((label) => changeDateFormat(label.Date));
    let deaths = data.map((death, index) => {
      if(index != 0){
        return (death.Deaths - data[index-1].Deaths);
      }else{
        return death.Deaths;
      }
    });
    setPeriodDeath({
      labels: labels,
      datasets: [
        {
          label: 'Total of covid disease deaths',
          backgroundColor: '#feb2b2',
          data: deaths
        }
      ]
    })
  }

  const getRecovered = (data) => {
    let labels = data.map((label) => changeDateFormat(label.Date));
    let recovered = data.map((recover, index) => {
      if(index != 0){
        return (recover.Recovered - data[index-1].Recovered);
      }else{
        return recover.Recovered;
      }
    });
    setPeriodRecovered({
      labels: labels,
      datasets: [
        {
          label: 'Total of covid disease recovered',
          backgroundColor: '#9ae6b4',
          data: recovered
        }
      ]
    })
  }

  return (
    <div className="App">
      <div className="mb-20">
        <div className="text-center p-5 rounded">
          <h2 className="text-3xl leading-9 font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            Saint Vincent and Grenadines
            <br />
            <span className="text-indigo-600 font-thin">Covid-19 Graph</span>
          </h2>
        </div>
        <div className="my-4 md:mt-0 w-100 text-center">
          <p className="mt-2 text-gray-600">Realtime count and graph about saint vincent and grenadines covid disease</p>
        </div>
      </div>
      <hr />
      <p className="mt-5 text-center text-xl">Latest confirmed from <br /> {latestCase.date}</p>
      <div className="grid grid-cols-3 gap-4 justify-center my-3">
        <div className="col-start-2 col-span-1 p-5 rounded">
          <h2 className="text-3xl font-bold text-center text-indigo-600">
            {latestCase.confirmed} Cases
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 justify-center my-3">
        <div className="col-span-1 bg-yellow-200 rounded p-5 text-center rounded font-bold">
          {latestCase.positive} Actives
        </div>
        <div className="col-span-1 bg-red-200 rounded p-5 text-center rounded font-bold">
          {latestCase.death} Deaths
        </div>
        <div className="col-span-1 bg-teal-200 rounded p-5 text-center rounded font-bold">
          {latestCase.recovered} Recovered
        </div>
      </div>
      <p className="mt-20 text-center text-xl font-bold">Daily Confirm Statistics</p>
      <div className="lg:px-20 sm:px-20 p-5 bg-gray-50">
        <Bar
          data={periodComfirmed}
          height={50}
          width={50}
        />
      </div>
      <p className="mt-20 text-center text-xl font-bold">Daily Deaths Statistics</p>
      <div className="lg:px-20 sm:px-20 p-5 bg-gray-50">
        <Bar
          data={periodDeath}
          height={50}
          width={50}
        />
      </div>
      <p className="mt-20 text-center text-xl font-bold">Daily Recovered Statistics</p>
      <div className="lg:px-20 sm:px-20 p-5 bg-gray-50">
        <Bar
          data={periodRecovered}
          height={50}
          width={50}
        />
      </div>
    </div>
  );
}

export default App;
