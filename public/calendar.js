document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const currentMonth = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const eventModal = document.getElementById('eventModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const eventForm = document.getElementById('eventForm');
    const eventTitle = document.getElementById('eventTitle');
    const eventDate = document.getElementById('eventDate');

    let today = new Date();
    let currentYear = today.getFullYear();
    let currentMonthIndex = today.getMonth();

    // Close the modal
    closeModal.onclick = () => {
        eventModal.style.display = 'none';
    };

    // Close the modal if user clicks outside of it
    window.onclick = (event) => {
        if (event.target === eventModal) {
            eventModal.style.display = 'none';
        }
    };

    // Show the modal to add an event
    calendar.addEventListener('click', (e) => {
        if (e.target.classList.contains('day')) {
            eventDate.value = e.target.dataset.date;
            eventModal.style.display = 'block';
        }
    });

    // Generate calendar for the current month and year
    const generateCalendar = (year, month) => {
        calendar.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        currentMonth.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

        // Fill in the blanks for days from previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendar.appendChild(document.createElement('div')).classList.add('day');
        }

        // Fill in the days for the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.dataset.date = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            dayDiv.innerText = i;
            calendar.appendChild(dayDiv);
        }
    };

    // Add event to the calendar
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = eventDate.value;
        const title = eventTitle.value;
        if (date && title) {
            const dayDiv = document.querySelector(`.day[data-date='${date}']`);
            if (dayDiv) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = title;
                dayDiv.appendChild(eventDiv);
            }
            eventForm.reset();
            eventModal.style.display = 'none';
        }
    });

    // Navigation
    prevMonthButton.addEventListener('click', () => {
        currentMonthIndex--;
        if (currentMonthIndex < 0) {
            currentMonthIndex = 11;
            currentYear--;
        }
        today = new Date(currentYear, currentMonthIndex);
        generateCalendar(currentYear, currentMonthIndex);
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonthIndex++;
        if (currentMonthIndex > 11) {
            currentMonthIndex = 0;
            currentYear++;
        }
        today = new Date(currentYear, currentMonthIndex);
        generateCalendar(currentYear, currentMonthIndex);
    });

    generateCalendar(currentYear, currentMonthIndex);
});
