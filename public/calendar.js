document.addEventListener('DOMContentLoaded', function() {
    const calendarBody = document.getElementById('calendar-body');
    const monthYear = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const eventForm = document.getElementById('eventForm');
    const eventsList = document.getElementById('events');
    const eventPopup = document.getElementById('event-popup');
    const addEventPopup = document.getElementById('add-event-popup');
    const popupDate = document.getElementById('popup-date');
    const popupEvents = document.getElementById('popup-events');
    const closePopups = document.querySelectorAll('.close');
    const addEventBtn = document.getElementById('add-event-btn');
    const saveEventButton = document.getElementById('save-event-btn');

    let currentDate = new Date();
    let events = {};

    function fetchEvents() {
        fetch('/events')
            .then(response => response.json())
            .then(data => {
                events = data.reduce((acc, event) => {
                    const date = new Date(event.date).toISOString().split('T')[0];
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(event);
                    return acc;
                }, {});
                generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
                updateEventsList();
            })
            .catch(error => console.error('Error:', error));
    }

    function generateCalendar(year, month) {
        // Your existing generateCalendar function here
    }

    function updateEventsList() {
        eventsList.innerHTML = '';
        for (const date in events) {
            events[date].forEach(event => {
                const li = document.createElement('li');
                li.textContent = `${date}: ${event.title}`;
                eventsList.appendChild(li);
            });
        }
    }

    function showEventPopup(date) {
        popupDate.textContent = new Date(date).toDateString();
        popupEvents.innerHTML = '';
        if (events[date]) {
            events[date].forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.innerHTML = `
                    <p>${event.title}</p>
                    <button onclick="editEvent('${date}', '${event._id}')">Edit</button>
                    <button onclick="deleteEvent('${date}', '${event._id}')">Delete</button>
                `;
                popupEvents.appendChild(eventDiv);
            });
        } else {
            popupEvents.textContent = 'No events for this date.';
        }
        eventPopup.style.display = 'block';
    }

    function editEvent(date, eventId) {
        // Populate form with event details
        const event = events[date].find(e => e._id === eventId);
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = date;
        document.getElementById('eventId').value = eventId;
        addEventPopup.style.display = 'block';
    }

    function deleteEvent(date, eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            fetch(`/events/${eventId}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    events[date] = events[date].filter(e => e._id !== eventId);
                    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
                    updateEventsList();
                    eventPopup.style.display = 'none';
                })
                .catch(error => console.error('Error:', error));
        }
    }

    closePopups.forEach(closeBtn => {
        closeBtn.onclick = function() {
            eventPopup.style.display = 'none';
            addEventPopup.style.display = 'none';
        }
    });

    window.onclick = function(event) {
        if (event.target == eventPopup || event.target == addEventPopup) {
            eventPopup.style.display = 'none';
            addEventPopup.style.display = 'none';
        }
    }

    addEventBtn.onclick = function() {
        document.getElementById('eventId').value = '';
        eventForm.reset();
        addEventPopup.style.display = 'block';
    }

    saveEventButton.onclick = function(e) {
        e.preventDefault();
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const eventId = document.getElementById('eventId').value;

        const method = eventId ? 'PUT' : 'POST';
        const url = eventId ? `/events/${eventId}` : '/events';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, date }),
        })
            .then(response => response.json())
            .then(data => {
                fetchEvents();
                addEventPopup.style.display = 'none';
            })
            .catch(error => console.error('Error:', error));
    };

    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    fetchEvents();

    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
});