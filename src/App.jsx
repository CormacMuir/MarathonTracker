import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Circle, Clock, MapPin, Target, Trophy, CloudRain, Sun, Cloud, Wind, ExternalLink, Plus, X } from 'lucide-react';

const MarathonTracker = () => {
  const [completedSessions, setCompletedSessions] = useState(new Set());
  const [currentWeek, setCurrentWeek] = useState(1);
  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [stravaActivities, setStravaActivities] = useState({});
  const [stravaAccessToken, setStravaAccessToken] = useState('');
  const [stravaConnected, setStravaConnected] = useState(false);
  const [suggestedActivities, setSuggestedActivities] = useState({});

  const trainingPlan = {
    "goal": "3:21",
    "race_date": "2025-10-12T00:00:00",
    "weeks": [
      {
        "week": 1,
        "start_date": "2025-08-18",
        "end_date": "2025-08-24",
        "sessions": [
          {
            "date": "2025-08-19",
            "title": "5km Easy Run",
            "details": "5km at conversational pace (≤5:15/km)."
          },
          {
            "date": "2025-08-20",
            "title": "Tempo 5km",
            "details": "1.5km warm-up; 5km at 4:20/km (4:10-4:30/km), 150s walk rest; 1.5km cool-down."
          },
          {
            "date": "2025-08-22",
            "title": "Tempo 2km",
            "details": "2km warm-up; 2km at 4:10/km (4:00-4:20/km), 120s walk rest; 1km cool-down."
          },
          {
            "date": "2025-08-24",
            "title": "16km Long Run",
            "details": "4km easy; 8km at 4:40/km (MP); 4km easy."
          }
        ]
      },
      {
        "week": 2,
        "start_date": "2025-08-25",
        "end_date": "2025-08-31",
        "sessions": [
          {
            "date": "2025-08-26",
            "title": "5km Easy Run",
            "details": "5km at conversational pace (≤5:15/km)."
          },
          {
            "date": "2025-08-27",
            "title": "400m Repeats",
            "details": "2km warm-up; 2x(3x400m at 3:45/km, 60s walk rest), 60s rest between sets; 1.6km cool-down."
          },
          {
            "date": "2025-08-29",
            "title": "6.5km Easy Run",
            "details": "6.5km easy at conversational pace (≤5:15/km)."
          },
          {
            "date": "2025-08-31",
            "title": "20km Long Run",
            "details": "20km at conversational pace."
          }
        ]
      },
      {
        "week": 3,
        "start_date": "2025-09-01",
        "end_date": "2025-09-07",
        "sessions": [
          {
            "date": "2025-09-02",
            "title": "5km Easy Run",
            "details": "Conversational pace (≤5:15/km)."
          },
          {
            "date": "2025-09-03",
            "title": "400m Repeats",
            "details": "2km warm-up; 4x400m at 3:45-3:55/km with 60s rest; 1.6km cool-down."
          },
          {
            "date": "2025-09-05",
            "title": "Tempo 6km",
            "details": "2km warm-up; 6km at ~5:10/km; 1km cool-down."
          },
          {
            "date": "2025-09-07",
            "title": "22km Long Run",
            "details": "6km easy; 10km at MP (~4:46/km); 6km easy."
          }
        ]
      },
      {
        "week": 4,
        "start_date": "2025-09-08",
        "end_date": "2025-09-14",
        "sessions": [
          {
            "date": "2025-09-09",
            "title": "6km Easy Run",
            "details": "Conversational pace."
          },
          {
            "date": "2025-09-10",
            "title": "Tempo 8km (Cutdown)",
            "details": "2km warm-up; 8km (4km at 5:15/km, 4km at 5:05/km); 1km cool-down."
          },
          {
            "date": "2025-09-12",
            "title": "400m Repeats",
            "details": "2km warm-up; 5x400m at 3:45/km with 60s rest; 1.6km cool-down."
          },
          {
            "date": "2025-09-14",
            "title": "25km Long Run",
            "details": "6km easy; 10km at MP; 9km at ~5:05/km."
          }
        ]
      },
      {
        "week": 5,
        "start_date": "2025-09-15",
        "end_date": "2025-09-21",
        "sessions": [
          {
            "date": "2025-09-16",
            "title": "6km Easy Run",
            "details": "Conversational pace."
          },
          {
            "date": "2025-09-17",
            "title": "1km Repeats",
            "details": "2km warm-up; 5x1km at ~4:30/km (HMP) with 90s rest; 1km cool-down."
          },
          {
            "date": "2025-09-19",
            "title": "Tempo 10km",
            "details": "2km warm-up; 10km at ~5:10/km; 1km cool-down."
          },
          {
            "date": "2025-09-21",
            "title": "28km Long Run",
            "details": "8km easy; 12km at MP; 8km easy."
          }
        ]
      },
      {
        "week": 6,
        "start_date": "2025-09-22",
        "end_date": "2025-09-28",
        "sessions": [
          {
            "date": "2025-09-23",
            "title": "6km Easy Run",
            "details": "Conversational pace."
          },
          {
            "date": "2025-09-25",
            "title": "Tempo / Cutdown 10km",
            "details": "2km warm-up; 10km starting at 5:15/km finishing at 5:00/km; 1km cool-down."
          },
          {
            "date": "2025-09-27",
            "title": "6km Easy Run",
            "details": "Conversational pace."
          },
          {
            "date": "2025-09-28",
            "title": "Half Marathon Pace Simulation",
            "details": "21.1km at MP (~4:46/km). Practice fueling."
          }
        ]
      },
      {
        "week": 7,
        "start_date": "2025-09-29",
        "end_date": "2025-10-05",
        "sessions": [
          {
            "date": "2025-09-30",
            "title": "6km Easy Run",
            "details": "Conversational pace."
          },
          {
            "date": "2025-10-01",
            "title": "800m Repeats",
            "details": "2km warm-up; 4x800m at ~3:55/km with 90s rest; 1km cool-down."
          },
          {
            "date": "2025-10-03",
            "title": "Tempo 8km",
            "details": "2km warm-up; 8km at ~5:05/km; 1km cool-down."
          },
          {
            "date": "2025-10-05",
            "title": "20km Long Run",
            "details": "6km easy; 10km at MP; 4km at ~5:00/km."
          }
        ]
      },
      {
        "week": 8,
        "start_date": "2025-10-06",
        "end_date": "2025-10-12",
        "sessions": [
          {
            "date": "2025-10-07",
            "title": "5km Easy Run + Strides",
            "details": "5km easy + 6x20s strides."
          },
          {
            "date": "2025-10-09",
            "title": "Sharpening Intervals",
            "details": "2km warm-up; 2x1 mile (1.6km) at MP with 3min jog; 1km cool-down."
          },
          {
            "date": "2025-10-12",
            "title": "Melbourne Marathon",
            "details": "42.2km. Goal pace ~4:46/km. Target finish: 3:21. Fuel every 45min."
          }
        ]
      }
    ]
  };

  // Load completed sessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('marathon-completed-sessions');
    if (saved) {
      setCompletedSessions(new Set(JSON.parse(saved)));
    }
    
    // Load Strava activity URLs
    const savedStrava = localStorage.getItem('marathon-strava-activities');
    if (savedStrava) {
      setStravaActivities(JSON.parse(savedStrava));
    }

    const savedToken = import.meta.env.VITE_STRAVA_ACCESS_TOKEN; // Use Vite's environment variable syntax
    if (savedToken) {
      setStravaAccessToken(savedToken);
    }
  }, []);

  // Find current week based on today's date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const week = trainingPlan.weeks.find(w => 
      today >= w.start_date && today <= w.end_date
    );
    if (week) {
      setCurrentWeek(week.week);
      fetchWeatherForWeek(week);
    }
  }, []);

  // Fetch weather data for the current week using Open-Meteo API
  const fetchWeatherForWeek = async (week) => {
    if (!week) return;
    
    setWeatherLoading(true);
    const newWeatherData = {};
    
    try {
      // Melbourne coordinates
      const lat = -37.8136;
      const lon = 144.9631;
      
      // Get all session dates for this week
      const sessionDates = week.sessions.map(s => s.date);
      const startDate = sessionDates[0];
      const endDate = sessionDates[sessionDates.length - 1];
      
      // Fetch weather data from Open-Meteo API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,relative_humidity_2m_max&timezone=Australia/Melbourne&start_date=${startDate}&end_date=${endDate}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Map weather codes to descriptions and icons
        const getWeatherInfo = (code) => {
          if (code <= 3) return { description: 'Clear/Partly cloudy', icon: 'sun' };
          if (code <= 48) return { description: 'Cloudy/Foggy', icon: 'cloud' };
          if (code <= 67) return { description: 'Light rain', icon: 'rain' };
          if (code <= 82) return { description: 'Rain showers', icon: 'rain' };
          if (code <= 99) return { description: 'Thunderstorms', icon: 'rain' };
          return { description: 'Clear', icon: 'sun' };
        };
        
        // Process each session date by matching with API response dates
        week.sessions.forEach((session) => {
          if (data.daily && data.daily.time) {
            const sessionDateIndex = data.daily.time.findIndex(date => date === session.date);
            
            if (sessionDateIndex !== -1) {
              const weatherInfo = getWeatherInfo(data.daily.weathercode[sessionDateIndex]);
              newWeatherData[session.date] = {
                temp: Math.round((data.daily.temperature_2m_max[sessionDateIndex] + data.daily.temperature_2m_min[sessionDateIndex]) / 2),
                tempMax: Math.round(data.daily.temperature_2m_max[sessionDateIndex]),
                tempMin: Math.round(data.daily.temperature_2m_min[sessionDateIndex]),
                humidity: data.daily.relative_humidity_2m_max[sessionDateIndex],
                windSpeed: Math.round(data.daily.windspeed_10m_max[sessionDateIndex]),
                description: weatherInfo.description,
                icon: weatherInfo.icon,
                code: data.daily.weathercode[sessionDateIndex]
              };
            }
          }
        });
      }
      
      setWeatherData(newWeatherData);
    } catch (error) {
      console.error('Weather fetch error:', error);
      // Don't set any weather data on error - just show nothing
      setWeatherData({});
    } finally {
      setWeatherLoading(false);
    }
  };

  const toggleSession = (sessionId) => {
    const newCompleted = new Set(completedSessions);
    const wasCompleted = newCompleted.has(sessionId);
    
    if (wasCompleted) {
      newCompleted.delete(sessionId);
    } else {
      newCompleted.add(sessionId);
      
      // Check for Strava match when marking as complete
      if (stravaConnected) {
        const [weekNum, date] = sessionId.split('-');
        const week = trainingPlan.weeks.find(w => w.week === parseInt(weekNum));
        const session = week?.sessions.find(s => s.date === date);
        
        if (session) {
          setTimeout(() => checkForStravaMatch(sessionId, date, session.title), 1000);
        }
      }
    }
    
    setCompletedSessions(newCompleted);
    localStorage.setItem('marathon-completed-sessions', JSON.stringify([...newCompleted]));
  };

  const addStravaActivity = (sessionId, activityUrl) => {
    const newActivities = { ...stravaActivities, [sessionId]: activityUrl };
    setStravaActivities(newActivities);
    localStorage.setItem('marathon-strava-activities', JSON.stringify(newActivities));
  };

  const removeStravaActivity = (sessionId) => {
    const newActivities = { ...stravaActivities };
    delete newActivities[sessionId];
    setStravaActivities(newActivities);
    localStorage.setItem('marathon-strava-activities', JSON.stringify(newActivities));
  };

  // Strava OAuth and API functions
  const connectStrava = () => {
    const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID; // Use Vite's environment variable syntax
    if (!clientId) return;
    
    localStorage.setItem('strava-client-id', clientId);
    
    const redirectUri = window.location.origin;
    const scope = 'read,activity:read';
    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    window.location.href = stravaAuthUrl;
  };

  const handleStravaCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const clientId = localStorage.getItem('strava-client-id');
    const clientSecret = import.meta.env.VITE_STRAVA_CLIENT_SECRET; // Use Vite's environment variable syntax
    if (code && clientId) {

      if (!clientSecret) return;
      
      try {
        const response = await fetch('https://www.strava.com/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code'
          })
        });
        
        const data = await response.json();
        
        if (data.access_token) {
          setStravaAccessToken(data.access_token);
          setStravaConnected(true);
          localStorage.setItem('strava-access-token', data.access_token);
          
          // Clear URL params
          window.history.replaceState({}, document.title, window.location.pathname);
          
          alert('Successfully connected to Strava!');
        }
      } catch (error) {
        console.error('Strava auth error:', error);
        alert('Failed to connect to Strava. Please try again.');
      }
    }
  };

  // Check for Strava callback on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code') && !stravaConnected) {
      handleStravaCallback();
    }
  }, []);

  // Fetch Strava activities for a specific date
  const fetchStravaActivitiesForDate = async (date) => {
    if (!stravaAccessToken) return [];
    
    try {
      const startOfDay = new Date(date + 'T00:00:00').getTime() / 1000;
      const endOfDay = new Date(date + 'T23:59:59').getTime() / 1000;
      
      const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?after=${startOfDay}&before=${endOfDay}&per_page=10`,
        {
          headers: {
            'Authorization': `Bearer ${stravaAccessToken}`
          }
        }
      );
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching Strava activities:', error);
    }
    
    return [];
  };

  // Check for matching Strava activities when a session is completed
  const checkForStravaMatch = async (sessionId, sessionDate, sessionTitle) => {
    if (!stravaConnected || stravaActivities[sessionId]) return;
    
    const activities = await fetchStravaActivitiesForDate(sessionDate);
    
    if (activities.length > 0) {
      // Find running activities
      const runningActivities = activities.filter(activity => 
        activity.type === 'Run' || activity.sport_type === 'Run'
      );
      
      if (runningActivities.length === 1) {
        // Single match - show confirmation
        const activity = runningActivities[0];
        setSuggestedActivities(prev => ({
          ...prev,
          [sessionId]: {
            activity,
            sessionTitle,
            sessionDate
          }
        }));
      } else if (runningActivities.length > 1) {
        // Multiple matches - let user choose
        const activityList = runningActivities.map((a, i) => 
          `${i + 1}. ${a.name} (${(a.distance / 1000).toFixed(1)}km, ${Math.floor(a.moving_time / 60)}min)`
        ).join('\n');
        
        const choice = prompt(`Multiple runs found for ${sessionDate}. Which one matches "${sessionTitle}"?\n\n${activityList}\n\nEnter number (1-${runningActivities.length}) or 0 to skip:`);
        const index = parseInt(choice) - 1;
        
        if (index >= 0 && index < runningActivities.length) {
          const activity = runningActivities[index];
          addStravaActivity(sessionId, `https://www.strava.com/activities/${activity.id}`);
        }
      }
    }
  };

  const acceptStravaMatch = (sessionId) => {
    const suggestion = suggestedActivities[sessionId];
    if (suggestion) {
      addStravaActivity(sessionId, `https://www.strava.com/activities/${suggestion.activity.id}`);
      setSuggestedActivities(prev => {
        const newSuggestions = { ...prev };
        delete newSuggestions[sessionId];
        return newSuggestions;
      });
    }
  };

  const rejectStravaMatch = (sessionId) => {
    setSuggestedActivities(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[sessionId];
      return newSuggestions;
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-AU', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntilRace = () => {
    const today = new Date();
    const raceDate = new Date(trainingPlan.race_date);
    const diffTime = raceDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSessionType = (title) => {
    if (title.toLowerCase().includes('easy')) return 'easy';
    if (title.toLowerCase().includes('long')) return 'long';
    if (title.toLowerCase().includes('tempo')) return 'tempo';
    if (title.toLowerCase().includes('repeat') || title.toLowerCase().includes('interval')) return 'speed';
    if (title.toLowerCase().includes('marathon')) return 'race';
    return 'workout';
  };

  const getSessionColor = (type) => {
    const colors = {
      easy: 'bg-green-900/50 border-green-600 text-green-300',
      long: 'bg-blue-900/50 border-blue-600 text-blue-300',
      tempo: 'bg-orange-900/50 border-orange-600 text-orange-300',
      speed: 'bg-red-900/50 border-red-600 text-red-300',
      race: 'bg-purple-900/50 border-purple-600 text-purple-300',
      workout: 'bg-gray-800 border-gray-600 text-gray-300'
    };
    return colors[type] || colors.workout;
  };

  const getTotalSessions = () => {
    return trainingPlan.weeks.reduce((total, week) => total + week.sessions.length, 0);
  };

  const getCompletedCount = () => {
    return completedSessions.size;
  };

  const formatRunDetails = (details) => {
    // Split by semicolon and clean up each part
    const parts = details.split(';').map(part => part.trim()).filter(part => part.length > 0);
    
    if (parts.length <= 1) {
      return <span className="text-sm">{details}</span>;
    }

    return (
      <div className="text-sm">
        {parts.map((part, index) => (
          <div key={index} className="flex items-start gap-2 mb-1 last:mb-0">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
            <span>{part}</span>
          </div>
        ))}
      </div>
    );
  };

  const getWeatherIcon = (iconType) => {
    switch (iconType) {
      case 'sun':
        return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'cloud':
        return <Cloud className="w-4 h-4 text-gray-400" />;
      case 'rain':
        return <CloudRain className="w-4 h-4 text-blue-400" />;
      default:
        return <Sun className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getWeatherAdvice = (weather, sessionType) => {
    if (!weather) return null;
  
    let advice = [];
  
    // Temperature
    if (weather.temp < 8) advice.push('🧥 Dress warmly - consider layers');
    else if (weather.temp > 20) advice.push('🌡️ Warm conditions - start hydrated');
  
    // Humidity
    if (weather.humidity > 80) advice.push('💧 High humidity - expect to sweat more');
  
    // Wind
    if (weather.windSpeed > 15) advice.push('💨 Windy conditions - adjust pace accordingly');
  
    // Rain
    if (weather.description.toLowerCase().includes('rain')) advice.push('☔ Rain expected - consider indoor backup plan');
  
    // Extra advice based on session type
    if (sessionType === 'long') advice.push('🥤 Bring extra fluids and fuel for long run');
    if (sessionType === 'tempo' || sessionType === 'speed') advice.push('⚡ Warm up properly to avoid injury');
    if (sessionType === 'race') advice.push('🏁 Adjust pace according to conditions on race day');
  
    return advice.length > 0 ? advice : null;
  };

  const getNextSession = () => {
    const today = new Date().toISOString().split('T')[0];
    for (const week of trainingPlan.weeks) {
      for (const session of week.sessions) {
        const sessionId = `${week.week}-${session.date}`;
        if (!completedSessions.has(sessionId) && session.date >= today) {
          return { ...session, week: week.week, sessionId };
        }
      }
    }
    return null;
  };

  const nextSession = getNextSession();
  const nextSessionWeather = nextSession ? weatherData[nextSession.date] : null;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Melbourne Marathon Training</h1>
          <div className="flex justify-center items-center gap-6 text-lg text-gray-300 font-medium flex-wrap">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-white">Goal: {trainingPlan.goal}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-gray-200">{getDaysUntilRace()} days to go</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="text-gray-200">{getCompletedCount()}/{getTotalSessions()} completed</span>
            </div>
            <div className="flex items-center gap-2">
              {stravaConnected ? (
                <span className="text-orange-400 text-sm">🟠 Strava Connected</span>
              ) : (
                <button
                  onClick={connectStrava}
                  className="text-orange-400 hover:text-orange-300 text-sm underline"
                >
                  Connect Strava
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">Training Progress</span>
              <span className="text-sm text-gray-400">
                {Math.round((getCompletedCount() / getTotalSessions()) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(getCompletedCount() / getTotalSessions()) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Next Run Card */}
        {nextSession && (
          <div className="mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Next Run
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-blue-400">{nextSession.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(nextSession.date)} • Week {nextSession.week}
                    </p>
                    {nextSessionWeather && (
                      <div className="text-sm flex items-center gap-2 text-gray-300 bg-gray-700/50 px-3 py-1 rounded">
                        {getWeatherIcon(nextSessionWeather.icon)}
                        <span>{nextSessionWeather.temp}°C</span>
                        {nextSessionWeather.tempMax && nextSessionWeather.tempMin && (
                          <span className="text-xs text-gray-400">({nextSessionWeather.tempMin}-{nextSessionWeather.tempMax}°C)</span>
                        )}
                      </div>
                    )}
                  </div>
                  {nextSessionWeather && (
                    <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                      <Wind className="w-3 h-3" />
                      <span>{nextSessionWeather.windSpeed}km/h • {nextSessionWeather.description}</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-gray-300 text-sm">{formatRunDetails(nextSession.details)}</div>
                  <button
                    onClick={() => toggleSession(nextSession.sessionId)}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium shadow-md"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Week Navigation */}
        <div className="mb-6">
          <div className="flex justify-center gap-2 flex-wrap">
            {trainingPlan.weeks.map((week) => (
              <button
                key={week.week}
                onClick={() => {
                  setCurrentWeek(week.week);
                  // Fetch weather when switching to current week
                  const today = new Date().toISOString().split('T')[0];
                  if (today >= week.start_date && today <= week.end_date) {
                    fetchWeatherForWeek(week);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentWeek === week.week
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Week {week.week}
              </button>
            ))}
          </div>
        </div>

        {/* Current Week Display */}
        {trainingPlan.weeks.map((week) => {
          if (week.week !== currentWeek) return null;
          
          return (
            <div key={week.week} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Week {week.week}
                </h2>
                <span className="text-gray-400">
                  {formatDate(week.start_date)} - {formatDate(week.end_date)}
                </span>
              </div>

              <div className="grid gap-4">
                {week.sessions.map((session, idx) => {
                  const sessionId = `${week.week}-${session.date}`;
                  const isCompleted = completedSessions.has(sessionId);
                  const sessionType = getSessionType(session.title);
                  const isPast = new Date(session.date) < new Date();
                  const weather = weatherData[session.date];
                  const weatherAdvice = getWeatherAdvice(weather, sessionType);

                  return (
                    <div
                      key={idx}
                      className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                        isCompleted
                          ? 'bg-green-900/30 border-green-600'
                          : getSessionColor(sessionType)
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <button
                              onClick={() => toggleSession(sessionId)}
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                isCompleted
                                  ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                                  : 'border-gray-500 hover:border-gray-400 bg-gray-700 hover:bg-gray-600'
                              }`}
                            >
                              {isCompleted && (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <div>
                              <h3 className={`font-semibold ${
                                isCompleted ? 'line-through text-gray-500' : 'text-white'
                              }`}>
                                {session.title}
                              </h3>
                              <div className="flex items-center gap-3">
                                <p className="text-sm flex items-center gap-1 text-gray-400">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(session.date)}
                                  {isPast && !isCompleted && (
                                    <span className="ml-2 text-red-400 text-xs">Overdue</span>
                                  )}
                                </p>
                                {weather && !weatherLoading && (
                                  <div className="text-sm flex items-center gap-2 text-gray-300 bg-gray-700/50 px-2 py-1 rounded">
                                    {getWeatherIcon(weather.icon)}
                                    <span>{weather.temp}°C</span>
                                    {weather.tempMax && weather.tempMin && (
                                      <span className="text-xs text-gray-400">({weather.tempMin}-{weather.tempMax}°C)</span>
                                    )}
                                    <Wind className="w-3 h-3 ml-1" />
                                    <span>{weather.windSpeed}km/h</span>
                                  </div>
                                )}
                                {weatherLoading && (
                                  <div className="text-xs text-gray-500">Loading weather...</div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={`ml-9 ${
                            isCompleted ? 'text-gray-500' : 'text-gray-300'
                          }`}>
                            {formatRunDetails(session.details)}
                            {weatherAdvice && !isCompleted && (
                              <div className="mt-2 p-2 bg-blue-900/20 border border-blue-700/50 rounded text-xs">
                                <div className="text-blue-300 font-medium mb-1">Weather Tips:</div>
                                {weatherAdvice.map((tip, tipIdx) => (
                                  <div key={tipIdx} className="text-blue-200">{tip}</div>
                                ))}
                              </div>
                            )}
                            {/* Strava Integration */}
                            {isCompleted && (
                              <div className="mt-3 pt-2 border-t border-gray-600/50">
                                {/* Strava Match Suggestion */}
                                {suggestedActivities[sessionId] && (
                                  <div className="mb-2 p-2 bg-orange-900/20 border border-orange-700/50 rounded text-xs">
                                    <div className="text-orange-300 font-medium mb-1">
                                      Strava activity found for {formatDate(session.date)}:
                                    </div>
                                    <div className="text-orange-200 mb-2">
                                      "{suggestedActivities[sessionId].activity.name}" 
                                      ({(suggestedActivities[sessionId].activity.distance / 1000).toFixed(1)}km, 
                                      {Math.floor(suggestedActivities[sessionId].activity.moving_time / 60)}min)
                                    </div>
                                    <div className="text-orange-200 mb-2">
                                      Was this your "{session.title}"?
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => acceptStravaMatch(sessionId)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                                      >
                                        Yes, link it
                                      </button>
                                      <button
                                        onClick={() => rejectStravaMatch(sessionId)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                                      >
                                        No
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Existing Strava Link or Add Button */}
                                {!suggestedActivities[sessionId] && (
                                  <>
                                    {stravaActivities[sessionId] ? (
                                      <div className="flex items-center gap-2">
                                        <a
                                          href={stravaActivities[sessionId]}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          View on Strava
                                        </a>
                                        <button
                                          onClick={() => removeStravaActivity(sessionId)}
                                          className="text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : stravaConnected ? (
                                      <button
                                        onClick={() => checkForStravaMatch(sessionId, session.date, session.title)}
                                        className="flex items-center gap-1 text-gray-400 hover:text-orange-400 text-sm transition-colors"
                                      >
                                        <Plus className="w-3 h-3" />
                                        Find Strava activity
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          const url = prompt('Enter Strava activity URL:');
                                          if (url && url.includes('strava.com')) {
                                            addStravaActivity(sessionId, url);
                                          } else if (url) {
                                            alert('Please enter a valid Strava URL');
                                          }
                                        }}
                                        className="flex items-center gap-1 text-gray-400 hover:text-orange-400 text-sm transition-colors"
                                      >
                                        <Plus className="w-3 h-3" />
                                        Add Strava link
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Race Day Card */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🏃‍♂️ Melbourne Marathon</h2>
              <p className="text-purple-100">
                {formatDate(trainingPlan.race_date)} • Target: {trainingPlan.goal}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{getDaysUntilRace()}</div>
              <div className="text-purple-200">days to go</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarathonTracker;