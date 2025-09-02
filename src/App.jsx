import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, Target, Trophy, CloudRain, Sun, Cloud, Wind, ExternalLink, Plus, X,PersonStanding, Gauge } from 'lucide-react';

const MarathonTracker = () => {
  const [completedSessions, setCompletedSessions] = useState(new Set());
  const [currentWeek, setCurrentWeek] = useState(1);
  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [stravaActivities, setStravaActivities] = useState({});
  const [stravaAccessToken, setStravaAccessToken] = useState('');
  const [stravaRefreshToken, setStravaRefreshToken] = useState('');
  const [stravaTokenExpiry, setStravaTokenExpiry] = useState(null);
  const [stravaConnected, setStravaConnected] = useState(false);
  const [suggestedActivities, setSuggestedActivities] = useState({});
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [speedUnit, setSpeedUnit] = useState('pace');

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
          "title": "Easy Run",
          "details": "5 km at conversational pace (≤5:15/km). Purpose: aerobic base."
        },
        {
          "date": "2025-08-20",
          "title": "Tempo 5 km",
          "details": "1.5 km warm-up; 5 km at 4:20/km (4:10–4:30/km), 150s walk rest; 1.5 km cool-down. Purpose: threshold endurance."
        },
        {
          "date": "2025-08-22",
          "title": "Tempo 2 km",
          "details": "2 km warm-up; 2 km at 4:10/km (4:00–4:20/km), 120s walk rest; 1 km cool-down. Purpose: introduce threshold intervals."
        },
        {
          "date": "2025-08-24",
          "title": "Long Run",
          "details": "16 km: 4 km easy, 8 km at 4:40/km (marathon pace practice), 4 km easy. Purpose: aerobic endurance and early MP practice. Fuel: gel every 40 min; alternate electrolyte sips every 15–20 min."
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
          "title": "Easy Run",
          "details": "5 km at conversational pace (≤5:15/km). Purpose: recovery and aerobic maintenance."
        },
        {
          "date": "2025-08-27",
          "title": "400 m Repeats",
          "details": "2 km warm-up; 2 sets of 3×400 m @ 3:45/km, 60s walk between reps, 60s between sets; 1.6 km cool-down. Purpose: VO₂ development."
        },
        {
          "date": "2025-08-29",
          "title": "Easy Run",
          "details": "6.5 km conversational pace. Purpose: aerobic recovery."
        },
        {
          "date": "2025-08-31",
          "title": "Long Run",
          "details": "20 km at conversational pace. Purpose: aerobic endurance. Fuel: gel every 40 min; alternate electrolyte sips every 15–20 min."
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
          "title": "Easy Run + Strides",
          "details": "6–8 km easy + 6×15–20s strides with walk back. Purpose: aerobic recovery and leg turnover."
        },
        {
          "date": "2025-09-03",
          "title": "VO₂ Repeats",
          "details": "2 km warm-up; 5×3 min @ 3:58–4:02/km with 2 min easy jog recovery; 2 km cool-down. Purpose: increase VO₂ max and speed endurance."
        },
        {
          "date": "2025-09-05",
          "title": "Threshold Tempo",
          "details": "2 km warm-up; 20–25 min continuous @ 4:18–4:22/km; 2 km cool-down. Purpose: lactate threshold improvement."
        },
        {
          "date": "2025-09-07",
          "title": "Long Run with MP Finish",
          "details": "22–24 km: first 16–18 km easy; last 6–8 km steady at ~5:00–5:10/km. Purpose: aerobic endurance + MP adaptation. Fuel: gel every 40 min; alternate electrolyte sips every 15–20 min."
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
          "title": "Easy Run",
          "details": "8–10 km conversational pace. Purpose: recovery and aerobic maintenance."
        },
        {
          "date": "2025-09-11",
          "title": "Marathon Pace Tempo",
          "details": "2 km warm-up; 10–12 km @ 4:46/km; 2 km cool-down. Purpose: MP familiarity and endurance. Fuel: gel every 40 min; alternate electrolyte sips every 15–20 min."
        },
        {
          "date": "2025-09-13",
          "title": "Recovery Run",
          "details": "6–8 km very easy pace. Purpose: active recovery."
        },
        {
          "date": "2025-09-14",
          "title": "Long Run with MP Blocks",
          "details": "28–30 km: 8–10 km easy; 2×6–8 km @ 4:46/km with 10 min easy jog between; finish easy. Purpose: peak long run adaptation. Fuel: gel every 40 min; alternate electrolyte sips every 15–20 min."
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
          "title": "Easy Run + Strides",
          "details": "8–10 km easy + 6×20s strides. Purpose: recovery + leg turnover."
        },
        {
          "date": "2025-09-18",
          "title": "Threshold Cruise Intervals",
          "details": "2 km warm-up; 3×2 km @ 4:18–4:22/km with 2 min jog recovery; 2 km cool-down. Purpose: improve lactate threshold and tempo endurance."
        },
        {
          "date": "2025-09-21",
          "title": "Peak Long Run",
          "details": "32 km: 18–20 km easy; 10–12 km @ 4:46/km; finish 2–4 km easy. Purpose: peak endurance + fueling practice. Fuel: gel every 40 min; alternate electrolyte sips every 15–20 min."
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
          "title": "Easy Run",
          "details": "8 km easy pace. Purpose: recovery and aerobic base."
        },
        {
          "date": "2025-09-25",
          "title": "Marathon Pace Economy",
          "details": "2 km warm-up; 8–10 km @ 4:46/km; 2 km cool-down. Purpose: consolidate MP efficiency. Fuel: gel every 40 min; alternate electrolyte sips every 15–20 min."
        },
        {
          "date": "2025-09-28",
          "title": "Long Run with Steady Segment",
          "details": "20–22 km mostly easy; include 6–8 km steady (~5:00/km) in the middle. Purpose: aerobic endurance + MP prep. Fuel: gel every 40 min; alternate electrolyte sips every 15–20 min."
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
          "title": "Easy Run + Strides",
          "details": "6–8 km easy pace + 6 strides. Purpose: recovery + neuromuscular prep."
        },
        {
          "date": "2025-10-01",
          "title": "VO₂ Touch",
          "details": "2 km warm-up; 4×3 min @ 3:58–4:02/km with 2 min jog; 2 km cool-down. Purpose: maintain VO₂ adaptation during taper."
        },
        {
          "date": "2025-10-04",
          "title": "Marathon Pace Rehearsal",
          "details": "8–10 km easy with 5 km @ 4:46/km in the middle. Purpose: sharpen pacing, practice fueling. Fuel: gel every 40 min; alternate electrolyte sips every 15–20 min."
        },
        {
          "date": "2025-10-05",
          "title": "Easy Run",
          "details": "Optional 6–8 km recovery jog if feeling good. Purpose: taper recovery."
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
          "title": "Easy Run + Strides",
          "details": "6–7 km easy + 6×15s strides. Purpose: final taper and leg turnover."
        },
        {
          "date": "2025-10-09",
          "title": "Sharpening Intervals",
          "details": "5–6 km easy with 3×1 km @ 4:46/km, 2 min jog between. Purpose: keep legs sharp without fatigue."
        },
        {
          "date": "2025-10-11",
          "title": "Shakeout",
          "details": "20–30 min very easy with a few 10–15s strides. Purpose: loosen legs and maintain rhythm."
        },
        {
          "date": "2025-10-12",
          "title": "Melbourne Marathon",
          "details": "42.2 km @ ~4:46/km. Target finish ~3:21. Fuel: 1 gel every 35–40 min; alternate water/electrolyte sips every 15–20 min. Purpose: execute goal pace, even splits, and tested fueling strategy."
        }
      ]
    }
  ]
};

  // --- SWIPE NAVIGATION HANDLERS ---
  const minSwipeDistance = 50; 
  const handleTouchStart = (e) => {
      setTouchEndX(null); // otherwise the swipe is fired even with a single touch
      setTouchStartX(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => setTouchEndX(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
      if (!touchStartX || !touchEndX) return;
      const distance = touchStartX - touchEndX;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      if (isLeftSwipe) {
          setCurrentWeek(prev => Math.min(prev + 1, trainingPlan.weeks.length));
      } else if (isRightSwipe) {
          setCurrentWeek(prev => Math.max(prev - 1, 1));
      }
  };

  const refreshStravaToken = async (refreshToken) => {
    const clientId = localStorage.getItem('strava-client-id');
    const clientSecret = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
  
    if (!clientId || !clientSecret) {
      setStravaConnected(false);
      return;
    }
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        })
      });
  
      const data = await response.json();
  
      if (data.access_token) {
        setStravaAccessToken(data.access_token);
        setStravaRefreshToken(data.refresh_token);
        setStravaTokenExpiry(data.expires_at);
        setStravaConnected(true);
  
        localStorage.setItem('strava-access-token', data.access_token);
        localStorage.setItem('strava-refresh-token', data.refresh_token);
        localStorage.setItem('strava-token-expiry', data.expires_at.toString());
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('strava-access-token');
      localStorage.removeItem('strava-refresh-token');
      localStorage.removeItem('strava-token-expiry');
      setStravaConnected(false);
    }
  };


 useEffect(() => {
    const saved = localStorage.getItem('marathon-completed-sessions');
    if (saved) {
      setCompletedSessions(new Set(JSON.parse(saved)));
    }
    
    const savedStrava = localStorage.getItem('marathon-strava-activities');
    if (savedStrava) {
      setStravaActivities(JSON.parse(savedStrava));
    }

    const tokenFromStorage = localStorage.getItem('strava-access-token');
    const refreshToken = localStorage.getItem('strava-refresh-token');
    const expiryTime = localStorage.getItem('strava-token-expiry');

    if (tokenFromStorage && refreshToken && expiryTime) {
      const now = Math.floor(Date.now() / 1000);
      const expiry = parseInt(expiryTime);

      if (now < expiry) {
        // Token is still valid
        setStravaAccessToken(tokenFromStorage);
        setStravaRefreshToken(refreshToken);
        setStravaTokenExpiry(expiry);
        setStravaConnected(true);
      } else {
        // Token expired, try to refresh
        refreshStravaToken(refreshToken);
      }
    }
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const week = trainingPlan.weeks.find(w => 
      today >= w.start_date && today <= w.end_date
    );
    if (week) {
      setCurrentWeek(week.week);
      fetchWeatherForWeek(week);
    } else {
      // If no current week is found (e.g., plan is in the future), default to week 1
      setCurrentWeek(1);
      fetchWeatherForWeek(trainingPlan.weeks[0]);
    }
  }, []);

  const fetchWeatherForWeek = async (week) => {
    if (!week) return;
    
    setWeatherLoading(true);
    const newWeatherData = {};
    
    try {
      const lat = -37.8136;
      const lon = 144.9631;
      const sessionDates = week.sessions.map(s => s.date);
      const startDate = sessionDates[0];
      const endDate = sessionDates[sessionDates.length - 1];
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode&timezone=Australia/Melbourne&start_date=${startDate}&end_date=${endDate}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        const getWeatherInfo = (code) => {
          if (code <= 3) return { description: 'Clear/Partly cloudy', icon: 'sun' };
          if (code <= 48) return { description: 'Cloudy/Foggy', icon: 'cloud' };
          if (code <= 67) return { description: 'Light rain', icon: 'rain' };
          if (code <= 82) return { description: 'Rain showers', icon: 'rain' };
          if (code <= 99) return { description: 'Thunderstorms', icon: 'rain' };
          return { description: 'Clear', icon: 'sun' };
        };
        
        week.sessions.forEach((session) => {
          if (data.daily && data.daily.time) {
            const sessionDateIndex = data.daily.time.findIndex(date => date === session.date);
            
            if (sessionDateIndex !== -1) {
              const weatherInfo = getWeatherInfo(data.daily.weathercode[sessionDateIndex]);
              newWeatherData[session.date] = {
                temp: Math.round(data.daily.temperature_2m_max[sessionDateIndex]),
                icon: weatherInfo.icon,
              };
            }
          }
        });
      }
      
      setWeatherData(newWeatherData);
    } catch (error) {
      console.error('Weather fetch error:', error);
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
   if (stravaConnected) {
     const dashIndex = sessionId.indexOf('-');
     const weekNum = sessionId.substring(0, dashIndex);
     const date = sessionId.substring(dashIndex + 1);
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

  const connectStrava = () => {
    const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_CLIENT_ID') {
        alert('Please configure your Strava Client ID at the top of the component file.');
        return;
    };
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
    const clientSecret = import.meta.env.VITE_STRAVA_CLIENT_SECRET; 
    if (code && clientId) {
      if (!clientSecret || clientSecret === 'YOUR_CLIENT_SECRET') return;
      try {
        const response = await fetch('https://www.strava.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
          setStravaRefreshToken(data.refresh_token);
          setStravaTokenExpiry(data.expires_at);
          setStravaConnected(true);
    
          localStorage.setItem('strava-access-token', data.access_token);
          localStorage.setItem('strava-refresh-token', data.refresh_token);
          localStorage.setItem('strava-token-expiry', data.expires_at.toString());
    
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error('Strava auth error:', error);
        alert('Failed to connect to Strava. Please try again.');
      }
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code') && !stravaConnected) {
      handleStravaCallback();
    }else if(!stravaConnected)connectStrava();
  }, []);

  const fetchStravaActivitiesForDate = async (date) => {
    if (!stravaAccessToken) return [];
  
    // Check if token is about to expire (within 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    if (stravaTokenExpiry && now > stravaTokenExpiry - 300) {
      await refreshStravaToken(stravaRefreshToken);
    }
  
    try {
      const startOfDay = new Date(date + 'T00:00:00').getTime() / 1000;
      const endOfDay = new Date(date + 'T23:59:59').getTime() / 1000;
      const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?after=${startOfDay}&before=${endOfDay}&per_page=10`,
        { headers: { 'Authorization': `Bearer ${stravaAccessToken}` } }
      );
  
      if (response.status === 401) {
        // Token is invalid, try to refresh
        await refreshStravaToken(stravaRefreshToken);
        return [];
      }
  
      if (response.ok) return await response.json();
    } catch (error) {
      console.error('Error fetching Strava activities:', error);
    }
    return [];
  };

  const checkForStravaMatch = async (sessionId, sessionDate, sessionTitle) => {
    if (!stravaConnected || stravaActivities[sessionId]) return;
    const activities = await fetchStravaActivitiesForDate(sessionDate);
    if (activities.length > 0) {
      const runningActivities = activities.filter(activity => activity.type === 'Run' || activity.sport_type === 'Run');
      if (runningActivities.length === 1) {
        const activity = runningActivities[0];
        setSuggestedActivities(prev => ({ ...prev, [sessionId]: { activity, sessionTitle, sessionDate } }));
      } else if (runningActivities.length > 1) {
        const activityList = runningActivities.map((a, i) => `${i + 1}. ${a.name} (${(a.distance / 1000).toFixed(1)}km, ${Math.floor(a.moving_time / 60)}min)`).join('\n');
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
    return date.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getDaysUntilRace = () => {
    const today = new Date();
    const raceDate = new Date(trainingPlan.race_date);
    const diffTime = raceDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

  const getTotalSessions = () => trainingPlan.weeks.reduce((total, week) => total + week.sessions.length, 0);
  const getCompletedCount = () => completedSessions.size;

    const convertPaceToKph = (pace) => {
    const parts = pace.split(':');
    if (parts.length !== 2) return null;
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds)) return null;
    
    const totalSecondsPerKm = minutes * 60 + seconds;
    if (totalSecondsPerKm === 0) return "∞"; // Avoid division by zero
    
    const kph = 3600 / totalSecondsPerKm;
    return kph.toFixed(1);
  };

  const formatSessionDetails = (details) => {
    let formattedDetails = details;

    if (speedUnit === 'speed') {
      // Regex to find all MM:SS patterns (e.g., 4:46, 5:15)
      formattedDetails = details.replace(/\b(\d{1,2}):(\d{2})\b/g, (match) => {
        const kph = convertPaceToKph(match);
        return kph ? kph : match; // Return kph or original match if conversion fails
      });

      // Replace units and keywords
      formattedDetails = formattedDetails.replace(/(\/km)/g, ' km/h');
      formattedDetails = formattedDetails.replace(/pace/gi, 'speed');
      formattedDetails = formattedDetails.replace(/MP/g, 'MS'); // Marathon Pace -> Marathon Speed
    }
    
    // Pass the potentially modified string to the original formatter for layout
    return formatRunDetails(formattedDetails);
  };

  const formatRunDetails = (details) => {
    const parts = details.split(';').map(part => part.trim()).filter(part => part.length > 0);
    if (parts.length <= 1) return <span className="text-sm">{details}</span>;
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
      case 'sun': return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'cloud': return <Cloud className="w-4 h-4 text-gray-400" />;
      case 'rain': return <CloudRain className="w-4 h-4 text-blue-400" />;
      default: return <Sun className="w-4 h-4 text-yellow-400" />;
    }
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
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-3">Melbourne Marathon Training</h1>
          <div className="flex flex-col md:flex-row justify-center items-center gap-x-4 gap-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2"><Target className="w-4 h-4 text-blue-400" /><span className="font-semibold text-white">Goal: {trainingPlan.goal}</span></div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-green-400" /><span>{getDaysUntilRace()} days to go</span></div>
            <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-purple-400" /><span>{getCompletedCount()}/{getTotalSessions()} done</span></div>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setSpeedUnit(prev => prev === 'pace' ? 'speed' : 'pace')}
              className="flex items-center gap-2 bg-gray-700/80 hover:bg-gray-700 border border-gray-600/50 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              {speedUnit === 'pace' ? <PersonStanding className="w-4 h-4" /> : <Gauge className="w-4 h-4" />}
              <span>{speedUnit === 'pace' ? 'Pace (/km)' : 'Speed (km/h)'}</span>
            </button>
          </div>
        </div>



        <div className="mb-6 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Progress</span>
                <span className="text-sm text-gray-400">{Math.round((getCompletedCount() / getTotalSessions()) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" style={{ width: `${(getCompletedCount() / getTotalSessions()) * 100}%` }}></div>
            </div>
            <div className="text-center mt-3">
              {stravaConnected ? (
                <span className={'text-xs transition-colors duration-500 text-green-400 font-bold'
                }>
                    🟢 Strava Connected
                </span>
              ) : (
                <button onClick={connectStrava} className="text-orange-400 hover:text-orange-300 text-xs underline">Connect Strava</button>
              )}
            </div>
        </div>

        {nextSession && (
          <div className="mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg border-l-4 border-blue-500">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Clock className="w-5 h-5" />Next Run</h2>
              <div>
                <h3 className="font-semibold text-md text-blue-400">{nextSession.title}</h3>
                <div className="flex items-center gap-3 my-1 text-sm text-gray-400">
                    <p className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(nextSession.date)}</p>
                    {nextSessionWeather && (
                        <div className="flex items-center gap-2 bg-gray-700/50 px-2 py-0.5 rounded">
                            {getWeatherIcon(nextSessionWeather.icon)}
                            <span>{nextSessionWeather.temp}°C</span>
                        </div>
                    )}
                </div>
                <div className="text-gray-300 text-sm mb-3">{formatSessionDetails(nextSession.details)}</div>
                <button onClick={() => toggleSession(nextSession.sessionId)} className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium">
                    <CheckCircle className="w-4 h-4" />Mark Complete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-center gap-1.5 flex-wrap">
            {trainingPlan.weeks.map((week) => (
              <button key={week.week} onClick={() => {
                setCurrentWeek(week.week);
                fetchWeatherForWeek(week);
              }} className={`px-3 py-1.5 text-sm rounded-md font-medium ${currentWeek === week.week ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                W{week.week}
              </button>
            ))}
          </div>
        </div>
        
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {trainingPlan.weeks.map((week) => {
              if (week.week !== currentWeek) return null;
              return (
                <div key={week.week} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Week {week.week}</h2>
                    <span className="text-sm text-gray-400">{formatDate(week.start_date).split(', ')[1]} - {formatDate(week.end_date).split(', ')[1]}</span>
                  </div>
                  <div className="grid gap-3">
                    {week.sessions.map((session, idx) => {
                      const sessionId = `${week.week}-${session.date}`;
                      const isCompleted = completedSessions.has(sessionId);
                      const sessionType = getSessionType(session.title);
                      const isPast = new Date(session.date) < new Date(new Date().toDateString());
                      const weather = weatherData[session.date];

                      return (
                        <div key={idx} className={`border rounded-lg p-3 transition-all duration-200 ${isCompleted ? 'bg-green-900/30 border-green-700/60' : getSessionColor(sessionType)}`}>
                          <div className="flex items-start gap-3">
                              <button onClick={() => toggleSession(sessionId)} className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-500 bg-gray-700'}`}>
                                {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                              </button>
                            <div className="flex-1">
                              <h3 className={`font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>{session.title}</h3>
                              <div className="flex items-center gap-3 my-1">
                                <p className="text-sm flex items-center gap-1.5 text-gray-400">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(session.date)}
                                  {isPast && !isCompleted && <span className="ml-2 text-red-400 text-xs font-bold">Overdue</span>}
                                </p>
                                {weather && !weatherLoading && (
                                  <div className="text-sm flex items-center gap-1.5 bg-gray-700/50 px-2 py-0.5 rounded">
                                    {getWeatherIcon(weather.icon)}
                                    <span>{weather.temp}°C</span>
                                  </div>
                                )}
                              </div>
                              <div className={`text-sm ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                                {formatSessionDetails(session.details)}
                                {isCompleted && (
                                 <div className="mt-2 pt-2 border-t border-gray-600/50">
                                    
                                    {suggestedActivities[sessionId] && (
                                      <div className="p-2 bg-orange-900/30 border border-orange-700/50 rounded text-xs">
                                        <div className="text-orange-200 mb-2">Link Strava activity: "{suggestedActivities[sessionId].activity.name}"?</div>
                                        <div className="flex gap-2">
                                          <button onClick={() => acceptStravaMatch(sessionId)} className="bg-green-600 text-white px-2 py-1 rounded">Yes</button>
                                          <button onClick={() => rejectStravaMatch(sessionId)} className="bg-gray-600 text-white px-2 py-1 rounded">No</button>
                                        </div>
                                      </div>
                                    )}

                                    {!suggestedActivities[sessionId] && (
                                      stravaActivities[sessionId] ? (
                                        <div className="flex items-center gap-2">
                                          <a href={stravaActivities[sessionId]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm">
                                            <ExternalLink className="w-3 h-3" /> View on Strava
                                          </a>
                                          <button onClick={() => removeStravaActivity(sessionId)} className="text-gray-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                                        </div>
                                      ) :  (
                                        <button onClick={() => {
                                          const url = prompt('Enter Strava activity URL:');
                                          if (url && url.includes('strava.com')) addStravaActivity(sessionId, url);
                                          else if (url) alert('Please enter a valid Strava URL');
                                        }} className="flex items-center gap-1 text-gray-400 hover:text-orange-400 text-sm">
                                          <Plus className="w-3 h-3" /> Add Strava link
                                        </button>
                                        
                                      ) 
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
        </div>
        
        <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">🏃‍♂️ Melbourne Marathon</h2>
              <p className="text-sm text-purple-100">{formatDate(trainingPlan.race_date)} • Target: {trainingPlan.goal}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{getDaysUntilRace()}</div>
              <div className="text-sm text-purple-200">days</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarathonTracker;

