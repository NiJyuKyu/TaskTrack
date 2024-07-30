document.addEventListener('DOMContentLoaded', function() {
    const calendarBody = document.getElementById('calendar-body');
    const monthYear = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const addEventBtn = document.getElementById('add-event-btn');
    const eventPopup = document.getElementById('event-popup');
    const addEventPopup = document.getElementById('add-event-popup');
    const closePopups = document.querySelectorAll('.close');
    const eventForm = document.getElementById('eventForm');
    const eventsList = document.getElementById('events');
    const saveEventButton = document.getElementById('save-event-btn');
    const popupDate = document.getElementById('popup-date');
    const popupEvents = document.getElementById('popup-events');

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
                generateCalendar(currentDate);
                updateEventsList();
            })
            .catch(error => console.error('Error:', error));
    }

    function generateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        calendarBody.innerHTML = '';

        let dayCounter = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay.getDay()) {
                    row.appendChild(document.createElement('td'));
                } else if (dayCounter > lastDay.getDate()) {
                    break;
                } else {
                    const cell = document.createElement('td');
                    cell.textContent = dayCounter;
                    if (dayCounter === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                        cell.classList.add('current-day');
                    }
                    const eventDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
                    const dayEvents = events[eventDate] || [];
                    if (dayEvents.length > 0) {
                        cell.classList.add('has-event');
                        const eventDiv = document.createElement('div');
                        eventDiv.classList.add('event-title');
                        eventDiv.textContent = dayEvents[0].title;
                        cell.appendChild(eventDiv);
                        cell.addEventListener('click', () => showEventPopup(eventDate));
                    }
                    row.appendChild(cell);
                    dayCounter++;
                }
            }
            calendarBody.appendChild(row);
        }
    }

    function updateEventsList() {
        eventsList.innerHTML = '';
        for (const date in events) {
            events[date].forEach(event => {
                const li = document.createElement('li');
                li.textContent = `${date}: ${event.title}`;
                
                // Create edit and delete buttons dynamically
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.onclick = () => editEvent(date, event._id);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => deleteEvent(date, event._id);

                li.appendChild(editBtn);
                li.appendChild(deleteBtn);
                
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
                    
                `;
                popupEvents.appendChild(eventDiv);
            });
        } else {
            popupEvents.textContent = 'No events for this date.';
        }
        eventPopup.style.display = 'block';
    }

    function editEvent(date, eventId) {
        const event = events[date].find(e => e._id === eventId);
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-date').value = date;
        document.getElementById('event-id').value = eventId;
        addEventPopup.style.display = 'block';
    }

    function deleteEvent(date, eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            fetch(`/events/${eventId}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    events[date] = events[date].filter(e => e._id !== eventId);
                    generateCalendar(currentDate);
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
        const eventIdInput = document.getElementById('event-id');
        const eventTitleInput = document.getElementById('event-title');
        const eventDateInput = document.getElementById('event-date');
    
        // Debugging: Check if elements are null
        console.log('Event ID Input:', eventIdInput);
        console.log('Event Title Input:', eventTitleInput);
        console.log('Event Date Input:', eventDateInput);
    
        if (eventIdInput && eventTitleInput && eventDateInput) {
            eventIdInput.value = '';
            eventForm.reset();
            addEventPopup.style.display = 'block';
        } else {
            console.error('One or more elements are missing');
        }
    }
    

    saveEventButton.onclick = function(e) {
        e.preventDefault();
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const eventId = document.getElementById('event-id').value;

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

    fetchEvents();

    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });
});
